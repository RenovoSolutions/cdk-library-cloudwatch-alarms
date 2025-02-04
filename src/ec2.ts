import {
  IAspect,
  aws_ec2 as ec2,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for EC2 alarms.
 */
export enum Ec2RecommendedAlarmsMetrics {
  /**
   * The percentage of physical CPU time that Amazon EC2 uses to run the EC2 instance, which includes
   * time spent to run both the user code and the Amazon EC2 code.
   */
  CPU_UTILIZATION = 'CPUUtilization',
  /**
   * Reports whether the instance has passed all status checks in the last minute.
   * This metric can be either 0 (passed) or 1 (failed). By default, this metric is available at
   * a 1-minute frequency at no charge.
   */
  STATUS_CHECK_FAILED = 'StatusCheckFailed',
}

/**
 * The common optional configuration for the alarms.
 */
export interface Ec2AlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the EC2 Instance alarms.
 */
export interface Ec2InstanceAlarmProps {
  /**
   * The EC2 Instance to monitor.
   */
  readonly instance: ec2.Instance;
}

/**
 * Configuration for the CPUUtilization alarm.
 */
export interface Ec2CpuUtilizationAlarmConfig extends Ec2AlarmBaseConfig {
  /**
   * Typically, you can set the threshold for CPU utilization to 70-80%. However, you can
   * adjust this value based on your acceptable performance level and workload characteristics.
   * For some systems, consistently high CPU utilization may be normal and not indicate a problem,
   * while for others, it may be cause of concern. Analyze historical CPU utilization data to
   * identify the usage, find what CPU utilization is acceptable for your system, and set the
   * threshold accordingly.
   *
   * @default 80
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
   * @default - instanceId + ' - CPUUtilization'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect high CPU utilization.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the Ec2InstanceCpuUtilizationAlarm construct.
 */
export interface Ec2InstanceCpuUtilizationAlarmProps extends Ec2InstanceAlarmProps, Ec2CpuUtilizationAlarmConfig {}

/**
 * This alarm helps to monitor the CPU utilization of an EC2 instance.
 *
 * Depending on the application, consistently high utilization levels might be normal. But if performance is degraded,
 * and the application is not constrained by disk I/O, memory, or network resources, then a maxed-out CPU might indicate
 * a resource bottleneck or application performance problems. High CPU utilization might indicate that an upgrade to a
 * more CPU intensive instance is required. If detailed monitoring is enabled, you can change the period to 60 seconds
 * instead of 300 seconds. For more information, see Enable or turn off detailed monitoring for your instances.
 *
 * The alarm is triggered when the percentage exceeds % threshold.
 */
export class Ec2InstanceCpuUtilizationAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: Ec2InstanceCpuUtilizationAlarmProps) {
    const alarmName = props.alarmName ?? `${props.instance.instanceId} - ${Ec2RecommendedAlarmsMetrics.CPU_UTILIZATION}`;
    const period = props.period ?? Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 3;
    const threshold = props.threshold ?? 80;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect high CPU utilization.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/EC2',
        metricName: Ec2RecommendedAlarmsMetrics.CPU_UTILIZATION,
        dimensionsMap: {
          InstanceId: props.instance.instanceId,
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
 * Configuration for the StatusCheckFailed alarm.
 */
export interface Ec2StatusCheckFailedAlarmConfig extends Ec2AlarmBaseConfig {
  /**
   * When a status check fails, the value of this metric is 1. The threshold is set so that whenever the
   * status check fails, the alarm is in ALARM state.
   *
   * @default 1
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
   * @default - instanceId + ' - StatusCheckFailed'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect the underlying problems with instances, including both system
   * status check failures and instance status check failures.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the Ec2InstanceStatusCheckFailedAlarm construct.
 */
export interface Ec2InstanceStatusCheckFailedAlarmProps extends Ec2InstanceAlarmProps, Ec2StatusCheckFailedAlarmConfig {}

/**
 * This alarm helps to monitor both system status checks and instance status checks.
 *
 * If either type of status check fails, then this alarm should be in ALARM state.
 *
 * The alarm is triggered when the status reported is greater or equal to threshold.
 */
export class Ec2InstanceStatusCheckFailedAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: Ec2InstanceStatusCheckFailedAlarmProps) {
    const alarmName = props.alarmName ?? `${props.instance.instanceId} - ${Ec2RecommendedAlarmsMetrics.STATUS_CHECK_FAILED}`;
    const period = props.period ?? Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 2;
    const datapointsToAlarm = props.datapointsToAlarm ?? 2;
    const threshold = props.threshold ?? 1;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect the underlying problems with instances,'
      + ' including both system status check failures and instance status check failures.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/EC2',
        metricName: Ec2RecommendedAlarmsMetrics.STATUS_CHECK_FAILED,
        dimensionsMap: {
          InstanceId: props.instance.instanceId,
        },
        period,
        statistic: 'Maximum',
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
 * Configurations for the recommended alarms for an EC2 Service.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface Ec2InstanceRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: Ec2RecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the CPUUtilization alarm.
   */
  readonly configCpuUtilizationAlarm?: Ec2CpuUtilizationAlarmConfig;
  /**
   * The configuration for the StatusCheckFailed alarm.
   */
  readonly configStatusCheckFailedAlarm?: Ec2StatusCheckFailedAlarmConfig;
}

/**
 * Properties for the Ec2InstanceRecommendedAlarms construct.
 */
export interface Ec2InstanceRecommendedAlarmsProps extends Ec2InstanceRecommendedAlarmsConfig {
  /**
   * The EC2 Instance to monitor.
   */
  readonly instance: ec2.Instance;
}

/**
 * A construct that creates the recommended alarms for an EC2 Instance.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#EC2
 */
export class Ec2InstanceRecommendedAlarms extends Construct {
  /**
   * The CPUUtilization alarm.
   */
  public readonly alarmCpuUtilization?: Ec2InstanceCpuUtilizationAlarm;

  /**
   * The StatusCheckFailed alarm.
   */
  public readonly alarmStatusCheckFailed?: Ec2InstanceStatusCheckFailedAlarm;

  constructor(scope: Construct, id: string, props: Ec2InstanceRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(Ec2RecommendedAlarmsMetrics.CPU_UTILIZATION)) {
      this.alarmCpuUtilization = new Ec2InstanceCpuUtilizationAlarm(this, `${props.instance.node.id}_CPUUtilization`, {
        instance: props.instance,
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

    if (!props.excludeAlarms?.includes(Ec2RecommendedAlarmsMetrics.STATUS_CHECK_FAILED)) {
      this.alarmStatusCheckFailed = new Ec2InstanceStatusCheckFailedAlarm(this, `${props.instance.node.id}_StatusCheckFailed`, {
        instance: props.instance,
        ...props.configStatusCheckFailedAlarm,
      });

      if (props.defaultAlarmAction && !props.configStatusCheckFailedAlarm?.alarmAction) {
        this.alarmStatusCheckFailed.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configStatusCheckFailedAlarm?.okAction) {
        this.alarmStatusCheckFailed.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configStatusCheckFailedAlarm?.insufficientDataAction) {
        this.alarmStatusCheckFailed.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the Instance construct that provides methods
 * to create recommended alarms.
 */
export class Instance extends ec2.Instance {
  constructor(scope: Construct, id: string, props: ec2.InstanceProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the CPUUtilization for the EC2 instance.
   */
  public alarmCpuUtilization(props?: Ec2CpuUtilizationAlarmConfig): Ec2InstanceCpuUtilizationAlarm {
    return new Ec2InstanceCpuUtilizationAlarm(this, 'CPUUtilizationAlarm', {
      instance: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the StatusCheckFailed for the EC2 instance.
   */
  public alarmStatusCheckFailed(props?: Ec2StatusCheckFailedAlarmConfig): Ec2InstanceStatusCheckFailedAlarm {
    return new Ec2InstanceStatusCheckFailedAlarm(this, 'StatusCheckFailedAlarm', {
      instance: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the EC2 Instance.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#EC2
   */
  public applyRecommendedAlarms(props?: Ec2InstanceRecommendedAlarmsConfig): Ec2InstanceRecommendedAlarms {
    return new Ec2InstanceRecommendedAlarms(this, 'Ec2InstanceRecommendedAlarms', {
      instance: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an EC2 Instance.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#EC2
 */
export class Ec2RecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props?: Ec2InstanceRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof ec2.Instance) {
      if (this.props?.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const instance = node as ec2.Instance;

        new Ec2InstanceRecommendedAlarms(instance, 'Ec2InstanceRecommendedAlarmsFromAspect', {
          instance,
          ...this.props,
        });
      }
    }
  }
}
