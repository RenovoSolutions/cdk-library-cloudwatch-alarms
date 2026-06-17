import {
  IAspect,
  aws_apigateway as apigateway,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for ApiGateway alarms.
 */
export enum ApiGatewayRecommendedAlarmsMetrics {
  /**
   * The number of client-side errors captured in a given period.
   */
  ERROR_4XX = '4XXError',
  /**
   * The number of server-side errors captured in a given period.
   */
  ERROR_5XX = '5XXError',
  /**
   * The time (milliseconds) between when API Gateway receives a request from a client and
   * when it returns a response to the client. The latency includes the integration latency
   * and other API Gateway overhead.
   */
  LATENCY = 'Latency',
  /**
   * Anomaly detection on the Latency metric. Detects drift in total request latency
   * (API Gateway overhead + backend integration) without requiring a static threshold.
   */
  LATENCY_ANOMALY = 'LatencyAnomaly',
  /**
   * Anomaly detection on the Count metric. Detects unexpected drops (or spikes) in
   * traffic volume for low-traffic APIs where a static `LESS_THAN_THRESHOLD` value
   * is hard to pick.
   */
  COUNT_ANOMALY = 'CountAnomaly',
  /**
   * Anomaly detection on the IntegrationLatency metric. Detects drift in backend
   * latency independently of overall request latency. No static counterpart exists
   * in this library.
   */
  INTEGRATION_LATENCY_ANOMALY = 'IntegrationLatencyAnomaly',
}

/**
 * The common optional configuration for the alarms.
 */
export interface ApiGatewayAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common optional configuration for anomaly detection alarms.
 *
 * These alarms use a fixed 5-minute metric period and do not expose a configurable `period`,
 * because finer periods produce noisier, less reliable anomaly detection bands.
 */
export interface ApiGatewayAnomalyAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The width of the anomaly detection band, expressed as a number of standard deviations from the metric's mean.
   *
   * @default 8
   */
  readonly stdDevs?: number;
}

/**
 * The common properties for the ApiGateway alarms when monitoring resource and method dimensions.
 */
export interface ApiGatewayDetailedAlarmConfig {
  /**
   * The alias of the resource to monitor, used as a discriminator in the alarm name.
   */
  readonly alias: string;

  /**
   * The resource to monitor.
   */
  readonly resource: string;

  /**
   * The method to monitor.
   */
  readonly method: string;
}

/**
 * The common properties for the ApiGateway RestApi alarms.
 */
export interface ApiGatewayRestApiAlarmProps {
  /**
   * The ApiGateway api to monitor.
   */
  readonly api: apigateway.RestApi;
}

/**
 * Configuration for the 4XXError alarm.
 */
export interface ApiGateway4XXErrorAlarmConfig extends ApiGatewayAlarmBaseConfig {
  /**
   * The threshold value against which the specified statistic is compared.
   * The unit is an absolute count of errors, not a percentage.
   */
  readonly threshold: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 5
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 5
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - apiName + ' - 4XXError'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can detect high rates of client-side errors for the API Gateway requests.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ApiGatewayRestApi4XXErrorAlarm construct.
 */
export interface ApiGatewayRestApi4XXErrorAlarmProps extends ApiGatewayRestApiAlarmProps, ApiGateway4XXErrorAlarmConfig {}

/**
 * This alarm detects a high number of client-side errors.
 *
 * This can indicate an issue in the authorization or client request parameters. It could also mean that a resource was
 * removed or a client is requesting one that doesn't exist. Consider enabling CloudWatch Logs and checking for any errors
 * that may be causing the 4XX errors. Moreover, consider enabling detailed CloudWatch metrics to view this metric per
 * resource and method and narrow down the source of the errors. Errors could also be caused by exceeding the configured
 * throttling limit.
 *
 * The alarm is triggered when number of client-errors exceeds the threshold.
 */
export class ApiGatewayRestApi4XXErrorAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApi4XXErrorAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName} - ${ApiGatewayRecommendedAlarmsMetrics.ERROR_4XX}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect high rates of client-side errors for the'
      + ' API Gateway requests.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.api.metricClientError({
        dimensionsMap: {
          ApiName: props.api.restApiName,
          Stage: props.api.deploymentStage.stageName,
        },
        statistic: 'Average',
        period,
      }),
      threshold,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription,
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
};

/**
 * Configuration for the 5XXError alarm.
 */
export interface ApiGateway5XXErrorAlarmConfig extends ApiGatewayAlarmBaseConfig {
  /**
   * The threshold value against which the specified statistic is compared.
   * The unit is an absolute count of errors, not a percentage.
   */
  readonly threshold: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 3
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 3
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - apiName + ' - 5XXError'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can detect high rates of server-side errors for the API Gateway requests.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ApiGatewayRestApi5XXErrorAlarm construct.
 */
export interface ApiGatewayRestApi5XXErrorAlarmProps extends ApiGatewayRestApiAlarmProps, ApiGateway5XXErrorAlarmConfig {}

/**
 * This alarm detects a high number of server-side errors.
 *
 * This can indicate that there is something wrong on the API backend, the network,
 * or the integration between the API gateway and the backend API.
 *
 * The alarm is triggered when number of server-errors exceeds the threshold.
 */
export class ApiGatewayRestApi5XXErrorAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApi5XXErrorAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName} - ${ApiGatewayRecommendedAlarmsMetrics.ERROR_5XX}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 3;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect high rates of server-side errors for the'
      + ' API Gateway requests.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.api.metricServerError({
        dimensionsMap: {
          ApiName: props.api.restApiName,
          Stage: props.api.deploymentStage.stageName,
        },
        statistic: 'Average',
        period,
      }),
      threshold,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription,
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
};

/**
 * Configuration for the Latency alarm.
 */
export interface ApiGatewayLatencyAlarmConfig extends ApiGatewayAlarmBaseConfig {
  /**
   * The value in milliseconds against which the specified statistic is compared.
   * The suggested threshold value does not work for all API workloads. However, you can
   * use it as a starting point for the threshold. You can then choose different threshold
   * values based on the workload and acceptable latency, performance, and SLA requirements
   * for the API. If it is acceptable for the API to have a higher latency in general, you
   * can set a higher threshold value to make the alarm less sensitive. However, if the API
   * is expected to provide near real-time responses, set a lower threshold value. You can
   * also analyze historical data to determine what the expected baseline latency is for the
   * application workload and then tune the threshold value accordingly.
   *
   * @default 2500
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 5
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 5
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - apiName + ' - Latency'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can detect when the API Gateway requests in a stage have high latency.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ApiGatewayRestApiLatencyAlarm construct.
 */
export interface ApiGatewayRestApiLatencyAlarmProps extends ApiGatewayRestApiAlarmProps, ApiGatewayLatencyAlarmConfig {}

/**
 * This alarm can detect when the API Gateway requests in a stage have high latency.
 *
 *  If you have detailed CloudWatch metrics enabled and you have different latency performance
 * requirements for each method and resource, we recommend that you create alternative alarms to
 * have more fine-grained monitoring of the latency for each resource and method.
 *
 * The alarm is triggered when time in milliseconds exceeds or equals the threshold.
 */
export class ApiGatewayRestApiLatencyAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApiLatencyAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName} - ${ApiGatewayRecommendedAlarmsMetrics.LATENCY}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 2500;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect when the API Gateway requests in a'
      + ' stage have high latency.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.api.metricLatency({
        dimensionsMap: {
          ApiName: props.api.restApiName,
          Stage: props.api.deploymentStage.stageName,
        },
        statistic: 'p90',
        period,
      }),
      threshold,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription,
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
};

/**
 * Configuration for the Latency alarm when monitoring resource and method dimensions.
 */
export interface ApiGatewayRestApiDetailedLatencyAlarmConfig extends
  ApiGatewayLatencyAlarmConfig,
  ApiGatewayDetailedAlarmConfig {}

/**
 * The properties for the ApiGatewayRestApiDetailedLatencyAlarm construct.
 */
export interface ApiGatewayRestApiDetailedLatencyAlarmProps extends
  ApiGatewayRestApiAlarmProps,
  ApiGatewayLatencyAlarmConfig,
  ApiGatewayDetailedAlarmConfig {}

/**
 * This alarm detects high latency for a resource and method in a stage.
 *
 * Find the IntegrationLatency metric value to check the API backend latency. If the two
 * metrics are mostly aligned, the API backend is the source of higher latency and you should
 * investigate there for performance issues. Consider also enabling CloudWatch Logs and checking
 * for any errors that might be causing the high latency.
 *
 * The alarm is triggered when time in milliseconds exceeds or equals the threshold.
 */
export class ApiGatewayRestApiDetailedLatencyAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApiDetailedLatencyAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName}-${props.alias} - ${ApiGatewayRecommendedAlarmsMetrics.LATENCY}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 2500;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect when the API Gateway requests for a'
      + ' resource and method in a stage have high latency.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.api.metricLatency({
        dimensionsMap: {
          ApiName: props.api.restApiName,
          Stage: props.api.deploymentStage.stageName,
          Resource: props.resource,
          Method: props.method,
        },
        statistic: 'p90',
        period,
      }),
      threshold,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription,
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
};

/**
 * Configuration for the Latency anomaly detection alarm.
 */
export interface ApiGatewayLatencyAnomalyAlarmConfig extends ApiGatewayAnomalyAlarmBaseConfig {
  /**
   * The number of periods over which data is compared to the anomaly detection band.
   *
   * @default 3
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 2
   */
  readonly datapointsToAlarm?: number;
  /**
   * The comparison operator used to compare the metric against the anomaly detection band.
   *
   * @default cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD
   */
  readonly comparisonOperator?: cloudwatch.ComparisonOperator;
  /**
   * The alarm name.
   *
   * @default - apiName + ' - LatencyAnomaly'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This anomaly detection alarm detects unusual drift in the API Gateway
   * request latency compared to the expected baseline.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ApiGatewayRestApiLatencyAnomalyAlarm construct.
 */
export interface ApiGatewayRestApiLatencyAnomalyAlarmProps extends
  ApiGatewayRestApiAlarmProps, ApiGatewayLatencyAnomalyAlarmConfig {}

/**
 * An anomaly detection alarm on the API Gateway `Latency` metric.
 *
 * Catches drift in total request latency without requiring a static threshold.
 * The static `Latency` alarm uses the AWS-recommended `p90` statistic and a
 * fixed threshold; this anomaly variant uses `Average` (required by anomaly
 * detection) and a CloudWatch-fitted band. It is intended to coexist with the
 * static alarm, not replace it.
 */
export class ApiGatewayRestApiLatencyAnomalyAlarm extends cloudwatch.AnomalyDetectionAlarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApiLatencyAnomalyAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName} - ${ApiGatewayRecommendedAlarmsMetrics.LATENCY_ANOMALY}`;
    // Anomaly bands use a fixed 5-minute metric period; a finer period produces noisier, less reliable bands.
    const period = Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const stdDevs = props.stdDevs ?? 8;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const comparisonOperator = props.comparisonOperator ?? cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD;
    const alarmDescription = props.alarmDescription ?? 'This anomaly detection alarm detects unusual drift in the API'
      + ' Gateway request latency compared to the expected baseline.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.api.metricLatency({
        dimensionsMap: {
          ApiName: props.api.restApiName,
          Stage: props.api.deploymentStage.stageName,
        },
        statistic: 'Average',
        period,
      }),
      stdDevs,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator,
      alarmDescription,
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
};

/**
 * Configuration for the Count anomaly detection alarm.
 */
export interface ApiGatewayCountAnomalyAlarmConfig extends ApiGatewayAnomalyAlarmBaseConfig {
  /**
   * The number of periods over which data is compared to the anomaly detection band.
   *
   * @default 4
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 3
   */
  readonly datapointsToAlarm?: number;
  /**
   * The comparison operator used to compare the metric against the anomaly detection band.
   *
   * Defaults to `LESS_THAN_LOWER_THRESHOLD` to detect unexpected traffic drops, which
   * is the main case AWS's recommended static `Count` alarm targets but cannot express
   * with a fixed value.
   *
   * @default cloudwatch.ComparisonOperator.LESS_THAN_LOWER_THRESHOLD
   */
  readonly comparisonOperator?: cloudwatch.ComparisonOperator;
  /**
   * The alarm name.
   *
   * @default - apiName + ' - CountAnomaly'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This anomaly detection alarm detects unexpected drops in request volume
   * for the API Gateway stage, which can indicate clients calling the wrong endpoints
   * or an outage upstream.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ApiGatewayRestApiCountAnomalyAlarm construct.
 */
export interface ApiGatewayRestApiCountAnomalyAlarmProps extends
  ApiGatewayRestApiAlarmProps, ApiGatewayCountAnomalyAlarmConfig {}

/**
 * An anomaly detection alarm on the API Gateway `Count` metric.
 *
 * AWS recommends a static `Count` alarm with `LESS_THAN_THRESHOLD` to detect
 * unexpected traffic drops, but says the threshold "Depends on your situation".
 * This anomaly variant lets the band track historical traffic so the alarm
 * fires on actual drops without picking a number that goes stale.
 *
 * Because anomaly detection requires the `Average` statistic, this alarm tracks the
 * average request rate per period, not total request volume.
 *
 * Note: it detects partial drops below the expected band, not a complete outage.
 * API Gateway does not publish `Count` when there are zero requests, so a full
 * outage produces missing data (treated as not breaching) rather than a low value.
 * To alarm on zero traffic, pair this with a static `Count` alarm or a canary.
 */
export class ApiGatewayRestApiCountAnomalyAlarm extends cloudwatch.AnomalyDetectionAlarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApiCountAnomalyAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName} - ${ApiGatewayRecommendedAlarmsMetrics.COUNT_ANOMALY}`;
    // Anomaly bands use a fixed 5-minute metric period; a finer period produces noisier, less reliable bands.
    const period = Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 4;
    const datapointsToAlarm = props.datapointsToAlarm ?? 3;
    const stdDevs = props.stdDevs ?? 8;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const comparisonOperator = props.comparisonOperator ?? cloudwatch.ComparisonOperator.LESS_THAN_LOWER_THRESHOLD;
    const alarmDescription = props.alarmDescription ?? 'This anomaly detection alarm detects unexpected drops in request'
      + ' volume for the API Gateway stage, which can indicate clients calling the wrong endpoints or an outage upstream.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.api.metricCount({
        dimensionsMap: {
          ApiName: props.api.restApiName,
          Stage: props.api.deploymentStage.stageName,
        },
        statistic: 'Average',
        period,
      }),
      stdDevs,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator,
      alarmDescription,
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
};

/**
 * Configuration for the IntegrationLatency anomaly detection alarm.
 */
export interface ApiGatewayIntegrationLatencyAnomalyAlarmConfig extends ApiGatewayAnomalyAlarmBaseConfig {
  /**
   * The number of periods over which data is compared to the anomaly detection band.
   *
   * @default 3
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 2
   */
  readonly datapointsToAlarm?: number;
  /**
   * The comparison operator used to compare the metric against the anomaly detection band.
   *
   * @default cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD
   */
  readonly comparisonOperator?: cloudwatch.ComparisonOperator;
  /**
   * The alarm name.
   *
   * @default - apiName + ' - IntegrationLatencyAnomaly'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This anomaly detection alarm detects unusual drift in the API Gateway
   * backend integration latency, which can indicate backend performance issues
   * independent of API Gateway overhead.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ApiGatewayRestApiIntegrationLatencyAnomalyAlarm construct.
 */
export interface ApiGatewayRestApiIntegrationLatencyAnomalyAlarmProps extends
  ApiGatewayRestApiAlarmProps, ApiGatewayIntegrationLatencyAnomalyAlarmConfig {}

/**
 * An anomaly detection alarm on the API Gateway `IntegrationLatency` metric.
 *
 * Catches drift in backend latency separately from total request latency, so
 * a slow backend integration shows up even when overall request latency is
 * within normal range (e.g. because backend latency was always part of the
 * baseline). This library has no static counterpart for this metric.
 */
export class ApiGatewayRestApiIntegrationLatencyAnomalyAlarm extends cloudwatch.AnomalyDetectionAlarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApiIntegrationLatencyAnomalyAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName} - ${ApiGatewayRecommendedAlarmsMetrics.INTEGRATION_LATENCY_ANOMALY}`;
    // Anomaly bands use a fixed 5-minute metric period; a finer period produces noisier, less reliable bands.
    const period = Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const stdDevs = props.stdDevs ?? 8;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const comparisonOperator = props.comparisonOperator ?? cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD;
    const alarmDescription = props.alarmDescription ?? 'This anomaly detection alarm detects unusual drift in the API'
      + ' Gateway backend integration latency, which can indicate backend performance issues independent of API Gateway'
      + ' overhead.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.api.metricIntegrationLatency({
        dimensionsMap: {
          ApiName: props.api.restApiName,
          Stage: props.api.deploymentStage.stageName,
        },
        statistic: 'Average',
        period,
      }),
      stdDevs,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator,
      alarmDescription,
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
};

/**
 * Configurations for the recommended alarms for an ApiGateway RestApi.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface ApiGatewayRestApiRecommendedAlarmsConfig {
  /**
   * The default action to take when an alarm is triggered.
   *
   * @default - None
   */
  readonly defaultAlarmAction?: cloudwatch.IAlarmAction;
  /**
   * The default action to take when an alarm enters the ok state.
   *
   * @default - None
   */
  readonly defaultOkAction?: cloudwatch.IAlarmAction;
  /**
   * The default action to take when an alarm has insufficient data.
   *
   * @default - None
   */
  readonly defaultInsufficientDataAction?: cloudwatch.IAlarmAction;
  /**
   * How to handle missing data for this alarm.
   *
   * @default TreatMissingData.MISSING
   */
  readonly treatMissingData?: cloudwatch.TreatMissingData;
  /**
   * Alarm metrics to exclude from the recommended alarms.
   *
   * @default - None
   */
  readonly excludeAlarms?: ApiGatewayRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the 4XXError alarm.
   */
  readonly config4XXErrorAlarm: ApiGateway4XXErrorAlarmConfig;
  /**
   * The configuration for the 5XXError alarm.
   */
  readonly config5XXErrorAlarm: ApiGateway5XXErrorAlarmConfig;
  /**
   * The configuration for the Latency alarm.
   */
  readonly configLatencyAlarm?: ApiGatewayLatencyAlarmConfig;
  /**
   * The configuration list for the detailed Latency alarm.
   */
  readonly configDetailedLatencyAlarmList?: ApiGatewayRestApiDetailedLatencyAlarmConfig[];
  /**
   * The configuration for the Latency anomaly detection alarm.
   */
  readonly configLatencyAnomalyAlarm?: ApiGatewayLatencyAnomalyAlarmConfig;
  /**
   * The configuration for the Count anomaly detection alarm.
   */
  readonly configCountAnomalyAlarm?: ApiGatewayCountAnomalyAlarmConfig;
  /**
   * The configuration for the IntegrationLatency anomaly detection alarm.
   */
  readonly configIntegrationLatencyAnomalyAlarm?: ApiGatewayIntegrationLatencyAnomalyAlarmConfig;
}

/**
 * Properties for the ApiGatewayRestApiRecommendedAlarms construct.
 */
export interface ApiGatewayRestApiRecommendedAlarmsProps extends ApiGatewayRestApiRecommendedAlarmsConfig {
  /**
   * The ApiGateway api to monitor.
   */
  readonly api: apigateway.RestApi;
}

/**
 * A construct that creates the recommended alarms for an ApiGateway api.
 *
 * The recommended alarms created by default for the ApiName and Stage are:
 * - 4XXError alarm
 * - 5XXError alarm
 * - Latency alarm
 * - Latency anomaly detection alarm (additional to the static Latency alarm)
 * - Count anomaly detection alarm (drop detection for low-traffic APIs)
 * - IntegrationLatency anomaly detection alarm (no static counterpart)
 *
 * In order to create the Latency alarms for the Resource and Method dimensions the
 * configDetailedLatencyAlarmList must be specified.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ApiGateway
 */
export class ApiGatewayRestApiRecommendedAlarms extends Construct {
  /**
   * The 4XXError alarm.
   */
  public readonly alarm4XXError?: ApiGatewayRestApi4XXErrorAlarm;

  /**
   * The 5XXError alarm.
   */
  public readonly alarm5XXError?: ApiGatewayRestApi5XXErrorAlarm;

  /**
   * The Latency alarm.
   */
  public readonly alarmLatency?: ApiGatewayRestApiLatencyAlarm;

  /**
   * The Latency anomaly detection alarm.
   */
  public readonly alarmLatencyAnomaly?: ApiGatewayRestApiLatencyAnomalyAlarm;

  /**
   * The Count anomaly detection alarm.
   */
  public readonly alarmCountAnomaly?: ApiGatewayRestApiCountAnomalyAlarm;

  /**
   * The IntegrationLatency anomaly detection alarm.
   */
  public readonly alarmIntegrationLatencyAnomaly?: ApiGatewayRestApiIntegrationLatencyAnomalyAlarm;

  constructor(scope: Construct, id: string, props: ApiGatewayRestApiRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.ERROR_4XX)) {
      this.alarm4XXError = new ApiGatewayRestApi4XXErrorAlarm(this, `${props.api.node.id}_4XXError`, {
        api: props.api,
        treatMissingData: props.treatMissingData,
        ...props.config4XXErrorAlarm,
      });

      if (props.defaultAlarmAction && !props.config4XXErrorAlarm?.alarmAction) {
        this.alarm4XXError.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.config4XXErrorAlarm?.okAction) {
        this.alarm4XXError.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.config4XXErrorAlarm?.insufficientDataAction) {
        this.alarm4XXError.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.ERROR_5XX)) {
      this.alarm5XXError = new ApiGatewayRestApi5XXErrorAlarm(this, `${props.api.node.id}_5XXError`, {
        api: props.api,
        treatMissingData: props.treatMissingData,
        ...props.config5XXErrorAlarm,
      });

      if (props.defaultAlarmAction && !props.config5XXErrorAlarm?.alarmAction) {
        this.alarm5XXError.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.config5XXErrorAlarm?.okAction) {
        this.alarm5XXError.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.config5XXErrorAlarm?.insufficientDataAction) {
        this.alarm5XXError.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.LATENCY)) {
      this.alarmLatency = new ApiGatewayRestApiLatencyAlarm(this, `${props.api.node.id}_Latency`, {
        api: props.api,
        treatMissingData: props.treatMissingData,
        ...props.configLatencyAlarm,
      });

      if (props.defaultAlarmAction && !props.configLatencyAlarm?.alarmAction) {
        this.alarmLatency.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configLatencyAlarm?.okAction) {
        this.alarmLatency.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configLatencyAlarm?.insufficientDataAction) {
        this.alarmLatency.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.LATENCY) && props.configDetailedLatencyAlarmList) {
      props.configDetailedLatencyAlarmList.forEach((config, index) => {
        let alarmConfig = {
          api: props.api,
          treatMissingData: props.treatMissingData,
          ...config,
        };
        if (props.defaultAlarmAction && !config.alarmAction) {
          alarmConfig = { ...alarmConfig, alarmAction: props.defaultAlarmAction };
        }
        if (props.defaultOkAction && !config.okAction) {
          alarmConfig = { ...alarmConfig, okAction: props.defaultOkAction };
        }
        if (props.defaultInsufficientDataAction && !config.insufficientDataAction) {
          alarmConfig = { ...alarmConfig, insufficientDataAction: props.defaultInsufficientDataAction };
        }
        new ApiGatewayRestApiDetailedLatencyAlarm(this, `${props.api.node.id}_DetailedLatency${index}`, alarmConfig);
      });
    }

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.LATENCY_ANOMALY)) {
      this.alarmLatencyAnomaly = new ApiGatewayRestApiLatencyAnomalyAlarm(this, `${props.api.node.id}_LatencyAnomaly`, {
        api: props.api,
        treatMissingData: props.treatMissingData,
        ...props.configLatencyAnomalyAlarm,
      });

      if (props.defaultAlarmAction && !props.configLatencyAnomalyAlarm?.alarmAction) {
        this.alarmLatencyAnomaly.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configLatencyAnomalyAlarm?.okAction) {
        this.alarmLatencyAnomaly.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configLatencyAnomalyAlarm?.insufficientDataAction) {
        this.alarmLatencyAnomaly.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.COUNT_ANOMALY)) {
      this.alarmCountAnomaly = new ApiGatewayRestApiCountAnomalyAlarm(this, `${props.api.node.id}_CountAnomaly`, {
        api: props.api,
        treatMissingData: props.treatMissingData,
        ...props.configCountAnomalyAlarm,
      });

      if (props.defaultAlarmAction && !props.configCountAnomalyAlarm?.alarmAction) {
        this.alarmCountAnomaly.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configCountAnomalyAlarm?.okAction) {
        this.alarmCountAnomaly.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configCountAnomalyAlarm?.insufficientDataAction) {
        this.alarmCountAnomaly.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.INTEGRATION_LATENCY_ANOMALY)) {
      this.alarmIntegrationLatencyAnomaly = new ApiGatewayRestApiIntegrationLatencyAnomalyAlarm(
        this,
        `${props.api.node.id}_IntegrationLatencyAnomaly`,
        {
          api: props.api,
          treatMissingData: props.treatMissingData,
          ...props.configIntegrationLatencyAnomalyAlarm,
        },
      );

      if (props.defaultAlarmAction && !props.configIntegrationLatencyAnomalyAlarm?.alarmAction) {
        this.alarmIntegrationLatencyAnomaly.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configIntegrationLatencyAnomalyAlarm?.okAction) {
        this.alarmIntegrationLatencyAnomaly.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configIntegrationLatencyAnomalyAlarm?.insufficientDataAction) {
        this.alarmIntegrationLatencyAnomaly.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the RestApi construct that provides methods
 * to create recommended alarms.
 */
export class RestApi extends apigateway.RestApi {
  constructor(scope: Construct, id: string, props: apigateway.RestApiBaseProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the number of client-side errors captured in a given period.
   */
  public alarm4XXError(props: ApiGateway4XXErrorAlarmConfig): ApiGatewayRestApi4XXErrorAlarm {
    return new ApiGatewayRestApi4XXErrorAlarm(this, '4XXErrorAlarm', {
      api: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the number of server-side errors captured in a given period.
   */
  public alarm5XXError(props: ApiGateway5XXErrorAlarmConfig): ApiGatewayRestApi5XXErrorAlarm {
    return new ApiGatewayRestApi5XXErrorAlarm(this, '5XXErrorAlarm', {
      api: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the time between when API Gateway receives a request
   * from a client and when it returns a response to the client.
   */
  public alarmLatency(props?: ApiGatewayLatencyAlarmConfig): ApiGatewayRestApiLatencyAlarm {
    return new ApiGatewayRestApiLatencyAlarm(this, 'LatencyAlarm', {
      api: this,
      ...props,
    });
  }

  /**
   * Creates a list of alarms the time between when API Gateway receives a request
   * from a client and when it returns a response to the client for the methods and
   * resources specified.
   */
  public alarmDetailedLatency(props: ApiGatewayRestApiDetailedLatencyAlarmConfig[]): ApiGatewayRestApiDetailedLatencyAlarm[] {
    let alarmList: ApiGatewayRestApiDetailedLatencyAlarm[] = [];

    props.forEach((config, index) => {
      const alarm = new ApiGatewayRestApiDetailedLatencyAlarm(this, `DetailedLatency${index}`, {
        api: this,
        ...config,
      });
      alarmList.push(alarm);
    });
    return alarmList;
  }

  /**
   * Creates an anomaly detection alarm on the Latency metric. Detects drift in
   * total request latency without requiring a static threshold; intended to
   * coexist with the static `Latency` alarm.
   */
  public alarmLatencyAnomaly(props?: ApiGatewayLatencyAnomalyAlarmConfig): ApiGatewayRestApiLatencyAnomalyAlarm {
    return new ApiGatewayRestApiLatencyAnomalyAlarm(this, 'LatencyAnomalyAlarm', {
      api: this,
      ...props,
    });
  }

  /**
   * Creates an anomaly detection alarm on the Count metric. Detects unexpected
   * traffic drops (the default) or spikes for low-traffic APIs where a static
   * count threshold is hard to pick.
   */
  public alarmCountAnomaly(props?: ApiGatewayCountAnomalyAlarmConfig): ApiGatewayRestApiCountAnomalyAlarm {
    return new ApiGatewayRestApiCountAnomalyAlarm(this, 'CountAnomalyAlarm', {
      api: this,
      ...props,
    });
  }

  /**
   * Creates an anomaly detection alarm on the IntegrationLatency metric.
   * Catches backend integration latency drift independently of API Gateway
   * overhead.
   */
  public alarmIntegrationLatencyAnomaly(
    props?: ApiGatewayIntegrationLatencyAnomalyAlarmConfig,
  ): ApiGatewayRestApiIntegrationLatencyAnomalyAlarm {
    return new ApiGatewayRestApiIntegrationLatencyAnomalyAlarm(this, 'IntegrationLatencyAnomalyAlarm', {
      api: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the ApiGateway api.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ApiGateway
   */
  public applyRecommendedAlarms(props: ApiGatewayRestApiRecommendedAlarmsConfig): ApiGatewayRestApiRecommendedAlarms {
    return new ApiGatewayRestApiRecommendedAlarms(this, 'ApiGatewayRestApiRecommendedAlarms', {
      api: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an ApiGateway api.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ApiGateway
 */
export class ApiGatewayRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: ApiGatewayRestApiRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof apigateway.RestApi) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const api = node as apigateway.RestApi;

        new ApiGatewayRestApiRecommendedAlarms(api, 'ApiGatewayRestApiRecommendedAlarmsFromAspect', {
          api,
          ...this.props,
        });
      }
    }
  }
}
