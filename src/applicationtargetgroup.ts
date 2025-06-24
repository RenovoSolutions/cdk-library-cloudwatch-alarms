import {
  IAspect,
  aws_elasticloadbalancingv2 as elbv2,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for ApplicationTargetGroup alarms.
 */
export enum ApplicationTargetGroupRecommendedAlarmsMetrics {
  /**
   * The number of healthy targets in the target group.
   */
  HEALTHY_HOST_COUNT = 'HealthyHostCount',
  /**
   * The number of unhealthy targets in the target group.
   */
  UNHEALTHY_HOST_COUNT = 'UnHealthyHostCount',
}

/**
 * The common optional configuration for the alarms.
 */
export interface ApplicationTargetGroupAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the ApplicationTargetGroup alarms.
 */
export interface ApplicationTargetGroupAlarmProps {
  /**
   * The ApplicationTargetGroup to monitor.
   */
  readonly targetGroup: elbv2.ApplicationTargetGroup;
}

/**
 * Configuration for the HealthyHostCount alarm.
 */
export interface ApplicationTargetGroupHealthyHostCountAlarmConfig extends ApplicationTargetGroupAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   * You should set this threshold based on the minimum number of healthy hosts
   * required for your application to function properly.
   *
   * @default 1
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
   * @default - targetGroupName + ' - HealthyHostCount'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect when the number of healthy hosts in the target group
   * falls below the threshold. A low number of healthy hosts can indicate service availability issues.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ApplicationTargetGroupHealthyHostCountAlarm construct.
 */
export interface ApplicationTargetGroupHealthyHostCountAlarmProps extends ApplicationTargetGroupAlarmProps,
  ApplicationTargetGroupHealthyHostCountAlarmConfig {}

/**
 * This alarm is used to detect when the number of healthy hosts in the target group falls below the threshold.
 *
 * A low number of healthy hosts can indicate service availability issues.
 */
export class ApplicationTargetGroupHealthyHostCountAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ApplicationTargetGroupHealthyHostCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.targetGroup.targetGroupName} - ${ApplicationTargetGroupRecommendedAlarmsMetrics.HEALTHY_HOST_COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 1;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect when the number of healthy hosts in the target group falls below the threshold.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ApplicationELB',
        metricName: ApplicationTargetGroupRecommendedAlarmsMetrics.HEALTHY_HOST_COUNT,
        dimensionsMap: {
          TargetGroup: props.targetGroup.targetGroupFullName,
          LoadBalancer: props.targetGroup.firstLoadBalancerFullName,
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
};

/**
 * Configuration for the UnHealthyHostCount alarm.
 */
export interface ApplicationTargetGroupUnHealthyHostCountAlarmConfig extends ApplicationTargetGroupAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   * You should set this threshold based on the maximum number of unhealthy hosts
   * that your application can tolerate before service is impacted.
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
   * @default - targetGroupName + ' - UnHealthyHostCount'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect when the number of unhealthy hosts in the target group
   * exceeds the threshold. A high number of unhealthy hosts can indicate service health issues.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the ApplicationTargetGroupUnHealthyHostCountAlarm construct.
 */
export interface ApplicationTargetGroupUnHealthyHostCountAlarmProps extends ApplicationTargetGroupAlarmProps,
  ApplicationTargetGroupUnHealthyHostCountAlarmConfig {}

/**
 * This alarm is used to detect when the number of unhealthy hosts in the target group exceeds the threshold.
 *
 * A high number of unhealthy hosts can indicate service health issues.
 */
export class ApplicationTargetGroupUnHealthyHostCountAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: ApplicationTargetGroupUnHealthyHostCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.targetGroup.targetGroupName} - ${ApplicationTargetGroupRecommendedAlarmsMetrics.UNHEALTHY_HOST_COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 0;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect when the number of unhealthy hosts in the target group exceeds the threshold.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/ApplicationELB',
        metricName: ApplicationTargetGroupRecommendedAlarmsMetrics.UNHEALTHY_HOST_COUNT,
        dimensionsMap: {
          TargetGroup: props.targetGroup.targetGroupFullName,
          LoadBalancer: props.targetGroup.firstLoadBalancerFullName,
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
 * Configurations for the recommended alarms for an ApplicationTargetGroup.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface ApplicationTargetGroupRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: ApplicationTargetGroupRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the HealthyHostCount alarm.
   */
  readonly configHealthyHostCountAlarm?: ApplicationTargetGroupHealthyHostCountAlarmConfig;
  /**
   * The configuration for the UnHealthyHostCount alarm.
   */
  readonly configUnHealthyHostCountAlarm?: ApplicationTargetGroupUnHealthyHostCountAlarmConfig;
}

/**
 * Properties for the ApplicationTargetGroupRecommendedAlarms construct.
 */
export interface ApplicationTargetGroupRecommendedAlarmsProps extends ApplicationTargetGroupRecommendedAlarmsConfig {
  /**
   * The ApplicationTargetGroup to monitor.
   */
  readonly targetGroup: elbv2.ApplicationTargetGroup;
}

/**
 * A construct that creates the recommended alarms for an ApplicationTargetGroup.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/elb-metricscollected.html
 */
export class ApplicationTargetGroupRecommendedAlarms extends Construct {
  /**
   * The HealthyHostCount alarm.
   */
  public readonly alarmHealthyHostCount?: ApplicationTargetGroupHealthyHostCountAlarm;

  /**
   * The UnHealthyHostCount alarm.
   */
  public readonly alarmUnHealthyHostCount?: ApplicationTargetGroupUnHealthyHostCountAlarm;

  constructor(scope: Construct, id: string, props: ApplicationTargetGroupRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(ApplicationTargetGroupRecommendedAlarmsMetrics.HEALTHY_HOST_COUNT)) {
      this.alarmHealthyHostCount = new ApplicationTargetGroupHealthyHostCountAlarm(this, `${props.targetGroup.node.id}_HealthyHostCount`, {
        targetGroup: props.targetGroup,
        treatMissingData: props.treatMissingData,
        ...props.configHealthyHostCountAlarm,
      });

      if (props.defaultAlarmAction && !props.configHealthyHostCountAlarm?.alarmAction) {
        this.alarmHealthyHostCount.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configHealthyHostCountAlarm?.okAction) {
        this.alarmHealthyHostCount.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configHealthyHostCountAlarm?.insufficientDataAction) {
        this.alarmHealthyHostCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(ApplicationTargetGroupRecommendedAlarmsMetrics.UNHEALTHY_HOST_COUNT)) {
      this.alarmUnHealthyHostCount = new ApplicationTargetGroupUnHealthyHostCountAlarm(this, `${props.targetGroup.node.id}_UnHealthyHostCount`, {
        targetGroup: props.targetGroup,
        treatMissingData: props.treatMissingData,
        ...props.configUnHealthyHostCountAlarm,
      });

      if (props.defaultAlarmAction && !props.configUnHealthyHostCountAlarm?.alarmAction) {
        this.alarmUnHealthyHostCount.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configUnHealthyHostCountAlarm?.okAction) {
        this.alarmUnHealthyHostCount.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configUnHealthyHostCountAlarm?.insufficientDataAction) {
        this.alarmUnHealthyHostCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the ApplicationTargetGroup construct that provides methods
 * to create recommended alarms.
 */
export class ApplicationTargetGroup extends elbv2.ApplicationTargetGroup {
  constructor(scope: Construct, id: string, props: elbv2.ApplicationTargetGroupProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the healthy host count for the ApplicationTargetGroup.
   */
  public alarmHealthyHostCount(props?: ApplicationTargetGroupHealthyHostCountAlarmConfig): ApplicationTargetGroupHealthyHostCountAlarm {
    return new ApplicationTargetGroupHealthyHostCountAlarm(this, 'HealthyHostCountAlarm', {
      targetGroup: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the unhealthy host count for the ApplicationTargetGroup.
   */
  public alarmUnHealthyHostCount(props?: ApplicationTargetGroupUnHealthyHostCountAlarmConfig): ApplicationTargetGroupUnHealthyHostCountAlarm {
    return new ApplicationTargetGroupUnHealthyHostCountAlarm(this, 'UnHealthyHostCountAlarm', {
      targetGroup: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the ApplicationTargetGroup.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/elb-metricscollected.html
   */
  public applyRecommendedAlarms(props: ApplicationTargetGroupRecommendedAlarmsConfig): ApplicationTargetGroupRecommendedAlarms {
    return new ApplicationTargetGroupRecommendedAlarms(this, 'ApplicationTargetGroupRecommendedAlarms', {
      targetGroup: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an ApplicationTargetGroup.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/elb-metricscollected.html
 */
export class ApplicationTargetGroupRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: ApplicationTargetGroupRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof elbv2.ApplicationTargetGroup) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const targetGroup = node as elbv2.ApplicationTargetGroup;

        new ApplicationTargetGroupRecommendedAlarms(targetGroup, 'ApplicationTargetGroupRecommendedAlarmsFromAspect', {
          targetGroup,
          ...this.props,
        });
      }
    }
  }
}