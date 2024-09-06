import {
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_sqs as sqs,
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
import * as sqsAlarms from '../src/sqs';

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
    new sqsAlarms.SqsRecommendedAlarmsAspect({
      configApproximateAgeOfOldestMessageAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesNotVisibleAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesVisibleAlarm: {
        threshold: 0,
      },
    }),
  );

  const dlq = new sqs.Queue(stack, 'dlq');

  new sqs.Queue(stack, 'Queue', {
    deadLetterQueue: {
      queue: dlq,
      maxReceiveCount: 1,
    },
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
    new sqsAlarms.SqsRecommendedAlarmsAspect({
      configApproximateAgeOfOldestMessageAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesNotVisibleAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesVisibleAlarm: {
        threshold: 0,
      },
      excludeAlarms: [sqsAlarms.SqsRecommendedAlarmsMetrics.APPROXIMATE_AGE_OF_OLDEST_MESSAGE],
    }),
  );

  new sqs.Queue(stack, 'Queue');

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

  const queue = new sqsAlarms.Queue(stack, 'Queue', {});

  queue.applyRecommendedAlarms({
    configApproximateAgeOfOldestMessageAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesNotVisibleAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesVisibleAlarm: {
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

  const queue = new sqsAlarms.Queue(stack, 'Queue', {});

  queue.applyRecommendedAlarms({
    configApproximateAgeOfOldestMessageAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesNotVisibleAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesVisibleAlarm: {
      threshold: 0,
    },
  });

  new sqsAlarms.SqsRecommendedAlarms(stack, 'sqsAlarms', {
    queue,
    configApproximateAgeOfOldestMessageAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesNotVisibleAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesVisibleAlarm: {
      threshold: 0,
    },
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
  });

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('stack should contain recommended alarms for each queue if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new sqsAlarms.SqsRecommendedAlarmsAspect({
      configApproximateAgeOfOldestMessageAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesNotVisibleAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesVisibleAlarm: {
        threshold: 0,
      },
    }),
  );

  new sqs.Queue(stack, 'Queue1');

  new sqs.Queue(stack, 'Queue2');

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(sqsAlarms.SqsRecommendedAlarmsMetrics).length * 2;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Queue1', 'Queue2'].forEach(queueName => {
    Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(queueName) && resourceProperties.MetricName === metricName;
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
    new sqsAlarms.SqsRecommendedAlarmsAspect({
      configApproximateAgeOfOldestMessageAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesNotVisibleAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesVisibleAlarm: {
        threshold: 0,
      },
      excludeAlarms: [sqsAlarms.SqsRecommendedAlarmsMetrics.APPROXIMATE_AGE_OF_OLDEST_MESSAGE],
    }),
  );

  new sqs.Queue(stack, 'Queue1');

  new sqs.Queue(stack, 'Queue2');

  const template = Template.fromStack(stack);

  const numAlarms = (Object.keys(sqsAlarms.SqsRecommendedAlarmsMetrics).length - 1) * 2;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Queue1', 'Queue2'].forEach(queueName => {
    Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(queueName) && resourceProperties.MetricName === metricName;
      });

      if (metricName === sqsAlarms.SqsRecommendedAlarmsMetrics.APPROXIMATE_AGE_OF_OLDEST_MESSAGE) {
        expect(alarms.length).toBe(0);
      } else {
        expect(alarms.length).toBe(1);
      }
    });
  });
});

test('stack should contain recommended alarms for queues where recommended alarms were enabled with no exclusions using queue construct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new sqs.Queue(stack, 'Queue1');

  const queue2 = new sqsAlarms.Queue(stack, 'Queue2');

  queue2.applyRecommendedAlarms({
    configApproximateAgeOfOldestMessageAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesNotVisibleAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesVisibleAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(sqsAlarms.SqsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Queue1') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(0);
  });

  Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Queue2') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('stack should contain recommended alarms for queues where recommended alarms were enabled with no exclusions using recommended alarms construct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new sqs.Queue(stack, 'Queue1');

  const queue2 = new sqs.Queue(stack, 'Queue2');

  new sqsAlarms.SqsRecommendedAlarms(stack, 'Queue2Alarms', {
    queue: queue2,
    configApproximateAgeOfOldestMessageAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesNotVisibleAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesVisibleAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(sqsAlarms.SqsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Queue1') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(0);
  });

  Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Queue2') && resourceProperties.MetricName === metricName;
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

  const queue = new sqs.Queue(stack, 'Queue');

  const handler = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const lambdaAction = new cloudwatch_actions.LambdaAction(handler);

  new sqsAlarms.SqsRecommendedAlarms(stack, 'QueueAlarms', {
    queue,
    defaultAlarmAction: lambdaAction,
    defaultOkAction: lambdaAction,
    defaultInsufficientDataAction: lambdaAction,
    configApproximateAgeOfOldestMessageAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesNotVisibleAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesVisibleAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
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

  const queue = new sqs.Queue(stack, 'Queue');

  new sqsAlarms.SqsRecommendedAlarms(stack, 'QueueAlarms', {
    queue,
    configApproximateAgeOfOldestMessageAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesNotVisibleAlarm: {
      threshold: 0,
    },
    configApproximateNumberOfMessagesVisibleAlarm: {
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

  const queue = new sqs.Queue(stack, 'Queue');

  const alarmTopic = new sns.Topic(stack, 'AlarmTopic');

  const alarmAction = new cloudwatch_actions.SnsAction(alarmTopic);

  const handler = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const lambdaAction = new cloudwatch_actions.LambdaAction(handler);

  new sqsAlarms.SqsRecommendedAlarms(stack, 'QueueAlarms', {
    queue,
    defaultAlarmAction: lambdaAction,
    defaultOkAction: lambdaAction,
    defaultInsufficientDataAction: lambdaAction,
    configApproximateAgeOfOldestMessageAlarm: {
      threshold: 0,
      alarmAction: alarmAction,
      okAction: alarmAction,
      insufficientDataAction: alarmAction,
    },
    configApproximateNumberOfMessagesNotVisibleAlarm: {
      threshold: 0,
      alarmAction: alarmAction,
      okAction: alarmAction,
      insufficientDataAction: alarmAction,
    },
    configApproximateNumberOfMessagesVisibleAlarm: {
      threshold: 0,
      alarmAction: alarmAction,
      okAction: alarmAction,
      insufficientDataAction: alarmAction,
    },
    configNumberOfMessagesSentAlarm: {
      threshold: 0,
      alarmAction: alarmAction,
      okAction: alarmAction,
      insufficientDataAction: alarmAction,
    },
  });

  const template = Template.fromStack(stack);

  Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
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

  const queue = new sqsAlarms.Queue(stack, 'Queue');

  queue.alarmApproximateAgeOfOldestMessage({
    threshold: 0,
  });

  queue.alarmApproximateNumberOfMessagesNotVisible({
    threshold: 0,
  });

  queue.alarmApproximateNumberOfMessagesVisible({
    threshold: 0,
  });

  queue.alarmNumberOfMessagesSent();

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(sqsAlarms.SqsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
    const bucketErrors = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Queue') && resourceProperties.MetricName === metricName;
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
    new sqsAlarms.SqsRecommendedAlarmsAspect({
      configApproximateAgeOfOldestMessageAlarm: {
        threshold: 0,

      },
      configApproximateNumberOfMessagesNotVisibleAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesVisibleAlarm: {
        threshold: 0,
      },
      configNumberOfMessagesSentAlarm: {
        threshold: 10,
      },
    }),
  );

  new sqs.Queue(stack, 'Queue');

  const template = Template.fromStack(stack);

  [
    sqsAlarms.SqsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_SENT,
  ].forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      Threshold: 10,
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
    new sqsAlarms.SqsRecommendedAlarmsAspect({
      configApproximateAgeOfOldestMessageAlarm: {
        threshold: 0,
        alarmName: 'CustomApproximateAgeOfOldestMessageAlarm',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configApproximateNumberOfMessagesNotVisibleAlarm: {
        threshold: 0,
        alarmName: 'CustomApproximateNumberOfMessagesNotVisibleAlarm',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configApproximateNumberOfMessagesVisibleAlarm: {
        threshold: 0,
        alarmName: 'CustomApproximateNumberOfMessagesVisibleAlarm',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configNumberOfMessagesSentAlarm: {
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

  new sqs.Queue(stack, 'Queue');

  const template = Template.fromStack(stack);

  Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
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

Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
  test(`alarm for ${metricName} should not exceed one day period`, () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', {
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    const queue = new sqs.Queue(stack, 'Queue');

    const excludeAllButOneMetric = Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).filter(m => m !== metricName);

    expect(() => {
      new sqsAlarms.SqsRecommendedAlarms(stack, 'QueueAlarms', {
        queue,
        excludeAlarms: excludeAllButOneMetric,
        configApproximateAgeOfOldestMessageAlarm: {
          threshold: 0,
          period: Duration.days(1),
          evaluationPeriods: 25,
          datapointsToAlarm: 25,
        },
        configApproximateNumberOfMessagesNotVisibleAlarm: {
          threshold: 0,
          period: Duration.days(1),
          evaluationPeriods: 25,
          datapointsToAlarm: 25,
          alarmDescription: 'Custom alarm description',
        },
        configApproximateNumberOfMessagesVisibleAlarm: {
          threshold: 0,
          period: Duration.days(1),
          evaluationPeriods: 25,
          datapointsToAlarm: 25,
        },
        configNumberOfMessagesSentAlarm: {
          period: Duration.days(1),
          evaluationPeriods: 25,
          datapointsToAlarm: 25,
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
    new sqsAlarms.SqsRecommendedAlarmsAspect({
      excludeResources: ['Queue1'],
      configApproximateAgeOfOldestMessageAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesNotVisibleAlarm: {
        threshold: 0,
      },
      configApproximateNumberOfMessagesVisibleAlarm: {
        threshold: 0,
      },
    }),
  );

  new sqs.Queue(stack, 'Queue1');

  new sqs.Queue(stack, 'Queue2');

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(sqsAlarms.SqsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Queue1', 'Queue2'].forEach(queueName => {
    Object.values(sqsAlarms.SqsRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(queueName) && resourceProperties.MetricName === metricName;
      });

      if (queueName === 'Queue1') {
        expect(alarms.length).toBe(0);
      } else {
        expect(alarms.length).toBe(1);
      }
    });
  });
});
