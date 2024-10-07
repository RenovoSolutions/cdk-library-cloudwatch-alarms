import {
  IAspect,
  aws_cloudfront as cloudfront,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for CloudFront alarms.
 */
export enum CloudFrontRecommendedAlarmsMetrics {
  /**
   * The percentage of all viewer requests for which the response's HTTP status code is 5xx.
   */
  ERROR_RATE_5XX = '5xxErrorRate',
  /**
   * The total time spent from when CloudFront receives a request to when it starts providing
   * a response to the network (not the viewer), for requests that are served from the origin,
   * not the CloudFront cache. This is also known as first byte latency, or time-to-first-byte.
   */
  ORIGIN_LATENCY = 'OriginLatency',
  /**
   * The number of validation errors produced by the function in a given time period.
   * Validation errors occur when the function runs successfully but returns invalid data
   * (an invalid {@link https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/functions-event-structure.html|event object}).
   */
  FUNCTION_VALIDATION_ERRORS = 'FunctionValidationErrors',
  /**
   * The number of execution errors that occurred in a given time period. Execution errors occur
   * when the function fails to complete successfully.
   */
  FUNCTION_EXECUTION_ERRORS = 'FunctionExecutionErrors',
  /**
   * The number of times that the function was throttled in a given time period.
   * Functions can be throttled for the following reasons:
   * - The function continuously exceeds the maximum time allowed for execution
   * - The function results in compilation errors
   * - There is an unusually high number of requests per second
   */
  FUNCTION_THROTTLES = 'FunctionThrottles',
}

/**
 * The common optional configuration for the alarms.
 */
export interface CloudFrontAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the CloudFront alarms when monitoring resource and method dimensions.
 */
export interface CloudFrontDetailedAlarmConfig {
  /**
   * The name of the function to monitor, used as a discriminator in the alarm name.
   */
  readonly functionName: string;
}

/**
 * The common properties for the CloudFront Distribution alarms.
 */
export interface CloudFrontDistributionAlarmProps {
  /**
   * The CloudFront Distribution to monitor.
   */
  readonly distribution: cloudfront.Distribution;
}

/**
 * Configuration for the 5xxErrorRate alarm.
 */
export interface CloudFront5xxErrorRateAlarmConfig extends CloudFrontAlarmBaseConfig {
  /**
   * The recommended threshold value for this alarm is highly dependent on the tolerance
   * for 5xx responses. You can analyze historical data and trends, and then set the threshold
   * accordingly. Because 5xx errors can be caused by transient issues, we recommend that you
   * set the threshold to a value greater than 0 so that the alarm is not too sensitive.
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
   * @default - distributionId + ' - 5xxErrorRate'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect problems with serving requests from the origin server,
   * or problems with communication between CloudFront and your origin server.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the CloudFrontDistribution5xxErrorRateAlarm construct.
 */
export interface CloudFrontDistribution5xxErrorRateAlarmProps extends CloudFrontDistributionAlarmProps, CloudFront5xxErrorRateAlarmConfig {}

/**
 * This alarm monitors the percentage of 5xx error responses from your origin server, to help you detect if
 * the CloudFront service is having issues.
 *
 * See {@link https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/troubleshooting-response-errors.html|Troubleshooting error responses from your origin} for information to help you understand the problems with your server.
 *
 * The alarm is triggered when the percentage exceeds the threshold.
 */
export class CloudFrontDistribution5xxErrorRateAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: CloudFrontDistribution5xxErrorRateAlarmProps) {
    const alarmName = props.alarmName ?? `${props.distribution.distributionId} - ${CloudFrontRecommendedAlarmsMetrics.ERROR_RATE_5XX}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect problems with serving requests from the origin'
      + '  server, or problems with communication between CloudFront and your origin server.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.distribution.metric5xxErrorRate(
        {
          period,
        },
      ),
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
 * Configuration for the OriginLatency alarm.
 */
export interface CloudFrontOriginLatencyAlarmConfig extends CloudFrontAlarmBaseConfig {
  /**
   * You should calculate the value of about 80% of the origin response timeout, and use the result
   * as the threshold value. If this metric is consistently close to the origin response timeout value,
   * you might start experiencing 504 errors.
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
   * @default - distributionId + ' - OriginLatency'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect problems with the origin server taking too long to respond.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the CloudFrontDistributionOriginLatencyAlarm construct.
 */
export interface CloudFrontDistributionOriginLatencyAlarmProps extends CloudFrontDistributionAlarmProps, CloudFrontOriginLatencyAlarmConfig {}

/**
 * The alarm helps to monitor if the origin server is taking too long to respond.
 *
 * If the server takes too long to respond, it might lead to a timeout.
 * Refer to {@link https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/http-504-gateway-timeout.html#http-504-gateway-timeout-slow-application|find and fix delayed responses from applications on your origin server}
 * if you experience consistently high OriginLatency values.
 *
 * The alarm is triggered when the percentage is lower or equals the threshold.
 */
export class CloudFrontDistributionOriginLatencyAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: CloudFrontDistributionOriginLatencyAlarmProps) {
    const alarmName = props.alarmName ?? `${props.distribution.distributionId} - ${CloudFrontRecommendedAlarmsMetrics.ORIGIN_LATENCY}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect problems with the origin server taking'
      + ' too long to respond.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.distribution.metricOriginLatency(
        {
          period,
          statistic: 'p90',
        },
      ),
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
 * Configuration for the FunctionValidationErrors alarm.
 */
export interface CloudFrontFunctionValidationErrorsAlarmConfig extends CloudFrontAlarmBaseConfig {
  /**
   * A value greater than 0 indicates a validation error. We recommend setting the threshold to 0 because
   * validation errors imply a problem when CloudFront functions hand off back to CloudFront. For example,
   * CloudFront needs the HTTP Host header in order to process a request. There is nothing stopping a user
   * from deleting the Host header in their CloudFront functions code. But when CloudFront gets the response
   * back and the Host header is missing, CloudFront throws a validation error.
   *
   * @default 0
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 2
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 2
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - distributionId + ' - ' + functionName + ' - FunctionValidationErrors'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect validation errors from CloudFront functions.
   */
  readonly alarmDescription?: string;
}

/**
 * Configuration for the FunctionValidationErrors alarm when monitoring resource and method dimensions.
 */
export interface CloudFrontDistributionDetailedFunctionValidationErrorsAlarmConfig extends
  CloudFrontFunctionValidationErrorsAlarmConfig,
  CloudFrontDetailedAlarmConfig {}

/**
 * The properties for the CloudFrontDistributionDetailedFunctionValidationErrorsAlarm construct.
 */
export interface CloudFrontDistributionDetailedFunctionValidationErrorsAlarmProps extends
  CloudFrontDistributionAlarmProps,
  CloudFrontFunctionValidationErrorsAlarmConfig,
  CloudFrontDetailedAlarmConfig {}

/**
 * This alarm helps you monitor validation errors from CloudFront functions so that you can take
 * steps to resolve them.
 *
 * Analyze the CloudWatch function logs and look at the function code to find and resolve the root
 * cause of the problem.
 *
 * The alarm is triggered when the number of validation errors is greater than threshold.
 */
export class CloudFrontDistributionDetailedFunctionValidationErrorsAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: CloudFrontDistributionDetailedFunctionValidationErrorsAlarmProps) {
    const alarmName = props.alarmName ?? `${props.distribution.distributionId}-${props.functionName} - ${CloudFrontRecommendedAlarmsMetrics.FUNCTION_VALIDATION_ERRORS}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 2;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const threshold = props.threshold ?? 0;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect validation errors from CloudFront functions.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/CloudFront',
        metricName: CloudFrontRecommendedAlarmsMetrics.FUNCTION_VALIDATION_ERRORS,
        dimensionsMap: {
          DistributionId: props.distribution.distributionId,
          FunctionName: props.functionName,
          Region: 'GLOBAL',
        },
        period,
        statistic: 'Sum',
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
 * Configuration for the FunctionExecutionErrors alarm.
 */
export interface CloudFrontFunctionExecutionErrorsAlarmConfig extends CloudFrontAlarmBaseConfig {
  /**
   * We recommend to set the threshold to 0 because an execution error indicates a problem with the
   * code that occurs at runtime.
   * @default 0
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
   * @default - distributionId + ' - ' + functionName + ' - FunctionExecutionErrors'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect execution errors from CloudFront functions.
   */
  readonly alarmDescription?: string;
}

/**
 * Configuration for the FunctionExecutionErrors alarm when monitoring resource and method dimensions.
 */
export interface CloudFrontDistributionDetailedFunctionExecutionErrorsAlarmConfig extends
  CloudFrontFunctionExecutionErrorsAlarmConfig,
  CloudFrontDetailedAlarmConfig {}

/**
 * The properties for the CloudFrontDistributionDetailedFunctionExecutionErrorsAlarm construct.
 */
export interface CloudFrontDistributionDetailedFunctionExecutionErrorsAlarmProps extends
  CloudFrontDistributionAlarmProps,
  CloudFrontFunctionExecutionErrorsAlarmConfig,
  CloudFrontDetailedAlarmConfig {}

/**
 * This alarm helps you monitor execution errors from CloudFront functions so that you can take
 * steps to resolve them.
 *
 * Analyze the CloudWatch function logs and look at the function code to find and resolve the root
 * cause of the problem.
 *
 * The alarm is triggered when the number of execution errors is greater than threshold.
 */
export class CloudFrontDistributionDetailedFunctionExecutionErrorsAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: CloudFrontDistributionDetailedFunctionExecutionErrorsAlarmProps) {
    const alarmName = props.alarmName ?? `${props.distribution.distributionId}-${props.functionName} - ${CloudFrontRecommendedAlarmsMetrics.FUNCTION_EXECUTION_ERRORS}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 0;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect execution errors from CloudFront functions.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/CloudFront',
        metricName: CloudFrontRecommendedAlarmsMetrics.FUNCTION_EXECUTION_ERRORS,
        dimensionsMap: {
          DistributionId: props.distribution.distributionId,
          FunctionName: props.functionName,
          Region: 'GLOBAL',
        },
        period,
        statistic: 'Sum',
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
 * Configuration for the FunctionThrottles alarm.
 */
export interface CloudFrontFunctionThrottlesAlarmConfig extends CloudFrontAlarmBaseConfig {
  /**
   * We recommend setting the threshold to 0, to allow quicker resolution of the function throttles.
   * @default 0
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
   * @default - distributionId + ' - ' + functionName + ' - FunctionThrottles'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can detect when your CloudFront function is throttled so that you can
   * react and resolve the issue for a smooth customer experience.
   */
  readonly alarmDescription?: string;
}

/**
 * Configuration for the FunctionThrottles alarm when monitoring resource and method dimensions.
 */
export interface CloudFrontDistributionDetailedFunctionThrottlesAlarmConfig extends
  CloudFrontFunctionThrottlesAlarmConfig,
  CloudFrontDetailedAlarmConfig {}

/**
 * The properties for the CloudFrontDistributionDetailedFunctionThrottlesAlarm construct.
 */
export interface CloudFrontDistributionDetailedFunctionThrottlesAlarmProps extends
  CloudFrontDistributionAlarmProps,
  CloudFrontFunctionThrottlesAlarmConfig,
  CloudFrontDetailedAlarmConfig {}

/**
 * This alarm helps you to monitor if your CloudFront function is throttled.
 *
 * If your function is throttled, it means that it is taking too long to execute.
 * To avoid function throttles, consider optimizing the function code.
 *
 * The alarm is triggered when the number of times the function was throttled is greater than threshold.
 */
export class CloudFrontDistributionDetailedFunctionThrottlesAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: CloudFrontDistributionDetailedFunctionThrottlesAlarmProps) {
    const alarmName = props.alarmName ?? `${props.distribution.distributionId}-${props.functionName} - ${CloudFrontRecommendedAlarmsMetrics.FUNCTION_THROTTLES}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 0;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect when your CloudFront function is throttled'
      + ' so that you can react and resolve the issue for a smooth customer experience.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/CloudFront',
        metricName: CloudFrontRecommendedAlarmsMetrics.FUNCTION_THROTTLES,
        dimensionsMap: {
          DistributionId: props.distribution.distributionId,
          FunctionName: props.functionName,
          Region: 'GLOBAL',
        },
        period,
        statistic: 'Sum',
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
 * Configurations for the recommended alarms for an CloudFront Service.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface CloudFrontDistributionRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: CloudFrontRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the 5xxErrorRate alarm.
   */
  readonly config5xxErrorRateAlarm: CloudFront5xxErrorRateAlarmConfig;
  /**
   * The configuration for the OriginLatency alarm.
   */
  readonly configOriginLatencyAlarm: CloudFrontOriginLatencyAlarmConfig;
  /**
   * The configuration list for the detailed FunctionValidationErrors alarm.
   */
  readonly configDetailedFunctionValidationErrorsAlarmList?: CloudFrontDistributionDetailedFunctionValidationErrorsAlarmConfig[];
  /**
   * The configuration list for the detailed FunctionExecutionErrors alarm.
   */
  readonly configDetailedFunctionExecutionErrorsAlarmList?: CloudFrontDistributionDetailedFunctionExecutionErrorsAlarmConfig[];
  /**
   * The configuration list for the detailed FunctionThrottles alarm.
   */
  readonly configDetailedFunctionThrottlesAlarmList?: CloudFrontDistributionDetailedFunctionThrottlesAlarmConfig[];
}

/**
 * Properties for the CloudFrontDistributionRecommendedAlarms construct.
 */
export interface CloudFrontDistributionRecommendedAlarmsProps extends CloudFrontDistributionRecommendedAlarmsConfig {
  /**
   * The CloudFront Distribution to monitor.
   */
  readonly distribution: cloudfront.Distribution;
}

/**
 * A construct that creates the recommended alarms for an CloudFront Distribution.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#CloudFront
 */
export class CloudFrontDistributionRecommendedAlarms extends Construct {
  /**
   * The 5xxErrorRate alarm.
   */
  public readonly alarm5xxErrorRate?: CloudFrontDistribution5xxErrorRateAlarm;

  /**
   * The OriginLatency alarm.
   */
  public readonly alarmOriginLatency?: CloudFrontDistributionOriginLatencyAlarm;

  constructor(scope: Construct, id: string, props: CloudFrontDistributionRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(CloudFrontRecommendedAlarmsMetrics.ERROR_RATE_5XX)) {
      this.alarm5xxErrorRate = new CloudFrontDistribution5xxErrorRateAlarm(this, `${props.distribution.node.id}_5xxErrorRate`, {
        distribution: props.distribution,
        ...props.config5xxErrorRateAlarm,
      });

      if (props.defaultAlarmAction && !props.config5xxErrorRateAlarm.alarmAction) {
        this.alarm5xxErrorRate.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.config5xxErrorRateAlarm.okAction) {
        this.alarm5xxErrorRate.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.config5xxErrorRateAlarm.insufficientDataAction) {
        this.alarm5xxErrorRate.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(CloudFrontRecommendedAlarmsMetrics.ORIGIN_LATENCY)) {
      this.alarmOriginLatency = new CloudFrontDistributionOriginLatencyAlarm(this, `${props.distribution.node.id}_OriginLatency`, {
        distribution: props.distribution,
        ...props.configOriginLatencyAlarm,
      });

      if (props.defaultAlarmAction && !props.configOriginLatencyAlarm.alarmAction) {
        this.alarmOriginLatency.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configOriginLatencyAlarm.okAction) {
        this.alarmOriginLatency.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configOriginLatencyAlarm.insufficientDataAction) {
        this.alarmOriginLatency.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (
      !props.excludeAlarms?.includes(CloudFrontRecommendedAlarmsMetrics.FUNCTION_VALIDATION_ERRORS) &&
      props.configDetailedFunctionValidationErrorsAlarmList
    ) {
      props.configDetailedFunctionValidationErrorsAlarmList.forEach((config, index) => {
        let alarmConfig = {
          distribution: props.distribution,
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
        new CloudFrontDistributionDetailedFunctionValidationErrorsAlarm(this, `${props.distribution.node.id}_DetailedFunctionValidationErrors${index}`, alarmConfig);
      });
    }

    if (
      !props.excludeAlarms?.includes(CloudFrontRecommendedAlarmsMetrics.FUNCTION_EXECUTION_ERRORS) &&
      props.configDetailedFunctionExecutionErrorsAlarmList
    ) {
      props.configDetailedFunctionExecutionErrorsAlarmList.forEach((config, index) => {
        let alarmConfig = {
          distribution: props.distribution,
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
        new CloudFrontDistributionDetailedFunctionExecutionErrorsAlarm(this, `${props.distribution.node.id}_DetailedFunctionExecutionErrors${index}`, alarmConfig);
      });
    }

    if (
      !props.excludeAlarms?.includes(CloudFrontRecommendedAlarmsMetrics.FUNCTION_THROTTLES) &&
      props.configDetailedFunctionThrottlesAlarmList
    ) {
      props.configDetailedFunctionThrottlesAlarmList.forEach((config, index) => {
        let alarmConfig = {
          distribution: props.distribution,
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
        new CloudFrontDistributionDetailedFunctionThrottlesAlarm(this, `${props.distribution.node.id}_DetailedFunctionThrottles${index}`, alarmConfig);
      });
    }
  }
}

/**
 * An extension for the Distribution construct that provides methods
 * to create recommended alarms.
 */
export class Distribution extends cloudfront.Distribution {
  constructor(scope: Construct, id: string, props: cloudfront.DistributionProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the 5xxErrorRate for the CloudFront distribution.
   */
  public alarm5xxErrorRate(props: CloudFront5xxErrorRateAlarmConfig): CloudFrontDistribution5xxErrorRateAlarm {
    return new CloudFrontDistribution5xxErrorRateAlarm(this, '5xxErrorRateAlarm', {
      distribution: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the OriginLatency for the CloudFront distribution.
   */
  public alarmOriginLatency(props: CloudFrontOriginLatencyAlarmConfig): CloudFrontDistributionOriginLatencyAlarm {
    return new CloudFrontDistributionOriginLatencyAlarm(this, 'OriginLatencyAlarm', {
      distribution: this,
      ...props,
    });
  }

  /**
   * Creates a list of alarms that monitor the total number of validation errors produced by the function in a given time period.
   */
  public alarmDetailedFunctionValidationErrors(
    props: CloudFrontDistributionDetailedFunctionValidationErrorsAlarmConfig[],
  ): CloudFrontDistributionDetailedFunctionValidationErrorsAlarm[] {
    let alarmList: CloudFrontDistributionDetailedFunctionValidationErrorsAlarm[] = [];

    props.forEach((config, index) => {
      const alarm = new CloudFrontDistributionDetailedFunctionValidationErrorsAlarm(this, `DetailedFunctionValidationErrors${index}`, {
        distribution: this,
        ...config,
      });
      alarmList.push(alarm);
    });
    return alarmList;
  }

  /**
   * Creates a list of alarms that monitor the total number of execution errors produced by the function in a given time period.
   */
  public alarmDetailedFunctionExecutionErrors(
    props: CloudFrontDistributionDetailedFunctionExecutionErrorsAlarmConfig[],
  ): CloudFrontDistributionDetailedFunctionExecutionErrorsAlarm[] {
    let alarmList: CloudFrontDistributionDetailedFunctionExecutionErrorsAlarm[] = [];

    props.forEach((config, index) => {
      const alarm = new CloudFrontDistributionDetailedFunctionExecutionErrorsAlarm(this, `DetailedFunctionExecutionErrors${index}`, {
        distribution: this,
        ...config,
      });
      alarmList.push(alarm);
    });
    return alarmList;
  }

  /**
   * Creates a list of alarms that monitor the total number of times that the function was throttled in a given time period.
   */
  public alarmDetailedFunctionThrottles(
    props: CloudFrontDistributionDetailedFunctionThrottlesAlarmConfig[],
  ): CloudFrontDistributionDetailedFunctionThrottlesAlarm[] {
    let alarmList: CloudFrontDistributionDetailedFunctionThrottlesAlarm[] = [];

    props.forEach((config, index) => {
      const alarm = new CloudFrontDistributionDetailedFunctionThrottlesAlarm(this, `DetailedFunctionThrottles${index}`, {
        distribution: this,
        ...config,
      });
      alarmList.push(alarm);
    });
    return alarmList;
  }

  /**
   * Creates the recommended alarms for the CloudFront Distribution.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#CloudFront
   */
  public applyRecommendedAlarms(props: CloudFrontDistributionRecommendedAlarmsConfig): CloudFrontDistributionRecommendedAlarms {
    return new CloudFrontDistributionRecommendedAlarms(this, 'CloudFrontDistributionRecommendedAlarms', {
      distribution: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an CloudFront Distribution.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#CloudFront
 */
export class CloudFrontRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: CloudFrontDistributionRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof cloudfront.Distribution) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const distribution = node as cloudfront.Distribution;

        new CloudFrontDistributionRecommendedAlarms(distribution, 'CloudFrontDistributionRecommendedAlarmsFromAspect', {
          distribution,
          ...this.props,
        });
      }
    }
  }
}
