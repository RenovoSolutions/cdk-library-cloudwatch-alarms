import {
  IAspect,
  Duration,
  Validations,
  aws_ec2 as ec2,
  aws_cloudwatch as cloudwatch,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

const NAT_GATEWAY_SKIPPED_WARNING_ID = '@renovosolutions/cdk-library-cloudwatch-alarms:natGatewaySkipped';

/**
 * Metrics supported by the NAT gateway alarms.
 */
export enum NatGatewayRecommendedAlarmsMetrics {
  /**
   * The number of times the NAT gateway could not allocate a source port.
   */
  ERROR_PORT_ALLOCATION = 'ErrorPortAllocation',
  /**
   * Dropped packets as a percentage of packets received by the NAT gateway.
   */
  PACKETS_DROP_COUNT = 'PacketsDropCount',
}

/**
 * The resource monitored by the NAT gateway alarms.
 */
export interface NatGatewayAlarmProps {
  /**
   * The zonal NAT gateway to monitor, including imported gateways.
   */
  readonly natGateway: ec2.INatGatewayRef;
}

/**
 * The common optional configuration for NAT gateway alarms.
 */
export interface NatGatewayAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
  /**
   * The number of periods over which data is compared to the specified threshold.
   * @default - Fifteen for port allocation errors; five for packet drops.
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   * @default - Same as `evaluationPeriods`.
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   * @default - NAT gateway ID followed by the metric name.
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   * @default - Describes the metric and troubleshooting steps.
   */
  readonly alarmDescription?: string;
}

/** Creates zonal NAT gateway metrics using the `Sum` statistic. */
function natGatewayMetric(natGateway: ec2.INatGatewayRef, metricName: string, period: Duration): cloudwatch.Metric {
  return new cloudwatch.Metric({
    namespace: 'AWS/NATGateway',
    metricName,
    dimensionsMap: { NatGatewayId: natGateway.natGatewayRef.natGatewayId },
    period,
    statistic: 'Sum',
  });
}

/**
 * Configuration for the `ErrorPortAllocation` alarm.
 */
export interface NatGatewayErrorPortAllocationAlarmConfig extends NatGatewayAlarmBaseConfig {
  /**
   * The port allocation error count above which the alarm triggers.
   * @default 0
   */
  readonly threshold?: number;
}

/**
 * Properties for `NatGatewayErrorPortAllocationAlarm`.
 */
export interface NatGatewayErrorPortAllocationAlarmProps extends NatGatewayAlarmProps, NatGatewayErrorPortAllocationAlarmConfig {}

/**
 * Detects when a zonal NAT gateway cannot allocate source ports for new connections.
 * Defaults to fifteen breaching one-minute periods, following AWS recommendations.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html
 */
export class NatGatewayErrorPortAllocationAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: NatGatewayErrorPortAllocationAlarmProps) {
    const alarmName = props.alarmName ?? `${props.natGateway.natGatewayRef.natGatewayId} - ${NatGatewayRecommendedAlarmsMetrics.ERROR_PORT_ALLOCATION}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: natGatewayMetric(props.natGateway, NatGatewayRecommendedAlarmsMetrics.ERROR_PORT_ALLOCATION, period),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? evaluationPeriods,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects when the NAT gateway cannot allocate source ports for new connections. Review concurrent connections to popular destinations and NAT gateway address capacity.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the `PacketsDropCount` percentage alarm.
 */
export interface NatGatewayPacketsDropCountAlarmConfig extends NatGatewayAlarmBaseConfig {
  /**
   * The percentage of received packets dropped above which the alarm triggers.
   * A value of `0.01` means `0.01%`, not a fraction of `0.01`.
   * @default 0.01
   */
  readonly threshold?: number;
}

/**
 * Properties for `NatGatewayPacketsDropCountAlarm`.
 */
export interface NatGatewayPacketsDropCountAlarmProps extends NatGatewayAlarmProps, NatGatewayPacketsDropCountAlarmConfig {}

/**
 * Detects packet drops using `100 * PacketsDropCount / (PacketsInFromSource + PacketsInFromDestination)`.
 * Defaults to five breaching one-minute periods. A zero denominator produces missing data.
 *
 * @see https://docs.aws.amazon.com/vpc/latest/userguide/metrics-dimensions-nat-gateway.html
 */
export class NatGatewayPacketsDropCountAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: NatGatewayPacketsDropCountAlarmProps) {
    const alarmName = props.alarmName ?? `${props.natGateway.natGatewayRef.natGatewayId} - ${NatGatewayRecommendedAlarmsMetrics.PACKETS_DROP_COUNT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.MathExpression({
        expression: '100 * packetsDropCount / (packetsInFromSource + packetsInFromDestination)',
        usingMetrics: {
          packetsDropCount: natGatewayMetric(props.natGateway, NatGatewayRecommendedAlarmsMetrics.PACKETS_DROP_COUNT, period),
          packetsInFromSource: natGatewayMetric(props.natGateway, 'PacketsInFromSource', period),
          packetsInFromDestination: natGatewayMetric(props.natGateway, 'PacketsInFromDestination', period),
        },
        period,
      }),
      threshold: props.threshold ?? 0.01,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? evaluationPeriods,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects when the percentage of packets dropped by the NAT gateway exceeds the threshold. Check AWS service health for NAT gateway issues in the Region.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configurations for the recommended NAT gateway alarms.
 * Individual alarm actions and missing-data settings override the defaults.
 */
export interface NatGatewayRecommendedAlarmsConfig {
  /**
   * The default action to take when an alarm is triggered.
   * @default - None.
   */
  readonly defaultAlarmAction?: cloudwatch.IAlarmAction;
  /**
   * The default action to take when an alarm enters the ok state.
   * @default - None.
   */
  readonly defaultOkAction?: cloudwatch.IAlarmAction;
  /**
   * The default action to take when an alarm has insufficient data.
   * @default - None.
   */
  readonly defaultInsufficientDataAction?: cloudwatch.IAlarmAction;
  /**
   * How to handle missing data, unless overridden by an individual alarm.
   * @default TreatMissingData.MISSING
   */
  readonly treatMissingData?: cloudwatch.TreatMissingData;
  /**
   * Alarm metrics to exclude, including configured optional alarms.
   * @default - None.
   */
  readonly excludeAlarms?: NatGatewayRecommendedAlarmsMetrics[];
  /**
   * Resource construct IDs excluded by the Aspect.
   * @default - None.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the `ErrorPortAllocation` alarm.
   * @default - Alarm defaults; created unless excluded.
   */
  readonly configErrorPortAllocationAlarm?: NatGatewayErrorPortAllocationAlarmConfig;
  /**
   * The configuration for the `PacketsDropCount` percentage alarm.
   * @default - Not created unless configured.
   */
  readonly configPacketsDropCountAlarm?: NatGatewayPacketsDropCountAlarmConfig;
}

/**
 * Properties for `NatGatewayRecommendedAlarms`.
 */
export interface NatGatewayRecommendedAlarmsProps extends NatGatewayAlarmProps, NatGatewayRecommendedAlarmsConfig {}

/**
 * Creates the configured alarms for a zonal NAT gateway.
 */
export class NatGatewayRecommendedAlarms extends Construct {
  /**
   * The `ErrorPortAllocation` alarm, if enabled.
   */
  public readonly alarmErrorPortAllocation?: NatGatewayErrorPortAllocationAlarm;
  /**
   * The `PacketsDropCount` percentage alarm, if configured and not excluded.
   */
  public readonly alarmPacketsDropCount?: NatGatewayPacketsDropCountAlarm;

  constructor(scope: Construct, id: string, props: NatGatewayRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(NatGatewayRecommendedAlarmsMetrics.ERROR_PORT_ALLOCATION)) {
      this.alarmErrorPortAllocation = new NatGatewayErrorPortAllocationAlarm(this, 'ErrorPortAllocationAlarm', {
        natGateway: props.natGateway,
        treatMissingData: props.treatMissingData,
        ...props.configErrorPortAllocationAlarm,
      });
      if (props.defaultAlarmAction && !props.configErrorPortAllocationAlarm?.alarmAction) {
        this.alarmErrorPortAllocation.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configErrorPortAllocationAlarm?.okAction) {
        this.alarmErrorPortAllocation.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configErrorPortAllocationAlarm?.insufficientDataAction) {
        this.alarmErrorPortAllocation.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (props.configPacketsDropCountAlarm && !props.excludeAlarms?.includes(NatGatewayRecommendedAlarmsMetrics.PACKETS_DROP_COUNT)) {
      this.alarmPacketsDropCount = new NatGatewayPacketsDropCountAlarm(this, 'PacketsDropCountAlarm', {
        natGateway: props.natGateway,
        treatMissingData: props.treatMissingData,
        ...props.configPacketsDropCountAlarm,
      });
      if (props.defaultAlarmAction && !props.configPacketsDropCountAlarm.alarmAction) {
        this.alarmPacketsDropCount.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configPacketsDropCountAlarm.okAction) {
        this.alarmPacketsDropCount.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configPacketsDropCountAlarm.insufficientDataAction) {
        this.alarmPacketsDropCount.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * Applies recommended alarms to zonal `ec2.CfnNatGateway` resources.
 * Regional gateways and gateways without a subnet are skipped with a warning.
 */
export class NatGatewayRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props?: NatGatewayRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (!(node instanceof ec2.CfnNatGateway)) return;
    if (this.props?.excludeResources?.includes(node.node.id)) return;

    if (node.availabilityMode === 'regional' || node.subnetId === undefined) {
      Validations.of(node).addWarning(NAT_GATEWAY_SKIPPED_WARNING_ID, 'NAT gateway alarms skipped: regional gateways or gateways without a single-AZ subnet are not supported. Regional metrics require both NatGatewayId and AvailabilityZone dimensions.');
      return;
    }

    new NatGatewayRecommendedAlarms(node, 'NatGatewayRecommendedAlarmsFromAspect', {
      natGateway: node,
      ...this.props,
    });
  }
}
