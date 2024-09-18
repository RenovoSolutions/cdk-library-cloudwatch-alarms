import {
  IAspect,
  aws_rds as rds,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { IConstruct, Construct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for RDS alarms.
 */
export enum RdsRecommendedAlarmsMetrics {
  /**
   * The percentage of CPU utilization for an RDS instance.
   */
  INSTANCE_CPU_UTILIZATION = 'CPUUtilization',
  /**
   * The number of client network connections to the database instance.
   */
  INSTANCE_DATABASE_CONNECTIONS = 'DatabaseConnections',
  /**
   * The amount of available memory (RAM) on the RDS instance.
   */
  INSTANCE_FREEABLE_MEMORY = 'FreeableMemory',
  /**
   * The amount of available local storage space for an Aurora instance used for temporary files.
   */
  INSTANCE_FREE_LOCAL_STORAGE = 'FreeLocalStorage',
  /**
   * The amount of available storage space for an Aurora instance.
   */
  INSTANCE_FREE_STORAGE_SPACE = 'FreeStorageSpace',
  /**
   * The average amount of time taken per disk read I/O operation.
   */
  INSTANCE_READ_LATENCY = 'ReadLatency',
  /**
   * The average amount of time taken per disk write I/O operation.
   */
  INSTANCE_WRITE_LATENCY = 'WriteLatency',
  /**
   * The average active sessions (AAS) for the DB instance which shows how many sessions are concurrently active on the database.
   */
  INSTANCE_DB_LOAD = 'DBLoad',
  /**
   * The remaining available space for the cluster volume.
   */
  AURORA_VOLUME_BYTES_LEFT_TOTAL = 'AuroraVolumeBytesLeftTotal',
  /**
   * The amount of time that a binary log replica DB cluster running on Aurora MySQL lags behind the binary log replication source.
   */
  AURORA_BIN_LOG_REPLICATION_LAG = 'AuroraBinLogReplicaLag',
}

/**
 * The common optional configuration for the alarms.
 */
export interface RdsAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the instance alarms. The alarm should receive either
 * instanceIdentifier or databaseInstance.
 */
export interface RdsInstanceAlarmProps {
  /**
   * The database instance identifier to monitor.
   */
  readonly instanceIdentifier?: string;

  /**
   * The database instance to monitor.
   */
  readonly databaseInstance?: rds.IDatabaseInstance;
}

/**
 * Validates that either instanceIdentifier or databaseInstance is specified.
 *
 * @param props The properties for the RdsInstanceAlarm construct.
 */
export function validateInstanceIdentifier(props: RdsInstanceAlarmProps) {
  if (!props.instanceIdentifier && !props.databaseInstance) {
    throw new Error('Either instanceIdentifier or databaseInstance must be specified.');
  }
}

/**
 * Configuration for the CpuUtilization alarm.
 */
export interface RdsCpuUtilizationAlarmConfig extends RdsAlarmBaseConfig {
  /**
   * The percentage (0-100) value against which the specified statistic is compared.
   * Random spikes in CPU consumption might not hamper database performance, but sustained
   * high CPU can hinder upcoming database requests. Depending on the overall database
   * workload, high CPU at your RDS/Aurora instance can degrade the overall performance.
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
   * @default - database.instanceIdentifiers[*] + ' - CpuUtilization'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect consistent high CPU utilization in order to
   * prevent very high response time and time-outs. If you want to check micro-bursting
   * of CPU utilization you can set a lower alarm evaluation time.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the RdsInstanceCpuUtilizationAlarm construct.
 */
export interface RdsInstanceCpuUtilizationAlarmProps extends RdsInstanceAlarmProps, RdsCpuUtilizationAlarmConfig {}

/**
 * An alarm that monitors CPU utilization for an RDS instance.
 *
 * This alarm is used to detect consistent high CPU utilization in order to prevent very
 * high response time and time-outs.
 *
 * The alarm is triggered when the CPU utilization exceeds the % threshold.
 */
export class RdsInstanceCpuUtilizationAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: RdsInstanceCpuUtilizationAlarmProps) {
    const instanceIdentifier = props.instanceIdentifier ? props.instanceIdentifier : props.databaseInstance?.instanceIdentifier;
    const alarmName = props.alarmName ?? `${instanceIdentifier} - ${RdsRecommendedAlarmsMetrics.INSTANCE_CPU_UTILIZATION}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 90;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect consistent high CPU utilization in order to '
    + 'prevent very high response time and time-outs. If you want to check micro-bursting '
    + 'of CPU utilization you can set a lower alarm evaluation time.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);
    validateInstanceIdentifier(props);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: RdsRecommendedAlarmsMetrics.INSTANCE_CPU_UTILIZATION,
        dimensionsMap: {
          DBInstanceIdentifier: instanceIdentifier!,
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
}

/**
 * Configuration for the DatabaseConnections alarm.
 */
export interface RdsDatabaseConnectionsAlarmConfig extends RdsAlarmBaseConfig {
  /**
   * The number of connections against which the specified statistic is compared.
   * The number of connections allowed depends on the size of your DB instance class and
   * database engine-specific parameters related to processes/connections. You should
   * calculate a value between 90-95% of the maximum number of connections for your database
   * and use that result as the threshold value.
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
   * @default - database.instanceIdentifiers[*] + ' - DatabaseConnections'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to help prevent rejected connections when the maximum
   * number of DB connections is reached. This alarm is not recommended if you frequently
   * change DB instance class, because doing so changes the memory and default maximum
   * number of connections.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the RdsInstanceDatabaseConnectionsAlarm construct.
 */
export interface RdsInstanceDatabaseConnectionsAlarmProps extends RdsInstanceAlarmProps, RdsDatabaseConnectionsAlarmConfig {}

/**
 * An alarm that monitors the number of client network connections to the database instance.
 *
 * This alarm is used to help prevent rejected connections when the maximum number of DB
 * connections is reached.
 *
 * The alarm is triggered when number of connections is greater than threshold.
 */
export class RdsInstanceDatabaseConnectionsAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: RdsInstanceDatabaseConnectionsAlarmProps) {
    const instanceIdentifier = props.instanceIdentifier ? props.instanceIdentifier : props.databaseInstance?.instanceIdentifier;
    const alarmName = props.alarmName ?? `${instanceIdentifier} - ${RdsRecommendedAlarmsMetrics.INSTANCE_DATABASE_CONNECTIONS}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to help prevent rejected connections when'
      + ' the maximum number of DB connections is reached. This alarm is not recommended if you frequently change DB'
      + ' instance class, because doing so changes the memory and default maximum number of connections.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);
    validateInstanceIdentifier(props);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: RdsRecommendedAlarmsMetrics.INSTANCE_DATABASE_CONNECTIONS,
        dimensionsMap: {
          DBInstanceIdentifier: instanceIdentifier!,
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
}

/**
 * Configuration for the FreeableMemory alarm.
 */
export interface RdsFreeableMemoryAlarmConfig extends RdsAlarmBaseConfig {
  /**
   * The percentage value (0-100) against which the specified statistic is compared.
   * Depending on the workload and instance class, different values for the threshold
   * can be appropriate. Ideally, available memory should not go below 25% of total
   * memory for prolonged periods. For Aurora, you can set the threshold close to 5%,
   * because the metric approaching 0 means that the DB instance has scaled up as much
   * as it can. You can analyze the historical behavior of this metric to determine
   * sensible threshold levels.
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
   * @default - database.instanceIdentifiers[*] + ' - FreeableMemory'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to help prevent running out of memory
   * which can result in rejected connections.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the RdsInstanceFreeableMemoryAlarm construct.
 */
export interface RdsInstanceFreeableMemoryAlarmProps extends RdsInstanceAlarmProps, RdsFreeableMemoryAlarmConfig {}

/**
 * An alarm that monitors the amount of available memory (RAM) on the RDS instance.
 *
 * This alarm is used to help prevent running out of memory which can result in rejected connections.
 *
 * The alarm is triggered when the percentage of available memory is less than threshold.
 */
export class RdsInstanceFreeableMemoryAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: RdsInstanceFreeableMemoryAlarmProps) {
    const instanceIdentifier = props.instanceIdentifier ? props.instanceIdentifier : props.databaseInstance?.instanceIdentifier;
    const alarmName = props.alarmName ?? `${instanceIdentifier} - ${RdsRecommendedAlarmsMetrics.INSTANCE_FREEABLE_MEMORY}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    const datapointsToAlarm = props.datapointsToAlarm ?? 15;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to help prevent running'
        + ' out of memory which can result in rejected connections.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);
    validateInstanceIdentifier(props);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: RdsRecommendedAlarmsMetrics.INSTANCE_FREEABLE_MEMORY,
        dimensionsMap: {
          DBInstanceIdentifier: instanceIdentifier!,
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
 * Configuration for the FreeLocalStorage alarm.
 */
export interface RdsFreeLocalStorageAlarmConfig extends RdsAlarmBaseConfig {
  /**
   * The percentage value (0-100) against which the specified statistic is compared.
   * You should calculate about 10%-20% of the amount of storage available based on
   * velocity and trend of volume usage, and then use that result as the threshold value
   * to proactively take action before the volume reaches its limit.
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
   * @default - database.instanceIdentifiers[*] + ' - FreeLocalStorage'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect how close the Aurora DB instance is to reaching
   * the local storage limit, if you do not use Aurora Serverless v2 or higher. Local storage
   * can reach capacity when you store non-persistent data, such as temporary table and log
   * files, in the local storage. This alarm can prevent an out-of-space error that occurs when
   * your DB instance runs out of local storage.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the RdsInstanceFreeLocalStorageAlarm construct.
 */
export interface RdsInstanceFreeLocalStorageAlarmProps extends RdsInstanceAlarmProps, RdsFreeLocalStorageAlarmConfig {}

/**
 * An alarm that monitors the amount of available local storage space for an Aurora instance
 * used for temporary files.
 *
 * This alarm is used to detect how close the Aurora DB instance is to reaching the local storage limit.
 * This alarm can prevent an out-of-space error that occurs when your DB instance runs out of local storage.
 *
 * The alarm is triggered when the amount of available local storage space (bytes) is less than threshold.
 */
export class RdsInstanceFreeLocalStorageAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: RdsInstanceFreeLocalStorageAlarmProps) {
    const instanceIdentifier = props.instanceIdentifier ? props.instanceIdentifier : props.databaseInstance?.instanceIdentifier;
    const alarmName = props.alarmName ?? `${instanceIdentifier} - ${RdsRecommendedAlarmsMetrics.INSTANCE_FREE_LOCAL_STORAGE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect how close the Aurora DB instance is'
      + ' to reaching the local storage limit, if you do not use Aurora Serverless v2 or higher. Local storage can reach'
      + ' capacity when you store non-persistent data, such as temporary table and log files, in the local storage. This'
      + ' alarm can prevent an out-of-space error that occurs when your DB instance runs out of local storage.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);
    validateInstanceIdentifier(props);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: RdsRecommendedAlarmsMetrics.INSTANCE_FREE_LOCAL_STORAGE,
        dimensionsMap: {
          DBInstanceIdentifier: instanceIdentifier!,
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
 * Configuration for the FreeStorageSpace alarm.
 */
export interface RdsFreeStorageSpaceAlarmConfig extends RdsAlarmBaseConfig {
  /**
   * The percentage value (0-100) against which the specified statistic is compared.
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
   * @default - database.instanceIdentifiers[*] + ' - FreeStorageSpace'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm helps prevent storage full issues. This can prevent downtime
   * that occurs when your database instance runs out of storage. We do not recommend
   * using this alarm if you have storage auto scaling enabled, or if you frequently change
   * the storage capacity of the database instance.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the RdsInstanceFreeStorageSpaceAlarm construct.
 */
export interface RdsInstanceFreeStorageSpaceAlarmProps extends RdsInstanceAlarmProps, RdsFreeStorageSpaceAlarmConfig {}

/**
 * An alarm that monitors the amount of available storage space for an Aurora instance.
 *
 * This alarm helps prevent storage full issues. This can prevent downtime that occurs when your database
 * instance runs out of storage.
 *
 * The alarm is triggered when the amount of available storage space (bytes) is less than threshold.
 */
export class RdsInstanceFreeStorageSpaceAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: RdsInstanceFreeStorageSpaceAlarmProps) {
    const instanceIdentifier = props.instanceIdentifier ? props.instanceIdentifier : props.databaseInstance?.instanceIdentifier;
    const alarmName = props.alarmName ?? `${instanceIdentifier} - ${RdsRecommendedAlarmsMetrics.INSTANCE_FREE_STORAGE_SPACE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm helps prevent storage full issues. This can prevent downtime'
      + ' that occurs when your database instance runs out of storage. We do not recommend using this alarm if you have storage'
      + ' auto scaling enabled, or if you frequently change the storage capacity of the database instance.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);
    validateInstanceIdentifier(props);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: RdsRecommendedAlarmsMetrics.INSTANCE_FREE_STORAGE_SPACE,
        dimensionsMap: {
          DBInstanceIdentifier: instanceIdentifier!,
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
 * Configuration for the ReadLatency alarm.
 */
export interface RdsReadLatencyAlarmConfig extends RdsAlarmBaseConfig {
  /**
   * The value in milliseconds against which the specified statistic is compared.
   * The recommended threshold value for this alarm is highly dependent on your use case.
   * Read latencies higher than 20 milliseconds are likely a cause for investigation.
   * You can also set a higher threshold if your application can have higher latency for
   * read operations. Review the criticality and requirements of read latency and analyze
   * the historical behavior of this metric to determine sensible threshold levels.
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
   * @default - database.instanceIdentifiers[*] + ' - ReadLatency'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high read latency. Database disks normally
   * have a low read/write latency, but they can have issues that can cause high latency
   * operations.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the RdsInstanceReadLatencyAlarm construct.
 */
export interface RdsInstanceReadLatencyAlarmProps extends RdsInstanceAlarmProps, RdsReadLatencyAlarmConfig {}

/**
 * An alarm that monitors the average amount of time taken per disk read I/O operation.
 *
 * This alarm is used to detect high read latency. Database disks normally have a low read/write latency,
 * but they can have issues that can cause high latency operations.
 *
 * The alarm is triggered when the average amount of time per disk read operation (in milliseconds) is
 * greater than threshold.
 */
export class RdsInstanceReadLatencyAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: RdsInstanceReadLatencyAlarmProps) {
    const instanceIdentifier = props.instanceIdentifier ? props.instanceIdentifier : props.databaseInstance?.instanceIdentifier;
    const alarmName = props.alarmName ?? `${instanceIdentifier} - ${RdsRecommendedAlarmsMetrics.INSTANCE_READ_LATENCY}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm helps to monitor high read latency. Database disks'
      + ' normally have a low read/write latency, but they can have issues that can cause high latency operations.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);
    validateInstanceIdentifier(props);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: RdsRecommendedAlarmsMetrics.INSTANCE_READ_LATENCY,
        dimensionsMap: {
          DBInstanceIdentifier: instanceIdentifier!,
        },
        statistic: 'p90',
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
}

/**
 * Configuration for the WriteLatency alarm.
 */
export interface RdsWriteLatencyAlarmConfig extends RdsAlarmBaseConfig {
  /**
   * The value in milliseconds against which the specified statistic is compared.
   * The recommended threshold value for this alarm is highly dependent on your use case.
   * Write latencies higher than 20 milliseconds are likely a cause for investigation.
   * You can also set a higher threshold if your application can have a higher latency
   * for write operations. Review the criticality and requirements of write latency and
   * analyze the historical behavior of this metric to determine sensible threshold levels.
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
   * @default - database.instanceIdentifiers[*] + ' - WriteLatency'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high write latency. Although database disks
   * typically have low read/write latency, they may experience problems that cause high
   * latency operations. Monitoring this will assure you the disk latency is as low as expected.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the RdsInstanceWriteLatencyAlarm construct.
 */
export interface RdsInstanceWriteLatencyAlarmProps extends RdsInstanceAlarmProps, RdsWriteLatencyAlarmConfig {}

/**
 * An alarm that monitors the average amount of time taken per disk write I/O operation.
 *
 * This alarm is used to detect high write latency. Database disks normally have a low read/write latency,
 * but they can have issues that can cause high latency operations.
 *
 * The alarm is triggered when the average amount of time per disk write operation (in milliseconds) is
 * greater than threshold.
 */
export class RdsInstanceWriteLatencyAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: RdsInstanceWriteLatencyAlarmProps) {
    const instanceIdentifier = props.instanceIdentifier ? props.instanceIdentifier : props.databaseInstance?.instanceIdentifier;
    const alarmName = props.alarmName ?? `${instanceIdentifier} - ${RdsRecommendedAlarmsMetrics.INSTANCE_WRITE_LATENCY}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm helps to monitor high write latency.'
        + ' Although database disks typically have low read/write latency, they may experience problems'
        + ' that cause high latency operations. Monitoring this will assure you the disk latency is as low as expected.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);
    validateInstanceIdentifier(props);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: RdsRecommendedAlarmsMetrics.INSTANCE_WRITE_LATENCY,
        dimensionsMap: {
          DBInstanceIdentifier: instanceIdentifier!,
        },
        statistic: 'p90',
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
}

/**
 * Configuration for the DbLoad alarm.
 */
export interface RdsDbLoadAlarmConfig extends RdsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   * The maximum vCPU value is determined by the number of vCPU (virtual CPU) cores
   * for your DB instance. Depending on the maximum vCPU, different values for the
   * threshold can be appropriate. Ideally, DB load should not go above vCPU line.
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
   * @default - database.instanceIdentifiers[*] + ' - DBLoad'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect a high DB load. High DB load can cause
   * performance issues in the DB instance. This alarm is not applicable to serverless
   * DB instances.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the RdsInstanceDbLoadAlarm construct.
 */
export interface RdsInstanceDbLoadAlarmProps extends RdsInstanceAlarmProps, RdsDbLoadAlarmConfig {}

/**
 * An alarm that monitors the number of concurrent active sessions on the database.
 *
 * This alarm helps to monitor high DB load. If the number of processes exceed the number of vCPUs,
 * the processes start queuing. When the queuing increases, the performance is impacted.
 *
 * The alarm is triggered when the number of active sessions for the database is
 * greater than threshold.
 */
export class RdsInstanceDbLoadAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: RdsInstanceDbLoadAlarmProps) {
    const instanceIdentifier = props.instanceIdentifier ? props.instanceIdentifier : props.databaseInstance?.instanceIdentifier;
    const alarmName = props.alarmName ?? `${instanceIdentifier} - ${RdsRecommendedAlarmsMetrics.INSTANCE_DB_LOAD}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    const datapointsToAlarm = props.datapointsToAlarm ?? 15;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect a high DB load. High DB load'
      + ' can cause performance issues in the DB instance. This alarm is not applicable to serverless DB instances.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);
    validateInstanceIdentifier(props);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: RdsRecommendedAlarmsMetrics.INSTANCE_DB_LOAD,
        dimensionsMap: {
          DBInstanceIdentifier: instanceIdentifier!,
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
}

/**
 * Configuration for the AuroraVolumeBytesLeftTotal alarm.
 */
export interface RdsAuroraVolumeBytesLeftTotalAlarmConfig extends RdsAlarmBaseConfig {
  /**
   * The value in bytes against which the specified statistic is compared.
   * You should calculate 10%-20% of the actual size limit based on velocity and
   * trend of volume usage increase, and then use that result as the threshold value
   * to proactively take action before the volume reaches its limit.
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
   * @default - database.instanceIdentifiers[*] + ' - AuroraVolumeBytesLeftTotal'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect how close the Aurora cluster is to the volume
   * size limit. This alarm can prevent an out-of-space error that occurs when your cluster
   * runs out of space. This alarm is recommended only for Aurora MySQL.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the RdsAuroraVolumeBytesLeftTotal construct.
 */
export interface RdsAuroraVolumeBytesLeftTotalAlarmProps extends RdsAuroraVolumeBytesLeftTotalAlarmConfig {
  /**
   * The database cluster to monitor.
   */
  readonly databaseCluster: rds.IDatabaseCluster;
}

/**
 * An alarm that monitors the remaining available space (in bytes) for the cluster volume.
 *
 * This alarm is used to detect how close the Aurora cluster is to the volume size limit. This
 * alarm can prevent an out-of-space error that occurs when your cluster runs out of space.
 *
 * The alarm is triggered when the remaining available space (in bytes) is less than threshold.
 */
export class RdsAuroraVolumeBytesLeftTotalAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: RdsAuroraVolumeBytesLeftTotalAlarmProps) {
    const alarmName = props.alarmName ?? `${props.databaseCluster.clusterIdentifier} - ${RdsRecommendedAlarmsMetrics.AURORA_VOLUME_BYTES_LEFT_TOTAL}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 2;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect how close the Aurora'
    + ' cluster is to the volume size limit. This alarm can prevent an out-of-space error that'
    + ' occurs when your cluster runs out of space. This alarm is recommended only for Aurora MySQL.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);
    if (!props.threshold) {
      throw new Error(`The threshold must be specified for ${RdsRecommendedAlarmsMetrics.AURORA_VOLUME_BYTES_LEFT_TOTAL} alarm.`);
    }

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: RdsRecommendedAlarmsMetrics.AURORA_VOLUME_BYTES_LEFT_TOTAL,
        dimensionsMap: {
          DBClusterIdentifier: props.databaseCluster.clusterIdentifier,
        },
        statistic: 'Average',
        period,
      }),
      threshold: threshold!,
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
 * Configuration for the AuroraBinLogReplicationLag alarm.
 */
export interface RdsAuroraBinLogReplicationLagAlarmConfig extends RdsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   * We recommend that you use -1 as the threshold value because Aurora MySQL publishes
   * this value if the replica is in an error state.
   *
   * @default -1
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
   * @default - database.instanceIdentifiers[*] + ' - AuroraBinLogReplicationLag'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect whether the writer instance is in an error
   * state and can’t replicate the source. This alarm is recommended only for Aurora MySQL.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the RdsAuroraBinLogReplicationLag construct.
 */
export interface RdsAuroraBinLogReplicationLagAlarmProps extends RdsAuroraBinLogReplicationLagAlarmConfig {
  /**
   * The database cluster to monitor.
   */
  readonly databaseCluster: rds.IDatabaseCluster;
}

/**
 * An alarm that monitors the error state of Aurora writer instance replication.
 *
 * This alarm is used to detect whether the writer instance is in an error state and can’t replicate the source.
 *
 * The alarm is triggered when the value is less than or equal to threshold.
 */
export class RdsAuroraBinLogReplicationLagAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: RdsAuroraBinLogReplicationLagAlarmProps) {
    const alarmName = props.alarmName ?? `${props.databaseCluster.clusterIdentifier} - ${RdsRecommendedAlarmsMetrics.AURORA_BIN_LOG_REPLICATION_LAG}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 2;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const threshold = props.threshold ?? -1;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect whether the writer instance '
      + 'is in an error state and can\'t replicate the source. This alarm is recommended only for Aurora MySQL.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/RDS',
        metricName: RdsRecommendedAlarmsMetrics.AURORA_BIN_LOG_REPLICATION_LAG,
        dimensionsMap: {
          DBClusterIdentifier: props.databaseCluster.clusterIdentifier,
          Role: 'WRITER',
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
 * Configuration for RDS recommended alarms.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface RdsRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: RdsRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
}

export interface RdsInstanceRecommendedAlarmsConfig extends RdsRecommendedAlarmsConfig {
  /**
   * The configuration for the CpuUtilization alarm.
   */
  readonly configCpuUtilizationAlarm?: RdsCpuUtilizationAlarmConfig;
  /**
   * The configuration for the DatabaseConnections alarm.
   */
  readonly configDatabaseConnectionsAlarm: RdsDatabaseConnectionsAlarmConfig;
  /**
   * The configuration for the FreeableMemory alarm.
   */
  readonly configFreeableMemoryAlarm: RdsFreeableMemoryAlarmConfig;
  /**
   * The configuration for the FreeLocalStorage alarm.
   */
  readonly configFreeLocalStorageAlarm: RdsFreeLocalStorageAlarmConfig;
  /**
   * The configuration for the FreeStorageSpace alarm.
   */
  readonly configFreeStorageSpaceAlarm: RdsFreeStorageSpaceAlarmConfig;
  /**
   * The configuration for the ReadLatency alarm.
   */
  readonly configReadLatencyAlarm: RdsReadLatencyAlarmConfig;
  /**
   * The configuration for the WriteLatency alarm.
   */
  readonly configWriteLatencyAlarm: RdsWriteLatencyAlarmConfig;
  /**
   * The configuration for the DbLoad alarm.
   */
  readonly configDbLoadAlarm: RdsDbLoadAlarmConfig;
}

export interface RdsAuroraRecommendedAlarmsConfig extends RdsInstanceRecommendedAlarmsConfig {
  /**
   * The configuration for the AuroraVolumeBytesLeftTotal alarm.
   */
  readonly configAuroraVolumeBytesLeftTotalAlarm?: RdsAuroraVolumeBytesLeftTotalAlarmConfig;
  /**
   * The configuration for the AuroraBinLogReplicationLag alarm.
   */
  readonly configAuroraBinLogReplicationLagAlarm?: RdsAuroraBinLogReplicationLagAlarmConfig;
}

export interface RdsInstanceRecommendedAlarmsProps extends RdsInstanceRecommendedAlarmsConfig {
  /**
   * The cluster instance identifier to apply the recommended alarms.
   */
  readonly instanceIdentifier?: string;

  /**
   * The cluster instance to apply the recommended alarms.
   */
  readonly databaseInstance?: rds.IDatabaseInstance;
}

export interface RdsAuroraRecommendedAlarmsProps extends RdsAuroraRecommendedAlarmsConfig {
  /**
   * The database cluster to apply the recommended alarms.
   */
  readonly databaseCluster: rds.IDatabaseCluster;
}

/**
 * A construct that creates recommended alarms for an RDS cluster instance.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#RDS
 */
export class RdsInstanceRecommendedAlarms extends Construct {
  /**
   * The CpuUtilization alarm for the database instance.
   */
  public readonly alarmCpuUtilization?: RdsInstanceCpuUtilizationAlarm;

  /**
   * The DatabaseConnections alarm for the database instance.
   */
  public readonly alarmDatabaseConnections?: RdsInstanceDatabaseConnectionsAlarm;

  /**
   * The FreeableMemory alarm for the database instance.
   */
  public readonly alarmFreeableMemory?: RdsInstanceFreeableMemoryAlarm;

  /**
   * The FreeLocalStorage alarm for the database instance.
   */
  public readonly alarmFreeLocalStorage?: RdsInstanceFreeLocalStorageAlarm;

  /**
   * The FreeStorageSpace alarm for the database instance.
   */
  public readonly alarmFreeStorageSpace?: RdsInstanceFreeStorageSpaceAlarm;

  /**
   * The ReadLatency alarm for the database instance.
   */
  public readonly alarmReadLatency?: RdsInstanceReadLatencyAlarm;

  /**
   * The WriteLatency alarm for the database instance.
   */
  public readonly alarmWriteLatency?: RdsInstanceWriteLatencyAlarm;

  /**
   * The DbLoad alarm for the database instance.
   */
  public readonly alarmDbLoad?: RdsInstanceDbLoadAlarm;

  constructor(scope: Construct, id: string, props: RdsInstanceRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(RdsRecommendedAlarmsMetrics.INSTANCE_CPU_UTILIZATION)) {
      this.alarmCpuUtilization = new RdsInstanceCpuUtilizationAlarm(this, 'InstanceCpuUtilizationAlarm', {
        instanceIdentifier: props.instanceIdentifier,
        databaseInstance: props.databaseInstance,
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

    if (!props.excludeAlarms?.includes(RdsRecommendedAlarmsMetrics.INSTANCE_DATABASE_CONNECTIONS)) {
      this.alarmDatabaseConnections = new RdsInstanceDatabaseConnectionsAlarm(this, 'InstanceDatabaseConnectionsAlarm', {
        instanceIdentifier: props.instanceIdentifier,
        databaseInstance: props.databaseInstance,
        ...props.configDatabaseConnectionsAlarm,
      });

      if (props.defaultAlarmAction && !props.configDatabaseConnectionsAlarm.alarmAction) {
        this.alarmDatabaseConnections.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configDatabaseConnectionsAlarm.okAction) {
        this.alarmDatabaseConnections.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configDatabaseConnectionsAlarm.insufficientDataAction) {
        this.alarmDatabaseConnections.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(RdsRecommendedAlarmsMetrics.INSTANCE_FREEABLE_MEMORY)) {
      this.alarmFreeableMemory = new RdsInstanceFreeableMemoryAlarm(this, 'InstanceFreeableMemoryAlarm', {
        instanceIdentifier: props.instanceIdentifier,
        databaseInstance: props.databaseInstance,
        ...props.configFreeableMemoryAlarm,
      });

      if (props.defaultAlarmAction && !props.configFreeableMemoryAlarm.alarmAction) {
        this.alarmFreeableMemory.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configFreeableMemoryAlarm.okAction) {
        this.alarmFreeableMemory.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configFreeableMemoryAlarm.insufficientDataAction) {
        this.alarmFreeableMemory.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(RdsRecommendedAlarmsMetrics.INSTANCE_FREE_LOCAL_STORAGE)) {
      this.alarmFreeLocalStorage = new RdsInstanceFreeLocalStorageAlarm(this, 'InstanceFreeLocalStorageAlarm', {
        instanceIdentifier: props.instanceIdentifier,
        databaseInstance: props.databaseInstance,
        ...props.configFreeLocalStorageAlarm,
      });

      if (props.defaultAlarmAction && !props.configFreeLocalStorageAlarm.alarmAction) {
        this.alarmFreeLocalStorage.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configFreeLocalStorageAlarm.okAction) {
        this.alarmFreeLocalStorage.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configFreeLocalStorageAlarm.insufficientDataAction) {
        this.alarmFreeLocalStorage.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(RdsRecommendedAlarmsMetrics.INSTANCE_FREE_STORAGE_SPACE)) {
      this.alarmFreeStorageSpace = new RdsInstanceFreeStorageSpaceAlarm(this, 'InstanceFreeStorageSpaceAlarm', {
        instanceIdentifier: props.instanceIdentifier,
        databaseInstance: props.databaseInstance,
        ...props.configFreeStorageSpaceAlarm,
      });

      if (props.defaultAlarmAction && !props.configFreeStorageSpaceAlarm.alarmAction) {
        this.alarmFreeStorageSpace.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configFreeStorageSpaceAlarm.okAction) {
        this.alarmFreeStorageSpace.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configFreeStorageSpaceAlarm.insufficientDataAction) {
        this.alarmFreeStorageSpace.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(RdsRecommendedAlarmsMetrics.INSTANCE_READ_LATENCY)) {
      this.alarmReadLatency = new RdsInstanceReadLatencyAlarm(this, 'InstanceReadLatencyAlarm', {
        instanceIdentifier: props.instanceIdentifier,
        databaseInstance: props.databaseInstance,
        ...props.configReadLatencyAlarm,
      });

      if (props.defaultAlarmAction && !props.configReadLatencyAlarm.alarmAction) {
        this.alarmReadLatency.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configReadLatencyAlarm.okAction) {
        this.alarmReadLatency.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configReadLatencyAlarm.insufficientDataAction) {
        this.alarmReadLatency.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(RdsRecommendedAlarmsMetrics.INSTANCE_WRITE_LATENCY)) {
      this.alarmWriteLatency = new RdsInstanceWriteLatencyAlarm(this, 'InstanceWriteLatencyAlarm', {
        instanceIdentifier: props.instanceIdentifier,
        databaseInstance: props.databaseInstance,
        ...props.configWriteLatencyAlarm,
      });

      if (props.defaultAlarmAction && !props.configWriteLatencyAlarm.alarmAction) {
        this.alarmWriteLatency.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configWriteLatencyAlarm.okAction) {
        this.alarmWriteLatency.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configWriteLatencyAlarm.insufficientDataAction) {
        this.alarmWriteLatency.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(RdsRecommendedAlarmsMetrics.INSTANCE_DB_LOAD)) {
      this.alarmDbLoad = new RdsInstanceDbLoadAlarm(this, 'InstanceDbLoadAlarm', {
        instanceIdentifier: props.instanceIdentifier,
        databaseInstance: props.databaseInstance,
        ...props.configDbLoadAlarm,
      });

      if (props.defaultAlarmAction && !props.configDbLoadAlarm.alarmAction) {
        this.alarmDbLoad.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configDbLoadAlarm.okAction) {
        this.alarmDbLoad.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configDbLoadAlarm.insufficientDataAction) {
        this.alarmDbLoad.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * A construct that creates recommended alarms for an RDS cluster.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#RDS
 */
export class RdsAuroraRecommendedAlarms extends Construct {
  /**
   * The AuroraVolumeBytesLeftTotal alarm for the database cluster.
   */
  public readonly alarmAuroraVolumeBytesLeftTotal?: RdsAuroraVolumeBytesLeftTotalAlarm;

  /**
   * The Bin Log Replication lag alarm for the database cluster.
   */
  public readonly alarmAuroraBinLogReplicationLag?: RdsAuroraBinLogReplicationLagAlarm;

  constructor(scope: Construct, id: string, props: RdsAuroraRecommendedAlarmsProps) {
    super(scope, id);

    if (
      !props.excludeAlarms?.includes(RdsRecommendedAlarmsMetrics.AURORA_VOLUME_BYTES_LEFT_TOTAL) &&
      props.databaseCluster.engine?.engineVersion?.fullVersion?.includes('mysql')
    ) {
      this.alarmAuroraVolumeBytesLeftTotal = new RdsAuroraVolumeBytesLeftTotalAlarm(this, 'AuroraVolumeBytesLeftTotalAlarm', {
        databaseCluster: props.databaseCluster,
        ...props.configAuroraVolumeBytesLeftTotalAlarm,
      });

      if (props.defaultAlarmAction && !props.configAuroraVolumeBytesLeftTotalAlarm?.alarmAction) {
        this.alarmAuroraVolumeBytesLeftTotal.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configAuroraVolumeBytesLeftTotalAlarm?.okAction) {
        this.alarmAuroraVolumeBytesLeftTotal.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configAuroraVolumeBytesLeftTotalAlarm?.insufficientDataAction) {
        this.alarmAuroraVolumeBytesLeftTotal.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (
      !props.excludeAlarms?.includes(RdsRecommendedAlarmsMetrics.AURORA_BIN_LOG_REPLICATION_LAG) &&
      props.databaseCluster.engine?.engineVersion?.fullVersion?.includes('mysql')
    ) {
      this.alarmAuroraBinLogReplicationLag = new RdsAuroraBinLogReplicationLagAlarm(this, 'AuroraBinLogReplicationLagAlarm', {
        databaseCluster: props.databaseCluster,
        ...props.configAuroraBinLogReplicationLagAlarm,
      });

      if (props.defaultAlarmAction && !props.configAuroraBinLogReplicationLagAlarm?.alarmAction) {
        this.alarmAuroraBinLogReplicationLag.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configAuroraBinLogReplicationLagAlarm?.okAction) {
        this.alarmAuroraBinLogReplicationLag.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configAuroraBinLogReplicationLagAlarm?.insufficientDataAction) {
        this.alarmAuroraBinLogReplicationLag.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    const instanceIdentifiers = props.databaseCluster.instanceIdentifiers;
    instanceIdentifiers.forEach((instanceIdentifier, index) => {
      new RdsInstanceRecommendedAlarms(this, `RdsInstanceRecommendedAlarmsFromAspect-${index}`, {
        instanceIdentifier,
        ...props,
      });
    });
  }
}

/**
 * An extension of the rds instance (database or cluster instance) construct
 * that provides methods to create recommended alarms
 */
export class DatabaseInstance extends rds.DatabaseInstance {
  constructor(scope: Construct, id: string, props: rds.DatabaseInstanceProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the CpuUtilization.
   */
  public alarmCpuUtilization(props?: RdsCpuUtilizationAlarmConfig): RdsInstanceCpuUtilizationAlarm {
    return new RdsInstanceCpuUtilizationAlarm(this, 'InstanceCpuUtilizationAlarm', {
      databaseInstance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the DatabaseConnections.
   */
  public alarmDatabaseConnections(props: RdsDatabaseConnectionsAlarmConfig): RdsInstanceDatabaseConnectionsAlarm {
    return new RdsInstanceDatabaseConnectionsAlarm(this, 'InstanceDatabaseConnectionsAlarm', {
      databaseInstance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the FreeableMemory.
   */
  public alarmFreeableMemory(props: RdsFreeableMemoryAlarmConfig): RdsInstanceFreeableMemoryAlarm {
    return new RdsInstanceFreeableMemoryAlarm(this, 'InstanceFreeableMemoryAlarm', {
      databaseInstance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the FreeLocalStorage.
   */
  public alarmFreeLocalStorage(props: RdsFreeLocalStorageAlarmConfig): RdsInstanceFreeLocalStorageAlarm {
    return new RdsInstanceFreeLocalStorageAlarm(this, 'InstanceFreeLocalStorageAlarm', {
      databaseInstance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the FreeStorageSpace.
   */
  public alarmFreeStorageSpace(props: RdsFreeStorageSpaceAlarmConfig): RdsInstanceFreeStorageSpaceAlarm {
    return new RdsInstanceFreeStorageSpaceAlarm(this, 'InstanceFreeStorageSpaceAlarm', {
      databaseInstance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the ReadLatency.
   */
  public alarmReadLatency(props: RdsReadLatencyAlarmConfig): RdsInstanceReadLatencyAlarm {
    return new RdsInstanceReadLatencyAlarm(this, 'InstanceReadLatencyAlarm', {
      databaseInstance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the WriteLatency.
   */
  public alarmWriteLatency(props: RdsWriteLatencyAlarmConfig): RdsInstanceWriteLatencyAlarm {
    return new RdsInstanceWriteLatencyAlarm(this, 'InstanceWriteLatencyAlarm', {
      databaseInstance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the DbLoad.
   */
  public alarmDbLoad(props: RdsDbLoadAlarmConfig): RdsInstanceDbLoadAlarm {
    return new RdsInstanceDbLoadAlarm(this, 'InstanceDbLoadAlarm', {
      databaseInstance: this,
      ...props,
    });
  }

  /**
   * Creates recommended alarms for the database cluster.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#RDS
   */
  public applyRecommendedAlarms(props: RdsInstanceRecommendedAlarmsConfig): RdsInstanceRecommendedAlarms {
    return new RdsInstanceRecommendedAlarms(this, 'RdsInstanceRecommendedAlarms', {
      databaseInstance: this,
      ...props,
    });
  }
}

/**
 * An extension of the database cluster construct
 * that provides methods to create recommended alarms
 */
export class DatabaseCluster extends rds.DatabaseCluster {
  constructor(scope: Construct, id: string, props: rds.DatabaseClusterProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the AuroraVolumeBytesLeftTotal.
   */
  public alarmAuroraVolumeBytesLeftTotal(props: RdsAuroraVolumeBytesLeftTotalAlarmConfig): RdsAuroraVolumeBytesLeftTotalAlarm {
    return new RdsAuroraVolumeBytesLeftTotalAlarm(this, 'AuroraVolumeBytesLeftTotalAlarm', {
      databaseCluster: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the Bin Log Replication lag.
   */
  public alarmAuroraBinLogReplicationLag(props?: RdsAuroraBinLogReplicationLagAlarmConfig): RdsAuroraBinLogReplicationLagAlarm {
    return new RdsAuroraBinLogReplicationLagAlarm(this, 'AuroraBinLogReplicationLagAlarm', {
      databaseCluster: this,
      ...props,
    });
  }

  /**
   * Creates recommended alarms for the database cluster.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#RDS
   */
  public applyRecommendedAlarms(props: RdsAuroraRecommendedAlarmsConfig): RdsAuroraRecommendedAlarms {
    return new RdsAuroraRecommendedAlarms(this, 'RdsAuroraRecommendedAlarms', {
      databaseCluster: this,
      ...props,
    });
  }
}

/**
 * An aspect that applies recommended alarms for RDS database instances.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#RDS
 */
export class RdsInstanceRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: RdsInstanceRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof rds.DatabaseInstance) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const databaseInstance = node as rds.IDatabaseInstance;

        new RdsInstanceRecommendedAlarms(node, 'RdsInstanceRecommendedAlarmsFromAspect', {
          databaseInstance,
          ...this.props,
        });
      }
    }
  }
}

/**
 * An aspect that applies recommended alarms for RDS clusters.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#RDS
 */
export class RdsAuroraRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: RdsAuroraRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof rds.DatabaseCluster) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const databaseCluster = node as rds.IDatabaseCluster;

        new RdsAuroraRecommendedAlarms(node, 'RdsAuroraRecommendedAlarmsFromAspect', {
          databaseCluster,
          ...this.props,
        });
      }
    }
  }
}
