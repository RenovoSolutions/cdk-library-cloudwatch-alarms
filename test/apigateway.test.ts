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
import { AnomalyMetricEntry, matchesAnomalyMetric } from './anomaly-test-helpers';
import * as apiGatewayAlarms from '../src/apigateway';

/** Maps each anomaly enum value to the underlying CloudWatch metric name it monitors. */
const anomalyEnumToMetricName: Record<string, string> = {
  [apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.LATENCY_ANOMALY]: 'Latency',
  [apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.COUNT_ANOMALY]: 'Count',
  [apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.INTEGRATION_LATENCY_ANOMALY]: 'IntegrationLatency',
};

/**
 * Maps each *Rate enum value to the real CloudWatch metric name it shares with its
 * absolute-count counterpart (e.g. `4XXErrorRate` and `4XXError` are both the `4XXError`
 * metric; only the `Statistic` differs). The enum value itself is a synthetic label, not
 * a distinct CloudWatch metric name.
 */
const rateEnumToBaseMetricName: Record<string, string> = {
  [apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.ERROR_4XX_RATE]: '4XXError',
  [apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.ERROR_5XX_RATE]: '5XXError',
};

/** Enum values whose alarm resource cannot be matched by `MetricName` alone. */
const nonDirectMetricNameEnumValues = new Set([
  ...Object.keys(anomalyEnumToMetricName),
  ...Object.keys(rateEnumToBaseMetricName),
]);

/**
 * True if the alarm resource corresponds to the given recommended-alarm enum value.
 * Static alarms match on the top-level `MetricName`; anomaly alarms have no top-level
 * `MetricName` and instead wrap their metric in an `ANOMALY_DETECTION_BAND` expression,
 * so they are matched by the underlying metric inside `Metrics[]`. The 4XX/5XX absolute-count
 * and rate alarms share the same `MetricName`, so they are disambiguated by `Statistic`
 * (`Sum` for the count alarm, `Average` for the rate alarm).
 */
function alarmMatchesMetric(
  properties: { MetricName?: string; Statistic?: string; Metrics?: AnomalyMetricEntry[] },
  metricEnumValue: string,
): boolean {
  const anomalyMetric = anomalyEnumToMetricName[metricEnumValue];
  if (anomalyMetric) {
    return matchesAnomalyMetric(properties, anomalyMetric);
  }
  const rateBaseMetric = rateEnumToBaseMetricName[metricEnumValue];
  if (rateBaseMetric) {
    return properties.MetricName === rateBaseMetric && properties.Statistic === 'Average';
  }
  if (
    metricEnumValue === apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.ERROR_4XX
    || metricEnumValue === apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.ERROR_5XX
  ) {
    return properties.MetricName === metricEnumValue && properties.Statistic === 'Sum';
  }
  return properties.MetricName === metricEnumValue;
}

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
      config4XXErrorRateAlarm: {
        threshold: 0.05,
      },
      config5XXErrorAlarm: {
        threshold: 10,
      },
      config5XXErrorRateAlarm: {
        threshold: 0.05,
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

    const alarms = Object.keys(resources).filter(resourceName =>
      alarmMatchesMetric(resources[resourceName].Properties, metricName),
    );

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
  stack.api.alarm4XXErrorRate({ threshold: 0.05 });
  stack.api.alarm5XXError({ threshold: 10 });
  stack.api.alarm5XXErrorRate({ threshold: 0.05 });
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
    const alarms = Object.keys(resources).filter(resourceName =>
      alarmMatchesMetric(resources[resourceName].Properties, metricName),
    );
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
      config4XXErrorRateAlarm: {
        threshold: 0.05,
      },
      config5XXErrorAlarm: {
        threshold: 10,
      },
      config5XXErrorRateAlarm: {
        threshold: 0.05,
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
      const alarms = Object.keys(resources).filter(resourceName =>
        resourceName.startsWith(instanceName)
        && alarmMatchesMetric(resources[resourceName].Properties, metricName),
      );
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
    .filter(metricName => !nonDirectMetricNameEnumValues.has(metricName))
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
    .filter(metricName => !nonDirectMetricNameEnumValues.has(metricName))
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
    .filter(metricName => !nonDirectMetricNameEnumValues.has(metricName))
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

test('4XXError and 5XXError alarms use statistic Sum and absolute-count wording, distinct from their *Rate counterparts', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  stack.api.alarm4XXError({ threshold: 10 });
  stack.api.alarm5XXError({ threshold: 10 });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    AlarmName: 'TestApi - 4XXError',
    MetricName: '4XXError',
    Statistic: 'Sum',
    Threshold: 10,
    AlarmDescription: Match.stringLikeRegexp('numbers'),
  }));

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    AlarmName: 'TestApi - 5XXError',
    MetricName: '5XXError',
    Statistic: 'Sum',
    Threshold: 10,
    AlarmDescription: Match.stringLikeRegexp('numbers'),
  }));

  // No alarm on this metric uses a percentage-of-requests wording; that is reserved
  // for the *Rate counterparts below.
  template.resourcePropertiesCountIs('AWS::CloudWatch::Alarm', {
    AlarmDescription: Match.stringLikeRegexp('fraction'),
  }, 0);
});

test('4XXErrorRate and 5XXErrorRate alarms use statistic Average on the same metric as their absolute-count counterparts', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  stack.api.alarm4XXErrorRate({ threshold: 0.05 });
  stack.api.alarm5XXErrorRate({ threshold: 0.1 });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    AlarmName: 'TestApi - 4XXErrorRate',
    MetricName: '4XXError',
    Statistic: 'Average',
    Threshold: 0.05,
    EvaluationPeriods: 5,
    DatapointsToAlarm: 5,
    ComparisonOperator: 'GreaterThanThreshold',
  }));

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    AlarmName: 'TestApi - 5XXErrorRate',
    MetricName: '5XXError',
    Statistic: 'Average',
    Threshold: 0.1,
    EvaluationPeriods: 3,
    DatapointsToAlarm: 3,
    ComparisonOperator: 'GreaterThanThreshold',
  }));

  // The absolute-count alarms are not created by these calls, so there is exactly one
  // alarm resource per underlying metric name.
  template.resourceCountIs('AWS::CloudWatch::Alarm', 2);
});

test('4XXErrorRate and 5XXErrorRate alarm configuration can be overwritten', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  stack.api.alarm4XXErrorRate({
    threshold: 0.2,
    alarmName: 'Custom4XXErrorRateAlarm',
    period: Duration.minutes(5),
    evaluationPeriods: 10,
    datapointsToAlarm: 8,
    alarmDescription: 'Custom rate alarm description',
    treatMissingData: cloudwatch.TreatMissingData.IGNORE,
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    AlarmName: 'Custom4XXErrorRateAlarm',
    MetricName: '4XXError',
    Statistic: 'Average',
    Threshold: 0.2,
    Period: 300,
    EvaluationPeriods: 10,
    DatapointsToAlarm: 8,
    AlarmDescription: 'Custom rate alarm description',
    TreatMissingData: 'ignore',
  }));
});

test('4XXErrorRate and 5XXErrorRate alarms are opt-in on the recommended alarms bundle, unlike their absolute-count counterparts', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  const alarms = new apiGatewayAlarms.ApiGatewayRestApiRecommendedAlarms(stack, 'alarms', {
    api: stack.api,
    config4XXErrorAlarm: { threshold: 10 },
    config5XXErrorAlarm: { threshold: 10 },
  });

  expect(alarms.alarm4XXErrorRate).toBeUndefined();
  expect(alarms.alarm5XXErrorRate).toBeUndefined();

  const template = Template.fromStack(stack);
  template.resourcePropertiesCountIs('AWS::CloudWatch::Alarm', { Statistic: 'Average', MetricName: '4XXError' }, 0);
  template.resourcePropertiesCountIs('AWS::CloudWatch::Alarm', { Statistic: 'Average', MetricName: '5XXError' }, 0);
});

test('4XXErrorRate and 5XXErrorRate alarms are created on the recommended alarms bundle when their config is supplied', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  const alarms = new apiGatewayAlarms.ApiGatewayRestApiRecommendedAlarms(stack, 'alarms', {
    api: stack.api,
    config4XXErrorAlarm: { threshold: 10 },
    config4XXErrorRateAlarm: { threshold: 0.05 },
    config5XXErrorAlarm: { threshold: 10 },
    config5XXErrorRateAlarm: { threshold: 0.1 },
  });

  expect(alarms.alarm4XXErrorRate).toBeDefined();
  expect(alarms.alarm5XXErrorRate).toBeDefined();

  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    MetricName: '4XXError', Statistic: 'Average', Threshold: 0.05,
  }));
  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    MetricName: '5XXError', Statistic: 'Average', Threshold: 0.1,
  }));
});

test('4XXErrorRate and 5XXErrorRate alarms can be excluded individually via excludeAlarms even when their config is supplied', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  const alarms = new apiGatewayAlarms.ApiGatewayRestApiRecommendedAlarms(stack, 'alarms', {
    api: stack.api,
    config4XXErrorAlarm: { threshold: 10 },
    config4XXErrorRateAlarm: { threshold: 0.05 },
    config5XXErrorAlarm: { threshold: 10 },
    config5XXErrorRateAlarm: { threshold: 0.1 },
    excludeAlarms: [
      apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.ERROR_4XX_RATE,
      apiGatewayAlarms.ApiGatewayRecommendedAlarmsMetrics.ERROR_5XX_RATE,
    ],
  });

  expect(alarms.alarm4XXErrorRate).toBeUndefined();
  expect(alarms.alarm5XXErrorRate).toBeUndefined();
  expect(alarms.alarm4XXError).toBeDefined();
  expect(alarms.alarm5XXError).toBeDefined();
});

test('default actions are applied to 4XXErrorRate and 5XXErrorRate alarms when no individual alarm actions are provided', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  const topic = new sns.Topic(stack, 'Topic');

  new apiGatewayAlarms.ApiGatewayRestApiRecommendedAlarms(stack, 'alarms', {
    api: stack.api,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    config4XXErrorAlarm: { threshold: 10 },
    config4XXErrorRateAlarm: { threshold: 0.05 },
    config5XXErrorAlarm: { threshold: 10 },
    config5XXErrorRateAlarm: { threshold: 0.1 },
  });

  const template = Template.fromStack(stack);

  [{ metricName: '4XXError' }, { metricName: '5XXError' }].forEach(({ metricName }) => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      Statistic: 'Average',
      AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
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
    ComparisonOperator: 'LessThanLowerOrGreaterThanUpperThreshold',
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
  stack.api.alarmCountAnomaly({
    stdDevs: 5,
    evaluationPeriods: 6,
    datapointsToAlarm: 4,
    comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
  });
  stack.api.alarmIntegrationLatencyAnomaly({
    stdDevs: 3,
    evaluationPeriods: 5,
    datapointsToAlarm: 4,
    comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_LOWER_THRESHOLD,
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

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    ComparisonOperator: 'GreaterThanUpperThreshold',
    EvaluationPeriods: 6,
    DatapointsToAlarm: 4,
    Metrics: Match.arrayWith([
      Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 5)' }),
      Match.objectLike({ MetricStat: Match.objectLike({ Stat: 'Average', Metric: Match.objectLike({ MetricName: 'Count' }) }) }),
    ]),
  }));

  template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
    ComparisonOperator: 'LessThanLowerThreshold',
    EvaluationPeriods: 5,
    DatapointsToAlarm: 4,
    Metrics: Match.arrayWith([
      Match.objectLike({ Expression: 'ANOMALY_DETECTION_BAND(m0, 3)' }),
      Match.objectLike({ MetricStat: Match.objectLike({ Stat: 'Average', Metric: Match.objectLike({ MetricName: 'IntegrationLatency' }) }) }),
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

test('default actions are applied to anomaly alarms when no individual alarm actions are provided', () => {
  const app = new App();
  const stack = new ApiGatewayRestApiStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });

  const topic = new sns.Topic(stack, 'Topic');

  new apiGatewayAlarms.ApiGatewayRestApiRecommendedAlarms(stack, 'apiGatewayRestApiAlarms', {
    api: stack.api,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    config4XXErrorAlarm: { threshold: 10 },
    config5XXErrorAlarm: { threshold: 10 },
  });

  const template = Template.fromStack(stack);

  Object.values(anomalyEnumToMetricName).forEach(underlying => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      Metrics: Match.arrayWith([
        Match.objectLike({ MetricStat: Match.objectLike({ Metric: Match.objectLike({ MetricName: underlying }) }) }),
      ]),
      AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
    }));
  });
});
