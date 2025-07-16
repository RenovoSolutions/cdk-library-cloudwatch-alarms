import {
  IAspect,
  aws_dms as dms,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for DMS Replication Instance alarms.
 */
export enum DmsReplicationInstanceRecommendedAlarmsMetrics {
  /**
   * The percentage of allocated vCPU (virtual CPU) currently in use on the instance.
   */
  CPU_UTILIZATION = 'CPUUtilization',
  /**
   * The amount in bytes of available random access memory.
   */
  FREEABLE_MEMORY = 'FreeableMemory',
  /**
   * The amount in bytes of available storage space.
   */
  FREE_STORAGE_SPACE = 'FreeStorageSpace',
  /**
   * The average number of disk write I/O operations per second.
   */
  WRITE_IOPS = 'WriteIOPS',
}

/**
 * The recommended metrics for DMS Replication Task alarms.
 */
export enum DmsReplicationTaskRecommendedAlarmsMetrics {
  /**
   * The number of rows per second being read from the source database during CDC operations.
   */
  CDC_THROUGHPUT_ROWS_SOURCE = 'CDCThroughputRowsSource',
  /**
   * The number of rows per second being written to the target database during CDC operations.
   */
  CDC_THROUGHPUT_ROWS_TARGET = 'CDCThroughputRowsTarget',
  /**
   * The gap, in seconds, between the last event captured from the source endpoint and current system time.
   */
  CDC_LATENCY_SOURCE = 'CDCLatencySource',
  /**
   * The gap, in seconds, between a change that was committed to the source and the same change committed to the target.
   */
  CDC_LATENCY_TARGET = 'CDCLatencyTarget',
  /**
   * The number of rows per second being read from the source database during full load operations.
   */
  FULL_LOAD_THROUGHPUT_ROWS_SOURCE = 'FullLoadThroughputRowsSource',
  /**
   * The number of rows per second being written to the target database during full load operations.
   */
  FULL_LOAD_THROUGHPUT_ROWS_TARGET = 'FullLoadThroughputRowsTarget',
}

/**
 * The common optional configuration for the alarms.
 */
export interface DmsAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the DMS Replication Instance alarms.
 */
export interface DmsReplicationInstanceAlarmProps {
  /**
   * The DMS Replication Instance to monitor.
   */
  readonly replicationInstance: dms.CfnReplicationInstance;
}

/**
 * The common properties for the DMS Replication Task alarms.
 */
export interface DmsReplicationTaskAlarmProps {
  /**
   * The DMS Replication Task to monitor.
   */
  readonly replicationTask: dms.CfnReplicationTask;
}

/**
 * Configuration for the CpuUtilization alarm.
 */
export interface DmsCpuUtilizationAlarmConfig extends DmsAlarmBaseConfig {
  /**
   * The percentage (0-100) value against which the specified statistic is compared.
   * The service metrics for CPU utilization might exceed 100% utilization. However,
   * we recommend that you monitor the metric for high CPU utilization to avoid impacting
   * other services.
   *
   * @default 90
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
   * @default - replicationInstanceIdentifier + ' - CPUUtilization'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high CPU utilization for the DMS Replication
   * Instance. Consistent high CPU utilization can indicate a resource bottleneck or application
   * performance problems.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationInstanceCpuUtilizationAlarm construct.
 */
export interface DmsReplicationInstanceCpuUtilizationAlarmProps extends DmsReplicationInstanceAlarmProps, DmsCpuUtilizationAlarmConfig {}

/**
 * This alarm is used to detect high CPU utilization for the DMS Replication Instance.
 *
 * Consistent high CPU utilization can indicate a resource bottleneck or application
 * performance problems.
 *
 * The alarm is triggered when CPU utilization exceeds % threshold.
 */
export class DmsReplicationInstanceCpuUtilizationAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DmsReplicationInstanceCpuUtilizationAlarmProps) {
    const alarmName = props.alarmName ?? `${props.replicationInstance.replicationInstanceIdentifier} - ${DmsReplicationInstanceRecommendedAlarmsMetrics.CPU_UTILIZATION}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 90;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high CPU utilization for the DMS Replication Instance.'
    + ' Consistent high CPU utilization can indicate a resource bottleneck or application performance problems.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationInstanceRecommendedAlarmsMetrics.CPU_UTILIZATION,
        dimensionsMap: {
          ReplicationInstanceIdentifier: props.replicationInstance.replicationInstanceIdentifier!,
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
 * Configuration for the FreeableMemory alarm.
 */
export interface DmsFreeableMemoryAlarmConfig extends DmsAlarmBaseConfig {
  /**
   * The amount in bytes against which the specified statistic is compared.
   * Depending on the workload and instance class, different values for the threshold
   * can be appropriate. Ideally, available memory should not go below 25% of total
   * memory for prolonged periods.
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
   * @default - replicationInstanceIdentifier + ' - FreeableMemory'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to help prevent running out of memory.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationInstanceFreeableMemoryAlarm construct.
 */
export interface DmsReplicationInstanceFreeableMemoryAlarmProps extends DmsReplicationInstanceAlarmProps, DmsFreeableMemoryAlarmConfig {}

/**
 * An alarm that monitors the amount of available memory (RAM) on the replication instance.
 *
 * This alarm is used to help prevent running out of memory.
 *
 * The alarm is triggered when the percentage of available memory is less than threshold.
 */
export class DmsReplicationInstanceFreeableMemoryAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: DmsReplicationInstanceFreeableMemoryAlarmProps) {
    const alarmName = props.alarmName ?? `${props.replicationInstance.replicationInstanceIdentifier} - ${DmsReplicationInstanceRecommendedAlarmsMetrics.FREEABLE_MEMORY}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to help prevent running out of memory.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationInstanceRecommendedAlarmsMetrics.FREEABLE_MEMORY,
        dimensionsMap: {
          DBInstanceIdentifier: props.replicationInstance.replicationInstanceIdentifier!,
        },
        statistic: 'Average',
        period,
      }),
      threshold,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription,
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the FreeStorageSpace alarm.
 */
export interface DmsFreeStorageSpaceAlarmConfig extends DmsAlarmBaseConfig {
  /**
   * The amount in bytes value against which the specified statistic is compared.
   * The threshold value will depend on the currently allocated storage space. Typically,
   * you should calculate the value of 10 percent of the allocated storage space and use
   * that result as the threshold value.
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
   * @default - replicationInstanceIdentifier + ' - FreeStorageSpace'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm helps prevent storage full issues. This can prevent downtime
   * that occurs when your replication instance runs out of storage.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationInstanceFreeStorageSpaceAlarm construct.
 */
export interface DmsReplicationInstanceFreeStorageSpaceAlarmProps extends DmsReplicationInstanceAlarmProps, DmsFreeStorageSpaceAlarmConfig {}

/**
 * An alarm that monitors the amount of available storage space for a DMS Replication Instance.
 *
 * This alarm helps prevent storage full issues. This can prevent downtime that occurs when your replication
 * instance runs out of storage.
 *
 * The alarm is triggered when the amount of available storage space (bytes) is less than threshold.
 */
export class DmsReplicationInstanceFreeStorageSpaceAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DmsReplicationInstanceFreeStorageSpaceAlarmProps) {
    const alarmName = props.alarmName ?? `${props.replicationInstance.replicationInstanceIdentifier} - ${DmsReplicationInstanceRecommendedAlarmsMetrics.FREE_STORAGE_SPACE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm helps prevent storage full issues. This can prevent downtime'
      + ' that occurs when your replication instance runs out of storage.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationInstanceRecommendedAlarmsMetrics.FREE_STORAGE_SPACE,
        dimensionsMap: {
          ReplicationInstanceIdentifier: props.replicationInstance.replicationInstanceIdentifier!,
        },
        statistic: 'Average',
        period,
      }),
      threshold,
      evaluationPeriods,
      datapointsToAlarm,
      treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription,
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
};

/**
 * Configuration for the WriteIops alarm.
 */
export interface DmsWriteIopsAlarmConfig extends DmsAlarmBaseConfig {
  /**
   * The number of write I/O operations per second against which the specified statistic is compared.
   * High write IOPS can indicate heavy write activity or potential performance bottlenecks.
   * Consider your normal workload patterns when setting this threshold.
   *
   * @default 1000
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
   * @default - replicationInstanceIdentifier + ' - WriteIOPS'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high write IOPS for the DMS Replication
   * Instance. High write IOPS can indicate heavy write activity or potential I/O bottlenecks.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationInstanceWriteIopsAlarm construct.
 */
export interface DmsReplicationInstanceWriteIopsAlarmProps extends DmsReplicationInstanceAlarmProps, DmsWriteIopsAlarmConfig {}

/**
 * This alarm is used to detect high write IOPS for the DMS Replication Instance.
 *
 * High write IOPS can indicate heavy write activity or potential I/O bottlenecks.
 * This can help identify performance issues or unexpected workload patterns.
 *
 * The alarm is triggered when write IOPS exceeds the specified threshold.
 */
export class DmsReplicationInstanceWriteIopsAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DmsReplicationInstanceWriteIopsAlarmProps) {
    const alarmName = props.alarmName ?? `${props.replicationInstance.replicationInstanceIdentifier} - ${DmsReplicationInstanceRecommendedAlarmsMetrics.WRITE_IOPS}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 1000;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high write IOPS for the DMS Replication Instance.'
    + ' High write IOPS can indicate heavy write activity or potential I/O bottlenecks.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationInstanceRecommendedAlarmsMetrics.WRITE_IOPS,
        dimensionsMap: {
          ReplicationInstanceIdentifier: props.replicationInstance.replicationInstanceIdentifier!,
        },
        statistic: 'Average',
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
 * Configuration for the CdcThroughputRowsSource alarm.
 */
export interface DmsCdcThroughputRowsSourceAlarmConfig extends DmsAlarmBaseConfig {
  /**
   * The number of rows per second threshold. This alarm can be used to detect:
   * - Unexpected bulk operations or high change activity (abnormally high throughput)
   * - Abnormally low throughput (potential replication issues)
   *
   * Consider your normal CDC patterns when setting this threshold.
   *
   * @default 1000 (for detecting unexpected bulk operations - adjust based on your workload)
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 3 (to avoid false alarms from temporary fluctuations)
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 2 (allow for some variance while still detecting issues)
   */
  readonly datapointsToAlarm?: number;
  /**
   * The comparison operator to use for the alarm.
   *
   * @default GREATER_THAN_THRESHOLD (for detecting unexpected bulk operations)
   */
  readonly comparisonOperator?: cloudwatch.ComparisonOperator;
  /**
   * The alarm name.
   *
   * @default - replicationTaskIdentifier + ' - CDCThroughputRowsSource'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm monitors CDC throughput from the source database.
   * High values may indicate unexpected data changes or bulk operations.
   * Low values may indicate replication lag or source database issues.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationTaskCdcThroughputRowsSourceAlarm construct.
 */
export interface DmsReplicationTaskCdcThroughputRowsSourceAlarmProps extends DmsReplicationTaskAlarmProps, DmsCdcThroughputRowsSourceAlarmConfig {}

/**
 * An alarm that monitors the CDC throughput (rows per second) from the source database.
 *
 * This alarm monitors the rate at which changes are being read from the source database
 * during Change Data Capture (CDC) operations. It can help detect:
 * - Unexpected bulk operations or high change activity (high throughput)
 * - Replication lag or stalls (low throughput)
 * - Source database performance issues affecting CDC
 *
 * The alarm can be configured to trigger on either high or low throughput values.
 */
export class DmsReplicationTaskCdcThroughputRowsSourceAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DmsReplicationTaskCdcThroughputRowsSourceAlarmProps) {
    const alarmName = props.alarmName ?? `${props.replicationTask.replicationTaskIdentifier} - ${DmsReplicationTaskRecommendedAlarmsMetrics.CDC_THROUGHPUT_ROWS_SOURCE}`;
    const period = props.period ?? Duration.minutes(5); // Longer period for CDC metrics
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const threshold = props.threshold ?? 1000; // Default threshold for detecting unexpected bulk operations
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const comparisonOperator = props.comparisonOperator ?? cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD;
    const alarmDescription = props.alarmDescription ?? 'This alarm monitors CDC throughput from the source database. '
      + 'High values may indicate unexpected data changes or bulk operations. '
      + 'Low values may indicate replication lag or source database issues.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationTaskRecommendedAlarmsMetrics.CDC_THROUGHPUT_ROWS_SOURCE,
        dimensionsMap: {
          ReplicationTaskIdentifier: props.replicationTask.replicationTaskIdentifier!,
          ReplicationInstanceIdentifier: props.replicationTask.replicationInstanceArn!,
        },
        statistic: 'Average',
        period,
      }),
      threshold,
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
 * Configuration for the CdcThroughputRowsTarget alarm.
 */
export interface DmsCdcThroughputRowsTargetAlarmConfig extends DmsAlarmBaseConfig {
  /**
   * The number of rows per second threshold. This alarm can be used to detect:
   * - Unexpected bulk operations or high change activity (abnormally high throughput)
   * - Abnormally low throughput (potential target database issues)
   *
   * Consider your normal CDC patterns when setting this threshold.
   *
   * @default 1000 (for detecting unexpected bulk operations - adjust based on your workload)
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 3 (to avoid false alarms from temporary fluctuations)
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 2 (allow for some variance while still detecting issues)
   */
  readonly datapointsToAlarm?: number;
  /**
   * The comparison operator to use for the alarm.
   *
   * @default GREATER_THAN_THRESHOLD (for detecting unexpected bulk operations)
   */
  readonly comparisonOperator?: cloudwatch.ComparisonOperator;
  /**
   * The alarm name.
   *
   * @default - replicationTaskIdentifier + ' - CDCThroughputRowsTarget'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm monitors CDC throughput to the target database.
   * High values may indicate unexpected data changes or bulk operations.
   * Low values may indicate replication lag or target database issues.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationTaskCdcThroughputRowsTargetAlarm construct.
 */
export interface DmsReplicationTaskCdcThroughputRowsTargetAlarmProps extends DmsReplicationTaskAlarmProps, DmsCdcThroughputRowsTargetAlarmConfig {}

/**
 * An alarm that monitors the CDC throughput (rows per second) to the target database.
 *
 * This alarm monitors the rate at which changes are being written to the target database
 * during Change Data Capture (CDC) operations. It can help detect:
 * - Unexpected bulk operations or high change activity (high throughput)
 * - Replication lag or stalls (low throughput)
 * - Target database performance issues affecting CDC
 *
 * The alarm can be configured to trigger on either high or low throughput values.
 */
export class DmsReplicationTaskCdcThroughputRowsTargetAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DmsReplicationTaskCdcThroughputRowsTargetAlarmProps) {
    const alarmName = props.alarmName ?? `${props.replicationTask.replicationTaskIdentifier} - ${DmsReplicationTaskRecommendedAlarmsMetrics.CDC_THROUGHPUT_ROWS_TARGET}`;
    const period = props.period ?? Duration.minutes(5); // Longer period for CDC metrics
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const threshold = props.threshold ?? 1000; // Default threshold for detecting unexpected bulk operations
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const comparisonOperator = props.comparisonOperator ?? cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD;
    const alarmDescription = props.alarmDescription ?? 'This alarm monitors CDC throughput to the target database. '
      + 'High values may indicate unexpected data changes or bulk operations. '
      + 'Low values may indicate replication lag or target database issues.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationTaskRecommendedAlarmsMetrics.CDC_THROUGHPUT_ROWS_TARGET,
        dimensionsMap: {
          ReplicationTaskIdentifier: props.replicationTask.replicationTaskIdentifier!,
          ReplicationInstanceIdentifier: props.replicationTask.replicationInstanceArn!,
        },
        statistic: 'Average',
        period,
      }),
      threshold,
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
 * Configuration for the FullLoadThroughputRowsSource alarm.
 */
export interface DmsFullLoadThroughputRowsSourceAlarmConfig extends DmsAlarmBaseConfig {
  /**
   * The number of rows per second threshold. This alarm can be used to detect:
   * - Abnormally low throughput (potential full load performance issues)
   * - Full load completion or stalling
   *
   * Consider your expected full load patterns when setting this threshold.
   *
   * @default 1000 (for detecting low throughput during full load - adjust based on your workload)
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 3 (to avoid false alarms from temporary fluctuations)
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 2 (allow for some variance while still detecting issues)
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - replicationTaskIdentifier + ' - FullLoadThroughputRowsSource'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm monitors full load throughput from the source database.
   * Low values may indicate performance issues or full load completion.
   * Zero values indicate full load has completed or stalled.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationTaskFullLoadThroughputRowsSourceAlarm construct.
 */
export interface DmsReplicationTaskFullLoadThroughputRowsSourceAlarmProps extends
  DmsReplicationTaskAlarmProps, DmsFullLoadThroughputRowsSourceAlarmConfig {}

/**
 * An alarm that monitors the full load throughput (rows per second) from the source database.
 *
 * This alarm monitors the rate at which data is being read from the source database
 * during full load operations. It can help detect:
 * - Full load performance issues (low throughput)
 * - Full load completion (zero throughput)
 * - Full load stalling or errors
 * - Source database performance issues affecting full load
 *
 * The alarm is typically configured to trigger on low or zero throughput values.
 */
export class DmsReplicationTaskFullLoadThroughputRowsSourceAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DmsReplicationTaskFullLoadThroughputRowsSourceAlarmProps) {
    const alarmName = props.alarmName ?? `${props.replicationTask.replicationTaskIdentifier} - ${DmsReplicationTaskRecommendedAlarmsMetrics.FULL_LOAD_THROUGHPUT_ROWS_SOURCE}`;
    const period = props.period ?? Duration.minutes(5); // Longer period for full load metrics
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const threshold = props.threshold ?? 1000; // Default threshold for detecting low throughput during full load
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm monitors full load throughput from the source database. '
      + 'Low values may indicate performance issues or full load completion. '
      + 'Zero values indicate full load has completed or stalled.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationTaskRecommendedAlarmsMetrics.FULL_LOAD_THROUGHPUT_ROWS_SOURCE,
        dimensionsMap: {
          ReplicationTaskIdentifier: props.replicationTask.replicationTaskIdentifier!,
          ReplicationInstanceIdentifier: props.replicationTask.replicationInstanceArn!,
        },
        statistic: 'Average',
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
}

/**
 * Configuration for the FullLoadThroughputRowsTarget alarm.
 */
export interface DmsFullLoadThroughputRowsTargetAlarmConfig extends DmsAlarmBaseConfig {
  /**
   * The number of rows per second threshold. This alarm can be used to detect:
   * - Abnormally low throughput (potential full load performance issues)
   * - Full load completion or stalling
   *
   * Consider your expected full load patterns when setting this threshold.
   *
   * @default 1000 (for detecting low throughput during full load - adjust based on your workload)
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 3 (to avoid false alarms from temporary fluctuations)
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 2 (allow for some variance while still detecting issues)
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - replicationTaskIdentifier + ' - FullLoadThroughputRowsTarget'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm monitors full load throughput to the target database.
   * Low values may indicate performance issues or full load completion.
   * Zero values indicate full load has completed or stalled.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationTaskFullLoadThroughputRowsTargetAlarm construct.
 */
export interface DmsReplicationTaskFullLoadThroughputRowsTargetAlarmProps extends
  DmsReplicationTaskAlarmProps, DmsFullLoadThroughputRowsTargetAlarmConfig {}

/**
 * An alarm that monitors the full load throughput (rows per second) to the target database.
 *
 * This alarm monitors the rate at which data is being written to the target database
 * during full load operations. It can help detect:
 * - Full load performance issues (low throughput)
 * - Full load completion (zero throughput)
 * - Full load stalling or errors
 * - Target database performance issues affecting full load
 *
 * The alarm is typically configured to trigger on low or zero throughput values.
 */
export class DmsReplicationTaskFullLoadThroughputRowsTargetAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DmsReplicationTaskFullLoadThroughputRowsTargetAlarmProps) {
    const alarmName = props.alarmName ?? `${props.replicationTask.replicationTaskIdentifier} - ${DmsReplicationTaskRecommendedAlarmsMetrics.FULL_LOAD_THROUGHPUT_ROWS_TARGET}`;
    const period = props.period ?? Duration.minutes(5); // Longer period for full load metrics
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const threshold = props.threshold ?? 1000; // Default threshold for detecting low throughput during full load
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm monitors full load throughput to the target database. '
      + 'Low values may indicate performance issues or full load completion. '
      + 'Zero values indicate full load has completed or stalled.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationTaskRecommendedAlarmsMetrics.FULL_LOAD_THROUGHPUT_ROWS_TARGET,
        dimensionsMap: {
          ReplicationTaskIdentifier: props.replicationTask.replicationTaskIdentifier!,
          ReplicationInstanceIdentifier: props.replicationTask.replicationInstanceArn!,
        },
        statistic: 'Average',
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
}

/**
 * Configuration for the CdcLatencySource alarm.
 */
export interface DmsCdcLatencySourceAlarmConfig extends DmsAlarmBaseConfig {
  /**
   * The latency threshold in seconds. This alarm can be used to detect:
   * - High latency indicating replication lag or source database performance issues
   * - Potential data freshness problems affecting real-time applications
   *
   * Consider your application's tolerance for data lag when setting this threshold.
   *
   * @default 300 (5 minutes - for detecting high latency issues)
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 3 (to avoid false alarms from temporary fluctuations)
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 2 (allow for some variance while still detecting issues)
   */
  readonly datapointsToAlarm?: number;
  /**
   * The comparison operator to use for the alarm.
   *
   * @default GREATER_THAN_THRESHOLD (for detecting high latency issues)
   */
  readonly comparisonOperator?: cloudwatch.ComparisonOperator;
  /**
   * The alarm name.
   *
   * @default - replicationTaskIdentifier + ' - CDCLatencySource'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm monitors CDC latency from the source database.
   * High values may indicate replication lag or source database performance issues.
   * This can affect data freshness in real-time applications.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationTaskCdcLatencySourceAlarm construct.
 */
export interface DmsReplicationTaskCdcLatencySourceAlarmProps extends DmsReplicationTaskAlarmProps, DmsCdcLatencySourceAlarmConfig {}

/**
 * An alarm that monitors the CDC latency (in seconds) from the source database.
 *
 * This alarm monitors the gap between the last event captured from the source endpoint
 * and current system time. It can help detect:
 * - Replication lag indicating source database performance issues
 * - Network connectivity problems affecting CDC capture
 * - Source database load affecting change capture performance
 * - Data freshness issues that could impact real-time applications
 *
 * The alarm is typically configured to trigger on high latency values.
 */
export class DmsReplicationTaskCdcLatencySourceAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DmsReplicationTaskCdcLatencySourceAlarmProps) {
    const alarmName = props.alarmName ?? `${props.replicationTask.replicationTaskIdentifier} - ${DmsReplicationTaskRecommendedAlarmsMetrics.CDC_LATENCY_SOURCE}`;
    const period = props.period ?? Duration.minutes(5); // Longer period for latency metrics
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const threshold = props.threshold ?? 300; // Default threshold for detecting high latency (5 minutes)
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const comparisonOperator = props.comparisonOperator ?? cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD;
    const alarmDescription = props.alarmDescription ?? 'This alarm monitors CDC latency from the source database. '
      + 'High values may indicate replication lag or source database performance issues. '
      + 'This can affect data freshness in real-time applications.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationTaskRecommendedAlarmsMetrics.CDC_LATENCY_SOURCE,
        dimensionsMap: {
          ReplicationTaskIdentifier: props.replicationTask.replicationTaskIdentifier!,
          ReplicationInstanceIdentifier: props.replicationTask.replicationInstanceArn!,
        },
        statistic: 'Average',
        period,
      }),
      threshold,
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
 * Configuration for the CdcLatencyTarget alarm.
 */
export interface DmsCdcLatencyTargetAlarmConfig extends DmsAlarmBaseConfig {
  /**
   * The latency threshold in seconds. This alarm can be used to detect:
   * - High latency indicating target database performance issues or replication lag
   * - Potential data consistency problems affecting downstream applications
   *
   * Consider your application's tolerance for data lag when setting this threshold.
   *
   * @default 300 (5 minutes - for detecting high latency issues)
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 3 (to avoid false alarms from temporary fluctuations)
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 2 (allow for some variance while still detecting issues)
   */
  readonly datapointsToAlarm?: number;
  /**
   * The comparison operator to use for the alarm.
   *
   * @default GREATER_THAN_THRESHOLD (for detecting high latency issues)
   */
  readonly comparisonOperator?: cloudwatch.ComparisonOperator;
  /**
   * The alarm name.
   *
   * @default - replicationTaskIdentifier + ' - CDCLatencyTarget'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm monitors CDC latency to the target database.
   * High values may indicate replication lag or target database performance issues.
   * This can affect data consistency in downstream applications.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationTaskCdcLatencyTargetAlarm construct.
 */
export interface DmsReplicationTaskCdcLatencyTargetAlarmProps extends DmsReplicationTaskAlarmProps, DmsCdcLatencyTargetAlarmConfig {}

/**
 * An alarm that monitors the CDC latency (in seconds) to the target database.
 *
 * This alarm monitors the gap between a change that was committed to the source
 * and the same change committed to the target. It can help detect:
 * - End-to-end replication latency affecting data consistency
 * - Target database performance issues affecting write operations
 * - Network connectivity problems between replication instance and target
 * - Data consistency issues that could impact downstream applications
 *
 * The alarm is typically configured to trigger on high latency values.
 */
export class DmsReplicationTaskCdcLatencyTargetAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: DmsReplicationTaskCdcLatencyTargetAlarmProps) {
    const alarmName = props.alarmName ?? `${props.replicationTask.replicationTaskIdentifier} - ${DmsReplicationTaskRecommendedAlarmsMetrics.CDC_LATENCY_TARGET}`;
    const period = props.period ?? Duration.minutes(5); // Longer period for latency metrics
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const threshold = props.threshold ?? 300; // Default threshold for detecting high latency (5 minutes)
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const comparisonOperator = props.comparisonOperator ?? cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD;
    const alarmDescription = props.alarmDescription ?? 'This alarm monitors CDC latency to the target database. '
      + 'High values may indicate replication lag or target database performance issues. '
      + 'This can affect data consistency in downstream applications.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationTaskRecommendedAlarmsMetrics.CDC_LATENCY_TARGET,
        dimensionsMap: {
          ReplicationTaskIdentifier: props.replicationTask.replicationTaskIdentifier!,
          ReplicationInstanceIdentifier: props.replicationTask.replicationInstanceArn!,
        },
        statistic: 'Average',
        period,
      }),
      threshold,
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
 * Configurations for the recommended alarms for a DMS Replication Instance.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface DmsReplicationInstanceRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: DmsReplicationInstanceRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the CpuUtilization alarm.
   */
  readonly configCpuUtilizationAlarm?: DmsCpuUtilizationAlarmConfig;
  /**
   * The configuration for the FreeableMemory alarm.
   */
  readonly configFreeableMemoryAlarm: DmsFreeableMemoryAlarmConfig;
  /**
   * The configuration for the FreeStorageSpace alarm.
   */
  readonly configFreeStorageSpaceAlarm: DmsFreeStorageSpaceAlarmConfig;
  /**
   * The configuration for the WriteIops alarm.
   */
  readonly configWriteIopsAlarm?: DmsWriteIopsAlarmConfig;
}

/**
 * Properties for the DmsReplicationInstanceRecommendedAlarms construct.
 */
export interface DmsReplicationInstanceRecommendedAlarmsProps extends DmsReplicationInstanceRecommendedAlarmsConfig {
  /**
   * The DMS Replication Instance to monitor.
   */
  readonly replicationInstance: dms.CfnReplicationInstance;
}

/**
 * A construct that creates the recommended alarms for a DMS Replication Instance.
 */
export class DmsReplicationInstanceRecommendedAlarms extends Construct {
  /**
   * The CpuUtilization alarm.
   */
  public readonly alarmCpuUtilization?: DmsReplicationInstanceCpuUtilizationAlarm;

  /**
   * The FreeableMemory alarm.
   */
  public readonly alarmFreeableMemory?: DmsReplicationInstanceFreeableMemoryAlarm;

  /**
   * The FreeStorageSpace alarm.
   */
  public readonly alarmFreeStorageSpace?: DmsReplicationInstanceFreeStorageSpaceAlarm;

  /**
   * The WriteIops alarm.
   */
  public readonly alarmWriteIops?: DmsReplicationInstanceWriteIopsAlarm;

  constructor(scope: Construct, id: string, props: DmsReplicationInstanceRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(DmsReplicationInstanceRecommendedAlarmsMetrics.CPU_UTILIZATION)) {
      this.alarmCpuUtilization = new DmsReplicationInstanceCpuUtilizationAlarm(this, `${props.replicationInstance.replicationInstanceIdentifier}_CpuUtilization`, {
        replicationInstance: props.replicationInstance,
        treatMissingData: props.treatMissingData,
        ...props.configCpuUtilizationAlarm,
      });

      if (props.defaultAlarmAction && !props.configCpuUtilizationAlarm?.alarmAction) {
        this.alarmCpuUtilization.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configCpuUtilizationAlarm?.okAction) {
        this.alarmCpuUtilization.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configCpuUtilizationAlarm?.insufficientDataAction) {
        this.alarmCpuUtilization.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(DmsReplicationInstanceRecommendedAlarmsMetrics.FREEABLE_MEMORY)) {
      this.alarmFreeableMemory = new DmsReplicationInstanceFreeableMemoryAlarm(this, `${props.replicationInstance.replicationInstanceIdentifier}_FreeableMemory`, {
        replicationInstance: props.replicationInstance,
        treatMissingData: props.treatMissingData,
        ...props.configFreeableMemoryAlarm,
      });

      if (props.defaultAlarmAction && !props.configFreeableMemoryAlarm?.alarmAction) {
        this.alarmFreeableMemory.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configFreeableMemoryAlarm?.okAction) {
        this.alarmFreeableMemory.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configFreeableMemoryAlarm?.insufficientDataAction) {
        this.alarmFreeableMemory.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(DmsReplicationInstanceRecommendedAlarmsMetrics.FREE_STORAGE_SPACE)) {
      this.alarmFreeStorageSpace = new DmsReplicationInstanceFreeStorageSpaceAlarm(this, `${props.replicationInstance.replicationInstanceIdentifier}_FreeStorageSpace`, {
        replicationInstance: props.replicationInstance,
        treatMissingData: props.treatMissingData,
        ...props.configFreeStorageSpaceAlarm,
      });

      if (props.defaultAlarmAction && !props.configFreeStorageSpaceAlarm?.alarmAction) {
        this.alarmFreeStorageSpace.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configFreeStorageSpaceAlarm?.okAction) {
        this.alarmFreeStorageSpace.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configFreeStorageSpaceAlarm?.insufficientDataAction) {
        this.alarmFreeStorageSpace.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(DmsReplicationInstanceRecommendedAlarmsMetrics.WRITE_IOPS)) {
      this.alarmWriteIops = new DmsReplicationInstanceWriteIopsAlarm(this, `${props.replicationInstance.replicationInstanceIdentifier}_WriteIops`, {
        replicationInstance: props.replicationInstance,
        treatMissingData: props.treatMissingData,
        ...props.configWriteIopsAlarm,
      });

      if (props.defaultAlarmAction && !props.configWriteIopsAlarm?.alarmAction) {
        this.alarmWriteIops.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configWriteIopsAlarm?.okAction) {
        this.alarmWriteIops.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configWriteIopsAlarm?.insufficientDataAction) {
        this.alarmWriteIops.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * Configurations for the recommended alarms for a DMS Replication Task.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface DmsReplicationTaskRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: DmsReplicationTaskRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the CDCThroughputRowsSource alarm.
   */
  readonly configCdcThroughputRowsSourceAlarm?: DmsCdcThroughputRowsSourceAlarmConfig;
  /**
   * The configuration for the CDCThroughputRowsTarget alarm.
   */
  readonly configCdcThroughputRowsTargetAlarm?: DmsCdcThroughputRowsTargetAlarmConfig;
  /**
   * The configuration for the CDCLatencySource alarm.
   */
  readonly configCdcLatencySourceAlarm?: DmsCdcLatencySourceAlarmConfig;
  /**
   * The configuration for the CDCLatencyTarget alarm.
   */
  readonly configCdcLatencyTargetAlarm?: DmsCdcLatencyTargetAlarmConfig;
  /**
   * The configuration for the FullLoadThroughputRowsSource alarm.
   */
  readonly configFullLoadThroughputRowsSourceAlarm?: DmsFullLoadThroughputRowsSourceAlarmConfig;
  /**
   * The configuration for the FullLoadThroughputRowsTarget alarm.
   */
  readonly configFullLoadThroughputRowsTargetAlarm?: DmsFullLoadThroughputRowsTargetAlarmConfig;
}

/**
 * Properties for the DmsReplicationTaskRecommendedAlarms construct.
 */
export interface DmsReplicationTaskRecommendedAlarmsProps extends DmsReplicationTaskRecommendedAlarmsConfig {
  /**
   * The DMS Replication Task to monitor.
   */
  readonly replicationTask: dms.CfnReplicationTask;
}

/**
 * A construct that creates the recommended alarms for a DMS Replication Task.
 */
export class DmsReplicationTaskRecommendedAlarms extends Construct {
  /**
   * The CDCThroughputRowsSource alarm.
   */
  public readonly alarmCdcThroughputRowsSource?: DmsReplicationTaskCdcThroughputRowsSourceAlarm;

  /**
   * The CDCThroughputRowsTarget alarm.
   */
  public readonly alarmCdcThroughputRowsTarget?: DmsReplicationTaskCdcThroughputRowsTargetAlarm;

  /**
   * The CDCLatencySource alarm.
   */
  public readonly alarmCdcLatencySource?: DmsReplicationTaskCdcLatencySourceAlarm;

  /**
   * The CDCLatencyTarget alarm.
   */
  public readonly alarmCdcLatencyTarget?: DmsReplicationTaskCdcLatencyTargetAlarm;

  /**
   * The FullLoadThroughputRowsSource alarm.
   */
  public readonly alarmFullLoadThroughputRowsSource?: DmsReplicationTaskFullLoadThroughputRowsSourceAlarm;

  /**
   * The FullLoadThroughputRowsTarget alarm.
   */
  public readonly alarmFullLoadThroughputRowsTarget?: DmsReplicationTaskFullLoadThroughputRowsTargetAlarm;

  constructor(scope: Construct, id: string, props: DmsReplicationTaskRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(DmsReplicationTaskRecommendedAlarmsMetrics.CDC_THROUGHPUT_ROWS_SOURCE)) {
      this.alarmCdcThroughputRowsSource = new DmsReplicationTaskCdcThroughputRowsSourceAlarm(this, `${props.replicationTask.replicationTaskIdentifier}_CdcThroughputRowsSource`, {
        replicationTask: props.replicationTask,
        treatMissingData: props.treatMissingData,
        ...props.configCdcThroughputRowsSourceAlarm,
      });

      if (props.defaultAlarmAction && !props.configCdcThroughputRowsSourceAlarm?.alarmAction) {
        this.alarmCdcThroughputRowsSource.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configCdcThroughputRowsSourceAlarm?.okAction) {
        this.alarmCdcThroughputRowsSource.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configCdcThroughputRowsSourceAlarm?.insufficientDataAction) {
        this.alarmCdcThroughputRowsSource.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(DmsReplicationTaskRecommendedAlarmsMetrics.CDC_THROUGHPUT_ROWS_TARGET)) {
      this.alarmCdcThroughputRowsTarget = new DmsReplicationTaskCdcThroughputRowsTargetAlarm(this, `${props.replicationTask.replicationTaskIdentifier}_CdcThroughputRowsTarget`, {
        replicationTask: props.replicationTask,
        treatMissingData: props.treatMissingData,
        ...props.configCdcThroughputRowsTargetAlarm,
      });

      if (props.defaultAlarmAction && !props.configCdcThroughputRowsTargetAlarm?.alarmAction) {
        this.alarmCdcThroughputRowsTarget.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configCdcThroughputRowsTargetAlarm?.okAction) {
        this.alarmCdcThroughputRowsTarget.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configCdcThroughputRowsTargetAlarm?.insufficientDataAction) {
        this.alarmCdcThroughputRowsTarget.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(DmsReplicationTaskRecommendedAlarmsMetrics.CDC_LATENCY_SOURCE)) {
      this.alarmCdcLatencySource = new DmsReplicationTaskCdcLatencySourceAlarm(this, `${props.replicationTask.replicationTaskIdentifier}_CdcLatencySource`, {
        replicationTask: props.replicationTask,
        treatMissingData: props.treatMissingData,
        ...props.configCdcLatencySourceAlarm,
      });

      if (props.defaultAlarmAction && !props.configCdcLatencySourceAlarm?.alarmAction) {
        this.alarmCdcLatencySource.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configCdcLatencySourceAlarm?.okAction) {
        this.alarmCdcLatencySource.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configCdcLatencySourceAlarm?.insufficientDataAction) {
        this.alarmCdcLatencySource.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(DmsReplicationTaskRecommendedAlarmsMetrics.CDC_LATENCY_TARGET)) {
      this.alarmCdcLatencyTarget = new DmsReplicationTaskCdcLatencyTargetAlarm(this, `${props.replicationTask.replicationTaskIdentifier}_CdcLatencyTarget`, {
        replicationTask: props.replicationTask,
        treatMissingData: props.treatMissingData,
        ...props.configCdcLatencyTargetAlarm,
      });

      if (props.defaultAlarmAction && !props.configCdcLatencyTargetAlarm?.alarmAction) {
        this.alarmCdcLatencyTarget.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configCdcLatencyTargetAlarm?.okAction) {
        this.alarmCdcLatencyTarget.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configCdcLatencyTargetAlarm?.insufficientDataAction) {
        this.alarmCdcLatencyTarget.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(DmsReplicationTaskRecommendedAlarmsMetrics.FULL_LOAD_THROUGHPUT_ROWS_SOURCE)) {
      this.alarmFullLoadThroughputRowsSource = new DmsReplicationTaskFullLoadThroughputRowsSourceAlarm(this, `${props.replicationTask.replicationTaskIdentifier}_FullLoadThroughputRowsSource`, {
        replicationTask: props.replicationTask,
        treatMissingData: props.treatMissingData,
        ...props.configFullLoadThroughputRowsSourceAlarm,
      });

      if (props.defaultAlarmAction && !props.configFullLoadThroughputRowsSourceAlarm?.alarmAction) {
        this.alarmFullLoadThroughputRowsSource.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configFullLoadThroughputRowsSourceAlarm?.okAction) {
        this.alarmFullLoadThroughputRowsSource.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configFullLoadThroughputRowsSourceAlarm?.insufficientDataAction) {
        this.alarmFullLoadThroughputRowsSource.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(DmsReplicationTaskRecommendedAlarmsMetrics.FULL_LOAD_THROUGHPUT_ROWS_TARGET)) {
      this.alarmFullLoadThroughputRowsTarget = new DmsReplicationTaskFullLoadThroughputRowsTargetAlarm(this, `${props.replicationTask.replicationTaskIdentifier}_FullLoadThroughputRowsTarget`, {
        replicationTask: props.replicationTask,
        treatMissingData: props.treatMissingData,
        ...props.configFullLoadThroughputRowsTargetAlarm,
      });

      if (props.defaultAlarmAction && !props.configFullLoadThroughputRowsTargetAlarm?.alarmAction) {
        this.alarmFullLoadThroughputRowsTarget.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configFullLoadThroughputRowsTargetAlarm?.okAction) {
        this.alarmFullLoadThroughputRowsTarget.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configFullLoadThroughputRowsTargetAlarm?.insufficientDataAction) {
        this.alarmFullLoadThroughputRowsTarget.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the CfnReplicationTask construct that provides methods
 * to create recommended alarms.
 */
export class ReplicationTask extends dms.CfnReplicationTask {
  constructor(scope: Construct, id: string, props: dms.CfnReplicationTaskProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the CDC throughput from the source for the Replication Task.
   */
  public alarmCdcThroughputRowsSource(props?: DmsCdcThroughputRowsSourceAlarmConfig): DmsReplicationTaskCdcThroughputRowsSourceAlarm {
    return new DmsReplicationTaskCdcThroughputRowsSourceAlarm(this, 'CdcThroughputRowsSourceAlarm', {
      replicationTask: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the CDC throughput to the target for the Replication Task.
   */
  public alarmCdcThroughputRowsTarget(props?: DmsCdcThroughputRowsTargetAlarmConfig): DmsReplicationTaskCdcThroughputRowsTargetAlarm {
    return new DmsReplicationTaskCdcThroughputRowsTargetAlarm(this, 'CdcThroughputRowsTargetAlarm', {
      replicationTask: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the CDC latency from the source for the Replication Task.
   */
  public alarmCdcLatencySource(props?: DmsCdcLatencySourceAlarmConfig): DmsReplicationTaskCdcLatencySourceAlarm {
    return new DmsReplicationTaskCdcLatencySourceAlarm(this, 'CdcLatencySourceAlarm', {
      replicationTask: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the CDC latency to the target for the Replication Task.
   */
  public alarmCdcLatencyTarget(props?: DmsCdcLatencyTargetAlarmConfig): DmsReplicationTaskCdcLatencyTargetAlarm {
    return new DmsReplicationTaskCdcLatencyTargetAlarm(this, 'CdcLatencyTargetAlarm', {
      replicationTask: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the full load throughput from the source for the Replication Task.
   */
  public alarmFullLoadThroughputRowsSource(props?: DmsFullLoadThroughputRowsSourceAlarmConfig): DmsReplicationTaskFullLoadThroughputRowsSourceAlarm {
    return new DmsReplicationTaskFullLoadThroughputRowsSourceAlarm(this, 'FullLoadThroughputRowsSourceAlarm', {
      replicationTask: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the full load throughput to the target for the Replication Task.
   */
  public alarmFullLoadThroughputRowsTarget(props?: DmsFullLoadThroughputRowsTargetAlarmConfig): DmsReplicationTaskFullLoadThroughputRowsTargetAlarm {
    return new DmsReplicationTaskFullLoadThroughputRowsTargetAlarm(this, 'FullLoadThroughputRowsTargetAlarm', {
      replicationTask: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the DMS Replication Task.
   *
   * @see https://aws.amazon.com/blogs/database/setting-up-amazon-cloudwatch-alarms-for-aws-dms-resources-using-the-aws-cli/
   */
  public applyRecommendedAlarms(props: DmsReplicationTaskRecommendedAlarmsConfig): DmsReplicationTaskRecommendedAlarms {
    return new DmsReplicationTaskRecommendedAlarms(this, 'DmsReplicationTaskRecommendedAlarms', {
      replicationTask: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for a DMS Replication Task.
 *
 * @see https://aws.amazon.com/blogs/database/setting-up-amazon-cloudwatch-alarms-for-aws-dms-resources-using-the-aws-cli/
 */
export class DmsReplicationTaskRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props?: DmsReplicationTaskRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof dms.CfnReplicationTask) {
      if (this.props?.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const replicationTask = node as dms.CfnReplicationTask;

        new DmsReplicationTaskRecommendedAlarms(replicationTask, 'DmsReplicationTaskRecommendedAlarmsFromAspect', {
          replicationTask,
          ...this.props,
        });
      }
    }
  }
}

/**
 * An extension for the CfnReplicationInstance construct that provides methods
 * to create recommended alarms.
 */
export class ReplicationInstance extends dms.CfnReplicationInstance {
  constructor(scope: Construct, id: string, props: dms.CfnReplicationInstanceProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the CPU utilization for the Replication Instance.
   */
  public alarmCpuUtilization(props?: DmsCpuUtilizationAlarmConfig): DmsReplicationInstanceCpuUtilizationAlarm {
    return new DmsReplicationInstanceCpuUtilizationAlarm(this, 'CpuUtilizationAlarm', {
      replicationInstance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the FreeableMemory for the Replication Instance.
   */
  public alarmFreeableMemory(props: DmsFreeableMemoryAlarmConfig): DmsReplicationInstanceFreeableMemoryAlarm {
    return new DmsReplicationInstanceFreeableMemoryAlarm(this, 'FreeableMemoryAlarm', {
      replicationInstance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the Free Storage Space for the Replication Instance.
   */
  public alarmFreeStorageSpace(props: DmsFreeStorageSpaceAlarmConfig): DmsReplicationInstanceFreeStorageSpaceAlarm {
    return new DmsReplicationInstanceFreeStorageSpaceAlarm(this, 'FreeStorageSpaceAlarm', {
      replicationInstance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the Write IOPS for the Replication Instance.
   */
  public alarmWriteIops(props?: DmsWriteIopsAlarmConfig): DmsReplicationInstanceWriteIopsAlarm {
    return new DmsReplicationInstanceWriteIopsAlarm(this, 'WriteIopsAlarm', {
      replicationInstance: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the DMS Replication Instance.
   *
   * @see https://aws.amazon.com/blogs/database/setting-up-amazon-cloudwatch-alarms-for-aws-dms-resources-using-the-aws-cli/
   */
  public applyRecommendedAlarms(props: DmsReplicationInstanceRecommendedAlarmsConfig): DmsReplicationInstanceRecommendedAlarms {
    return new DmsReplicationInstanceRecommendedAlarms(this, 'DmsReplicationInstanceRecommendedAlarms', {
      replicationInstance: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for a DMS Replication Instance.
 *
 * @see https://aws.amazon.com/blogs/database/setting-up-amazon-cloudwatch-alarms-for-aws-dms-resources-using-the-aws-cli/
 */
export class DmsReplicationInstanceRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: DmsReplicationInstanceRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof dms.CfnReplicationInstance) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const replicationInstance = node as dms.CfnReplicationInstance;

        new DmsReplicationInstanceRecommendedAlarms(replicationInstance, 'DmsReplicationInstanceRecommendedAlarmsFromAspect', {
          replicationInstance,
          ...this.props,
        });
      }
    }
  }
}
