import {
  IAspect,
  aws_sqs as sqs,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { IConstruct, Construct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for SQS queue alarms.
 */
export enum SqsRecommendedAlarmsMetrics {
  APPROXIMATE_AGE_OF_OLDEST_MESSAGE = 'ApproximateAgeOfOldestMessage',
  APPROXIMATE_NUMBER_OF_MESSAGES_NOT_VISIBLE = 'ApproximateNumberOfMessagesNotVisible',
  APPROXIMATE_NUMBER_OF_MESSAGES_VISIBLE = 'ApproximateNumberOfMessagesVisible',
  NUMBER_OF_MESSAGES_SENT = 'NumberOfMessagesSent'
}

export interface SqsAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
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
}

/**
 * Configuration for the ApproximateAgeOfOldestMessage alarm.
 */
export interface SqsApproximateAgeOfOldestMessageAlarmConfig extends SqsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * The recommended threshold value for this alarm is highly dependent on the expected message
   * processing time. You can use historical data to calculate the average message processing time,
   * and then set the threshold to 50% higher than the maximum expected SQS message processing
   * time by queue consumers.
   */
  readonly threshold: number;
  /**
   * The alarm name.
   *
   * @default - queue.queueName + ' - ApproximateAgeOfOldestMessage'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default -  This alarm watches the age of the oldest message in the queue. You can use this alarm
   * to monitor if your consumers are processing SQS messages at the desired speed. Consider increasing
   * the consumer count or consumer throughput to reduce message age. This metric can be used in
   * combination with ApproximateNumberOfMessagesVisible to determine how big the queue backlog is
   * and how quickly messages are being processed. To prevent messages from being deleted before processed,
   * consider configuring the dead-letter queue to sideline potential poison pill messages.
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SqsApproximateAgeOfOldestMessageAlarm construct.
 */
export interface SqsApproximateAgeOfOldestMessageAlarmProps extends SqsApproximateAgeOfOldestMessageAlarmConfig {
  /**
   * The SQS queue for which to create the alarm.
   */
  readonly queue: sqs.IQueue;
}

/**
 * An alarm that watches the age of the oldest message in the queue.
 *
 * This alarm is used to detect whether the age of the oldest message
 * in the QueueName queue is too high. High age can be an indication
 * that messages are not processed quickly enough or that there are
 * some poison-pill messages that are stuck in the queue and can't
 * be processed.
 *
 * This alarm is triggered when the age of the oldest message in the
 * queue exceeds or is equal to the specified threshold.
 */
export class SqsApproximateAgeOfOldestMessageAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SqsApproximateAgeOfOldestMessageAlarmProps) {
    const alarmName = props.alarmName ?? `${props.queue.queueName} - ${SqsRecommendedAlarmsMetrics.APPROXIMATE_AGE_OF_OLDEST_MESSAGE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.queue.metricApproximateAgeOfOldestMessage({
        period,
      }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 15,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm watches the age of the oldest message in the queue. '
        + 'You can use this alarm to monitor if your consumers are processing SQS messages at the desired speed. '
        + 'Consider increasing the consumer count or consumer throughput to reduce message age. This metric can be '
        + 'used in combination with ApproximateNumberOfMessagesVisible to determine how big the queue backlog is and '
        + 'how quickly messages are being processed. To prevent messages from being deleted before processed, consider '
        + 'configuring the dead-letter queue to sideline potential poison pill messages.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the ApproximateNumberOfMessagesNotVisible alarm.
 */
export interface SqsApproximateNumberOfMessagesNotVisibleAlarmConfig extends SqsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * The recommended threshold value for this alarm is highly dependent on the expected number
   * of messages in flight. You can use historical data to calculate the maximum expected
   * number of messages in flight and set the threshold to 50% over this value. If consumers
   * of the queue are processing but not deleting messages from the queue, this number will
   * suddenly increase.
   */
  readonly threshold: number;
  /**
   * The alarm name.
   *
   * @default - queue.queueName + ' - ApproximateNumberOfMessagesNotVisible'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm helps to detect a high number of in-flight messages with respect to QueueName.
   * For troubleshooting, check message backlog decreasing (https://repost.aws/knowledge-center/sqs-message-backlog).
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SqsApproximateNumberOfMessagesNotVisibleAlarm construct.
 */
export interface SqsApproximateNumberOfMessagesNotVisibleAlarmProps extends SqsApproximateNumberOfMessagesNotVisibleAlarmConfig {
  /**
   * The SQS queue for which to create the alarm.
   */
  readonly queue: sqs.IQueue;
}

/**
 * An alarm that watches the number of messages that are in flight.
 *
 * This alarm is used to detect a high number of in-flight messages
 * in the queue. If consumers do not delete messages within the
 * visibility timeout period, when the queue is polled, messages
 * reappear in the queue. For FIFO queues, there can be a maximum
 * of 20,000 in-flight messages. If you reach this quota, SQS returns
 * no error messages. A FIFO queue looks through the first 20k
 * messages to determine available message groups. This means that
 * if you have a backlog of messages in a single message group,
 * you cannot consume messages from other message groups that were
 * sent to the queue at a later time until you successfully
 * consume the messages from the backlog.
 *
 * This alarm is triggered when the number of messages that are in
 * flight exceeds or is equal to the specified threshold.
 */
export class SqsApproximateNumberOfMessagesNotVisibleAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SqsApproximateNumberOfMessagesNotVisibleAlarmProps) {
    const alarmName = props.alarmName ?? `${props.queue.queueName} - ${SqsRecommendedAlarmsMetrics.APPROXIMATE_NUMBER_OF_MESSAGES_NOT_VISIBLE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.queue.metricApproximateNumberOfMessagesNotVisible({
        period,
      }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 15,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm helps to detect a high number of in-flight '
        + 'messages with respect to QueueName. For troubleshooting, check message backlog decreasing '
        + '(https://repost.aws/knowledge-center/sqs-message-backlog).',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the ApproximateNumberOfMessagesVisible alarm.
 */
export interface SqsApproximateNumberOfMessagesVisibleAlarmConfig extends SqsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * An unexpectedly high number of messages visible indicates that messages are not being
   * processed by a consumer at the expected rate. You should consider historical data when
   * you set this threshold.
   */
  readonly threshold: number;
  /**
   * The alarm name.
   *
   * @default - queue.queueName + ' - ApproximateNumberOfMessagesVisible'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm helps to detect a high number of in-flight messages with respect to QueueName.
   * For troubleshooting, check message backlog decreasing (https://repost.aws/knowledge-center/sqs-message-backlog).
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SqsApproximateNumberOfMessagesVisibleAlarm construct.
 */
export interface SqsApproximateNumberOfMessagesVisibleAlarmProps extends SqsApproximateNumberOfMessagesVisibleAlarmConfig {
  /**
   * The SQS queue for which to create the alarm.
   */
  readonly queue: sqs.IQueue;
}

/**
 * An alarm that watches the number of messages that
 * are visible in the queue.
 *
 * This alarm is used to detect whether the message
 * count of the active queue is too high and consumers
 * are slow to process the messages or there are not
 * enough consumers to process them.
 *
 * This alarm is triggered when the number of messages
 * that are visible in the queue exceeds or is equal to
 * the specified threshold.
 */
export class SqsApproximateNumberOfMessagesVisibleAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SqsApproximateNumberOfMessagesVisibleAlarmProps) {
    const alarmName = props.alarmName ?? `${props.queue.queueName} - ${SqsRecommendedAlarmsMetrics.APPROXIMATE_NUMBER_OF_MESSAGES_VISIBLE}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.queue.metricApproximateNumberOfMessagesVisible({
        period,
      }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 15,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm watches for the message queue backlog to be bigger '
      + 'than expected, indicating that consumers are too slow or there are not enough consumers.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the NumberOfMessagesSent alarm.
 */
export interface SqsNumberOfMessagesSentAlarmConfig extends SqsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * If the number of messages sent is 0, the producer is not sending any messages.
   * If this queue has a low TPS, increase the number of EvaluationPeriods accordingly.
   *
   * @default 0
   */
  readonly threshold?: number;
  /**
   * The alarm name.
   *
   * @default - queue.queueName + ' - NumberOfMessagesSent'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm helps to detect a high number of in-flight messages with respect
   * to QueueName. For troubleshooting, check message backlog decreasing (https://repost.aws/knowledge-center/sqs-message-backlog).
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SqsNumberOfMessagesSentAlarm construct.
 */
export interface SqsNumberOfMessagesSentAlarmProps extends SqsNumberOfMessagesSentAlarmConfig {
  /**
   * The SQS queue for which to create the alarm.
   */
  readonly queue: sqs.IQueue;
}

/**
 * An alarm that watches the number of messages that are sent.
 *
 * This alarm is used to detect when a producer stops sending messages.
 *
 * This alarm is triggered when the number of messages sent is less than
 * or equal to the specified threshold. By default, 0.
 */
export class SqsNumberOfMessagesSentAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SqsNumberOfMessagesSentAlarmProps) {
    const alarmName = props.alarmName ?? `${props.queue.queueName} - ${SqsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_SENT}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 15;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.queue.metricNumberOfMessagesSent({
        period,
      }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 15,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm helps to detect if there are no messages being sent from a producer with respect to QueueName.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the recommended alarms for an SQS queue.
 */
export interface SqsRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: SqsRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the approximate age of oldest message alarm.
   */
  readonly configApproximateAgeOfOldestMessageAlarm: SqsApproximateAgeOfOldestMessageAlarmConfig;
  /**
   * The configuration for the approximate number of messages not visible alarm.
   */
  readonly configApproximateNumberOfMessagesNotVisibleAlarm: SqsApproximateNumberOfMessagesNotVisibleAlarmConfig;
  /**
   * The configuration for the approximate number of messages visible alarm.
   */
  readonly configApproximateNumberOfMessagesVisibleAlarm: SqsApproximateNumberOfMessagesVisibleAlarmConfig;
  /**
   * The configuration for the number of messages sent alarm.
   */
  readonly configNumberOfMessagesSentAlarm?: SqsNumberOfMessagesSentAlarmConfig;
}

/**
 * Properties for the SqsRecommendedAlarms construct.
 */
export interface SqsRecommendedAlarmsProps extends SqsRecommendedAlarmsConfig {
  /**
   * The SQS queue for which to create the alarms.
   */
  readonly queue: sqs.IQueue;
}

export class SqsRecommendedAlarms extends Construct {
  /**
   * The approximate age of oldest message alarm.
   */
  public readonly alarmApproximateAgeOfOldestMessage?: SqsApproximateAgeOfOldestMessageAlarm;
  /**
   * The approximate number of messages not visible alarm.
   */
  public readonly alarmApproximateNumberOfMessagesNotVisible?: SqsApproximateNumberOfMessagesNotVisibleAlarm;
  /**
   * The approximate number of messages visible alarm.
   */
  public readonly alarmApproximateNumberOfMessagesVisible?: SqsApproximateNumberOfMessagesVisibleAlarm;
  /**
   * The number of messages sent alarm.
   */
  public readonly alarmNumberOfMessagesSent?: SqsNumberOfMessagesSentAlarm;

  constructor(scope: Construct, id: string, props: SqsRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(SqsRecommendedAlarmsMetrics.APPROXIMATE_AGE_OF_OLDEST_MESSAGE)) {
      this.alarmApproximateAgeOfOldestMessage = new SqsApproximateAgeOfOldestMessageAlarm(this, 'ApproximateAgeOfOldestMessageAlarm', {
        queue: props.queue,
        treatMissingData: props.treatMissingData,
        ...props.configApproximateAgeOfOldestMessageAlarm,
      });

      if (props.defaultAlarmAction && !props.configApproximateAgeOfOldestMessageAlarm.alarmAction) {
        this.alarmApproximateAgeOfOldestMessage.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configApproximateAgeOfOldestMessageAlarm.okAction) {
        this.alarmApproximateAgeOfOldestMessage.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configApproximateAgeOfOldestMessageAlarm.insufficientDataAction) {
        this.alarmApproximateAgeOfOldestMessage.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SqsRecommendedAlarmsMetrics.APPROXIMATE_NUMBER_OF_MESSAGES_NOT_VISIBLE)) {
      this.alarmApproximateNumberOfMessagesNotVisible = new SqsApproximateNumberOfMessagesNotVisibleAlarm(this, 'ApproximateNumberOfMessagesNotVisibleAlarm', {
        queue: props.queue,
        treatMissingData: props.treatMissingData,
        ...props.configApproximateNumberOfMessagesNotVisibleAlarm,
      });

      if (props.defaultAlarmAction && !props.configApproximateNumberOfMessagesNotVisibleAlarm.alarmAction) {
        this.alarmApproximateNumberOfMessagesNotVisible.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configApproximateNumberOfMessagesNotVisibleAlarm.okAction) {
        this.alarmApproximateNumberOfMessagesNotVisible.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configApproximateNumberOfMessagesNotVisibleAlarm.insufficientDataAction) {
        this.alarmApproximateNumberOfMessagesNotVisible.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SqsRecommendedAlarmsMetrics.APPROXIMATE_NUMBER_OF_MESSAGES_VISIBLE)) {
      this.alarmApproximateNumberOfMessagesVisible = new SqsApproximateNumberOfMessagesVisibleAlarm(this, 'ApproximateNumberOfMessagesVisibleAlarm', {
        queue: props.queue,
        treatMissingData: props.treatMissingData,
        ...props.configApproximateNumberOfMessagesVisibleAlarm,
      });

      if (props.defaultAlarmAction && !props.configApproximateNumberOfMessagesVisibleAlarm.alarmAction) {
        this.alarmApproximateNumberOfMessagesVisible.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configApproximateNumberOfMessagesVisibleAlarm.okAction) {
        this.alarmApproximateNumberOfMessagesVisible.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configApproximateNumberOfMessagesVisibleAlarm.insufficientDataAction) {
        this.alarmApproximateNumberOfMessagesVisible.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SqsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_SENT)) {
      this.alarmNumberOfMessagesSent = new SqsNumberOfMessagesSentAlarm(this, 'NumberOfMessagesSentAlarm', {
        queue: props.queue,
        treatMissingData: props.treatMissingData,
        ...props.configNumberOfMessagesSentAlarm,
      });

      if (props.defaultAlarmAction && !props.configNumberOfMessagesSentAlarm?.alarmAction) {
        this.alarmNumberOfMessagesSent.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configNumberOfMessagesSentAlarm?.okAction) {
        this.alarmNumberOfMessagesSent.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configNumberOfMessagesSentAlarm?.insufficientDataAction) {
        this.alarmNumberOfMessagesSent.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension of the SQS Queue construct that adds methods to create recommended alarms.
 */
export class Queue extends sqs.Queue {
  constructor(scope: Construct, id: string, props?: sqs.QueueProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm that watches the age of the oldest message in the queue.
   */
  public alarmApproximateAgeOfOldestMessage(props: SqsApproximateAgeOfOldestMessageAlarmConfig): SqsApproximateAgeOfOldestMessageAlarm {
    return new SqsApproximateAgeOfOldestMessageAlarm(this, 'ApproximateAgeOfOldestMessageAlarm', {
      queue: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that watches the number of messages that are in flight.
   */
  public alarmApproximateNumberOfMessagesNotVisible(
    props: SqsApproximateNumberOfMessagesNotVisibleAlarmConfig,
  ): SqsApproximateNumberOfMessagesNotVisibleAlarm {
    return new SqsApproximateNumberOfMessagesNotVisibleAlarm(this, 'ApproximateNumberOfMessagesNotVisibleAlarm', {
      queue: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that watches the number of messages that are visible in the queue.
   */
  public alarmApproximateNumberOfMessagesVisible(
    props: SqsApproximateNumberOfMessagesVisibleAlarmConfig,
  ): SqsApproximateNumberOfMessagesVisibleAlarm {
    return new SqsApproximateNumberOfMessagesVisibleAlarm(this, 'ApproximateNumberOfMessagesVisibleAlarm', {
      queue: this,
      ...props,
    });
  }

  /**
   * Creates an alarm that watches the number of messages that are sent.
   */
  public alarmNumberOfMessagesSent(props?: SqsNumberOfMessagesSentAlarmConfig): SqsNumberOfMessagesSentAlarm {
    return new SqsNumberOfMessagesSentAlarm(this, 'NumberOfMessagesSentAlarm', {
      queue: this,
      ...props,
    });
  }

  /**
   * Creates the recommended alarms for an SQS queue.
   */
  public applyRecommendedAlarms(props: SqsRecommendedAlarmsConfig): void {
    new SqsRecommendedAlarms(this, 'SqsRecommendedAlarms', {
      queue: this,
      ...props,
    });
  }
}

/**
 * Configured the recommended alarms for an SQS queue. Requires defining thresholds for some alarms.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SQS
 */
export class SqsRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: SqsRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof sqs.Queue) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const queue = node as sqs.Queue;

        new SqsRecommendedAlarms(queue, 'SqsRecommendedAlarmsFromAspect', {
          queue,
          ...this.props,
        });
      }
    }
  }
};

