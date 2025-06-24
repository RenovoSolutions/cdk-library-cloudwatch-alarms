import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_ec2 as ec2,
  aws_elasticloadbalancingv2 as elbv2,
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
import * as networktargetgroupAlarms from '../src/networktargetgroup';

class NetworkTargetGroupStack extends Stack {

  public readonly vpc: ec2.Vpc;
  public readonly nlb: elbv2.NetworkLoadBalancer;
  public readonly targetGroup: networktargetgroupAlarms.NetworkTargetGroup;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'VPC');

    this.nlb = new elbv2.NetworkLoadBalancer(this, 'NLB', {
      vpc: this.vpc,
      internetFacing: true,
    });

    this.targetGroup = new networktargetgroupAlarms.NetworkTargetGroup(this, 'TargetGroup', {
      vpc: this.vpc,
      port: 80,
      protocol: elbv2.Protocol.TCP,
      targetType: elbv2.TargetType.INSTANCE,
    });

    this.nlb.addListener('Listener', {
      port: 80,
      defaultTargetGroups: [this.targetGroup],
    });
  }
}

test('NetworkTargetGroupSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsAspect({}),
  );

  const stack = new NetworkTargetGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('NetworkTargetGroupSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsAspect({
      excludeAlarms: [networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics.HEALTHY_HOST_COUNT],
    }),
  );

  const stack = new NetworkTargetGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForNetworkTargetGroupConstruct', () => {
  const app = new App();
  const stack = new NetworkTargetGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.targetGroup.applyRecommendedAlarms({});

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('NetworkTargetGroupSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new NetworkTargetGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarms(stack, 'networkTargetGroupAlarms', {
    targetGroup: stack.targetGroup,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain target group recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsAspect({}),
  );

  const stack = new NetworkTargetGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = networktargetgroupAlarms.
        NetworkTargetGroupRecommendedAlarmsMetrics
        [metricKey as keyof typeof networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to target groups using extended construct', () => {
  const app = new App();
  const stack = new NetworkTargetGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.targetGroup.alarmHealthyHostCount();
  stack.targetGroup.alarmUnHealthyHostCount();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = networktargetgroupAlarms.
        NetworkTargetGroupRecommendedAlarmsMetrics
        [metricKey as keyof typeof networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics];

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
    new networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsAspect({
      excludeResources: ['TargetGroup1'],
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');
  const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
    vpc,
    internetFacing: true,
  });

  const targetGroup1 = new networktargetgroupAlarms.NetworkTargetGroup(stack, 'TargetGroup1', {
    vpc,
    port: 80,
    protocol: elbv2.Protocol.TCP,
    targetType: elbv2.TargetType.INSTANCE,
  });

  const targetGroup2 = new networktargetgroupAlarms.NetworkTargetGroup(stack, 'TargetGroup2', {
    vpc,
    port: 443,
    protocol: elbv2.Protocol.TCP,
    targetType: elbv2.TargetType.INSTANCE,
  });

  nlb.addListener('Listener1', {
    port: 80,
    defaultTargetGroups: [targetGroup1],
  });

  nlb.addListener('Listener2', {
    port: 443,
    defaultTargetGroups: [targetGroup2],
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['TargetGroup1', 'TargetGroup2'].forEach(targetGroupName => {
    Object.keys(networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;
        const metricName = networktargetgroupAlarms.
          NetworkTargetGroupRecommendedAlarmsMetrics
          [metricKey as keyof typeof networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics];

        return resourceName.startsWith(targetGroupName) && resourceProperties.MetricName === metricName;
      });
      if (targetGroupName === 'TargetGroup1') {
        expect(alarms.length).toEqual(0);
      } else {
        expect(alarms.length).toEqual(1);
      }
    });
  });
});

test('default actions are applied when no specific actions are provided', () => {
  const app = new App();
  const stack = new NetworkTargetGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');
  const alarmAction = new cloudwatch_actions.SnsAction(alarmTopic);
  const okAction = new cloudwatch_actions.SnsAction(alarmTopic);
  const insufficientDataAction = new cloudwatch_actions.SnsAction(alarmTopic);

  // Create alarms with default actions but no specific actions in the config
  new networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarms(stack, 'networkTargetGroupAlarms', {
    targetGroup: stack.targetGroup,
    defaultAlarmAction: alarmAction,
    defaultOkAction: okAction,
    defaultInsufficientDataAction: insufficientDataAction,
    configHealthyHostCountAlarm: {
      threshold: 2,
    },
    configUnHealthyHostCountAlarm: {
      threshold: 1,
    },
  });

  const template = Template.fromStack(stack);

  // Verify that both alarms have the default actions
  Object.values(networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
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
    new networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsAspect({
      configHealthyHostCountAlarm: {
        alarmName: 'CustomHealthyHostCountAlarm',
        threshold: 2,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configUnHealthyHostCountAlarm: {
        alarmName: 'CustomUnHealthyHostCountAlarm',
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
  const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
    vpc,
    internetFacing: true,
  });

  const targetGroup = new networktargetgroupAlarms.NetworkTargetGroup(stack, 'TargetGroup', {
    vpc,
    port: 80,
    protocol: elbv2.Protocol.TCP,
    targetType: elbv2.TargetType.INSTANCE,
  });

  nlb.addListener('Listener', {
    port: 80,
    defaultTargetGroups: [targetGroup],
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics).forEach(metricName => {
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

  appAspects.add(
    new networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsAspect({
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    }),
  );

  const stack = new NetworkTargetGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(networktargetgroupAlarms.NetworkTargetGroupRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      TreatMissingData: 'notBreaching',
    }));
  });
});