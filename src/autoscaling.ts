import {
  IAspect,
  aws_autoscaling as autoscaling,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for EC2 AutoScaling alarms.
 */
export enum AutoScalingRecommendedAlarmsMetrics {
  /**
   * The number of capacity units that are running as part of the Auto Scaling group.
   */
  GROUP_IN_SERVICE_CAPACITY = 'GroupInServiceCapacity',
}

/**
 * The common optional configuration for the alarms.
 */
export interface AutoScalingAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the EC2 AutoScalingGroup alarms.
 */
export interface AutoScalingGroupAlarmProps {
  /**
   * The EC2 AutoScalingGroup to monitor.
   */
  readonly autoScalingGroup: autoscaling.AutoScalingGroup;
}

/**
 * Configuration for the GroupInServiceCapacity alarm.
 */
export interface AutoScalingGroupInServiceCapacityAlarmConfig extends AutoScalingAlarmBaseConfig {
  /**
   * The threshold value should be the minimum capacity required to run your workload. In most cases,
   * you can set this to match the GroupDesiredCapacity metric.
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
   * @default - autoScalingGroupName + ' - GroupInServiceCapacity'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can detect a low availability in your auto scaling group because of launch failures
   * or suspended launches.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the AutoScalingGroupGroupInServiceCapacityAlarm construct.
 */
export interface AutoScalingGroupGroupInServiceCapacityAlarmProps extends AutoScalingGroupAlarmProps, AutoScalingGroupInServiceCapacityAlarmConfig {}

/**
 * This alarm helps to detect when the capacity in the group is below the desired capacity required for your workload.
 *
 * To troubleshoot, check your scaling activities for launch failures and confirm that your desired capacity configuration
 * is correct.
 *
 * The alarm is triggered when the capacity in the group is less than threshold.
 */
export class AutoScalingGroupGroupInServiceCapacityAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: AutoScalingGroupGroupInServiceCapacityAlarmProps) {
    const alarmName = props.alarmName ?? `${props.autoScalingGroup.autoScalingGroupName} - ${AutoScalingRecommendedAlarmsMetrics.GROUP_IN_SERVICE_CAPACITY}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 10;
    const datapointsToAlarm = props.datapointsToAlarm ?? 10;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm can detect a low availability in your auto scaling group'
      + ' because of launch failures or suspended launches.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/AutoScaling',
        metricName: AutoScalingRecommendedAlarmsMetrics.GROUP_IN_SERVICE_CAPACITY,
        dimensionsMap: {
          AutoScalingGroupId: props.autoScalingGroup.autoScalingGroupName,
        },
        period,
        statistic: 'Average',
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
};

/**
 * Configurations for the recommended alarms for an EC2 AutoScalingGroup.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface AutoScalingGroupRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: AutoScalingRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the GroupInServiceCapacity alarm.
   */
  readonly configGroupInServiceCapacityAlarm: AutoScalingGroupInServiceCapacityAlarmConfig;
}

/**
 * Properties for the AutoScalingGroupRecommendedAlarms construct.
 */
export interface AutoScalingGroupRecommendedAlarmsProps extends AutoScalingGroupRecommendedAlarmsConfig {
  /**
   * The EC2 AutoScalingGroup to monitor.
   */
  readonly autoScalingGroup: autoscaling.AutoScalingGroup;
}

/**
 * A construct that creates the recommended alarms for an EC2 AutoScalingGroup.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#AutoScaling
 */
export class AutoScalingGroupRecommendedAlarms extends Construct {
  /**
   * The GroupInServiceCapacity alarm.
   */
  public readonly alarmGroupInServiceCapacity?: AutoScalingGroupGroupInServiceCapacityAlarm;

  constructor(scope: Construct, id: string, props: AutoScalingGroupRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(AutoScalingRecommendedAlarmsMetrics.GROUP_IN_SERVICE_CAPACITY)) {
      this.alarmGroupInServiceCapacity = new AutoScalingGroupGroupInServiceCapacityAlarm(this, `${props.autoScalingGroup.node.id}_GroupInServiceCapacity`, {
        autoScalingGroup: props.autoScalingGroup,
        ...props.configGroupInServiceCapacityAlarm,
      });

      if (props.defaultAlarmAction && !props.configGroupInServiceCapacityAlarm.alarmAction) {
        this.alarmGroupInServiceCapacity.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configGroupInServiceCapacityAlarm.okAction) {
        this.alarmGroupInServiceCapacity.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configGroupInServiceCapacityAlarm.insufficientDataAction) {
        this.alarmGroupInServiceCapacity.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the AutoScalingGroup construct that provides methods
 * to create recommended alarms.
 */
export class AutoScalingGroup extends autoscaling.AutoScalingGroup {
  constructor(scope: Construct, id: string, props: autoscaling.AutoScalingGroupProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the GroupInServiceCapacity for the EC2 autoScalingGroup.
   */
  public alarmGroupInServiceCapacity(props: AutoScalingGroupInServiceCapacityAlarmConfig): AutoScalingGroupGroupInServiceCapacityAlarm {
    return new AutoScalingGroupGroupInServiceCapacityAlarm(this, 'GroupInServiceCapacityAlarm', {
      autoScalingGroup: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the EC2 AutoScalingGroup.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#AutoScaling
   */
  public applyRecommendedAlarms(props: AutoScalingGroupRecommendedAlarmsConfig): AutoScalingGroupRecommendedAlarms {
    return new AutoScalingGroupRecommendedAlarms(this, 'AutoScalingGroupRecommendedAlarms', {
      autoScalingGroup: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an EC2 AutoScalingGroup.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#AutoScaling
 */
export class AutoScalingRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: AutoScalingGroupRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof autoscaling.AutoScalingGroup) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const autoScalingGroup = node as autoscaling.AutoScalingGroup;

        new AutoScalingGroupRecommendedAlarms(autoScalingGroup, 'AutoScalingGroupRecommendedAlarmsFromAspect', {
          autoScalingGroup,
          ...this.props,
        });
      }
    }
  }
}
