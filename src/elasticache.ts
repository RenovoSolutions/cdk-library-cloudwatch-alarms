import {
  IAspect,
  aws_elasticache as elasticache,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for ElastiCache alarms.
 */
export enum ElastiCacheRecommendedAlarmsMetrics {
  /**
   * Percentage of the memory for the cluster that is in use.
   */
  DATABASE_MEMORY_USAGE_PERCENTAGE = 'DatabaseMemoryUsagePercentage',
  /**
   * Provides CPU utilization of the Valkey or Redis OSS engine thread. Because Valkey and Redis OSS are single-threaded,
   * you can use this metric to analyze the load of the process itself. The `EngineCPUUtilization` metric provides a more
   * precise visibility of the process. You can use it in conjunction with the `CPUUtilization` metric. `CPUUtilization`
   * exposes CPU utilization for the server instance as a whole, including other operating system and management processes.
   * For larger node types with four vCPUs or more, use the EngineCPUUtilization metric to monitor and set thresholds for scaling.
   */
  ENGINE_CPU_UTILIZATION = 'EngineCPUUtilization',
  /**
   * It represents how far behind, in seconds, the replica is in applying changes from the primary node. For Valkey 7.2 and onwards,
   * and Redis OSS engine version 5.0.6 onwards, the lag can be measured in milliseconds.
   */
  REPLICATION_LAG = 'ReplicationLag',
}

/**
 * The common optional configuration for the alarms.
 */
export interface ElastiCacheAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the ElastiCache CfnCacheCluster alarms.
 */
export interface ElastiCacheClusterAlarmProps {
  /**
   * The ElastiCache CfnCacheCluster to monitor.
   */
  readonly cacheCluster: elasticache.CfnCacheCluster;
}

/**
 * The common properties for the ElastiCache CfnReplicationGroup alarms.
 */
export interface ElastiCacheReplicationGroupAlarmProps {
  /**
   * The ElastiCache CfnReplicationGroup to monitor.
   */
  readonly cacheReplicationGroup: elasticache.CfnReplicationGroup;
}

/**
 * Configuration for the DatabaseMemoryUsagePercentage alarm.
 */
export interface ElastiCacheDatabaseMemoryUsagePercentageAlarmConfig extends ElastiCacheAlarmBaseConfig {
  /**
   * Depending on your application's memory requirements and the memory capacity of your ElastiCache cluster,
   * you should set the threshold to the percentage that reflects the critical level of memory usage of the cluster.
   * You can use historical memory usage data as reference for acceptable memory usage threshold.
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
   * @default - logicalId + ' - DatabaseMemoryUsagePercentage'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high memory utilization of your cluster so that you can avoid failures when writing to
   * your cluster. It is useful to know when you will need to scale up your cluster if your application does not expect to experience
   * evictions.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ElastiCacheClusterDatabaseMemoryUsagePercentageAlarm construct.
 */
export interface ElastiCacheClusterDatabaseMemoryUsagePercentageAlarmProps extends
  ElastiCacheClusterAlarmProps,
  ElastiCacheDatabaseMemoryUsagePercentageAlarmConfig {}

/**
 * This alarm helps you monitor the memory utilization of your cluster.
 *
 * When your DatabaseMemoryUsagePercentage reaches 100%, the Redis OSS maxmemory policy is triggered and evictions might occur
 * based on the policy selected. If no object in the cache matches the eviction policy, write operations fail. Some workloads
 * expect or rely on evictions, but if not, you will need to increase the memory capacity of your cluster. You can scale your
 * cluster out by adding more primary nodes, or scale it up by using a larger node type.
 * Refer to {@link https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Scaling.html|Scaling ElastiCache for Redis OSS clusters} for details.
 *
 * The alarm is triggered when the percentage exceeds % threshold.
 */
export class ElastiCacheClusterDatabaseMemoryUsagePercentageAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ElastiCacheClusterDatabaseMemoryUsagePercentageAlarmProps) {
    const alarmName = props.alarmName ?? `${props.cacheCluster.clusterName || props.cacheCluster.logicalId} - ${ElastiCacheRecommendedAlarmsMetrics.DATABASE_MEMORY_USAGE_PERCENTAGE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high memory utilization of your cluster so that you'
      + ' can avoid failures when writing to your cluster. It is useful to know when you will need to scale up your cluster if your application'
      + ' does not expect to experience evictions.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ElastiCache',
        metricName: ElastiCacheRecommendedAlarmsMetrics.DATABASE_MEMORY_USAGE_PERCENTAGE,
        dimensionsMap: {
          CacheClusterId: props.cacheCluster.clusterName || props.cacheCluster.logicalId,
        },
        period,
        statistic: 'Average',
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
 * The properties for the ElastiCacheReplicationGroupDatabaseMemoryUsagePercentageAlarm construct.
 */
export interface ElastiCacheReplicationGroupDatabaseMemoryUsagePercentageAlarmProps extends
  ElastiCacheReplicationGroupAlarmProps,
  ElastiCacheDatabaseMemoryUsagePercentageAlarmConfig {}

/**
 * This alarm helps you monitor the memory utilization of your cluster.
 *
 * When your DatabaseMemoryUsagePercentage reaches 100%, the Redis OSS maxmemory policy is triggered and evictions might occur
 * based on the policy selected. If no object in the cache matches the eviction policy, write operations fail. Some workloads
 * expect or rely on evictions, but if not, you will need to increase the memory capacity of your cluster. You can scale your
 * cluster out by adding more primary nodes, or scale it up by using a larger node type.
 * Refer to {@link https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Scaling.html|Scaling ElastiCache for Redis OSS clusters} for details.
 *
 * The alarm is triggered when the percentage exceeds % threshold.
 */
export class ElastiCacheReplicationGroupDatabaseMemoryUsagePercentageAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ElastiCacheReplicationGroupDatabaseMemoryUsagePercentageAlarmProps) {
    const alarmName = props.alarmName ?? `${props.cacheReplicationGroup.replicationGroupId || props.cacheReplicationGroup.logicalId} - ${ElastiCacheRecommendedAlarmsMetrics.DATABASE_MEMORY_USAGE_PERCENTAGE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high memory utilization of your cluster so that you'
      + ' can avoid failures when writing to your cluster. It is useful to know when you will need to scale up your cluster if your application'
      + ' does not expect to experience evictions.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ElastiCache',
        metricName: ElastiCacheRecommendedAlarmsMetrics.DATABASE_MEMORY_USAGE_PERCENTAGE,
        dimensionsMap: {
          CacheClusterId: props.cacheReplicationGroup.replicationGroupId || props.cacheReplicationGroup.logicalId,
        },
        period,
        statistic: 'Average',
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
 * Configuration for the EngineCpuUtilization alarm.
 */
export interface ElastiCacheEngineCpuUtilizationAlarmConfig extends ElastiCacheAlarmBaseConfig {
  /**
   * Set the threshold to a percentage that reflects the critical engine CPU utilization level for your application.
   * You can benchmark your cluster using your application and expected workload to correlate EngineCPUUtilization and
   * performance as a reference, and then set the threshold accordingly. In most cases, you can set the threshold to
   * about 90% of your available CPU.
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
   * @default - logicalId + ' - EngineCPUUtilization'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high CPU utilization of the Redis OSS engine thread. It is useful if you want
   * to monitor the CPU usage of the database engine itself.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ElastiCacheClusterEngineCpuUtilizationAlarm construct.
 */
export interface ElastiCacheClusterEngineCpuUtilizationAlarmProps extends
  ElastiCacheClusterAlarmProps,
  ElastiCacheEngineCpuUtilizationAlarmConfig {}

/**
 * This alarm helps to monitor the CPU utilization of a Redis OSS engine thread within the ElastiCache instance.
 *
 * Common reasons for high engine CPU are long-running commands that consume high CPU, a high number of requests, an increase of new
 * client connection requests in a short time period, and high evictions when the cache doesn't have enough memory to hold new data.
 * You should consider {@link https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Scaling.html|Scaling ElastiCache for Redis OSS clusters}
 * by adding more nodes or scaling up your instance type.
 *
 * The alarm is triggered when the percentage exceeds the threshold.
 */
export class ElastiCacheClusterEngineCpuUtilizationAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ElastiCacheClusterEngineCpuUtilizationAlarmProps) {
    const alarmName = props.alarmName ?? `${props.cacheCluster.clusterName || props.cacheCluster.logicalId} - ${ElastiCacheRecommendedAlarmsMetrics.ENGINE_CPU_UTILIZATION}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 90;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high CPU utilization of the Redis OSS engine thread.'
      + ' It is useful if you want to monitor the CPU usage of the database engine itself.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ElastiCache',
        metricName: ElastiCacheRecommendedAlarmsMetrics.ENGINE_CPU_UTILIZATION,
        dimensionsMap: {
          CacheClusterId: props.cacheCluster.clusterName || props.cacheCluster.logicalId,
        },
        period,
        statistic: 'Average',
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
 * The properties for the ElastiCacheReplicationGroupEngineCpuUtilizationAlarm construct.
 */
export interface ElastiCacheReplicationGroupEngineCpuUtilizationAlarmProps extends
  ElastiCacheReplicationGroupAlarmProps,
  ElastiCacheEngineCpuUtilizationAlarmConfig {}

/**
 * This alarm helps to monitor the CPU utilization of a Redis OSS engine thread within the ElastiCache instance.
 *
 * Common reasons for high engine CPU are long-running commands that consume high CPU, a high number of requests, an increase of new
 * client connection requests in a short time period, and high evictions when the cache doesn't have enough memory to hold new data.
 * You should consider {@link https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Scaling.html|Scaling ElastiCache for Redis OSS clusters}
 * by adding more nodes or scaling up your instance type.
 *
 * The alarm is triggered when the percentage exceeds the threshold.
 */
export class ElastiCacheReplicationGroupEngineCpuUtilizationAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ElastiCacheReplicationGroupEngineCpuUtilizationAlarmProps) {
    const alarmName = props.alarmName ?? `${props.cacheReplicationGroup.replicationGroupId || props.cacheReplicationGroup.logicalId} - ${ElastiCacheRecommendedAlarmsMetrics.ENGINE_CPU_UTILIZATION}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 90;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high CPU utilization of the Redis OSS engine thread.'
      + ' It is useful if you want to monitor the CPU usage of the database engine itself.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ElastiCache',
        metricName: ElastiCacheRecommendedAlarmsMetrics.ENGINE_CPU_UTILIZATION,
        dimensionsMap: {
          CacheClusterId: props.cacheReplicationGroup.replicationGroupId || props.cacheReplicationGroup.logicalId,
        },
        period,
        statistic: 'Average',
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
 * Configuration for the ReplicationLag alarm.
 */
export interface ElastiCacheReplicationLagAlarmConfig extends ElastiCacheAlarmBaseConfig {
  /**
   * Set the threshold according to your application's requirements and the potential impact of replication lag. You should
   * consider your application's expected write rates and network conditions for the acceptable replication lag.
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
   * @default - logicalId + ' - ReplicationLag'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect a delay between data updates on the primary node and their synchronization to replica node.
   * It helps to ensure data consistency of a read replica cluster node.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ElastiCacheClusterReplicationLagAlarm construct.
 */
export interface ElastiCacheClusterReplicationLagAlarmProps extends
  ElastiCacheClusterAlarmProps,
  ElastiCacheReplicationLagAlarmConfig {}

/**
 * This alarm helps to monitor the replication health of your ElastiCache cluster.
 *
 * A high replication lag means that the primary node or the replica can't keep up the pace of the replication. If your write
 * activity is too high, consider scaling your cluster out by adding more primary nodes, or scaling it up by using a larger node type.
 * Refer to {@link https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Scaling.html|Scaling ElastiCache for Redis OSS clusters} for
 * details. If your read replicas are overloaded by the amount of read requests,
 * consider adding more read replicas.
 *
 * The alarm is triggered when the number of milliseconds exceeds the threshold.
 */
export class ElastiCacheClusterReplicationLagAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ElastiCacheClusterReplicationLagAlarmProps) {
    const alarmName = props.alarmName ?? `${props.cacheCluster.clusterName || props.cacheCluster.logicalId} - ${ElastiCacheRecommendedAlarmsMetrics.REPLICATION_LAG}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    const datapointsToAlarm = props.datapointsToAlarm ?? 15;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect a delay between data updates on the primary node'
      + ' and their synchronization to replica node. It helps to ensure data consistency of a read replica cluster node.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ElastiCache',
        metricName: ElastiCacheRecommendedAlarmsMetrics.REPLICATION_LAG,
        dimensionsMap: {
          CacheClusterId: props.cacheCluster.clusterName || props.cacheCluster.logicalId,
        },
        period,
        statistic: 'Average',
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
 * The properties for the ElastiCacheReplicationGroupReplicationLagAlarm construct.
 */
export interface ElastiCacheReplicationGroupReplicationLagAlarmProps extends
  ElastiCacheReplicationGroupAlarmProps,
  ElastiCacheReplicationLagAlarmConfig {}

/**
 * This alarm helps to monitor the replication health of your ElastiCache cluster.
 *
 * A high replication lag means that the primary node or the replica can't keep up the pace of the replication. If your write
 * activity is too high, consider scaling your cluster out by adding more primary nodes, or scaling it up by using a larger node type.
 * Refer to {@link https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Scaling.html|Scaling ElastiCache for Redis OSS clusters} for
 * details. If your read replicas are overloaded by the amount of read requests,
 * consider adding more read replicas.
 *
 * The alarm is triggered when the number of milliseconds exceeds the threshold.
 */
export class ElastiCacheReplicationGroupReplicationLagAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ElastiCacheReplicationGroupReplicationLagAlarmProps) {
    const alarmName = props.alarmName ?? `${props.cacheReplicationGroup.replicationGroupId || props.cacheReplicationGroup.logicalId} - ${ElastiCacheRecommendedAlarmsMetrics.REPLICATION_LAG}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    const datapointsToAlarm = props.datapointsToAlarm ?? 15;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect a delay between data updates on the primary node'
      + ' and their synchronization to replica node. It helps to ensure data consistency of a read replica cluster node.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ElastiCache',
        metricName: ElastiCacheRecommendedAlarmsMetrics.REPLICATION_LAG,
        dimensionsMap: {
          CacheClusterId: props.cacheReplicationGroup.replicationGroupId || props.cacheReplicationGroup.logicalId,
        },
        period,
        statistic: 'Average',
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
 * Configurations for the recommended alarms for an ElastiCache Service.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface ElastiCacheClusterRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: ElastiCacheRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the DatabaseMemoryUsagePercentage alarm.
   */
  readonly configDatabaseMemoryUsagePercentageAlarm: ElastiCacheDatabaseMemoryUsagePercentageAlarmConfig;
  /**
   * The configuration for the EngineCpuUtilization alarm.
   */
  readonly configEngineCpuUtilizationAlarm?: ElastiCacheEngineCpuUtilizationAlarmConfig;
  /**
   * The configuration for the ReplicationLag alarm.
   */
  readonly configReplicationLagAlarm: ElastiCacheReplicationLagAlarmConfig;
}

/**
 * Properties for the ElastiCacheClusterRecommendedAlarms construct.
 */
export interface ElastiCacheClusterRecommendedAlarmsProps extends ElastiCacheClusterRecommendedAlarmsConfig {
  /**
   * The ElastiCache CfnCacheCluster to monitor.
   */
  readonly cacheCluster: elasticache.CfnCacheCluster;
}

/**
 * A construct that creates the recommended alarms for an ElastiCache CfnCacheCluster.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ElastiCache
 */
export class ElastiCacheClusterRecommendedAlarms extends Construct {
  /**
   * The DatabaseMemoryUsagePercentage alarm.
   */
  public readonly alarmDatabaseMemoryUsagePercentage?: ElastiCacheClusterDatabaseMemoryUsagePercentageAlarm;

  /**
   * The EngineCpuUtilization alarm.
   */
  public readonly alarmEngineCpuUtilization?: ElastiCacheClusterEngineCpuUtilizationAlarm;

  /**
   * The ReplicationLag alarm.
   */
  public readonly alarmReplicationLag?: ElastiCacheClusterReplicationLagAlarm;

  constructor(scope: Construct, id: string, props: ElastiCacheClusterRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(ElastiCacheRecommendedAlarmsMetrics.DATABASE_MEMORY_USAGE_PERCENTAGE)) {
      this.alarmDatabaseMemoryUsagePercentage = new ElastiCacheClusterDatabaseMemoryUsagePercentageAlarm(this, `${props.cacheCluster.node.id}_DatabaseMemoryUsagePercentage`, {
        cacheCluster: props.cacheCluster,
        ...props.configDatabaseMemoryUsagePercentageAlarm,
      });

      if (props.defaultAlarmAction && !props.configDatabaseMemoryUsagePercentageAlarm.alarmAction) {
        this.alarmDatabaseMemoryUsagePercentage.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configDatabaseMemoryUsagePercentageAlarm.okAction) {
        this.alarmDatabaseMemoryUsagePercentage.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configDatabaseMemoryUsagePercentageAlarm.insufficientDataAction) {
        this.alarmDatabaseMemoryUsagePercentage.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ElastiCacheRecommendedAlarmsMetrics.ENGINE_CPU_UTILIZATION)) {
      this.alarmEngineCpuUtilization = new ElastiCacheClusterEngineCpuUtilizationAlarm(this, `${props.cacheCluster.node.id}_EngineCPUUtilization`, {
        cacheCluster: props.cacheCluster,
        ...props.configEngineCpuUtilizationAlarm,
      });

      if (props.defaultAlarmAction && (!props.configEngineCpuUtilizationAlarm || !props.configEngineCpuUtilizationAlarm.alarmAction)) {
        this.alarmEngineCpuUtilization.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && (!props.configEngineCpuUtilizationAlarm || !props.configEngineCpuUtilizationAlarm.okAction)) {
        this.alarmEngineCpuUtilization.addOkAction(props.defaultOkAction);
      }

      if (
        props.defaultInsufficientDataAction &&
        (!props.configEngineCpuUtilizationAlarm || !props.configEngineCpuUtilizationAlarm.insufficientDataAction)
      ) {
        this.alarmEngineCpuUtilization.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ElastiCacheRecommendedAlarmsMetrics.REPLICATION_LAG)) {
      this.alarmReplicationLag = new ElastiCacheClusterReplicationLagAlarm(this, `${props.cacheCluster.node.id}_ReplicationLag`, {
        cacheCluster: props.cacheCluster,
        ...props.configReplicationLagAlarm,
      });

      if (props.defaultAlarmAction && !props.configReplicationLagAlarm.alarmAction) {
        this.alarmReplicationLag.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configReplicationLagAlarm.okAction) {
        this.alarmReplicationLag.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configReplicationLagAlarm.insufficientDataAction) {
        this.alarmReplicationLag.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * Configurations for the recommended alarms for an ElastiCache ReplicationGroup.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface ElastiCacheReplicationGroupRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: ElastiCacheRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the DatabaseMemoryUsagePercentage alarm.
   */
  readonly configDatabaseMemoryUsagePercentageAlarm: ElastiCacheDatabaseMemoryUsagePercentageAlarmConfig;
  /**
   * The configuration for the EngineCPUUtilization alarm.
   */
  readonly configEngineCpuUtilizationAlarm?: ElastiCacheEngineCpuUtilizationAlarmConfig;
  /**
   * The configuration for the ReplicationLag alarm.
   */
  readonly configReplicationLagAlarm: ElastiCacheReplicationLagAlarmConfig;
}

/**
 * Properties for the ElastiCacheReplicationGroupRecommendedAlarms construct.
 */
export interface ElastiCacheReplicationGroupRecommendedAlarmsProps extends ElastiCacheReplicationGroupRecommendedAlarmsConfig {
  /**
   * The ElastiCache CfnReplicationGroup to monitor.
   */
  readonly cacheReplicationGroup: elasticache.CfnReplicationGroup;
}

/**
 * A construct that creates the recommended alarms for an ElastiCache CfnReplicationGroup.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ElastiCache
 */
export class ElastiCacheReplicationGroupRecommendedAlarms extends Construct {
  /**
   * The DatabaseMemoryUsagePercentage alarm.
   */
  public readonly alarmDatabaseMemoryUsagePercentage?: ElastiCacheReplicationGroupDatabaseMemoryUsagePercentageAlarm;

  /**
   * The EngineCpuUtilization alarm.
   */
  public readonly alarmEngineCpuUtilization?: ElastiCacheReplicationGroupEngineCpuUtilizationAlarm;

  /**
   * The ReplicationLag alarm.
   */
  public readonly alarmReplicationLag?: ElastiCacheReplicationGroupReplicationLagAlarm;

  constructor(scope: Construct, id: string, props: ElastiCacheReplicationGroupRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(ElastiCacheRecommendedAlarmsMetrics.DATABASE_MEMORY_USAGE_PERCENTAGE)) {
      this.alarmDatabaseMemoryUsagePercentage = new ElastiCacheReplicationGroupDatabaseMemoryUsagePercentageAlarm(this, `${props.cacheReplicationGroup.node.id}_DatabaseMemoryUsagePercentage`, {
        cacheReplicationGroup: props.cacheReplicationGroup,
        ...props.configDatabaseMemoryUsagePercentageAlarm,
      });

      if (props.defaultAlarmAction && !props.configDatabaseMemoryUsagePercentageAlarm.alarmAction) {
        this.alarmDatabaseMemoryUsagePercentage.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configDatabaseMemoryUsagePercentageAlarm.okAction) {
        this.alarmDatabaseMemoryUsagePercentage.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configDatabaseMemoryUsagePercentageAlarm.insufficientDataAction) {
        this.alarmDatabaseMemoryUsagePercentage.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ElastiCacheRecommendedAlarmsMetrics.ENGINE_CPU_UTILIZATION)) {
      this.alarmEngineCpuUtilization = new ElastiCacheReplicationGroupEngineCpuUtilizationAlarm(this, `${props.cacheReplicationGroup.node.id}_EngineCPUUtilization`, {
        cacheReplicationGroup: props.cacheReplicationGroup,
        ...props.configEngineCpuUtilizationAlarm,
      });

      if (props.defaultAlarmAction && (!props.configEngineCpuUtilizationAlarm || !props.configEngineCpuUtilizationAlarm.alarmAction)) {
        this.alarmEngineCpuUtilization.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && (!props.configEngineCpuUtilizationAlarm || !props.configEngineCpuUtilizationAlarm.okAction)) {
        this.alarmEngineCpuUtilization.addOkAction(props.defaultOkAction);
      }

      if (
        props.defaultInsufficientDataAction &&
        (!props.configEngineCpuUtilizationAlarm || !props.configEngineCpuUtilizationAlarm.insufficientDataAction)
      ) {
        this.alarmEngineCpuUtilization.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ElastiCacheRecommendedAlarmsMetrics.REPLICATION_LAG)) {
      this.alarmReplicationLag = new ElastiCacheReplicationGroupReplicationLagAlarm(this, `${props.cacheReplicationGroup.node.id}_ReplicationLag`, {
        cacheReplicationGroup: props.cacheReplicationGroup,
        ...props.configReplicationLagAlarm,
      });

      if (props.defaultAlarmAction && !props.configReplicationLagAlarm.alarmAction) {
        this.alarmReplicationLag.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configReplicationLagAlarm.okAction) {
        this.alarmReplicationLag.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configReplicationLagAlarm.insufficientDataAction) {
        this.alarmReplicationLag.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

// ----
/**
 * An extension for the CfnCacheCluster construct that provides methods
 * to create recommended alarms.
 */
export class CfnCacheCluster extends elasticache.CfnCacheCluster {
  constructor(scope: Construct, id: string, props: elasticache.CfnCacheClusterProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the DatabaseMemoryUsagePercentage for the ElastiCache cacheCluster.
   */
  public alarmDatabaseMemoryUsagePercentage(
    props: ElastiCacheDatabaseMemoryUsagePercentageAlarmConfig): ElastiCacheClusterDatabaseMemoryUsagePercentageAlarm {
    return new ElastiCacheClusterDatabaseMemoryUsagePercentageAlarm(this, 'DatabaseMemoryUsagePercentageAlarm', {
      cacheCluster: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the EngineCpuUtilization for the ElastiCache cacheCluster.
   */
  public alarmEngineCpuUtilization(props?: ElastiCacheEngineCpuUtilizationAlarmConfig): ElastiCacheClusterEngineCpuUtilizationAlarm {
    return new ElastiCacheClusterEngineCpuUtilizationAlarm(this, 'EngineCpuUtilizationAlarm', {
      cacheCluster: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the ReplicationLag for the ElastiCache cacheCluster.
   */
  public alarmReplicationLag(
    props: ElastiCacheReplicationLagAlarmConfig): ElastiCacheClusterReplicationLagAlarm {
    return new ElastiCacheClusterReplicationLagAlarm(this, 'ReplicationLagAlarm', {
      cacheCluster: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the ElastiCache CfnCacheCluster.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ElastiCache
   */
  public applyRecommendedAlarms(props: ElastiCacheClusterRecommendedAlarmsConfig): ElastiCacheClusterRecommendedAlarms {
    return new ElastiCacheClusterRecommendedAlarms(this, 'ElastiCacheClusterRecommendedAlarms', {
      cacheCluster: this,
      ...props,
    });
  }
}

/**
 * An extension for the CfnReplicationGroup construct that provides methods
 * to create recommended alarms.
 */
export class CfnReplicationGroup extends elasticache.CfnReplicationGroup {
  constructor(scope: Construct, id: string, props: elasticache.CfnReplicationGroupProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the DatabaseMemoryUsagePercentage for the ElastiCache cacheReplicationGroup.
   */
  public alarmDatabaseMemoryUsagePercentage(
    props: ElastiCacheDatabaseMemoryUsagePercentageAlarmConfig): ElastiCacheReplicationGroupDatabaseMemoryUsagePercentageAlarm {
    return new ElastiCacheReplicationGroupDatabaseMemoryUsagePercentageAlarm(this, 'DatabaseMemoryUsagePercentageAlarm', {
      cacheReplicationGroup: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the EngineCpuUtilization for the ElastiCache cacheReplicationGroup.
   */
  public alarmEngineCpuUtilization(props?: ElastiCacheEngineCpuUtilizationAlarmConfig): ElastiCacheReplicationGroupEngineCpuUtilizationAlarm {
    return new ElastiCacheReplicationGroupEngineCpuUtilizationAlarm(this, 'EngineCpuUtilizationAlarm', {
      cacheReplicationGroup: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the ReplicationLag for the ElastiCache cacheReplicationGroup.
   */
  public alarmReplicationLag(
    props: ElastiCacheReplicationLagAlarmConfig): ElastiCacheReplicationGroupReplicationLagAlarm {
    return new ElastiCacheReplicationGroupReplicationLagAlarm(this, 'ReplicationLagAlarm', {
      cacheReplicationGroup: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the ElastiCache CfnReplicationGroup.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ElastiCache
   */
  public applyRecommendedAlarms(props: ElastiCacheReplicationGroupRecommendedAlarmsConfig): ElastiCacheReplicationGroupRecommendedAlarms {
    return new ElastiCacheReplicationGroupRecommendedAlarms(this, 'ElastiCacheReplicationGroupRecommendedAlarms', {
      cacheReplicationGroup: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an ElastiCache CfnCacheCluster
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ElastiCache
 */
export class ElastiCacheClusterRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: ElastiCacheClusterRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof elasticache.CfnCacheCluster) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const cacheCluster = node as elasticache.CfnCacheCluster;

        new ElastiCacheClusterRecommendedAlarms(cacheCluster, 'ElastiCacheClusterRecommendedAlarmsFromAspect', {
          cacheCluster,
          ...this.props,
        });
      }
    }
  }
}

/**
 * Configures the recommended alarms for an ElastiCache CfnReplicationGroup
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ElastiCache
 */
export class ElastiCacheReplicationGroupRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: ElastiCacheReplicationGroupRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof elasticache.CfnReplicationGroup) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const cacheReplicationGroup = node as elasticache.CfnReplicationGroup;

        new ElastiCacheReplicationGroupRecommendedAlarms(cacheReplicationGroup, 'ElastiCacheReplicationGroupRecommendedAlarmsFromAspect', {
          cacheReplicationGroup,
          ...this.props,
        });
      }
    }
  }
}
