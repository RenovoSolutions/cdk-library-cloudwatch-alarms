import {
  IAspect,
  Duration,
  Arn,
  Fn,
  Token,
  aws_events as events,
  aws_cloudwatch as cloudwatch,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, AnomalyComparisonOperator, validateTotalAlarmPeriod } from './common';

/**
 * Metrics supported by the EventBridge alarms.
 */
export enum EventBridgeRecommendedAlarmsMetrics {
  /**
   * Permanently failed target invocations.
   */
  FAILED_INVOCATIONS = 'FailedInvocations',
  /**
   * Undelivered events retained in a target dead-letter queue.
   */
  INVOCATIONS_SENT_TO_DLQ = 'InvocationsSentToDlq',
  /**
   * Rule executions delayed by EventBridge invocation throttling.
   */
  THROTTLED_RULES = 'ThrottledRules',
  /**
   * Time in milliseconds from ingestion to successful target delivery, including retries.
   */
  INGESTION_TO_INVOCATION_SUCCESS_LATENCY = 'IngestionToInvocationSuccessLatency',
  /**
   * Fraction of target invocation attempts that succeed, from zero to one.
   */
  SUCCESSFUL_INVOCATION_RATE = 'SuccessfulInvocationRate',
  /**
   * Rule execution volume anomaly detection.
   */
  TRIGGERED_RULES_ANOMALY = 'TriggeredRulesAnomaly',
  /**
   * Successful target delivery latency anomaly detection.
   */
  INGESTION_TO_INVOCATION_SUCCESS_LATENCY_ANOMALY = 'IngestionToInvocationSuccessLatencyAnomaly',
}

/**
 * The resource monitored by the EventBridge alarms.
 */
export interface EventBridgeRuleAlarmProps {
  /**
   * The EventBridge rule to monitor.
   */
  readonly rule: events.IRule;
  /**
   * The event bus. Required for imported custom-bus rules with unresolved ARNs.
   * When supplied, this takes precedence over the inferred bus.
   * @default - Inferred from owned rules or resolved ARN paths; otherwise assumes the default bus.
   */
  readonly eventBus?: events.IEventBus;
}

/**
 * Configuration for EventBridgeAlarmBase.
 */
export interface EventBridgeAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The metric period.
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
  /**
   * The number of periods evaluated.
   * @default - One for failed invocations and DLQ deliveries; three otherwise.
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of breaching periods required.
   * @default - One for failed invocations and DLQ deliveries; two otherwise.
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   * @default - Rule ARN path (including a custom-bus prefix) followed by the metric name.
   */
  readonly alarmName?: string;
  /**
   * The alarm description.
   * @default - Describes the metric and troubleshooting steps.
   */
  readonly alarmDescription?: string;
}

/** The ARN path includes the event-bus name for custom-bus rules. */
function rulePath(rule: events.IRule): string {
  return Arn.extractResourceName(rule.ruleArn, 'rule');
}

/** Creates rule metrics with the dimensions published for the rule's event bus. */
function ruleMetric(props: EventBridgeRuleAlarmProps, metricName: string, options: cloudwatch.MetricOptions): cloudwatch.Metric {
  const cfnRule = props.rule.node.defaultChild as events.CfnRule | undefined;
  const path = rulePath(props.rule);
  const eventBusName = props.eventBus?.eventBusName ?? cfnRule?.eventBusName ??
    (!Token.isUnresolved(path) && path.includes('/') ? path.split('/')[0] : undefined);
  const customBus = eventBusName !== undefined && eventBusName !== 'default';
  return new cloudwatch.Metric({
    namespace: 'AWS/Events',
    metricName,
    dimensionsMap: {
      RuleName: customBus ? Fn.select(1, Fn.split('/', path)) : props.rule.ruleName,
      ...(customBus ? { EventBusName: eventBusName } : {}),
    },
    ...options,
  });
}

/**
 * Configuration for EventBridgeRuleFailedInvocationsAlarm.
 * Missing data defaults to `TreatMissingData.NOT_BREACHING`.
 */
export interface EventBridgeRuleFailedInvocationsAlarmConfig extends EventBridgeAlarmBaseConfig {
  /**
   * Count above which the alarm fires. Zero detects any occurrence.
   * @default 0
   */
  readonly threshold?: number;
}

/**
 * Properties for EventBridgeRuleFailedInvocationsAlarm.
 */
export interface EventBridgeRuleFailedInvocationsAlarmProps extends EventBridgeRuleAlarmProps, EventBridgeRuleFailedInvocationsAlarmConfig {}

/**
 * Permanently failed target invocations.
 *
 * AWS recommends monitoring this metric for rule delivery health.
 * Defaults to one breaching one-minute period: delivery has failed permanently,
 * so even one failed event warrants investigation. This timing is not prescribed by AWS.
 */
export class EventBridgeRuleFailedInvocationsAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: EventBridgeRuleFailedInvocationsAlarmProps) {
    const alarmName = props.alarmName ?? `${rulePath(props.rule)} - ${EventBridgeRecommendedAlarmsMetrics.FAILED_INVOCATIONS}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 1;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: ruleMetric(props, EventBridgeRecommendedAlarmsMetrics.FAILED_INVOCATIONS, { period, statistic: 'Sum' }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? evaluationPeriods,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects events that EventBridge could not deliver to a target. Inspect target permissions, availability, and retry settings.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for EventBridgeRuleInvocationsSentToDlqAlarm.
 * Missing data defaults to `TreatMissingData.NOT_BREACHING`.
 */
export interface EventBridgeRuleInvocationsSentToDlqAlarmConfig extends EventBridgeAlarmBaseConfig {
  /**
   * Count above which the alarm fires. Zero detects any occurrence.
   * @default 0
   */
  readonly threshold?: number;
}

/**
 * Properties for EventBridgeRuleInvocationsSentToDlqAlarm.
 */
export interface EventBridgeRuleInvocationsSentToDlqAlarmProps extends EventBridgeRuleAlarmProps, EventBridgeRuleInvocationsSentToDlqAlarmConfig {}

/**
 * Undelivered events retained in a target dead-letter queue.
 *
 * AWS recommends monitoring this metric for rule delivery health.
 * Defaults to one breaching one-minute period: even one retained event needs
 * investigation and recovery. This timing is not prescribed by AWS.
 */
export class EventBridgeRuleInvocationsSentToDlqAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: EventBridgeRuleInvocationsSentToDlqAlarmProps) {
    const alarmName = props.alarmName ?? `${rulePath(props.rule)} - ${EventBridgeRecommendedAlarmsMetrics.INVOCATIONS_SENT_TO_DLQ}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 1;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: ruleMetric(props, EventBridgeRecommendedAlarmsMetrics.INVOCATIONS_SENT_TO_DLQ, { period, statistic: 'Sum' }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? evaluationPeriods,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects events sent to an EventBridge target dead-letter queue. Inspect the retained events and resolve the delivery failure.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for EventBridgeRuleThrottledRulesAlarm.
 * Missing data defaults to `TreatMissingData.NOT_BREACHING`.
 */
export interface EventBridgeRuleThrottledRulesAlarmConfig extends EventBridgeAlarmBaseConfig {
  /**
   * Count above which the alarm fires. Zero detects any occurrence.
   * @default 0
   */
  readonly threshold?: number;
}

/**
 * Properties for EventBridgeRuleThrottledRulesAlarm.
 */
export interface EventBridgeRuleThrottledRulesAlarmProps extends EventBridgeRuleAlarmProps, EventBridgeRuleThrottledRulesAlarmConfig {}

/**
 * Rule executions delayed by EventBridge invocation throttling.
 *
 * AWS recommends monitoring this metric for rule delivery health.
 * Defaults to two breaching one-minute periods out of three to tolerate brief throttling.
 */
export class EventBridgeRuleThrottledRulesAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: EventBridgeRuleThrottledRulesAlarmProps) {
    const alarmName = props.alarmName ?? `${rulePath(props.rule)} - ${EventBridgeRecommendedAlarmsMetrics.THROTTLED_RULES}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: ruleMetric(props, EventBridgeRecommendedAlarmsMetrics.THROTTLED_RULES, { period, statistic: 'Sum' }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 2,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects EventBridge rule throttling that delays target delivery. Review invocation quotas and target capacity.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for EventBridgeRuleIngestionToInvocationSuccessLatencyAlarm.
 */
export interface EventBridgeRuleIngestionToInvocationSuccessLatencyAlarmConfig extends EventBridgeAlarmBaseConfig {
  /**
   * Maximum acceptable successful-delivery latency, in milliseconds.
   * Choose this from the application delivery-latency requirement.
   */
  readonly threshold: number;
}

/**
 * Properties for EventBridgeRuleIngestionToInvocationSuccessLatencyAlarm.
 */
export interface EventBridgeRuleIngestionToInvocationSuccessLatencyAlarmProps
  extends EventBridgeRuleAlarmProps, EventBridgeRuleIngestionToInvocationSuccessLatencyAlarmConfig {}

/**
 * Time in milliseconds from ingestion to successful target delivery, including retries.
 *
 * AWS recommends monitoring this metric for rule delivery health.
 */
export class EventBridgeRuleIngestionToInvocationSuccessLatencyAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: EventBridgeRuleIngestionToInvocationSuccessLatencyAlarmProps) {
    const alarmName = props.alarmName ?? `${rulePath(props.rule)} - ${EventBridgeRecommendedAlarmsMetrics.INGESTION_TO_INVOCATION_SUCCESS_LATENCY}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: ruleMetric(props, EventBridgeRecommendedAlarmsMetrics.INGESTION_TO_INVOCATION_SUCCESS_LATENCY, { period, statistic: 'Average' }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 2,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects slow EventBridge target delivery, including delays caused by retries. Investigate target response times and throttling.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for EventBridgeRuleSuccessfulInvocationRateAlarm.
 */
export interface EventBridgeRuleSuccessfulInvocationRateAlarmConfig extends EventBridgeAlarmBaseConfig {
  /**
   * Minimum acceptable fraction of successful attempts, from zero to one.
   * Choose this from the application delivery-success requirement.
   */
  readonly threshold: number;
}

/**
 * Properties for EventBridgeRuleSuccessfulInvocationRateAlarm.
 */
export interface EventBridgeRuleSuccessfulInvocationRateAlarmProps
  extends EventBridgeRuleAlarmProps, EventBridgeRuleSuccessfulInvocationRateAlarmConfig {}

/**
 * Fraction of target invocation attempts that succeed, from zero to one.
 *
 * AWS recommends monitoring this metric for rule delivery health.
 */
export class EventBridgeRuleSuccessfulInvocationRateAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: EventBridgeRuleSuccessfulInvocationRateAlarmProps) {
    const alarmName = props.alarmName ?? `${rulePath(props.rule)} - ${EventBridgeRecommendedAlarmsMetrics.SUCCESSFUL_INVOCATION_RATE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.MathExpression({
        expression: 'successful / attempts',
        usingMetrics: {
          successful: ruleMetric(props, 'SuccessfulInvocationAttempts', { period, statistic: 'Sum' }),
          attempts: ruleMetric(props, 'InvocationAttempts', { period, statistic: 'Sum' }),
        },
        period,
      }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 2,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects a low fraction of successful EventBridge invocation attempts. Investigate retries, target capacity, and permissions.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for EventBridgeAnomalyAlarmBase.
 */
export interface EventBridgeAnomalyAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The width of the anomaly band in standard deviations.
   * @default 8
   */
  readonly stdDevs?: number;
  /**
   * The number of five-minute periods evaluated.
   * @default - Four periods for traffic; three for latency.
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of breaching periods required.
   * @default - One fewer than evaluationPeriods, with a minimum of one.
   */
  readonly datapointsToAlarm?: number;
  /**
   * The anomaly-band comparison operator.
   * @default - Upper band for latency; both bands for traffic.
   */
  readonly comparisonOperator?: AnomalyComparisonOperator;
  /**
   * The alarm name.
   * @default - Rule ARN path (including a custom-bus prefix) followed by the metric name and Anomaly.
   */
  readonly alarmName?: string;
  /**
   * The alarm description.
   * @default - Describes the anomaly and troubleshooting steps.
   */
  readonly alarmDescription?: string;
}

/**
 * Configuration for EventBridgeRuleTriggeredRulesAnomalyAlarm.
 */
export interface EventBridgeRuleTriggeredRulesAnomalyAlarmConfig extends EventBridgeAnomalyAlarmBaseConfig {}

/**
 * Properties for EventBridgeRuleTriggeredRulesAnomalyAlarm.
 */
export interface EventBridgeRuleTriggeredRulesAnomalyAlarmProps extends EventBridgeRuleAlarmProps, EventBridgeRuleTriggeredRulesAnomalyAlarmConfig {}

/**
 * Rule execution volume anomaly detection.
 *
 * Uses five-minute `Sum` values. Missing datapoints do not count as zero traffic.
 */
export class EventBridgeRuleTriggeredRulesAnomalyAlarm extends cloudwatch.AnomalyDetectionAlarm {
  constructor(scope: Construct, id: string, props: EventBridgeRuleTriggeredRulesAnomalyAlarmProps) {
    const alarmName = props.alarmName ?? `${rulePath(props.rule)} - ${EventBridgeRecommendedAlarmsMetrics.TRIGGERED_RULES_ANOMALY}`;
    const period = Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 4;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: ruleMetric(props, 'TriggeredRules', { period, statistic: 'Sum' }),
      stdDevs: props.stdDevs ?? 8,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? Math.max(1, evaluationPeriods - 1),
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING,
      comparisonOperator: props.comparisonOperator ?? cloudwatch.ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects unexpected changes in EventBridge rule execution volume. Review publishers and event patterns.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarm.
 */
export interface EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarmConfig extends EventBridgeAnomalyAlarmBaseConfig {}

/**
 * Properties for EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarm.
 */
export interface EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarmProps
  extends EventBridgeRuleAlarmProps, EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarmConfig {}

/**
 * Successful target delivery latency anomaly detection.
 *
 * Uses five-minute `Average` values for successful target deliveries.
 */
export class EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarm extends cloudwatch.AnomalyDetectionAlarm {
  constructor(scope: Construct, id: string, props: EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarmProps) {
    const alarmName = props.alarmName ?? `${rulePath(props.rule)} - ${EventBridgeRecommendedAlarmsMetrics.INGESTION_TO_INVOCATION_SUCCESS_LATENCY_ANOMALY}`;
    const period = Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: ruleMetric(props, 'IngestionToInvocationSuccessLatency', { period, statistic: 'Average' }),
      stdDevs: props.stdDevs ?? 8,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? Math.max(1, evaluationPeriods - 1),
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING,
      comparisonOperator: props.comparisonOperator ?? cloudwatch.ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects unusual increases in EventBridge target delivery latency relative to its historical baseline.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for EventBridgeRule recommended alarms.
 *
 * Individual alarm actions and missing-data settings override the bundle defaults.
 * Anomaly alarms are included unless excluded. Fixed latency/success-rate alarms require configuration.
 */
export interface EventBridgeRuleRecommendedAlarmsConfig {
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
   * @default - Not breaching for failure counters; missing for latency, success-rate, and anomaly alarms.
   */
  readonly treatMissingData?: cloudwatch.TreatMissingData;
  /**
   * Metrics to exclude.
   * @default - None.
   */
  readonly excludeAlarms?: EventBridgeRecommendedAlarmsMetrics[];
  /**
   * Resource construct IDs excluded by the Aspect.
   * @default - None.
   */
  readonly excludeResources?: string[];
  /**
   * Configuration for FailedInvocations.
   * @default - Alarm defaults.
   */
  readonly configFailedInvocationsAlarm?: EventBridgeRuleFailedInvocationsAlarmConfig;
  /**
   * Configuration for InvocationsSentToDlq.
   * @default - Alarm defaults.
   */
  readonly configInvocationsSentToDlqAlarm?: EventBridgeRuleInvocationsSentToDlqAlarmConfig;
  /**
   * Configuration for ThrottledRules.
   * @default - Alarm defaults.
   */
  readonly configThrottledRulesAlarm?: EventBridgeRuleThrottledRulesAlarmConfig;
  /**
   * Configuration for IngestionToInvocationSuccessLatency.
   * @default - Not created unless configured.
   */
  readonly configIngestionToInvocationSuccessLatencyAlarm?: EventBridgeRuleIngestionToInvocationSuccessLatencyAlarmConfig;
  /**
   * Configuration for SuccessfulInvocationRate.
   * @default - Not created unless configured.
   */
  readonly configSuccessfulInvocationRateAlarm?: EventBridgeRuleSuccessfulInvocationRateAlarmConfig;
  /**
   * Configuration for TriggeredRulesAnomaly.
   * @default - Alarm defaults; created unless excluded.
   */
  readonly configTriggeredRulesAnomalyAlarm?: EventBridgeRuleTriggeredRulesAnomalyAlarmConfig;
  /**
   * Configuration for IngestionToInvocationSuccessLatencyAnomaly.
   * @default - Alarm defaults; created unless excluded.
   */
  readonly configIngestionToInvocationSuccessLatencyAnomalyAlarm?: EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarmConfig;
}

/**
 * Properties for EventBridgeRuleRecommendedAlarms.
 */
export interface EventBridgeRuleRecommendedAlarmsProps extends EventBridgeRuleAlarmProps, EventBridgeRuleRecommendedAlarmsConfig {}

/**
 * Creates the configured alarms for a rule.
 */
export class EventBridgeRuleRecommendedAlarms extends Construct {
  /**
   * The FailedInvocations alarm, if enabled.
   */
  public readonly alarmFailedInvocations?: EventBridgeRuleFailedInvocationsAlarm;
  /**
   * The InvocationsSentToDlq alarm, if enabled.
   */
  public readonly alarmInvocationsSentToDlq?: EventBridgeRuleInvocationsSentToDlqAlarm;
  /**
   * The ThrottledRules alarm, if enabled.
   */
  public readonly alarmThrottledRules?: EventBridgeRuleThrottledRulesAlarm;
  /**
   * The IngestionToInvocationSuccessLatency alarm, if enabled.
   */
  public readonly alarmIngestionToInvocationSuccessLatency?: EventBridgeRuleIngestionToInvocationSuccessLatencyAlarm;
  /**
   * The SuccessfulInvocationRate alarm, if enabled.
   */
  public readonly alarmSuccessfulInvocationRate?: EventBridgeRuleSuccessfulInvocationRateAlarm;
  /**
   * The TriggeredRulesAnomaly alarm, if enabled.
   */
  public readonly alarmTriggeredRulesAnomaly?: EventBridgeRuleTriggeredRulesAnomalyAlarm;
  /**
   * The IngestionToInvocationSuccessLatencyAnomaly alarm, if enabled.
   */
  public readonly alarmIngestionToInvocationSuccessLatencyAnomaly?: EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarm;

  constructor(scope: Construct, id: string, props: EventBridgeRuleRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(EventBridgeRecommendedAlarmsMetrics.FAILED_INVOCATIONS)) {
      this.alarmFailedInvocations = new EventBridgeRuleFailedInvocationsAlarm(this, 'FailedInvocationsAlarm', {
        rule: props.rule,
        eventBus: props.eventBus,
        treatMissingData: props.treatMissingData,
        ...props.configFailedInvocationsAlarm,
      });
      if (props.defaultAlarmAction && !props.configFailedInvocationsAlarm?.alarmAction) {
        this.alarmFailedInvocations.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configFailedInvocationsAlarm?.okAction) {
        this.alarmFailedInvocations.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configFailedInvocationsAlarm?.insufficientDataAction) {
        this.alarmFailedInvocations.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(EventBridgeRecommendedAlarmsMetrics.INVOCATIONS_SENT_TO_DLQ)) {
      this.alarmInvocationsSentToDlq = new EventBridgeRuleInvocationsSentToDlqAlarm(this, 'InvocationsSentToDlqAlarm', {
        rule: props.rule,
        eventBus: props.eventBus,
        treatMissingData: props.treatMissingData,
        ...props.configInvocationsSentToDlqAlarm,
      });
      if (props.defaultAlarmAction && !props.configInvocationsSentToDlqAlarm?.alarmAction) {
        this.alarmInvocationsSentToDlq.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configInvocationsSentToDlqAlarm?.okAction) {
        this.alarmInvocationsSentToDlq.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configInvocationsSentToDlqAlarm?.insufficientDataAction) {
        this.alarmInvocationsSentToDlq.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(EventBridgeRecommendedAlarmsMetrics.THROTTLED_RULES)) {
      this.alarmThrottledRules = new EventBridgeRuleThrottledRulesAlarm(this, 'ThrottledRulesAlarm', {
        rule: props.rule,
        eventBus: props.eventBus,
        treatMissingData: props.treatMissingData,
        ...props.configThrottledRulesAlarm,
      });
      if (props.defaultAlarmAction && !props.configThrottledRulesAlarm?.alarmAction) {
        this.alarmThrottledRules.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configThrottledRulesAlarm?.okAction) {
        this.alarmThrottledRules.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configThrottledRulesAlarm?.insufficientDataAction) {
        this.alarmThrottledRules.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (props.configIngestionToInvocationSuccessLatencyAlarm &&
      !props.excludeAlarms?.includes(EventBridgeRecommendedAlarmsMetrics.INGESTION_TO_INVOCATION_SUCCESS_LATENCY)) {
      this.alarmIngestionToInvocationSuccessLatency = new EventBridgeRuleIngestionToInvocationSuccessLatencyAlarm(this, 'IngestionToInvocationSuccessLatencyAlarm', {
        rule: props.rule,
        eventBus: props.eventBus,
        treatMissingData: props.treatMissingData,
        ...props.configIngestionToInvocationSuccessLatencyAlarm,
      });
      if (props.defaultAlarmAction && !props.configIngestionToInvocationSuccessLatencyAlarm?.alarmAction) {
        this.alarmIngestionToInvocationSuccessLatency.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configIngestionToInvocationSuccessLatencyAlarm?.okAction) {
        this.alarmIngestionToInvocationSuccessLatency.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configIngestionToInvocationSuccessLatencyAlarm?.insufficientDataAction) {
        this.alarmIngestionToInvocationSuccessLatency.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (props.configSuccessfulInvocationRateAlarm && !props.excludeAlarms?.includes(EventBridgeRecommendedAlarmsMetrics.SUCCESSFUL_INVOCATION_RATE)) {
      this.alarmSuccessfulInvocationRate = new EventBridgeRuleSuccessfulInvocationRateAlarm(this, 'SuccessfulInvocationRateAlarm', {
        rule: props.rule,
        eventBus: props.eventBus,
        treatMissingData: props.treatMissingData,
        ...props.configSuccessfulInvocationRateAlarm,
      });
      if (props.defaultAlarmAction && !props.configSuccessfulInvocationRateAlarm?.alarmAction) {
        this.alarmSuccessfulInvocationRate.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configSuccessfulInvocationRateAlarm?.okAction) {
        this.alarmSuccessfulInvocationRate.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configSuccessfulInvocationRateAlarm?.insufficientDataAction) {
        this.alarmSuccessfulInvocationRate.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(EventBridgeRecommendedAlarmsMetrics.TRIGGERED_RULES_ANOMALY)) {
      this.alarmTriggeredRulesAnomaly = new EventBridgeRuleTriggeredRulesAnomalyAlarm(this, 'TriggeredRulesAnomalyAlarm', {
        rule: props.rule,
        eventBus: props.eventBus,
        treatMissingData: props.treatMissingData,
        ...props.configTriggeredRulesAnomalyAlarm,
      });
      if (props.defaultAlarmAction && !props.configTriggeredRulesAnomalyAlarm?.alarmAction) {
        this.alarmTriggeredRulesAnomaly.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configTriggeredRulesAnomalyAlarm?.okAction) {
        this.alarmTriggeredRulesAnomaly.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configTriggeredRulesAnomalyAlarm?.insufficientDataAction) {
        this.alarmTriggeredRulesAnomaly.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(EventBridgeRecommendedAlarmsMetrics.INGESTION_TO_INVOCATION_SUCCESS_LATENCY_ANOMALY)) {
      this.alarmIngestionToInvocationSuccessLatencyAnomaly = new EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarm(this, 'IngestionToInvocationSuccessLatencyAnomalyAlarm', {
        rule: props.rule,
        eventBus: props.eventBus,
        treatMissingData: props.treatMissingData,
        ...props.configIngestionToInvocationSuccessLatencyAnomalyAlarm,
      });
      if (props.defaultAlarmAction && !props.configIngestionToInvocationSuccessLatencyAnomalyAlarm?.alarmAction) {
        this.alarmIngestionToInvocationSuccessLatencyAnomaly.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configIngestionToInvocationSuccessLatencyAnomalyAlarm?.okAction) {
        this.alarmIngestionToInvocationSuccessLatencyAnomaly.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configIngestionToInvocationSuccessLatencyAnomalyAlarm?.insufficientDataAction) {
        this.alarmIngestionToInvocationSuccessLatencyAnomaly.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An opt-in Rule extension with alarm convenience methods.
 *
 * Creating the resource alone does not create any alarms.
 */
export class Rule extends events.Rule {
  constructor(scope: Construct, id: string, props?: events.RuleProps) {
    super(scope, id, props);
  }

  /**
   * Creates the FailedInvocations alarm.
   */
  public alarmFailedInvocations(props?: EventBridgeRuleFailedInvocationsAlarmConfig): EventBridgeRuleFailedInvocationsAlarm {
    return new EventBridgeRuleFailedInvocationsAlarm(this, 'FailedInvocationsAlarm', { rule: this, ...props });
  }

  /**
   * Creates the InvocationsSentToDlq alarm.
   */
  public alarmInvocationsSentToDlq(props?: EventBridgeRuleInvocationsSentToDlqAlarmConfig): EventBridgeRuleInvocationsSentToDlqAlarm {
    return new EventBridgeRuleInvocationsSentToDlqAlarm(this, 'InvocationsSentToDlqAlarm', { rule: this, ...props });
  }

  /**
   * Creates the ThrottledRules alarm.
   */
  public alarmThrottledRules(props?: EventBridgeRuleThrottledRulesAlarmConfig): EventBridgeRuleThrottledRulesAlarm {
    return new EventBridgeRuleThrottledRulesAlarm(this, 'ThrottledRulesAlarm', { rule: this, ...props });
  }

  /**
   * Creates the IngestionToInvocationSuccessLatency alarm.
   */
  public alarmIngestionToInvocationSuccessLatency(
    props: EventBridgeRuleIngestionToInvocationSuccessLatencyAlarmConfig,
  ): EventBridgeRuleIngestionToInvocationSuccessLatencyAlarm {
    return new EventBridgeRuleIngestionToInvocationSuccessLatencyAlarm(this, 'IngestionToInvocationSuccessLatencyAlarm', { rule: this, ...props });
  }

  /**
   * Creates the SuccessfulInvocationRate alarm.
   */
  public alarmSuccessfulInvocationRate(props: EventBridgeRuleSuccessfulInvocationRateAlarmConfig): EventBridgeRuleSuccessfulInvocationRateAlarm {
    return new EventBridgeRuleSuccessfulInvocationRateAlarm(this, 'SuccessfulInvocationRateAlarm', { rule: this, ...props });
  }

  /**
   * Creates the TriggeredRulesAnomaly alarm.
   */
  public alarmTriggeredRulesAnomaly(props?: EventBridgeRuleTriggeredRulesAnomalyAlarmConfig): EventBridgeRuleTriggeredRulesAnomalyAlarm {
    return new EventBridgeRuleTriggeredRulesAnomalyAlarm(this, 'TriggeredRulesAnomalyAlarm', { rule: this, ...props });
  }

  /**
   * Creates the IngestionToInvocationSuccessLatencyAnomaly alarm.
   */
  public alarmIngestionToInvocationSuccessLatencyAnomaly(
    props?: EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarmConfig,
  ): EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarm {
    return new EventBridgeRuleIngestionToInvocationSuccessLatencyAnomalyAlarm(this, 'IngestionToInvocationSuccessLatencyAnomalyAlarm', { rule: this, ...props });
  }

  /** Applies the configured alarm bundle to this resource. */
  public applyRecommendedAlarms(props: EventBridgeRuleRecommendedAlarmsConfig = {}): EventBridgeRuleRecommendedAlarms {
    return new EventBridgeRuleRecommendedAlarms(this, 'EventBridgeRuleRecommendedAlarms', { rule: this, ...props });
  }
}

/**
 * Applies the configured alarms to owned EventBridge rules.
 */
export class EventBridgeRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: EventBridgeRuleRecommendedAlarmsConfig = {}) {}

  public visit(node: IConstruct): void {
    if (!(node instanceof events.Rule)) return;
    if (this.props.excludeResources?.includes(node.node.id)) return;
    new EventBridgeRuleRecommendedAlarms(node, 'EventBridgeRuleRecommendedAlarmsFromAspect', { rule: node, ...this.props });
  }
}
