import {
  App, Duration, Stack,
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_sns as sns,
} from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as cloudWanAlarms from '../src/cloudwan';

const attachment = {
  coreNetworkId: 'core-network-0123456789abcdef0',
  attachmentId: 'attachment-0123456789abcdef0',
};

function stack(): Stack {
  return new Stack(new App(), 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-west-2',
    },
  });
}

function snsAction(scope: Stack, id: string): cloudwatch_actions.SnsAction {
  return new cloudwatch_actions.SnsAction(new sns.Topic(scope, id));
}

test('CloudWanAttachmentPacketDropCountNoRouteAlarmSnapshot', () => {
  const scope = stack();

  new cloudWanAlarms.CloudWanAttachmentPacketDropCountNoRouteAlarm(scope, 'Alarm', {
    ...attachment,
    threshold: 0,
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('CloudWanAttachmentPacketDropCountBlackholeAlarmSnapshot', () => {
  const scope = stack();

  new cloudWanAlarms.CloudWanAttachmentPacketDropCountBlackholeAlarm(scope, 'Alarm', {
    ...attachment,
    threshold: 10,
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('CloudWanAttachmentAlarmsWithCustomConfiguration', () => {
  const scope = stack();
  const action = snsAction(scope, 'Topic');
  const config = {
    threshold: 50,
    period: Duration.minutes(5),
    evaluationPeriods: 10,
    datapointsToAlarm: 8,
    alarmDescription: 'Custom packet drop alarm description',
    treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    alarmAction: action,
    okAction: action,
    insufficientDataAction: action,
  };

  new cloudWanAlarms.CloudWanAttachmentPacketDropCountNoRouteAlarm(scope, 'NoRouteAlarm', {
    ...attachment,
    ...config,
    alarmName: 'Custom no route alarm',
  });
  new cloudWanAlarms.CloudWanAttachmentPacketDropCountBlackholeAlarm(scope, 'BlackholeAlarm', {
    ...attachment,
    ...config,
    alarmName: 'Custom blackhole alarm',
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('CloudWanAttachmentRecommendedAlarmsSnapshot', () => {
  const scope = stack();

  new cloudWanAlarms.CloudWanAttachmentRecommendedAlarms(scope, 'Alarms', {
    ...attachment,
    configPacketDropCountNoRouteAlarm: { threshold: 0 },
    configPacketDropCountBlackholeAlarm: { threshold: 10 },
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('CloudWanAttachmentRecommendedAlarmsWithDefaultActions', () => {
  const scope = stack();
  const action = snsAction(scope, 'Topic');

  new cloudWanAlarms.CloudWanAttachmentRecommendedAlarms(scope, 'Alarms', {
    ...attachment,
    configPacketDropCountNoRouteAlarm: { threshold: 0 },
    configPacketDropCountBlackholeAlarm: { threshold: 10 },
    defaultAlarmAction: action,
    defaultOkAction: action,
    defaultInsufficientDataAction: action,
    treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('CloudWanAttachmentRecommendedAlarmsWithOverriddenConfiguration', () => {
  const scope = stack();
  const defaultAction = snsAction(scope, 'DefaultTopic');
  const overrideAction = snsAction(scope, 'OverrideTopic');
  const config = {
    threshold: 100,
    period: Duration.minutes(5),
    evaluationPeriods: 12,
    datapointsToAlarm: 10,
    alarmDescription: 'Custom bundle alarm description',
    alarmAction: overrideAction,
    okAction: overrideAction,
    insufficientDataAction: overrideAction,
    treatMissingData: cloudwatch.TreatMissingData.IGNORE,
  };

  new cloudWanAlarms.CloudWanAttachmentRecommendedAlarms(scope, 'Alarms', {
    ...attachment,
    defaultAlarmAction: defaultAction,
    defaultOkAction: defaultAction,
    defaultInsufficientDataAction: defaultAction,
    treatMissingData: cloudwatch.TreatMissingData.BREACHING,
    configPacketDropCountNoRouteAlarm: {
      ...config,
      alarmName: 'Overridden no route alarm',
    },
    configPacketDropCountBlackholeAlarm: {
      ...config,
      alarmName: 'Overridden blackhole alarm',
    },
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('CloudWanAttachmentRecommendedAlarmsWithExclusions', () => {
  const scope = stack();
  const config = {
    coreNetworkId: attachment.coreNetworkId,
    configPacketDropCountNoRouteAlarm: { threshold: 0 },
    configPacketDropCountBlackholeAlarm: { threshold: 10 },
  };

  new cloudWanAlarms.CloudWanAttachmentRecommendedAlarms(scope, 'ExcludeNoRoute', {
    ...config,
    attachmentId: attachment.attachmentId,
    excludeAlarms: [cloudWanAlarms.CloudWanAttachmentRecommendedAlarmsMetrics.PACKET_DROP_COUNT_NO_ROUTE],
  });
  new cloudWanAlarms.CloudWanAttachmentRecommendedAlarms(scope, 'ExcludeBlackhole', {
    ...config,
    attachmentId: 'attachment-0123456789abcdef1',
    excludeAlarms: [cloudWanAlarms.CloudWanAttachmentRecommendedAlarmsMetrics.PACKET_DROP_COUNT_BLACKHOLE],
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});
