import {
  Duration,
  aws_cloudwatch as cloudwatch,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * Metrics supported by the Cloud WAN attachment alarms.
 */
export enum CloudWanAttachmentRecommendedAlarmsMetrics {
  /**
   * Packets dropped because they did not match a route.
   */
  PACKET_DROP_COUNT_NO_ROUTE = 'PacketDropCountNoRoute',
  /**
   * Packets dropped because they matched a `blackhole` route.
   */
  PACKET_DROP_COUNT_BLACKHOLE = 'PacketDropCountBlackhole',
}

/**
 * Identifies the Cloud WAN attachment to monitor.
 * Cloud WAN publishes attachment metrics with `CoreNetwork` and `Attachment` dimensions whose values are the bare IDs, not ARNs.
 */
export interface CloudWanAttachmentAlarmProps {
  /**
   * The core network ID, such as `core-network-0123456789abcdef0`.
   * CDK exposes this as `CfnCoreNetwork.attrCoreNetworkId`.
   */
  readonly coreNetworkId: string;
  /**
   * The attachment ID, such as `attachment-0123456789abcdef0`.
   * CDK exposes this as `CfnVpcAttachment.attrAttachmentId`.
   */
  readonly attachmentId: string;
}

/**
 * Common optional configuration for Cloud WAN attachment alarms.
 */
export interface CloudWanAttachmentAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the `Sum` statistic is applied.
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
  /**
   * The number of periods over which data is compared to the threshold.
   * @default 5
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of breaching data points required to trigger the alarm.
   * @default 5
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   * @default - Attachment ID followed by the metric name.
   */
  readonly alarmName?: string;
  /**
   * The alarm description.
   * @default - Describes the packet drop reason and routing checks.
   */
  readonly alarmDescription?: string;
}

/**
 * Creates attachment-level Cloud WAN metrics using the `Sum` statistic.
 * The namespace contains a space (`AWS/Network Manager`), unlike the service name.
 */
function cloudWanAttachmentMetric(props: CloudWanAttachmentAlarmProps, metricName: string, period: Duration): cloudwatch.Metric {
  return new cloudwatch.Metric({
    namespace: 'AWS/Network Manager',
    metricName,
    dimensionsMap: {
      CoreNetwork: props.coreNetworkId,
      Attachment: props.attachmentId,
    },
    period,
    statistic: 'Sum',
  });
}

/**
 * Configuration for the `PacketDropCountNoRoute` alarm.
 */
export interface CloudWanAttachmentPacketDropCountNoRouteAlarmConfig extends CloudWanAttachmentAlarmBaseConfig {
  /**
   * The dropped packet count above which the alarm triggers.
   * Set this from the attachment's traffic baseline; AWS recommends no fixed threshold.
   */
  readonly threshold: number;
}

/**
 * Properties for `CloudWanAttachmentPacketDropCountNoRouteAlarm`.
 */
export interface CloudWanAttachmentPacketDropCountNoRouteAlarmProps extends
  CloudWanAttachmentAlarmProps, CloudWanAttachmentPacketDropCountNoRouteAlarmConfig {}

/**
 * Detects packets dropped because they did not match a route.
 * Defaults to five breaching one-minute periods, matching the library's PrivateLink packet-drop timing.
 * Create this alarm in the Region where Cloud WAN publishes metrics (`us-west-2` for commercial Regions),
 * with alarm actions in the same Region.
 *
 * @see https://docs.aws.amazon.com/network-manager/latest/cloudwan/cloudwan-metrics.html
 * @see https://docs.aws.amazon.com/network-manager/latest/cloudwan/cloudwan-cloudwatch-metrics.html
 */
export class CloudWanAttachmentPacketDropCountNoRouteAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: CloudWanAttachmentPacketDropCountNoRouteAlarmProps) {
    const alarmName = props.alarmName ?? `${props.attachmentId} - ${CloudWanAttachmentRecommendedAlarmsMetrics.PACKET_DROP_COUNT_NO_ROUTE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: cloudWanAttachmentMetric(props, CloudWanAttachmentRecommendedAlarmsMetrics.PACKET_DROP_COUNT_NO_ROUTE, period),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 5,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects packets dropped because they did not match a route. Check attachment route propagation and core network routing policies.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the `PacketDropCountBlackhole` alarm.
 */
export interface CloudWanAttachmentPacketDropCountBlackholeAlarmConfig extends CloudWanAttachmentAlarmBaseConfig {
  /**
   * The dropped packet count above which the alarm triggers.
   * Set this from the attachment's traffic baseline; AWS recommends no fixed threshold.
   */
  readonly threshold: number;
}

/**
 * Properties for `CloudWanAttachmentPacketDropCountBlackholeAlarm`.
 */
export interface CloudWanAttachmentPacketDropCountBlackholeAlarmProps extends
  CloudWanAttachmentAlarmProps, CloudWanAttachmentPacketDropCountBlackholeAlarmConfig {}

/**
 * Detects packets dropped because they matched a `blackhole` route.
 * Defaults to five breaching one-minute periods, matching the library's PrivateLink packet-drop timing.
 * Create this alarm in the Region where Cloud WAN publishes metrics (`us-west-2` for commercial Regions),
 * with alarm actions in the same Region.
 *
 * @see https://docs.aws.amazon.com/network-manager/latest/cloudwan/cloudwan-metrics.html
 * @see https://docs.aws.amazon.com/network-manager/latest/cloudwan/cloudwan-cloudwatch-metrics.html
 */
export class CloudWanAttachmentPacketDropCountBlackholeAlarm extends cloudwatch.Alarm {
  constructor(scope: Construct, id: string, props: CloudWanAttachmentPacketDropCountBlackholeAlarmProps) {
    const alarmName = props.alarmName ?? `${props.attachmentId} - ${CloudWanAttachmentRecommendedAlarmsMetrics.PACKET_DROP_COUNT_BLACKHOLE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: cloudWanAttachmentMetric(props, CloudWanAttachmentRecommendedAlarmsMetrics.PACKET_DROP_COUNT_BLACKHOLE, period),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 5,
      treatMissingData: props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'Detects packets dropped because they matched a blackhole route. Check core network blackhole routes and whether the dropped traffic is expected.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configurations for Cloud WAN attachment alarms.
 * Individual alarm actions and `treatMissingData` override the bundle defaults.
 */
export interface CloudWanAttachmentRecommendedAlarmsConfig {
  /**
   * The default action when an alarm is triggered, in the alarm's Region.
   * @default - None.
   */
  readonly defaultAlarmAction?: cloudwatch.IAlarmAction;
  /**
   * The default action when an alarm enters the OK state, in the alarm's Region.
   * @default - None.
   */
  readonly defaultOkAction?: cloudwatch.IAlarmAction;
  /**
   * The default action when an alarm has insufficient data, in the alarm's Region.
   * @default - None.
   */
  readonly defaultInsufficientDataAction?: cloudwatch.IAlarmAction;
  /**
   * How to handle missing data, unless overridden by an individual alarm.
   * @default TreatMissingData.MISSING
   */
  readonly treatMissingData?: cloudwatch.TreatMissingData;
  /**
   * Alarm metrics to exclude.
   * @default - None.
   */
  readonly excludeAlarms?: CloudWanAttachmentRecommendedAlarmsMetrics[];
  /**
   * Configuration for the `PacketDropCountNoRoute` alarm, including its required threshold.
   */
  readonly configPacketDropCountNoRouteAlarm: CloudWanAttachmentPacketDropCountNoRouteAlarmConfig;
  /**
   * Configuration for the `PacketDropCountBlackhole` alarm, including its required threshold.
   */
  readonly configPacketDropCountBlackholeAlarm: CloudWanAttachmentPacketDropCountBlackholeAlarmConfig;
}

/**
 * Properties for `CloudWanAttachmentRecommendedAlarms`.
 */
export interface CloudWanAttachmentRecommendedAlarmsProps extends
  CloudWanAttachmentAlarmProps, CloudWanAttachmentRecommendedAlarmsConfig {}

/**
 * Creates both Cloud WAN attachment packet-drop alarms unless excluded.
 * Create this construct in the Region where Cloud WAN publishes metrics (`us-west-2` for commercial Regions),
 * with alarm actions in the same Region.
 * No Aspect is provided because the attachment can be in a different Region.
 *
 * @see https://docs.aws.amazon.com/network-manager/latest/cloudwan/cloudwan-cloudwatch-metrics.html
 */
export class CloudWanAttachmentRecommendedAlarms extends Construct {
  /**
   * The `PacketDropCountNoRoute` alarm, unless excluded.
   */
  public readonly alarmPacketDropCountNoRoute?: CloudWanAttachmentPacketDropCountNoRouteAlarm;
  /**
   * The `PacketDropCountBlackhole` alarm, unless excluded.
   */
  public readonly alarmPacketDropCountBlackhole?: CloudWanAttachmentPacketDropCountBlackholeAlarm;

  constructor(scope: Construct, id: string, props: CloudWanAttachmentRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(CloudWanAttachmentRecommendedAlarmsMetrics.PACKET_DROP_COUNT_NO_ROUTE)) {
      this.alarmPacketDropCountNoRoute = new CloudWanAttachmentPacketDropCountNoRouteAlarm(this, 'PacketDropCountNoRouteAlarm', {
        coreNetworkId: props.coreNetworkId,
        attachmentId: props.attachmentId,
        treatMissingData: props.treatMissingData,
        ...props.configPacketDropCountNoRouteAlarm,
      });
      if (props.defaultAlarmAction && !props.configPacketDropCountNoRouteAlarm.alarmAction) {
        this.alarmPacketDropCountNoRoute.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configPacketDropCountNoRouteAlarm.okAction) {
        this.alarmPacketDropCountNoRoute.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configPacketDropCountNoRouteAlarm.insufficientDataAction) {
        this.alarmPacketDropCountNoRoute.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(CloudWanAttachmentRecommendedAlarmsMetrics.PACKET_DROP_COUNT_BLACKHOLE)) {
      this.alarmPacketDropCountBlackhole = new CloudWanAttachmentPacketDropCountBlackholeAlarm(this, 'PacketDropCountBlackholeAlarm', {
        coreNetworkId: props.coreNetworkId,
        attachmentId: props.attachmentId,
        treatMissingData: props.treatMissingData,
        ...props.configPacketDropCountBlackholeAlarm,
      });
      if (props.defaultAlarmAction && !props.configPacketDropCountBlackholeAlarm.alarmAction) {
        this.alarmPacketDropCountBlackhole.addAlarmAction(props.defaultAlarmAction);
      }
      if (props.defaultOkAction && !props.configPacketDropCountBlackholeAlarm.okAction) {
        this.alarmPacketDropCountBlackhole.addOkAction(props.defaultOkAction);
      }
      if (props.defaultInsufficientDataAction && !props.configPacketDropCountBlackholeAlarm.insufficientDataAction) {
        this.alarmPacketDropCountBlackhole.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}
