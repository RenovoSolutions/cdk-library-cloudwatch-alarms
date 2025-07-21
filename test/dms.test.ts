import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_dms as dms,
  aws_ec2 as ec2,
  aws_lambda as lambda,
  aws_sns as sns,
  Aspects,
  App,
  Duration,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  Match,
  Template,
} from 'aws-cdk-lib/assertions';
import * as dmsAlarms from '../src/dms';

class DmsReplicationInstanceStack extends Stack {

  public readonly replicationInstance: dmsAlarms.ReplicationInstance;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const sg = new ec2.SecurityGroup(this, 'testSG', {
      vpc,
      allowAllOutbound: true,
    });

    this.replicationInstance = new dmsAlarms.ReplicationInstance(this, 'ReplicationInstance', {
      replicationInstanceIdentifier: 'testReplicationInstance',
      vpcSecurityGroupIds: [sg.securityGroupId],
      replicationInstanceClass: 'dms.t3.medium',
    });

  }
}

// Helper function to extract metric name from both regular alarms and anomaly detection alarms
function getMetricNameFromAlarm(resource: any): string | undefined {
  const resourceProperties = resource.Properties;

  // Regular alarm - MetricName is directly in Properties
  if (resourceProperties.MetricName) {
    return resourceProperties.MetricName;
  }

  // Anomaly detection alarm - MetricName is in Properties.Metrics array
  if (resourceProperties.Metrics && Array.isArray(resourceProperties.Metrics)) {
    for (const metric of resourceProperties.Metrics) {
      if (metric.MetricStat?.Metric?.MetricName) {
        return metric.MetricStat.Metric.MetricName;
      }
    }
  }

  return undefined;
}

test('DmsReplicationInstanceSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dmsAlarms.DmsReplicationInstanceRecommendedAlarmsAspect({
      configFreeableMemoryAlarm: {
        threshold: 25000,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 25000,
      },
    }),
  );

  const stack = new DmsReplicationInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DmsReplicationInstanceSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dmsAlarms.DmsReplicationInstanceRecommendedAlarmsAspect({
      excludeAlarms: [dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics.CPU_UTILIZATION],
      configCpuUtilizationAlarm: {
        threshold: 90,
      },
      configFreeableMemoryAlarm: {
        threshold: 25000,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 25000,
      },
      configWriteIopsAlarm: {
        threshold: 1000,
      },
      configSwapUsageAlarm: {
        stdDevs: 2,
      },
    }),
  );

  const stack = new DmsReplicationInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForDmsReplicationInstanceConstruct', () => {
  const app = new App();
  const stack = new DmsReplicationInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.replicationInstance.applyRecommendedAlarms({
    configCpuUtilizationAlarm: {
      threshold: 90,
    },
    configFreeableMemoryAlarm: {
      threshold: 25000,
    },
    configFreeStorageSpaceAlarm: {
      threshold: 25000,
    },
    configWriteIopsAlarm: {
      threshold: 1000,
    },
    configSwapUsageAlarm: {
      stdDevs: 2,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DmsReplicationInstanceSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new DmsReplicationInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new dmsAlarms.DmsReplicationInstanceRecommendedAlarms(stack, 'dmsReplicationInstanceAlarms', {
    replicationInstance: stack.replicationInstance,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configCpuUtilizationAlarm: {
      threshold: 90,
    },
    configFreeableMemoryAlarm: {
      threshold: 25000,
    },
    configFreeStorageSpaceAlarm: {
      threshold: 25000,
    },
    configWriteIopsAlarm: {
      threshold: 1000,
    },
    configSwapUsageAlarm: {
      stdDevs: 2,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain replicationInstance recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dmsAlarms.DmsReplicationInstanceRecommendedAlarmsAspect({
      configCpuUtilizationAlarm: {
        threshold: 90,
      },
      configFreeableMemoryAlarm: {
        threshold: 25000,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 25000,
      },
      configWriteIopsAlarm: {
        threshold: 1000,
      },
      configSwapUsageAlarm: {
        stdDevs: 2,
      },
    }),
  );

  const stack = new DmsReplicationInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const metricName = dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics[
        metricKey as keyof typeof dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics
      ];

      return getMetricNameFromAlarm(resource) === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to replicationInstances using extended construct', () => {
  const app = new App();
  const stack = new DmsReplicationInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.replicationInstance.alarmCpuUtilization();
  stack.replicationInstance.alarmFreeableMemory({ threshold: 25000 });
  stack.replicationInstance.alarmFreeStorageSpace({ threshold: 25000 });
  stack.replicationInstance.alarmWriteIops({ threshold: 1000 });
  stack.replicationInstance.alarmSwapUsage({ stdDevs: 2 });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const metricName = dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics[
        metricKey as keyof typeof dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics
      ];

      return getMetricNameFromAlarm(resource) === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('when an resource is excluded from the aspect config it should not have alarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new dmsAlarms.DmsReplicationInstanceRecommendedAlarmsAspect({
      excludeResources: ['ReplicationInstance1'],
      configCpuUtilizationAlarm: {
        threshold: 90,
      },
      configFreeableMemoryAlarm: {
        threshold: 25000,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 25000,
      },
      configWriteIopsAlarm: {
        threshold: 1000,
      },
      configSwapUsageAlarm: {
        stdDevs: 2,
      },
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');

  const sg = new ec2.SecurityGroup(stack, 'testSG', {
    vpc,
    allowAllOutbound: true,
  });

  new dmsAlarms.ReplicationInstance(stack, 'ReplicationInstance1', {
    replicationInstanceIdentifier: 'testReplicationInstance1',
    vpcSecurityGroupIds: [sg.securityGroupId],
    replicationInstanceClass: 'dms.t3.medium',
  });

  new dmsAlarms.ReplicationInstance(stack, 'ReplicationInstance2', {
    replicationInstanceIdentifier: 'testReplicationInstance2',
    vpcSecurityGroupIds: [sg.securityGroupId],
    replicationInstanceClass: 'dms.t3.medium',
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['ReplicationInstance1', 'ReplicationInstance2'].forEach(replicationInstanceName => {
    Object.keys(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const metricName = dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics[
          metricKey as keyof typeof dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics
        ];

        return resourceName.startsWith(replicationInstanceName) && getMetricNameFromAlarm(resource) === metricName;
      });
      if (replicationInstanceName === 'ReplicationInstance1') {
        expect(alarms.length).toEqual(0);
      } else {
        expect(alarms.length).toEqual(1);
      }
    });
  });
});

test('default alarm actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new DmsReplicationInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');

  const alarmLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new dmsAlarms.DmsReplicationInstanceRecommendedAlarms(stack, 'dmsReplicationInstanceAlarms', {
    replicationInstance: stack.replicationInstance,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configCpuUtilizationAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configFreeableMemoryAlarm: {
      threshold: 25000,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configFreeStorageSpaceAlarm: {
      threshold: 25000,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configWriteIopsAlarm: {
      threshold: 1000,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configSwapUsageAlarm: {
      stdDevs: 2,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).forEach(metricName => {
    // For SwapUsage alarm, check the structure differently since it's an anomaly detection alarm
    if (metricName === 'SwapUsage') {
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        Metrics: Match.arrayWith([
          Match.objectLike({
            MetricStat: Match.objectLike({
              Metric: Match.objectLike({
                MetricName: metricName,
              }),
            }),
          }),
        ]),
        AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
        OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
        InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      }));
    } else {
      // For regular alarms, check the MetricName directly
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        MetricName: metricName,
        AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
        OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
        InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      }));
    }
  });
});

test('optional alarm configurations can be overwritten', () => {
  const app = new App();
  const appAspects = Aspects.of(app);
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');
  const topicAction = new cloudwatch_actions.SnsAction(topic);

  appAspects.add(
    new dmsAlarms.DmsReplicationInstanceRecommendedAlarmsAspect({
      configCpuUtilizationAlarm: {
        alarmName: 'CustomCpuUtilizationAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configFreeableMemoryAlarm: {
        alarmName: 'CustomFreeableMemoryAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configFreeStorageSpaceAlarm: {
        alarmName: 'CustomFreeStorageSpaceAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configWriteIopsAlarm: {
        alarmName: 'CustomWriteIopsAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configSwapUsageAlarm: {
        alarmName: 'CustomSwapUsageAlarm',
        stdDevs: 3,
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');

  const sg = new ec2.SecurityGroup(stack, 'testSG', {
    vpc,
    allowAllOutbound: true,
  });

  new dmsAlarms.ReplicationInstance(stack, 'ReplicationInstance', {
    replicationInstanceIdentifier: 'testReplicationInstance',
    vpcSecurityGroupIds: [sg.securityGroupId],
    replicationInstanceClass: 'dms.t3.medium',
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).forEach(metricName => {
    // For SwapUsage alarm, check the structure differently since it's an anomaly detection alarm
    if (metricName === 'SwapUsage') {
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        Metrics: Match.arrayWith([
          Match.objectLike({
            MetricStat: Match.objectLike({
              Metric: Match.objectLike({
                MetricName: metricName,
              }),
            }),
          }),
        ]),
        AlarmName: Match.stringLikeRegexp('^Custom.*'),
        EvaluationPeriods: 25,
        DatapointsToAlarm: 25,
        AlarmDescription: 'Custom alarm description',
        TreatMissingData: 'ignore',
        AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
        OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
        InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      }));
    } else {
      // For regular alarms, check the MetricName directly
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        MetricName: metricName,
        AlarmName: Match.stringLikeRegexp('^Custom.*'),
        Period: 300,
        EvaluationPeriods: 25,
        DatapointsToAlarm: 25,
        AlarmDescription: 'Custom alarm description',
        TreatMissingData: 'ignore',
        AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
        OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
        InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      }));
    }
  });
});

test('AspectWithTreatMissingData', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dmsAlarms.DmsReplicationInstanceRecommendedAlarmsAspect({
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      configCpuUtilizationAlarm: {
        threshold: 90,
      },
      configFreeableMemoryAlarm: {
        threshold: 25000,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 25000,
      },
      configWriteIopsAlarm: {
        threshold: 1000,
      },
      configSwapUsageAlarm: {
        stdDevs: 2,
      },
    }),
  );

  const stack = new DmsReplicationInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).forEach(metricName => {
    // For SwapUsage alarm, check the structure differently since it's an anomaly detection alarm
    if (metricName === 'SwapUsage') {
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        Metrics: Match.arrayWith([
          Match.objectLike({
            MetricStat: Match.objectLike({
              Metric: Match.objectLike({
                MetricName: metricName,
              }),
            }),
          }),
        ]),
        TreatMissingData: 'notBreaching',
      }));
    } else {
      // For regular alarms, check the MetricName directly
      template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
        MetricName: metricName,
        TreatMissingData: 'notBreaching',
      }));
    }
  });
});

interface DmsReplicationTaskStackProps extends StackProps {
  readonly migrationType?: string;
}

class DmsReplicationTaskStack extends Stack {

  public readonly replicationTask: dmsAlarms.ReplicationTask;

  constructor(scope: App, id: string, props?: DmsReplicationTaskStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const sg = new ec2.SecurityGroup(this, 'testSG', {
      vpc,
      allowAllOutbound: true,
    });

    // Create a replication instance first (required for replication task)
    const replicationInstance = new dmsAlarms.ReplicationInstance(this, 'ReplicationInstance', {
      replicationInstanceIdentifier: 'testReplicationInstance',
      vpcSecurityGroupIds: [sg.securityGroupId],
      replicationInstanceClass: 'dms.t3.medium',
    });

    // Create source and target endpoints (simplified for testing)
    const sourceEndpoint = new dms.CfnEndpoint(this, 'SourceEndpoint', {
      endpointType: 'source',
      engineName: 'mysql',
      serverName: 'source.example.com',
      port: 3306,
      username: 'admin',
      password: 'password',
      databaseName: 'sourcedb',
    });

    const targetEndpoint = new dms.CfnEndpoint(this, 'TargetEndpoint', {
      endpointType: 'target',
      engineName: 'mysql',
      serverName: 'target.example.com',
      port: 3306,
      username: 'admin',
      password: 'password',
      databaseName: 'targetdb',
    });

    this.replicationTask = new dmsAlarms.ReplicationTask(this, 'ReplicationTask', {
      replicationTaskIdentifier: 'testReplicationTask',
      sourceEndpointArn: sourceEndpoint.ref,
      targetEndpointArn: targetEndpoint.ref,
      replicationInstanceArn: replicationInstance.ref,
      migrationType: props?.migrationType ?? 'full-load-and-cdc',
      tableMappings: JSON.stringify({
        rules: [
          {
            'rule-type': 'selection',
            'rule-id': '1',
            'rule-name': '1',
            'object-locator': {
              'schema-name': '%',
              'table-name': '%',
            },
            'rule-action': 'include',
          },
        ],
      }),
    });

  }
}

test('DmsReplicationTaskSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dmsAlarms.DmsReplicationTaskRecommendedAlarmsAspect(),
  );

  const stack = new DmsReplicationTaskStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DmsReplicationTaskSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dmsAlarms.DmsReplicationTaskRecommendedAlarmsAspect({
      excludeAlarms: [dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics.CDC_THROUGHPUT_ROWS_SOURCE],
      configCdcThroughputRowsSourceAlarm: {
        threshold: 100,
      },
      configCdcThroughputRowsTargetAlarm: {
        threshold: 100,
      },
      configFullLoadThroughputRowsSourceAlarm: {
        threshold: 1000,
      },
      configFullLoadThroughputRowsTargetAlarm: {
        threshold: 1000,
      },
      configCdcLatencySourceAlarm: {
        threshold: 300,
      },
      configCdcLatencyTargetAlarm: {
        threshold: 300,
      },
    }),
  );

  const stack = new DmsReplicationTaskStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForDmsReplicationTaskConstruct', () => {
  const app = new App();
  const stack = new DmsReplicationTaskStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.replicationTask.applyRecommendedAlarms({
    configCdcThroughputRowsSourceAlarm: {
      threshold: 100,
    },
    configCdcThroughputRowsTargetAlarm: {
      threshold: 100,
    },
    configFullLoadThroughputRowsSourceAlarm: {
      threshold: 1000,
    },
    configFullLoadThroughputRowsTargetAlarm: {
      threshold: 1000,
    },
    configCdcLatencySourceAlarm: {
      threshold: 300,
    },
    configCdcLatencyTargetAlarm: {
      threshold: 300,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DmsReplicationTaskSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new DmsReplicationTaskStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new dmsAlarms.DmsReplicationTaskRecommendedAlarms(stack, 'dmsReplicationTaskAlarms', {
    replicationTask: stack.replicationTask,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configCdcThroughputRowsSourceAlarm: {
      threshold: 100,
    },
    configCdcThroughputRowsTargetAlarm: {
      threshold: 100,
    },
    configFullLoadThroughputRowsSourceAlarm: {
      threshold: 1000,
    },
    configFullLoadThroughputRowsTargetAlarm: {
      threshold: 1000,
    },
    configCdcLatencySourceAlarm: {
      threshold: 300,
    },
    configCdcLatencyTargetAlarm: {
      threshold: 300,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain replicationTask recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dmsAlarms.DmsReplicationTaskRecommendedAlarmsAspect({
      configCdcThroughputRowsSourceAlarm: {
        threshold: 100,
      },
      configCdcThroughputRowsTargetAlarm: {
        threshold: 100,
      },
      configFullLoadThroughputRowsSourceAlarm: {
        threshold: 1000,
      },
      configFullLoadThroughputRowsTargetAlarm: {
        threshold: 1000,
      },
      configCdcLatencySourceAlarm: {
        threshold: 300,
      },
      configCdcLatencyTargetAlarm: {
        threshold: 300,
      },
    }),
  );

  const stack = new DmsReplicationTaskStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const metricName = dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics[
        metricKey as keyof typeof dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics
      ];

      return getMetricNameFromAlarm(resource) === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to replicationTasks using extended construct', () => {
  const app = new App();
  const stack = new DmsReplicationTaskStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.replicationTask.alarmCdcThroughputRowsSource();
  stack.replicationTask.alarmCdcThroughputRowsTarget({ threshold: 100 });
  stack.replicationTask.alarmFullLoadThroughputRowsSource({ threshold: 1000 });
  stack.replicationTask.alarmFullLoadThroughputRowsTarget({ threshold: 1000 });
  stack.replicationTask.alarmCdcLatencySource({ threshold: 300 });
  stack.replicationTask.alarmCdcLatencyTarget({ threshold: 300 });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const metricName = dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics[
        metricKey as keyof typeof dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics
      ];

      return getMetricNameFromAlarm(resource) === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('when an resource is excluded from the aspect config it should not have alarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new dmsAlarms.DmsReplicationTaskRecommendedAlarmsAspect({
      excludeResources: ['ReplicationTask1'],
      configCdcThroughputRowsSourceAlarm: {
        threshold: 100,
      },
      configCdcThroughputRowsTargetAlarm: {
        threshold: 100,
      },
      configFullLoadThroughputRowsSourceAlarm: {
        threshold: 1000,
      },
      configFullLoadThroughputRowsTargetAlarm: {
        threshold: 1000,
      },
      configCdcLatencySourceAlarm: {
        threshold: 300,
      },
      configCdcLatencyTargetAlarm: {
        threshold: 300,
      },
    }),
  );

  // const vpc = new ec2.Vpc(stack, 'VPC');

  // const sg = new ec2.SecurityGroup(stack, 'testSG', {
  //   vpc,
  //   allowAllOutbound: true,
  // });

  new dmsAlarms.ReplicationTask(stack, 'ReplicationTask1', {
    replicationTaskIdentifier: 'testReplicationTask1',
    sourceEndpointArn: 'arn:aws:dms:us-east-1:123456789012:endpoint:source-endpoint',
    targetEndpointArn: 'arn:aws:dms:us-east-1:123456789012:endpoint:target-endpoint',
    replicationInstanceArn: 'arn:aws:dms:us-east-1:123456789012:rep:replication-instance',
    migrationType: 'full-load-and-cdc',
    tableMappings: JSON.stringify({
      rules: [
        {
          'rule-type': 'selection',
          'rule-id': '1',
          'rule-name': '1',
          'object-locator': {
            'schema-name': '%',
            'table-name': '%',
          },
          'rule-action': 'include',
        },
      ],
    }),
  });

  new dmsAlarms.ReplicationTask(stack, 'ReplicationTask2', {
    replicationTaskIdentifier: 'testReplicationTask2',
    sourceEndpointArn: 'arn:aws:dms:us-east-1:123456789012:endpoint:source-endpoint',
    targetEndpointArn: 'arn:aws:dms:us-east-1:123456789012:endpoint:target-endpoint',
    replicationInstanceArn: 'arn:aws:dms:us-east-1:123456789012:rep:replication-instance',
    migrationType: 'full-load-and-cdc',
    tableMappings: JSON.stringify({
      rules: [
        {
          'rule-type': 'selection',
          'rule-id': '1',
          'rule-name': '1',
          'object-locator': {
            'schema-name': '%',
            'table-name': '%',
          },
          'rule-action': 'include',
        },
      ],
    }),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['ReplicationTask1', 'ReplicationTask2'].forEach(replicationTaskName => {
    Object.keys(dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const metricName = dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics[
          metricKey as keyof typeof dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics
        ];

        return resourceName.startsWith(replicationTaskName) && getMetricNameFromAlarm(resource) === metricName;
      });
      if (replicationTaskName === 'ReplicationTask1') {
        expect(alarms.length).toEqual(0);
      } else {
        expect(alarms.length).toEqual(1);
      }
    });
  });
});

test('default alarm actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new DmsReplicationTaskStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');

  const alarmLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new dmsAlarms.DmsReplicationTaskRecommendedAlarms(stack, 'dmsReplicationTaskAlarms', {
    replicationTask: stack.replicationTask,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configCdcThroughputRowsSourceAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configCdcThroughputRowsTargetAlarm: {
      threshold: 100,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configFullLoadThroughputRowsSourceAlarm: {
      threshold: 1000,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configFullLoadThroughputRowsTargetAlarm: {
      threshold: 1000,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configCdcLatencySourceAlarm: {
      threshold: 300,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configCdcLatencyTargetAlarm: {
      threshold: 300,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
    }));
  });
});

test('optional alarm configurations can be overwritten', () => {
  const app = new App();
  const appAspects = Aspects.of(app);
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');
  const topicAction = new cloudwatch_actions.SnsAction(topic);

  appAspects.add(
    new dmsAlarms.DmsReplicationTaskRecommendedAlarmsAspect({
      configCdcThroughputRowsSourceAlarm: {
        alarmName: 'CustomCdcThroughputRowsSourceAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configCdcThroughputRowsTargetAlarm: {
        alarmName: 'CustomCdcThroughputRowsTargetAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configFullLoadThroughputRowsSourceAlarm: {
        alarmName: 'CustomFullLoadThroughputRowsSourceAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configFullLoadThroughputRowsTargetAlarm: {
        alarmName: 'CustomFullLoadThroughputRowsTargetAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configCdcLatencySourceAlarm: {
        alarmName: 'CustomCdcLatencySourceAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configCdcLatencyTargetAlarm: {
        alarmName: 'CustomCdcLatencyTargetAlarm',
        threshold: 10,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
    }),
  );

  // const vpc = new ec2.Vpc(stack, 'VPC');

  // const sg = new ec2.SecurityGroup(stack, 'testSG', {
  //   vpc,
  //   allowAllOutbound: true,
  // });

  new dmsAlarms.ReplicationTask(stack, 'ReplicationTask', {
    replicationTaskIdentifier: 'testReplicationTask',
    sourceEndpointArn: 'arn:aws:dms:us-east-1:123456789012:endpoint:source-endpoint',
    targetEndpointArn: 'arn:aws:dms:us-east-1:123456789012:endpoint:target-endpoint',
    replicationInstanceArn: 'arn:aws:dms:us-east-1:123456789012:rep:replication-instance',
    migrationType: 'full-load-and-cdc',
    tableMappings: JSON.stringify({
      rules: [
        {
          'rule-type': 'selection',
          'rule-id': '1',
          'rule-name': '1',
          'object-locator': {
            'schema-name': '%',
            'table-name': '%',
          },
          'rule-action': 'include',
        },
      ],
    }),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmName: Match.stringLikeRegexp('^Custom.*'),
      Period: 300,
      EvaluationPeriods: 25,
      DatapointsToAlarm: 25,
      AlarmDescription: 'Custom alarm description',
      TreatMissingData: 'ignore',
      AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
    }));
  });
});

test('AspectWithTreatMissingData', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new dmsAlarms.DmsReplicationTaskRecommendedAlarmsAspect({
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      configCdcThroughputRowsSourceAlarm: {
        threshold: 100,
      },
      configCdcThroughputRowsTargetAlarm: {
        threshold: 100,
      },
      configFullLoadThroughputRowsSourceAlarm: {
        threshold: 1000,
      },
      configFullLoadThroughputRowsTargetAlarm: {
        threshold: 1000,
      },
      configCdcLatencySourceAlarm: {
        threshold: 300,
      },
      configCdcLatencyTargetAlarm: {
        threshold: 300,
      },
    }),
  );

  const stack = new DmsReplicationTaskStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      TreatMissingData: 'notBreaching',
    }));
  });
});

// Error validation tests for migration type mismatches
describe('DMS Replication Task Migration Type Validation', () => {

  test('should throw error when creating CDC throughput source alarm for full-load migration type', () => {
    const app = new App();
    const stack = new DmsReplicationTaskStack(app, 'TestStack', {
      migrationType: 'full-load',
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    expect(() => {
      stack.replicationTask.alarmCdcThroughputRowsSource();
    }).toThrow(
      "CDC throughput alarms can only be created for replication tasks with migration type 'cdc' or 'full-load-and-cdc'. " +
      'Current migration type: full-load',
    );
  });

  test('should throw error when creating CDC throughput target alarm for full-load migration type', () => {
    const app = new App();
    const stack = new DmsReplicationTaskStack(app, 'TestStack', {
      migrationType: 'full-load',
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    expect(() => {
      stack.replicationTask.alarmCdcThroughputRowsTarget();
    }).toThrow(
      "CDC throughput alarms can only be created for replication tasks with migration type 'cdc' or 'full-load-and-cdc'. " +
      'Current migration type: full-load',
    );
  });

  test('should throw error when creating CDC latency source alarm for full-load migration type', () => {
    const app = new App();
    const stack = new DmsReplicationTaskStack(app, 'TestStack', {
      migrationType: 'full-load',
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    expect(() => {
      stack.replicationTask.alarmCdcLatencySource();
    }).toThrow(
      "CDC latency alarms can only be created for replication tasks with migration type 'cdc' or 'full-load-and-cdc'. " +
      'Current migration type: full-load',
    );
  });

  test('should throw error when creating CDC latency target alarm for full-load migration type', () => {
    const app = new App();
    const stack = new DmsReplicationTaskStack(app, 'TestStack', {
      migrationType: 'full-load',
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    expect(() => {
      stack.replicationTask.alarmCdcLatencyTarget();
    }).toThrow(
      "CDC latency alarms can only be created for replication tasks with migration type 'cdc' or 'full-load-and-cdc'. " +
      'Current migration type: full-load',
    );
  });

  test('should throw error when creating full load throughput source alarm for CDC migration type', () => {
    const app = new App();
    const stack = new DmsReplicationTaskStack(app, 'TestStack', {
      migrationType: 'cdc',
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    expect(() => {
      stack.replicationTask.alarmFullLoadThroughputRowsSource();
    }).toThrow(
      "Full load throughput alarms can only be created for replication tasks with migration type 'full-load' or " +
      "'full-load-and-cdc'. Current migration type: cdc",
    );
  });

  test('should throw error when creating full load throughput target alarm for CDC migration type', () => {
    const app = new App();
    const stack = new DmsReplicationTaskStack(app, 'TestStack', {
      migrationType: 'cdc',
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    expect(() => {
      stack.replicationTask.alarmFullLoadThroughputRowsTarget();
    }).toThrow(
      "Full load throughput alarms can only be created for replication tasks with migration type 'full-load' or " +
      "'full-load-and-cdc'. Current migration type: cdc",
    );
  });

  test('should successfully create CDC alarms for CDC migration type', () => {
    const app = new App();
    const stack = new DmsReplicationTaskStack(app, 'TestStack', {
      migrationType: 'cdc',
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    // These should not throw errors
    expect(() => {
      stack.replicationTask.alarmCdcThroughputRowsSource();
      stack.replicationTask.alarmCdcThroughputRowsTarget();
      stack.replicationTask.alarmCdcLatencySource();
      stack.replicationTask.alarmCdcLatencyTarget();
    }).not.toThrow();
  });

  test('should successfully create full load alarms for full-load migration type', () => {
    const app = new App();
    const stack = new DmsReplicationTaskStack(app, 'TestStack', {
      migrationType: 'full-load',
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    // These should not throw errors
    expect(() => {
      stack.replicationTask.alarmFullLoadThroughputRowsSource();
      stack.replicationTask.alarmFullLoadThroughputRowsTarget();
    }).not.toThrow();
  });

  test('should successfully create all alarms for full-load-and-cdc migration type', () => {
    const app = new App();
    const stack = new DmsReplicationTaskStack(app, 'TestStack', {
      migrationType: 'full-load-and-cdc',
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    // All alarms should be allowed for full-load-and-cdc
    expect(() => {
      stack.replicationTask.alarmCdcThroughputRowsSource();
      stack.replicationTask.alarmCdcThroughputRowsTarget();
      stack.replicationTask.alarmCdcLatencySource();
      stack.replicationTask.alarmCdcLatencyTarget();
      stack.replicationTask.alarmFullLoadThroughputRowsSource();
      stack.replicationTask.alarmFullLoadThroughputRowsTarget();
    }).not.toThrow();
  });

  test('should use default migration type when not specified', () => {
    const app = new App();
    const stack = new DmsReplicationTaskStack(app, 'TestStack', {
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    // Default is 'full-load-and-cdc', so all alarms should be allowed
    expect(() => {
      stack.replicationTask.alarmCdcThroughputRowsSource();
      stack.replicationTask.alarmCdcThroughputRowsTarget();
      stack.replicationTask.alarmCdcLatencySource();
      stack.replicationTask.alarmCdcLatencyTarget();
      stack.replicationTask.alarmFullLoadThroughputRowsSource();
      stack.replicationTask.alarmFullLoadThroughputRowsTarget();
    }).not.toThrow();
  });

});