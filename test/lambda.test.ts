import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_sns as sns,
  aws_lambda as lambda,
  App,
  Stack,
  Aspects,
  Duration,
} from 'aws-cdk-lib';
import {
  Template,
  Match,
} from 'aws-cdk-lib/assertions';
import { AnomalyMetricEntry, matchesAnomalyMetric } from './anomaly-test-helpers';
import * as lambdaAlarms from '../src/lambda';

/** Maps each anomaly enum value to the underlying CloudWatch metric name it monitors. */
const anomalyEnumToMetricName: Record<string, string> = {
  [lambdaAlarms.LambdaRecommendedAlarmsMetrics.DURATION_ANOMALY]: 'Duration',
  [lambdaAlarms.LambdaRecommendedAlarmsMetrics.INVOCATIONS_ANOMALY]: 'Invocations',
};

/** Enum values whose alarm resource cannot be matched by `MetricName` alone. */
const nonDirectMetricNameEnumValues = new Set(Object.keys(anomalyEnumToMetricName));

/**
 * True if the alarm resource corresponds to the given recommended-alarm enum value.
 * Static alarms match on the top-level `MetricName`; anomaly alarms have no top-level
 * `MetricName` and instead wrap their metric in an `ANOMALY_DETECTION_BAND` expression,
 * so they are matched by the underlying metric inside `Metrics[]`.
 */
function alarmMatchesMetric(
  properties: { MetricName?: string; Metrics?: AnomalyMetricEntry[] },
  metricEnumValue: string,
): boolean {
  const anomalyMetric = anomalyEnumToMetricName[metricEnumValue];
  if (anomalyMetric) {
    return matchesAnomalyMetric(properties, anomalyMetric);
  }
  return properties.MetricName === metricEnumValue;
}

test('Snapshot', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new lambdaAlarms.LambdaRecommendedAlarmsAspect({
      configDurationAlarm: {
        threshold: 15,
      },
      configErrorsAlarm: {
        threshold: 1,
      },
      configThrottlesAlarm: {
        threshold: 0,
      },
    }),
  );

  new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('SnapshotWithExclusion', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new lambdaAlarms.LambdaRecommendedAlarmsAspect({
      configDurationAlarm: {
        threshold: 15,
      },
      configErrorsAlarm: {
        threshold: 1,
      },
      configThrottlesAlarm: {
        threshold: 0,
      },
      excludeAlarms: [lambdaAlarms.LambdaRecommendedAlarmsMetrics.DURATION],
    }),
  );

  new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('SnapshotForBucketConstruct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const handler = new lambdaAlarms.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  handler.applyRecommendedAlarms({
    configDurationAlarm: {
      threshold: 15,
    },
    configErrorsAlarm: {
      threshold: 1,
    },
    configThrottlesAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('SnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  const handler = new lambdaAlarms.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  handler.applyRecommendedAlarms({
    configDurationAlarm: {
      threshold: 15,
    },
    configErrorsAlarm: {
      threshold: 1,
    },
    configThrottlesAlarm: {
      threshold: 0,
    },
  });

  new lambdaAlarms.LambdaRecommendedAlarms(stack, 'lambdaAlarms', {
    lambdaFunction: handler,
    configDurationAlarm: {
      threshold: 15,
    },
    configErrorsAlarm: {
      threshold: 1,
    },
    configThrottlesAlarm: {
      threshold: 0,
    },
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
  });

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('stack should contain recommended alarms for each function if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new lambdaAlarms.LambdaRecommendedAlarmsAspect({
      configDurationAlarm: {
        threshold: 15,
      },
      configErrorsAlarm: {
        threshold: 1,
      },
      configThrottlesAlarm: {
        threshold: 0,
      },
    }),
  );

  new lambdaAlarms.Function(stack, 'Lambda1', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new lambdaAlarms.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(lambdaAlarms.LambdaRecommendedAlarmsMetrics).length * 2;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Lambda1', 'Lambda2'].forEach(functionName => {
    Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(functionName) && alarmMatchesMetric(resourceProperties, metricName);
      });

      expect(alarms.length).toBe(1);
    });
  });
});

test('stack should not include an alarm if its excluded when aspect is applied', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new lambdaAlarms.LambdaRecommendedAlarmsAspect({
      configDurationAlarm: {
        threshold: 15,
      },
      configErrorsAlarm: {
        threshold: 1,
      },
      configThrottlesAlarm: {
        threshold: 0,
      },
      excludeAlarms: [lambdaAlarms.LambdaRecommendedAlarmsMetrics.DURATION],
    }),
  );

  new lambdaAlarms.Function(stack, 'Lambda1', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new lambdaAlarms.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const template = Template.fromStack(stack);

  const numAlarms = (Object.keys(lambdaAlarms.LambdaRecommendedAlarmsMetrics).length - 1) * 2;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Lambda1', 'Lambda2'].forEach(functionName => {
    Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(functionName) && alarmMatchesMetric(resourceProperties, metricName);
      });

      if (metricName === lambdaAlarms.LambdaRecommendedAlarmsMetrics.DURATION) {
        expect(alarms.length).toBe(0);
      } else {
        expect(alarms.length).toBe(1);
      }
    });
  });
});

test('stack should contain recommended alarms for functions where recommended alarms were enabled with no exclusions using function construct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new lambdaAlarms.Function(stack, 'Lambda1', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const handler2 = new lambdaAlarms.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  handler2.applyRecommendedAlarms({
    configDurationAlarm: {
      threshold: 15,
    },
    configErrorsAlarm: {
      threshold: 1,
    },
    configThrottlesAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(lambdaAlarms.LambdaRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Lambda1') && alarmMatchesMetric(resourceProperties, metricName);
    });

    expect(alarms.length).toBe(0);
  });

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Lambda2') && alarmMatchesMetric(resourceProperties, metricName);
    });

    expect(alarms.length).toBe(1);
  });
});

test('stack should contain recommended alarms for functions where recommended alarms were enabled with no exclusions using recommended alarms construct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new lambdaAlarms.Function(stack, 'Lambda1', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const handler2 = new lambdaAlarms.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new lambdaAlarms.LambdaRecommendedAlarms(stack, 'Lambda2Alarms', {
    lambdaFunction: handler2,
    configDurationAlarm: {
      threshold: 15,
    },
    configErrorsAlarm: {
      threshold: 1,
    },
    configThrottlesAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(lambdaAlarms.LambdaRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Lambda1') && alarmMatchesMetric(resourceProperties, metricName);
    });

    expect(alarms.length).toBe(0);
  });

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Lambda2') && alarmMatchesMetric(resourceProperties, metricName);
    });

    expect(alarms.length).toBe(1);
  });
});

test('default alarm actions are used when provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const handler = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const lambdaAction = new cloudwatch_actions.LambdaAction(handler);

  new lambdaAlarms.LambdaRecommendedAlarms(stack, 'LambdaAlarms', {
    lambdaFunction: handler,
    defaultAlarmAction: lambdaAction,
    defaultOkAction: lambdaAction,
    defaultInsufficientDataAction: lambdaAction,
    configDurationAlarm: {
      threshold: 15,
    },
    configErrorsAlarm: {
      threshold: 1,
    },
    configThrottlesAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics)
    .filter(metricName => !nonDirectMetricNameEnumValues.has(metricName))
    .forEach(metricName => {
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        MetricName: metricName,
        AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
        OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
        InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      }));
    });

  Object.values(anomalyEnumToMetricName).forEach(underlying => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      Metrics: Match.arrayWith([
        Match.objectLike({ MetricStat: Match.objectLike({ Metric: Match.objectLike({ MetricName: underlying }) }) }),
      ]),
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
    }));
  });
});

test('No alarm actions are used when none provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const handler = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new lambdaAlarms.LambdaRecommendedAlarms(stack, 'LambdaAlarms', {
    lambdaFunction: handler,
    configDurationAlarm: {
      threshold: 15,
    },
    configErrorsAlarm: {
      threshold: 1,
    },
    configThrottlesAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  template.findResources('AWS::CloudWatch::Alarm', {
    AlarmActions: Match.absent(),
    OkActions: Match.absent(),
    InsufficientDataActions: Match.absent(),
  });
});

test('default alarm actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const handler = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const alarmTopic = new sns.Topic(stack, 'AlarmTopic');

  const alarmAction = new cloudwatch_actions.SnsAction(alarmTopic);

  const alarmHandler = new lambda.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const lambdaAction = new cloudwatch_actions.LambdaAction(alarmHandler);

  new lambdaAlarms.LambdaRecommendedAlarms(stack, 'LambdaAlarms', {
    lambdaFunction: handler,
    defaultAlarmAction: lambdaAction,
    defaultOkAction: lambdaAction,
    defaultInsufficientDataAction: lambdaAction,
    configDurationAlarm: {
      threshold: 15,
      alarmAction: alarmAction,
      okAction: alarmAction,
      insufficientDataAction: alarmAction,
    },
    configErrorsAlarm: {
      threshold: 1,
      alarmAction: alarmAction,
      okAction: alarmAction,
      insufficientDataAction: alarmAction,
    },
    configThrottlesAlarm: {
      threshold: 0,
      alarmAction: alarmAction,
      okAction: alarmAction,
      insufficientDataAction: alarmAction,
    },
    configConcurrentExecutionsAlarm: {
      threshold: 0,
      alarmAction: alarmAction,
      okAction: alarmAction,
      insufficientDataAction: alarmAction,
    },
  });

  const template = Template.fromStack(stack);

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics)
    .filter(metricName => !nonDirectMetricNameEnumValues.has(metricName))
    .forEach(metricName => {
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        MetricName: metricName,
        AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^AlarmTopic.*') })],
        OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^AlarmTopic.*') })],
        InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^AlarmTopic.*') })],
      }));
    });
});

test('alarms can be applied individually to buckets using extended construct', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const handler = new lambdaAlarms.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  handler.alarmDuration({
    threshold: 15,
  });

  handler.alarmErrors({
    threshold: 1,
  });

  handler.alarmThrottles({
    threshold: 0,
  });

  handler.alarmConcurrentExecutions();

  handler.alarmDurationAnomaly();

  handler.alarmInvocationsAnomaly();

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(lambdaAlarms.LambdaRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
    const bucketErrors = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Lambda') && alarmMatchesMetric(resourceProperties, metricName);
    });

    expect(bucketErrors.length).toBe(1);
  });
});

test('setting configuration for an alarm where it is not required configures the alarm with the given config', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new lambdaAlarms.LambdaRecommendedAlarmsAspect({
      configDurationAlarm: {
        threshold: 15,
      },
      configErrorsAlarm: {
        threshold: 1,
      },
      configThrottlesAlarm: {
        threshold: 0,
      },
      configConcurrentExecutionsAlarm: {
        threshold: 25,
      },
    }),
  );

  new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const template = Template.fromStack(stack);

  [
    lambdaAlarms.LambdaRecommendedAlarmsMetrics.CONCURRENT_EXECUTIONS,
  ].forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      Threshold: 25,
    }));
  });
});

test('optional alarm configuration can be overwritten', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  const topic = new sns.Topic(stack, 'Topic');

  const topicAction = new cloudwatch_actions.SnsAction(topic);

  appAspects.add(
    new lambdaAlarms.LambdaRecommendedAlarmsAspect({
      configDurationAlarm: {
        threshold: 15,
        alarmName: 'CustomApproximateAgeOfOldestMessageAlarm',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configErrorsAlarm: {
        threshold: 1,
        alarmName: 'CustomNumberOfMessagesNotVisibleAlarm',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configThrottlesAlarm: {
        threshold: 0,
        alarmName: 'CustomNumberOfMessagesVisibleAlarm',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configConcurrentExecutionsAlarm: {
        threshold: 25,
        alarmName: 'CustomNumberOfMessagesSentAlarm',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configDurationAnomalyAlarm: {
        alarmName: 'CustomDurationAnomalyAlarm',
        stdDevs: 4,
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configInvocationsAnomalyAlarm: {
        alarmName: 'CustomInvocationsAnomalyAlarm',
        stdDevs: 4,
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
    }),
  );

  new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const template = Template.fromStack(stack);

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics)
    .filter(metricName => !nonDirectMetricNameEnumValues.has(metricName))
    .forEach(metricName => {
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        MetricName: metricName,
        AlarmName: Match.stringLikeRegexp('^Custom.*'),
        Period: 300,
        EvaluationPeriods: 25,
        DatapointsToAlarm: 25,
        AlarmDescription: 'Custom alarm description',
        AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
        OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
        InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      }));
    });

  Object.values(anomalyEnumToMetricName).forEach(underlying => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      AlarmName: Match.stringLikeRegexp('^Custom.*'),
      EvaluationPeriods: 25,
      DatapointsToAlarm: 25,
      AlarmDescription: 'Custom alarm description',
      Metrics: Match.arrayWith([
        Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 4)' }),
        Match.objectLike({ MetricStat: Match.objectLike({ Metric: Match.objectLike({ MetricName: underlying }) }) }),
      ]),
      AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
    }));
  });
});

// Anomaly alarms use a fixed 5-minute period with no configurable `period` prop, so they
// can't be driven past the one-day limit the way the static alarms below can.
Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics)
  .filter(metricName => !nonDirectMetricNameEnumValues.has(metricName))
  .forEach(metricName => {
    test(`alarm for ${metricName} should not exceed one day period`, () => {
      const app = new App();
      const stack = new Stack(app, 'TestStack', {
        env: {
          account: '123456789012', // not a real account
          region: 'us-east-1',
        },
      });

      const handler = new lambda.Function(stack, 'Lambda', {
        runtime: lambda.Runtime.NODEJS_24_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
      });

      const excludeAllButOneMetric = Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).filter(m => m !== metricName);

      expect(() => {
        new lambdaAlarms.LambdaRecommendedAlarms(stack, 'LambdaAlarms', {
          lambdaFunction: handler,
          excludeAlarms: excludeAllButOneMetric,
          configDurationAlarm: {
            threshold: 15,
            period: Duration.days(1),
            evaluationPeriods: 25,
          },
          configErrorsAlarm: {
            threshold: 1,
            period: Duration.days(1),
            evaluationPeriods: 25,
          },
          configThrottlesAlarm: {
            threshold: 0,
            period: Duration.days(1),
            evaluationPeriods: 25,
          },
          configConcurrentExecutionsAlarm: {
            threshold: 25,
            period: Duration.days(1),
            evaluationPeriods: 25,
          },
        });
      }).toThrow('The period (86400) over which'),

      Template.fromStack(stack);
    });
  });

test('when a resource is excluded from the aspect config it should not have alarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new lambdaAlarms.LambdaRecommendedAlarmsAspect({
      excludeResources: ['Lambda1'],
      configDurationAlarm: {
        threshold: 15,
      },
      configErrorsAlarm: {
        threshold: 1,
      },
      configThrottlesAlarm: {
        threshold: 0,
      },
    }),
  );

  new lambda.Function(stack, 'Lambda1', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new lambda.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(lambdaAlarms.LambdaRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Lambda1', 'Lambda2'].forEach(functionName => {
    Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(functionName) && alarmMatchesMetric(resourceProperties, metricName);
      });

      if (functionName === 'Lambda1') {
        expect(alarms.length).toBe(0);
      } else {
        expect(alarms.length).toBe(1);
      }
    });
  });
});

test('AspectWithTreatMissingData', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });
  const appAspects = Aspects.of(app);
  appAspects.add(
    new lambdaAlarms.LambdaRecommendedAlarmsAspect({
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      configDurationAlarm: {
        threshold: 15,
      },
      configErrorsAlarm: {
        threshold: 1,
      },
      configThrottlesAlarm: {
        threshold: 0,
      },
    }),
  );
  new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics)
    .filter(metricName => !nonDirectMetricNameEnumValues.has(metricName))
    .forEach(metricName => {
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        MetricName: metricName,
        TreatMissingData: 'notBreaching',
      }));
    });

  Object.values(anomalyEnumToMetricName).forEach(underlying => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      TreatMissingData: 'notBreaching',
      Metrics: Match.arrayWith([
        Match.objectLike({ MetricStat: Match.objectLike({ Metric: Match.objectLike({ MetricName: underlying }) }) }),
      ]),
    }));
  });
});

test('anomaly alarms have correct default comparison operator, band width, and evaluation periods', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const handler = new lambdaAlarms.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  handler.alarmDurationAnomaly();
  handler.alarmInvocationsAnomaly();

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    ComparisonOperator: 'GreaterThanUpperThreshold',
    EvaluationPeriods: 3,
    DatapointsToAlarm: 2,
    Metrics: Match.arrayWith([
      Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 8)' }),
      Match.objectLike({ MetricStat: Match.objectLike({ Period: 300, Stat: 'Average', Metric: Match.objectLike({ MetricName: 'Duration' }) }) }),
    ]),
  }));

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
    EvaluationPeriods: 4,
    DatapointsToAlarm: 3,
    Metrics: Match.arrayWith([
      Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 8)' }),
      Match.objectLike({ MetricStat: Match.objectLike({ Period: 300, Stat: 'Average', Metric: Match.objectLike({ MetricName: 'Invocations' }) }) }),
    ]),
  }));
});

test('anomaly alarm configuration can be overwritten via convenience methods', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const handler = new lambdaAlarms.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  handler.alarmDurationAnomaly({
    stdDevs: 4,
    evaluationPeriods: 3,
    datapointsToAlarm: 2,
    comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
  });
  handler.alarmInvocationsAnomaly({
    stdDevs: 5,
    evaluationPeriods: 6,
    datapointsToAlarm: 4,
    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
    EvaluationPeriods: 3,
    DatapointsToAlarm: 2,
    Metrics: Match.arrayWith([
      Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 4)' }),
      Match.objectLike({ MetricStat: Match.objectLike({ Stat: 'Average', Metric: Match.objectLike({ MetricName: 'Duration' }) }) }),
    ]),
  }));

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    ComparisonOperator: 'GreaterThanUpperThreshold',
    EvaluationPeriods: 6,
    DatapointsToAlarm: 4,
    Metrics: Match.arrayWith([
      Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 5)' }),
      Match.objectLike({ MetricStat: Match.objectLike({ Stat: 'Average', Metric: Match.objectLike({ MetricName: 'Invocations' }) }) }),
    ]),
  }));
});

test('lambda anomaly alarms can be excluded individually via excludeAlarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const handler = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new lambdaAlarms.LambdaRecommendedAlarms(stack, 'alarms', {
    lambdaFunction: handler,
    configDurationAlarm: { threshold: 15 },
    configErrorsAlarm: { threshold: 1 },
    configThrottlesAlarm: { threshold: 0 },
    excludeAlarms: [
      lambdaAlarms.LambdaRecommendedAlarmsMetrics.DURATION_ANOMALY,
      lambdaAlarms.LambdaRecommendedAlarmsMetrics.INVOCATIONS_ANOMALY,
    ],
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::CloudWatch::Alarm', 4); // Duration, Errors, Throttles, ConcurrentExecutions only

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  Object.values(anomalyEnumToMetricName).forEach(underlying => {
    const anomalyAlarms = Object.values(resources).filter(r =>
      (r.Properties.Metrics ?? []).some(
        (m: AnomalyMetricEntry) => m.MetricStat?.Metric?.MetricName === underlying,
      ),
    );
    expect(anomalyAlarms).toHaveLength(0);
  });
});

test('anomaly alarm default actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');
  const alarmLambda = new lambda.Function(stack, 'AlarmLambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });
  const lambdaAction = new cloudwatch_actions.LambdaAction(alarmLambda);

  const handler = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new lambdaAlarms.LambdaRecommendedAlarms(stack, 'lambdaAlarms', {
    lambdaFunction: handler,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configDurationAlarm: { threshold: 15 },
    configErrorsAlarm: { threshold: 1 },
    configThrottlesAlarm: { threshold: 0 },
    configDurationAnomalyAlarm: { alarmAction: lambdaAction, okAction: lambdaAction, insufficientDataAction: lambdaAction },
    configInvocationsAnomalyAlarm: { alarmAction: lambdaAction, okAction: lambdaAction, insufficientDataAction: lambdaAction },
  });

  const template = Template.fromStack(stack);

  Object.values(anomalyEnumToMetricName).forEach(underlying => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      Metrics: Match.arrayWith([
        Match.objectLike({ MetricStat: Match.objectLike({ Metric: Match.objectLike({ MetricName: underlying }) }) }),
      ]),
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^AlarmLambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^AlarmLambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^AlarmLambda.*'), 'Arn'] })],
    }));
  });
});