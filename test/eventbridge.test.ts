import {
  App, Aspects, Duration, Stack,
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as actions,
  aws_events as events,
  aws_sns as sns,
} from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as alarms from '../src/eventbridge';

const staticAlarms = [
  alarms.EventBridgeRuleFailedInvocationsAlarm,
  alarms.EventBridgeRuleInvocationsSentToDlqAlarm,
  alarms.EventBridgeRuleThrottledRulesAlarm,
  alarms.EventBridgeRuleIngestionToInvocationSuccessLatencyAlarm,
  alarms.EventBridgeRuleSuccessfulInvocationRateAlarm,
];
const anomalyAlarms = [
  alarms.EventBridgeRuleTriggeredRulesAnomalyAlarm,
  alarms.EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarm,
];
const optionalAlarms: alarms.EventBridgeRuleRecommendedAlarmsConfig = {
  configIngestionToInvocationSuccessLatencyAlarm: { threshold: 5000 },
  configSuccessfulInvocationRateAlarm: { threshold: 0.99 },
  configTriggeredRulesAnomalyAlarm: {},
  configIngestionToInvocationSuccessLatencyAnomalyAlarm: {},
};

function stack(): Stack {
  return new Stack(new App(), 'Test', { env: { account: '123456789012', region: 'us-east-1' } });
}

function rule(scope: Stack, eventBus?: events.IEventBus): events.Rule {
  return new events.Rule(scope, 'Rule', { ruleName: 'test-rule', eventBus, eventPattern: { source: ['test.source'] } });
}

test('default rule bundle includes delivery and anomaly alarms', () => {
  const scope = stack();
  const bundle = new alarms.EventBridgeRuleRecommendedAlarms(scope, 'Alarms', { rule: rule(scope) });
  const template = Template.fromStack(scope);
  expect(template.toJSON()).toMatchSnapshot();
  template.resourceCountIs('AWS::CloudWatch::Alarm', 5);
  template.hasResourceProperties('AWS::CloudWatch::Alarm', {
    MetricName: 'FailedInvocations',
    Namespace: 'AWS/Events',
    Statistic: 'Sum',
    Threshold: 0,
    EvaluationPeriods: 1,
    DatapointsToAlarm: 1,
    TreatMissingData: 'notBreaching',
    Dimensions: [{ Name: 'RuleName', Value: { Ref: 'Rule4C995B7F' } }],
  });
  expect(bundle.alarmTriggeredRulesAnomaly).toBeDefined();
  expect(bundle.alarmIngestionToInvocationSuccessLatencyAnomaly).toBeDefined();
  expect(bundle.alarmIngestionToInvocationSuccessLatency).toBeUndefined();
  expect(bundle.alarmSuccessfulInvocationRate).toBeUndefined();
});

test('custom bus dimensions use the bus and the unprefixed rule name', () => {
  const scope = stack();
  const bus = new events.EventBus(scope, 'Bus', { eventBusName: 'test-bus' });
  new alarms.EventBridgeRuleRecommendedAlarms(scope, 'Alarms', { rule: rule(scope, bus), ...optionalAlarms });
  const template = Template.fromStack(scope);
  expect(template.toJSON()).toMatchSnapshot();
  template.resourceCountIs('AWS::CloudWatch::Alarm', 7);
  template.hasResourceProperties('AWS::CloudWatch::Alarm', {
    MetricName: 'FailedInvocations',
    Dimensions: Match.arrayWith([{ Name: 'EventBusName', Value: { Ref: 'BusEA82B648' } }]),
  });
  template.hasResourceProperties('AWS::CloudWatch::Alarm', {
    ComparisonOperator: 'LessThanThreshold',
    Metrics: Match.arrayWith([{ Expression: 'successful / attempts', Id: 'expr_1', ReturnData: true }]),
  });
  template.hasResourceProperties('AWS::CloudWatch::Alarm', {
    ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
    Metrics: Match.arrayWith([Match.objectLike({
      MetricStat: Match.objectLike({
        Stat: 'Sum',
        Period: 300,
        Metric: Match.objectLike({ MetricName: 'TriggeredRules' }),
      }),
    })]),
  });
});

test.each([false, true])('imported rules select the correct dimension set (custom bus: %s)', custom => {
  const scope = stack();
  const imported = events.Rule.fromEventRuleArn(scope, 'Imported',
    `arn:aws:events:us-east-1:123456789012:rule/${custom ? 'test-bus/' : ''}test-rule`);
  const bus = events.EventBus.fromEventBusName(scope, 'Bus', custom ? 'test-bus' : 'default');
  const alarm = new alarms.EventBridgeRuleFailedInvocationsAlarm(scope, 'Alarm', { rule: imported, eventBus: bus });
  expect(scope.resolve(alarm.metric.toMetricConfig().metricStat?.dimensions)).toEqual(custom
    ? [{ name: 'EventBusName', value: 'test-bus' }, { name: 'RuleName', value: 'test-rule' }]
    : [{ name: 'RuleName', value: 'test-rule' }]);
});

test.each([false, true])('imported rule ARNs infer the event bus when none is supplied (%s)', custom => {
  const scope = stack();
  const imported = events.Rule.fromEventRuleArn(scope, 'Imported',
    `arn:aws:events:us-east-1:123456789012:rule/${custom ? 'test-bus/' : ''}test-rule`);
  const alarm = new alarms.EventBridgeRuleFailedInvocationsAlarm(scope, 'Alarm', { rule: imported });
  expect(scope.resolve(alarm.metric.toMetricConfig().metricStat?.dimensions)).toEqual(custom
    ? [{ name: 'EventBusName', value: 'test-bus' }, { name: 'RuleName', value: 'test-rule' }]
    : [{ name: 'RuleName', value: 'test-rule' }]);
});

test('individual static and anomaly alarms honor configuration and all three actions', () => {
  const scope = stack();
  const monitored = rule(scope);
  const action = new actions.SnsAction(new sns.Topic(scope, 'Topic'));
  for (const [i, Alarm] of [...staticAlarms, ...anomalyAlarms].entries()) {
    new Alarm(scope, `Alarm${i}`, {
      rule: monitored,
      threshold: 0.99,
      period: Duration.minutes(2),
      stdDevs: 3,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
      alarmName: `custom-${i}`,
      alarmDescription: 'custom description',
      treatMissingData: cloudwatch.TreatMissingData.IGNORE,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_LOWER_THRESHOLD,
      alarmAction: action,
      okAction: action,
      insufficientDataAction: action,
    });
  }
  const template = Template.fromStack(scope);
  expect(template.toJSON()).toMatchSnapshot();
  template.allResourcesProperties('AWS::CloudWatch::Alarm', {
    AlarmDescription: 'custom description',
    EvaluationPeriods: 3,
    DatapointsToAlarm: 2,
    TreatMissingData: 'ignore',
    AlarmActions: Match.anyValue(),
    OKActions: Match.anyValue(),
    InsufficientDataActions: Match.anyValue(),
  });
});

test.each([...staticAlarms, ...anomalyAlarms])('%p rejects an evaluation window longer than one day', Alarm => {
  const scope = stack();
  expect(() => new Alarm(scope, 'Alarm', {
    rule: rule(scope), threshold: 0.99, period: Duration.days(2), evaluationPeriods: 500,
  })).toThrow('exceeds one day');
});

test('bundle defaults are applied unless an individual action or missing-data setting overrides them', () => {
  const scope = stack();
  const monitored = rule(scope);
  const defaults = new actions.SnsAction(new sns.Topic(scope, 'DefaultTopic'));
  const override = new actions.SnsAction(new sns.Topic(scope, 'OverrideTopic'));
  const config = {
    alarmAction: override,
    okAction: override,
    insufficientDataAction: override,
    treatMissingData: cloudwatch.TreatMissingData.IGNORE,
  };
  new alarms.EventBridgeRuleRecommendedAlarms(scope, 'Defaults', {
    rule: monitored,
    ...optionalAlarms,
    defaultAlarmAction: defaults,
    defaultOkAction: defaults,
    defaultInsufficientDataAction: defaults,
    treatMissingData: cloudwatch.TreatMissingData.BREACHING,
  });
  new alarms.EventBridgeRuleRecommendedAlarms(scope, 'Overrides', {
    rule: new events.Rule(scope, 'OtherRule', { eventPattern: { source: ['test.source'] } }),
    defaultAlarmAction: defaults,
    defaultOkAction: defaults,
    defaultInsufficientDataAction: defaults,
    treatMissingData: cloudwatch.TreatMissingData.BREACHING,
    configFailedInvocationsAlarm: config,
    configInvocationsSentToDlqAlarm: config,
    configThrottledRulesAlarm: config,
    configIngestionToInvocationSuccessLatencyAlarm: { ...config, threshold: 5000 },
    configSuccessfulInvocationRateAlarm: { ...config, threshold: 0.99 },
    configTriggeredRulesAnomalyAlarm: config,
    configIngestionToInvocationSuccessLatencyAnomalyAlarm: config,
  });
  const template = Template.fromStack(scope);
  template.resourceCountIs('AWS::CloudWatch::Alarm', 14);
  expect(Object.values(template.findResources('AWS::CloudWatch::Alarm')).filter(r => r.Properties.TreatMissingData === 'ignore')).toHaveLength(7);
  expect(template.toJSON()).toMatchSnapshot();
});

test('default rule anomaly alarms can be excluded without configuration', () => {
  const scope = stack();
  const bundle = new alarms.EventBridgeRuleRecommendedAlarms(scope, 'Alarms', {
    rule: rule(scope),
    excludeAlarms: [
      alarms.EventBridgeRecommendedAlarmsMetrics.TRIGGERED_RULES_ANOMALY,
      alarms.EventBridgeRecommendedAlarmsMetrics.INGESTION_TO_INVOCATION_SUCCESS_LATENCY_ANOMALY,
    ],
  });
  Template.fromStack(scope).resourceCountIs('AWS::CloudWatch::Alarm', 3);
  expect(bundle.alarmTriggeredRulesAnomaly).toBeUndefined();
  expect(bundle.alarmIngestionToInvocationSuccessLatencyAnomaly).toBeUndefined();
});

test('all metrics can be excluded, including configured optional alarms', () => {
  const scope = stack();
  new alarms.EventBridgeRuleRecommendedAlarms(scope, 'Excluded', {
    rule: rule(scope), ...optionalAlarms, excludeAlarms: Object.values(alarms.EventBridgeRecommendedAlarmsMetrics),
  });
  Template.fromStack(scope).resourceCountIs('AWS::CloudWatch::Alarm', 0);
});

test.each([false, true])('aspect discovers owned default/custom-bus rules and respects resource exclusions (%s)', custom => {
  const scope = stack();
  const bus = custom ? new events.EventBus(scope, 'Bus') : undefined;
  rule(scope, bus);
  new events.Rule(scope, 'Excluded', { eventPattern: { source: ['test.source'] } });
  Aspects.of(scope).add(new alarms.EventBridgeRecommendedAlarmsAspect({ ...optionalAlarms, excludeResources: ['Excluded'] }));
  const template = Template.fromStack(scope);
  template.resourceCountIs('AWS::CloudWatch::Alarm', 7);
  expect(template.toJSON()).toMatchSnapshot();
});

test('extended rules create alarms only through convenience methods or an explicit Aspect', () => {
  const scope = stack();
  const monitored = new alarms.Rule(scope, 'Extended');
  monitored.addEventPattern({ source: ['test.source'] });
  expect(monitored.node.children.filter(c => c instanceof cloudwatch.Alarm)).toHaveLength(0);
  monitored.alarmFailedInvocations();
  monitored.alarmInvocationsSentToDlq();
  monitored.alarmThrottledRules();
  monitored.alarmIngestionToInvocationSuccessLatency({ threshold: 5000 });
  monitored.alarmSuccessfulInvocationRate({ threshold: 0.99 });
  monitored.alarmTriggeredRulesAnomaly();
  monitored.alarmIngestionToInvocationSuccessLatencyAnomaly();
  new alarms.Rule(scope, 'BundleRule', { eventPattern: { source: ['test.source'] } }).applyRecommendedAlarms();
  new alarms.EventBridgeRecommendedAlarmsAspect().visit(new events.Rule(scope, 'Plain', { eventPattern: { source: ['test.source'] } }));
  Template.fromStack(scope).resourceCountIs('AWS::CloudWatch::Alarm', 17);
});

/** Rules with identical names are valid when they belong to different event buses. */
test('default alarm names distinguish equal rule names on different buses', () => {
  const scope = stack();
  for (const name of ['first', 'second']) {
    const eventBus = events.EventBus.fromEventBusName(scope, `${name}Bus`, name);
    const monitored = events.Rule.fromEventRuleArn(scope, `${name}Rule`, `arn:aws:events:us-east-1:123456789012:rule/${name}/same-name`);
    new alarms.EventBridgeRuleFailedInvocationsAlarm(scope, `${name}Alarm`, { rule: monitored, eventBus });
  }
  const template = Template.fromStack(scope);
  for (const name of ['first', 'second']) {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', { AlarmName: `${name}/same-name - FailedInvocations` });
  }
});
