import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_ecs_patterns as ecs_patterns,
  aws_lambda as lambda,
  aws_sns as sns,
  App,
  Duration,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  Match,
  Template,
} from 'aws-cdk-lib/assertions';
import * as privatelinkAlarms from '../src/privatelink';

class PrivateLinkInterfaceVpcEndpointStack extends Stack {

  public readonly endpoint: privatelinkAlarms.InterfaceVpcEndpoint;
  public readonly vpc: ec2.Vpc;
  public readonly selectedSubnets: ec2.SelectedSubnets;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'VPC');

    this.selectedSubnets = this.vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS });

    this.endpoint = new privatelinkAlarms.InterfaceVpcEndpoint(this, 'InterfaceVpcEndpoint', {
      vpc: this.vpc,
      service: ec2.InterfaceVpcEndpointAwsService.S3,
      subnets: {
        subnets: this.selectedSubnets.subnets,
      },
      privateDnsEnabled: true,
    });
  }
}

class PrivateLinkVpcEndpointServiceStack extends Stack {
  public readonly vpc: ec2.Vpc;
  public readonly endpointService : privatelinkAlarms.VpcEndpointService;
  public readonly fargateService: ecs_patterns.ApplicationLoadBalancedFargateService;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
    });

    const cluster = new ecs.Cluster(this, 'EcsCluster', {
      vpc: this.vpc,
    });

    this.fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'FargateService', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
      publicLoadBalancer: true,
    });

    this.endpointService = new privatelinkAlarms.VpcEndpointService(this, 'VpcEndpointService', {
      vpcEndpointServiceLoadBalancers: [this.fargateService.loadBalancer],
      acceptanceRequired: true,
    });
  }
}

test('SnapshotForPrivateLinkInterfaceVpcEndpointConstruct', () => {
  const app = new App();
  const stack = new PrivateLinkInterfaceVpcEndpointStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.endpoint.applyRecommendedAlarms({
    configPacketsDroppedAlarm: {
      threshold: 10,
      vpcId: stack.vpc.vpcId,
      endpointType: ec2.VpcEndpointType.GATEWAY,
      serviceName: ec2.InterfaceVpcEndpointAwsService.S3.name,
      subnets: stack.selectedSubnets.subnets,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForPrivateLinkVpcEndpointServiceConstruct', () => {
  const app = new App();
  const stack = new PrivateLinkVpcEndpointServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.endpointService.applyRecommendedAlarms({
    configRstPacketsSentAlarm: {
      threshold: 10,
      loadBalancerArn: stack.fargateService.loadBalancer.loadBalancerArn,
      azs: stack.vpc.availabilityZones,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForPrivateLinkInterfaceVpcEndpointConstructWithExclusions', () => {
  const app = new App();
  const stack = new PrivateLinkInterfaceVpcEndpointStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.endpoint.applyRecommendedAlarms({
    excludeAlarms: [privatelinkAlarms.PrivateLinkEndpointsRecommendedAlarmsMetrics.PACKETS_DROPPED],
    configPacketsDroppedAlarm: {
      threshold: 10,
      vpcId: stack.vpc.vpcId,
      endpointType: ec2.VpcEndpointType.GATEWAY,
      serviceName: ec2.InterfaceVpcEndpointAwsService.S3.name,
      subnets: stack.selectedSubnets.subnets,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForPrivateLinkVpcEndpointServiceConstructWithExclusions', () => {
  const app = new App();
  const stack = new PrivateLinkVpcEndpointServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.endpointService.applyRecommendedAlarms({
    excludeAlarms: [privatelinkAlarms.PrivateLinkServicesRecommendedAlarmsMetrics.RST_PACKETS_SENT],
    configRstPacketsSentAlarm: {
      threshold: 10,
      loadBalancerArn: stack.fargateService.loadBalancer.loadBalancerArn,
      azs: stack.vpc.availabilityZones,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('PrivateLinkInterfaceVpcEndpointSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new PrivateLinkInterfaceVpcEndpointStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new privatelinkAlarms.PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarms(stack, 'privatelinkInterfaceVpcEndpointAlarms', {
    endpoint: stack.endpoint,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configPacketsDroppedAlarm: {
      threshold: 10,
      vpcId: stack.vpc.vpcId,
      endpointType: ec2.VpcEndpointType.GATEWAY,
      serviceName: ec2.InterfaceVpcEndpointAwsService.S3.name,
      subnets: stack.selectedSubnets.subnets,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('PrivateLinkVpcEndpointServiceSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new PrivateLinkVpcEndpointServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new privatelinkAlarms.PrivateLinkServicesVpcEndpointServiceRecommendedAlarms(stack, 'privatelinkVpcEndpointServiceAlarms', {
    endpointService: stack.endpointService,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configRstPacketsSentAlarm: {
      threshold: 10,
      loadBalancerArn: stack.fargateService.loadBalancer.loadBalancerArn,
      azs: stack.vpc.availabilityZones,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('InterfaceVpcEndpoint alarms can be applied individually to resources using extended construct', () => {
  const app = new App();
  const stack = new PrivateLinkInterfaceVpcEndpointStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.endpoint.alarmPacketsDropped({
    threshold: 10,
    vpcId: stack.vpc.vpcId,
    endpointType: ec2.VpcEndpointType.GATEWAY,
    serviceName: ec2.InterfaceVpcEndpointAwsService.S3.name,
    subnets: stack.selectedSubnets.subnets,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(privatelinkAlarms.PrivateLinkEndpointsRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics * stack.selectedSubnets.subnets.length);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(privatelinkAlarms.PrivateLinkEndpointsRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(stack.selectedSubnets.subnets.length);
  });
});

test('VpcEndpointService alarms can be applied individually to resources using extended construct', () => {
  const app = new App();
  const stack = new PrivateLinkVpcEndpointServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.endpointService.alarmRstPacketsSent({
    threshold: 10,
    loadBalancerArn: stack.fargateService.loadBalancer.loadBalancerArn,
    azs: stack.vpc.availabilityZones,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(privatelinkAlarms.PrivateLinkServicesRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics * stack.vpc.availabilityZones.length);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(privatelinkAlarms.PrivateLinkServicesRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(stack.vpc.availabilityZones.length);
  });
});

test('InterfaceVpcEndpoint default alarm actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new PrivateLinkInterfaceVpcEndpointStack(app, 'TestStack', {
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

  new privatelinkAlarms.PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarms(stack, 'privatelinkInterfaceVpcEndpointAlarms', {
    endpoint: stack.endpoint,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configPacketsDroppedAlarm: {
      threshold: 10,
      vpcId: stack.vpc.vpcId,
      endpointType: ec2.VpcEndpointType.GATEWAY,
      serviceName: ec2.InterfaceVpcEndpointAwsService.S3.name,
      subnets: stack.selectedSubnets.subnets,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(privatelinkAlarms.PrivateLinkEndpointsRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
    }));
  });
});

test('VpcEnpointService default alarm actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new PrivateLinkVpcEndpointServiceStack(app, 'TestStack', {
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

  new privatelinkAlarms.PrivateLinkServicesVpcEndpointServiceRecommendedAlarms(stack, 'privatelinkVpcEndpointServiceAlarms', {
    endpointService: stack.endpointService,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configRstPacketsSentAlarm: {
      threshold: 10,
      loadBalancerArn: stack.fargateService.loadBalancer.loadBalancerArn,
      azs: stack.vpc.availabilityZones,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(privatelinkAlarms.PrivateLinkServicesRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
    }));
  });
});

test('when required attributes for InterfaceVpcEndpoint stack are not present it should throw an error', () => {
  const app = new App();

  const stack = new PrivateLinkInterfaceVpcEndpointStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  expect(() => {
    stack.endpoint.applyRecommendedAlarms({
      configPacketsDroppedAlarm: {
        threshold: 10,
        vpcId: stack.vpc.vpcId,
        endpointType: ec2.VpcEndpointType.GATEWAY,
        serviceName: ec2.InterfaceVpcEndpointAwsService.S3.name,
      },
    });
  }).toThrowError('Subnets must be provided for the PacketsDropped alarm.');

  expect(() => {
    stack.endpoint.alarmPacketsDropped({
      threshold: 10,
      vpcId: stack.vpc.vpcId,
      endpointType: ec2.VpcEndpointType.GATEWAY,
      serviceName: ec2.InterfaceVpcEndpointAwsService.S3.name,
    });
  }).toThrowError('Subnets must be provided for the PacketsDropped alarm.');
});

test('when required attributes for VpcEndpointService stack are not present it should throw an error', () => {
  const app = new App();

  const stack = new PrivateLinkVpcEndpointServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  expect(() => {
    stack.endpointService.applyRecommendedAlarms({
      configRstPacketsSentAlarm: {
        threshold: 10,
        loadBalancerArn: stack.fargateService.loadBalancer.loadBalancerArn,
      },
    });
  }).toThrowError('AZs must be provided for the RstPacketsSent alarm.');

  expect(() => {
    stack.endpointService.alarmRstPacketsSent({
      threshold: 10,
      loadBalancerArn: stack.fargateService.loadBalancer.loadBalancerArn,
    });
  }).toThrowError('AZs must be provided for the RstPacketsSent alarm.');
});

test('optional InterfaceVpcEndpoint alarm configurations can be overwritten', () => {
  const app = new App();
  const stack = new PrivateLinkInterfaceVpcEndpointStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');
  const topicAction = new cloudwatch_actions.SnsAction(topic);

  stack.endpoint.applyRecommendedAlarms({
    configPacketsDroppedAlarm: {
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
      vpcId: stack.vpc.vpcId,
      endpointType: ec2.VpcEndpointType.GATEWAY,
      serviceName: ec2.InterfaceVpcEndpointAwsService.S3.name,
      subnets: stack.selectedSubnets.subnets,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(privatelinkAlarms.PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarms).forEach(metricName => {
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

test('optional VpcEndpointService alarm configurations can be overwritten', () => {
  const app = new App();
  const stack = new PrivateLinkVpcEndpointServiceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');
  const topicAction = new cloudwatch_actions.SnsAction(topic);

  stack.endpointService.applyRecommendedAlarms({
    configRstPacketsSentAlarm: {
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
      loadBalancerArn: stack.fargateService.loadBalancer.loadBalancerArn,
      azs: stack.vpc.availabilityZones,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(privatelinkAlarms.PrivateLinkServicesVpcEndpointServiceRecommendedAlarms).forEach(metricName => {
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
