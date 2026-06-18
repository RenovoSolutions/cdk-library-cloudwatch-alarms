import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_ec2 as ec2,
  aws_elasticache as elasticache,
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
import * as elasticacheAlarms from '../src/elasticache';

class ElastiCacheClusterStack extends Stack {

  public readonly cacheCluster: elasticacheAlarms.CfnCacheCluster;

  constructor(scope: App, id: string, props?: StackProps, omitClusterName: boolean = false) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    this.cacheCluster = new elasticacheAlarms.CfnCacheCluster(this, 'RedisCluster', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'redis',
      numCacheNodes: 3,
      clusterName: omitClusterName ? undefined : 'my-redis-cluster',
      vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup],
      cacheSubnetGroupName: new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
        description: 'Subnet group for Redis cluster',
        subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
      }).ref,
    });
  }
}

class ElastiCacheReplicationGroupStack extends Stack {

  public readonly cacheReplicationGroup: elasticacheAlarms.CfnReplicationGroup;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    this.cacheReplicationGroup = new elasticacheAlarms.CfnReplicationGroup(this, 'RedisReplicationGroup', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'redis',
      numNodeGroups: 1,
      replicasPerNodeGroup: 1,
      replicationGroupDescription: 'Elasticache Redis',
      securityGroupIds: [vpc.vpcDefaultSecurityGroup],
      cacheSubnetGroupName: new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
        description: 'Subnet group for Redis cluster',
        subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
      }).ref,
    });
  }
}

test('ElastiCacheClusterSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new elasticacheAlarms.ElastiCacheClusterRecommendedAlarmsAspect({
      configDatabaseMemoryUsagePercentageAlarm: {
        threshold: 90,
      },
      configEngineCpuUtilizationAlarm: {
        threshold: 90,
      },
      configReplicationLagAlarm: {
        threshold: 90,
      },
    }),
  );

  const stack = new ElastiCacheClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('ElastiCacheReplicationGroupSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new elasticacheAlarms.ElastiCacheReplicationGroupRecommendedAlarmsAspect({
      configDatabaseMemoryUsagePercentageAlarm: {
        threshold: 90,
      },
      configEngineCpuUtilizationAlarm: {
        threshold: 90,
      },
      configReplicationLagAlarm: {
        threshold: 90,
      },
    }),
  );

  const stack = new ElastiCacheReplicationGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('ElastiCacheClusterSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new elasticacheAlarms.ElastiCacheClusterRecommendedAlarmsAspect({
      excludeAlarms: [elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics.ENGINE_CPU_UTILIZATION],
      configDatabaseMemoryUsagePercentageAlarm: {
        threshold: 90,
      },
      configEngineCpuUtilizationAlarm: {
        threshold: 90,
      },
      configReplicationLagAlarm: {
        threshold: 90,
      },
    }),
  );

  const stack = new ElastiCacheClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('ElastiCacheReplicationGroupSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new elasticacheAlarms.ElastiCacheReplicationGroupRecommendedAlarmsAspect({
      excludeAlarms: [elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics.ENGINE_CPU_UTILIZATION],
      configDatabaseMemoryUsagePercentageAlarm: {
        threshold: 90,
      },
      configEngineCpuUtilizationAlarm: {
        threshold: 90,
      },
      configReplicationLagAlarm: {
        threshold: 90,
      },
    }),
  );

  const stack = new ElastiCacheReplicationGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForElastiCacheClusterConstruct', () => {
  const app = new App();
  const stack = new ElastiCacheClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.cacheCluster.applyRecommendedAlarms({
    configDatabaseMemoryUsagePercentageAlarm: {
      threshold: 90,
    },
    configEngineCpuUtilizationAlarm: {
      threshold: 90,
    },
    configReplicationLagAlarm: {
      threshold: 90,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForElastiCacheReplicationGroupConstruct', () => {
  const app = new App();
  const stack = new ElastiCacheReplicationGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.cacheReplicationGroup.applyRecommendedAlarms({
    configDatabaseMemoryUsagePercentageAlarm: {
      threshold: 90,
    },
    configEngineCpuUtilizationAlarm: {
      threshold: 90,
    },
    configReplicationLagAlarm: {
      threshold: 90,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('ElastiCacheClusterSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new ElastiCacheClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new elasticacheAlarms.ElastiCacheClusterRecommendedAlarms(stack, 'elasticacheCfnCacheClusterAlarms', {
    cacheCluster: stack.cacheCluster,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configDatabaseMemoryUsagePercentageAlarm: {
      threshold: 90,
    },
    configReplicationLagAlarm: {
      threshold: 90,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('ElastiCacheReplicationGroupSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new ElastiCacheReplicationGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  new elasticacheAlarms.ElastiCacheReplicationGroupRecommendedAlarms(stack, 'elasticacheCfnCacheReplicationGroupAlarms', {
    cacheReplicationGroup: stack.cacheReplicationGroup,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
    configDatabaseMemoryUsagePercentageAlarm: {
      threshold: 90,
    },
    configReplicationLagAlarm: {
      threshold: 90,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain cacheCluster recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new elasticacheAlarms.ElastiCacheClusterRecommendedAlarmsAspect({
      configDatabaseMemoryUsagePercentageAlarm: {
        threshold: 90,
      },
      configEngineCpuUtilizationAlarm: {
        threshold: 90,
      },
      configReplicationLagAlarm: {
        threshold: 90,
      },
    }),
  );

  const stack = new ElastiCacheClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('stack should contain cacheReplicationGroup recommended alarms if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new elasticacheAlarms.ElastiCacheReplicationGroupRecommendedAlarmsAspect({
      configDatabaseMemoryUsagePercentageAlarm: {
        threshold: 90,
      },
      configEngineCpuUtilizationAlarm: {
        threshold: 90,
      },
      configReplicationLagAlarm: {
        threshold: 90,
      },
    }),
  );

  const stack = new ElastiCacheReplicationGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(1);
  });
});

test('alarms can be applied individually to Cluster resources using extended construct', () => {
  const app = new App();
  const stack = new ElastiCacheClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.cacheCluster.alarmDatabaseMemoryUsagePercentage({
    threshold: 90,
  });
  stack.cacheCluster.alarmEngineCpuUtilization();
  stack.cacheCluster.alarmReplicationLag({
    threshold: 90,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('alarms can be applied individually to ReplicationGroup resources using extended construct', () => {
  const app = new App();
  const stack = new ElastiCacheReplicationGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.cacheReplicationGroup.alarmDatabaseMemoryUsagePercentage({
    threshold: 90,
  });
  stack.cacheReplicationGroup.alarmEngineCpuUtilization();
  stack.cacheReplicationGroup.alarmReplicationLag({
    threshold: 90,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numOfMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('when an resource is excluded from the Cluster aspect config it should not have alarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new elasticacheAlarms.ElastiCacheClusterRecommendedAlarmsAspect({
      excludeResources: ['RedisCluster1'],
      configDatabaseMemoryUsagePercentageAlarm: {
        threshold: 90,
      },
      configReplicationLagAlarm: {
        threshold: 90,
      },
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');

  new elasticacheAlarms.CfnCacheCluster(stack, 'RedisCluster1', {
    cacheNodeType: 'cache.t3.micro',
    engine: 'redis',
    numCacheNodes: 3,
    clusterName: 'my-redis-cluster',
    vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup],
    cacheSubnetGroupName: new elasticache.CfnSubnetGroup(stack, 'RedisSubnetGroup1', {
      description: 'Subnet group for Redis cluster',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    }).ref,
  });

  new elasticacheAlarms.CfnCacheCluster(stack, 'RedisCluster2', {
    cacheNodeType: 'cache.t3.micro',
    engine: 'redis',
    numCacheNodes: 3,
    clusterName: 'my-redis-cluster',
    vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup],
    cacheSubnetGroupName: new elasticache.CfnSubnetGroup(stack, 'RedisSubnetGroup2', {
      description: 'Subnet group for Redis cluster',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    }).ref,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['RedisCluster1', 'RedisCluster2'].forEach(cacheClusterName => {
    Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(cacheClusterName) && resourceProperties.MetricName === metricName;
      });
      if (cacheClusterName === 'RedisCluster1') {
        expect(alarms.length).toEqual(0);
      } else {
        expect(alarms.length).toEqual(1);
      }
    });
  });
});

test('when an resource is excluded from the ReplicationGroup aspect config it should not have alarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new elasticacheAlarms.ElastiCacheReplicationGroupRecommendedAlarmsAspect({
      excludeResources: ['RedisReplicationGroup1'],
      configDatabaseMemoryUsagePercentageAlarm: {
        threshold: 90,
      },
      configReplicationLagAlarm: {
        threshold: 90,
      },
    }),
  );

  const vpc = new ec2.Vpc(stack, 'VPC');

  new elasticacheAlarms.CfnReplicationGroup(stack, 'RedisReplicationGroup1', {
    cacheNodeType: 'cache.t3.micro',
    engine: 'redis',
    numNodeGroups: 1,
    replicasPerNodeGroup: 1,
    replicationGroupDescription: 'Elasticache Redis',
    securityGroupIds: [vpc.vpcDefaultSecurityGroup],
    cacheSubnetGroupName: new elasticache.CfnSubnetGroup(stack, 'RedisSubnetGroup1', {
      description: 'Subnet group for Redis cluster',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    }).ref,
  });

  new elasticacheAlarms.CfnReplicationGroup(stack, 'RedisReplicationGroup2', {
    cacheNodeType: 'cache.t3.micro',
    engine: 'redis',
    numNodeGroups: 1,
    replicasPerNodeGroup: 1,
    replicationGroupDescription: 'Elasticache Redis',
    securityGroupIds: [vpc.vpcDefaultSecurityGroup],
    cacheSubnetGroupName: new elasticache.CfnSubnetGroup(stack, 'RedisSubnetGroup2', {
      description: 'Subnet group for Redis cluster',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    }).ref,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfMetrics = Object.keys(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numOfMetrics);

  ['RedisReplicationGroup1', 'RedisReplicationGroup2'].forEach(cacheReplicationGroupName => {
    Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(cacheReplicationGroupName) && resourceProperties.MetricName === metricName;
      });
      if (cacheReplicationGroupName === 'RedisReplicationGroup1') {
        expect(alarms.length).toEqual(0);
      } else {
        expect(alarms.length).toEqual(1);
      }
    });
  });
});

test('default Cluster alarm actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new ElastiCacheClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');

  const alarmLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new elasticacheAlarms.ElastiCacheClusterRecommendedAlarms(stack, 'elasticacheCfnCacheClusterAlarms', {
    cacheCluster: stack.cacheCluster,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configDatabaseMemoryUsagePercentageAlarm: {
      threshold: 90,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configEngineCpuUtilizationAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configReplicationLagAlarm: {
      threshold: 90,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
    }));
  });
});

test('default ReplicationGroup alarm actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new ElastiCacheReplicationGroupStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const topic = new sns.Topic(stack, 'Topic');

  const alarmLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_24_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new elasticacheAlarms.ElastiCacheReplicationGroupRecommendedAlarms(stack, 'elasticacheCfnCacheReplicationGroupAlarms', {
    cacheReplicationGroup: stack.cacheReplicationGroup,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configDatabaseMemoryUsagePercentageAlarm: {
      threshold: 90,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configEngineCpuUtilizationAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configReplicationLagAlarm: {
      threshold: 90,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
    }));
  });
});

test('optional Cluster alarm configurations can be overwritten', () => {
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
    new elasticacheAlarms.ElastiCacheClusterRecommendedAlarmsAspect({
      configDatabaseMemoryUsagePercentageAlarm: {
        alarmName: 'CustomDatabaseMemoryUsagePercentageAlarm',
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
      configEngineCpuUtilizationAlarm: {
        alarmName: 'CustomEngineCpuUtilizationAlarm',
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
      configReplicationLagAlarm: {
        alarmName: 'CustomDatabaseMemoryUsagePercentageAlarm',
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

  new elasticacheAlarms.CfnCacheCluster(stack, 'RedisCluster', {
    cacheNodeType: 'cache.t3.micro',
    engine: 'redis',
    numCacheNodes: 3,
    clusterName: 'my-redis-cluster',
    vpcSecurityGroupIds: [vpc.vpcDefaultSecurityGroup],
    cacheSubnetGroupName: new elasticache.CfnSubnetGroup(stack, 'RedisSubnetGroup', {
      description: 'Subnet group for Redis cluster',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    }).ref,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
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

test('optional ReplicationGroup alarm configurations can be overwritten', () => {
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
    new elasticacheAlarms.ElastiCacheReplicationGroupRecommendedAlarmsAspect({
      configDatabaseMemoryUsagePercentageAlarm: {
        alarmName: 'CustomDatabaseMemoryUsagePercentageAlarm',
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
      configEngineCpuUtilizationAlarm: {
        alarmName: 'CustomEngineCpuUtilizationAlarm',
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
      configReplicationLagAlarm: {
        alarmName: 'CustomDatabaseMemoryUsagePercentageAlarm',
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

  new elasticacheAlarms.CfnReplicationGroup(stack, 'RedisReplicationGroup', {
    cacheNodeType: 'cache.t3.micro',
    engine: 'redis',
    numNodeGroups: 1,
    replicasPerNodeGroup: 1,
    replicationGroupDescription: 'Elasticache Redis',
    securityGroupIds: [vpc.vpcDefaultSecurityGroup],
    cacheSubnetGroupName: new elasticache.CfnSubnetGroup(stack, 'RedisSubnetGroup', {
      description: 'Subnet group for Redis cluster',
      subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    }).ref,
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
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

test('ClusterWithNoName', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  /**
   * Build the cluster without a name so the alarms fall back to the construct's logical ID.
   * Newer aws-cdk-lib stores L1 properties via accessors, so deleting `clusterName` after
   * construction is a no-op and would no longer exercise the fallback.
   */
  const stack = new ElastiCacheClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  }, true);

  appAspects.add(
    new elasticacheAlarms.ElastiCacheClusterRecommendedAlarmsAspect({
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      configDatabaseMemoryUsagePercentageAlarm: {
        threshold: 90,
      },
      configEngineCpuUtilizationAlarm: {
      },
      configReplicationLagAlarm: {
        threshold: 90,
      },
    }),
  );

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      TreatMissingData: 'notBreaching',
    }));
  });
});

test('AspectWithTreatMissingData', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  const stack = new ElastiCacheClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  appAspects.add(
    new elasticacheAlarms.ElastiCacheClusterRecommendedAlarmsAspect({
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      configDatabaseMemoryUsagePercentageAlarm: {
        threshold: 90,
      },
      configEngineCpuUtilizationAlarm: {
      },
      configReplicationLagAlarm: {
        threshold: 90,
      },
    }),
  );

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(elasticacheAlarms.ElastiCacheRecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      TreatMissingData: 'notBreaching',
    }));
  });
});
