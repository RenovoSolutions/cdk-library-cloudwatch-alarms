import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_ec2 as ec2,
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
import * as networkloadbalancerAlarms from '../src/networkloadbalancer';

class NetworkLoadBalancerStack extends Stack {

  public readonly vpc: ec2.Vpc;
  public readonly loadBalancer: networkloadbalancerAlarms.NetworkLoadBalancer;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'VPC');

    this.loadBalancer = new networkloadbalancerAlarms.NetworkLoadBalancer(this, 'NLB', {
      vpc: this.vpc,
      internetFacing: true,
    });
  }
}

test('NetworkLoadBalancerSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsAspect({}),
  );

  const stack = new NetworkLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('NetworkLoadBalancerSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsAspect({
      excludeAlarms: [networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics.TCP_ELB_RESET_COUNT],
    }),
  );

  const stack = new NetworkLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForNetworkLoadBalancerConstruct', () => {
  const app = new App();
  const stack = new NetworkLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.loadBalancer.applyRecommendedAlarms({});

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('NetworkLoadBalancerSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new NetworkLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarms(stack, 'networkLoadBalancerAlarms', {
    loadBalancer: stack.loadBalancer,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain load balancer recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsAspect({}),
  );

  const stack = new NetworkLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = networkloadbalancerAlarms.
        NetworkLoadBalancerRecommendedAlarmsMetrics
        [metricKey as keyof typeof networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to load balancers using extended construct', () => {
  const app = new App();
  const stack = new NetworkLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.loadBalancer.alarmTcpElbResetCount();
  stack.loadBalancer.alarmTcpTargetResetCount();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = networkloadbalancerAlarms.
        NetworkLoadBalancerRecommendedAlarmsMetrics
        [metricKey as keyof typeof networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics];

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
    new networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsAspect({
      excludeResources: ['NLB1'],
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');

  new networkloadbalancerAlarms.NetworkLoadBalancer(stack, 'NLB1', {
    vpc,
    internetFacing: true,
  });

  new networkloadbalancerAlarms.NetworkLoadBalancer(stack, 'NLB2', {
    vpc,
    internetFacing: false,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['NLB1', 'NLB2'].forEach(nlbName => {
    Object.keys(networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;
        const metricName = networkloadbalancerAlarms.
          NetworkLoadBalancerRecommendedAlarmsMetrics
          [metricKey as keyof typeof networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics];

        return resourceName.startsWith(nlbName) && resourceProperties.MetricName === metricName;
      });
      if (nlbName === 'NLB1') {
        expect(alarms.length).toEqual(0);
      } else {
        expect(alarms.length).toEqual(1);
      }
    });
  });
});

test('default actions are applied when no specific actions are provided', () => {
  const app = new App();
  const stack = new NetworkLoadBalancerStack(app, 'TestStack', {
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
  new networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarms(stack, 'networkLoadBalancerAlarms', {
    loadBalancer: stack.loadBalancer,
    defaultAlarmAction: alarmAction,
    defaultOkAction: okAction,
    defaultInsufficientDataAction: insufficientDataAction,
    configTcpElbResetCountAlarm: {
      threshold: 5,
    },
    configTcpTargetResetCountAlarm: {
      threshold: 5,
    },
  });

  const template = Template.fromStack(stack);

  // Verify that both alarms have the default actions
  Object.values(networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics).forEach(metricName => {
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
    new networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsAspect({
      configTcpElbResetCountAlarm: {
        alarmName: 'CustomTcpElbResetCountAlarm',
        threshold: 5,
        period: Duration.minutes(5),
        evaluationPeriods: 10,
        datapointsToAlarm: 10,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configTcpTargetResetCountAlarm: {
        alarmName: 'CustomTcpTargetResetCountAlarm',
        threshold: 5,
        period: Duration.minutes(5),
        evaluationPeriods: 10,
        datapointsToAlarm: 10,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');
  new networkloadbalancerAlarms.NetworkLoadBalancer(stack, 'NLB', {
    vpc,
    internetFacing: true,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(networkloadbalancerAlarms.NetworkLoadBalancerRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmName: Match.stringLikeRegexp('^Custom.*'),
      Period: 300,
      EvaluationPeriods: 10,
      DatapointsToAlarm: 10,
      AlarmDescription: 'Custom alarm description',
      TreatMissingData: 'ignore',
      AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
    }));
  });
});