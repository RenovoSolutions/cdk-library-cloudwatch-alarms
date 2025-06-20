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
import * as applicationloadbalancerAlarms from '../src/applicationloadbalancer';

class ApplicationLoadBalancerStack extends Stack {

  public readonly vpc: ec2.Vpc;
  public readonly loadBalancer: applicationloadbalancerAlarms.ApplicationLoadBalancer;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'VPC');

    this.loadBalancer = new applicationloadbalancerAlarms.ApplicationLoadBalancer(this, 'ALB', {
      vpc: this.vpc,
      internetFacing: true,
    });
  }
}

test('ApplicationLoadBalancerSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsAspect({}),
  );

  const stack = new ApplicationLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('ApplicationLoadBalancerSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsAspect({
      excludeAlarms: [applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics.HTTP_CODE_ELB_4XX_COUNT],
    }),
  );

  const stack = new ApplicationLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForApplicationLoadBalancerConstruct', () => {
  const app = new App();
  const stack = new ApplicationLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.loadBalancer.applyRecommendedAlarms({});

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('ApplicationLoadBalancerSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new ApplicationLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarms(stack, 'applicationLoadBalancerAlarms', {
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
    new applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsAspect({}),
  );

  const stack = new ApplicationLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = applicationloadbalancerAlarms.
        ApplicationLoadBalancerRecommendedAlarmsMetrics
        [metricKey as keyof typeof applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to load balancers using extended construct', () => {
  const app = new App();
  const stack = new ApplicationLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.loadBalancer.alarmRejectedConnectionCount();
  stack.loadBalancer.alarmHttpCode4xxCount();
  stack.loadBalancer.alarmHttpCode5xxCount();
  stack.loadBalancer.alarmHttpCodeTarget5xxCount();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = applicationloadbalancerAlarms.
        ApplicationLoadBalancerRecommendedAlarmsMetrics
        [metricKey as keyof typeof applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics];

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
    new applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsAspect({
      excludeResources: ['ALB1'],
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');

  new applicationloadbalancerAlarms.ApplicationLoadBalancer(stack, 'ALB1', {
    vpc,
    internetFacing: true,
  });

  new applicationloadbalancerAlarms.ApplicationLoadBalancer(stack, 'ALB2', {
    vpc,
    internetFacing: false,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['ALB1', 'ALB2'].forEach(albName => {
    Object.keys(applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;
        const metricName = applicationloadbalancerAlarms.
          ApplicationLoadBalancerRecommendedAlarmsMetrics
          [metricKey as keyof typeof applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics];

        return resourceName.startsWith(albName) && resourceProperties.MetricName === metricName;
      });
      if (albName === 'ALB1') {
        expect(alarms.length).toEqual(0);
      } else {
        expect(alarms.length).toEqual(1);
      }
    });
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
    new applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsAspect({
      configRejectedConnectionCountAlarm: {
        alarmName: 'CustomRejectedConnectionCountAlarm',
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
      configHttpCode4xxCountAlarm: {
        alarmName: 'CustomHttpCode4xxCountAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 10,
        datapointsToAlarm: 10,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configHttpCode5xxCountAlarm: {
        alarmName: 'CustomHttpCode5xxCountAlarm',
        threshold: 1,
        period: Duration.minutes(5),
        evaluationPeriods: 10,
        datapointsToAlarm: 10,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configHttpCodeTarget5xxCountAlarm: {
        alarmName: 'CustomHttpCodeTarget5xxCountAlarm',
        threshold: 1,
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
  new applicationloadbalancerAlarms.ApplicationLoadBalancer(stack, 'ALB', {
    vpc,
    internetFacing: true,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics).forEach(metricName => {
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

test('default actions are applied when no specific actions are provided', () => {
  const app = new App();
  const stack = new ApplicationLoadBalancerStack(app, 'TestStack', {
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
  new applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarms(stack, 'applicationTargetGroupAlarms', {
    loadBalancer: stack.loadBalancer,
    defaultAlarmAction: alarmAction,
    defaultOkAction: okAction,
    defaultInsufficientDataAction: insufficientDataAction,
    configRejectedConnectionCountAlarm: {
      threshold: 5,
    },
    configHttpCode4xxCountAlarm: {
      threshold: 10,
    },
    configHttpCode5xxCountAlarm: {
      threshold: 1,
    },
    configHttpCodeTarget5xxCountAlarm: {
      threshold: 1,
    },
  });

  const template = Template.fromStack(stack);

  // Verify that both alarms have the default actions
  Object.values(applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
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
    new applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsAspect({
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    }),
  );

  const stack = new ApplicationLoadBalancerStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(applicationloadbalancerAlarms.ApplicationLoadBalancerRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      TreatMissingData: 'notBreaching',
    }));
  });
});