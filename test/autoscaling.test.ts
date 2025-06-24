import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_autoscaling as autoscaling,
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
import * as autoscalingAlarms from '../src/autoscaling';

class AutoScalingGroupStack extends Stack {

  public readonly autoScalingGroup: autoscalingAlarms.AutoScalingGroup;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    this.autoScalingGroup = new autoscalingAlarms.AutoScalingGroup(this, 'AutoScalingGroup', {
      vpc,
      autoScalingGroupName: 'AutoScalingGroup',
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: new ec2.AmazonLinuxImage(),
      minCapacity: 1,
      maxCapacity: 3,
    });
  }
}

test('AutoScalingGroupSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new autoscalingAlarms.AutoScalingRecommendedAlarmsAspect({
      configGroupInServiceCapacityAlarm: {
        threshold: 1,
      },
    }),
  );

  const stack = new AutoScalingGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('AutoScalingGroupSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new autoscalingAlarms.AutoScalingRecommendedAlarmsAspect({
      excludeAlarms: [autoscalingAlarms.AutoScalingRecommendedAlarmsMetrics.GROUP_IN_SERVICE_CAPACITY],
      configGroupInServiceCapacityAlarm: {
        threshold: 1,
      },
    }),
  );

  const stack = new AutoScalingGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForAutoScalingGroupConstruct', () => {
  const app = new App();
  const stack = new AutoScalingGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.autoScalingGroup.applyRecommendedAlarms(
    {
      configGroupInServiceCapacityAlarm: {
        threshold: 1,
      },
    },
  );

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('AutoScalingGroupSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new AutoScalingGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new autoscalingAlarms.AutoScalingGroupRecommendedAlarms(stack, 'autoScalingGroupAlarms', {
    autoScalingGroup: stack.autoScalingGroup,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configGroupInServiceCapacityAlarm: {
      threshold: 1,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain autoScalingGroup recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new autoscalingAlarms.AutoScalingRecommendedAlarmsAspect(
      {
        configGroupInServiceCapacityAlarm: {
          threshold: 1,
        },
      },
    ),
  );

  const stack = new AutoScalingGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(autoscalingAlarms.AutoScalingRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(autoscalingAlarms.AutoScalingRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to resources using extended construct', () => {
  const app = new App();
  const stack = new AutoScalingGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.autoScalingGroup.alarmGroupInServiceCapacity(
    {
      threshold: 1,
    },
  );

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(autoscalingAlarms.AutoScalingRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(autoscalingAlarms.AutoScalingRecommendedAlarmsMetrics).forEach(metricName => {
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
    new autoscalingAlarms.AutoScalingRecommendedAlarmsAspect({
      excludeResources: ['AutoScalingGroup1'],
      configGroupInServiceCapacityAlarm: {
        threshold: 1,
      },
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');

  new autoscaling.AutoScalingGroup(stack, 'AutoScalingGroup1', {
    vpc,
    autoScalingGroupName: 'AutoScalingGroup1',
    instanceType: new ec2.InstanceType('t2.micro'),
    machineImage: new ec2.AmazonLinuxImage(),
    minCapacity: 1,
    maxCapacity: 3,
  });

  new autoscaling.AutoScalingGroup(stack, 'AutoScalingGroup2', {
    vpc,
    autoScalingGroupName: 'AutoScalingGroup2',
    instanceType: new ec2.InstanceType('t2.micro'),
    machineImage: new ec2.AmazonLinuxImage(),
    minCapacity: 1,
    maxCapacity: 3,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(autoscalingAlarms.AutoScalingRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['AutoScalingGroup1', 'AutoScalingGroup2'].forEach(autoScalingGroupName => {
    Object.values(autoscalingAlarms.AutoScalingRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(autoScalingGroupName) && resourceProperties.MetricName === metricName;
      });
      if (autoScalingGroupName === 'AutoScalingGroup1') {
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
  const stack = new AutoScalingGroupStack(app, 'TestStack', {
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

  new autoscalingAlarms.AutoScalingGroupRecommendedAlarms(stack, 'autoscalingAutoScalingGroupAlarms', {
    autoScalingGroup: stack.autoScalingGroup,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configGroupInServiceCapacityAlarm: {
      threshold: 1,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(autoscalingAlarms.AutoScalingRecommendedAlarmsMetrics).forEach(metricName => {
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
    new autoscalingAlarms.AutoScalingRecommendedAlarmsAspect({
      configGroupInServiceCapacityAlarm: {
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

  new autoscaling.AutoScalingGroup(stack, 'AutoScalingGroup', {
    vpc,
    autoScalingGroupName: 'AutoScalingGroup',
    instanceType: new ec2.InstanceType('t2.micro'),
    machineImage: new ec2.AmazonLinuxImage(),
    minCapacity: 1,
    maxCapacity: 3,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(autoscalingAlarms.AutoScalingRecommendedAlarmsMetrics).forEach(metricName => {
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
