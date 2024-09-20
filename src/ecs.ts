import {
  IAspect,
  aws_ecs as ecs,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for ECS alarms.
 */
export enum EcsRecommendedAlarmsMetrics {
  /**
   * The percentage of CPU units that is used by the cluster or service.
   */
  CPU_UTILIZATION = 'CPUUtilization',
  /**
   * The percentage of memory in use by the cluster or service.
   */
  MEMORY_UTILIZATION = 'MemoryUtilization',
  /**
   * The ephemeral storage in GB that is used by the cluster or service.
   */
  EPHEMERAL_STORAGE_UTILIZED = 'EphemeralStorageUtilized',
  /**
   * The number of tasks in your services that are in the RUNNING state.
   */
  RUNNING_TASK_COUNT = 'RunningTaskCount',
}

/**
 * The common optional configuration for the alarms.
 */
export interface EcsAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the ECS service alarms.
 */
export interface EcsServiceAlarmProps {
  /**
   * The ECS service to monitor.
   */
  readonly service: ecs.FargateService;
}

/**
 * Configuration for the CpuUtilization alarm.
 */
export interface EcsCpuUtilizationAlarmConfig extends EcsAlarmBaseConfig {
  /**
   * The percentage (0-100) value against which the specified statistic is compared.
   * The service metrics for CPU utilization might exceed 100% utilization. However,
   * we recommend that you monitor the metric for high CPU utilization to avoid impacting
   * other services. Set the threshold to about 90-95%. We recommend that you update your
   * task definitions to reflect actual usage to prevent future issues with other services.
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
   * @default - clusterName + ' - ' + serviceName + ' - CPUUtilization'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high CPU utilization for the ECS service.
   * Consistent high CPU utilization can indicate a resource bottleneck or application
   * performance problems.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the EcsServiceCpuUtilizationAlarm construct.
 */
export interface EcsServiceCpuUtilizationAlarmProps extends EcsServiceAlarmProps, EcsCpuUtilizationAlarmConfig {}

/**
 * This alarm is used to detect high CPU utilization for the ECS service.
 *
 * Consistent high CPU utilization can indicate a resource bottleneck or
 * application performance problems.
 *
 * The alarm is triggered when CPU utilization exceeds % threshold.
 */
export class EcsServiceCpuUtilizationAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: EcsServiceCpuUtilizationAlarmProps) {
    const alarmName = props.alarmName ?? `${props.service.cluster.clusterName}-${props.service.serviceName} - ${EcsRecommendedAlarmsMetrics.CPU_UTILIZATION}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 90;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high CPU utilization for the ECS service.'
    + ' Consistent high CPU utilization can indicate a resource bottleneck or application performance problems.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.service.metricCpuUtilization({
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
 * Configuration for the MemoryUtilization alarm.
 */
export interface EcsMemoryUtilizationAlarmConfig extends EcsAlarmBaseConfig {
  /**
   * The percentage (0-100) value against which the specified statistic is compared.
   * The memory utilization is measured as the total memory in use by the tasks that
   * belong to the service, divided by the total memory reserved for the tasks that
   * belong to the service.
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
   * @default - clusterName + ' - ' + serviceName + ' - MemoryUtilization'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high memory utilization for the ECS service.
   * Consistent high memory utilization can indicate a resource bottleneck or application
   * performance problems.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the EcsServiceMemoryUtilizationAlarm construct.
 */
export interface EcsServiceMemoryUtilizationAlarmProps extends EcsServiceAlarmProps, EcsMemoryUtilizationAlarmConfig {}

/**
 * This alarm is used to detect high memory utilization for the ECS service.
 *
 * Consistent high memory utilization can indicate a resource bottleneck or
 * application performance problems.
 *
 * The alarm is triggered when memory utilization exceeds % threshold.
 */
export class EcsServiceMemoryUtilizationAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: EcsServiceMemoryUtilizationAlarmProps) {
    const alarmName = props.alarmName ?? `${props.service.cluster.clusterName}-${props.service.serviceName} - ${EcsRecommendedAlarmsMetrics.MEMORY_UTILIZATION}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 90;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high memory utilization for the ECS service.'
    + ' Consistent high memory utilization can indicate a resource bottleneck or application performance problems.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.service.metricMemoryUtilization({
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
 * Configuration for the EphemeralStorageUtilized alarm.
 */
export interface EcsEphemeralStorageUtilizedAlarmConfig extends EcsAlarmBaseConfig {
  /**
   * The value in GB against which the specified statistic is compared.
   * Set the threshold to about 90% of the ephemeral storage size. You can adjust this
   * value based on your acceptable ephemeral storage utilization of the Fargate cluster.
   * For some systems, a consistently high ephemeral storage utilized might be normal,
   * while for others, it might lead to failure of the container.
   *
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
   * @default - clusterName + ' - ' + serviceName + ' - EphemeralStorageUtilized'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high ephemeral storage usage for the Fargate cluster.
   * Consistent high ephemeral storage utilized can indicate that the disk is full and it might
   * lead to failure of the container.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the EcsServiceEphemeralStorageUtilizedAlarm construct.
 */
export interface EcsServiceEphemeralStorageUtilizedAlarmProps extends EcsServiceAlarmProps, EcsEphemeralStorageUtilizedAlarmConfig {}

/**
 * This alarm is used to detect high ephemeral storage usage for the Fargate cluster.
 *
 * Consistent high ephemeral storage utilized can indicate that the disk is full and it
 * might lead to failure of the container.
 *
 * The alarm is triggered when the storage utilized (GB) exceeds the threshold.
 */
export class EcsServiceEphemeralStorageUtilizedAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: EcsServiceEphemeralStorageUtilizedAlarmProps) {
    const alarmName = props.alarmName ?? `${props.service.cluster.clusterName}-${props.service.serviceName} - ${EcsRecommendedAlarmsMetrics.EPHEMERAL_STORAGE_UTILIZED}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high ephemeral storage usage for the'
      + ' Fargate cluster. Consistent high ephemeral storage utilized can indicate that the disk is full and it might lead'
      + '  to failure of the container.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'ECS/ContainerInsights',
        metricName: EcsRecommendedAlarmsMetrics.EPHEMERAL_STORAGE_UTILIZED,
        dimensionsMap: {
          ServiceName: props.service.serviceName,
          ClusterName: props.service.cluster.clusterName,
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
 * Configuration for the RunningTaskCount alarm.
 */
export interface EcsRunningTaskCountAlarmConfig extends EcsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   * You can adjust the threshold based on the minimum running task count of the ECS
   * service. If the running task count is 0, the Amazon ECS service will be unavailable.
   *
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
   * @default - clusterName + ' - ' + serviceName + ' - RunningTaskCount'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect whether the number of running tasks are too low.
   * A consistent low running task count can indicate ECS service deployment or performance issues.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the EcsServiceRunningTaskCountAlarm construct.
 */
export interface EcsServiceRunningTaskCountAlarmProps extends EcsServiceAlarmProps, EcsRunningTaskCountAlarmConfig {}

/**
 * This alarm helps you detect a low running task count of the ECS service.
 *
 * If the running task count is too low, it can can indicate that the application
 * can’t handle the service load and it might lead to performance issues. If there
 * is no running task, the Amazon ECS service might be unavailable or there might
 * be deployment issues.
 *
 * The alarm is triggered when the number of running tasks is less than or equal to
 * threshold.
 */
export class EcsServiceRunningTaskCountAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: EcsServiceRunningTaskCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.service.cluster.clusterName}-${props.service.serviceName} - ${EcsRecommendedAlarmsMetrics.RUNNING_TASK_COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 0;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect whether the number of running tasks'
      + ' are too low. A consistent low running task count can indicate ECS service deployment or performance issues.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'ECS/ContainerInsights',
        metricName: EcsRecommendedAlarmsMetrics.RUNNING_TASK_COUNT,
        dimensionsMap: {
          ServiceName: props.service.serviceName,
          ClusterName: props.service.cluster.clusterName,
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
 * Configurations for the recommended alarms for an ECS Service.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface EcsServiceRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: EcsRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the CpuUtilization alarm.
   */
  readonly configCpuUtilizationAlarm?: EcsCpuUtilizationAlarmConfig;
  /**
   * The configuration for the MemoryUtilization alarm.
   */
  readonly configMemoryUtilizationAlarm?: EcsMemoryUtilizationAlarmConfig;
  /**
   * The configuration for the EphemeralStorageUtilized alarm.
   */
  readonly configEphemeralStorageUtilizedAlarm: EcsEphemeralStorageUtilizedAlarmConfig;
  /**
   * The configuration for the RunningTaskCount alarm.
   */
  readonly configRunningTaskCountAlarm?: EcsRunningTaskCountAlarmConfig;
}

/**
 * Properties for the EcsServiceRecommendedAlarms construct.
 */
export interface EcsServiceRecommendedAlarmsProps extends EcsServiceRecommendedAlarmsConfig {
  /**
   * The ECS service to monitor.
   */
  readonly service: ecs.FargateService;
}

/**
 * A construct that creates the recommended alarms for an ECS service.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ECS
 */
export class EcsServiceRecommendedAlarms extends Construct {
  /**
   * The CpuUtilization alarm.
   */
  public readonly alarmCpuUtilization?: EcsServiceCpuUtilizationAlarm;

  /**
   * The MemoryUtilization alarm.
   */
  public readonly alarmMemoryUtilization?: EcsServiceMemoryUtilizationAlarm;

  /**
   * The EphemeralStorageUtilized alarm.
   */
  public readonly alarmEphemeralStorageUtilized?: EcsServiceEphemeralStorageUtilizedAlarm;

  /**
   * The RunningTaskCount alarm.
   */
  public readonly alarmRunningTaskCount?: EcsServiceRunningTaskCountAlarm;

  constructor(scope: Construct, id: string, props: EcsServiceRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(EcsRecommendedAlarmsMetrics.CPU_UTILIZATION)) {
      this.alarmCpuUtilization = new EcsServiceCpuUtilizationAlarm(this, `${props.service.node.id}_CpuUtilization`, {
        service: props.service,
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

    if (!props.excludeAlarms?.includes(EcsRecommendedAlarmsMetrics.MEMORY_UTILIZATION)) {
      this.alarmMemoryUtilization = new EcsServiceMemoryUtilizationAlarm(this, `${props.service.node.id}_MemoryUtilization`, {
        service: props.service,
        ...props.configMemoryUtilizationAlarm,
      });

      if (props.defaultAlarmAction && !props.configMemoryUtilizationAlarm?.alarmAction) {
        this.alarmMemoryUtilization.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configMemoryUtilizationAlarm?.okAction) {
        this.alarmMemoryUtilization.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configMemoryUtilizationAlarm?.insufficientDataAction) {
        this.alarmMemoryUtilization.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(EcsRecommendedAlarmsMetrics.EPHEMERAL_STORAGE_UTILIZED)) {
      this.alarmEphemeralStorageUtilized = new EcsServiceEphemeralStorageUtilizedAlarm(this, `${props.service.node.id}_EphemeralStorageUtilized`, {
        service: props.service,
        ...props.configEphemeralStorageUtilizedAlarm,
      });

      if (props.defaultAlarmAction && !props.configEphemeralStorageUtilizedAlarm.alarmAction) {
        this.alarmEphemeralStorageUtilized.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configEphemeralStorageUtilizedAlarm.okAction) {
        this.alarmEphemeralStorageUtilized.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configEphemeralStorageUtilizedAlarm.insufficientDataAction) {
        this.alarmEphemeralStorageUtilized.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(EcsRecommendedAlarmsMetrics.RUNNING_TASK_COUNT)) {
      this.alarmRunningTaskCount = new EcsServiceRunningTaskCountAlarm(this, `${props.service.node.id}_RunningTaskCount`, {
        service: props.service,
        ...props.configRunningTaskCountAlarm,
      });

      if (props.defaultAlarmAction && !props.configRunningTaskCountAlarm?.alarmAction) {
        this.alarmRunningTaskCount.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configRunningTaskCountAlarm?.okAction) {
        this.alarmRunningTaskCount.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configRunningTaskCountAlarm?.insufficientDataAction) {
        this.alarmRunningTaskCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the FargateService construct that provides methods
 * to create recommended alarms.
 */
export class FargateService extends ecs.FargateService {
  constructor(scope: Construct, id: string, props: ecs.FargateServiceProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the CPU utilization for the Fargate service.
   */
  public alarmCpuUtilization(props?: EcsCpuUtilizationAlarmConfig): EcsServiceCpuUtilizationAlarm {
    return new EcsServiceCpuUtilizationAlarm(this, 'CpuUtilizationAlarm', {
      service: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the memory utilization for the Fargate service.
   */
  public alarmMemoryUtilization(props?: EcsMemoryUtilizationAlarmConfig): EcsServiceMemoryUtilizationAlarm {
    return new EcsServiceMemoryUtilizationAlarm(this, 'MemoryUtilizationAlarm', {
      service: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the ephemeral storage utilized for the Fargate service.
   */
  public alarmEphemeralStorageUtilized(props: EcsEphemeralStorageUtilizedAlarmConfig): EcsServiceEphemeralStorageUtilizedAlarm {
    return new EcsServiceEphemeralStorageUtilizedAlarm(this, 'EphemeralStorageUtilizedAlarm', {
      service: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the number of task running.
   */
  public alarmRunningTaskCount(props?: EcsRunningTaskCountAlarmConfig): EcsServiceRunningTaskCountAlarm {
    return new EcsServiceRunningTaskCountAlarm(this, 'RunningTaskCountAlarm', {
      service: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the ECS service.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ECS
   */
  public applyRecommendedAlarms(props: EcsServiceRecommendedAlarmsConfig): EcsServiceRecommendedAlarms {
    return new EcsServiceRecommendedAlarms(this, 'EcsServiceRecommendedAlarms', {
      service: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an ECS service.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#ECS
 */
export class EcsRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: EcsServiceRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof ecs.FargateService) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const service = node as ecs.FargateService;

        new EcsServiceRecommendedAlarms(service, 'EcsServiceRecommendedAlarmsFromAspect', {
          service,
          ...this.props,
        });
      }
    }
  }
}
