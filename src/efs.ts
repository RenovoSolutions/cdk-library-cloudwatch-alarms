import {
  IAspect,
  aws_efs as efs,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for EFS alarms.
 */
export enum EfsRecommendedAlarmsMetrics {
  /**
   * Percentage of how close a file system is to reaching the I/O limit of the General Purpose
   * performance mode.
   */
  PERCENT_IO_LIMIT = 'PercentIOLimit',
  /**
   * The number of burst credits that a file system has. Burst credits allow a file system to burst
   * to throughput levels above a file system's baseline level for periods of time.
   */
  BURST_CREDIT_BALANCE = 'BurstCreditBalance',
}

/**
 * The common optional configuration for the alarms.
 */
export interface EfsAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the EFS FileSystem alarms.
 */
export interface EfsFileSystemAlarmProps {
  /**
   * The EFS FileSystem to monitor.
   */
  readonly fileSystem: efs.FileSystem;
}

/**
 * Configuration for the PercentIOLimit alarm.
 */
export interface EfsPercentIOLimitAlarmConfig extends EfsAlarmBaseConfig {
  /**
   * When the file system reaches its I/O limit, it may respond to read and write requests slower.
   * Therefore, it is recommended that the metric is monitored to avoid impacting applications that
   * use the file system. The threshold can be set around 100%. However, this value can be adjusted
   * to a lower value based on file system characteristics.
   *
   * @default 100
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 15
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 15
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - fileSystemId + ' - PercentIOLimit'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect how close the file system is to reach the I/O limit of the General
   * Purpose performance mode. Consistent high I/O percentage can be an indicator of the file system cannot scale
   * with respect to I/O requests enough and the file system can be a resource bottleneck for the applications
   * that use the file system.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the EfsFileSystemPercentIOLimitAlarm construct.
 */
export interface EfsFileSystemPercentIOLimitAlarmProps extends EfsFileSystemAlarmProps, EfsPercentIOLimitAlarmConfig {}

/**
 * This alarm helps in ensuring that the workload stays within the I/O limit available to the file system.
 *
 * If the metric reaches its I/O limit consistently, consider moving the application to a file system that
 * uses Max I/O performance as mode. For troubleshooting, check clients that are connected to the file system
 * and applications of the clients that throttles the file system.
 *
 * The alarm is triggered when the percentage exceed or equals % threshold.
 */
export class EfsFileSystemPercentIOLimitAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: EfsFileSystemPercentIOLimitAlarmProps) {
    const alarmName = props.alarmName ?? `${props.fileSystem.fileSystemId} - ${EfsRecommendedAlarmsMetrics.PERCENT_IO_LIMIT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    const datapointsToAlarm = props.datapointsToAlarm ?? 15;
    const threshold = props.threshold ?? 100;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect how close the file system is to reach the'
      + ' I/O limit of the General Purpose performance mode. Consistent high I/O percentage can be an indicator of the file system'
      + ' cannot scale with respect to I/O requests enough and the file system can be a resource bottleneck for the applications'
      + ' that use the file system.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/EFS',
        metricName: EfsRecommendedAlarmsMetrics.PERCENT_IO_LIMIT,
        dimensionsMap: {
          FileSystemId: props.fileSystem.fileSystemId,
        },
        period,
        statistic: 'Average',
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
 * Configuration for the BurstCreditBalance alarm.
 */
export interface EfsBurstCreditBalanceAlarmConfig extends EfsAlarmBaseConfig {
  /**
   * When the file system run out of burst credits and even if the baseline throughput rate is lower,
   * EFS continues to provide a metered throughput of 1 MiBps to all file systems. However, it is recommended
   * that the metric is monitored for low burst credit balance to avoid the file system acting as resource
   * bottleneck for the applications. The threshold can be set around 0 bytes.
   *
   * @default 0
   */
  readonly threshold?: number;
  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @default 15
   */
  readonly evaluationPeriods?: number;
  /**
   * The number of data points that must be breaching to trigger the alarm.
   *
   * @default 15
   */
  readonly datapointsToAlarm?: number;
  /**
   * The alarm name.
   *
   * @default - fileSystemId + ' - BurstCreditBalance'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect low burst credit balance of the file system. Consistent low
   * burst credit balance can be an indicator of the slowing down in throughput and increase in I/O latency.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the EfsFileSystemBurstCreditBalanceAlarm construct.
 */
export interface EfsFileSystemBurstCreditBalanceAlarmProps extends EfsFileSystemAlarmProps, EfsBurstCreditBalanceAlarmConfig {}

/**
 * This alarm helps in ensuring that there is available burst credit balance for the file system usage.
 *
 * When there is no available burst credit, applications access to the the file system will be limited due to low throughput.
 * If the metric drops to 0 consistently, consider changing the throughput mode to Elastic or Provisioned throughput mode.
 *
 * The alarm is triggered when the percentage is lower or equals the threshold.
 */
export class EfsFileSystemBurstCreditBalanceAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: EfsFileSystemBurstCreditBalanceAlarmProps) {
    const alarmName = props.alarmName ?? `${props.fileSystem.fileSystemId} - ${EfsRecommendedAlarmsMetrics.BURST_CREDIT_BALANCE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;
    const datapointsToAlarm = props.datapointsToAlarm ?? 15;
    const threshold = props.threshold ?? 0;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect low burst credit balance of the file system.'
      + ' Consistent low burst credit balance can be an indicator of the slowing down in throughput and increase in I/O latency.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/EFS',
        metricName: EfsRecommendedAlarmsMetrics.BURST_CREDIT_BALANCE,
        dimensionsMap: {
          FileSystemId: props.fileSystem.fileSystemId,
        },
        period,
        statistic: 'Average',
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
 * Configurations for the recommended alarms for an EFS Service.
 *
 * Default actions are overridden by the actions specified in the
 * individual alarm configurations.
 */
export interface EfsFileSystemRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: EfsRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the PercentIOLimit alarm.
   */
  readonly configPercentIOLimitAlarm?: EfsPercentIOLimitAlarmConfig;
  /**
   * The configuration for the BurstCreditBalance alarm.
   */
  readonly configBurstCreditBalanceAlarm?: EfsBurstCreditBalanceAlarmConfig;
}

/**
 * Properties for the EfsFileSystemRecommendedAlarms construct.
 */
export interface EfsFileSystemRecommendedAlarmsProps extends EfsFileSystemRecommendedAlarmsConfig {
  /**
   * The EFS FileSystem to monitor.
   */
  readonly fileSystem: efs.FileSystem;
}

/**
 * A construct that creates the recommended alarms for an EFS FileSystem.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#EFS
 */
export class EfsFileSystemRecommendedAlarms extends Construct {
  /**
   * The PercentIOLimit alarm.
   */
  public readonly alarmPercentIOLimit?: EfsFileSystemPercentIOLimitAlarm;

  /**
   * The BurstCreditBalance alarm.
   */
  public readonly alarmBurstCreditBalance?: EfsFileSystemBurstCreditBalanceAlarm;

  constructor(scope: Construct, id: string, props: EfsFileSystemRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(EfsRecommendedAlarmsMetrics.PERCENT_IO_LIMIT)) {
      this.alarmPercentIOLimit = new EfsFileSystemPercentIOLimitAlarm(this, `${props.fileSystem.node.id}_PercentIOLimit`, {
        fileSystem: props.fileSystem,
        ...props.configPercentIOLimitAlarm,
      });

      if (props.defaultAlarmAction && !props.configPercentIOLimitAlarm?.alarmAction) {
        this.alarmPercentIOLimit.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configPercentIOLimitAlarm?.okAction) {
        this.alarmPercentIOLimit.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configPercentIOLimitAlarm?.insufficientDataAction) {
        this.alarmPercentIOLimit.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(EfsRecommendedAlarmsMetrics.BURST_CREDIT_BALANCE)) {
      this.alarmBurstCreditBalance = new EfsFileSystemBurstCreditBalanceAlarm(this, `${props.fileSystem.node.id}_BurstCreditBalance`, {
        fileSystem: props.fileSystem,
        ...props.configBurstCreditBalanceAlarm,
      });

      if (props.defaultAlarmAction && !props.configBurstCreditBalanceAlarm?.alarmAction) {
        this.alarmBurstCreditBalance.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configBurstCreditBalanceAlarm?.okAction) {
        this.alarmBurstCreditBalance.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configBurstCreditBalanceAlarm?.insufficientDataAction) {
        this.alarmBurstCreditBalance.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the FileSystem construct that provides methods
 * to create recommended alarms.
 */
export class FileSystem extends efs.FileSystem {
  constructor(scope: Construct, id: string, props: efs.FileSystemProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the PercentIOLimit for the EFS fileSystem.
   */
  public alarmPercentIOLimit(props?: EfsPercentIOLimitAlarmConfig): EfsFileSystemPercentIOLimitAlarm {
    return new EfsFileSystemPercentIOLimitAlarm(this, 'PercentIOLimitAlarm', {
      fileSystem: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the BurstCreditBalance for the EFS fileSystem.
   */
  public alarmBurstCreditBalance(props?: EfsBurstCreditBalanceAlarmConfig): EfsFileSystemBurstCreditBalanceAlarm {
    return new EfsFileSystemBurstCreditBalanceAlarm(this, 'BurstCreditBalanceAlarm', {
      fileSystem: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the EFS FileSystem.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#EFS
   */
  public applyRecommendedAlarms(props?: EfsFileSystemRecommendedAlarmsConfig): EfsFileSystemRecommendedAlarms {
    return new EfsFileSystemRecommendedAlarms(this, 'EfsFileSystemRecommendedAlarms', {
      fileSystem: this,
      ...props,
    });
  }
}

/**
 * Configures the recommended alarms for an EFS FileSystem.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#EFS
 */
export class EfsRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props?: EfsFileSystemRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof efs.FileSystem) {
      if (this.props?.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const fileSystem = node as efs.FileSystem;

        new EfsFileSystemRecommendedAlarms(fileSystem, 'EfsFileSystemRecommendedAlarmsFromAspect', {
          fileSystem,
          ...this.props,
        });
      }
    }
  }
}
