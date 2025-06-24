import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_ec2 as ec2,
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
import * as ec2Alarms from '../src/ec2';

class Ec2InstanceStack extends Stack {

  public readonly instance: ec2Alarms.Instance;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    this.instance = new ec2Alarms.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
    });
  }
}

test('Ec2InstanceSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new ec2Alarms.Ec2RecommendedAlarmsAspect(),
  );

  const stack = new Ec2InstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('Ec2InstanceSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new ec2Alarms.Ec2RecommendedAlarmsAspect({
      excludeAlarms: [ec2Alarms.Ec2RecommendedAlarmsMetrics.CPU_UTILIZATION],
    }),
  );

  const stack = new Ec2InstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForEc2InstanceConstruct', () => {
  const app = new App();
  const stack = new Ec2InstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.instance.applyRecommendedAlarms();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('Ec2InstanceSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new Ec2InstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new ec2Alarms.Ec2InstanceRecommendedAlarms(stack, 'ec2InstanceAlarms', {
    instance: stack.instance,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain instance recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new ec2Alarms.Ec2RecommendedAlarmsAspect(),
  );

  const stack = new Ec2InstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(ec2Alarms.Ec2RecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(ec2Alarms.Ec2RecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = ec2Alarms.Ec2RecommendedAlarmsMetrics[metricKey as keyof typeof ec2Alarms.Ec2RecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to resources using extended construct', () => {
  const app = new App();
  const stack = new Ec2InstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.instance.alarmCpuUtilization();
  stack.instance.alarmStatusCheckFailed();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(ec2Alarms.Ec2RecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(ec2Alarms.Ec2RecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = ec2Alarms.Ec2RecommendedAlarmsMetrics[metricKey as keyof typeof ec2Alarms.Ec2RecommendedAlarmsMetrics];

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
    new ec2Alarms.Ec2RecommendedAlarmsAspect({
      excludeResources: ['Instance1'],
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');

  new ec2.Instance(stack, 'Instance1', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    machineImage: new ec2.AmazonLinuxImage(),
  });

  new ec2.Instance(stack, 'Instance2', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    machineImage: new ec2.AmazonLinuxImage(),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(ec2Alarms.Ec2RecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['Instance1', 'Instance2'].forEach(instanceName => {
    Object.keys(ec2Alarms.Ec2RecommendedAlarmsMetrics).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;
        const metricName = ec2Alarms.Ec2RecommendedAlarmsMetrics[metricKey as keyof typeof ec2Alarms.Ec2RecommendedAlarmsMetrics];

        return resourceName.startsWith(instanceName) && resourceProperties.MetricName === metricName;
      });
      if (instanceName === 'Instance1') {
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
  const stack = new Ec2InstanceStack(app, 'TestStack', {
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

  new ec2Alarms.Ec2InstanceRecommendedAlarms(stack, 'ec2InstanceAlarms', {
    instance: stack.instance,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configCpuUtilizationAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configStatusCheckFailedAlarm: {
      threshold: 1,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(ec2Alarms.Ec2RecommendedAlarmsMetrics).forEach(metricName => {
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
    new ec2Alarms.Ec2RecommendedAlarmsAspect({
      configCpuUtilizationAlarm: {
        alarmName: 'CustomPercentIOLimitAlarm',
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
      configStatusCheckFailedAlarm: {
        alarmName: 'CustomBurstCreditBalanceAlarm',
        threshold: 1,
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

  const vpc = new ec2.Vpc(stack, 'VPC');

  new ec2.Instance(stack, 'Instance1', {
    vpc,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
    machineImage: new ec2.AmazonLinuxImage(),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(ec2Alarms.Ec2RecommendedAlarmsMetrics).forEach(metricName => {
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
