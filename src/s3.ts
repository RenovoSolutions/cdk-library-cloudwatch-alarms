import {
  IAspect,
  aws_s3 as s3,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { IConstruct, Construct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for S3 bucket alarms.
 */
export enum S3RecommendedAlarmsMetrics {
  /**
   * 4xxErrors are errors (4xx error codes) that are made in response to client requests.
   */
  ERRORS_4XX = '4xxErrors',
  /**
   * 5xxErrors are server errors (5xx error codes) that are made in response to client requests.
   */
  ERRORS_5XX = '5xxErrors',
}

/**
 * The optional configuration for the 4xx and 5xx error alarms for an S3 bucket.
 */
export interface S3BucketHttpErrorsAlarmConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
  /**
   * The value against which the specified statistic is compared.
   *
   * @default 0.05
   */
  readonly threshold?: number;
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
}

/**
 * Configuration for the 4xx errors alarm.
 */
export interface S3Bucket4xxErrorsAlarmConfig extends S3BucketHttpErrorsAlarmConfig {
  /**
   * The alarm name.
   *
   * @default - bucket.bucketName + ' - 4xxErrors'
   */
  readonly alarmName?: string;
  /**
   * The alarm description.
   *
   * @default - This alarm helps us report the total number of 4xx error status codes
   * that are made in response to client requests. 403 error codes might indicate an
   * incorrect IAM policy, and 404 error codes might indicate mis-behaving client application,
   * for example. Enabling S3 server access logging on a temporary basis will help you to
   * pinpoint the issue's origin using the fields HTTP status and Error Code. To understand
   * more about the error code, see Error Responses
   * (https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html).
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the S3Bucket4xxErrorsAlarm construct.
 */
export interface S3Bucket4xxErrorsAlarmProps extends S3Bucket4xxErrorsAlarmConfig {
  /**
   * The S3 bucket to monitor.
   */
  readonly bucket: s3.IBucket;
}

/**
 * An alarm that monitors the 4xx errors for an S3 bucket.
 *
 * This alarm is used to create a baseline for typical 4xx error
 * rates so that you can look into any abnormalities that might
 * indicate a setup issue.
 *
 * The alarm is triggered when the 4xx error rate exceeds the % threshold.
 */
export class S3Bucket4xxErrorsAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: S3Bucket4xxErrorsAlarmProps) {
    const alarmName = props.alarmName ?? `${props.bucket.bucketName} - ${S3RecommendedAlarmsMetrics.ERRORS_4XX}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/S3',
        metricName: S3RecommendedAlarmsMetrics.ERRORS_4XX,
        dimensionsMap: {
          BucketName: props.bucket.bucketName,
          FilterId: 'AllMetrics',
        },
        period,
        statistic: 'Average',
      }),
      threshold: props.threshold ?? 0.05,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 15,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm helps us report the total number of 4xx error status '
      + 'codes that are made in response to client requests. 403 error codes might indicate an incorrect IAM policy, '
      + 'and 404 error codes might indicate mis-behaving client application, for example. Enabling S3 server access '
      + 'logging on a temporary basis will help you to pinpoint the issue\'s origin using the fields HTTP status and '
      + 'Error Code. To understand more about the error code, see Error Responses '
      + '(https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html).',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
};

/**
 * Configuration for the 5xx errors alarm.
 */
export interface S3Bucket5xxErrorsAlarmConfig extends S3BucketHttpErrorsAlarmConfig {
  /**
   * The alarm name.
   *
   * @default - bucket.bucketName + ' - 5xxErrors'
   */
  readonly alarmName?: string;
  /**
   * The alarm description.
   *
   * @default - This alarm helps you detect a high number of server-side errors. These errors indicate
   * that a client made a request that the server couldn’t complete. This can help you correlate the
   * issue your application is facing because of S3. For more information to help you efficiently
   * handle or reduce errors, see Optimizing performance design patterns
   * (https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html#optimizing-performance-timeouts-retries).
   * Errors might also be caused by an the issue with S3, check AWS service health dashboard for the status of Amazon S3 in your Region.
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the S3Bucket5xxErrorsAlarm construct.
 */
export interface S3Bucket5xxErrorsAlarmProps extends S3Bucket5xxErrorsAlarmConfig {
  /**
   * The S3 bucket to monitor.
   */
  readonly bucket: s3.IBucket;
}

/**
 * An alarm that monitors the 5xx errors for an S3 bucket.
 *
 * This alarm can help to detect if the application is
 * experiencing issues due to 5xx errors.
 *
 * The alarm is triggered when the 5xx error rate exceeds the % threshold.
 */
export class S3Bucket5xxErrorsAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: S3Bucket5xxErrorsAlarmProps) {
    const alarmName = props.alarmName ?? `${props.bucket.bucketName} - ${S3RecommendedAlarmsMetrics.ERRORS_5XX}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/S3',
        metricName: S3RecommendedAlarmsMetrics.ERRORS_5XX,
        dimensionsMap: {
          BucketName: props.bucket.bucketName,
          FilterId: 'AllMetrics',
        },
        period,
        statistic: 'Average',
      }),
      threshold: props.threshold ?? 0.05,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 15,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm helps you detect a high number of server-side errors. '
        + 'These errors indicate that a client made a request that the server couldn’t complete. This can help you '
        + 'correlate the issue your application is facing because of S3. For more information to help you efficiently '
        + 'handle or reduce errors, see Optimizing performance design patterns '
        + '(https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html#optimizing-performance-timeouts-retries). '
        + 'Errors might also be caused by an the issue with S3, check AWS service health dashboard for the status of Amazon S3 in your Region.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
};

/**
 * Configurations for the recommended alarms for an S3 bucket.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface S3RecommendedAlarmsConfig {
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
   * Alarm metrics to exclude from the recommended alarms.
   *
   * @default - None
   */
  readonly excludeAlarms?: S3RecommendedAlarmsMetrics[];
  /**
   * The configuration for the 4xx errors alarm.
   */
  readonly config4xxErrorsAlarm?: S3Bucket4xxErrorsAlarmConfig;
  /**
   * The configuration for the 5xx errors alarm.
   */
  readonly config5xxErrorsAlarm?: S3Bucket5xxErrorsAlarmConfig;
}

export interface S3RecommendedAlarmsProps extends S3RecommendedAlarmsConfig {
  /**
   * The S3 bucket to apply the recommended alarms to.
   */
  readonly bucket: s3.IBucket;
}

/**
 * A construct that creates the recommended alarms for an S3 bucket.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#S3
 */
export class S3RecommendedAlarms extends Construct {
  /**
   * The 4xx errors alarm.
   */
  public readonly alarm4xxErrors?: S3Bucket4xxErrorsAlarm;
  /**
   * The 5xx errors alarm.
   */
  public readonly alarm5xxErrors?: S3Bucket5xxErrorsAlarm;

  constructor(scope: Construct, id: string, props: S3RecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(S3RecommendedAlarmsMetrics.ERRORS_4XX)) {
      this.alarm4xxErrors = new S3Bucket4xxErrorsAlarm(this, `${props.bucket.node.id}_4xxErrorsAlarm`, {
        bucket: props.bucket,
        ...props.config4xxErrorsAlarm,
      });

      if (props.defaultAlarmAction && !props.config4xxErrorsAlarm?.alarmAction) {
        this.alarm4xxErrors.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.config4xxErrorsAlarm?.okAction) {
        this.alarm4xxErrors.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.config4xxErrorsAlarm?.insufficientDataAction) {
        this.alarm4xxErrors.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(S3RecommendedAlarmsMetrics.ERRORS_5XX)) {
      this.alarm5xxErrors = new S3Bucket5xxErrorsAlarm(this, `${props.bucket.node.id}_5xxErrorsAlarm`, {
        bucket: props.bucket,
        ...props.config5xxErrorsAlarm,
      });

      if (props.defaultAlarmAction && !props.config5xxErrorsAlarm?.alarmAction) {
        this.alarm5xxErrors.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.config5xxErrorsAlarm?.okAction) {
        this.alarm5xxErrors.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.config5xxErrorsAlarm?.insufficientDataAction) {
        this.alarm5xxErrors.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the S3 Bucket construct that provides methods
 * to create recommended alarms.
 */
export class Bucket extends s3.Bucket {
  constructor(scope: Construct, id: string, props?: s3.BucketProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the 4xx errors for the S3 bucket.
   */
  public alarm4xxErrors(props?: S3Bucket4xxErrorsAlarmConfig): S3Bucket4xxErrorsAlarm {
    return new S3Bucket4xxErrorsAlarm(this, '4xxErrorsAlarm', {
      bucket: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the 5xx errors for the S3 bucket.
   */
  public alarm5xxErrors(props?: S3Bucket5xxErrorsAlarmConfig): S3Bucket5xxErrorsAlarm {
    return new S3Bucket5xxErrorsAlarm(this, '5xxErrorsAlarm', {
      bucket: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the S3 bucket.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#S3
   */
  public applyRecommendedAlarms(props?: S3RecommendedAlarmsConfig): S3RecommendedAlarms {
    return new S3RecommendedAlarms(this, 'S3RecommendedAlarms', {
      bucket: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an S3 bucket.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#S3
 */
export class S3RecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props?: S3RecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof s3.Bucket) {
      const bucket = node as s3.Bucket;

      new S3RecommendedAlarms(bucket, 'S3RecommendedAlarmsFromAspect', {
        bucket,
        ...this.props,
      });
    }
  }
}
