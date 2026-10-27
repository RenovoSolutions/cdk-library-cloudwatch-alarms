import {
  App, Aspects, Duration, Stack,
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_ec2 as ec2,
  aws_sns as sns,
} from 'aws-cdk-lib';
import { Annotations, Match, Template } from 'aws-cdk-lib/assertions';
import * as natGatewayAlarms from '../src/natgateway';

function stack(): Stack {
  return new Stack(new App(), 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });
}

function natGateway(scope: Stack, id = 'NatGateway'): ec2.CfnNatGateway {
  return new ec2.CfnNatGateway(scope, id, {
    subnetId: 'subnet-0123456789abcdef0',
    allocationId: 'eipalloc-0123456789abcdef0',
  });
}

function snsAction(scope: Stack, id: string): cloudwatch_actions.SnsAction {
  return new cloudwatch_actions.SnsAction(new sns.Topic(scope, id));
}

test('NatGatewayErrorPortAllocationAlarmSnapshot', () => {
  const scope = stack();

  new natGatewayAlarms.NatGatewayErrorPortAllocationAlarm(scope, 'Alarm', {
    natGateway: natGateway(scope),
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayPacketsDropCountAlarmSnapshot', () => {
  const scope = stack();

  new natGatewayAlarms.NatGatewayPacketsDropCountAlarm(scope, 'Alarm', {
    natGateway: natGateway(scope),
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayAlarmsWithCustomConfiguration', () => {
  const scope = stack();
  const action = snsAction(scope, 'Topic');
  const config = {
    threshold: 5,
    period: Duration.minutes(5),
    evaluationPeriods: 25,
    datapointsToAlarm: 20,
    alarmName: 'Custom alarm name',
    alarmDescription: 'Custom alarm description',
    treatMissingData: cloudwatch.TreatMissingData.IGNORE,
    alarmAction: action,
    okAction: action,
    insufficientDataAction: action,
  };

  new natGatewayAlarms.NatGatewayErrorPortAllocationAlarm(scope, 'ErrorPortAllocationAlarm', {
    natGateway: natGateway(scope),
    ...config,
  });
  new natGatewayAlarms.NatGatewayPacketsDropCountAlarm(scope, 'PacketsDropCountAlarm', {
    natGateway: natGateway(scope, 'OtherNatGateway'),
    ...config,
    alarmName: 'Custom packets drop alarm name',
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayAlarmsWithImportedNatGateway', () => {
  const scope = stack();
  const importedNatGateway = ec2.CfnNatGateway.fromNatGatewayId(scope, 'Imported', 'nat-0123456789abcdef0');

  new natGatewayAlarms.NatGatewayErrorPortAllocationAlarm(scope, 'ErrorPortAllocationAlarm', {
    natGateway: importedNatGateway,
  });
  new natGatewayAlarms.NatGatewayPacketsDropCountAlarm(scope, 'PacketsDropCountAlarm', {
    natGateway: importedNatGateway,
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayRecommendedAlarmsSnapshot', () => {
  const scope = stack();

  new natGatewayAlarms.NatGatewayRecommendedAlarms(scope, 'Alarms', {
    natGateway: natGateway(scope),
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayRecommendedAlarmsWithPacketsDropCount', () => {
  const scope = stack();

  new natGatewayAlarms.NatGatewayRecommendedAlarms(scope, 'Alarms', {
    natGateway: natGateway(scope),
    configPacketsDropCountAlarm: {},
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayRecommendedAlarmsWithDefaultActions', () => {
  const scope = stack();
  const action = snsAction(scope, 'Topic');

  new natGatewayAlarms.NatGatewayRecommendedAlarms(scope, 'Alarms', {
    natGateway: natGateway(scope),
    configPacketsDropCountAlarm: {},
    defaultAlarmAction: action,
    defaultOkAction: action,
    defaultInsufficientDataAction: action,
    treatMissingData: cloudwatch.TreatMissingData.BREACHING,
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayRecommendedAlarmsWithOverriddenActions', () => {
  const scope = stack();
  const defaultAction = snsAction(scope, 'DefaultTopic');
  const overrideAction = snsAction(scope, 'OverrideTopic');
  const config = {
    alarmAction: overrideAction,
    okAction: overrideAction,
    insufficientDataAction: overrideAction,
    treatMissingData: cloudwatch.TreatMissingData.IGNORE,
  };

  new natGatewayAlarms.NatGatewayRecommendedAlarms(scope, 'Alarms', {
    natGateway: natGateway(scope),
    defaultAlarmAction: defaultAction,
    defaultOkAction: defaultAction,
    defaultInsufficientDataAction: defaultAction,
    treatMissingData: cloudwatch.TreatMissingData.BREACHING,
    configErrorPortAllocationAlarm: config,
    configPacketsDropCountAlarm: config,
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayRecommendedAlarmsWithExclusions', () => {
  const scope = stack();

  new natGatewayAlarms.NatGatewayRecommendedAlarms(scope, 'ExcludePortAllocation', {
    natGateway: natGateway(scope),
    configPacketsDropCountAlarm: {},
    excludeAlarms: [natGatewayAlarms.NatGatewayRecommendedAlarmsMetrics.ERROR_PORT_ALLOCATION],
  });
  new natGatewayAlarms.NatGatewayRecommendedAlarms(scope, 'ExcludePacketsDrop', {
    natGateway: natGateway(scope, 'OtherNatGateway'),
    configPacketsDropCountAlarm: {},
    excludeAlarms: [natGatewayAlarms.NatGatewayRecommendedAlarmsMetrics.PACKETS_DROP_COUNT],
  });

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayRecommendedAlarmsAspectSnapshot', () => {
  const scope = stack();

  new ec2.Vpc(scope, 'Vpc', { maxAzs: 2, natGateways: 2 });
  natGateway(scope);
  Aspects.of(scope).add(new natGatewayAlarms.NatGatewayRecommendedAlarmsAspect());

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayRecommendedAlarmsAspectWithConfiguration', () => {
  const scope = stack();
  const action = snsAction(scope, 'Topic');

  natGateway(scope);
  natGateway(scope, 'ExcludedNatGateway');
  Aspects.of(scope).add(new natGatewayAlarms.NatGatewayRecommendedAlarmsAspect({
    configPacketsDropCountAlarm: {},
    defaultAlarmAction: action,
    excludeResources: ['ExcludedNatGateway'],
  }));

  expect(Template.fromStack(scope)).toMatchSnapshot();
});

test('NatGatewayRecommendedAlarmsAspectSkipsRegionalNatGateways', () => {
  const scope = stack();
  const regional = new ec2.CfnNatGateway(scope, 'RegionalNatGateway', {
    availabilityMode: 'regional',
    subnetId: 'subnet-0123456789abcdef0',
  });
  const withoutSubnet = new ec2.CfnNatGateway(scope, 'NoSubnetNatGateway', {
    vpcId: 'vpc-0123456789abcdef0',
  });

  Aspects.of(scope).add(new natGatewayAlarms.NatGatewayRecommendedAlarmsAspect());

  const template = Template.fromStack(scope);
  expect(template).toMatchSnapshot();

  [regional, withoutSubnet].forEach(skipped => {
    Annotations.fromStack(scope).hasWarning(`/${skipped.node.path}`, Match.stringLikeRegexp('NAT gateway alarms skipped'));
  });
});
