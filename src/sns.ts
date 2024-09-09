import {
  IAspect,
  aws_sns as sns,
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';
import { IConstruct, Construct } from 'constructs';
import { AlarmBaseProps, validateTotalAlarmPeriod } from './common';

/**
 * The recommended metrics for SNS topic alarms.
 */
export enum SnsRecommendedAlarmsMetrics {
  /**
   * The number of messages published to the topic.
   */
  NUMBER_OF_MESSAGES_PUBLISHED = 'NumberOfMessagesPublished',
  /**
   * The number of notifications delivered.
   */
  NUMBER_OF_NOTIFICATIONS_DELIVERED = 'NumberOfNotificationsDelivered',
  /**
   * The number of notifications failed.
   */
  NUMBER_OF_NOTIFICATIONS_FAILED = 'NumberOfNotificationsFailed',
  /**
   * The number of notifications filtered out due to invalid attributes.
   */
  NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_ATTRIBUTES = 'NumberOfNotificationsFilteredOut-InvalidAttributes',
  /**
   * The number of notifications filtered out due to invalid message body.
   */
  NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_MESSAGE_BODY = 'NumberOfNotificationsFilteredOut-InvalidMessageBody',
  /**
   * The number of notifications redriven to the dead-letter queue.
   */
  NUMBER_OF_NOTIFICATIONS_REDRIVEN_TO_DLQ = 'NumberOfNotificationsRedrivenToDlq',
  /**
   * The number of notifications failed to redrive to the dead-letter queue.
   */
  NUMBER_OF_NOTIFICATIONS_FAILED_TO_REDRIVE_TO_DLQ = 'NumberOfNotificationsFailedToRedriveToDlq'
}

export interface SnsAlarmBaseConfig extends AlarmBaseProps {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(1)
   */
  readonly period?: Duration;
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
}

/**
 * Configuration for the NumberOfMessagesPublished alarm.
 */
export interface SnsNumberOfMessagesPublishedAlarmConfig extends SnsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * The number of messages published should be in line with the expected number of
   * published messages for your application. You can also analyze the historical data,
   * trends and traffic to find the right threshold.
   */
  readonly threshold: number;
  /**
   * The alarm name.
   *
   * @default - topic.topicName + ' - NumberOfMessagesPublished'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default -  This alarm can detect when the number of SNS messages published is too low.
   * For troubleshooting, check why the publishers are sending less traffic.
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SnsNumberOfMessagesPublishedAlarm construct.
 */
export interface SnsNumberOfMessagesPublishedAlarmProps extends SnsNumberOfMessagesPublishedAlarmConfig {
  /**
   * The SNS topic for which to create the alarm.
   */
  readonly topic: sns.ITopic;
}

/**
 * An alarm that monitors the number of messages published to an SNS topic.
 *
 * This alarm helps you proactively monitor and detect significant drops in
 * notification publishing. This helps you identify potential issues with
 * your application or business processes, so that you can take appropriate
 * actions to maintain the expected flow of notifications. You should create
 * this alarm if you expect your system to have a minimum traffic that it
 * is serving.
 *
 * The alarm is triggered when the number of messages published to the topic
 * is less than the specified threshold.
 */
export class SnsNumberOfMessagesPublishedAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SnsNumberOfMessagesPublishedAlarmProps) {
    const alarmName = props.alarmName ?? `${props.topic.topicName} - ${SnsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_PUBLISHED}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.topic.metricNumberOfMessagesPublished({
        period,
      }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 5,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm can detect when the number of SNS messages published is too low. For troubleshooting, check why the publishers are sending less traffic.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the NumberOfNotificationsDelivered alarm.
 */
export interface SnsNumberOfNotificationsDeliveredAlarmConfig extends SnsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * The number of messages delivered should be in line with the expected number of
   * messages produced and the number of consumers. You can also analyze the historical
   * data, trends and traffic to find the right threshold.
   */
  readonly threshold: number;
  /**
   * The alarm name.
   *
   * @default - topic.topicName + ' - NumberOfNotificationsDelivered'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can detect when the number of SNS messages delivered is too low.
   * This could be because of unintentional unsubscribing of an endpoint, or because of
   * an SNS event that causes messages to experience delay.
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SnsNumberOfNotificationsDeliveredAlarm construct.
 */
export interface SnsNumberOfNotificationsDeliveredAlarmProps extends SnsNumberOfNotificationsDeliveredAlarmConfig {
  /**
   * The SNS topic for which to create the alarm.
   */
  readonly topic: sns.ITopic;
}

/**
 * An alarm that monitors the number of notifications delivered by an SNS topic.
 *
 * This alarm helps you detect a drop in the volume of messages delivered.
 * You should create this alarm if you expect your system to have a
 * minimum traffic that it is serving.
 *
 * The alarm is triggered when the number of messages delivered by the topic
 * is less than the specified threshold.
 */
export class SnsNumberOfNotificationsDeliveredAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SnsNumberOfNotificationsDeliveredAlarmProps) {
    const alarmName = props.alarmName ?? `${props.topic.topicName} - ${SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_DELIVERED}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.topic.metricNumberOfNotificationsDelivered({
        period,
      }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 5,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm can detect when the number of SNS messages delivered is too low. This could be because of unintentional unsubscribing of an endpoint, or because of an SNS event that causes messages to experience delay.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the NumberOfNotificationsFailed alarm.
 */
export interface SnsNumberOfNotificationsFailedAlarmConfig extends SnsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * The recommended threshold value for this alarm is highly dependent on the
   * impact of failed notifications. Review the SLAs provided to your end users,
   * fault tolerance and criticality of notifications and analyze historical data,
   * and then select a threshold accordingly. The number of notifications failed
   * should be 0 for topics that have only SQS, Lambda or Firehose subscriptions.
   */
  readonly threshold: number;
  /**
   * The alarm name.
   *
   * @default - topic.topicName + ' - NumberOfNotificationsFailed'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm can detect when the number of failed SNS messages is too high.
   * To troubleshoot failed notifications, enable logging to CloudWatch Logs. Checking
   * the logs can help you find which subscribers are failing, as well as the status
   * codes they are returning.
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SnsNumberOfNotificationsFailedAlarm construct.
 */
export interface SnsNumberOfNotificationsFailedAlarmProps extends SnsNumberOfNotificationsFailedAlarmConfig {
  /**
   * The SNS topic for which to create the alarm.
   */
  readonly topic: sns.ITopic;
}

/**
 * An alarm that monitors the number of notifications failed by an SNS topic.
 *
 * This alarm helps you proactively find issues with the delivery of notifications
 * and take appropriate actions to address them.
 *
 * The alarm is triggered when the number of messages failed by the topic
 * is greater than the specified threshold.
 */
export class SnsNumberOfNotificationsFailedAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SnsNumberOfNotificationsFailedAlarmProps) {
    const alarmName = props.alarmName ?? `${props.topic.topicName} - ${SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FAILED}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.topic.metricNumberOfNotificationsFailed({
        period,
      }),
      threshold: props.threshold,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 5,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm can detect when the number of failed SNS messages is too high.'
        + ' To troubleshoot failed notifications, enable logging to CloudWatch Logs. Checking the logs can help you find which'
        + ' subscribers are failing, as well as the status codes they are returning.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the NumberOfNotificationsFilteredOutInvalidAttributes alarm.
 */
export interface SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig extends SnsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * Invalid attributes are almost always a mistake by the publisher. We recommend
   * to set the threshold to 0 because invalid attributes are not expected in a
   * healthy system.
   *
   * @default 0
   */
  readonly threshold?: number;
  /**
   * The alarm name.
   *
   * @default - topic.topicName + ' - NumberOfNotificationsFilteredOut-InvalidAttributes'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm helps to monitor and resolve potential problems with the publisher or subscribers.
   * Check if a publisher is publishing messages with invalid attributes or if an inappropriate filter is
   * applied to a subscriber. You can also analyze CloudWatch Logs to help find the root cause of the issue.
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm construct.
 */
export interface SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps
  extends SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig {
  /**
   * The SNS topic for which to create the alarm.
   */
  readonly topic: sns.ITopic;
}

/**
 * An alarm that monitors the number of notifications filtered out due
 * to invalid attributes.
 *
 * The alarm is used to detect if the published messages are not valid or
 * if inappropriate filters have been applied to a subscriber.
 *
 * The alarm is triggered when the number of messages filtered out due to
 * invalid attributes is greater than the specified threshold.
 */
export class SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps) {
    const alarmName = props.alarmName ?? `${props.topic.topicName} - ${SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_ATTRIBUTES}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: props.topic.metricNumberOfNotificationsFilteredOutInvalidAttributes({
        period,
      }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 5,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm helps to monitor and resolve potential problems with the publisher or '
        + 'subscribers. Check if a publisher is publishing messages with invalid attributes or if an inappropriate filter is applied '
        + 'to a subscriber. You can also analyze CloudWatch Logs to help find the root cause of the issue.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the NumberOfNotificationsFilteredOutInvalidMessageBody alarm.
 */
export interface SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig extends SnsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * Invalid message bodies are almost always a mistake by the publisher.
   * We recommend to set the threshold to 0 because invalid message bodies
   * are not expected in a healthy system.
   *
   * @default 0
   */
  readonly threshold?: number;
  /**
   * The alarm name.
   *
   * @default - topic.topicName + ' - NumberOfNotificationsFilteredOut-InvalidMessageBody'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm helps to monitor and resolve potential problems with the
   * publisher or subscribers. Check if a publisher is publishing messages with
   * invalid message bodies, or if an inappropriate filter is applied to a subscriber.
   * You can also analyze CloudWatch Logs to help find the root cause of the issue.
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm construct.
 */
export interface SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps
  extends SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig {
  /**
   * The SNS topic for which to create the alarm.
   */
  readonly topic: sns.ITopic;
}

/**
 * An alarm that monitors the number of notifications filtered out due
 * to invalid message body.
 *
 * The alarm is used to detect if the published messages are not valid or
 * if inappropriate filters have been applied to a subscriber.
 *
 * The alarm is triggered when the number of messages filtered out due to
 * invalid message body is greater than the specified threshold.
 */
export class SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps) {
    const alarmName = props.alarmName ?? `${props.topic.topicName} - ${SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_MESSAGE_BODY}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/SNS',
        metricName: SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_MESSAGE_BODY,
        dimensionsMap: {
          TopicName: props.topic.topicName,
        },
        period,
        statistic: 'Sum',
      }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 5,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm helps to monitor and resolve potential problems with the publisher or subscribers. '
        + 'Check if a publisher is publishing messages with invalid message bodies, or if an inappropriate filter is applied to a subscriber. You '
        + 'can also analyze CloudWatch Logs to help find the root cause of the issue.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the NumberOfNotificationsRedrivenToDlq alarm.
 */
export interface SnsNumberOfNotificationsRedrivenToDlqAlarmConfig extends SnsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * In a healthy system of any subscriber type, messages should not be moved
   * to the dead-letter queue. We recommend that you be notified if any messages
   * land in the queue, so that you can identify and address the root cause,
   * and potentially redrive the messages in the dead-letter queue to prevent
   * data loss.
   *
   * @default 0
   */
  readonly threshold?: number;
  /**
   * The alarm name.
   *
   * @default - topic.topicName + ' - NumberOfNotificationsRedrivenToDlq'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm helps to monitor the number of messages that are moved to a dead-letter queue.
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SnsNumberOfNotificationsRedrivenToDlqAlarm construct.
 */
export interface SnsNumberOfNotificationsRedrivenToDlqAlarmProps extends SnsNumberOfNotificationsRedrivenToDlqAlarmConfig {
  /**
   * The SNS topic for which to create the alarm.
   */
  readonly topic: sns.ITopic;
}

/**
 * An alarm that monitors the number of notifications redriven
 * to the dead-letter queue.
 *
 * The alarm is used to detect messages that moved to a dead-letter
 * queue. We recommend that you create this alarm when SNS is coupled
 * with SQS, Lambda or Firehose.
 *
 * The alarm is triggered when the number of messages redriven to the
 * dead-letter queue is greater than the specified threshold.
 */
export class SnsNumberOfNotificationsRedrivenToDlqAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SnsNumberOfNotificationsRedrivenToDlqAlarmProps) {
    const alarmName = props.alarmName ?? `${props.topic.topicName} - ${SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_REDRIVEN_TO_DLQ}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/SNS',
        metricName: SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_REDRIVEN_TO_DLQ,
        dimensionsMap: {
          TopicName: props.topic.topicName,
        },
        period,
        statistic: 'Sum',
      }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 5,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm helps to monitor the number of messages that are moved to a dead-letter queue.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

/**
 * Configuration for the NumberOfNotificationsFailedToRedriveToDlq alarm.
 */
export interface SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig extends SnsAlarmBaseConfig {
  /**
   * The value against which the specified statistic is compared.
   *
   * It's almost always a mistake if messages can't be moved to the dead-letter queue.
   * The recommendation for the threshold is 0, meaning all messages that fail processing
   * must be able to reach the dead-letter queue when the queue has been configured.
   *
   * @default 0
   */
  readonly threshold?: number;
  /**
   * The alarm name.
   *
   * @default - topic.topicName + ' - NumberOfNotificationsFailedToRedriveToDlq'
   */
  readonly alarmName?: string;
  /**
   * The description of the alarm.
   *
   * @default - This alarm helps to monitor messages that couldn't be moved to a dead-letter
   * queue. Check whether your dead-letter queue exists and that it's configured correctly.
   * Also, verify that SNS has permissions to access the dead-letter queue. Refer to the
   * dead-letter queue documentation (https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html)
   * to learn more.
   */
  readonly alarmDescription?: string;
}

/**
 * Properties for the SnsNumberOfNotificationsFailedToRedriveToDlqAlarm construct.
 */
export interface SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps extends SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig {
  /**
   * The SNS topic for which to create the alarm.
   */
  readonly topic: sns.ITopic;
}

/**
 * An alarm that monitors the number of notifications failed to redrive
 * to the dead-letter queue.
 *
 * The alarm is used to detect messages that couldn't be moved to a dead-letter
 * queue.
 *
 * The alarm is triggered when the number of messages failed to redrive to the
 * dead-letter queue is greater than the specified threshold.
 */
export class SnsNumberOfNotificationsFailedToRedriveToDlqAlarm extends cloudwatch.Alarm {
  constructor(scope: IConstruct, id: string, props: SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps) {
    const alarmName = props.alarmName ?? `${props.topic.topicName} - ${SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FAILED_TO_REDRIVE_TO_DLQ}`;
    const period = props.period ?? Duration.minutes(1);
    const evaluationPeriods = props.evaluationPeriods ?? 5;

    validateTotalAlarmPeriod(period, evaluationPeriods, alarmName);

    super(scope, id, {
      alarmName,
      metric: new cloudwatch.Metric({
        namespace: 'AWS/SNS',
        metricName: SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FAILED_TO_REDRIVE_TO_DLQ,
        dimensionsMap: {
          TopicName: props.topic.topicName,
        },
        period,
        statistic: 'Sum',
      }),
      threshold: props.threshold ?? 0,
      evaluationPeriods,
      datapointsToAlarm: props.datapointsToAlarm ?? 5,
      treatMissingData: props.treatMissingData,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription: props.alarmDescription ?? 'This alarm helps to monitor messages that couldn\'t be moved to a dead-letter '
        + 'queue. Check whether your dead-letter queue exists and that it\'s configured correctly. Also, verify that SNS has '
        + 'permissions to access the dead-letter queue. Refer to the dead-letter queue documentation '
        + '(https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html) to learn more.',
    });

    if (props.alarmAction) this.addAlarmAction(props.alarmAction);
    if (props.okAction) this.addOkAction(props.okAction);
    if (props.insufficientDataAction) this.addInsufficientDataAction(props.insufficientDataAction);
  }
}

export interface SnsRecommendedAlarmsConfig {
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
  readonly excludeAlarms?: SnsRecommendedAlarmsMetrics[];
  /**
   * The resources to exclude from the recommended alarms.
   *
   * Use a resources id to exclude a specific resource.
   */
  readonly excludeResources?: string[];
  /**
   * The configuration for the NumberOfMessagesPublished alarm.
   */
  readonly configNumberOfMessagesPublishedAlarm: SnsNumberOfMessagesPublishedAlarmConfig;
  /**
   * The configuration for the NumberOfNotificationsDelivered alarm.
   */
  readonly configNumberOfNotificationsDeliveredAlarm: SnsNumberOfNotificationsDeliveredAlarmConfig;
  /**
   * The configuration for the NumberOfNotificationsFailed alarm.
   */
  readonly configNumberOfNotificationsFailedAlarm: SnsNumberOfNotificationsFailedAlarmConfig;
  /**
   * The configuration for the NumberOfNotificationsFilteredOutInvalidAttributes alarm.
   */
  readonly configNumberOfNotificationsFilteredOutInvalidAttributesAlarm?: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig;
  /**
   * The configuration for the NumberOfNotificationsFilteredOutInvalidMessageBody alarm.
   */
  readonly configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm?: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig;
  /**
   * The configuration for the NumberOfNotificationsRedrivenToDlq alarm.
   */
  readonly configNumberOfNotificationsRedrivenToDlqAlarm?: SnsNumberOfNotificationsRedrivenToDlqAlarmConfig;
  /**
   * The configuration for the NumberOfNotificationsFailedToRedriveToDlq alarm.
   */
  readonly configNumberOfNotificationsFailedToRedriveToDlqAlarm?: SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig;
}

export interface SnsRecommendedAlarmsProps extends SnsRecommendedAlarmsConfig {
  /**
   * The SNS topic for which to create the alarms.
   */
  readonly topic: sns.ITopic;
}

/**
 * A construct that creates recommended alarms for an SNS topic.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SNS
 */
export class SnsRecommendedAlarms extends Construct {
  /**
   * The NumberOfMessagesPublished alarm.
   */
  public readonly alarmNumberOfMessagesPublished?: SnsNumberOfMessagesPublishedAlarm;
  /**
   * The NumberOfNotificationsDelivered alarm.
   */
  public readonly alarmNumberOfNotificationsDelivered?: SnsNumberOfNotificationsDeliveredAlarm;
  /**
   * The NumberOfNotificationsFailed alarm.
   */
  public readonly alarmNumberOfNotificationsFailed?: SnsNumberOfNotificationsFailedAlarm;
  /**
   * The NumberOfNotificationsFilteredOutInvalidAttributes alarm.
   */
  public readonly alarmNumberOfNotificationsFilteredOutInvalidAttributes?: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm;
  /**
   * The NumberOfNotificationsFilteredOutInvalidMessageBody alarm.
   */
  public readonly alarmNumberOfNotificationsFilteredOutInvalidMessageBody?: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm;
  /**
   * The NumberOfNotificationsRedrivenToDlq alarm.
   */
  public readonly alarmNumberOfNotificationsRedrivenToDlq?: SnsNumberOfNotificationsRedrivenToDlqAlarm;
  /**
   * The NumberOfNotificationsFailedToRedriveToDlq alarm.
   */
  public readonly alarmNumberOfNotificationsFailedToRedriveToDlq?: SnsNumberOfNotificationsFailedToRedriveToDlqAlarm;

  constructor(scope: Construct, id: string, props: SnsRecommendedAlarmsProps) {
    super(scope, id);

    if (!props.excludeAlarms?.includes(SnsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_PUBLISHED)) {
      this.alarmNumberOfMessagesPublished = new SnsNumberOfMessagesPublishedAlarm(this, `${id}_NumberOfMessagesPublishedAlarm`, {
        topic: props.topic,
        treatMissingData: props.treatMissingData,
        ...props.configNumberOfMessagesPublishedAlarm,
      });

      if (props.defaultAlarmAction && !props.configNumberOfMessagesPublishedAlarm.alarmAction) {
        this.alarmNumberOfMessagesPublished.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configNumberOfMessagesPublishedAlarm.okAction) {
        this.alarmNumberOfMessagesPublished.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configNumberOfMessagesPublishedAlarm.insufficientDataAction) {
        this.alarmNumberOfMessagesPublished.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_DELIVERED)) {
      this.alarmNumberOfNotificationsDelivered = new SnsNumberOfNotificationsDeliveredAlarm(this, `${id}_NumberOfNotificationsDeliveredAlarm`, {
        topic: props.topic,
        treatMissingData: props.treatMissingData,
        ...props.configNumberOfNotificationsDeliveredAlarm,
      });

      if (props.defaultAlarmAction && !props.configNumberOfNotificationsDeliveredAlarm.alarmAction) {
        this.alarmNumberOfNotificationsDelivered.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configNumberOfNotificationsDeliveredAlarm.okAction) {
        this.alarmNumberOfNotificationsDelivered.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configNumberOfNotificationsDeliveredAlarm.insufficientDataAction) {
        this.alarmNumberOfNotificationsDelivered.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FAILED)) {
      this.alarmNumberOfNotificationsFailed = new SnsNumberOfNotificationsFailedAlarm(this, `${id}_NumberOfNotificationsFailedAlarm`, {
        topic: props.topic,
        treatMissingData: props.treatMissingData,
        ...props.configNumberOfNotificationsFailedAlarm,
      });

      if (props.defaultAlarmAction && !props.configNumberOfNotificationsFailedAlarm.alarmAction) {
        this.alarmNumberOfNotificationsFailed.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configNumberOfNotificationsFailedAlarm.okAction) {
        this.alarmNumberOfNotificationsFailed.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configNumberOfNotificationsFailedAlarm.insufficientDataAction) {
        this.alarmNumberOfNotificationsFailed.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_ATTRIBUTES)) {
      this.alarmNumberOfNotificationsFilteredOutInvalidAttributes = new SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm(this, `${id}_NumberOfNotificationsFilteredOutInvalidAttributesAlarm`, {
        topic: props.topic,
        treatMissingData: props.treatMissingData,
        ...props.configNumberOfNotificationsFilteredOutInvalidAttributesAlarm,
      });

      if (props.defaultAlarmAction && !props.configNumberOfNotificationsFilteredOutInvalidAttributesAlarm?.alarmAction) {
        this.alarmNumberOfNotificationsFilteredOutInvalidAttributes.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configNumberOfNotificationsFilteredOutInvalidAttributesAlarm?.okAction) {
        this.alarmNumberOfNotificationsFilteredOutInvalidAttributes.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configNumberOfNotificationsFilteredOutInvalidAttributesAlarm?.insufficientDataAction) {
        this.alarmNumberOfNotificationsFilteredOutInvalidAttributes.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_MESSAGE_BODY)) {
      this.alarmNumberOfNotificationsFilteredOutInvalidMessageBody = new SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm(this, `${id}_NumberOfNotificationsFilteredOutInvalidMessageBodyAlarm`, {
        topic: props.topic,
        treatMissingData: props.treatMissingData,
        ...props.configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm,
      });

      if (props.defaultAlarmAction && !props.configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm?.alarmAction) {
        this.alarmNumberOfNotificationsFilteredOutInvalidMessageBody.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm?.okAction) {
        this.alarmNumberOfNotificationsFilteredOutInvalidMessageBody.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm?.insufficientDataAction) {
        this.alarmNumberOfNotificationsFilteredOutInvalidMessageBody.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_REDRIVEN_TO_DLQ)) {
      this.alarmNumberOfNotificationsRedrivenToDlq = new SnsNumberOfNotificationsRedrivenToDlqAlarm(this, `${id}_NumberOfNotificationsRedrivenToDlqAlarm`, {
        topic: props.topic,
        treatMissingData: props.treatMissingData,
        ...props.configNumberOfNotificationsRedrivenToDlqAlarm,
      });

      if (props.defaultAlarmAction && !props.configNumberOfNotificationsRedrivenToDlqAlarm?.alarmAction) {
        this.alarmNumberOfNotificationsRedrivenToDlq.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configNumberOfNotificationsRedrivenToDlqAlarm?.okAction) {
        this.alarmNumberOfNotificationsRedrivenToDlq.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configNumberOfNotificationsRedrivenToDlqAlarm?.insufficientDataAction) {
        this.alarmNumberOfNotificationsRedrivenToDlq.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }

    if (!props.excludeAlarms?.includes(SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FAILED_TO_REDRIVE_TO_DLQ)) {
      this.alarmNumberOfNotificationsFailedToRedriveToDlq = new SnsNumberOfNotificationsFailedToRedriveToDlqAlarm(this, `${id}_NumberOfNotificationsFailedToRedriveToDlqAlarm`, {
        topic: props.topic,
        treatMissingData: props.treatMissingData,
        ...props.configNumberOfNotificationsFailedToRedriveToDlqAlarm,
      });

      if (props.defaultAlarmAction && !props.configNumberOfNotificationsFailedToRedriveToDlqAlarm?.alarmAction) {
        this.alarmNumberOfNotificationsFailedToRedriveToDlq.addAlarmAction(props.defaultAlarmAction);
      }

      if (props.defaultOkAction && !props.configNumberOfNotificationsFailedToRedriveToDlqAlarm?.okAction) {
        this.alarmNumberOfNotificationsFailedToRedriveToDlq.addOkAction(props.defaultOkAction);
      }

      if (props.defaultInsufficientDataAction && !props.configNumberOfNotificationsFailedToRedriveToDlqAlarm?.insufficientDataAction) {
        this.alarmNumberOfNotificationsFailedToRedriveToDlq.addInsufficientDataAction(props.defaultInsufficientDataAction);
      }
    }
  }
}

/**
 * An extension of the SNS topic construct that provides helper
 * methods to create recommended alarms.
 */
export class Topic extends sns.Topic {
  constructor(scope: Construct, id: string, props?: sns.TopicProps) {
    super(scope, id, props);
  }

  /**
   * Creates an alarm for the NumberOfMessagesPublished metric.
   */
  public alarmNumberOfMessagesPublished(
    props: SnsNumberOfMessagesPublishedAlarmConfig,
  ): SnsNumberOfMessagesPublishedAlarm {
    return new SnsNumberOfMessagesPublishedAlarm(this, 'NumberOfMessagesPublishedAlarm', {
      topic: this,
      ...props,
    });
  }

  /**
   * Creates an alarm for the NumberOfNotificationsDelivered metric.
   */
  public alarmNumberOfNotificationsDelivered(
    props: SnsNumberOfNotificationsDeliveredAlarmConfig,
  ): SnsNumberOfNotificationsDeliveredAlarm {
    return new SnsNumberOfNotificationsDeliveredAlarm(this, 'NumberOfNotificationsDeliveredAlarm', {
      topic: this,
      ...props,
    });
  }

  /**
   * Creates an alarm for the NumberOfNotificationsFailed metric.
   */
  public alarmNumberOfNotificationsFailed(
    props: SnsNumberOfNotificationsFailedAlarmConfig,
  ): SnsNumberOfNotificationsFailedAlarm {
    return new SnsNumberOfNotificationsFailedAlarm(this, 'NumberOfNotificationsFailedAlarm', {
      topic: this,
      ...props,
    });
  }

  /**
   * Creates an alarm for the NumberOfNotificationsFilteredOutInvalidAttributes metric.
   */
  public alarmNumberOfNotificationsFilteredOutInvalidAttributes(
    props?: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig,
  ): SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm {
    return new SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm(this, 'NumberOfNotificationsFilteredOutInvalidAttributesAlarm', {
      topic: this,
      ...props,
    });
  }

  /**
   * Creates an alarm for the NumberOfNotificationsFilteredOutInvalidMessageBody metric.
   */
  public alarmNumberOfNotificationsFilteredOutInvalidMessageBody(
    props?: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig,
  ): SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm {
    return new SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm(this, 'NumberOfNotificationsFilteredOutInvalidMessageBodyAlarm', {
      topic: this,
      ...props,
    });
  }

  /**
   * Creates an alarm for the NumberOfNotificationsRedrivenToDlq metric.
   */
  public alarmNumberOfNotificationsRedrivenToDlq(
    props?: SnsNumberOfNotificationsRedrivenToDlqAlarmConfig,
  ): SnsNumberOfNotificationsRedrivenToDlqAlarm {
    return new SnsNumberOfNotificationsRedrivenToDlqAlarm(this, 'NumberOfNotificationsRedrivenToDlqAlarm', {
      topic: this,
      ...props,
    });
  }

  /**
   * Creates an alarm for the NumberOfNotificationsFailedToRedriveToDlq metric.
   */
  public alarmNumberOfNotificationsFailedToRedriveToDlq(
    props?: SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig,
  ): SnsNumberOfNotificationsFailedToRedriveToDlqAlarm {
    return new SnsNumberOfNotificationsFailedToRedriveToDlqAlarm(this, 'NumberOfNotificationsFailedToRedriveToDlqAlarm', {
      topic: this,
      ...props,
    });
  }

  /**
   * Creates recommended alarms for the SNS topic.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SNS
   */
  public applyRecommendedAlarms(props: SnsRecommendedAlarmsConfig): SnsRecommendedAlarms {
    return new SnsRecommendedAlarms(this, 'SnsRecommendedAlarms', {
      topic: this,
      ...props,
    });
  }
};

/**
 * An aspect that applies recommended alarms to SNS topics.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SNS
 */
export class SnsRecommendedAlarmsAspect implements IAspect {
  constructor(private readonly props: SnsRecommendedAlarmsConfig) {}

  public visit(node: IConstruct): void {
    if (node instanceof sns.Topic) {
      if (this.props.excludeResources && this.props.excludeResources.includes(node.node.id)) {
        return;
      } else {
        const topic = node as sns.Topic;

        new SnsRecommendedAlarms(node, 'SnsRecommendedAlarmsFromAspect', {
          topic,
          ...this.props,
        });
      }
    }
  }
}
