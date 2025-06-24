import {
  IAspect,
  aws_stepfunctions as sfn,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { Construct, IConstruct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for StepFunctions alarms.
 */
export enum SfRecommendedAlarmsMetrics {
  /**
   * Interval, in milliseconds, between the time the execution starts and the time it closes.
   */
  EXECUTION_TIME = 'ExecutionTime',
  /**
   * Number of StateEntered events and retries that have been throttled. This is related to
   * StateTransition throttling. For more information, see Quotas related to state throttling.
   */
  EXECUTION_THROTTLED = 'ExecutionThrottled',
  /**
   * Number of failed executions.
   */
  EXECUTIONS_FAILED = 'ExecutionsFailed',
  /**
   * Number of executions that time out for any reason.
   */
  EXECUTIONS_TIMED_OUT = 'ExecutionsTimedOut',
}

/**
 * The common optional configuration for the alarms.
 */
export interface SfAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
}

/**
 * The common properties for the StepFunctions StateMachine alarms.
 */
export interface SfStateMachineAlarmProps {
  /**
   * The StateMachine to monitor.
   */
  readonly stateMachine: sfn.StateMachine;
}

/**
 * Configuration for the ExecutionTime alarm.
 */
export interface SfStateMachineExecutionTimeAlarmConfig extends SfAlarmBaseConfig {
  /**
   * A sudden increase in execution time might indicate issues with the steps of the resources they interact with.
   * Consider setting a threshold (in milliseconds) that is appropriate for the expected execution time of the state machine.
   *
   * @default None
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
   * @default - stateMachineName + ' - ExecutionTime'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect sudden increases in execution time..
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the SfStateMachineExecutionTimeAlarm construct.
 */
export interface SfStateMachineExecutionTimeAlarmProps extends SfStateMachineAlarmProps, SfStateMachineExecutionTimeAlarmConfig {}

/**
 * This metric can be a valuable tool for early detection of issues that might not be immediately apparent from other metrics.
 *
 * A sudden increase in execution time might indicate issues with the steps of the resources they interact with.
 *
 * The alarm is triggered when the time in milliseconds exceed the threshold.
 */
export class SfStateMachineExecutionTimeAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SfStateMachineExecutionTimeAlarmProps) {
    const alarmName = props.alarmName ?? `${props.stateMachine.stateMachineName} - ${SfRecommendedAlarmsMetrics.EXECUTION_TIME}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect sudden increases in execution time.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/States',
        metricName: SfRecommendedAlarmsMetrics.EXECUTION_TIME,
        dimensionsMap: {
          StateMachineArn: props.stateMachine.stateMachineArn,
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
 * Configuration for the ExecutionThrottled alarm.
 */
export interface SfStateMachineExecutionThrottledAlarmConfig extends SfAlarmBaseConfig {
  /**
   * The ExecutionThrottled metric tracks the number of times state machine executions are throttled due to exceeding AWS service limits.
   * Monitoring this can help you identify when you are hitting this limits, which could signal that adjustments need to be made either in
   * the process design or in the service limits themselves.
   *
   * @default 5
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
   * @default - stateMachineName + ' - ExecutionThrottled'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect throttled executions due to exceeding AWS service limits.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the SfStateMachineExecutionThrottledAlarm construct.
 */
export interface SfStateMachineExecutionThrottledAlarmProps extends SfStateMachineAlarmProps, SfStateMachineExecutionThrottledAlarmConfig {}

/**
 * The ExecutionThrottled metric tracks the number of times state machine executions are throttled due to exceeding AWS service limits.
 *
 * Monitoring this can help you identify when you are hitting this limits, which could signal that adjustments need to be made either in
 * the process design or in the service limits themselves.
 *
 * The alarm is triggered when the number of executions throttled exceed the threshold.
 */
export class SfStateMachineExecutionThrottledAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SfStateMachineExecutionThrottledAlarmProps) {
    const alarmName = props.alarmName ?? `${props.stateMachine.stateMachineName} - ${SfRecommendedAlarmsMetrics.EXECUTION_THROTTLED}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 5;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect throttled executions due to exceeding AWS service limits.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/States',
        metricName: SfRecommendedAlarmsMetrics.EXECUTION_THROTTLED,
        dimensionsMap: {
          StateMachineArn: props.stateMachine.stateMachineArn,
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
 * Configuration for the ExecutionsFailed alarm.
 */
export interface SfStateMachineExecutionsFailedAlarmConfig extends SfAlarmBaseConfig {
  /**
   * It helps in tracking the number of executions that fail in AWS Step Functions. This is crucial for identifying workflows that are
   * not performing as expected and require attention. By monitoring the failures, developers can proactively identify and resolve issues
   * before they impact the business operations. This reduces downtime and improves the overall stability of applications.
   *
   * @default 5
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
   * @default - stateMachineName + ' - ExecutionsFailed'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm is used to detect workflows that are not working as expected.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the SfStateMachineExecutionsFailedAlarm construct.
 */
export interface SfStateMachineExecutionsFailedAlarmProps extends SfStateMachineAlarmProps, SfStateMachineExecutionsFailedAlarmConfig {}

/**
 * It helps in tracking the number of executions that fail in AWS Step Functions. This is crucial for identifying workflows that are
 * not performing as expected and require attention.
 *
 * By monitoring the failures, developers can proactively identify and resolve issues before they impact the business operations. This reduces
 * downtime and improves the overall stability of applications.
 *
 * The alarm is triggered when the number of failed executions exceed the threshold.
 */
export class SfStateMachineExecutionsFailedAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SfStateMachineExecutionsFailedAlarmProps) {
    const alarmName = props.alarmName ?? `${props.stateMachine.stateMachineName} - ${SfRecommendedAlarmsMetrics.EXECUTIONS_FAILED}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 5;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm is used to detect workflows that are not working as expected.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/States',
        metricName: SfRecommendedAlarmsMetrics.EXECUTIONS_FAILED,
        dimensionsMap: {
          StateMachineArn: props.stateMachine.stateMachineArn,
        },
        period,
        statistic: 'Sum',
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
 * Configuration for the ExecutionsTimedOut alarm.
 */
export interface SfStateMachineExecutionsTimedOutAlarmConfig extends SfAlarmBaseConfig {
  /**
   * It helps in identifying timeouts in state machine executions, which can indicate problems like poor configuration, inadequate resource allocation,
   * or issues in the called services that need addressing.
   *
   * @default 5
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
   * @default - stateMachineName + ' - ExecutionsTimedOut'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm helps in identifying timeouts in state machine executions due to poor configuration, inadequate resource allocation,
   * or issues in the called services that need addressing.
   */
  readonly alarmDescription?: string;
}

/**
 * The properties for the SfStateMachineExecutionsTimedOutAlarm construct.
 */
export interface SfStateMachineExecutionsTimedOutAlarmProps extends SfStateMachineAlarmProps, SfStateMachineExecutionsTimedOutAlarmConfig {}

/**
 * This alarm helps in identifying timeouts in state machine executions.
 *
 * This can indicate problems like poor configuration, inadequate resource allocation, or issues in the called services that need addressing.
 *
 * The alarm is triggered when the number of timed out executions exceed the threshold.
 */
export class SfStateMachineExecutionsTimedOutAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SfStateMachineExecutionsTimedOutAlarmProps) {
    const alarmName = props.alarmName ?? `${props.stateMachine.stateMachineName} - ${SfRecommendedAlarmsMetrics.EXECUTIONS_TIMED_OUT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;
    const datapointsToAlarm = props.datapointsToAlarm ?? 5;
    const threshold = props.threshold ?? 5;
    const treatMissingData = props.treatMissingData ?? cloudwatch.TreatMissingData.MISSING;
    const alarmDescription = props.alarmDescription ?? 'This alarm helps in identifying timeouts in state machine executions due to poor configuration,'
      + ' inadequate resource allocation, or issues in the called services that need addressing.';

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/States',
        metricName: SfRecommendedAlarmsMetrics.EXECUTIONS_TIMED_OUT,
        dimensionsMap: {
          StateMachineArn: props.stateMachine.stateMachineArn,
        },
        period,
        statistic: 'Sum',
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
 * Configurations for the recommended alarms for an StepFunctions Service.
 *
 * Default actions are overridden by the actions specified in the individual alarm configurations.
 */
export interface SfStateMachineRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: SfRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the ExecutionTime alarm.
   */
  readonly configExecutionTimeAlarm: SfStateMachineExecutionTimeAlarmConfig;
  /**
   * The configuration for the ExecutionThrottled alarm.
   */
  readonly configExecutionThrottledAlarm?: SfStateMachineExecutionThrottledAlarmConfig;
  /**
   * The configuration for the ExecutionsFailed alarm.
   */
  readonly configExecutionsFailedAlarm?: SfStateMachineExecutionsFailedAlarmConfig;
  /**
   * The configuration for the ExecutionsFailed alarm.
   */
  readonly configExecutionsTimedOutAlarm?: SfStateMachineExecutionsTimedOutAlarmConfig;
}

/**
 * Properties for the SfStateMachineRecommendedAlarms construct.
 */
export interface SfStateMachineRecommendedAlarmsProps extends SfStateMachineRecommendedAlarmsConfig {
  /**
   * The EFS StateMachine to monitor.
   */
  readonly stateMachine: sfn.StateMachine;
}

/**
 * A construct that creates the recommended alarms for an StepFunctions StateMachine.
 */
export class SfStateMachineRecommendedAlarms extends Construct {
  /**
   * The ExecutionTime alarm.
   */
  public readonly alarmExecutionTime?: SfStateMachineExecutionTimeAlarm;

  /**
   * The ExecutionThrottled alarm.
   */
  public readonly alarmExecutionThrottled?: SfStateMachineExecutionThrottledAlarm;

  /**
   * The ExecutionsFailed alarm.
   */
  public readonly alarmExecutionsFailed?: SfStateMachineExecutionsFailedAlarm;

  /**
   * The ExecutionsTimedOut alarm.
   */
  public readonly alarmExecutionsTimedOut?: SfStateMachineExecutionsTimedOutAlarm;

  constructor(scope: Construct, id: string, props: SfStateMachineRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(SfRecommendedAlarmsMetrics.EXECUTION_TIME)) {
      this.alarmExecutionTime = new SfStateMachineExecutionTimeAlarm(this, `${props.stateMachine.node.id}_ExecutionTime`, {
        stateMachine: props.stateMachine,
        treatMissingData: props.treatMissingData,
        ...props.configExecutionTimeAlarm,
      });

      if (
        props.defaultAlarmAction &&
        (!props.configExecutionTimeAlarm || !props.configExecutionTimeAlarm.alarmAction)
      ) {
        this.alarmExecutionTime.addAlarmAction(props.defaultAlarmAction);
      }

      if (
        props.defaultOkAction &&
        (!props.configExecutionTimeAlarm || !props.configExecutionTimeAlarm.okAction)
      ) {
        this.alarmExecutionTime.addOkAction(props.defaultOkAction);
      }

      if (
        props.defaultInsufficientDataAction &&
        (!props.configExecutionTimeAlarm || !props.configExecutionTimeAlarm.insufficientDataAction)
      ) {
        this.alarmExecutionTime.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SfRecommendedAlarmsMetrics.EXECUTION_THROTTLED)) {
      this.alarmExecutionThrottled = new SfStateMachineExecutionThrottledAlarm(this, `${props.stateMachine.node.id}_ExecutionThrottled`, {
        stateMachine: props.stateMachine,
        treatMissingData: props.treatMissingData,
        ...props.configExecutionThrottledAlarm,
      });

      if (
        props.defaultAlarmAction &&
        (!props.configExecutionThrottledAlarm || !props.configExecutionThrottledAlarm.alarmAction)
      ) {
        this.alarmExecutionThrottled.addAlarmAction(props.defaultAlarmAction);
      }

      if (
        props.defaultOkAction &&
        (!props.configExecutionThrottledAlarm || !props.configExecutionThrottledAlarm.okAction)
      ) {
        this.alarmExecutionThrottled.addOkAction(props.defaultOkAction);
      }

      if (
        props.defaultInsufficientDataAction &&
        (!props.configExecutionThrottledAlarm || !props.configExecutionThrottledAlarm.insufficientDataAction)
      ) {
        this.alarmExecutionThrottled.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SfRecommendedAlarmsMetrics.EXECUTIONS_FAILED)) {
      this.alarmExecutionsFailed = new SfStateMachineExecutionsFailedAlarm(this, `${props.stateMachine.node.id}_ExecutionsFailed`, {
        stateMachine: props.stateMachine,
        treatMissingData: props.treatMissingData,
        ...props.configExecutionsFailedAlarm,
      });

      if (
        props.defaultAlarmAction &&
        (!props.configExecutionsFailedAlarm || !props.configExecutionsFailedAlarm.alarmAction)
      ) {
        this.alarmExecutionsFailed.addAlarmAction(props.defaultAlarmAction);
      }

      if (
        props.defaultOkAction &&
        (!props.configExecutionsFailedAlarm || !props.configExecutionsFailedAlarm.okAction)
      ) {
        this.alarmExecutionsFailed.addOkAction(props.defaultOkAction);
      }

      if (
        props.defaultInsufficientDataAction &&
        (!props.configExecutionsFailedAlarm || !props.configExecutionsFailedAlarm.insufficientDataAction)
      ) {
        this.alarmExecutionsFailed.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SfRecommendedAlarmsMetrics.EXECUTIONS_TIMED_OUT)) {
      this.alarmExecutionsTimedOut = new SfStateMachineExecutionsTimedOutAlarm(this, `${props.stateMachine.node.id}_ExecutionsTimedOut`, {
        stateMachine: props.stateMachine,
        treatMissingData: props.treatMissingData,
        ...props.configExecutionsTimedOutAlarm,
      });

      if (
        props.defaultAlarmAction &&
        (!props.configExecutionsTimedOutAlarm || !props.configExecutionsTimedOutAlarm.alarmAction)
      ) {
        this.alarmExecutionsTimedOut.addAlarmAction(props.defaultAlarmAction);
      }

      if (
        props.defaultOkAction &&
        (!props.configExecutionsTimedOutAlarm || !props.configExecutionsTimedOutAlarm.okAction)
      ) {
        this.alarmExecutionsTimedOut.addOkAction(props.defaultOkAction);
      }

      if (
        props.defaultInsufficientDataAction &&
        (!props.configExecutionsTimedOutAlarm || !props.configExecutionsTimedOutAlarm.insufficientDataAction)
      ) {
        this.alarmExecutionsTimedOut.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension for the StateMachine construct that provides methods
 * to create recommended alarms.
 */
export class StateMachine extends sfn.StateMachine {
  constructor(scope: Construct, id: string, props: sfn.StateMachineProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that monitors the ExecutionTime for the StepFunctions stateMachine.
   */
  public alarmExecutionTime(props: SfStateMachineExecutionTimeAlarmConfig): SfStateMachineExecutionTimeAlarm {
    return new SfStateMachineExecutionTimeAlarm(this, 'ExecutionTimeAlarm', {
      stateMachine: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the ExecutionThrottled for the StepFunctions stateMachine.
   */
  public alarmExecutionThrottled(props?: SfStateMachineExecutionThrottledAlarmConfig): SfStateMachineExecutionThrottledAlarm {
    return new SfStateMachineExecutionThrottledAlarm(this, 'ExecutionThrottledAlarm', {
      stateMachine: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the ExecutionsFailed for the StepFunctions stateMachine.
   */
  public alarmExecutionsFailed(props?: SfStateMachineExecutionsFailedAlarmConfig): SfStateMachineExecutionsFailedAlarm {
    return new SfStateMachineExecutionsFailedAlarm(this, 'ExecutionsFailedAlarm', {
      stateMachine: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that monitors the ExecutionsTimedOut for the StepFunctions stateMachine.
   */
  public alarmExecutionsTimedOut(props?: SfStateMachineExecutionsTimedOutAlarmConfig): SfStateMachineExecutionsTimedOutAlarm {
    return new SfStateMachineExecutionsTimedOutAlarm(this, 'ExecutionsTimedOutAlarm', {
      stateMachine: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for the StepFunctions StateMachine.
   */
  public applyRecommendedAlarms(props: SfStateMachineRecommendedAlarmsConfig): SfStateMachineRecommendedAlarms {
    return new SfStateMachineRecommendedAlarms(this, 'SfStateMachineRecommendedAlarms', {
      stateMachine: this,
      ...props,
    });
  }
}

/**
 * Configures the alarms for an StepFunctions StateMachine.
 */
export class SfRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: SfStateMachineRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof sfn.StateMachine) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const stateMachine = node as sfn.StateMachine;

        new SfStateMachineRecommendedAlarms(stateMachine, 'SfStateMachineRecommendedAlarmsFromAspect', {
          stateMachine,
          ...this.props,
        });
      }
    }
  }
}
