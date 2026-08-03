import {
  IAspect,
  aws_lambda as lambda,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { IConstruct, Construct } from 'constructs';
import { AlarmBaseProps, AnomalyComparisonOperator, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for Lambda alarms.
 */
export enum LambdaRecommendedAlarmsMetrics {
  /**
   * Errors include the exceptions thrown by the code as well as exceptions thrown by the Lambda runtime.
   */
  ERRORS = 'Errors',
  /**
   * Throttles occur when there is no concurrency available for scale up.
   */
  THROTTLES = 'Throttles',
  /**
   * Duration is the time taken for the function to process an event.
   */
  DURATION = 'Duration',
  /**
   * ConcurrentExecutions is the number of concurrent executions of the function.
   */
  CONCURRENT_EXECUTIONS = 'ConcurrentExecutions',
  /**
   * Anomaly detection on the Duration metric. Detects drift in execution duration
   * without requiring a static threshold.
   */
  DURATION_ANOMALY = 'DurationAnomaly',
  /**
   * Anomaly detection on the Invocations metric. Detects unexpected drops (e.g. a
   * broken trigger) or spikes (e.g. a retry storm) in invocation volume. No static
   * counterpart exists in this library.
   */
  INVOCATIONS_ANOMALY = 'InvocationsAnomaly',
}

export interface LambdaAlarmBaseConfig extends AlarmBaseProps {
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
export interface LambdaAnomalyAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The width of the anomaly detection band, expressed as a number of standard deviations from the metric's mean.
   *
   * @default 8
   */
  readonly stdDevs?: number;
}

/**
 * Configuration for the Errors alarm.
 */
export interface LambdaErrorsAlarmConfig extends LambdaAlarmBaseConfig {
  /**
   * The value against which the specified statistics is compared.
   *
   * Set the threshold to a number greater than zero. The exact
   * value can depend on the tolerance for errors in your
   * application. Understand the criticality of the invocations
   * that the function is handling. For some applications, any
   * error might be unacceptable, while other applications might
   * allow for a certain margin of error.
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
   * @default - lambdaFunction.functionName + ' - Errors'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default -  This alarm detects high error counts. Errors includes the exceptions thrown by the code
   * as well as exceptions thrown by the Lambda runtime. You can check the logs related to the function
   * to diagnose the issue.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the LambdaErrorsAlarm construct.
 */
export interface LambdaErrorsAlarmProps extends LambdaErrorsAlarmConfig {
  /**
   * The Lambda function to monitor.
   */
  readonly lambdaFunction: lambda.IFunction;
}

/**
 * The alarm helps detect high error counts in function invocations.
 *
 * The alarm is triggered when the number of errors exceeds the specified
 * threshold.
 */
export class LambdaErrorsAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: LambdaErrorsAlarmProps) {
    const alarmName = props.alarmName ?? `${props.lambdaFunction.functionName} - ${LambdaRecommendedAlarmsMetrics.ERRORS}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 3;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.lambdaFunction.metricErrors({
        period,
      }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 3,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm detects high error counts. Errors includes the exceptions '
        + 'thrown by the code as well as exceptions thrown by the Lambda runtime. You can check the logs related to the '
        + 'function to diagnose the issue.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the Throttles alarm.
 */
export interface LambdaThrottlesAlarmConfig extends LambdaAlarmBaseConfig {
  /**
   * The value against which the specified statictis is compared.
   *
   * Set the threshold to a number greater than zero. The exact value
   * of the threshold can depend on the tolerance of the application.
   * Set the threshold according to its usage and scaling requirements
   * of the function.
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
   * @default - lambdaFunction.functionName + ' - Throttles'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default -  This alarm detects a high number of throttled invocation requests. Throttling occurs when
   * there is no concurrency is available for scale up. There are several approaches to resolve this issue.
   * 1) Request a concurrency increase from AWS Support in this Region. 2) Identify performance issues in
   * the function to improve the speed of processing and therefore improve throughput. 3) Increase the batch
   * size of the function, so that more messages are processed by each function invocation.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the LambdaThrottlesAlarm construct.
 */
export interface LambdaThrottlesAlarmProps extends LambdaThrottlesAlarmConfig {
  /**
   * The Lambda function to monitor.
   */
  readonly lambdaFunction: lambda.IFunction;
}

/**
 * The alarm helps detect a high number of throttled invocation requests
 * for a Lambda function. It is important to know if requests are constantly
 * getting rejected due to throttling and if you need to improve Lambda
 * function performance or increase concurrency capacity to avoid constant
 * throttling.
 *
 * The alarm is triggered when the number of throttles exceeds or equals
 * the specified threshold.
 */
export class LambdaThrottlesAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: LambdaThrottlesAlarmProps) {
    const alarmName = props.alarmName ?? `${props.lambdaFunction.functionName} - ${LambdaRecommendedAlarmsMetrics.THROTTLES}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.lambdaFunction.metricThrottles({
        period,
      }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 5,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm detects a high number of throttled invocation requests. '
        + 'Throttling occurs when there is no concurrency is available for scale up. There are several approaches to '
        + 'resolve this issue. 1) Request a concurrency increase from AWS Support in this Region. 2) Identify performance '
        + 'issues in the function to improve the speed of processing and therefore improve throughput. 3) Increase the batch '
        + 'size of the function, so that more messages are processed by each function invocation.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the Duration alarm.
 */
export interface LambdaDurationAlarmConfig extends LambdaAlarmBaseConfig {
  /**
   * The value against which the specified statictis is compared.
   *
   * The threshold for the duration depends on your application
   * and workloads and your performance requirements. For
   * high-performance requirements, set the threshold to a
   * shorter time to see if the function is meeting expectations.
   * You can also analyze historical data for duration metrics
   * to see the if the time taken matches the performance
   * expectation of the function, and then set the threshold to
   * a longer time than the historical average. Make sure to
   * set the threshold lower than the configured function
   * timeout.
   */
  readonly threshold: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 15
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 15
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - lambdaFunction.functionName + ' - Duration'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default -  This alarm detects long duration times for processing an event by a Lambda function. Long durations might be because of changes in function code making the function take longer to execute, or the function's dependencies taking longer.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the LambdaDurationAlarm construct.
 */
export interface LambdaDurationAlarmProps extends LambdaDurationAlarmConfig {
  /**
   * The Lambda function to monitor.
   */
  readonly lambdaFunction: lambda.IFunction;
}

/**
 * This alarm can detect a long running duration of a
 * Lambda function. High runtime duration indicates that
 * a function is taking a longer time for invocation, and
 * can also impact the concurrency capacity of invocation
 * if Lambda is handling a higher number of events. It is
 * critical to know if the Lambda function is constantly
 * taking longer execution time than expected.
 *
 * The alarm is triggered when the duration of the function
 * invocations exceeds the specified threshold.
 */
export class LambdaDurationAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: LambdaDurationAlarmProps) {
    const alarmName = props.alarmName ?? `${props.lambdaFunction.functionName} - ${LambdaRecommendedAlarmsMetrics.DURATION}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.lambdaFunction.metricDuration({
        period,
      }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 15,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm detects long duration times for processing an event by a '
      + 'Lambda function. Long durations might be because of changes in function code making the function take longer to '
      + 'execute, or the function\'s dependencies taking longer.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the Duration anomaly detection alarm.
 */
export interface LambdaDurationAnomalyAlarmConfig extends LambdaAnomalyAlarmBaseConfig {
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
  readonly comparisonOperator?: AnomalyComparisonOperator;
  /**
   * The alarm name.
   *
   * @default - lambdaFunction.functionName + ' - DurationAnomaly'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This anomaly detection alarm detects unusual drift in the function's execution
   * duration compared to the expected baseline.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the LambdaDurationAnomalyAlarm construct.
 */
export interface LambdaDurationAnomalyAlarmProps extends LambdaDurationAnomalyAlarmConfig {
  /**
   * The Lambda function to monitor.
   */
  readonly lambdaFunction: lambda.IFunction;
}

/**
 * An anomaly detection alarm on the Lambda `Duration` metric.
 *
 * The static `Duration` alarm requires a fixed threshold that AWS documents as depending
 * entirely on the function's workload and performance SLA. This anomaly variant lets the
 * band track historical duration so the alarm fires on actual drift without picking a
 * number that goes stale. It is intended to coexist with the static alarm, not replace it.
 */
export class LambdaDurationAnomalyAlarm extends cloudwatch.AnomalyDetectionAlarm {
  constructor(scope: Construct, id: string, props: LambdaDurationAnomalyAlarmProps) {
    const alarmName = props.alarmName ?? `${props.lambdaFunction.functionName} - ${LambdaRecommendedAlarmsMetrics.DURATION_ANOMALY}`;
    // Anomaly bands use a fixed 5-minute metric period; a finer period produces noisier, less reliable bands.
    const period = Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const stdDevs = props.stdDevs ?? 8;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const comparisonOperator = props.comparisonOperator ?? cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD;
    const alarmDescription = props.alarmDescription ?? 'This anomaly detection alarm detects unusual drift in the '
      + 'function\'s execution duration compared to the expected baseline.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.lambdaFunction.metricDuration({
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
}

/**
 * Configuration for the ConcurrentExecutions alarm.
 */
export interface LambdaConcurrentExecutionsAlarmConfig extends LambdaAlarmBaseConfig {
  /**
   * The value against which the specified statictis is compared.
   *
   * Set the threshold to about 90% of the concurrency quota set
   * for the account in the Region. By default, your account has
   * a concurrency quota of 1,000 across all functions in a Region.
   * However, you can check the quota of your account, as it can
   * be increased by contacting AWS support.
   *
   * @default 900
   */
  readonly threshold?: number;
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
   * @default - lambdaFunction.functionName + ' - ConcurrentExecutions'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default -  This alarm helps to monitor if the concurrency of the function is approaching the Region-level
   * concurrency limit of your account. A function starts to be throttled if it reaches the concurrency limit.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the LambdaConcurrentExecutionsAlarm construct.
 */
export interface LambdaConcurrentExecutionsAlarmProps extends LambdaConcurrentExecutionsAlarmConfig {
  /**
   * The Lambda function to monitor.
   */
  readonly lambdaFunction: lambda.IFunction;
}

/**
 * This alarm can proactively detect if the concurrency of the
 * function is approaching the Region-level concurrency quota
 * of your account, so that you can act on it. A function is
 * throttled if it reaches the Region-level concurrency quota
 * of the account.
 *
 * The alarm is triggered when the number of concurrent executions
 * exceeds the specified threshold.
 */
export class LambdaConcurrentExecutionsAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: LambdaConcurrentExecutionsAlarmProps) {
    const alarmName = props.alarmName ?? `${props.lambdaFunction.functionName} - ${LambdaRecommendedAlarmsMetrics.CONCURRENT_EXECUTIONS}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 10;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/Lambda',
        metricName: LambdaRecommendedAlarmsMetrics.CONCURRENT_EXECUTIONS,
        dimensionsMap: {
          FunctionName: props.lambdaFunction.functionName,
        },
        period,
        statistic: 'Maximum',
      }),
      threshold: props.threshold ?? 900,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 10,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm helps to monitor if the concurrency of the function is '
        + 'approaching the Region-level concurrency limit of your account. A function starts to be throttled if it '
        + 'reaches the concurrency limit.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the Invocations anomaly detection alarm.
 */
export interface LambdaInvocationsAnomalyAlarmConfig extends LambdaAnomalyAlarmBaseConfig {
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
   * Defaults to `LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD` to catch both unexpected
   * drops in invocation volume (e.g. a disabled trigger or an upstream outage) and unusual
   * spikes (e.g. a retry storm or duplicate-invocation misconfiguration).
   *
   * @default cloudwatch.ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD
   */
  readonly comparisonOperator?: AnomalyComparisonOperator;
  /**
   * The alarm name.
   *
   * @default - lambdaFunction.functionName + ' - InvocationsAnomaly'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This anomaly detection alarm detects unexpected drops or spikes in the
   * function's invocation volume, which can indicate a broken trigger, an outage upstream,
   * or a retry storm.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the LambdaInvocationsAnomalyAlarm construct.
 */
export interface LambdaInvocationsAnomalyAlarmProps extends LambdaInvocationsAnomalyAlarmConfig {
  /**
   * The Lambda function to monitor.
   */
  readonly lambdaFunction: lambda.IFunction;
}

/**
 * An anomaly detection alarm on the Lambda `Invocations` metric.
 *
 * This library has no static counterpart for this metric: a fixed count threshold is
 * particularly hard to pick for invocation volume, since "normal" varies by time of day
 * and traffic source. This alarm lets the band track historical invocation volume, catching
 * silent traffic loss (a disabled trigger, a broken integration, a removed schedule) as well
 * as unexpected spikes, without requiring a static value that goes stale.
 *
 * Because anomaly detection requires the `Average` statistic, this alarm tracks the average
 * invocation rate per period, not total invocation volume.
 *
 * Note: on the drop side it detects partial drops below the expected band, not a complete
 * outage. Lambda does not publish `Invocations` when there are zero invocations, so a full
 * stop in traffic produces missing data (treated per `treatMissingData`) rather than a low
 * value. To alarm on zero invocations, pair this with a canary or an upstream trigger alarm.
 */
export class LambdaInvocationsAnomalyAlarm extends cloudwatch.AnomalyDetectionAlarm {
  constructor(scope: Construct, id: string, props: LambdaInvocationsAnomalyAlarmProps) {
    const alarmName = props.alarmName ?? `${props.lambdaFunction.functionName} - ${LambdaRecommendedAlarmsMetrics.INVOCATIONS_ANOMALY}`;
    // Anomaly bands use a fixed 5-minute metric period; a finer period produces noisier, less reliable bands.
    const period = Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 4;
    const datapointsToAlarm = props.datapointsToAlarm ?? 3;
    const stdDevs = props.stdDevs ?? 8;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const comparisonOperator = props.comparisonOperator ?? cloudwatch.ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD;
    const alarmDescription = props.alarmDescription ?? 'This anomaly detection alarm detects unexpected drops or spikes'
      + ' in the function\'s invocation volume, which can indicate a broken trigger, an outage upstream, or a retry storm.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.lambdaFunction.metricInvocations({
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
}

/**
 * Configuration for Lambda recommended alarms.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface LambdaRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: LambdaRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the Errors alarm.
   */
  readonly configErrorsAlarm: LambdaErrorsAlarmConfig;
  /**
   * The configuration for the Throttles alarm.
   */
  readonly configThrottlesAlarm: LambdaThrottlesAlarmConfig;
  /**
   * The configuration for the Duration alarm.
   */
  readonly configDurationAlarm: LambdaDurationAlarmConfig;
  /**
   * The configuration for the ConcurrentExecutions alarm.
   */
  readonly configConcurrentExecutionsAlarm?: LambdaConcurrentExecutionsAlarmConfig;
  /**
   * The configuration for the Duration anomaly detection alarm.
   */
  readonly configDurationAnomalyAlarm?: LambdaDurationAnomalyAlarmConfig;
  /**
   * The configuration for the Invocations anomaly detection alarm.
   */
  readonly configInvocationsAnomalyAlarm?: LambdaInvocationsAnomalyAlarmConfig;
}

export interface LambdaRecommendedAlarmsProps extends LambdaRecommendedAlarmsConfig {
  /**
   * The lambda function to apply the recommended alarms.
   */
  readonly lambdaFunction: lambda.IFunction;
}

/**
 * A construct that creates recommended alarms for a Lambda function.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Lambda
 */
export class LambdaRecommendedAlarms extends Construct {
  /**
   * The error alarm for the Lambda function.
   */
  public readonly alarmErrors?: LambdaErrorsAlarm;
  /**
   * The throttles alarm for the Lambda function.
   */
  public readonly alarmThrottles?: LambdaThrottlesAlarm;
  /**
   * The duration alarm for the Lambda function.
   */
  public readonly alarmDuration?: LambdaDurationAlarm;
  /**
   * The concurrent executions alarm for the Lambda function.
   */
  public readonly alarmConcurrentExecutions?: LambdaConcurrentExecutionsAlarm;
  /**
   * The Duration anomaly detection alarm for the Lambda function.
   */
  public readonly alarmDurationAnomaly?: LambdaDurationAnomalyAlarm;
  /**
   * The Invocations anomaly detection alarm for the Lambda function.
   */
  public readonly alarmInvocationsAnomaly?: LambdaInvocationsAnomalyAlarm;

  constructor(scope: Construct, id: string, props: LambdaRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(LambdaRecommendedAlarmsMetrics.ERRORS)) {
      this.alarmErrors = new LambdaErrorsAlarm(this, 'ErrorsAlarm', {
        lambdaFunction: props.lambdaFunction,
        treatMissingData: props.treatMissingData,
        ...props.configErrorsAlarm,
      });

      if (props.defaultAlarmAction && !props.configErrorsAlarm.alarmAction) {
        this.alarmErrors.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configErrorsAlarm.okAction) {
        this.alarmErrors.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configErrorsAlarm.insufficientDataAction) {
        this.alarmErrors.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(LambdaRecommendedAlarmsMetrics.THROTTLES)) {
      this.alarmThrottles = new LambdaThrottlesAlarm(this, 'ThrottlesAlarm', {
        lambdaFunction: props.lambdaFunction,
        treatMissingData: props.treatMissingData,
        ...props.configThrottlesAlarm,
      });

      if (props.defaultAlarmAction && !props.configThrottlesAlarm.alarmAction) {
        this.alarmThrottles.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configThrottlesAlarm.okAction) {
        this.alarmThrottles.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configThrottlesAlarm.insufficientDataAction) {
        this.alarmThrottles.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(LambdaRecommendedAlarmsMetrics.DURATION)) {
      this.alarmDuration = new LambdaDurationAlarm(this, 'DurationAlarm', {
        lambdaFunction: props.lambdaFunction,
        treatMissingData: props.treatMissingData,
        ...props.configDurationAlarm,
      });

      if (props.defaultAlarmAction && !props.configDurationAlarm.alarmAction) {
        this.alarmDuration.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configDurationAlarm.okAction) {
        this.alarmDuration.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configDurationAlarm.insufficientDataAction) {
        this.alarmDuration.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(LambdaRecommendedAlarmsMetrics.CONCURRENT_EXECUTIONS)) {
      this.alarmConcurrentExecutions = new LambdaConcurrentExecutionsAlarm(this, 'ConcurrentExecutionsAlarm', {
        lambdaFunction: props.lambdaFunction,
        treatMissingData: props.treatMissingData,
        ...props.configConcurrentExecutionsAlarm,
      });

      if (props.defaultAlarmAction && !props.configConcurrentExecutionsAlarm?.alarmAction) {
        this.alarmConcurrentExecutions.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configConcurrentExecutionsAlarm?.okAction) {
        this.alarmConcurrentExecutions.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configConcurrentExecutionsAlarm?.insufficientDataAction) {
        this.alarmConcurrentExecutions.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(LambdaRecommendedAlarmsMetrics.DURATION_ANOMALY)) {
      this.alarmDurationAnomaly = new LambdaDurationAnomalyAlarm(this, 'DurationAnomalyAlarm', {
        lambdaFunction: props.lambdaFunction,
        treatMissingData: props.treatMissingData,
        ...props.configDurationAnomalyAlarm,
      });

      if (props.defaultAlarmAction && !props.configDurationAnomalyAlarm?.alarmAction) {
        this.alarmDurationAnomaly.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configDurationAnomalyAlarm?.okAction) {
        this.alarmDurationAnomaly.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configDurationAnomalyAlarm?.insufficientDataAction) {
        this.alarmDurationAnomaly.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(LambdaRecommendedAlarmsMetrics.INVOCATIONS_ANOMALY)) {
      this.alarmInvocationsAnomaly = new LambdaInvocationsAnomalyAlarm(this, 'InvocationsAnomalyAlarm', {
        lambdaFunction: props.lambdaFunction,
        treatMissingData: props.treatMissingData,
        ...props.configInvocationsAnomalyAlarm,
      });

      if (props.defaultAlarmAction && !props.configInvocationsAnomalyAlarm?.alarmAction) {
        this.alarmInvocationsAnomaly.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configInvocationsAnomalyAlarm?.okAction) {
        this.alarmInvocationsAnomaly.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configInvocationsAnomalyAlarm?.insufficientDataAction) {
        this.alarmInvocationsAnomaly.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension of the Lambda function construct
 * that provides methods to create recommended alarms
 */
export class Function extends lambda.Function {
  constructor(scope: Construct, id: string, props: lambda.FunctionProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the number of errors
   */
  public alarmErrors(props: LambdaErrorsAlarmConfig): LambdaErrorsAlarm {
    return new LambdaErrorsAlarm(this, 'ErrorsAlarm', {
      lambdaFunction: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the number of throttles
   */
  public alarmThrottles(props: LambdaThrottlesAlarmConfig): LambdaThrottlesAlarm {
    return new LambdaThrottlesAlarm(this, 'ThrottlesAlarm', {
      lambdaFunction: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the duration of the function invocations
   */
  public alarmDuration(props: LambdaDurationAlarmConfig): LambdaDurationAlarm {
    return new LambdaDurationAlarm(this, 'DurationAlarm', {
      lambdaFunction: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the number of concurrent executions
   */
  public alarmConcurrentExecutions(props?: LambdaConcurrentExecutionsAlarmConfig): LambdaConcurrentExecutionsAlarm {
    return new LambdaConcurrentExecutionsAlarm(this, 'ConcurrentExecutionsAlarm', {
      lambdaFunction: this,
      ...props,
    });
  }

  /**
   * Creates an anomaly detection alarm on the Duration metric. Detects drift in execution
   * duration without requiring a static threshold; intended to coexist with the static
   * `Duration` alarm.
   */
  public alarmDurationAnomaly(props?: LambdaDurationAnomalyAlarmConfig): LambdaDurationAnomalyAlarm {
    return new LambdaDurationAnomalyAlarm(this, 'DurationAnomalyAlarm', {
      lambdaFunction: this,
      ...props,
    });
  }

  /**
   * Creates an anomaly detection alarm on the Invocations metric. By default detects both
   * unexpected drops (e.g. a broken trigger) and spikes (e.g. a retry storm) in invocation
   * volume.
   */
  public alarmInvocationsAnomaly(props?: LambdaInvocationsAnomalyAlarmConfig): LambdaInvocationsAnomalyAlarm {
    return new LambdaInvocationsAnomalyAlarm(this, 'InvocationsAnomalyAlarm', {
      lambdaFunction: this,
      ...props,
    });
  }

  /**
   * Creates recommended alarms for the Lambda function.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Lambda
   */
  public applyRecommendedAlarms(props: LambdaRecommendedAlarmsConfig): LambdaRecommendedAlarms {
    return new LambdaRecommendedAlarms(this, 'LambdaRecommendedAlarms', {
      lambdaFunction: this,
      ...props,
    });
  }
}

/**
 * An aspect that applies recommended alarms for Lambda functions.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Lambda
 */
export class LambdaRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: LambdaRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof lambda.Function) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const lambdaFunction = node as lambda.IFunction;

        new LambdaRecommendedAlarms(node, 'LambdaRecommendedAlarmsFromAspect', {
          lambdaFunction,
          ...this.props,
        });
      }
    }
  }
}