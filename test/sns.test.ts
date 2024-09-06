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
import * as snsAlarms from '../src/sns';

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
    new snsAlarms.SnsRecommendedAlarmsAspect({
      configNumberOfMessagesPublishedAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsDeliveredAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsFailedAlarm: {
        threshold: 0,
      },
    }),
  );

  new sns.Topic(stack, 'Topic');

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
    new snsAlarms.SnsRecommendedAlarmsAspect({
      configNumberOfMessagesPublishedAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsDeliveredAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsFailedAlarm: {
        threshold: 0,
      },
      excludeAlarms: [snsAlarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_PUBLISHED],
    }),
  );

  new sns.Topic(stack, 'Topic');

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

  const topic = new snsAlarms.Topic(stack, 'Topic', {});

  topic.applyRecommendedAlarms({
    configNumberOfMessagesPublishedAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsDeliveredAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsFailedAlarm: {
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

  const topic2 = new sns.Topic(stack, 'Topic2');

  const topic = new snsAlarms.Topic(stack, 'Topic', {});

  topic.applyRecommendedAlarms({
    configNumberOfMessagesPublishedAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsDeliveredAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsFailedAlarm: {
      threshold: 0,
    },
  });

  new snsAlarms.SnsRecommendedAlarms(stack, 'SnsAlarms', {
    topic,
    configNumberOfMessagesPublishedAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsDeliveredAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsFailedAlarm: {
      threshold: 0,
    },
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic2),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic2),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic2),
  });

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('stack should contain recommended alarms for each topic if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new snsAlarms.SnsRecommendedAlarmsAspect({
      configNumberOfMessagesPublishedAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsDeliveredAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsFailedAlarm: {
        threshold: 0,
      },
    }),
  );

  new sns.Topic(stack, 'Topic1');

  new sns.Topic(stack, 'Topic2');

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(snsAlarms.SnsRecommendedAlarmsMetrics).length * 2;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Topic1', 'Topic2'].forEach(topicName => {
    Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(topicName) && resourceProperties.MetricName === metricName;
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
    new snsAlarms.SnsRecommendedAlarmsAspect({
      configNumberOfMessagesPublishedAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsDeliveredAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsFailedAlarm: {
        threshold: 0,
      },
      excludeAlarms: [snsAlarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_PUBLISHED],
    }),
  );

  new sns.Topic(stack, 'Topic1');

  new sns.Topic(stack, 'Topic2');

  const template = Template.fromStack(stack);

  const numAlarms = (Object.keys(snsAlarms.SnsRecommendedAlarmsMetrics).length - 1) * 2;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Topic1', 'Topic2'].forEach(topicName => {
    Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(topicName) && resourceProperties.MetricName === metricName;
      });

      if (metricName === snsAlarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_PUBLISHED) {
        expect(alarms.length).toBe(0);
      } else {
        expect(alarms.length).toBe(1);
      }
    });
  });
});

test('stack should contain recommended alarms for topics where recommended alarms were enabled with no exclusions using topic construct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new sns.Topic(stack, 'Topic1');

  const topic2 = new snsAlarms.Topic(stack, 'Topic2');

  topic2.applyRecommendedAlarms({
    configNumberOfMessagesPublishedAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsDeliveredAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsFailedAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(snsAlarms.SnsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Topic1') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(0);
  });

  Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Topic2') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('stack should contain recommended alarms for topics where recommended alarms were enabled with no exclusions using recommended alarms construct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new sns.Topic(stack, 'Topic1');

  const topic2 = new sns.Topic(stack, 'Topic2');

  new snsAlarms.SnsRecommendedAlarms(stack, 'Topic2Alarms', {
    topic: topic2,
    configNumberOfMessagesPublishedAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsDeliveredAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsFailedAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(snsAlarms.SnsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Topic1') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(0);
  });

  Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Topic2') && resourceProperties.MetricName === metricName;
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

  const topic = new sns.Topic(stack, 'Topic');

  const handler = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const lambdaAction = new cloudwatch_actions.LambdaAction(handler);

  new snsAlarms.SnsRecommendedAlarms(stack, 'TopicAlarms', {
    topic,
    defaultAlarmAction: lambdaAction,
    defaultOkAction: lambdaAction,
    defaultInsufficientDataAction: lambdaAction,
    configNumberOfMessagesPublishedAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsDeliveredAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsFailedAlarm: {
      threshold: 0,
    },
  });

  const template = Template.fromStack(stack);

  Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
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

  const topic = new sns.Topic(stack, 'Topic');

  new snsAlarms.SnsRecommendedAlarms(stack, 'TopicAlarms', {
    topic,
    configNumberOfMessagesPublishedAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsDeliveredAlarm: {
      threshold: 1,
    },
    configNumberOfNotificationsFailedAlarm: {
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

  const topic = new sns.Topic(stack, 'Topic');

  const alarmTopic = new sns.Topic(stack, 'AlarmTopic');

  const topicAction = new cloudwatch_actions.SnsAction(alarmTopic);

  const handler = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const lambdaAction = new cloudwatch_actions.LambdaAction(handler);

  new snsAlarms.SnsRecommendedAlarms(stack, 'TopicAlarms', {
    topic,
    defaultAlarmAction: lambdaAction,
    defaultOkAction: lambdaAction,
    defaultInsufficientDataAction: lambdaAction,
    configNumberOfMessagesPublishedAlarm: {
      threshold: 1,
      alarmAction: topicAction,
      okAction: topicAction,
      insufficientDataAction: topicAction,
    },
    configNumberOfNotificationsDeliveredAlarm: {
      threshold: 1,
      alarmAction: topicAction,
      okAction: topicAction,
      insufficientDataAction: topicAction,
    },
    configNumberOfNotificationsFailedAlarm: {
      threshold: 0,
      alarmAction: topicAction,
      okAction: topicAction,
      insufficientDataAction: topicAction,
    },
    configNumberOfNotificationsFailedToRedriveToDlqAlarm: {
      alarmAction: topicAction,
      okAction: topicAction,
      insufficientDataAction: topicAction,
    },
    configNumberOfNotificationsFilteredOutInvalidAttributesAlarm: {
      alarmAction: topicAction,
      okAction: topicAction,
      insufficientDataAction: topicAction,
    },
    configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm: {
      alarmAction: topicAction,
      okAction: topicAction,
      insufficientDataAction: topicAction,
    },
    configNumberOfNotificationsRedrivenToDlqAlarm: {
      alarmAction: topicAction,
      okAction: topicAction,
      insufficientDataAction: topicAction,
    },
  });

  const template = Template.fromStack(stack);

  Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
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

  const topic = new snsAlarms.Topic(stack, 'Topic');

  topic.alarmNumberOfMessagesPublished({
    threshold: 1,
  });

  topic.alarmNumberOfNotificationsDelivered({
    threshold: 1,
  });

  topic.alarmNumberOfNotificationsFailed({
    threshold: 0,
  });

  topic.alarmNumberOfNotificationsFilteredOutInvalidAttributes();

  topic.alarmNumberOfNotificationsFilteredOutInvalidMessageBody();

  topic.alarmNumberOfNotificationsRedrivenToDlq();

  topic.alarmNumberOfNotificationsFailedToRedriveToDlq();

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(snsAlarms.SnsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
    const bucketErrors = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Topic') && resourceProperties.MetricName === metricName;
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
    new snsAlarms.SnsRecommendedAlarmsAspect({
      configNumberOfMessagesPublishedAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsDeliveredAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsFailedAlarm: {
        threshold: 0,
      },
      configNumberOfNotificationsFailedToRedriveToDlqAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsFilteredOutInvalidAttributesAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsRedrivenToDlqAlarm: {
        threshold: 1,
      },
    }),
  );

  new sns.Topic(stack, 'Topic');

  const template = Template.fromStack(stack);

  [
    snsAlarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FAILED_TO_REDRIVE_TO_DLQ,
    snsAlarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_ATTRIBUTES,
    snsAlarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_MESSAGE_BODY,
    snsAlarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_REDRIVEN_TO_DLQ,
  ].forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      Threshold: 1,
    }));
  });
});

test('optional alarm configurations can be overwritten', () => {
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

  const appAspects = Aspects.of(app);

  const handler = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  const lambdaAction = new cloudwatch_actions.LambdaAction(handler);

  appAspects.add(
    new snsAlarms.SnsRecommendedAlarmsAspect({
      configNumberOfMessagesPublishedAlarm: {
        threshold: 1,
        alarmName: 'CustomNumberOfMessagesPublished',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: lambdaAction,
        okAction: lambdaAction,
        insufficientDataAction: lambdaAction,
      },
      configNumberOfNotificationsDeliveredAlarm: {
        threshold: 1,
        alarmName: 'CustomNumberOfNotificationsDelivered',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: lambdaAction,
        okAction: lambdaAction,
        insufficientDataAction: lambdaAction,
      },
      configNumberOfNotificationsFailedAlarm: {
        threshold: 0,
        alarmName: 'CustomNumberOfNotificationsFailed',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: lambdaAction,
        okAction: lambdaAction,
        insufficientDataAction: lambdaAction,
      },
      configNumberOfNotificationsFailedToRedriveToDlqAlarm: {
        alarmName: 'CustomNumberOfNotificationsFailedToRedriveToDlq',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: lambdaAction,
        okAction: lambdaAction,
        insufficientDataAction: lambdaAction,
      },
      configNumberOfNotificationsFilteredOutInvalidAttributesAlarm: {
        alarmName: 'CustomNumberOfNotificationsFilteredOutInvalidAttributes',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: lambdaAction,
        okAction: lambdaAction,
        insufficientDataAction: lambdaAction,
      },
      configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm: {
        alarmName: 'CustomNumberOfNotificationsFilteredOutInvalidMessageBody',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: lambdaAction,
        okAction: lambdaAction,
        insufficientDataAction: lambdaAction,
      },
      configNumberOfNotificationsRedrivenToDlqAlarm: {
        alarmName: 'CustomNumberOfNotificationsRedrivenToDlq',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: lambdaAction,
        okAction: lambdaAction,
        insufficientDataAction: lambdaAction,
      },
    }),
  );

  new sns.Topic(stack, 'Topic');

  const template = Template.fromStack(stack);

  Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmName: Match.stringLikeRegexp('^Custom.*'),
      Period: 300,
      EvaluationPeriods: 25,
      DatapointsToAlarm: 25,
      AlarmDescription: 'Custom alarm description',
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
    }));
  });
});

Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
  test(`alarm for ${metricName} should not exceed one day period`, () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', {
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    const topic = new sns.Topic(stack, 'Topic');

    const excludeAllButOneMetric = Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).filter(m => m !== metricName);

    expect(() => {
      new snsAlarms.SnsRecommendedAlarms(stack, 'TopicAlarms', {
        topic,
        excludeAlarms: excludeAllButOneMetric,
        configNumberOfMessagesPublishedAlarm: {
          threshold: 1,
          period: Duration.days(1),
          evaluationPeriods: 25,
          datapointsToAlarm: 25,
        },
        configNumberOfNotificationsDeliveredAlarm: {
          threshold: 1,
          period: Duration.days(1),
          evaluationPeriods: 25,
          datapointsToAlarm: 25,
        },
        configNumberOfNotificationsFailedAlarm: {
          threshold: 0,
          period: Duration.days(1),
          evaluationPeriods: 25,
          datapointsToAlarm: 25,
        },
        configNumberOfNotificationsFailedToRedriveToDlqAlarm: {
          period: Duration.days(1),
          evaluationPeriods: 25,
          datapointsToAlarm: 25,
        },
        configNumberOfNotificationsFilteredOutInvalidAttributesAlarm: {
          period: Duration.days(1),
          evaluationPeriods: 25,
          datapointsToAlarm: 25,
        },
        configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm: {
          period: Duration.days(1),
          evaluationPeriods: 25,
          datapointsToAlarm: 25,
        },
        configNumberOfNotificationsRedrivenToDlqAlarm: {
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
    new snsAlarms.SnsRecommendedAlarmsAspect({
      excludeResources: ['Topic1'],
      configNumberOfMessagesPublishedAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsDeliveredAlarm: {
        threshold: 1,
      },
      configNumberOfNotificationsFailedAlarm: {
        threshold: 0,
      },
    }),
  );

  new sns.Topic(stack, 'Topic1');

  new sns.Topic(stack, 'Topic2');

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(snsAlarms.SnsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Topic1', 'Topic2'].forEach(topicName => {
    Object.values(snsAlarms.SnsRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(topicName) && resourceProperties.MetricName === metricName;
      });

      if (topicName === 'Topic1') {
        expect(alarms.length).toBe(0);
      } else {
        expect(alarms.length).toBe(1);
      }
    });
  });
});
