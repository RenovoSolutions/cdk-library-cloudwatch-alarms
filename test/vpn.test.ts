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
import * as vpnAlarms from '../src/vpn';

class VpnConnectionStack extends Stack {

  public readonly vpnConnection: vpnAlarms.VpnConnection;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const vpnGateway = new ec2.CfnVPNGateway(this, 'VpnGateway', {
      type: 'ipsec.1',
      amazonSideAsn: 65000,
    });

    new ec2.CfnVPCGatewayAttachment(this, 'VpcGatewayAttachment', {
      vpcId: vpc.vpcId,
      vpnGatewayId: vpnGateway.ref,
    });

    const customerGateway = new ec2.CfnCustomerGateway(this, 'CustomerGateway', {
      bgpAsn: 65000,
      ipAddress: '203.0.113.12', // Replace with the actual customer gateway IP address
      type: 'ipsec.1',
    });

    this.vpnConnection = new vpnAlarms.VpnConnection(this, 'VpnConnection', {
      type: 'ipsec.1',
      customerGatewayId: customerGateway.ref,
      vpnGatewayId: vpnGateway.ref,
      staticRoutesOnly: true,
    });
  }
}

test('VpnConnectionSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new vpnAlarms.VpnRecommendedAlarmsAspect(),
  );

  const stack = new VpnConnectionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('VpnConnectionSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new vpnAlarms.VpnRecommendedAlarmsAspect({
      excludeAlarms: [vpnAlarms.VpnRecommendedAlarmsMetrics.TUNNEL_STATE],
    }),
  );

  const stack = new VpnConnectionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForVpnConnectionConstruct', () => {
  const app = new App();
  const stack = new VpnConnectionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.vpnConnection.applyRecommendedAlarms();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('VpnConnectionSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new VpnConnectionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new vpnAlarms.VpnConnectionRecommendedAlarms(stack, 'vpnConnectionAlarms', {
    vpnConnection: stack.vpnConnection,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain vpnConnection recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new vpnAlarms.VpnRecommendedAlarmsAspect(),
  );

  const stack = new VpnConnectionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(vpnAlarms.VpnRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(vpnAlarms.VpnRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = vpnAlarms.VpnRecommendedAlarmsMetrics[metricKey as keyof typeof vpnAlarms.VpnRecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to resources using extended construct', () => {
  const app = new App();
  const stack = new VpnConnectionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.vpnConnection.alarmTunnelState();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(vpnAlarms.VpnRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(vpnAlarms.VpnRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = vpnAlarms.VpnRecommendedAlarmsMetrics[metricKey as keyof typeof vpnAlarms.VpnRecommendedAlarmsMetrics];

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
    new vpnAlarms.VpnRecommendedAlarmsAspect({
      excludeResources: ['VpnConnection1'],
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');

  const vpnGateway = new ec2.CfnVPNGateway(stack, 'VpnGateway', {
    type: 'ipsec.1',
    amazonSideAsn: 65000,
  });

  new ec2.CfnVPCGatewayAttachment(stack, 'VpcGatewayAttachment', {
    vpcId: vpc.vpcId,
    vpnGatewayId: vpnGateway.ref,
  });

  const customerGateway1 = new ec2.CfnCustomerGateway(stack, 'CustomerGateway1', {
    bgpAsn: 65000,
    ipAddress: '203.0.113.12', // Replace with the actual customer gateway IP address
    type: 'ipsec.1',
  });

  const customerGateway2 = new ec2.CfnCustomerGateway(stack, 'CustomerGateway2', {
    bgpAsn: 65000,
    ipAddress: '203.0.113.13', // Replace with the actual customer gateway IP address
    type: 'ipsec.1',
  });

  new ec2.CfnVPNConnection(stack, 'VpnConnection1', {
    type: 'ipsec.1',
    customerGatewayId: customerGateway1.ref,
    vpnGatewayId: vpnGateway.ref,
    staticRoutesOnly: true,
  });

  new ec2.CfnVPNConnection(stack, 'VpnConnection2', {
    type: 'ipsec.1',
    customerGatewayId: customerGateway2.ref,
    vpnGatewayId: vpnGateway.ref,
    staticRoutesOnly: true,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(vpnAlarms.VpnRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['VpnConnection1', 'VpnConnection2'].forEach(vpnConnectionName => {
    Object.keys(vpnAlarms.VpnRecommendedAlarmsMetrics).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;
        const metricName = vpnAlarms.VpnRecommendedAlarmsMetrics[metricKey as keyof typeof vpnAlarms.VpnRecommendedAlarmsMetrics];

        return resourceName.startsWith(vpnConnectionName) && resourceProperties.MetricName === metricName;
      });
      if (vpnConnectionName === 'VpnConnection1') {
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
  const stack = new VpnConnectionStack(app, 'TestStack', {
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

  new vpnAlarms.VpnConnectionRecommendedAlarms(stack, 'vpnConnectionAlarms', {
    vpnConnection: stack.vpnConnection,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configTunnelStateAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(vpnAlarms.VpnRecommendedAlarmsMetrics).forEach(metricName => {
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
    new vpnAlarms.VpnRecommendedAlarmsAspect({
      configTunnelStateAlarm: {
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
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');

  const vpnGateway = new ec2.CfnVPNGateway(stack, 'VpnGateway', {
    type: 'ipsec.1',
    amazonSideAsn: 65000,
  });

  new ec2.CfnVPCGatewayAttachment(stack, 'VpcGatewayAttachment', {
    vpcId: vpc.vpcId,
    vpnGatewayId: vpnGateway.ref,
  });

  const customerGateway = new ec2.CfnCustomerGateway(stack, 'CustomerGateway', {
    bgpAsn: 65000,
    ipAddress: '203.0.113.12', // Replace with the actual customer gateway IP address
    type: 'ipsec.1',
  });

  new ec2.CfnVPNConnection(stack, 'VpnConnection', {
    type: 'ipsec.1',
    customerGatewayId: customerGateway.ref,
    vpnGatewayId: vpnGateway.ref,
    staticRoutesOnly: true,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(vpnAlarms.VpnRecommendedAlarmsMetrics).forEach(metricName => {
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

test('AspectWithTreatMissingData', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  const stack = new VpnConnectionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  appAspects.add(
    new vpnAlarms.VpnRecommendedAlarmsAspect({
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    }),
  );

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(vpnAlarms.VpnRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      TreatMissingData: 'notBreaching',
    }));
  });
});