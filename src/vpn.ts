import {
  IAspect,
  aws_ec2 as ec2,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for VPN alarms.
 */
export enum VpnRecommendedAlarmsMetrics {
  /**
   * Percentage of how close a file system is to reaching the I/O limit of the General Purpose
   * performance mode.
   */
  TUNNEL_STATE = 'TunnelState',
}

/**
 * The common optional configuration for the alarms.
 */
export interface VpnAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(5)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the VpnConnection alarms.
 */
export interface VpnConnectionAlarmProps {
  /**
   * The VpnConnection to monitor.
   */
  readonly vpnConnection: ec2.CfnVPNConnection;
}

/**
 * Configuration for the TunnelState alarm.
 */
export interface VpnTunnelStateAlarmConfig extends VpnAlarmBaseConfig {
  /**
   * A value less than 1 indicates that at least one tunnel is in DOWN state.
   *
   * @default 1
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
   * @default - vpnConnectionId + ' - TunnelState'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect if at least one tunnel is in the DOWN state for this VPN, so that you can troubleshoot
   * the impacted VPN. This alarm will always be in the ALARM state for networks that only have a single tunnel configured.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the VpnConnectionTunnelStateAlarm construct.
 */
export interface VpnConnectionTunnelStateAlarmProps extends VpnConnectionAlarmProps, VpnTunnelStateAlarmConfig {}

/**
 * This alarm helps you understand if the state of one or more tunnels is DOWN.
 *
 * For troubleshooting, see VPN tunnel troubleshooting.
 *
 * The alarm is triggered when the monitored value is less than 1.
 */
export class VpnConnectionTunnelStateAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: VpnConnectionTunnelStateAlarmProps) {
    const alarmName = props.alarmName ?? `${props.vpnConnection.ref} - ${VpnRecommendedAlarmsMetrics.TUNNEL_STATE}`;
    const period = props.period ?? Duration.minutes(5);
    const evaluationPeriods = props.evaluationPeriods ?? 3;
    const datapointsToAlarm = props.datapointsToAlarm ?? 3;
    const threshold = props.threshold ?? 1;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect if at least one tunnel is in the DOWN state for this VPN,'
      + ' so that you can troubleshoot the impacted VPN. This alarm will always be in the ALARM state for networks that only have a single tunnel configured.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/VPN',
        metricName: VpnRecommendedAlarmsMetrics.TUNNEL_STATE,
        dimensionsMap: {
          VpnId: props.vpnConnection.ref,
        },
        period,
        statistic: 'Minimum',
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
 * Configurations for the recommended alarms for an VPN Service.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface VpnConnectionRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: VpnRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the TunnelState alarm.
   */
  readonly configTunnelStateAlarm?: VpnTunnelStateAlarmConfig;
}

/**
 * Properties for the VpnConnectionRecommendedAlarms construct.
 */
export interface VpnConnectionRecommendedAlarmsProps extends VpnConnectionRecommendedAlarmsConfig {
  /**
   * The VpnConnection to monitor.
   */
  readonly vpnConnection: ec2.CfnVPNConnection;
}

/**
 * A construct that creates the recommended alarms for an VpnConnection.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#VPN
 */
export class VpnConnectionRecommendedAlarms extends Construct {
  /**
   * The TunnelState alarm.
   */
  public readonly alarmTunnelState?: VpnConnectionTunnelStateAlarm;

  constructor(scope: Construct, id: string, props: VpnConnectionRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(VpnRecommendedAlarmsMetrics.TUNNEL_STATE)) {
      this.alarmTunnelState = new VpnConnectionTunnelStateAlarm(this, `${props.vpnConnection.node.id}_TunnelState`, {
        vpnConnection: props.vpnConnection,
        ...props.configTunnelStateAlarm,
      });

      if (
        props.defaultAlarmAction &&
        (!props.configTunnelStateAlarm || !props.configTunnelStateAlarm.alarmAction)
      ) {
        this.alarmTunnelState.addAlarmAction(props.defaultAlarmAction);
      }

      if (
        props.defaultOkAction &&
        (!props.configTunnelStateAlarm || !props.configTunnelStateAlarm.okAction)
      ) {
        this.alarmTunnelState.addOkAction(props.defaultOkAction);
      }

      if (
        props.defaultInsufficientDataAction &&
        (!props.configTunnelStateAlarm || !props.configTunnelStateAlarm.insufficientDataAction)
      ) {
        this.alarmTunnelState.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the CfnVPNConnection construct that provides methods
 * to create recommended alarms.
 */
export class VpnConnection extends ec2.CfnVPNConnection {
  constructor(scope: Construct, id: string, props: ec2.CfnVPNConnectionProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the TunnelState for the VPN vpnConnection.
   */
  public alarmTunnelState(props?: VpnTunnelStateAlarmConfig): VpnConnectionTunnelStateAlarm {
    return new VpnConnectionTunnelStateAlarm(this, 'TunnelStateAlarm', {
      vpnConnection: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the VpnConnection.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#VPN
   */
  public applyRecommendedAlarms(props?: VpnConnectionRecommendedAlarmsConfig): VpnConnectionRecommendedAlarms {
    return new VpnConnectionRecommendedAlarms(this, 'VpnConnectionRecommendedAlarms', {
      vpnConnection: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an VpnConnection.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#VPN
 */
export class VpnRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props?: VpnConnectionRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof ec2.CfnVPNConnection) {
      if (this.props?.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const vpnConnection = node as ec2.CfnVPNConnection;

        new VpnConnectionRecommendedAlarms(vpnConnection, 'VpnConnectionRecommendedAlarmsFromAspect', {
          vpnConnection,
          ...this.props,
        });
      }
    }
  }
}
