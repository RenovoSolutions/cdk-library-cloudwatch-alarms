import {
  App, Aspects, Duration, Stack,
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as actions,
  aws_scheduler as scheduler,
  aws_sns as sns,
} from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as alarms from '../src/scheduler';

const staticAlarms = [
  alarms.SchedulerTargetErrorThrottledCountAlarm,
  alarms.SchedulerInvocationThrottleCountAlarm,
  alarms.SchedulerInvocationDroppedCountAlarm,
  alarms.SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarm,
];
const allAlarms = [...staticAlarms, alarms.SchedulerInvocationAttemptCountAnomalyAlarm];

function stack(): Stack {
  return new Stack(new App(), 'Test', { env: { account: '123456789012', region: 'us-east-1' } });
}

test('Scheduler bundle includes anomaly detection and AWS recommended static alarms', () => {
  const scope = stack();
  const group = new scheduler.ScheduleGroup(scope, 'Group', { scheduleGroupName: 'test-group' });
  new alarms.SchedulerRecommendedAlarms(scope, 'Alarms', { scheduleGroup: group });
  const template = Template.fromStack(scope);
  expect(template.toJSON()).toMatchSnapshot();
  template.resourceCountIs('AWS::CloudWatch::Alarm', 5);
  for (const [metric, periods] of [
    ['TargetErrorThrottledCount', 15], ['InvocationThrottleCount', 15],
    ['InvocationDroppedCount', 1], ['InvocationsFailedToBeSentToDeadLetterCount', 15],
  ] as const) {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', {
      MetricName: metric,
      Namespace: 'AWS/Scheduler',
      Statistic: 'Sum',
      Period: 60,
      Threshold: 0,
      ComparisonOperator: 'GreaterThanThreshold',
      EvaluationPeriods: periods,
      DatapointsToAlarm: periods,
      TreatMissingData: 'notBreaching',
      Dimensions: [{ Name: 'ScheduleGroup', Value: 'test-group' }],
    });
  }
});

test('imported groups use group metrics for default invocation anomalies', () => {
  const scope = stack();
  const group = scheduler.ScheduleGroup.fromScheduleGroupName(scope, 'Group', 'default');
  new alarms.SchedulerRecommendedAlarms(scope, 'Alarms', { scheduleGroup: group });
  const template = Template.fromStack(scope);
  template.resourceCountIs('AWS::CloudWatch::Alarm', 5);
  template.hasResourceProperties('AWS::CloudWatch::Alarm', {
    ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
    Metrics: Match.arrayWith([Match.objectLike({
      MetricStat: {
        Metric: { Namespace: 'AWS/Scheduler', MetricName: 'InvocationAttemptCount', Dimensions: [{ Name: 'ScheduleGroup', Value: 'default' }] },
        Period: 300,
        Stat: 'Sum',
      },
    })]),
  });
  expect(template.toJSON()).toMatchSnapshot();
});

test('individual alarms honor all configurable values and all three actions', () => {
  const scope = stack();
  const group = new scheduler.ScheduleGroup(scope, 'Group');
  const action = new actions.SnsAction(new sns.Topic(scope, 'Topic'));
  for (const [i, Alarm] of allAlarms.entries()) {
    new Alarm(scope, `Alarm${i}`, {
      scheduleGroup: group,
      threshold: 2,
      period: Duration.minutes(2),
      stdDevs: 3,
      evaluationPeriods: 3,
      datapointsToAlarm: 2,
      alarmName: `custom-${i}`,
      alarmDescription: 'custom description',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.IGNORE,
      alarmAction: action,
      okAction: action,
      insufficientDataAction: action,
    });
  }
  const template = Template.fromStack(scope);
  template.allResourcesProperties('AWS::CloudWatch::Alarm', {
    AlarmDescription: 'custom description',
    EvaluationPeriods: 3,
    DatapointsToAlarm: 2,
    TreatMissingData: 'ignore',
    AlarmActions: Match.anyValue(),
    OKActions: Match.anyValue(),
    InsufficientDataActions: Match.anyValue(),
  });
  expect(template.toJSON()).toMatchSnapshot();
});

test.each(allAlarms)('%p rejects evaluation windows longer than one day', Alarm => {
  const scope = stack();
  expect(() => new Alarm(scope, 'Alarm', {
    scheduleGroup: new scheduler.ScheduleGroup(scope, 'Group'), period: Duration.days(2), evaluationPeriods: 500,
  })).toThrow('exceeds one day');
});

test('bundle defaults and individual overrides have the same precedence as other services', () => {
  const scope = stack();
  const group = new scheduler.ScheduleGroup(scope, 'Group');
  const defaults = new actions.SnsAction(new sns.Topic(scope, 'DefaultTopic'));
  const override = new actions.SnsAction(new sns.Topic(scope, 'OverrideTopic'));
  const config = {
    alarmAction: override,
    okAction: override,
    insufficientDataAction: override,
    treatMissingData: cloudwatch.TreatMissingData.IGNORE,
  };
  new alarms.SchedulerRecommendedAlarms(scope, 'Defaults', {
    scheduleGroup: group,
    configInvocationAttemptCountAnomalyAlarm: {},
    defaultAlarmAction: defaults,
    defaultOkAction: defaults,
    defaultInsufficientDataAction: defaults,
    treatMissingData: cloudwatch.TreatMissingData.BREACHING,
  });
  new alarms.SchedulerRecommendedAlarms(scope, 'Overrides', {
    scheduleGroup: new scheduler.ScheduleGroup(scope, 'OtherGroup'),
    defaultAlarmAction: defaults,
    defaultOkAction: defaults,
    defaultInsufficientDataAction: defaults,
    treatMissingData: cloudwatch.TreatMissingData.BREACHING,
    configTargetErrorThrottledCountAlarm: config,
    configInvocationThrottleCountAlarm: config,
    configInvocationDroppedCountAlarm: config,
    configInvocationsFailedToBeSentToDeadLetterCountAlarm: config,
    configInvocationAttemptCountAnomalyAlarm: config,
  });
  const template = Template.fromStack(scope);
  template.resourceCountIs('AWS::CloudWatch::Alarm', 10);
  expect(Object.values(template.findResources('AWS::CloudWatch::Alarm')).filter(r => r.Properties.TreatMissingData === 'ignore')).toHaveLength(5);
  expect(template.toJSON()).toMatchSnapshot();
});

test('default Scheduler anomaly alarm can be excluded without configuration', () => {
  const scope = stack();
  const bundle = new alarms.SchedulerRecommendedAlarms(scope, 'Alarms', {
    scheduleGroup: new scheduler.ScheduleGroup(scope, 'Group'),
    excludeAlarms: [alarms.SchedulerRecommendedAlarmsMetrics.INVOCATION_ATTEMPT_COUNT_ANOMALY],
  });
  Template.fromStack(scope).resourceCountIs('AWS::CloudWatch::Alarm', 4);
  expect(bundle.alarmInvocationAttemptCountAnomaly).toBeUndefined();
});

test('all alarms can be excluded', () => {
  const scope = stack();
  new alarms.SchedulerRecommendedAlarms(scope, 'Alarms', {
    scheduleGroup: new scheduler.ScheduleGroup(scope, 'Group'),
    configInvocationAttemptCountAnomalyAlarm: {},
    excludeAlarms: Object.values(alarms.SchedulerRecommendedAlarmsMetrics),
  });
  Template.fromStack(scope).resourceCountIs('AWS::CloudWatch::Alarm', 0);
});

test('aspect applies once per owned schedule group and supports exclusions', () => {
  const scope = stack();
  new scheduler.ScheduleGroup(scope, 'Included');
  new scheduler.ScheduleGroup(scope, 'Excluded');
  Aspects.of(scope).add(new alarms.SchedulerRecommendedAlarmsAspect({
    excludeResources: ['Excluded'], configInvocationAttemptCountAnomalyAlarm: {},
  }));
  const template = Template.fromStack(scope);
  template.resourceCountIs('AWS::CloudWatch::Alarm', 5);
  expect(template.toJSON()).toMatchSnapshot();
});

test('extended groups create alarms only through convenience methods or an explicit Aspect', () => {
  const scope = stack();
  const group = new alarms.ScheduleGroup(scope, 'Group');
  expect(group.node.children.filter(c => c instanceof cloudwatch.Alarm)).toHaveLength(0);
  group.alarmTargetErrorThrottledCount();
  group.alarmInvocationThrottleCount();
  group.alarmInvocationDroppedCount();
  group.alarmInvocationsFailedToBeSentToDeadLetterCount();
  group.alarmInvocationAttemptCountAnomaly();
  new alarms.ScheduleGroup(scope, 'BundleGroup').applyRecommendedAlarms();
  new alarms.SchedulerRecommendedAlarmsAspect().visit(new scheduler.ScheduleGroup(scope, 'Plain'));
  Template.fromStack(scope).resourceCountIs('AWS::CloudWatch::Alarm', 15);
});
