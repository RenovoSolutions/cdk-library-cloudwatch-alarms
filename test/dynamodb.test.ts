import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
  aws_sns as sns,
  Aspects,
  App,
  Duration,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  Match,
  Template,
} from 'aws-cdk-lib/assertions';
import * as dynamodbAlarms from '../src/dynamodb';

class DynamoDbTableStack extends Stack {

  public readonly table: dynamodbAlarms.Table;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new dynamodbAlarms.Table(this, 'Table', {
      tableName: 'Table',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      readCapacity: 5,
      writeCapacity: 5,
    });
  }
}

const replicationAlarms = [
  dynamodbAlarms.DynamoDbRecommendedAlarmsMetrics.AGE_OF_OLDEST_UNREPLICATED_RECORD,
  dynamodbAlarms.DynamoDbRecommendedAlarmsMetrics.FAILED_TO_REPLICATE_RECORD_COUNT,
  dynamodbAlarms.DynamoDbRecommendedAlarmsMetrics.THROTTLED_PUT_RECORD_COUNT,
];

const mandatoryMetricsList = Object.values(dynamodbAlarms.DynamoDbRecommendedAlarmsMetrics).filter(metric => !replicationAlarms.includes(metric));
const allMetricsList = Object.values(dynamodbAlarms.DynamoDbRecommendedAlarmsMetrics);

test('DynamoDbTableSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dynamodbAlarms.DynamoDbRecommendedAlarmsAspect({
      configReadThrottleEventsAlarm: {
        threshold: 100,
      },
      configSystemErrorsAlarm: {
        threshold: 100,
      },
      configWriteThrottleEventsAlarm: {
        threshold: 100,
      },
    }),
  );

  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DynamoDbTableWithReplicationAlarmsSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dynamodbAlarms.DynamoDbRecommendedAlarmsAspect({
      configReadThrottleEventsAlarm: {
        threshold: 100,
      },
      configSystemErrorsAlarm: {
        threshold: 100,
      },
      configWriteThrottleEventsAlarm: {
        threshold: 100,
      },
      configAgeOfOldestUnreplicatedRecordAlarm: {
        threshold: 100,
      },
      configFailedToReplicateRecordCountAlarm: {
      },
      configThrottledPutRecordCountAlarm: {
        threshold: 100,
      },
    }),
  );

  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DynamoDbTableSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dynamodbAlarms.DynamoDbRecommendedAlarmsAspect({
      excludeAlarms: [dynamodbAlarms.DynamoDbRecommendedAlarmsMetrics.READ_THROTTLE_EVENTS],
      configReadThrottleEventsAlarm: {
        threshold: 100,
      },
      configSystemErrorsAlarm: {
        threshold: 100,
      },
      configWriteThrottleEventsAlarm: {
        threshold: 100,
      },
    }),
  );

  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DynamoDbTableSnapshotWithReplicationAlarmsAndExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dynamodbAlarms.DynamoDbRecommendedAlarmsAspect({
      excludeAlarms: [dynamodbAlarms.DynamoDbRecommendedAlarmsMetrics.READ_THROTTLE_EVENTS],
      configReadThrottleEventsAlarm: {
        threshold: 100,
      },
      configSystemErrorsAlarm: {
        threshold: 100,
      },
      configWriteThrottleEventsAlarm: {
        threshold: 100,
      },
      configAgeOfOldestUnreplicatedRecordAlarm: {
        threshold: 100,
      },
      configFailedToReplicateRecordCountAlarm: {
      },
      configThrottledPutRecordCountAlarm: {
        threshold: 100,
      },
    }),
  );

  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForDynamoDbTableConstruct', () => {
  const app = new App();
  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.table.applyRecommendedAlarms({
    configReadThrottleEventsAlarm: {
      threshold: 100,
    },
    configSystemErrorsAlarm: {
      threshold: 100,
    },
    configWriteThrottleEventsAlarm: {
      threshold: 100,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForDynamoDbTableConstructWithReplicationAlarms', () => {
  const app = new App();
  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.table.applyRecommendedAlarms({
    configReadThrottleEventsAlarm: {
      threshold: 100,
    },
    configSystemErrorsAlarm: {
      threshold: 100,
    },
    configWriteThrottleEventsAlarm: {
      threshold: 100,
    },
    configAgeOfOldestUnreplicatedRecordAlarm: {
      threshold: 100,
    },
    configFailedToReplicateRecordCountAlarm: {
    },
    configThrottledPutRecordCountAlarm: {
      threshold: 100,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DynamoDbTableSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new dynamodbAlarms.DynamoDbTableRecommendedAlarms(stack, 'dynamodbTableAlarms', {
    table: stack.table,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configReadThrottleEventsAlarm: {
      threshold: 100,
    },
    configSystemErrorsAlarm: {
      threshold: 100,
    },
    configWriteThrottleEventsAlarm: {
      threshold: 100,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DynamoDbTableSnapshotDefaultActionsInUseWithReplicationAlarms', () => {
  const app = new App();
  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new dynamodbAlarms.DynamoDbTableRecommendedAlarms(stack, 'dynamodbTableAlarms', {
    table: stack.table,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configReadThrottleEventsAlarm: {
      threshold: 100,
    },
    configSystemErrorsAlarm: {
      threshold: 100,
    },
    configWriteThrottleEventsAlarm: {
      threshold: 100,
    },
    configAgeOfOldestUnreplicatedRecordAlarm: {
      threshold: 100,
    },
    configFailedToReplicateRecordCountAlarm: {
    },
    configThrottledPutRecordCountAlarm: {
      threshold: 100,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain table mandatory recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dynamodbAlarms.DynamoDbRecommendedAlarmsAspect({
      configReadThrottleEventsAlarm: {
        threshold: 100,
      },
      configSystemErrorsAlarm: {
        threshold: 100,
      },
      configWriteThrottleEventsAlarm: {
        threshold: 100,
      },
    }),
  );

  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
  template.resourceCountIs('AWS::CloudWatch::Alarm', mandatoryMetricsList.length);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  mandatoryMetricsList.forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('stack should contain table all recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dynamodbAlarms.DynamoDbRecommendedAlarmsAspect({
      configReadThrottleEventsAlarm: {
        threshold: 100,
      },
      configSystemErrorsAlarm: {
        threshold: 100,
      },
      configWriteThrottleEventsAlarm: {
        threshold: 100,
      },
      configAgeOfOldestUnreplicatedRecordAlarm: {
        threshold: 100,
      },
      configFailedToReplicateRecordCountAlarm: {
      },
      configThrottledPutRecordCountAlarm: {
        threshold: 100,
      },
    }),
  );

  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
  template.resourceCountIs('AWS::CloudWatch::Alarm', allMetricsList.length);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  allMetricsList.forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('mandatory alarms can be applied individually to resources using extended construct', () => {
  const app = new App();
  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.table.alarmReadThrottleEvents({
    threshold: 100,
  });
  stack.table.alarmSystemErrors({
    threshold: 100,
  });
  stack.table.alarmWriteThrottleEvents({
    threshold: 100,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  template.resourceCountIs('AWS::CloudWatch::Alarm', mandatoryMetricsList.length);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  mandatoryMetricsList.forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('all alarms can be applied individually to resources using extended construct', () => {
  const app = new App();
  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.table.alarmReadThrottleEvents({
    threshold: 100,
  });
  stack.table.alarmSystemErrors({
    threshold: 100,
  });
  stack.table.alarmWriteThrottleEvents({
    threshold: 100,
  });
  stack.table.alarmAgeOfOldestUnreplicatedRecord({
    threshold: 100,
  });
  stack.table.alarmFailedToReplicateRecordCount({});
  stack.table.alarmThrottledPutRecordCount({
    threshold: 100,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  template.resourceCountIs('AWS::CloudWatch::Alarm', allMetricsList.length);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  allMetricsList.forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('when an resource is excluded from the aspect config it should not have alarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new dynamodbAlarms.DynamoDbRecommendedAlarmsAspect({
      excludeResources: ['Table1'],
      configReadThrottleEventsAlarm: {
        threshold: 100,
      },
      configSystemErrorsAlarm: {
        threshold: 100,
      },
      configWriteThrottleEventsAlarm: {
        threshold: 100,
      },
    }),
  );

  new dynamodb.Table(stack, 'Table1', {
    tableName: 'Table1',
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    readCapacity: 5,
    writeCapacity: 5,
  });

  new dynamodb.Table(stack, 'Table2', {
    tableName: 'Table2',
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    readCapacity: 5,
    writeCapacity: 5,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  template.resourceCountIs('AWS::CloudWatch::Alarm', mandatoryMetricsList.length);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Table1', 'Table2'].forEach(tableName => {
    mandatoryMetricsList.forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(tableName) && resourceProperties.MetricName === metricName;
      });
      if (tableName === 'Table1') {
        expect(alarms.length).toEqual(0);
      } else {
        expect(alarms.length).toEqual(1);
      }
    });
  });
});

test('default alarm actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new DynamoDbTableStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');

  const alarmLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new dynamodbAlarms.DynamoDbTableRecommendedAlarms(stack, 'dynamodbTableAlarms', {
    table: stack.table,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configReadThrottleEventsAlarm: {
      threshold: 100,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configSystemErrorsAlarm: {
      threshold: 10,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configWriteThrottleEventsAlarm: {
      threshold: 100,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  mandatoryMetricsList.forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
    }));
  });
});

test('optional alarm configurations can be overwritten', () => {
  const app = new App();
  const appAspects = Aspects.of(app);
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');
  const topicAction = new cloudwatch_actions.SnsAction(topic);

  appAspects.add(
    new dynamodbAlarms.DynamoDbRecommendedAlarmsAspect({
      configReadThrottleEventsAlarm: {
        alarmName: 'CustomReadThrottleEventsAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configSystemErrorsAlarm: {
        alarmName: 'CustomSystemErrorsAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configWriteThrottleEventsAlarm: {
        alarmName: 'CustomWriteThrottleEventsAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
    }),
  );

  new dynamodbAlarms.Table(stack, 'Table', {
    tableName: 'Table',
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    readCapacity: 5,
    writeCapacity: 5,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  mandatoryMetricsList.forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmName: Match.stringLikeRegexp('^Custom.*'),
      Period: 300,
      EvaluationPeriods: 25,
      DatapointsToAlarm: 25,
      AlarmDescription: 'Custom alarm description',
      TreatMissingData: 'ignore',
      AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
    }));
  });
});

test('optional alarm configurations can be overwritten (include replication alarms)', () => {
  const app = new App();
  const appAspects = Aspects.of(app);
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');
  const topicAction = new cloudwatch_actions.SnsAction(topic);

  appAspects.add(
    new dynamodbAlarms.DynamoDbRecommendedAlarmsAspect({
      configReadThrottleEventsAlarm: {
        alarmName: 'CustomReadThrottleEventsAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configSystemErrorsAlarm: {
        alarmName: 'CustomSystemErrorsAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configWriteThrottleEventsAlarm: {
        alarmName: 'CustomWriteThrottleEventsAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configAgeOfOldestUnreplicatedRecordAlarm: {
        alarmName: 'CustomAgeOfOldestUnreplicatedRecordAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configFailedToReplicateRecordCountAlarm: {
        alarmName: 'CustomFailedToReplicateRecordCountAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configThrottledPutRecordCountAlarm: {
        alarmName: 'CustomThrottledPutRecordCountAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
    }),
  );

  new dynamodbAlarms.Table(stack, 'Table', {
    tableName: 'Table',
    partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    readCapacity: 5,
    writeCapacity: 5,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  allMetricsList.forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmName: Match.stringLikeRegexp('^Custom.*'),
      Period: 300,
      EvaluationPeriods: 25,
      DatapointsToAlarm: 25,
      AlarmDescription: 'Custom alarm description',
      TreatMissingData: 'ignore',
      AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
    }));
  });
});
