import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_ec2 as ec2,
  aws_ecs as ecs,
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
import * as ecsAlarms from '../src/ecs';

class EcsFargateServiceStack extends Stack {

  public readonly cluster: ecs.Cluster;

  public readonly service: ecsAlarms.FargateService;

  public readonly taskDefinition: ecs.FargateTaskDefinition;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: new ec2.Vpc(this, 'VPC'),
      containerInsights: true,
      clusterName: 'TestCluster',
    });

    this.taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 512,
      cpu: 256,
    });

    this.taskDefinition.addContainer('Container', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      memoryLimitMiB: 512,
      cpu: 256,
    });

    this.service = new ecsAlarms.FargateService(this, 'Service', {
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
    });

    this.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 10,
    });
  }
}

test('EcsServiceSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new ecsAlarms.EcsRecommendedAlarmsAspect({
      configEphemeralStorageUtilizedAlarm: {
        threshold: 90,
      },
    }),
  );

  const stack = new EcsFargateServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('EcsServiceSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new ecsAlarms.EcsRecommendedAlarmsAspect({
      excludeAlarms: [ecsAlarms.EcsRecommendedAlarmsMetrics.CPU_UTILIZATION],
      configEphemeralStorageUtilizedAlarm: {
        threshold: 90,
      },
    }),
  );

  const stack = new EcsFargateServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForEcsServiceConstruct', () => {
  const app = new App();
  const stack = new EcsFargateServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.service.applyRecommendedAlarms({
    configEphemeralStorageUtilizedAlarm: {
      threshold: 90,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('EcsServiceSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new EcsFargateServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new ecsAlarms.EcsServiceRecommendedAlarms(stack, 'ecsServiceAlarms', {
    service: stack.service,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configEphemeralStorageUtilizedAlarm: {
      threshold: 90,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain service recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new ecsAlarms.EcsRecommendedAlarmsAspect({
      configEphemeralStorageUtilizedAlarm: {
        threshold: 90,
      },
    }),
  );

  const stack = new EcsFargateServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(ecsAlarms.EcsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(ecsAlarms.EcsRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = ecsAlarms.EcsRecommendedAlarmsMetrics[metricKey as keyof typeof ecsAlarms.EcsRecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to services using extended construct', () => {
  const app = new App();
  const stack = new EcsFargateServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.service.alarmCpuUtilization();
  stack.service.alarmMemoryUtilization();
  stack.service.alarmEphemeralStorageUtilized({ threshold: 90 });
  stack.service.alarmRunningTaskCount();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(ecsAlarms.EcsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(ecsAlarms.EcsRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = ecsAlarms.EcsRecommendedAlarmsMetrics[metricKey as keyof typeof ecsAlarms.EcsRecommendedAlarmsMetrics];

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
    new ecsAlarms.EcsRecommendedAlarmsAspect({
      excludeResources: ['Service1'],
      configEphemeralStorageUtilizedAlarm: {
        threshold: 90,
      },
    }),
  );

  const cluster = new ecs.Cluster(stack, 'Cluster', {
    vpc: new ec2.Vpc(stack, 'VPC'),
    containerInsights: true,
    clusterName: 'TestCluster',
  });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
    memoryLimitMiB: 512,
    cpu: 256,
  });

  taskDefinition.addContainer('Container', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
    cpu: 256,
  });

  const service1 = new ecsAlarms.FargateService(stack, 'Service1', {
    cluster,
    taskDefinition,
  });

  service1.autoScaleTaskCount({
    minCapacity: 1,
    maxCapacity: 10,
  });

  const service2 = new ecsAlarms.FargateService(stack, 'Service2', {
    cluster,
    taskDefinition,
  });

  service2.autoScaleTaskCount({
    minCapacity: 1,
    maxCapacity: 10,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(ecsAlarms.EcsRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['Service1', 'Service2'].forEach(serviceName => {
    Object.keys(ecsAlarms.EcsRecommendedAlarmsMetrics).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;
        const metricName = ecsAlarms.EcsRecommendedAlarmsMetrics[metricKey as keyof typeof ecsAlarms.EcsRecommendedAlarmsMetrics];

        return resourceName.startsWith(serviceName) && resourceProperties.MetricName === metricName;
      });
      if (serviceName === 'Service1') {
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
  const stack = new EcsFargateServiceStack(app, 'TestStack', {
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

  new ecsAlarms.EcsServiceRecommendedAlarms(stack, 'ecsServiceAlarms', {
    service: stack.service,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configCpuUtilizationAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configMemoryUtilizationAlarm: {
      threshold: 10,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configEphemeralStorageUtilizedAlarm: {
      threshold: 5,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configRunningTaskCountAlarm: {
      threshold: 0,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(ecsAlarms.EcsRecommendedAlarmsMetrics).forEach(metricName => {
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
    new ecsAlarms.EcsRecommendedAlarmsAspect({
      configCpuUtilizationAlarm: {
        alarmName: 'CustomCpuUtilizationAlarm',
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
      configMemoryUtilizationAlarm: {
        alarmName: 'CustomMemoryUtilizationAlarm',
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
      configEphemeralStorageUtilizedAlarm: {
        alarmName: 'CustomEphemeralStorageUtilizedAlarm',
        threshold: 5,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configRunningTaskCountAlarm: {
        alarmName: 'CustomRunningTaskCountAlarm',
        threshold: 20,
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

  const cluster = new ecs.Cluster(stack, 'Cluster', {
    vpc: new ec2.Vpc(stack, 'VPC'),
    containerInsights: true,
    clusterName: 'TestCluster',
  });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
    memoryLimitMiB: 512,
    cpu: 256,
  });

  taskDefinition.addContainer('Container', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
    cpu: 256,
  });

  const service = new ecsAlarms.FargateService(stack, 'Service1', {
    cluster,
    taskDefinition,
  });

  service.autoScaleTaskCount({
    minCapacity: 1,
    maxCapacity: 10,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(ecsAlarms.EcsRecommendedAlarmsMetrics).forEach(metricName => {
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
