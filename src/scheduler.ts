import {
  IAspect,
  Duration,
  aws_scheduler as scheduler,
  aws_cloudwatch as cloudwatch,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, AnomalyComparisonOperator, validateTotalAlarmPeriod } from './common';

/**
 * Metrics supported by the Scheduler alarms.
 */
export enum SchedulerRecommendedAlarmsMetrics {
  /**
   * Target invocations rejected because the target API is throttling.
   */
  TARGET_ERROR_THROTTLED_COUNT = 'TargetErrorThrottledCount',
  /**
   * Invocations throttled by EventBridge Scheduler service quotas.
   */
  INVOCATION_THROTTLE_COUNT = 'InvocationThrottleCount',
  /**
   * Invocations abandoned after the schedule retry policy is exhausted.
   */
  INVOCATION_DROPPED_COUNT = 'InvocationDroppedCount',
  /**
   * Failed attempts to send an exhausted invocation to its dead-letter queue.
   */
  INVOCATIONS_FAILED_TO_BE_SENT_TO_DEAD_LETTER_COUNT = 'InvocationsFailedToBeSentToDeadLetterCount',
  /**
   * Schedule invocation-attempt volume anomaly detection.
   */
  INVOCATION_ATTEMPT_COUNT_ANOMALY = 'InvocationAttemptCountAnomaly',
}

/**
 * The resource monitored by the Scheduler alarms.
 */
export interface SchedulerAlarmProps {
  /**
   * The Scheduler schedule group to monitor.
   */
  readonly scheduleGroup: scheduler.IScheduleGroup;
}

/**
 * Configuration for SchedulerAlarmBase.
 * Missing data defaults to `TreatMissingData.NOT_BREACHING` for all static alarms.
 */
export interface SchedulerAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The metric period.
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
  /**
   * The number of periods evaluated.
   * @default - The alarm-specific AWS guidance or library default.
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of breaching periods required.
   * @default - The same as evaluationPeriods.
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   * @default - Resource name followed by the metric name.
   */
  readonly alarmName?: string;
  /**
   * The alarm description.
   * @default - Describes the metric and troubleshooting steps.
   */
  readonly alarmDescription?: string;
}

/**
 * Configuration for SchedulerTargetErrorThrottledCountAlarm.
 */
export interface SchedulerTargetErrorThrottledCountAlarmConfig extends SchedulerAlarmBaseConfig {
  /**
   * Count above which the alarm fires. Zero detects any occurrence.
   * @default 0
   */
  readonly threshold?: number;
}

/**
 * Properties for SchedulerTargetErrorThrottledCountAlarm.
 */
export interface SchedulerTargetErrorThrottledCountAlarmProps extends SchedulerAlarmProps, SchedulerTargetErrorThrottledCountAlarmConfig {}

/**
 * Target invocations rejected because the target API is throttling.
 *
 * Follows the AWS recommended Scheduler alarm evaluation window.
 */
export class SchedulerTargetErrorThrottledCountAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: SchedulerTargetErrorThrottledCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.scheduleGroup.scheduleGroupName} - ${SchedulerRecommendedAlarmsMetrics.TARGET_ERROR_THROTTLED_COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.scheduleGroup.metricTargetThrottled({ period, statistic: 'Sum' }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? evaluationPeriods,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects persistent throttling by Scheduler targets. Spread invocations with flexible time windows or increase target capacity.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for SchedulerInvocationThrottleCountAlarm.
 */
export interface SchedulerInvocationThrottleCountAlarmConfig extends SchedulerAlarmBaseConfig {
  /**
   * Count above which the alarm fires. Zero detects any occurrence.
   * @default 0
   */
  readonly threshold?: number;
}

/**
 * Properties for SchedulerInvocationThrottleCountAlarm.
 */
export interface SchedulerInvocationThrottleCountAlarmProps extends SchedulerAlarmProps, SchedulerInvocationThrottleCountAlarmConfig {}

/**
 * Invocations throttled by EventBridge Scheduler service quotas.
 *
 * Follows the AWS recommended Scheduler alarm evaluation window.
 */
export class SchedulerInvocationThrottleCountAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: SchedulerInvocationThrottleCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.scheduleGroup.scheduleGroupName} - ${SchedulerRecommendedAlarmsMetrics.INVOCATION_THROTTLE_COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.scheduleGroup.metricThrottled({ period, statistic: 'Sum' }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? evaluationPeriods,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects persistent EventBridge Scheduler invocation throttling. Review flexible time windows and invocation quotas.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for SchedulerInvocationDroppedCountAlarm.
 */
export interface SchedulerInvocationDroppedCountAlarmConfig extends SchedulerAlarmBaseConfig {
  /**
   * Count above which the alarm fires. Zero detects any occurrence.
   * @default 0
   */
  readonly threshold?: number;
}

/**
 * Properties for SchedulerInvocationDroppedCountAlarm.
 */
export interface SchedulerInvocationDroppedCountAlarmProps extends SchedulerAlarmProps, SchedulerInvocationDroppedCountAlarmConfig {}

/**
 * Invocations abandoned after the schedule retry policy is exhausted.
 *
 * Follows the AWS recommended Scheduler alarm evaluation window.
 */
export class SchedulerInvocationDroppedCountAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: SchedulerInvocationDroppedCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.scheduleGroup.scheduleGroupName} - ${SchedulerRecommendedAlarmsMetrics.INVOCATION_DROPPED_COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 1;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.scheduleGroup.metricDropped({ period, statistic: 'Sum' }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? evaluationPeriods,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects invocations dropped by EventBridge Scheduler. Investigate the target and schedule retry policy.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarm.
 */
export interface SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarmConfig extends SchedulerAlarmBaseConfig {
  /**
   * Count above which the alarm fires. Zero detects any occurrence.
   * @default 0
   */
  readonly threshold?: number;
}

/**
 * Properties for SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarm.
 */
export interface SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarmProps
  extends SchedulerAlarmProps, SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarmConfig {}

/**
 * Failed attempts to send an exhausted invocation to its dead-letter queue.
 *
 * Follows the AWS recommended Scheduler alarm evaluation window.
 */
export class SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.scheduleGroup.scheduleGroupName} - ${SchedulerRecommendedAlarmsMetrics.INVOCATIONS_FAILED_TO_BE_SENT_TO_DEAD_LETTER_COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.scheduleGroup.metricFailedToBeSentToDLQ(undefined, { period, statistic: 'Sum' }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? evaluationPeriods,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects EventBridge Scheduler failures to retain invocations in a dead-letter queue. Check queue permissions and availability.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for SchedulerAnomalyAlarmBase.
 */
export interface SchedulerAnomalyAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The width of the anomaly band in standard deviations.
   * @default 8
   */
  readonly stdDevs?: number;
  /**
   * The number of five-minute periods evaluated.
   * @default - The alarm-specific evaluation window.
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of breaching periods required.
   * @default - One fewer than evaluationPeriods, with a minimum of one.
   */
  readonly datapointsToAlarm?: number;
  /**
   * The anomaly-band comparison operator.
   * @default - Both bands for invocation-attempt volume.
   */
  readonly comparisonOperator?: AnomalyComparisonOperator;
  /**
   * The alarm name.
   * @default - Resource name followed by the metric name and Anomaly.
   */
  readonly alarmName?: string;
  /**
   * The alarm description.
   * @default - Describes the anomaly and troubleshooting steps.
   */
  readonly alarmDescription?: string;
}

/**
 * Configuration for SchedulerInvocationAttemptCountAnomalyAlarm.
 */
export interface SchedulerInvocationAttemptCountAnomalyAlarmConfig extends SchedulerAnomalyAlarmBaseConfig {}

/**
 * Properties for SchedulerInvocationAttemptCountAnomalyAlarm.
 */
export interface SchedulerInvocationAttemptCountAnomalyAlarmProps extends SchedulerAlarmProps, SchedulerInvocationAttemptCountAnomalyAlarmConfig {}

/**
 * Schedule invocation-attempt volume anomaly detection.
 *
 * Uses a five-minute Sum metric and the historical invocation-attempt volume.
 * Use only for workloads with enough regular observations to train a useful band.
 * A full traffic stop can produce missing data rather than a zero; this is not a heartbeat.
 * Failure and throttle counters remain static alarms, not self-learning failure thresholds.
 */
export class SchedulerInvocationAttemptCountAnomalyAlarm extends cloudwatch.AnomalyDetectionAlarm {
  constructor(scope: Construct, id: string, props: SchedulerInvocationAttemptCountAnomalyAlarmProps) {
    const alarmName = props.alarmName ?? `${props.scheduleGroup.scheduleGroupName} - ${SchedulerRecommendedAlarmsMetrics.INVOCATION_ATTEMPT_COUNT_ANOMALY}`;
    const period = Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 4;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.scheduleGroup.metricAttempts({ period, statistic: 'Sum' }),
      stdDevs: props.stdDevs ?? 8,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? Math.max(1, evaluationPeriods - 1),
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING,
      comparisonOperator: props.comparisonOperator ?? cloudwatch.ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects unexpected changes in Scheduler invocation-attempt volume. Check schedule configuration, retries, and upstream provisioning.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for Scheduler recommended alarms.
 *
 * Individual alarm actions and missing-data settings override the bundle defaults.
 * Anomaly alarms are included unless excluded.
 */
export interface SchedulerRecommendedAlarmsConfig {
  /**
   * The default Alarm action.
   * @default - No action.
   */
  readonly defaultAlarmAction?: cloudwatch.IAlarmAction;
  /**
   * The default Ok action.
   * @default - No action.
   */
  readonly defaultOkAction?: cloudwatch.IAlarmAction;
  /**
   * The default InsufficientData action.
   * @default - No action.
   */
  readonly defaultInsufficientDataAction?: cloudwatch.IAlarmAction;
  /**
   * Default missing-data behavior, overridden by individual configurations.
   * @default - Not breaching for failure counters; missing for anomalies.
   */
  readonly treatMissingData?: cloudwatch.TreatMissingData;
  /**
   * Metrics to exclude.
   * @default - None.
   */
  readonly excludeAlarms?: SchedulerRecommendedAlarmsMetrics[];
  /**
   * Resource construct IDs excluded by the Aspect.
   * @default - None.
   */
  readonly excludeResources?: string[];
  /**
   * Configuration for TargetErrorThrottledCount.
   * @default - Alarm defaults.
   */
  readonly configTargetErrorThrottledCountAlarm?: SchedulerTargetErrorThrottledCountAlarmConfig;
  /**
   * Configuration for InvocationThrottleCount.
   * @default - Alarm defaults.
   */
  readonly configInvocationThrottleCountAlarm?: SchedulerInvocationThrottleCountAlarmConfig;
  /**
   * Configuration for InvocationDroppedCount.
   * @default - Alarm defaults.
   */
  readonly configInvocationDroppedCountAlarm?: SchedulerInvocationDroppedCountAlarmConfig;
  /**
   * Configuration for InvocationsFailedToBeSentToDeadLetterCount.
   * @default - Alarm defaults.
   */
  readonly configInvocationsFailedToBeSentToDeadLetterCountAlarm?: SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarmConfig;
  /**
   * Configuration for InvocationAttemptCountAnomaly.
   * @default - Alarm defaults; created unless excluded.
   */
  readonly configInvocationAttemptCountAnomalyAlarm?: SchedulerInvocationAttemptCountAnomalyAlarmConfig;
}

/**
 * Properties for SchedulerRecommendedAlarms.
 */
export interface SchedulerRecommendedAlarmsProps extends SchedulerAlarmProps, SchedulerRecommendedAlarmsConfig {}

/**
 * Creates the configured alarms for a schedule group.
 */
export class SchedulerRecommendedAlarms extends Construct {
  /**
   * The TargetErrorThrottledCount alarm, if enabled.
   */
  public readonly alarmTargetErrorThrottledCount?: SchedulerTargetErrorThrottledCountAlarm;
  /**
   * The InvocationThrottleCount alarm, if enabled.
   */
  public readonly alarmInvocationThrottleCount?: SchedulerInvocationThrottleCountAlarm;
  /**
   * The InvocationDroppedCount alarm, if enabled.
   */
  public readonly alarmInvocationDroppedCount?: SchedulerInvocationDroppedCountAlarm;
  /**
   * The InvocationsFailedToBeSentToDeadLetterCount alarm, if enabled.
   */
  public readonly alarmInvocationsFailedToBeSentToDeadLetterCount?: SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarm;
  /**
   * The InvocationAttemptCountAnomaly alarm, if enabled.
   */
  public readonly alarmInvocationAttemptCountAnomaly?: SchedulerInvocationAttemptCountAnomalyAlarm;

  constructor(scope: Construct, id: string, props: SchedulerRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(SchedulerRecommendedAlarmsMetrics.TARGET_ERROR_THROTTLED_COUNT)) {
      this.alarmTargetErrorThrottledCount = new SchedulerTargetErrorThrottledCountAlarm(this, 'TargetErrorThrottledCountAlarm', {
        scheduleGroup: props.scheduleGroup,
        treatMissingData: props.treatMissingData,
        ...props.configTargetErrorThrottledCountAlarm,
      });
      if (props.defaultAlarmAction && !props.configTargetErrorThrottledCountAlarm?.alarmAction) {
        this.alarmTargetErrorThrottledCount.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configTargetErrorThrottledCountAlarm?.okAction) {
        this.alarmTargetErrorThrottledCount.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configTargetErrorThrottledCountAlarm?.insufficientDataAction) {
        this.alarmTargetErrorThrottledCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SchedulerRecommendedAlarmsMetrics.INVOCATION_THROTTLE_COUNT)) {
      this.alarmInvocationThrottleCount = new SchedulerInvocationThrottleCountAlarm(this, 'InvocationThrottleCountAlarm', {
        scheduleGroup: props.scheduleGroup,
        treatMissingData: props.treatMissingData,
        ...props.configInvocationThrottleCountAlarm,
      });
      if (props.defaultAlarmAction && !props.configInvocationThrottleCountAlarm?.alarmAction) {
        this.alarmInvocationThrottleCount.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configInvocationThrottleCountAlarm?.okAction) {
        this.alarmInvocationThrottleCount.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configInvocationThrottleCountAlarm?.insufficientDataAction) {
        this.alarmInvocationThrottleCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SchedulerRecommendedAlarmsMetrics.INVOCATION_DROPPED_COUNT)) {
      this.alarmInvocationDroppedCount = new SchedulerInvocationDroppedCountAlarm(this, 'InvocationDroppedCountAlarm', {
        scheduleGroup: props.scheduleGroup,
        treatMissingData: props.treatMissingData,
        ...props.configInvocationDroppedCountAlarm,
      });
      if (props.defaultAlarmAction && !props.configInvocationDroppedCountAlarm?.alarmAction) {
        this.alarmInvocationDroppedCount.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configInvocationDroppedCountAlarm?.okAction) {
        this.alarmInvocationDroppedCount.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configInvocationDroppedCountAlarm?.insufficientDataAction) {
        this.alarmInvocationDroppedCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SchedulerRecommendedAlarmsMetrics.INVOCATIONS_FAILED_TO_BE_SENT_TO_DEAD_LETTER_COUNT)) {
      this.alarmInvocationsFailedToBeSentToDeadLetterCount = new SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarm(this, 'InvocationsFailedToBeSentToDeadLetterCountAlarm', {
        scheduleGroup: props.scheduleGroup,
        treatMissingData: props.treatMissingData,
        ...props.configInvocationsFailedToBeSentToDeadLetterCountAlarm,
      });
      if (props.defaultAlarmAction && !props.configInvocationsFailedToBeSentToDeadLetterCountAlarm?.alarmAction) {
        this.alarmInvocationsFailedToBeSentToDeadLetterCount.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configInvocationsFailedToBeSentToDeadLetterCountAlarm?.okAction) {
        this.alarmInvocationsFailedToBeSentToDeadLetterCount.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configInvocationsFailedToBeSentToDeadLetterCountAlarm?.insufficientDataAction) {
        this.alarmInvocationsFailedToBeSentToDeadLetterCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SchedulerRecommendedAlarmsMetrics.INVOCATION_ATTEMPT_COUNT_ANOMALY)) {
      this.alarmInvocationAttemptCountAnomaly = new SchedulerInvocationAttemptCountAnomalyAlarm(this, 'InvocationAttemptCountAnomalyAlarm', {
        scheduleGroup: props.scheduleGroup,
        treatMissingData: props.treatMissingData,
        ...props.configInvocationAttemptCountAnomalyAlarm,
      });
      if (props.defaultAlarmAction && !props.configInvocationAttemptCountAnomalyAlarm?.alarmAction) {
        this.alarmInvocationAttemptCountAnomaly.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configInvocationAttemptCountAnomalyAlarm?.okAction) {
        this.alarmInvocationAttemptCountAnomaly.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configInvocationAttemptCountAnomalyAlarm?.insufficientDataAction) {
        this.alarmInvocationAttemptCountAnomaly.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An opt-in ScheduleGroup extension with alarm convenience methods.
 *
 * Creating the resource alone does not create any alarms.
 */
export class ScheduleGroup extends scheduler.ScheduleGroup {
  constructor(scope: Construct, id: string, props?: scheduler.ScheduleGroupProps) {
    super(scope, id, props);
  }

  /**
   * Creates the TargetErrorThrottledCount alarm.
   */
  public alarmTargetErrorThrottledCount(props?: SchedulerTargetErrorThrottledCountAlarmConfig): SchedulerTargetErrorThrottledCountAlarm {
    return new SchedulerTargetErrorThrottledCountAlarm(this, 'TargetErrorThrottledCountAlarm', { scheduleGroup: this, ...props });
  }

  /**
   * Creates the InvocationThrottleCount alarm.
   */
  public alarmInvocationThrottleCount(props?: SchedulerInvocationThrottleCountAlarmConfig): SchedulerInvocationThrottleCountAlarm {
    return new SchedulerInvocationThrottleCountAlarm(this, 'InvocationThrottleCountAlarm', { scheduleGroup: this, ...props });
  }

  /**
   * Creates the InvocationDroppedCount alarm.
   */
  public alarmInvocationDroppedCount(props?: SchedulerInvocationDroppedCountAlarmConfig): SchedulerInvocationDroppedCountAlarm {
    return new SchedulerInvocationDroppedCountAlarm(this, 'InvocationDroppedCountAlarm', { scheduleGroup: this, ...props });
  }

  /**
   * Creates the InvocationsFailedToBeSentToDeadLetterCount alarm.
   */
  public alarmInvocationsFailedToBeSentToDeadLetterCount(
    props?: SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarmConfig,
  ): SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarm {
    return new SchedulerInvocationsFailedToBeSentToDeadLetterCountAlarm(this, 'InvocationsFailedToBeSentToDeadLetterCountAlarm', { scheduleGroup: this, ...props });
  }

  /**
   * Creates the InvocationAttemptCountAnomaly alarm.
   */
  public alarmInvocationAttemptCountAnomaly(props?: SchedulerInvocationAttemptCountAnomalyAlarmConfig): SchedulerInvocationAttemptCountAnomalyAlarm {
    return new SchedulerInvocationAttemptCountAnomalyAlarm(this, 'InvocationAttemptCountAnomalyAlarm', { scheduleGroup: this, ...props });
  }

  /** Applies the configured alarm bundle to this resource. */
  public applyRecommendedAlarms(props: SchedulerRecommendedAlarmsConfig = {}): SchedulerRecommendedAlarms {
    return new SchedulerRecommendedAlarms(this, 'SchedulerRecommendedAlarms', { scheduleGroup: this, ...props });
  }
}

/**
 * Applies the configured alarms to owned Scheduler schedule groups.
 */
export class SchedulerRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: SchedulerRecommendedAlarmsConfig = {}) {}

  public visit(node: IConstruct): void {
    if (!(node instanceof scheduler.ScheduleGroup)) return;
    if (this.props.excludeResources?.includes(node.node.id)) return;
    new SchedulerRecommendedAlarms(node, 'SchedulerRecommendedAlarmsFromAspect', { scheduleGroup: node, ...this.props });
  }
}
