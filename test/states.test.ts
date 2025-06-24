import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_stepfunctions as sfn,
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
import * as sfAlarms from '../src/states';

class SfStateMachineStack extends Stack {

  public readonly stateMachine: sfAlarms.StateMachine;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const definitionBody = JSON.stringify({
      StartAt: 'PassState',
      States: {
        PassState: {
          Type: 'Pass',
          Result: {
            Value: 'Hello, Step Functions!',
          },
          End: true,
        },
      },
    });

    this.stateMachine = new sfAlarms.StateMachine(this, 'StateMachine', {
      stateMachineName: 'TestStateMachine',
      definitionBody: sfn.DefinitionBody.fromString(JSON.stringify(definitionBody)),
    });
  }
}

test('SfStateMachineSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new sfAlarms.SfRecommendedAlarmsAspect({
      configExecutionTimeAlarm: {
        threshold: Duration.minutes(5).toMilliseconds(),
      },
    }),
  );

  const stack = new SfStateMachineStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SfStateMachineSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new sfAlarms.SfRecommendedAlarmsAspect({
      excludeAlarms: [sfAlarms.SfRecommendedAlarmsMetrics.EXECUTION_TIME],
      configExecutionTimeAlarm: {
        threshold: Duration.minutes(5).toMilliseconds(),
      },
    }),
  );

  const stack = new SfStateMachineStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForSfStateMachineConstruct', () => {
  const app = new App();
  const stack = new SfStateMachineStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.stateMachine.applyRecommendedAlarms({
    configExecutionTimeAlarm: {
      threshold: Duration.minutes(5).toMilliseconds(),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SfStateMachineSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new SfStateMachineStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new sfAlarms.SfStateMachineRecommendedAlarms(stack, 'sfStateMachineAlarms', {
    stateMachine: stack.stateMachine,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configExecutionTimeAlarm: {
      threshold: Duration.minutes(5).toMilliseconds(),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain stateMachine recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new sfAlarms.SfRecommendedAlarmsAspect({
      configExecutionTimeAlarm: {
        threshold: Duration.minutes(5).toMilliseconds(),
      },
    }),
  );

  const stack = new SfStateMachineStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(sfAlarms.SfRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(sfAlarms.SfRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = sfAlarms.SfRecommendedAlarmsMetrics[metricKey as keyof typeof sfAlarms.SfRecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to resources using extended construct', () => {
  const app = new App();
  const stack = new SfStateMachineStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.stateMachine.alarmExecutionTime(
    {
      threshold: Duration.minutes(5).toMilliseconds(),
    },
  );
  stack.stateMachine.alarmExecutionThrottled();
  stack.stateMachine.alarmExecutionsFailed();
  stack.stateMachine.alarmExecutionsTimedOut();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(sfAlarms.SfRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(sfAlarms.SfRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = sfAlarms.SfRecommendedAlarmsMetrics[metricKey as keyof typeof sfAlarms.SfRecommendedAlarmsMetrics];

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
    new sfAlarms.SfRecommendedAlarmsAspect({
      excludeResources: ['StateMachine1'],
      configExecutionTimeAlarm: {
        threshold: Duration.minutes(5).toMilliseconds(),
      },
    }),
  );

  const definitionBody = JSON.stringify({
    StartAt: 'PassState',
    States: {
      PassState: {
        Type: 'Pass',
        Result: {
          Value: 'Hello, Step Functions!',
        },
        End: true,
      },
    },
  });

  new sfn.StateMachine(stack, 'StateMachine1', {
    stateMachineName: 'StateMachine1',
    definitionBody: sfn.DefinitionBody.fromString(JSON.stringify(definitionBody)),
  });

  new sfn.StateMachine(stack, 'StateMachine2', {
    stateMachineName: 'StateMachine2',
    definitionBody: sfn.DefinitionBody.fromString(JSON.stringify(definitionBody)),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(sfAlarms.SfRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['StateMachine1', 'StateMachine2'].forEach(stateMachineName => {
    Object.keys(sfAlarms.SfRecommendedAlarmsMetrics).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;
        const metricName = sfAlarms.SfRecommendedAlarmsMetrics[metricKey as keyof typeof sfAlarms.SfRecommendedAlarmsMetrics];

        return resourceName.startsWith(stateMachineName) && resourceProperties.MetricName === metricName;
      });
      if (stateMachineName === 'StateMachine1') {
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
  const stack = new SfStateMachineStack(app, 'TestStack', {
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

  new sfAlarms.SfStateMachineRecommendedAlarms(stack, 'sfStateMachineAlarms', {
    stateMachine: stack.stateMachine,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configExecutionTimeAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      threshold: Duration.minutes(5).toMilliseconds(),
    },
    configExecutionThrottledAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configExecutionsFailedAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configExecutionsTimedOutAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(sfAlarms.SfRecommendedAlarmsMetrics).forEach(metricName => {
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
    new sfAlarms.SfRecommendedAlarmsAspect({
      configExecutionTimeAlarm: {
        alarmName: 'CustomExecutionTimeAlarm',
        threshold: Duration.minutes(5).toMilliseconds(),
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configExecutionThrottledAlarm: {
        alarmName: 'CustomExecutionThrottledAlarm',
        threshold: Duration.minutes(5).toMilliseconds(),
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configExecutionsFailedAlarm: {
        alarmName: 'CustomExecutionsFailedAlarm',
        threshold: Duration.minutes(5).toMilliseconds(),
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configExecutionsTimedOutAlarm: {
        alarmName: 'CustomExecutionsTimedOutAlarm',
        threshold: Duration.minutes(5).toMilliseconds(),
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

  const definitionBody = JSON.stringify({
    StartAt: 'PassState',
    States: {
      PassState: {
        Type: 'Pass',
        Result: {
          Value: 'Hello, Step Functions!',
        },
        End: true,
      },
    },
  });

  new sfn.StateMachine(stack, 'StateMachine1', {
    stateMachineName: 'StateMachine1',
    definitionBody: sfn.DefinitionBody.fromString(JSON.stringify(definitionBody)),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(sfAlarms.SfRecommendedAlarmsMetrics).forEach(metricName => {
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
