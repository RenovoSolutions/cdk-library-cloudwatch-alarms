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

/**
 * Minimal shape of a `Metrics` array entry in an anomaly detection alarm CFN resource.
 * Typing this explicitly (instead of `any`) makes a CDK schema rename surface as a
 * compile error rather than a silent test miss.
 */
type AnomalyMetricEntry = { MetricStat?: { Metric?: { MetricName?: string } } };

/** Maps each anomaly enum value to the underlying CloudWatch metric name it monitors. */
const anomalyEnumToMetricName: Record<string, string> = {
  [apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.LATENCY_ANOMALY]: 'Latency',
  [apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.COUNT_ANOMALY]: 'Count',
  [apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.INTEGRATION_LATENCY_ANOMALY]: 'IntegrationLatency',
};

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
      config4XXErrorAlarm: {
        threshold: 10,
      },
      config5XXErrorAlarm: {
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
      config4XXErrorAlarm: {
        threshold: 10,
      },
      config5XXErrorAlarm: {
        threshold: 10,
      },
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
      config4XXErrorAlarm: {
        threshold: 10,
      },
      config5XXErrorAlarm: {
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
    config4XXErrorAlarm: {
      threshold: 10,
    },
    config5XXErrorAlarm: {
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
    config4XXErrorAlarm: {
      threshold: 10,
    },
    config5XXErrorAlarm: {
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
    config4XXErrorAlarm: {
      threshold: 10,
    },
    config5XXErrorAlarm: {
      threshold: 10,
    },
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
      config4XXErrorAlarm: {
        threshold: 10,
      },
      config5XXErrorAlarm: {
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
    const metricName = apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics[
      metricKey as keyof typeof apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics
    ];

    const alarms = Object.keys(resources).filter(resourceName => {
      const resourceProperties = resources[resourceName].Properties;
      const underlying = anomalyEnumToMetricName[metricName];
      if (underlying) {
        return (resourceProperties.Metrics ?? []).some(
          (m: AnomalyMetricEntry) => m.MetricStat?.Metric?.MetricName === underlying,
        );
      }
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
  const alarmDetailLatencyConfig = [
    {
      alias: 'getUsers',
      resource: '/users',
      method: 'GET',
    },
  ];

  stack.api.alarm4XXError({ threshold: 10 });
  stack.api.alarm5XXError({ threshold: 10 });
  stack.api.alarmLatency();
  stack.api.alarmDetailedLatency(alarmDetailLatencyConfig);
  stack.api.alarmLatencyAnomaly();
  stack.api.alarmCountAnomaly();
  stack.api.alarmIntegrationLatencyAnomaly();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics + alarmDetailLatencyConfig.length);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const underlying = anomalyEnumToMetricName[metricName];
      if (underlying) {
        return (resource.Properties.Metrics ?? []).some(
          (m: AnomalyMetricEntry) => m.MetricStat?.Metric?.MetricName === underlying,
        );
      }
      return resource.Properties.MetricName === metricName;
    });
    if (metricName === apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.LATENCY) {
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
      config4XXErrorAlarm: {
        threshold: 10,
      },
      config5XXErrorAlarm: {
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
      const metricName = apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics[
        metricKey as keyof typeof apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics
      ];
      const alarms = Object.keys(resources).filter(resourceName => {
        const resourceProperties = resources[resourceName].Properties;
        if (!resourceName.startsWith(instanceName)) return false;
        const underlying = anomalyEnumToMetricName[metricName];
        if (underlying) {
          return (resourceProperties.Metrics ?? []).some(
            (m: AnomalyMetricEntry) => m.MetricStat?.Metric?.MetricName === underlying,
          );
        }
        return resourceProperties.MetricName === metricName;
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
    runtime: lambda.Runtime.NODEJS_24_X,
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
      threshold: 10,
    },
    config5XXErrorAlarm: {
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

  Object.values(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics)
    .filter(metricName => !anomalyEnumToMetricName[metricName])
    .forEach(metricName => {
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

  Object.values(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics)
    .filter(metricName => !anomalyEnumToMetricName[metricName])
    .forEach(metricName => {
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
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  appAspects.add(
    new apiGatewayAlarms.ApiGatewayRecommendedAlarmsAspect({
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      config4XXErrorAlarm: {
        threshold: 10,
      },
      config5XXErrorAlarm: {
        threshold: 10,
      },
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
  Object.values(apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics)
    .filter(metricName => !anomalyEnumToMetricName[metricName])
    .forEach(metricName => {
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        MetricName: metricName,
        TreatMissingData: 'notBreaching',
      }));
    });

  Object.values(anomalyEnumToMetricName).forEach(underlying => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      TreatMissingData: 'notBreaching',
      Metrics: Match.arrayWith([
        Match.objectLike({
          MetricStat: Match.objectLike({
            Metric: Match.objectLike({ MetricName: underlying }),
          }),
        }),
      ]),
    }));
  });
});

test('anomaly alarms have correct default comparison operator, band width, and evaluation periods', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  stack.api.alarmLatencyAnomaly();
  stack.api.alarmCountAnomaly();
  stack.api.alarmIntegrationLatencyAnomaly();

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    ComparisonOperator: 'GreaterThanUpperThreshold',
    EvaluationPeriods: 3,
    DatapointsToAlarm: 2,
    Metrics: Match.arrayWith([
      Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 8)' }),
      Match.objectLike({ MetricStat: Match.objectLike({ Period: 300, Stat: 'Average', Metric: Match.objectLike({ MetricName: 'Latency' }) }) }),
    ]),
  }));

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    ComparisonOperator: 'LessThanLowerThreshold',
    EvaluationPeriods: 4,
    DatapointsToAlarm: 3,
    Metrics: Match.arrayWith([
      Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 8)' }),
      Match.objectLike({ MetricStat: Match.objectLike({ Period: 300, Stat: 'Average', Metric: Match.objectLike({ MetricName: 'Count' }) }) }),
    ]),
  }));

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    ComparisonOperator: 'GreaterThanUpperThreshold',
    EvaluationPeriods: 3,
    DatapointsToAlarm: 2,
    Metrics: Match.arrayWith([
      Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 8)' }),
      Match.objectLike({ MetricStat: Match.objectLike({ Period: 300, Stat: 'Average', Metric: Match.objectLike({ MetricName: 'IntegrationLatency' }) }) }),
    ]),
  }));
});

test('anomaly alarm configuration can be overwritten', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  stack.api.alarmLatencyAnomaly({
    stdDevs: 4,
    evaluationPeriods: 3,
    datapointsToAlarm: 2,
    comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
    EvaluationPeriods: 3,
    DatapointsToAlarm: 2,
    Metrics: Match.arrayWith([
      Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 4)' }),
      Match.objectLike({ MetricStat: Match.objectLike({ Stat: 'Average', Metric: Match.objectLike({ MetricName: 'Latency' }) }) }),
    ]),
  }));
});

test('anomaly alarms can be excluded individually via excludeAlarms', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  new apiGatewayAlarms.ApiGatewayRestApiRecommendedAlarms(stack, 'alarms', {
    api: stack.api,
    config4XXErrorAlarm: { threshold: 10 },
    config5XXErrorAlarm: { threshold: 10 },
    excludeAlarms: [
      apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.LATENCY_ANOMALY,
      apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.COUNT_ANOMALY,
      apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.INTEGRATION_LATENCY_ANOMALY,
    ],
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::CloudWatch::Alarm', 3); // 4XXError, 5XXError, Latency only

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  Object.values(anomalyEnumToMetricName).forEach(underlying => {
    const anomalyAlarms = Object.values(resources).filter(r =>
      (r.Properties.Metrics ?? []).some(
        (m: AnomalyMetricEntry) => m.MetricStat?.Metric?.MetricName === underlying,
      ),
    );
    expect(anomalyAlarms).toHaveLength(0);
  });
});

test('anomaly alarm default actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  const topic = new sns.Topic(stack, 'Topic');
  const alarmLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });
  const lambdaAction = new cloudwatch_actions.LambdaAction(alarmLambda);

  new apiGatewayAlarms.ApiGatewayRestApiRecommendedAlarms(stack, 'apiGatewayRestApiAlarms', {
    api: stack.api,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    config4XXErrorAlarm: { threshold: 10 },
    config5XXErrorAlarm: { threshold: 10 },
    configLatencyAnomalyAlarm: { alarmAction: lambdaAction, okAction: lambdaAction, insufficientDataAction: lambdaAction },
    configCountAnomalyAlarm: { alarmAction: lambdaAction, okAction: lambdaAction, insufficientDataAction: lambdaAction },
    configIntegrationLatencyAnomalyAlarm: { alarmAction: lambdaAction, okAction: lambdaAction, insufficientDataAction: lambdaAction },
  });

  const template = Template.fromStack(stack);

  Object.values(anomalyEnumToMetricName).forEach(underlying => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      Metrics: Match.arrayWith([
        Match.objectLike({ MetricStat: Match.objectLike({ Metric: Match.objectLike({ MetricName: underlying }) }) }),
      ]),
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
    }));
  });
});
