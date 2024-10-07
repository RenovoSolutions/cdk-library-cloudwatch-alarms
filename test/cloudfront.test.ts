import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_lambda as lambda,
  aws_sns as sns,
  aws_s3 as s3,
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
import * as cloudfrontAlarms from '../src/cloudfront';

class CloudFrontDistributionStack extends Stack {

  public readonly distribution: cloudfrontAlarms.Distribution;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket', {
      versioned: true,
    });

    this.distribution = new cloudfrontAlarms.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      publishAdditionalMetrics: true,
    });
  }
}

test('CloudFrontDistributionSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new cloudfrontAlarms.CloudFrontRecommendedAlarmsAspect({
      config5xxErrorRateAlarm: {
        threshold: 100,
      },
      configOriginLatencyAlarm: {
        threshold: 100,
      },
    }),
  );

  const stack = new CloudFrontDistributionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DistributionSnapshotWithDetailedList', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new cloudfrontAlarms.CloudFrontRecommendedAlarmsAspect({
      config5xxErrorRateAlarm: {
        threshold: 100,
      },
      configOriginLatencyAlarm: {
        threshold: 100,
      },
      configDetailedFunctionValidationErrorsAlarmList: [
        {
          functionName: 'test-function-name',
        },
      ],
      configDetailedFunctionExecutionErrorsAlarmList: [
        {
          functionName: 'test-function-name',
        },
      ],
      configDetailedFunctionThrottlesAlarmList: [
        {
          functionName: 'test-function-name',
        },
      ],
    }),
  );

  const stack = new CloudFrontDistributionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('CloudFrontDistributionSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new cloudfrontAlarms.CloudFrontRecommendedAlarmsAspect({
      excludeAlarms: [cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics.ERROR_RATE_5XX],
      config5xxErrorRateAlarm: {
        threshold: 100,
      },
      configOriginLatencyAlarm: {
        threshold: 100,
      },
    }),
  );

  const stack = new CloudFrontDistributionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForCloudFrontDistributionConstruct', () => {
  const app = new App();
  const stack = new CloudFrontDistributionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.distribution.applyRecommendedAlarms({
    config5xxErrorRateAlarm: {
      threshold: 100,
    },
    configOriginLatencyAlarm: {
      threshold: 100,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('CloudFrontDistributionSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new CloudFrontDistributionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new cloudfrontAlarms.CloudFrontDistributionRecommendedAlarms(stack, 'cloudfrontDistributionAlarms', {
    distribution: stack.distribution,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    config5xxErrorRateAlarm: {
      threshold: 100,
    },
    configOriginLatencyAlarm: {
      threshold: 100,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DistributionSnapshotDefaultActionsInUseWithDetails', () => {
  const app = new App();
  const stack = new CloudFrontDistributionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new cloudfrontAlarms.CloudFrontDistributionRecommendedAlarms(stack, 'cloudFrontDistributionAlarms', {
    distribution: stack.distribution,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    config5xxErrorRateAlarm: {
      threshold: 100,
    },
    configOriginLatencyAlarm: {
      threshold: 100,
    },
    configDetailedFunctionValidationErrorsAlarmList: [
      {
        functionName: 'test-function-name',
      },
    ],
    configDetailedFunctionExecutionErrorsAlarmList: [
      {
        functionName: 'test-function-name',
      },
    ],
    configDetailedFunctionThrottlesAlarmList: [
      {
        functionName: 'test-function-name',
      },
    ],
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain distribution recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new cloudfrontAlarms.CloudFrontRecommendedAlarmsAspect({
      config5xxErrorRateAlarm: {
        threshold: 100,
      },
      configOriginLatencyAlarm: {
        threshold: 100,
      },
    }),
  );

  const stack = new CloudFrontDistributionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics).filter(metric => !metric.startsWith('FUNCTION_')).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics).filter(metric => !metric.startsWith('FUNCTION_')).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics[
        metricKey as keyof typeof cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics
      ];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to resources using extended construct', () => {
  const app = new App();
  const stack = new CloudFrontDistributionStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmDetailedConfig = [
    {
      functionName: 'test-function-name',
    },
  ];

  stack.distribution.alarm5xxErrorRate({
    threshold: 100,
  });
  stack.distribution.alarmOriginLatency({
    threshold: 100,
  });
  stack.distribution.alarmDetailedFunctionValidationErrors(alarmDetailedConfig);
  stack.distribution.alarmDetailedFunctionExecutionErrors(alarmDetailedConfig);
  stack.distribution.alarmDetailedFunctionThrottles(alarmDetailedConfig);

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics).filter(metric => !metric.startsWith('FUNCTION_')).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics + 3 * alarmDetailedConfig.length);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics).filter(metric => !metric.startsWith('FUNCTION_')).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics[
        metricKey as keyof typeof cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics
      ];

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
    new cloudfrontAlarms.CloudFrontRecommendedAlarmsAspect({
      excludeResources: ['Distribution1'],
      config5xxErrorRateAlarm: {
        threshold: 100,
      },
      configOriginLatencyAlarm: {
        threshold: 100,
      },
    }),
  );

  const bucket1 = new s3.Bucket(stack, 'Bucket1', {
    versioned: true,
  });

  new cloudfront.Distribution(stack, 'Distribution1', {
    defaultBehavior: {
      origin: new origins.S3Origin(bucket1),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    publishAdditionalMetrics: true,
  });

  const bucket2 = new s3.Bucket(stack, 'Bucket2', {
    versioned: true,
  });

  new cloudfront.Distribution(stack, 'Distribution2', {
    defaultBehavior: {
      origin: new origins.S3Origin(bucket2),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    publishAdditionalMetrics: true,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics).filter(metric => !metric.startsWith('FUNCTION_')).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['Distribution1', 'Distribution2'].forEach(distributionName => {
    Object.keys(cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics).filter(metric => !metric.startsWith('FUNCTION_')).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;
        const metricName = cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics[
          metricKey as keyof typeof cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics
        ];

        return resourceName.startsWith(distributionName) && resourceProperties.MetricName === metricName;
      });
      if (distributionName === 'Distribution1') {
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
  const stack = new CloudFrontDistributionStack(app, 'TestStack', {
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

  new cloudfrontAlarms.CloudFrontDistributionRecommendedAlarms(stack, 'cloudfrontDistributionAlarms', {
    distribution: stack.distribution,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    config5xxErrorRateAlarm: {
      threshold: 100,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configOriginLatencyAlarm: {
      threshold: 10,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics).filter(metric => !metric.startsWith('Function')).forEach(metricName => {
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
    new cloudfrontAlarms.CloudFrontRecommendedAlarmsAspect({
      config5xxErrorRateAlarm: {
        alarmName: 'Custom5xxErrorRateAlarm',
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
      configOriginLatencyAlarm: {
        alarmName: 'CustomOriginLatencyAlarm',
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
      configDetailedFunctionValidationErrorsAlarmList: [
        {
          functionName: 'test-function-name',
          alarmName: 'CustomTestDetailedFunctionValidationErrorsAlarmAlarm',
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
      ],
      configDetailedFunctionExecutionErrorsAlarmList: [
        {
          functionName: 'test-function-name',
          alarmName: 'CustomTestDetailedFunctionExecutionErrorsAlarmAlarm',
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
      ],
      configDetailedFunctionThrottlesAlarmList: [
        {
          functionName: 'test-function-name',
          alarmName: 'CustomTestDetailedFunctionThrottlesAlarmAlarm',
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
      ],
    }),
  );

  const bucket = new s3.Bucket(stack, 'Bucket', {
    versioned: true,
  });

  new cloudfront.Distribution(stack, 'Distribution', {
    defaultBehavior: {
      origin: new origins.S3Origin(bucket),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    publishAdditionalMetrics: true,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(cloudfrontAlarms.CloudFrontRecommendedAlarmsMetrics).filter(metric => !metric.startsWith('Function')).forEach(metricName => {
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
