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
      const resourceProperties = resource.Properties;
      const metricName = dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics[
        metricKey as keyof typeof dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics
      ];

      return resourceProperties.MetricName === metricName;
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

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics[
        metricKey as keyof typeof dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics
      ];

      return resourceProperties.MetricName === metricName;
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
        const resourceProperties = resource.Properties;
        const metricName = dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics[
          metricKey as keyof typeof dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics
        ];

        return resourceName.startsWith(replicationInstanceName) && resourceProperties.MetricName === metricName;
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
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(dmsAlarms.DmsReplicationInstanceRecommendedAlarmsMetrics).forEach(metricName => {
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
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      TreatMissingData: 'notBreaching',
    }));
  });
});

class DmsReplicationTaskStack extends Stack {

  public readonly replicationTask: dmsAlarms.ReplicationTask;

  constructor(scope: App, id: string, props?: StackProps) {
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
      const resourceProperties = resource.Properties;
      const metricName = dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics[
        metricKey as keyof typeof dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics
      ];

      return resourceProperties.MetricName === metricName;
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
      const resourceProperties = resource.Properties;
      const metricName = dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics[
        metricKey as keyof typeof dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics
      ];

      return resourceProperties.MetricName === metricName;
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
        const resourceProperties = resource.Properties;
        const metricName = dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics[
          metricKey as keyof typeof dmsAlarms.DmsReplicationTaskRecommendedAlarmsMetrics
        ];

        return resourceName.startsWith(replicationTaskName) && resourceProperties.MetricName === metricName;
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