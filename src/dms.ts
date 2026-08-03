import {
  IAspect,
  aws_dms as dms,
  aws_cloudwatch as cloudwatch,
  Duration,
  Fn,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, AnomalyComparisonOperator, validateTotalAlarmPeriod } from './common';

/**
 * DMS Replication Task migration types.
 *
 * These are the valid migration types for AWS DMS Replication Tasks.
 */
export enum DmsReplicationTaskMigrationType {
  /**
   * Full load migration - copies all existing data from the source to the target.
   */
  FULL_LOAD = 'full-load',

  /**
   * Change Data Capture (CDC) migration - captures ongoing changes from the source.
   */
  CDC = 'cdc',

  /**
   * Full load and CDC migration - performs initial full load then captures ongoing changes.
   */
  FULL_LOAD_AND_CDC = 'full-load-and-cdc',
}

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
  /**
   * The amount in bytes of swap space used on the replication instance.
   */
  SWAP_USAGE = 'SwapUsage',
}

/**
 * The recommended metrics for DMS Replication Task alarms.
 */
export enum DmsReplicationTaskRecommendedAlarmsMetrics {
  /**
   * The gap, in seconds, between the last event captured from the source endpoint and current system time.
   */
  CDC_LATENCY_SOURCE = 'CDCLatencySource',
  /**
   * The gap, in seconds, between a change that was committed to the source and the same change committed to the target.
   */
  CDC_LATENCY_TARGET = 'CDCLatencyTarget',
}

/**
 * The common optional configuration for the alarms.
 */
export interface DmsAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * Different alarm types may have different optimal default periods:
   * - Regular alarms: 1 minute (for responsive monitoring)
   * - Anomaly detection alarms: 5 minutes (for stable ML model training)
   * - CDC/throughput alarms: 5 minutes (for trend analysis)
   *
   * @default Duration.minutes(1) for regular alarms, Duration.minutes(5) for anomaly detection and throughput alarms
   */
  readonly period?: Duration;
}

/**
 * The common optional configuration for anomaly detection alarms.
 *
 * Anomaly detection alarms have a fixed period of 5 minutes as required by AWS CloudWatch,
 * so the period property is not configurable.
 */
export interface DmsAnomalyDetectionAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The width of the anomaly detection band, expressed as a number of standard deviations from the metric's mean.
   *
   * @default 8 (standard deviation for anomaly detection)
   */
  readonly stdDevs?: number;
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
  readonly replicationTask: ReplicationTask;
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
    const alarmName = props.alarmName ??
      `${props.replicationInstance.replicationInstanceIdentifier} - ${DmsReplicationInstanceRecommendedAlarmsMetrics.CPU_UTILIZATION}`;
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
    const alarmName = props.alarmName ??
      `${props.replicationInstance.replicationInstanceIdentifier} - ${DmsReplicationInstanceRecommendedAlarmsMetrics.FREEABLE_MEMORY}`;
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
    const alarmName = props.alarmName ??
      `${props.replicationInstance.replicationInstanceIdentifier} - ${DmsReplicationInstanceRecommendedAlarmsMetrics.FREE_STORAGE_SPACE}`;
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
    const alarmName = props.alarmName ??
      `${props.replicationInstance.replicationInstanceIdentifier} - ${DmsReplicationInstanceRecommendedAlarmsMetrics.WRITE_IOPS}`;
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
 * Configuration for the SwapUsage alarm.
 */
export interface DmsSwapUsageAlarmConfig extends DmsAnomalyDetectionAlarmBaseConfig {
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
   * @default GREATER_THAN_UPPER_THRESHOLD (for detecting high swap usage indicating memory pressure)
   */
  readonly comparisonOperator?: AnomalyComparisonOperator;
  /**
   * The alarm name.
   *
   * @default - replicationInstanceIdentifier + ' - SwapUsage'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high swap usage for the DMS Replication Instance.
   * High swap usage can indicate memory pressure or performance issues.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the DmsReplicationInstanceSwapUsageAlarm construct.
 */
export interface DmsReplicationInstanceSwapUsageAlarmProps extends DmsReplicationInstanceAlarmProps, DmsSwapUsageAlarmConfig {}

/**
 * This anomaly detection alarm is used to detect high swap usage for the DMS Replication Instance.
 *
 * High swap usage can indicate memory pressure, performance issues, or resource constraints.
 * This alarm uses anomaly detection to identify when swap usage exceeds normal patterns,
 * which can help identify performance degradation or insufficient memory allocation.
 *
 * By default, the alarm is triggered when swap usage exceeds the upper threshold
 * of the anomaly detection band, detecting unusually high swap usage that may
 * indicate memory pressure or performance issues.
 *
 * Note: Anomaly detection alarms use a fixed 5-minute period as required by AWS CloudWatch.
 * This period cannot be customized and is optimal for anomaly detection algorithms.
 */
export class DmsReplicationInstanceSwapUsageAlarm extends cloudwatch.AnomalyDetectionAlarm {
  constructor(scope: IConstruct, id: string, props: DmsReplicationInstanceSwapUsageAlarmProps) {
    const alarmName = props.alarmName ??
      `${props.replicationInstance.replicationInstanceIdentifier} - ${DmsReplicationInstanceRecommendedAlarmsMetrics.SWAP_USAGE}`;
    // Anomaly detection alarms require a fixed 5-minute period as mandated by AWS CloudWatch.
    const period = Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const stdDevs = props.stdDevs ?? 8;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const comparisonOperator = props.comparisonOperator ?? cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high swap usage for the DMS Replication Instance.'
      + ' High swap usage can indicate memory pressure, performance issues, or resource constraints.'
      + ' This alarm triggers when swap usage exceeds the upper threshold of the anomaly detection band.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/DMS',
        metricName: DmsReplicationInstanceRecommendedAlarmsMetrics.SWAP_USAGE,
        dimensionsMap: {
          ReplicationInstanceIdentifier: props.replicationInstance.replicationInstanceIdentifier!,
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
    const alarmName = props.alarmName ??
      `${props.replicationTask.replicationTaskIdentifier} - ${DmsReplicationTaskRecommendedAlarmsMetrics.CDC_LATENCY_SOURCE}`;
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
          ReplicationTaskIdentifier: Fn.select(6, Fn.split(':', props.replicationTask.ref)),
          ReplicationInstanceIdentifier: props.replicationTask.replicationInstanceIdentifier,
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
    const alarmName = props.alarmName ??
      `${props.replicationTask.replicationTaskIdentifier} - ${DmsReplicationTaskRecommendedAlarmsMetrics.CDC_LATENCY_TARGET}`;
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
          ReplicationTaskIdentifier: Fn.select(6, Fn.split(':', props.replicationTask.ref)),
          ReplicationInstanceIdentifier: props.replicationTask.replicationInstanceIdentifier,
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
  /**
   * The configuration for the SwapUsage alarm.
   */
  readonly configSwapUsageAlarm?: DmsSwapUsageAlarmConfig;
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

  /**
   * The SwapUsage alarm.
   */
  public readonly alarmSwapUsage?: DmsReplicationInstanceSwapUsageAlarm;

  constructor(scope: Construct, id: string, props: DmsReplicationInstanceRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(DmsReplicationInstanceRecommendedAlarmsMetrics.CPU_UTILIZATION)) {
      this.alarmCpuUtilization = new DmsReplicationInstanceCpuUtilizationAlarm(
        this,
        `${props.replicationInstance.replicationInstanceIdentifier}_CpuUtilization`,
        {
          replicationInstance: props.replicationInstance,
          treatMissingData: props.treatMissingData,
          ...props.configCpuUtilizationAlarm,
        },
      );

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
      this.alarmFreeableMemory = new DmsReplicationInstanceFreeableMemoryAlarm(
        this,
        `${props.replicationInstance.replicationInstanceIdentifier}_FreeableMemory`,
        {
          replicationInstance: props.replicationInstance,
          treatMissingData: props.treatMissingData,
          ...props.configFreeableMemoryAlarm,
        },
      );

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
      this.alarmFreeStorageSpace = new DmsReplicationInstanceFreeStorageSpaceAlarm(
        this,
        `${props.replicationInstance.replicationInstanceIdentifier}_FreeStorageSpace`,
        {
          replicationInstance: props.replicationInstance,
          treatMissingData: props.treatMissingData,
          ...props.configFreeStorageSpaceAlarm,
        },
      );

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

    if (!props.excludeAlarms?.includes(DmsReplicationInstanceRecommendedAlarmsMetrics.SWAP_USAGE)) {
      this.alarmSwapUsage = new DmsReplicationInstanceSwapUsageAlarm(this, `${props.replicationInstance.replicationInstanceIdentifier}_SwapUsage`, {
        replicationInstance: props.replicationInstance,
        treatMissingData: props.treatMissingData,
        ...props.configSwapUsageAlarm,
      });

      if (props.defaultAlarmAction && !props.configSwapUsageAlarm?.alarmAction) {
        this.alarmSwapUsage.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configSwapUsageAlarm?.okAction) {
        this.alarmSwapUsage.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configSwapUsageAlarm?.insufficientDataAction) {
        this.alarmSwapUsage.addInsufficientDataAction(props.defaultInsufficientDataAction);
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
   * The configuration for the CDCLatencySource alarm.
   */
  readonly configCdcLatencySourceAlarm?: DmsCdcLatencySourceAlarmConfig;
  /**
   * The configuration for the CDCLatencyTarget alarm.
   */
  readonly configCdcLatencyTargetAlarm?: DmsCdcLatencyTargetAlarmConfig;
}

/**
 * Properties for the DmsReplicationTaskRecommendedAlarms construct.
 */
export interface DmsReplicationTaskRecommendedAlarmsProps extends DmsReplicationTaskRecommendedAlarmsConfig {
  /**
   * The DMS Replication Task to monitor.
   */
  readonly replicationTask: ReplicationTask;
}

/**
 * A construct that creates the recommended alarms for a DMS Replication Task.
 */
export class DmsReplicationTaskRecommendedAlarms extends Construct {
  /**
   * The CDCLatencySource alarm.
   */
  public readonly alarmCdcLatencySource?: DmsReplicationTaskCdcLatencySourceAlarm;

  /**
   * The CDCLatencyTarget alarm.
   */
  public readonly alarmCdcLatencyTarget?: DmsReplicationTaskCdcLatencyTargetAlarm;

  constructor(scope: Construct, id: string, props: DmsReplicationTaskRecommendedAlarmsProps) {
    super(scope, id);

    // Check if migration type supports CDC alarms
    const supportsCdc = props.replicationTask.migrationType === DmsReplicationTaskMigrationType.CDC ||
                       props.replicationTask.migrationType === DmsReplicationTaskMigrationType.FULL_LOAD_AND_CDC;

    if (supportsCdc && !props.excludeAlarms?.includes(DmsReplicationTaskRecommendedAlarmsMetrics.CDC_LATENCY_SOURCE)) {
      this.alarmCdcLatencySource = new DmsReplicationTaskCdcLatencySourceAlarm(
        this,
        `${props.replicationTask.replicationTaskIdentifier}_CdcLatencySource`,
        {
          replicationTask: props.replicationTask,
          treatMissingData: props.treatMissingData,
          ...props.configCdcLatencySourceAlarm,
        },
      );

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

    if (supportsCdc && !props.excludeAlarms?.includes(DmsReplicationTaskRecommendedAlarmsMetrics.CDC_LATENCY_TARGET)) {
      this.alarmCdcLatencyTarget = new DmsReplicationTaskCdcLatencyTargetAlarm(
        this,
        `${props.replicationTask.replicationTaskIdentifier}_CdcLatencyTarget`,
        {
          replicationTask: props.replicationTask,
          treatMissingData: props.treatMissingData,
          ...props.configCdcLatencyTargetAlarm,
        },
      );

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
  }
}

export interface ReplicationTaskProps extends dms.CfnReplicationTaskProps {
  /**
   * The identifier of the replication instance.
   */
  readonly replicationInstanceIdentifier: string;
}

/**
 * An extension for the CfnReplicationTask construct that provides methods
 * to create recommended alarms.
 */
export class ReplicationTask extends dms.CfnReplicationTask {

  readonly replicationInstanceIdentifier: string;

  constructor(scope: Construct, id: string, props: ReplicationTaskProps) {
    super(scope, id, props);
    this.replicationInstanceIdentifier = props.replicationInstanceIdentifier;
  }

  /**
   * Creates an alarm that monitors the CDC latency from the source for the Replication Task.
   */
  public alarmCdcLatencySource(props?: DmsCdcLatencySourceAlarmConfig): DmsReplicationTaskCdcLatencySourceAlarm {
    if (this.migrationType !== DmsReplicationTaskMigrationType.CDC &&
        this.migrationType !== DmsReplicationTaskMigrationType.FULL_LOAD_AND_CDC) {
      throw new Error(
        `CDC latency alarms can only be created for replication tasks with migration type '${DmsReplicationTaskMigrationType.CDC}' or ` +
        `'${DmsReplicationTaskMigrationType.FULL_LOAD_AND_CDC}'. Current migration type: ${this.migrationType}`,
      );
    }
    return new DmsReplicationTaskCdcLatencySourceAlarm(this, 'CdcLatencySourceAlarm', {
      replicationTask: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the CDC latency to the target for the Replication Task.
   */
  public alarmCdcLatencyTarget(props?: DmsCdcLatencyTargetAlarmConfig): DmsReplicationTaskCdcLatencyTargetAlarm {
    if (this.migrationType !== DmsReplicationTaskMigrationType.CDC &&
        this.migrationType !== DmsReplicationTaskMigrationType.FULL_LOAD_AND_CDC) {
      throw new Error(
        `CDC latency alarms can only be created for replication tasks with migration type '${DmsReplicationTaskMigrationType.CDC}' or ` +
        `'${DmsReplicationTaskMigrationType.FULL_LOAD_AND_CDC}'. Current migration type: ${this.migrationType}`,
      );
    }
    return new DmsReplicationTaskCdcLatencyTargetAlarm(this, 'CdcLatencyTargetAlarm', {
      replicationTask: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the DMS Replication Task.
   *
   * @see https://aws.amazon.com/blogs/database/setting-up-amazon-cloudwatch-alarms-for-aws-dms-resources-using-the-aws-cli/
   */
  public applyRecommendedAlarms(props?: DmsReplicationTaskRecommendedAlarmsConfig): DmsReplicationTaskRecommendedAlarms {
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
    if (node instanceof ReplicationTask) {
      if (this.props?.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const replicationTask = node as ReplicationTask;

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
   * Creates an alarm that monitors the Swap Usage for the Replication Instance.
   */
  public alarmSwapUsage(props?: DmsSwapUsageAlarmConfig): DmsReplicationInstanceSwapUsageAlarm {
    return new DmsReplicationInstanceSwapUsageAlarm(this, 'SwapUsageAlarm', {
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
