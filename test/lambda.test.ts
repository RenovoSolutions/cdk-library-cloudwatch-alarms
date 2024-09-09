import {
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
import * as lambdaAlarms from '../src/lambda';

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
    runtime: lambda.Runtime.NODEJS_20_X,
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
    runtime: lambda.Runtime.NODEJS_20_X,
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
    runtime: lambda.Runtime.NODEJS_20_X,
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
    runtime: lambda.Runtime.NODEJS_20_X,
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
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new lambdaAlarms.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_20_X,
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

        return resourceName.startsWith(functionName) && resourceProperties.MetricName === metricName;
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
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new lambdaAlarms.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_20_X,
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

        return resourceName.startsWith(functionName) && resourceProperties.MetricName === metricName;
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
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const handler2 = new lambdaAlarms.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_20_X,
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

      return resourceName.startsWith('Lambda1') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(0);
  });

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Lambda2') && resourceProperties.MetricName === metricName;
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
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const handler2 = new lambdaAlarms.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_20_X,
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

      return resourceName.startsWith('Lambda1') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(0);
  });

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Lambda2') && resourceProperties.MetricName === metricName;
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
    runtime: lambda.Runtime.NODEJS_20_X,
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

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
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
    runtime: lambda.Runtime.NODEJS_20_X,
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
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const alarmTopic = new sns.Topic(stack, 'AlarmTopic');

  const alarmAction = new cloudwatch_actions.SnsAction(alarmTopic);

  const alarmHandler = new lambda.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_20_X,
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

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
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
    runtime: lambda.Runtime.NODEJS_20_X,
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

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(lambdaAlarms.LambdaRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
    const bucketErrors = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Lambda') && resourceProperties.MetricName === metricName;
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
    runtime: lambda.Runtime.NODEJS_20_X,
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
    }),
  );

  new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const template = Template.fromStack(stack);

  Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
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
});

Object.values(lambdaAlarms.LambdaRecommendedAlarmsMetrics).forEach(metricName => {
  test(`alarm for ${metricName} should not exceed one day period`, () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', {
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    const handler = new lambda.Function(stack, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
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
    }).toThrowError('The period (86400) over which'),

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
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new lambda.Function(stack, 'Lambda2', {
    runtime: lambda.Runtime.NODEJS_20_X,
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

        return resourceName.startsWith(functionName) && resourceProperties.MetricName === metricName;
      });

      if (functionName === 'Lambda1') {
        expect(alarms.length).toBe(0);
      } else {
        expect(alarms.length).toBe(1);
      }
    });
  });
});
