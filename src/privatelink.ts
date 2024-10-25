import {
  aws_ec2 as ec2,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for PrivateLink Endpoints alarms.
 */
export enum PrivateLinkEndpointsRecommendedAlarmsMetrics {
  /**
   * Percentage of how close a file system is to reaching the I/O limit of the General Purpose
   * performance mode.
   */
  PACKETS_DROPPED = 'PacketsDropped',
}

/**
 * The common optional configuration for the alarms.
 */
export interface PrivateLinkEndpointsAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the PrivateLink InterfaceVpcEndpoint alarms.
 */
export interface PrivateLinkEndpointsInterfaceVpcEndpointAlarmProps {
  /**
   * The PrivateLink InterfaceVpcEndpoint to monitor.
   */
  readonly endpoint: ec2.InterfaceVpcEndpoint;
  /**
   * The VPC ID of the PrivateLink InterfaceVpcEndpoint.
   */
  readonly vpcId: string;
  /**
   * The type of the PrivateLink InterfaceVpcEndpoint.
   */
  readonly endpointType: string;
  /**
   * The service name of the PrivateLink InterfaceVpcEndpoint.
   */
  readonly serviceName: string;
  /**
   * The subnet ID of the PrivateLink InterfaceVpcEndpoint.
   */
  readonly subnetId: string;
}

/**
 * Configuration for the PacketsDropped alarm.
 */
export interface PrivateLinkEndpointsPacketsDroppedAlarmConfig extends PrivateLinkEndpointsAlarmBaseConfig {
  /**
   * Set the threshold according to the use case. If you want to be aware of the unhealthy status of the endpoint or endpoint service,
   * you should set the threshold low so that you get a chance to fix the issue before a huge data loss. You can use historical data to
   * understand the tolerance for dropped packets and set the threshold accordingly.
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
   * @default - endpointId + ' - ' + subnetId + ' - PacketsDropped'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect if the endpoint or endpoint service is unhealthy.
   */
  readonly alarmDescription?: string;
  /**
   * The VPC ID of the PrivateLink InterfaceVpcEndpoint.
   */
  readonly vpcId: string;
  /**
   * The type of the PrivateLink InterfaceVpcEndpoint.
   */
  readonly endpointType: string;
  /**
   * The service name of the PrivateLink InterfaceVpcEndpoint.
   */
  readonly serviceName: string;
  /**
   * The subnets of the PrivateLink InterfaceVpcEndpoint.
   */
  readonly subnets?: ec2.ISubnet[];
}

/**
 * The properties for the PrivateLinkEndpointsInterfaceVpcEndpointPacketsDroppedAlarm construct.
 */
export interface PrivateLinkEndpointsInterfaceVpcEndpointPacketsDroppedAlarmProps extends
  PrivateLinkEndpointsInterfaceVpcEndpointAlarmProps,
  PrivateLinkEndpointsPacketsDroppedAlarmConfig {}

/**
 * This alarm helps to detect if the endpoint or endpoint service is unhealthy by monitoring the number of packets dropped by the endpoint.
 *
 * Note that packets larger than 8500 bytes that arrive at the VPC endpoint are dropped. For troubleshooting,
 * see connectivity problems between an interface VPC endpoint and an endpoint service.
 *
 * The alarm is triggered when the number of packets dropped exceeds the threshold.
 */
export class PrivateLinkEndpointsInterfaceVpcEndpointPacketsDroppedAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: PrivateLinkEndpointsInterfaceVpcEndpointPacketsDroppedAlarmProps) {
    const alarmName = props.alarmName ?? `${props.endpoint.vpcEndpointId} - ${props.subnetId} - ${PrivateLinkEndpointsRecommendedAlarmsMetrics.PACKETS_DROPPED}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect if the endpoint or endpoint service is unhealthy.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/PrivateLinkEndpoints',
        metricName: PrivateLinkEndpointsRecommendedAlarmsMetrics.PACKETS_DROPPED,
        dimensionsMap: {
          VpcEndpointId: props.endpoint.vpcEndpointId,
          VpcId: props.vpcId,
          EndpointType: props.endpointType,
          ServiceName: props.serviceName,
          SubnetId: props.subnetId,
        },
        period,
        statistic: 'Sum',
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
 * Configurations for the recommended alarms for an PrivateLink Service.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: PrivateLinkEndpointsRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the PacketsDropped alarm.
   */
  readonly configPacketsDroppedAlarm: PrivateLinkEndpointsPacketsDroppedAlarmConfig;
}

/**
 * Properties for the PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarms construct.
 */
export interface PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarmsProps extends
  PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarmsConfig {
  /**
   * The PrivateLink InterfaceVpcEndpoint to monitor.
   */
  readonly endpoint: ec2.InterfaceVpcEndpoint;
}

/**
 * A construct that creates the recommended alarms for an PrivateLink InterfaceVpcEndpoint.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#PrivateLinkEndpoints
 */
export class PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarms extends Construct {
  /**
   * The PacketsDropped alarm.
   */
  public readonly alarmPacketsDroppedList?: PrivateLinkEndpointsInterfaceVpcEndpointPacketsDroppedAlarm[];

  constructor(scope: Construct, id: string, props: PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(PrivateLinkEndpointsRecommendedAlarmsMetrics.PACKETS_DROPPED)) {
      this.alarmPacketsDroppedList = [];

      if (!props.configPacketsDroppedAlarm.subnets) {
        throw new Error('Subnets must be provided for the PacketsDropped alarm.');
      }

      for (const subnet of props.configPacketsDroppedAlarm.subnets) {
        const config = props.configPacketsDroppedAlarm;
        const alarm = new PrivateLinkEndpointsInterfaceVpcEndpointPacketsDroppedAlarm(this, `${props.endpoint.node.id}_${subnet.node.id}_PacketsDropped`, {
          endpoint: props.endpoint,
          vpcId: config.vpcId,
          endpointType: config.endpointType,
          serviceName: config.serviceName,
          subnetId: subnet.subnetId,
          threshold: config.threshold,
          period: config.period,
          evaluationPeriods: config.evaluationPeriods,
          datapointsToAlarm: config.datapointsToAlarm,
          alarmName: config.alarmName,
          alarmDescription: config.alarmDescription,
          alarmAction: config.alarmAction,
          okAction: config.okAction,
          insufficientDataAction: config.insufficientDataAction,
          treatMissingData: config.treatMissingData,
        });

        if (
          props.defaultAlarmAction &&
          (!props.configPacketsDroppedAlarm || !props.configPacketsDroppedAlarm.alarmAction)
        ) {
          alarm.addAlarmAction(props.defaultAlarmAction);
        }

        if (
          props.defaultOkAction &&
          (!props.configPacketsDroppedAlarm || !props.configPacketsDroppedAlarm.okAction)
        ) {
          alarm.addOkAction(props.defaultOkAction);
        }

        if (
          props.defaultInsufficientDataAction &&
          (!props.configPacketsDroppedAlarm || !props.configPacketsDroppedAlarm.insufficientDataAction)
        ) {
          alarm.addInsufficientDataAction(props.defaultInsufficientDataAction);
        }

        this.alarmPacketsDroppedList.push(alarm);
      }
    }
  }
}

/**
 * An extension for the InterfaceVpcEndpoint construct that provides methods
 * to create recommended alarms.
 */
export class InterfaceVpcEndpoint extends ec2.InterfaceVpcEndpoint {
  constructor(scope: Construct, id: string, props: ec2.InterfaceVpcEndpointProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the PacketsDropped for the PrivateLink endpoint.
   */
  public alarmPacketsDropped(props: PrivateLinkEndpointsPacketsDroppedAlarmConfig): PrivateLinkEndpointsInterfaceVpcEndpointPacketsDroppedAlarm[] {
    let alarmPacketsDroppedList = [];

    if (!props.subnets) {
      throw new Error('Subnets must be provided for the PacketsDropped alarm.');
    }

    for (const subnet of props.subnets) {
      const alarm = new PrivateLinkEndpointsInterfaceVpcEndpointPacketsDroppedAlarm(this, `${this.node.id}_${subnet.node.id}_PacketsDropped`, {
        endpoint: this,
        vpcId: props.vpcId,
        endpointType: props.endpointType,
        serviceName: props.serviceName,
        subnetId: subnet.subnetId,
        threshold: props.threshold,
        period: props.period,
        evaluationPeriods: props.evaluationPeriods,
        datapointsToAlarm: props.datapointsToAlarm,
        alarmName: props.alarmName,
        alarmDescription: props.alarmDescription,
        alarmAction: props.alarmAction,
        okAction: props.okAction,
        insufficientDataAction: props.insufficientDataAction,
        treatMissingData: props.treatMissingData,
      });
      alarmPacketsDroppedList.push(alarm);
    }
    return alarmPacketsDroppedList;
  }

  /**
   * Creates the recommended alarms for the PrivateLink InterfaceVpcEndpoint.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#PrivateLinkEndpoints
   */
  public applyRecommendedAlarms(
    props: PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarmsConfig,
  ): PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarms {
    return new PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarms(this, 'PrivateLinkEndpointsInterfaceVpcEndpointRecommendedAlarms', {
      endpoint: this,
      ...props,
    });
  }
}

/**
 * The recommended metrics for PrivateLink Services alarms.
 */
export enum PrivateLinkServicesRecommendedAlarmsMetrics {
  /**
   * The number of RST packets sent to endpoints by the endpoint service. Increasing values could indicate
   * that there are unhealthy targets.
   */
  RST_PACKETS_SENT = 'RstPacketsSent',
}

/**
 * The common optional configuration for the alarms.
 */
export interface PrivateLinkServicesAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the PrivateLink VpcEndpointService alarms.
 */
export interface PrivateLinkServicesVpcEndpointServiceAlarmProps {
  /**
   * The PrivateLink VpcEndpointService to monitor.
   */
  readonly endpointService: ec2.VpcEndpointService;
  /**
   * The load balancer ARN of the PrivateLink VpcEndpointService.
   */
  readonly loadBalancerArn: string;
  /**
   * The availability zone of the PrivateLink VpcEndpointService.
   */
  readonly az: string;
}

/**
 * Configuration for the RstPacketsSent alarm.
 */
export interface PrivateLinkServicesRstPacketsSentAlarmConfig extends PrivateLinkServicesAlarmBaseConfig {
  /**
   * The threshold depends on the use case. If your use case can tolerate targets being unhealthy, you can set the threshold high.
   * If the use case can’t tolerate unhealthy targets you can set the threshold very low.
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
   * @default - endpointServiceName + ' - ' + az + ' - RstPacketsSent'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect unhealthy targets of an endpoint service.
   */
  readonly alarmDescription?: string;
  /**
   * The load balancer ARN of the PrivateLink VpcEndpointService.
   */
  readonly loadBalancerArn: string;
  /**
   * The availability zone of the PrivateLink VpcEndpointService.
   */
  readonly azs?: string[];
}

/**
 * The properties for the PrivateLinkServicesVpcEndpointServiceRstPacketsSentAlarm construct.
 */
export interface PrivateLinkServicesVpcEndpointServiceRstPacketsSentAlarmProps extends
  PrivateLinkServicesVpcEndpointServiceAlarmProps,
  PrivateLinkServicesRstPacketsSentAlarmConfig {}

/**
 * This alarm helps you detect unhealthy targets of an endpoint service based on the number of reset packets that are sent to endpoints.
 *
 * When you debug connection errors with a consumer of your service, you can validate whether the service is resetting connections with
 * the RstPacketsSent metric, or if something else is failing on the network path.
 *
 * The alarm is triggered when the the number of reset packets exceeds the threshold.
 */
export class PrivateLinkServicesVpcEndpointServiceRstPacketsSentAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: PrivateLinkServicesVpcEndpointServiceRstPacketsSentAlarmProps) {
    const alarmName = props.alarmName ?? `${props.endpointService.vpcEndpointServiceName} - ${props.az} - ${PrivateLinkServicesRecommendedAlarmsMetrics.RST_PACKETS_SENT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect unhealthy targets of an endpoint service.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/PrivateLinkServices',
        metricName: PrivateLinkServicesRecommendedAlarmsMetrics.RST_PACKETS_SENT,
        dimensionsMap: {
          ServiceId: props.endpointService.vpcEndpointServiceId,
          LoadBalancerArn: props.loadBalancerArn,
          Az: props.az,
        },
        period,
        statistic: 'Sum',
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
 * Configurations for the recommended alarms for an PrivateLink Service.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface PrivateLinkServicesVpcEndpointServiceRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: PrivateLinkServicesRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the RstPacketsSent alarm.
   */
  readonly configRstPacketsSentAlarm: PrivateLinkServicesRstPacketsSentAlarmConfig;
}

/**
 * Properties for the PrivateLinkServicesVpcEndpointServiceRecommendedAlarms construct.
 */
export interface PrivateLinkServicesVpcEndpointServiceRecommendedAlarmsProps extends
  PrivateLinkServicesVpcEndpointServiceRecommendedAlarmsConfig {
  /**
   * The PrivateLink VpcEndpointService to monitor.
   */
  readonly endpointService: ec2.VpcEndpointService;
}

/**
 * A construct that creates the recommended alarms for an PrivateLink VpcEndpointService.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#PrivateLinkServices
 */
export class PrivateLinkServicesVpcEndpointServiceRecommendedAlarms extends Construct {
  /**
   * The RstPacketsSent alarm.
   */
  public readonly alarmRstPacketsSentList?: PrivateLinkServicesVpcEndpointServiceRstPacketsSentAlarm[];

  constructor(scope: Construct, id: string, props: PrivateLinkServicesVpcEndpointServiceRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(PrivateLinkServicesRecommendedAlarmsMetrics.RST_PACKETS_SENT)) {
      this.alarmRstPacketsSentList = [];

      if (!props.configRstPacketsSentAlarm.azs) {
        throw new Error('AZs must be provided for the RstPacketsSent alarm.');
      }

      for (const az of props.configRstPacketsSentAlarm.azs) {
        const config = props.configRstPacketsSentAlarm;
        const alarm = new PrivateLinkServicesVpcEndpointServiceRstPacketsSentAlarm(this, `${props.endpointService.node.id}_${az}_RstPacketsSent`, {
          endpointService: props.endpointService,
          loadBalancerArn: config.loadBalancerArn,
          az: az,
          threshold: config.threshold,
          period: config.period,
          evaluationPeriods: config.evaluationPeriods,
          datapointsToAlarm: config.datapointsToAlarm,
          alarmName: config.alarmName,
          alarmDescription: config.alarmDescription,
          alarmAction: config.alarmAction,
          okAction: config.okAction,
          insufficientDataAction: config.insufficientDataAction,
          treatMissingData: config.treatMissingData,
        });

        if (
          props.defaultAlarmAction &&
          (!props.configRstPacketsSentAlarm || !props.configRstPacketsSentAlarm.alarmAction)
        ) {
          alarm.addAlarmAction(props.defaultAlarmAction);
        }

        if (
          props.defaultOkAction &&
          (!props.configRstPacketsSentAlarm || !props.configRstPacketsSentAlarm.okAction)
        ) {
          alarm.addOkAction(props.defaultOkAction);
        }

        if (
          props.defaultInsufficientDataAction &&
          (!props.configRstPacketsSentAlarm || !props.configRstPacketsSentAlarm.insufficientDataAction)
        ) {
          alarm.addInsufficientDataAction(props.defaultInsufficientDataAction);
        }

        this.alarmRstPacketsSentList.push(alarm);
      }
    }
  }
}

/**
 * An extension for the VpcEndpointService construct that provides methods
 * to create recommended alarms.
 */
export class VpcEndpointService extends ec2.VpcEndpointService {
  constructor(scope: Construct, id: string, props: ec2.VpcEndpointServiceProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the RstPacketsSent for the PrivateLink endpoint.
   */
  public alarmRstPacketsSent(props: PrivateLinkServicesRstPacketsSentAlarmConfig): PrivateLinkServicesVpcEndpointServiceRstPacketsSentAlarm[] {
    let alarmRstPacketsSentList = [];

    if (!props.azs) {
      throw new Error('AZs must be provided for the RstPacketsSent alarm.');
    }

    for (const az of props.azs) {
      const alarm = new PrivateLinkServicesVpcEndpointServiceRstPacketsSentAlarm(this, `${this.node.id}_${az}_RstPacketsSent`, {
        endpointService: this,
        loadBalancerArn: props.loadBalancerArn,
        az: az,
        threshold: props.threshold,
        period: props.period,
        evaluationPeriods: props.evaluationPeriods,
        datapointsToAlarm: props.datapointsToAlarm,
        alarmName: props.alarmName,
        alarmDescription: props.alarmDescription,
        alarmAction: props.alarmAction,
        okAction: props.okAction,
        insufficientDataAction: props.insufficientDataAction,
        treatMissingData: props.treatMissingData,
      });
      alarmRstPacketsSentList.push(alarm);
    }
    return alarmRstPacketsSentList;
  }

  /**
   * Creates the recommended alarms for the PrivateLink VpcEndpointService.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#PrivateLinkServices
   */
  public applyRecommendedAlarms(
    props: PrivateLinkServicesVpcEndpointServiceRecommendedAlarmsConfig,
  ): PrivateLinkServicesVpcEndpointServiceRecommendedAlarms {
    return new PrivateLinkServicesVpcEndpointServiceRecommendedAlarms(this, 'PrivateLinkServicesVpcEndpointServiceRecommendedAlarms', {
      endpointService: this,
      ...props,
    });
  }
}
