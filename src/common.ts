import {
  aws_cloudwatch as cloudwatch,
  Duration,
} from 'aws-cdk-lib';

/**
 * The base properties for an alarm where default values
 * are consistent across all alarms.
 */
export interface AlarmBaseProps {
  /**
   * The action to take when an alarm is triggered.
   *
   * @default - None
   */
  readonly alarmAction?: cloudwatch.IAlarmAction;
  /**
   * The action to take when an alarm enters the ok state.
   *
   * @default - None
   */
  readonly okAction?: cloudwatch.IAlarmAction;
  /**
   * The action to take when an alarm has insufficient data.
   *
   * @default - None
   */
  readonly insufficientDataAction?: cloudwatch.IAlarmAction;
  /**
   * How to handle missing data for this alarm.
   *
   * @default TreatMissingData.MISSING
   */
  readonly treatMissingData?: cloudwatch.TreatMissingData;
}

export function validateTotalAlarmPeriod(period: Duration, evaluationPeriods: number, alarmName: string) {
  const totalSeconds = period.toSeconds() * evaluationPeriods;
  const oneDayInSeconds = 86400; // 1 day = 86400 seconds

  if (totalSeconds > oneDayInSeconds) {
    throw new Error(`The period (${period.toSeconds()}) over which the metric for ${alarmName} is measured multiplied by the number of evaluation periods (${evaluationPeriods}) exceeds one day. This is not allowed.`);
  }
}