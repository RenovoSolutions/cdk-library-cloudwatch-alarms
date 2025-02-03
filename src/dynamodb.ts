import {
  IAspect,
  aws_dynamodb as dynamodb,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for DynamoDb alarms.
 */
export enum DynamoDbRecommendedAlarmsMetrics {
  /**
   * Requests to DynamoDB that exceed the provisioned read capacity units for a table or a global secondary index.
   */
  READ_THROTTLE_EVENTS = 'ReadThrottleEvents',
  /**
   * The requests to DynamoDB or Amazon DynamoDB Streams that generate an HTTP 500 status code during the specified
   * time period. An HTTP 500 usually indicates an internal service error.
   */
  SYSTEM_ERRORS = 'SystemErrors',
  /**
   * Requests to DynamoDB that exceed the provisioned write capacity units for a table or a global secondary index.
   */
  WRITE_THROTTLE_EVENTS = 'WriteThrottleEvents',

  /**
   * The elapsed time since a record yet to be replicated to the Kinesis data stream first appeared in the DynamoDB table.
   */
  AGE_OF_OLDEST_UNREPLICATED_RECORD = 'AgeOfOldestUnreplicatedRecord',

  /**
   * The number of records that DynamoDB failed to replicate to your Kinesis data stream.
   */
  FAILED_TO_REPLICATE_RECORD_COUNT = 'FailedToReplicateRecordCount',

  /**
   * The number of records that were throttled by your Kinesis data stream due to insufficient Kinesis Data Streams capacity.
   */
  THROTTLED_PUT_RECORD_COUNT = 'ThrottledPutRecordCount',
}

/**
 * The common optional configuration for the alarms.
 */
export interface DynamoDbAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the DynamoDb Table alarms.
 */
export interface DynamoDbTableAlarmProps {
  /**
   * The DynamoDb Table to monitor.
   */
  readonly table: dynamodb.Table;
}

/**
 * Configuration for the ReadThrottleEvents alarm.
 */
export interface DynamoDbReadThrottleEventsAlarmConfig extends DynamoDbAlarmBaseConfig {
  /**
   * Set the threshold according to the expected read traffic for the DynamoDB table,
   * accounting for an acceptable level of throttling. It is important to monitor whether
   * you are under provisioned and not causing consistent throttling. You can also analyze
   * historical data to find the acceptable throttling level for the application workload,
   * and then tune the threshold to be higher than your usual throttling level. Throttled
   * requests should be retried by the application or service as they are transient. Therefore,
   * a very low threshold may cause the alarm to be too sensitive, causing unwanted state transitions.
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
   * @default - tableName + ' - ReadThrottleEvents'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can detect sustained throttling for read requests to the DynamoDB table.
   * Sustained throttling of read requests can negatively impact your workload read operations and
   * reduce the overall efficiency of the system.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DynamoDbTableReadThrottleEventsAlarm construct.
 */
export interface DynamoDbTableReadThrottleEventsAlarmProps extends DynamoDbTableAlarmProps, DynamoDbReadThrottleEventsAlarmConfig {}

/**
 * This alarm detects if there are high number of read requests getting throttled for the DynamoDB table.
 *
 * To troubleshoot the issue, see {@link https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TroubleshootingThrottling.html|Troubleshooting throttling issues in Amazon DynamoDB}.
 *
 * The alarm is triggered when the number of read requests exceeds the threshold.
 */
export class DynamoDbTableReadThrottleEventsAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DynamoDbTableReadThrottleEventsAlarmProps) {
    const alarmName = props.alarmName ?? `${props.table.tableName} - ${DynamoDbRecommendedAlarmsMetrics.READ_THROTTLE_EVENTS}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect sustained throttling for read requests to the DynamoDB'
      + ' table. Sustained throttling of read requests can negatively impact your workload read operations and reduce the overall'
      + ' efficiency of the system.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DynamoDB',
        metricName: DynamoDbRecommendedAlarmsMetrics.READ_THROTTLE_EVENTS,
        dimensionsMap: {
          TableName: props.table.tableName,
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
 * Configuration for the SystemErrors alarm.
 */
export interface DynamoDbSystemErrorsAlarmConfig extends DynamoDbAlarmBaseConfig {
  /**
   * Set the threshold according to the expected traffic, accounting for an acceptable level of system errors.
   * You can also analyze historical data to find the acceptable error count for the application workload, and
   * then tune the threshold accordingly. System errors should be retried by the application/service as they are
   * transient. Therefore, a very low threshold might cause the alarm to be too sensitive, causing unwanted state
   * transitions.
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
   * @default - tableName + ' - SystemErrors'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can detect sustained system errors for the DynamoDB table requests. System errors
   * indicate internal service errors from DynamoDB and helps correlate to the issue that the client is having.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DynamoDbTableSystemErrorsAlarm construct.
 */
export interface DynamoDbTableSystemErrorsAlarmProps extends DynamoDbTableAlarmProps, DynamoDbSystemErrorsAlarmConfig {}

/**
 * This alarm detects a sustained high number of system errors for the DynamoDB table requests.
 *
 * If you continue to get 5xx errors, open the {@link https://status.aws.amazon.com/|AWS Service Health Dashboard}
 * to check for operational issues with the service. You can use this alarm to get notified in case there is a prolonged
 * internal service issue from DynamoDB and it helps you correlate with the issue your client application is facing.
 * Refer {@link https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.Errors.html#Programming.Errors.MessagesAndCodes.http5xx|Error handling for DynamoDB} for more information.
 *
 * The alarm is triggered when the number of system errors exceeds threshold.
 */
export class DynamoDbTableSystemErrorsAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DynamoDbTableSystemErrorsAlarmProps) {
    const alarmName = props.alarmName ?? `${props.table.tableName} - ${DynamoDbRecommendedAlarmsMetrics.SYSTEM_ERRORS}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    const datapointsToAlarm = props.datapointsToAlarm ?? 15;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect sustained system errors for the DynamoDB table'
      + ' requests. System errors indicate internal service errors from DynamoDB and helps correlate to the issue that the client is having.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DynamoDB',
        metricName: DynamoDbRecommendedAlarmsMetrics.SYSTEM_ERRORS,
        dimensionsMap: {
          TableName: props.table.tableName,
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
 * Configuration for the WriteThrottleEvents alarm.
 */
export interface DynamoDbWriteThrottleEventsAlarmConfig extends DynamoDbAlarmBaseConfig {
  /**
   * Set the threshold according to the expected write traffic for the DynamoDB table,
   * accounting for an acceptable level of throttling. It is important to monitor if you
   * are under provisioned and not causing consistent throttling. You can also analyze
   * historical data to find the acceptable level of throttling for the application workload,
   * and then tune the threshold to a value higher than your usual acceptable throttling level.
   * Throttled requests should be retried by the application/service as they are transient.
   * Therefore, a very low threshold might cause the alarm to be too sensitive, causing
   * unwanted state transitions.
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
   * @default - tableName + ' - WriteThrottleEvents'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can detect sustained throttling for write requests to the DynamoDB table.
   * Sustained throttling of write requests can negatively impact your workload write operations and
   * reduce the overall efficiency of the system.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DynamoDbTableWriteThrottleEventsAlarm construct.
 */
export interface DynamoDbTableWriteThrottleEventsAlarmProps extends DynamoDbTableAlarmProps, DynamoDbWriteThrottleEventsAlarmConfig {}

/**
 * This alarm detects if there are high number of read requests getting throttled for the DynamoDB table.
 *
 * To troubleshoot the issue, see {@link https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TroubleshootingThrottling.html|Troubleshooting throttling issues in Amazon DynamoDB}.
 *
 * The alarm is triggered when the number of read requests exceeds the threshold.
 */
export class DynamoDbTableWriteThrottleEventsAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DynamoDbTableWriteThrottleEventsAlarmProps) {
    const alarmName = props.alarmName ?? `${props.table.tableName} - ${DynamoDbRecommendedAlarmsMetrics.WRITE_THROTTLE_EVENTS}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect sustained throttling for write requests to the DynamoDB'
      + ' table. Sustained throttling of write requests can negatively impact your workload write operations and reduce the overall'
      + ' efficiency of the system.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DynamoDB',
        metricName: DynamoDbRecommendedAlarmsMetrics.WRITE_THROTTLE_EVENTS,
        dimensionsMap: {
          TableName: props.table.tableName,
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
 * Configuration for the AgeOfOldestUnreplicatedRecord alarm.
 */
export interface DynamoDbAgeOfOldestUnreplicatedRecordAlarmConfig extends DynamoDbAlarmBaseConfig {
  /**
   * Set the threshold according to the desired replication delay measured in milliseconds.
   * This value depends on your workload's requirements and expected performance.
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
   * @default - tableName + ' - AgeOfOldestUnreplicatedRecord'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can monitor unsuccessful replication attempts and the resulting delay
   * in replication to the Kinesis data stream.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DynamoDbTableAgeOfOldestUnreplicatedRecordAlarm construct.
 */
export interface DynamoDbTableAgeOfOldestUnreplicatedRecordAlarmProps extends
  DynamoDbTableAlarmProps,
  DynamoDbAgeOfOldestUnreplicatedRecordAlarmConfig {}

/**
 * This alarm detects the delay in replication to a Kinesis data stream.
 *
 * Under normal operation, `AgeOfOldestUnreplicatedRecord` should be only milliseconds.
 * This number grows based on unsuccessful replication attempts caused by customer-controlled
 * configuration choices. Customer-controlled configuration examples that lead to unsuccessful
 * replication attempts are an under-provisioned Kinesis data stream capacity that leads to
 * excessive throttling. or a manual update to the Kinesis data stream's access policies that
 * prevents DynamoDB from adding data to the data stream. To keep this metric as low as possible,
 * you need to ensure the right provisioning of Kinesis data stream capacity and make sure that
 * DynamoDB's permissions are unchanged.
 *
 * The alarm is triggered when the elapsed time since a record yet to be replicated exceeds the threshold.
 */
export class DynamoDbTableAgeOfOldestUnreplicatedRecordAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DynamoDbTableAgeOfOldestUnreplicatedRecordAlarmProps) {
    const alarmName = props.alarmName ?? `${props.table.tableName} - ${DynamoDbRecommendedAlarmsMetrics.AGE_OF_OLDEST_UNREPLICATED_RECORD}`;
    const period = props.period ?? Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 3;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can monitor unsuccessful replication attempts and'
      + ' the resulting delay in replication to the Kinesis data stream.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DynamoDB',
        metricName: DynamoDbRecommendedAlarmsMetrics.AGE_OF_OLDEST_UNREPLICATED_RECORD,
        dimensionsMap: {
          TableName: props.table.tableName,
          DelegatedOperation: 'StreamRecords',
        },
        period,
        statistic: 'Maximum',
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
 * Configuration for the FailedToReplicateRecordCount alarm.
 */
export interface DynamoDbFailedToReplicateRecordCountAlarmConfig extends DynamoDbAlarmBaseConfig {
  /**
   * Set the threshold to 0 to detect any records that DynamoDB failed to replicate.
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 1
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 1
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - tableName + ' - FailedToReplicateRecordCount'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can monitor the number of records that DynamoDB failed to replicate to
   * your Kinesis data stream because of the item size limit of Kinesis Data Streams.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DynamoDbTableFailedToReplicateRecordCountAlarm construct.
 */
export interface DynamoDbTableFailedToReplicateRecordCountAlarmProps extends
  DynamoDbTableAlarmProps,
  DynamoDbFailedToReplicateRecordCountAlarmConfig {}

/**
 * This alarm detects the number of records that DynamoDB failed to replicate to your Kinesis data stream.
 *
 * Certain items larger than 34 KB might expand in size to change data records that are larger than the 1 MB
 * item size limit of Kinesis Data Streams. This size expansion occurs when these larger than 34 KB items include
 * a large number of Boolean or empty attribute values. Boolean and empty attribute values are stored as 1 byte
 * in DynamoDB, but expand up to 5 bytes when they're serialized using standard JSON for Kinesis Data Streams
 * replication. DynamoDB can't replicate such change records to your Kinesis data stream. DynamoDB skips these
 * change data records, and automatically continues replicating subsequent records.
 *
 * The alarm is triggered when the the number of records failed to be replicated exceeds the threshold.
 */
export class DynamoDbTableFailedToReplicateRecordCountAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DynamoDbTableFailedToReplicateRecordCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.table.tableName} - ${DynamoDbRecommendedAlarmsMetrics.FAILED_TO_REPLICATE_RECORD_COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 1;
    const datapointsToAlarm = props.datapointsToAlarm ?? 1;
    const threshold = props.threshold ?? 0;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can monitor the number of records that DynamoDB'
      + ' failed to replicate to your Kinesis data stream because of the item size limit of Kinesis Data Streams.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DynamoDB',
        metricName: DynamoDbRecommendedAlarmsMetrics.FAILED_TO_REPLICATE_RECORD_COUNT,
        dimensionsMap: {
          TableName: props.table.tableName,
          DelegatedOperation: 'StreamRecords',
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
 * Configuration for the ThrottledPutRecordCount alarm.
 */
export interface DynamoDbThrottledPutRecordCountAlarmConfig extends DynamoDbAlarmBaseConfig {
  /**
   * You might experience some throttling during exceptional usage peaks, but throttled records
   * should remain as low as possible to avoid higher replication latency (DynamoDB retries sending
   * throttled records to the Kinesis data stream). Set the threshold to a number which can help you
   * catch regular excessive throttling. You can also analyze historical data of this metric to find
   * the acceptable throttling rates for the application workload. Tune the threshold to a value that
   * the application can tolerate based on your use case.
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
   * @default - tableName + ' - ThrottledPutRecordCount'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can monitor the number of records that that were throttled by your Kinesis
   * data stream because of insufficient Kinesis data stream capacity.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DynamoDbTableThrottledPutRecordCountAlarm construct.
 */
export interface DynamoDbTableThrottledPutRecordCountAlarmProps extends
  DynamoDbTableAlarmProps,
  DynamoDbThrottledPutRecordCountAlarmConfig {}

/**
 * This alarm detects the records getting throttled by your Kinesis data stream during the
 * replication of change data capture to Kinesis.
 *
 * This throttling happens because of insufficient Kinesis data stream capacity. If you experience excessive
 * and regular throttling, you might need to increase the number of Kinesis stream shards proportionally to
 * the observed write throughput of your table. To learn more about determining the size of a Kinesis data stream,
 * see {@link https://docs.aws.amazon.com/streams/latest/dev/amazon-kinesis-streams.html#how-do-i-size-a-stream|Determining the Initial Size of a Kinesis Data Stream}.
 *
 * The alarm is triggered when the number or records that were throttled exceeds the threshold.
 */
export class DynamoDbTableThrottledPutRecordCountAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DynamoDbTableThrottledPutRecordCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.table.tableName} - ${DynamoDbRecommendedAlarmsMetrics.THROTTLED_PUT_RECORD_COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 10;
    const datapointsToAlarm = props.datapointsToAlarm ?? 10;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can monitor the number of records that that were'
    + ' throttled by your Kinesis data stream because of insufficient Kinesis data stream capacity.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DynamoDB',
        metricName: DynamoDbRecommendedAlarmsMetrics.THROTTLED_PUT_RECORD_COUNT,
        dimensionsMap: {
          TableName: props.table.tableName,
          DelegatedOperation: 'PutItem',
        },
        period,
        statistic: 'Maximum',
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
 * Configurations for the recommended alarms for an DynamoDb Service.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface DynamoDbTableRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: DynamoDbRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the ReadThrottleEvents alarm.
   */
  readonly configReadThrottleEventsAlarm: DynamoDbReadThrottleEventsAlarmConfig;
  /**
   * The configuration for the SystemErrors alarm.
   */
  readonly configSystemErrorsAlarm: DynamoDbSystemErrorsAlarmConfig;
  /**
   * The configuration for the WriteThrottleEvents alarm.
   */
  readonly configWriteThrottleEventsAlarm: DynamoDbWriteThrottleEventsAlarmConfig;
  /**
   * The configuration for the AgeOfOldestUnreplicatedRecord alarm.
   */
  readonly configAgeOfOldestUnreplicatedRecordAlarm?: DynamoDbAgeOfOldestUnreplicatedRecordAlarmConfig;
  /**
   * The configuration for the FailedToReplicateRecordCount alarm.
   */
  readonly configFailedToReplicateRecordCountAlarm?: DynamoDbFailedToReplicateRecordCountAlarmConfig;
  /**
   * The configuration for the ThrottledPutRecordCount alarm.
   */
  readonly configThrottledPutRecordCountAlarm?: DynamoDbThrottledPutRecordCountAlarmConfig;
}

/**
 * Properties for the DynamoDbTableRecommendedAlarms construct.
 */
export interface DynamoDbTableRecommendedAlarmsProps extends DynamoDbTableRecommendedAlarmsConfig {
  /**
   * The DynamoDb Table to monitor.
   */
  readonly table: dynamodb.Table;
}

/**
 * A construct that creates the recommended alarms for an DynamoDb Table.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#DynamoDB
 */
export class DynamoDbTableRecommendedAlarms extends Construct {
  /**
   * The ReadThrottleEvents alarm.
   */
  public readonly alarmReadThrottleEvents?: DynamoDbTableReadThrottleEventsAlarm;

  /**
   * The SystemErrors alarm.
   */
  public readonly alarmSystemErrors?: DynamoDbTableSystemErrorsAlarm;

  /**
   * The WriteThrottleEvents alarm.
   */
  public readonly alarmWriteThrottleEvents?: DynamoDbTableWriteThrottleEventsAlarm;

  /**
   * The AgeOfOldestUnreplicatedRecord alarm.
   */
  public readonly alarmAgeOfOldestUnreplicatedRecord?: DynamoDbTableAgeOfOldestUnreplicatedRecordAlarm;

  /**
   * The FailedToReplicateRecordCount alarm.
   */
  public readonly alarmFailedToReplicateRecordCount?: DynamoDbTableFailedToReplicateRecordCountAlarm;

  /**
   * The ThrottledPutRecordCount alarm.
   */
  public readonly alarmThrottledPutRecordCount?: DynamoDbTableThrottledPutRecordCountAlarm;

  constructor(scope: Construct, id: string, props: DynamoDbTableRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(DynamoDbRecommendedAlarmsMetrics.READ_THROTTLE_EVENTS)) {
      this.alarmReadThrottleEvents = new DynamoDbTableReadThrottleEventsAlarm(this, `${props.table.node.id}_ReadThrottleEvents`, {
        table: props.table,
        ...props.configReadThrottleEventsAlarm,
      });

      if (props.defaultAlarmAction && !props.configReadThrottleEventsAlarm.alarmAction) {
        this.alarmReadThrottleEvents.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configReadThrottleEventsAlarm.okAction) {
        this.alarmReadThrottleEvents.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configReadThrottleEventsAlarm.insufficientDataAction) {
        this.alarmReadThrottleEvents.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(DynamoDbRecommendedAlarmsMetrics.SYSTEM_ERRORS)) {
      this.alarmSystemErrors = new DynamoDbTableSystemErrorsAlarm(this, `${props.table.node.id}_SystemErrors`, {
        table: props.table,
        ...props.configSystemErrorsAlarm,
      });

      if (props.defaultAlarmAction && !props.configSystemErrorsAlarm.alarmAction) {
        this.alarmSystemErrors.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configSystemErrorsAlarm.okAction) {
        this.alarmSystemErrors.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configSystemErrorsAlarm.insufficientDataAction) {
        this.alarmSystemErrors.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(DynamoDbRecommendedAlarmsMetrics.WRITE_THROTTLE_EVENTS)) {
      this.alarmWriteThrottleEvents = new DynamoDbTableWriteThrottleEventsAlarm(this, `${props.table.node.id}_WriteThrottleEvents`, {
        table: props.table,
        ...props.configWriteThrottleEventsAlarm,
      });

      if (props.defaultAlarmAction && !props.configWriteThrottleEventsAlarm.alarmAction) {
        this.alarmWriteThrottleEvents.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configWriteThrottleEventsAlarm.okAction) {
        this.alarmWriteThrottleEvents.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configWriteThrottleEventsAlarm.insufficientDataAction) {
        this.alarmWriteThrottleEvents.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (
      props.configAgeOfOldestUnreplicatedRecordAlarm &&
      !props.excludeAlarms?.includes(DynamoDbRecommendedAlarmsMetrics.AGE_OF_OLDEST_UNREPLICATED_RECORD)
    ) {
      this.alarmAgeOfOldestUnreplicatedRecord = new DynamoDbTableAgeOfOldestUnreplicatedRecordAlarm(this, `${props.table.node.id}_AgeOfOldestUnreplicatedRecord`, {
        table: props.table,
        ...props.configAgeOfOldestUnreplicatedRecordAlarm,
      });

      if (props.defaultAlarmAction && !props.configAgeOfOldestUnreplicatedRecordAlarm.alarmAction) {
        this.alarmAgeOfOldestUnreplicatedRecord.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configAgeOfOldestUnreplicatedRecordAlarm.okAction) {
        this.alarmAgeOfOldestUnreplicatedRecord.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configAgeOfOldestUnreplicatedRecordAlarm.insufficientDataAction) {
        this.alarmAgeOfOldestUnreplicatedRecord.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (
      props.configFailedToReplicateRecordCountAlarm &&
      !props.excludeAlarms?.includes(DynamoDbRecommendedAlarmsMetrics.FAILED_TO_REPLICATE_RECORD_COUNT)
    ) {
      this.alarmFailedToReplicateRecordCount = new DynamoDbTableFailedToReplicateRecordCountAlarm(this, `${props.table.node.id}_FailedToReplicateRecordCount`, {
        table: props.table,
        ...props.configFailedToReplicateRecordCountAlarm,
      });

      if (props.defaultAlarmAction && !props.configFailedToReplicateRecordCountAlarm.alarmAction) {
        this.alarmFailedToReplicateRecordCount.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configFailedToReplicateRecordCountAlarm.okAction) {
        this.alarmFailedToReplicateRecordCount.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configFailedToReplicateRecordCountAlarm.insufficientDataAction) {
        this.alarmFailedToReplicateRecordCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (
      props.configThrottledPutRecordCountAlarm &&
      !props.excludeAlarms?.includes(DynamoDbRecommendedAlarmsMetrics.THROTTLED_PUT_RECORD_COUNT)
    ) {
      this.alarmThrottledPutRecordCount = new DynamoDbTableThrottledPutRecordCountAlarm(this, `${props.table.node.id}_ThrottledPutRecordCount`, {
        table: props.table,
        ...props.configThrottledPutRecordCountAlarm,
      });

      if (props.defaultAlarmAction && !props.configThrottledPutRecordCountAlarm.alarmAction) {
        this.alarmThrottledPutRecordCount.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configThrottledPutRecordCountAlarm.okAction) {
        this.alarmThrottledPutRecordCount.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configThrottledPutRecordCountAlarm.insufficientDataAction) {
        this.alarmThrottledPutRecordCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the Table construct that provides methods
 * to create recommended alarms.
 */
export class Table extends dynamodb.Table {
  constructor(scope: Construct, id: string, props: dynamodb.TableProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the ReadThrottleEvents for the DynamoDb table.
   */
  public alarmReadThrottleEvents(props: DynamoDbReadThrottleEventsAlarmConfig): DynamoDbTableReadThrottleEventsAlarm {
    return new DynamoDbTableReadThrottleEventsAlarm(this, 'ReadThrottleEventsAlarm', {
      table: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the SystemErrors for the DynamoDb table.
   */
  public alarmSystemErrors(props: DynamoDbSystemErrorsAlarmConfig): DynamoDbTableSystemErrorsAlarm {
    return new DynamoDbTableSystemErrorsAlarm(this, 'SystemErrorsAlarm', {
      table: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the WriteThrottleEvents for the DynamoDb table.
   */
  public alarmWriteThrottleEvents(props: DynamoDbWriteThrottleEventsAlarmConfig): DynamoDbTableWriteThrottleEventsAlarm {
    return new DynamoDbTableWriteThrottleEventsAlarm(this, 'WriteThrottleEventsAlarm', {
      table: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the AgeOfOldestUnreplicatedRecord for the DynamoDb table.
   */
  public alarmAgeOfOldestUnreplicatedRecord(
    props: DynamoDbAgeOfOldestUnreplicatedRecordAlarmConfig,
  ): DynamoDbTableAgeOfOldestUnreplicatedRecordAlarm {
    return new DynamoDbTableAgeOfOldestUnreplicatedRecordAlarm(this, 'AgeOfOldestUnreplicatedRecordAlarm', {
      table: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the FailedToReplicateRecordCount for the DynamoDb table.
   */
  public alarmFailedToReplicateRecordCount(
    props: DynamoDbFailedToReplicateRecordCountAlarmConfig,
  ): DynamoDbTableFailedToReplicateRecordCountAlarm {
    return new DynamoDbTableFailedToReplicateRecordCountAlarm(this, 'FailedToReplicateRecordCountAlarm', {
      table: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the ThrottledPutRecordCount for the DynamoDb table.
   */
  public alarmThrottledPutRecordCount(
    props: DynamoDbThrottledPutRecordCountAlarmConfig,
  ): DynamoDbTableThrottledPutRecordCountAlarm {
    return new DynamoDbTableThrottledPutRecordCountAlarm(this, 'ThrottledPutRecordCountAlarm', {
      table: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the DynamoDb Table.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#DynamoDB
   */
  public applyRecommendedAlarms(props: DynamoDbTableRecommendedAlarmsConfig): DynamoDbTableRecommendedAlarms {
    return new DynamoDbTableRecommendedAlarms(this, 'DynamoDbTableRecommendedAlarms', {
      table: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an DynamoDb Table.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#DynamoDB
 */
export class DynamoDbRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: DynamoDbTableRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof dynamodb.Table) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const table = node as dynamodb.Table;

        new DynamoDbTableRecommendedAlarms(table, 'DynamoDbTableRecommendedAlarmsFromAspect', {
          table,
          ...this.props,
        });
      }
    }
  }
}
