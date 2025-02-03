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
   * The total number API requests in a given period.
   */
  COUNT = 'Count',
  /**
   * The time (milliseconds) between when API Gateway receives a request from a client and
   * when it returns a response to the client. The latency includes the integration latency
   * and other API Gateway overhead.
   */
  LATENCY = 'Latency',
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
   * The percentage (0-1) value against which the specified statistic is compared.
   * The suggested threshold detects when more than 5% of total requests are getting 4XX errors.
   * However, you can tune the threshold to suit the traffic of the requests as well as acceptable
   * error rates. You can also analyze historical data to determine the acceptable error rate for
   * the application workload and then tune the threshold accordingly. Frequently occurring 4XX
   * errors need to be alarmed on. However, setting a very low value for the threshold can cause
   * the alarm to be too sensitive.
   *
   * @default 0.05
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
 * This alarm detects a high rate of client-side errors.
 *
 * This can indicate an issue in the authorization or client request parameters. It could also mean that a resource was
 * removed or a client is requesting one that doesn't exist. Consider enabling CloudWatch Logs and checking for any errors
 * that may be causing the 4XX errors. Moreover, consider enabling detailed CloudWatch metrics to view this metric per
 * resource and method and narrow down the source of the errors. Errors could also be caused by exceeding the configured
 * throttling limit.
 *
 * The alarm is triggered when percentage of client-errors exceeds the threshold.
 */
export class ApiGatewayRestApi4XXErrorAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApi4XXErrorAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName} - ${ApiGatewayRecommendedAlarmsMetrics.ERROR_4XX}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 0.05;
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
   * The percentage (0-1) value against which the specified statistic is compared.
   * The suggested threshold detects when more than 5% of total requests are getting 5XX errors.
   * However, you can tune the threshold to suit the traffic of the requests as well as acceptable
   * error rates. you can also analyze historical data to determine the acceptable error rate for
   * the application workload and then tune the threshold accordingly. Frequently occurring 5XX
   * errors need to be alarmed on. However, setting a very low value for the threshold can cause
   * the alarm to be too sensitive.
   *
   * @default 0.05
   */
  readonly threshold?: number;
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
 * This alarm detects a high rate of server-side errors.
 *
 * This can indicate that there is something wrong on the API backend, the network,
 * or the integration between the API gateway and the backend API.
 *
 * The alarm is triggered when percentage of server-errors exceeds the threshold.
 */
export class ApiGatewayRestApi5XXErrorAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApi5XXErrorAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName} - ${ApiGatewayRecommendedAlarmsMetrics.ERROR_5XX}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 3;
    const threshold = props.threshold ?? 0.05;
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
 * Configuration for the Count alarm.
 */
export interface ApiGatewayCountAlarmConfig extends ApiGatewayAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   * Set the threshold based on historical data analysis to determine what the expected
   * baseline request count for your API is. Setting the threshold at a very high value
   * might cause the alarm to be too sensitive at periods of normal and expected low traffic.
   * Conversely, setting it at a very low value might cause the alarm to miss anomalous
   * smaller drops in traffic volume.
   *
   */
  readonly threshold: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 10
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 10
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - apiName + ' - Count'
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
 * The properties for the ApiGatewayRestApiCountAlarm construct.
 */
export interface ApiGatewayRestApiCountAlarmProps extends ApiGatewayRestApiAlarmProps, ApiGatewayCountAlarmConfig {}

/**
 * This alarm helps to detect low traffic volume for the REST API stage.
 *
 * This can be an indicator of an issue with the application calling the API such as using incorrect endpoints.
 * It could also be an indicator of an issue with the configuration or permissions of the API making it unreachable
 * for clients.
 *
 * The alarm is triggered when the number of requests in a given period is less than threshold.
 */
export class ApiGatewayRestApiCountAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApiCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName} - ${ApiGatewayRecommendedAlarmsMetrics.COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 10;
    const datapointsToAlarm = props.datapointsToAlarm ?? 10;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect unexpectedly low traffic volume for'
      + ' the REST API stage.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.api.metricCount({
        dimensionsMap: {
          ApiName: props.api.restApiName,
          Stage: props.api.deploymentStage.stageName,
        },
        statistic: 'SampleCount',
        period,
      }),
      threshold,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
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
 * Configuration for the Count alarm when monitoring resource and method dimensions.
 */
export interface ApiGatewayRestApiDetailedCountAlarmConfig extends
  ApiGatewayCountAlarmConfig,
  ApiGatewayDetailedAlarmConfig {}

/**
 * The properties for the ApiGatewayRestApiDetailedCountAlarm construct.
 */
export interface ApiGatewayRestApiDetailedCountAlarmProps extends
  ApiGatewayRestApiAlarmProps,
  ApiGatewayCountAlarmConfig,
  ApiGatewayDetailedAlarmConfig {}

/**
 * This alarm can detect unexpectedly low traffic volume for the REST API resource and method
 * in the stage.
 *
 * We recommend that you create this alarm if your API receives a predictable and
 * consistent number of requests under normal conditions. This alarm is not recommended for APIs
 * that don't expect constant and consistent traffic.
 *
 * The alarm is triggered when the number of requests in a given period is less than threshold.
 */
export class ApiGatewayRestApiDetailedCountAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ApiGatewayRestApiDetailedCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.api.restApiName}-${props.alias} - ${ApiGatewayRecommendedAlarmsMetrics.COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 10;
    const datapointsToAlarm = props.datapointsToAlarm ?? 10;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect when the API Gateway requests for a'
      + ' resource and method in a stage have high latency.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.api.metricCount({
        dimensionsMap: {
          ApiName: props.api.restApiName,
          Stage: props.api.deploymentStage.stageName,
          Resource: props.resource,
          Method: props.method,
        },
        statistic: 'SampleCount',
        period,
      }),
      threshold,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
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
  readonly config4XXErrorAlarm?: ApiGateway4XXErrorAlarmConfig;
  /**
   * The configuration for the 5XXError alarm.
   */
  readonly config5XXErrorAlarm?: ApiGateway5XXErrorAlarmConfig;
  /**
   * The configuration for the Count alarm.
   */
  readonly configCountAlarm: ApiGatewayCountAlarmConfig;
  /**
   * The configuration for the Latency alarm.
   */
  readonly configLatencyAlarm?: ApiGatewayLatencyAlarmConfig;
  /**
   * The configuration list for the detailed Count alarm.
   */
  readonly configDetailedCountAlarmList?: ApiGatewayRestApiDetailedCountAlarmConfig[];
  /**
   * The configuration list for the detailed Latency alarm.
   */
  readonly configDetailedLatencyAlarmList?: ApiGatewayRestApiDetailedLatencyAlarmConfig[];
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
 * - Count alarm
 * - Latency alarm
 *
 * In order to create the Count or Latency alarms for the Resource and Method dimensions the
 * configDetailedCountAlarmList or configDetailedLatencyAlarmList must be specified.
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
   * The Count alarm.
   */
  public readonly alarmCount?: ApiGatewayRestApiCountAlarm;

  /**
   * The Latency alarm.
   */
  public readonly alarmLatency?: ApiGatewayRestApiLatencyAlarm;

  constructor(scope: Construct, id: string, props: ApiGatewayRestApiRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.ERROR_4XX)) {
      this.alarm4XXError = new ApiGatewayRestApi4XXErrorAlarm(this, `${props.api.node.id}_4XXError`, {
        api: props.api,
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

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.COUNT)) {
      this.alarmCount = new ApiGatewayRestApiCountAlarm(this, `${props.api.node.id}_Count`, {
        api: props.api,
        ...props.configCountAlarm,
      });

      if (props.defaultAlarmAction && !props.configCountAlarm.alarmAction) {
        this.alarmCount.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configCountAlarm.okAction) {
        this.alarmCount.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configCountAlarm.insufficientDataAction) {
        this.alarmCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.LATENCY)) {
      this.alarmLatency = new ApiGatewayRestApiLatencyAlarm(this, `${props.api.node.id}_Latency`, {
        api: props.api,
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

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.COUNT) && props.configDetailedCountAlarmList) {
      props.configDetailedCountAlarmList.forEach((config, index) => {
        let alarmConfig = {
          api: props.api,
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
        new ApiGatewayRestApiDetailedCountAlarm(this, `${props.api.node.id}_DetailedCount${index}`, alarmConfig);
      });
    }

    if (!props.excludeAlarms?.includes(ApiGatewayRecommendedAlarmsMetrics.LATENCY) && props.configDetailedLatencyAlarmList) {
      props.configDetailedLatencyAlarmList.forEach((config, index) => {
        let alarmConfig = {
          api: props.api,
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
  public alarm4XXError(props?: ApiGateway4XXErrorAlarmConfig): ApiGatewayRestApi4XXErrorAlarm {
    return new ApiGatewayRestApi4XXErrorAlarm(this, '4XXErrorAlarm', {
      api: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the number of server-side errors captured in a given period.
   */
  public alarm5XXError(props?: ApiGateway5XXErrorAlarmConfig): ApiGatewayRestApi5XXErrorAlarm {
    return new ApiGatewayRestApi5XXErrorAlarm(this, '5XXErrorAlarm', {
      api: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the total number API requests in a given period.
   */
  public alarmCount(props: ApiGatewayCountAlarmConfig): ApiGatewayRestApiCountAlarm {
    return new ApiGatewayRestApiCountAlarm(this, 'CountAlarm', {
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
   * Creates a list of alarms that monitor the total number API requests in a given period for
   * the methods and resources specified.
   */
  public alarmDetailedCount(props: ApiGatewayRestApiDetailedCountAlarmConfig[]): ApiGatewayRestApiDetailedCountAlarm[] {
    let alarmList: ApiGatewayRestApiDetailedCountAlarm[] = [];

    props.forEach((config, index) => {
      const alarm = new ApiGatewayRestApiDetailedCountAlarm(this, `DetailedCount${index}`, {
        api: this,
        ...config,
      });
      alarmList.push(alarm);
    });
    return alarmList;
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
