import {
  aws_apigateway as apigateway,
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_lambda as lambda,
  aws_logs as logs,
  aws_sns as sns,
  Aspects,
  App,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  Template,
  Match,
} from 'aws-cdk-lib/assertions';
import * as apiGatewayAlarms from '../src/apigateway';

class ApiGatewayRestApiStack extends Stack {

  public readonly api: apiGatewayAlarms.RestApi;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const apiAccessLogGroup = new logs.LogGroup(this, 'testApiAccessLogGroup', {
      retention: logs.RetentionDays.TWO_YEARS,
      logGroupName: '/apigateway/testapi/accesslogs',
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.api = new apiGatewayAlarms.RestApi(this, 'RestApi', {
      restApiName: 'TestApi',
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      deployOptions: {
        stageName: 'live',
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: false,
        accessLogDestination: new apigateway.LogGroupLogDestination(apiAccessLogGroup),
        accessLogFormat: apigateway.AccessLogFormat.custom(JSON.stringify({
          requestId: apigateway.AccessLogField.contextRequestId(),
          sourceIp: apigateway.AccessLogField.contextIdentitySourceIp(),
          method: apigateway.AccessLogField.contextHttpMethod(),
          userContext: {
            apiKeyId: apigateway.AccessLogField.contextIdentityApiKeyId(),
            userAgent: apigateway.AccessLogField.contextIdentityUserAgent(),
          },
          requestPath: apigateway.AccessLogField.contextPath(),
          requestTime: apigateway.AccessLogField.contextRequestTime(),
          error: {
            message: apigateway.AccessLogField.contextErrorMessage(),
            responseType: apigateway.AccessLogField.contextErrorResponseType(),
          },
          waf: {
            responseCode: apigateway.AccessLogField.contextWafResponseCode(),
            error: apigateway.AccessLogField.contextWafError(),
            latency: apigateway.AccessLogField.contextWafLatency(),
            status: apigateway.AccessLogField.contextWafStatus(),
          },
          integration: {
            error: apigateway.AccessLogField.contextIntegrationErrorMessage(),
            latency: apigateway.AccessLogField.contextIntegrationLatency(),
            status: apigateway.AccessLogField.contextIntegrationStatus(),
          },
          authorizer: {
            error: apigateway.AccessLogField.contextAuthorizerError(),
            latency: apigateway.AccessLogField.contextAuthorizerLatency(),
            status: apigateway.AccessLogField.contextAuthorizerStatus(),
            integration: {
              latency: apigateway.AccessLogField.contextAuthorizerIntegrationLatency(),
              status: apigateway.AccessLogField.contextAuthorizerIntegrationStatus(),
            },
          },
          customDomainBasePath: apigateway.AccessLogField.contextCustomDomainBasePathMatched(),
          responseLength: apigateway.AccessLogField.contextResponseLength(),
          responseLatency: apigateway.AccessLogField.contextResponseLatency(),
          status: apigateway.AccessLogField.contextStatus(),
        })),
      },
    });

    this.api.root.addProxy({
      anyMethod: true,
      defaultMethodOptions: {
        apiKeyRequired: false,
        requestParameters: {
          'method.request.path.proxy': true,
        },
      },
    });
  }
}

test('RestApiSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new apiGatewayAlarms.ApiGatewayRecommendedAlarmsAspect({
      configCountAlarm: {
        threshold: 10,
      },
    }),
  );

  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('RestApiSnapshotWithDetailedList', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new apiGatewayAlarms.ApiGatewayRecommendedAlarmsAspect({
      configCountAlarm: {
        threshold: 10,
      },
      configDetailedCountAlarmList: [
        {
          alias: 'getUsers',
          resource: '/users',
          method: 'GET',
          threshold: 1000,
        },
      ],
      configDetailedLatencyAlarmList: [
        {
          alias: 'getUsers',
          resource: '/users',
          method: 'GET',
        },
      ],
    }),
  );

  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('RestApiSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new apiGatewayAlarms.ApiGatewayRecommendedAlarmsAspect({
      excludeAlarms: [apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.ERROR_4XX],
      configCountAlarm: {
        threshold: 10,
      },
    }),
  );

  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForRestApiConstruct', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.api.applyRecommendedAlarms({
    configCountAlarm: {
      threshold: 10,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('RestApiSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new apiGatewayAlarms.ApiGatewayRestApiRecommendedAlarms(stack, 'apiGatewayRestApiAlarms', {
    api: stack.api,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configCountAlarm: {
      threshold: 10,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('RestApiSnapshotDefaultActionsInUseWithDetails', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new apiGatewayAlarms.ApiGatewayRestApiRecommendedAlarms(stack, 'apiGatewayRestApiAlarms', {
    api: stack.api,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configCountAlarm: {
      threshold: 10,
    },
    configDetailedCountAlarmList: [
      {
        alias: 'getUsers',
        resource: '/users',
        method: 'GET',
        threshold: 1000,
      },
      {
        alias: 'createUser',
        resource: '/users',
        method: 'POST',
        threshold: 1000,
      },
    ],
    configDetailedLatencyAlarmList: [
      {
        alias: 'getUsers',
        resource: '/users',
        method: 'GET',
      },
      {
        alias: 'createUser',
        resource: '/users',
        method: 'POST',
      },
    ],
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain service recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new apiGatewayAlarms.ApiGatewayRecommendedAlarmsAspect({
      configCountAlarm: {
        threshold: 10,
      },
    }),
  );

  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource =
        resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics[
        metricKey as keyof typeof apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics
      ];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to services using extended construct', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });
  const alarmDetailCountConfig = [
    {
      alias: 'getUsers',
      resource: '/users',
      method: 'GET',
      threshold: 1000,
    },
  ];
  const alarmDetailLatencyConfig = [
    {
      alias: 'getUsers',
      resource: '/users',
      method: 'GET',
    },
  ];

  stack.api.alarm4XXError();
  stack.api.alarm5XXError();
  stack.api.alarmCount({ threshold: 10 });
  stack.api.alarmLatency();
  stack.api.alarmDetailedCount(alarmDetailCountConfig);
  stack.api.alarmDetailedLatency(alarmDetailLatencyConfig);

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics + alarmDetailCountConfig.length + alarmDetailLatencyConfig.length);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    if (metricName === apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.COUNT) {
      expect(alarms.length).toBe(1 + alarmDetailCountConfig.length);
    } else if (metricName === apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.LATENCY) {
      expect(alarms.length).toBe(1 + alarmDetailLatencyConfig.length);
    } else {
      expect(alarms.length).toBe(1);
    }
  });
});

test('when a resource is excluded from the aspect config it should not have alarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new apiGatewayAlarms.ApiGatewayRecommendedAlarmsAspect({
      excludeResources: ['RestApi1'],
      configCountAlarm: {
        threshold: 10,
      },
    }),
  );

  const api1 = new apiGatewayAlarms.RestApi(stack, 'RestApi1', {
    restApiName: 'TestApi1',
    endpointTypes: [apigateway.EndpointType.REGIONAL],
    deployOptions: {
      stageName: 'live',
      loggingLevel: apigateway.MethodLoggingLevel.INFO,
      dataTraceEnabled: false,
    },
  });

  api1.root.addProxy({
    anyMethod: true,
    defaultMethodOptions: {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.path.proxy': true,
      },
    },
  });

  const api2 = new apiGatewayAlarms.RestApi(stack, 'RestApi2', {
    restApiName: 'TestApi2',
    endpointTypes: [apigateway.EndpointType.REGIONAL],
    deployOptions: {
      stageName: 'live',
      loggingLevel: apigateway.MethodLoggingLevel.INFO,
      dataTraceEnabled: false,
    },
  });

  api2.root.addProxy({
    anyMethod: true,
    defaultMethodOptions: {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.path.proxy': true,
      },
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['RestApi1', 'RestApi2'].forEach(instanceName => {
    Object.keys(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;
        const metricName = apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics[
          metricKey as keyof typeof apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics
        ];

        return resourceName.startsWith(instanceName) && resourceProperties.MetricName === metricName;
      });
      if (instanceName === 'RestApi1') {
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
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
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

  new apiGatewayAlarms.ApiGatewayRestApiRecommendedAlarms(stack, 'apiGatewayRestApiAlarms', {
    api: stack.api,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    config4XXErrorAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    config5XXErrorAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configCountAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      threshold: 10,
    },
    configLatencyAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics).forEach(metricName => {
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
    new apiGatewayAlarms.ApiGatewayRecommendedAlarmsAspect({
      config4XXErrorAlarm: {
        alarmName: 'Custom4XXErrorAlarm',
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
      config5XXErrorAlarm: {
        alarmName: 'Custom5XXErrorAlarm',
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
      configCountAlarm: {
        alarmName: 'CustomCountAlarm',
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
      configLatencyAlarm: {
        alarmName: 'CustomLatencyAlarm',
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
      configDetailedCountAlarmList: [
        {
          alias: 'getUsers',
          resource: '/users',
          method: 'GET',
          alarmName: 'CustomDetailedGetUsersCountAlarm',
          threshold: 1000,
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
      configDetailedLatencyAlarmList: [
        {
          alias: 'getUsers',
          resource: '/users',
          method: 'GET',
          alarmName: 'CustomDetailedGetUsersLatencyAlarm',
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

  const api = new apiGatewayAlarms.RestApi(stack, 'RestApi1', {
    restApiName: 'TestApi1',
    endpointTypes: [apigateway.EndpointType.REGIONAL],
    deployOptions: {
      stageName: 'live',
      loggingLevel: apigateway.MethodLoggingLevel.INFO,
      dataTraceEnabled: false,
    },
  });

  api.root.addProxy({
    anyMethod: true,
    defaultMethodOptions: {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.path.proxy': true,
      },
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics).forEach(metricName => {
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
