/**
 * Minimal shape of a `Metrics` array entry in an anomaly detection alarm CFN resource.
 * Typing this explicitly (instead of `any`) makes a CDK schema rename surface as a
 * compile error rather than a silent test miss.
 */
export type AnomalyMetricEntry = { MetricStat?: { Metric?: { MetricName?: string } } };

/**
 * True if the alarm resource's `Metrics[]` wraps the given underlying CloudWatch metric
 * name inside an `ANOMALY_DETECTION_BAND` expression. Anomaly alarms have no top-level
 * `MetricName`, so this is how they are matched instead.
 */
export function matchesAnomalyMetric(
  properties: { Metrics?: AnomalyMetricEntry[] },
  underlyingMetricName: string,
): boolean {
  return (properties.Metrics ?? []).some(m => m.MetricStat?.Metric?.MetricName === underlyingMetricName);
}
