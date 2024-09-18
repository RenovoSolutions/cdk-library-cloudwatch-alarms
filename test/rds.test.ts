import {
  aws_cloudwatch as cloudwatch,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_ec2 as ec2,
  aws_lambda as lambda,
  aws_rds as rds,
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
import * as rdsAlarms from '../src/rds';

class AuroraMySQLClusterStack extends Stack {

  public readonly vpc: ec2.Vpc;

  public readonly writerInstance: rds.IClusterInstance;

  public readonly readerInstances: rds.IClusterInstance[];

  public readonly databaseCluster: rdsAlarms.DatabaseCluster;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'test-rds', {
      maxAzs: 3,
      vpcName: 'test-rds',
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    const rdsSecurityGroup = new ec2.SecurityGroup(
      this,
      'rds-security-group',
      {
        vpc: this.vpc,
        securityGroupName: 'rds-security-group',
        description: 'Security group for RDS',
      },
    );

    this.writerInstance = rds.ClusterInstance.provisioned('writer-instance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
      instanceIdentifier: 'writer-instance',
    });

    const readerInstance = rds.ClusterInstance.provisioned('reader-instance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
      instanceIdentifier: 'reader-instance',
    });

    this.readerInstances = [readerInstance];

    this.databaseCluster = new rdsAlarms.DatabaseCluster(this, 'AuroraMySQLCluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_07_0 }),
      vpc: this.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      clusterIdentifier: 'test',
      writer: this.writerInstance,
      readers: this.readerInstances,
      defaultDatabaseName: 'test',
      credentials: rds.Credentials.fromGeneratedSecret('admin', { secretName: 'sample-database-config' }),
      securityGroups: [rdsSecurityGroup],
    });
  }
}

class AuroraPostgresClusterStack extends Stack {

  public readonly vpc: ec2.Vpc;

  public readonly writerInstance: rds.IClusterInstance;

  public readonly readerInstances: rds.IClusterInstance[];

  public readonly databaseCluster: rdsAlarms.DatabaseCluster;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'test-rds', {
      maxAzs: 3,
      vpcName: 'test-rds',
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    const rdsSecurityGroup = new ec2.SecurityGroup(
      this,
      'rds-security-group',
      {
        vpc: this.vpc,
        securityGroupName: 'rds-security-group',
        description: 'Security group for RDS',
      },
    );

    this.writerInstance = rds.ClusterInstance.provisioned('writer-instance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
      instanceIdentifier: 'writer-instance',
    });

    const readerInstance = rds.ClusterInstance.provisioned('reader-instance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
      instanceIdentifier: 'reader-instance',
    });

    this.readerInstances = [readerInstance];

    this.databaseCluster = new rdsAlarms.DatabaseCluster(this, 'AuroraPostgresCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({ version: rds.AuroraPostgresEngineVersion.VER_12_19 }),
      vpc: this.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      clusterIdentifier: 'test',
      writer: this.writerInstance,
      readers: this.readerInstances,
      defaultDatabaseName: 'test',
      credentials: rds.Credentials.fromGeneratedSecret('admin', { secretName: 'sample-database-config' }),
      securityGroups: [rdsSecurityGroup],
    });
  }
}

class MySQLDatabaseInstanceStack extends Stack {

  public readonly vpc: ec2.Vpc;

  public readonly databaseInstance: rdsAlarms.DatabaseInstance;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, 'test-rds', {
      maxAzs: 3,
      vpcName: 'test-rds',
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    const rdsSecurityGroup = new ec2.SecurityGroup(
      this,
      'rds-security-group',
      {
        vpc: this.vpc,
        securityGroupName: 'rds-security-group',
        description: 'Security group for RDS',
      },
    );

    this.databaseInstance = new rdsAlarms.DatabaseInstance(this, 'MySQLInstance', {
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_25 }),
      vpc: this.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
      instanceIdentifier: 'test',
      databaseName: 'test',
      credentials: rds.Credentials.fromGeneratedSecret('admin', { secretName: 'sample-database-config' }),
      securityGroups: [rdsSecurityGroup],
    });
  }
}

test('DatabaseClusterSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new rdsAlarms.RdsAuroraRecommendedAlarmsAspect({
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
      configAuroraVolumeBytesLeftTotalAlarm: {
        threshold: 20,
      },
    }),
  );

  const stack = new AuroraMySQLClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DatabaseInstanceSnapshot', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new rdsAlarms.RdsInstanceRecommendedAlarmsAspect({
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
    }),
  );

  const stack = new MySQLDatabaseInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DatabaseClusterSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new rdsAlarms.RdsAuroraRecommendedAlarmsAspect({
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
      configAuroraVolumeBytesLeftTotalAlarm: {
        threshold: 20,
      },
      excludeAlarms: [rdsAlarms.RdsRecommendedAlarmsMetrics.INSTANCE_CPU_UTILIZATION],
    }),
  );

  const stack = new AuroraMySQLClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DatabaseInstanceSnapshotWithExclusion', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new rdsAlarms.RdsInstanceRecommendedAlarmsAspect({
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
      excludeAlarms: [rdsAlarms.RdsRecommendedAlarmsMetrics.INSTANCE_CPU_UTILIZATION],
    }),
  );

  const stack = new MySQLDatabaseInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForDatabaseClusterConstruct', () => {
  const app = new App();
  const stack = new AuroraMySQLClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.databaseCluster.applyRecommendedAlarms({
    configDatabaseConnectionsAlarm: {
      threshold: 10,
    },
    configFreeableMemoryAlarm: {
      threshold: 5,
    },
    configFreeLocalStorageAlarm: {
      threshold: 20,
    },
    configFreeStorageSpaceAlarm: {
      threshold: 20,
    },
    configDbLoadAlarm: {
      threshold: 4,
    },
    configReadLatencyAlarm: {
      threshold: 20,
    },
    configWriteLatencyAlarm: {
      threshold: 20,
    },
    configAuroraVolumeBytesLeftTotalAlarm: {
      threshold: 20,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('SnapshotForDatabaseInstanceConstruct', () => {
  const app = new App();
  const stack = new MySQLDatabaseInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.databaseInstance.applyRecommendedAlarms({
    configDatabaseConnectionsAlarm: {
      threshold: 10,
    },
    configFreeableMemoryAlarm: {
      threshold: 5,
    },
    configFreeLocalStorageAlarm: {
      threshold: 20,
    },
    configFreeStorageSpaceAlarm: {
      threshold: 20,
    },
    configDbLoadAlarm: {
      threshold: 4,
    },
    configReadLatencyAlarm: {
      threshold: 20,
    },
    configWriteLatencyAlarm: {
      threshold: 20,
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DatabaseClusterSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new AuroraMySQLClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });
  const alarmTopic = new sns.Topic(stack, 'Topic');

  new rdsAlarms.RdsAuroraRecommendedAlarms(stack, 'rdsClusterAlarms', {
    databaseCluster: stack.databaseCluster,
    configDatabaseConnectionsAlarm: {
      threshold: 10,
    },
    configFreeableMemoryAlarm: {
      threshold: 5,
    },
    configFreeLocalStorageAlarm: {
      threshold: 20,
    },
    configFreeStorageSpaceAlarm: {
      threshold: 20,
    },
    configDbLoadAlarm: {
      threshold: 4,
    },
    configReadLatencyAlarm: {
      threshold: 20,
    },
    configWriteLatencyAlarm: {
      threshold: 20,
    },
    configAuroraVolumeBytesLeftTotalAlarm: {
      threshold: 20,
    },
    configAuroraBinLogReplicationLagAlarm: {
      threshold: 20,
    },
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('DatabaseInstanceSnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const alarmTopic = new sns.Topic(stack, 'Topic');

  const vpc = new ec2.Vpc(stack, 'test-vpc', {
    maxAzs: 3,
    vpcName: 'test-vpc',
    subnetConfiguration: [
      {
        name: 'public',
        subnetType: ec2.SubnetType.PUBLIC,
      },
      {
        name: 'private',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    ],
  });

  const rdsSecurityGroup = new ec2.SecurityGroup(
    stack,
    'rds-security-group',
    {
      vpc: vpc,
      securityGroupName: 'rds-security-group',
      description: 'Security group for RDS',
    },
  );

  const databaseInstance1 = new rdsAlarms.DatabaseInstance(stack, 'MySQLInstance1', {
    engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_25 }),
    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
    instanceIdentifier: 'test1',
    databaseName: 'test',
    credentials: rds.Credentials.fromGeneratedSecret('admin', { secretName: 'sample-database-config' }),
    securityGroups: [rdsSecurityGroup],
  });

  const databaseInstance2 = new rdsAlarms.DatabaseInstance(stack, 'MySQLInstance2', {
    engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_25 }),
    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
    instanceIdentifier: 'test2',
    databaseName: 'test',
    credentials: rds.Credentials.fromGeneratedSecret('admin', { secretName: 'sample-database-config' }),
    securityGroups: [rdsSecurityGroup],
  });

  new rdsAlarms.RdsInstanceRecommendedAlarms(stack, 'rdsDatabaseInstanceAlarms1', {
    databaseInstance: databaseInstance1,
    configDatabaseConnectionsAlarm: {
      threshold: 10,
    },
    configFreeableMemoryAlarm: {
      threshold: 5,
    },
    configFreeLocalStorageAlarm: {
      threshold: 20,
    },
    configFreeStorageSpaceAlarm: {
      threshold: 20,
    },
    configDbLoadAlarm: {
      threshold: 4,
    },
    configReadLatencyAlarm: {
      threshold: 20,
    },
    configWriteLatencyAlarm: {
      threshold: 20,
    },
  });

  new rdsAlarms.RdsInstanceRecommendedAlarms(stack, 'rdsDatabaseInstanceAlarms2', {
    databaseInstance: databaseInstance2,
    configDatabaseConnectionsAlarm: {
      threshold: 10,
    },
    configFreeableMemoryAlarm: {
      threshold: 5,
    },
    configFreeLocalStorageAlarm: {
      threshold: 20,
    },
    configFreeStorageSpaceAlarm: {
      threshold: 20,
    },
    configDbLoadAlarm: {
      threshold: 4,
    },
    configReadLatencyAlarm: {
      threshold: 20,
    },
    configWriteLatencyAlarm: {
      threshold: 20,
    },
    defaultAlarmAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultOkAction: new cloudwatch_actions.SnsAction(alarmTopic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(alarmTopic),
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});

test('stack should contain cluster recommended alarms if cluster recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new rdsAlarms.RdsAuroraRecommendedAlarmsAspect({
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
      configAuroraVolumeBytesLeftTotalAlarm: {
        threshold: 20,
      },
    }),
  );

  const stack = new AuroraMySQLClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfInstances = stack.databaseCluster.instanceIdentifiers.length;
  const numClusterMetrics = Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('AURORA_')).length;
  const numInstanceMetrics = Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numClusterMetrics + numInstanceMetrics * numOfInstances);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = rdsAlarms.RdsRecommendedAlarmsMetrics[metricKey as keyof typeof rdsAlarms.RdsRecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(numOfInstances);
  });
});

test('stack should contain cluster recommended alarms for the specific engine if cluster recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new rdsAlarms.RdsAuroraRecommendedAlarmsAspect({
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
      configAuroraVolumeBytesLeftTotalAlarm: {
        threshold: 20,
      },
    }),
  );

  const stack = new AuroraPostgresClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfInstances = stack.databaseCluster.instanceIdentifiers.length;
  const numClusterMetrics = Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('AURORA_')).length - 2; // 2 metrics are not supported by Aurora Postgres
  const numInstanceMetrics = Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numClusterMetrics + numInstanceMetrics * numOfInstances);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = rdsAlarms.RdsRecommendedAlarmsMetrics[metricKey as keyof typeof rdsAlarms.RdsRecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(numOfInstances);
  });
});

test('stack should contain instance recommended alarms if instance recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const appAspects = Aspects.of(app);

  appAspects.add(
    new rdsAlarms.RdsInstanceRecommendedAlarmsAspect({
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
    }),
  );

  const stack = new MySQLDatabaseInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfInstances = 1;
  const numInstanceMetrics = Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numInstanceMetrics * numOfInstances);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = rdsAlarms.RdsRecommendedAlarmsMetrics[metricKey as keyof typeof rdsAlarms.RdsRecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toEqual(numOfInstances);
  });
});

test('alarms can be applied individually to clusters using extended construct', () => {
  const app = new App();
  const stack = new AuroraMySQLClusterStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.databaseCluster.alarmAuroraVolumeBytesLeftTotal({ threshold: 20 });
  stack.databaseCluster.alarmAuroraBinLogReplicationLag();

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numClusterMetrics = Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('AURORA_')).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numClusterMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('AURORA_')).forEach(metricKey => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;
      const metricName = rdsAlarms.RdsRecommendedAlarmsMetrics[metricKey as keyof typeof rdsAlarms.RdsRecommendedAlarmsMetrics];

      return resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('alarms can be applied individually to instances using extended construct', () => {
  const app = new App();
  const stack = new MySQLDatabaseInstanceStack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  stack.databaseInstance.alarmCpuUtilization();
  stack.databaseInstance.alarmDatabaseConnections({ threshold: 10 });
  stack.databaseInstance.alarmFreeableMemory({ threshold: 5 });
  stack.databaseInstance.alarmFreeLocalStorage({ threshold: 20 });
  stack.databaseInstance.alarmFreeStorageSpace({ threshold: 20 });
  stack.databaseInstance.alarmDbLoad({ threshold: 4 });
  stack.databaseInstance.alarmReadLatency({ threshold: 20 });
  stack.databaseInstance.alarmWriteLatency({ threshold: 20 });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numInstanceMetrics = Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numInstanceMetrics);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith(stack.databaseInstance.instanceIdentifier) && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('when a cluster is excluded from the aspect config it should not have alarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new rdsAlarms.RdsAuroraRecommendedAlarmsAspect({
      excludeResources: ['AuroraMySQLCluster1'],
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
      configAuroraVolumeBytesLeftTotalAlarm: {
        threshold: 20,
      },
    }),
  );

  const vpc = new ec2.Vpc(stack, 'test-vpc', {
    maxAzs: 3,
    vpcName: 'test-vpc',
    subnetConfiguration: [
      {
        name: 'public',
        subnetType: ec2.SubnetType.PUBLIC,
      },
      {
        name: 'private',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    ],
  });

  const rdsSecurityGroup = new ec2.SecurityGroup(
    stack,
    'rds-security-group',
    {
      vpc: vpc,
      securityGroupName: 'rds-security-group',
      description: 'Security group for RDS',
    },
  );

  const writerInstance = rds.ClusterInstance.provisioned('writer-instance', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
    instanceIdentifier: 'writer-instance',
  });

  const readerInstance1 = rds.ClusterInstance.provisioned('reader-instance1', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
    instanceIdentifier: 'reader-instance',
  });

  const readerInstance2 = rds.ClusterInstance.provisioned('reader-instance2', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
    instanceIdentifier: 'reader-instance',
  });

  new rdsAlarms.DatabaseCluster(stack, 'AuroraMySQLCluster1', {
    engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_07_0 }),
    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    clusterIdentifier: 'test1',
    writer: writerInstance,
    readers: [readerInstance1], // 1 reader instance
    defaultDatabaseName: 'test',
    credentials: rds.Credentials.fromGeneratedSecret('admin', { secretName: 'sample-database-config' }),
    securityGroups: [rdsSecurityGroup],
  });

  const databaseCluster2 = new rdsAlarms.DatabaseCluster(stack, 'AuroraMySQLCluster2', {
    engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_07_0 }),
    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    clusterIdentifier: 'test2',
    writer: writerInstance,
    readers: [readerInstance1, readerInstance2], // 2 reader instances
    defaultDatabaseName: 'test',
    credentials: rds.Credentials.fromGeneratedSecret('admin', { secretName: 'sample-database-config' }),
    securityGroups: [rdsSecurityGroup],
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numOfInstances = databaseCluster2.instanceIdentifiers.length;
  const numClusterMetrics = Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('AURORA_')).length;
  const numInstanceMetrics = Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numClusterMetrics + numInstanceMetrics * numOfInstances);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['AuroraMySQLCluster1', 'AuroraMySQLCluster2'].forEach(clusterName => {
    Object.values(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('AURORA_')).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(clusterName) && resourceProperties.MetricName === metricName;
      });

      if (clusterName === 'AuroraMySQLCluster1') {
        expect(alarms.length).toBe(0);
      } else {
        expect(alarms.length).toBe(1);
      }
    });
  });
});

test('when an instance is excluded from the aspect config it should not have alarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new rdsAlarms.RdsInstanceRecommendedAlarmsAspect({
      excludeResources: ['MySQLInstance1'],
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
    }),
  );

  const vpc = new ec2.Vpc(stack, 'test-vpc', {
    maxAzs: 3,
    vpcName: 'test-vpc',
    subnetConfiguration: [
      {
        name: 'public',
        subnetType: ec2.SubnetType.PUBLIC,
      },
      {
        name: 'private',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    ],
  });

  const rdsSecurityGroup = new ec2.SecurityGroup(
    stack,
    'rds-security-group',
    {
      vpc: vpc,
      securityGroupName: 'rds-security-group',
      description: 'Security group for RDS',
    },
  );

  new rdsAlarms.DatabaseInstance(stack, 'MySQLInstance1', {
    engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_25 }),
    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
    instanceIdentifier: 'test1',
    databaseName: 'test',
    credentials: rds.Credentials.fromGeneratedSecret('admin', { secretName: 'sample-database-config' }),
    securityGroups: [rdsSecurityGroup],
  });

  new rdsAlarms.DatabaseInstance(stack, 'MySQLInstance2', {
    engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_25 }),
    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
    instanceIdentifier: 'test2',
    databaseName: 'test',
    credentials: rds.Credentials.fromGeneratedSecret('admin', { secretName: 'sample-database-config' }),
    securityGroups: [rdsSecurityGroup],
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  const numInstanceMetrics = Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).length;

  const resources = template.findResources('AWS::CloudWatch::Alarm');
  expect(Object.keys(resources).length).toEqual(numInstanceMetrics);

  ['MySQLInstance1', 'MySQLInstance2'].forEach(instanceName => {
    Object.keys(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).forEach(metricKey => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;
        const metricName = rdsAlarms.RdsRecommendedAlarmsMetrics[metricKey as keyof typeof rdsAlarms.RdsRecommendedAlarmsMetrics];

        return resourceName.startsWith(instanceName) && resourceProperties.MetricName === metricName;
      });
      if (instanceName === 'MySQLInstance1') {
        expect(alarms.length).toEqual(0);
      } else {
        expect(alarms.length).toEqual(1);
      }
    });
  });
});

test('when required attributes are not present it should throw an error', () => {
  const app = new App();

  const instanceStack = new MySQLDatabaseInstanceStack(app, 'TestInstanceStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const clusterStack = new AuroraMySQLClusterStack(app, 'TestClusterStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  expect(() => {
    new rdsAlarms.RdsInstanceRecommendedAlarms(instanceStack, 'rdsDatabaseInstanceAlarms', {
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
    });
  }).toThrowError('Either instanceIdentifier or databaseInstance must be specified.');

  expect(() => {
    new rdsAlarms.RdsAuroraRecommendedAlarms(clusterStack, 'rdsDatabaseInstanceAlarms', {
      databaseCluster: clusterStack.databaseCluster,
      configDatabaseConnectionsAlarm: {
        threshold: 10,
      },
      configFreeableMemoryAlarm: {
        threshold: 5,
      },
      configFreeLocalStorageAlarm: {
        threshold: 20,
      },
      configFreeStorageSpaceAlarm: {
        threshold: 20,
      },
      configDbLoadAlarm: {
        threshold: 4,
      },
      configReadLatencyAlarm: {
        threshold: 20,
      },
      configWriteLatencyAlarm: {
        threshold: 20,
      },
    });
  }).toThrowError(`The threshold must be specified for ${rdsAlarms.RdsRecommendedAlarmsMetrics.AURORA_VOLUME_BYTES_LEFT_TOTAL} alarm.`);
});

test('default alarm actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new MySQLDatabaseInstanceStack(app, 'TestStack', {
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

  new rdsAlarms.RdsInstanceRecommendedAlarms(stack, 'rdsClusterAlarms', {
    databaseInstance: stack.databaseInstance,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    configCpuUtilizationAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configDatabaseConnectionsAlarm: {
      threshold: 10,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configFreeableMemoryAlarm: {
      threshold: 5,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configFreeLocalStorageAlarm: {
      threshold: 20,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configFreeStorageSpaceAlarm: {
      threshold: 20,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configDbLoadAlarm: {
      threshold: 4,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configReadLatencyAlarm: {
      threshold: 20,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    configWriteLatencyAlarm: {
      threshold: 20,
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(rdsAlarms.RdsRecommendedAlarmsMetrics).filter(metric => metric.startsWith('INSTANCE_')).forEach(metricName => {
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
    new rdsAlarms.RdsAuroraRecommendedAlarmsAspect({
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
      configDatabaseConnectionsAlarm: {
        alarmName: 'CustomDatabaseConnectionsAlarm',
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
        threshold: 5,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configFreeLocalStorageAlarm: {
        alarmName: 'CustomFreeLocalStorageAlarm',
        threshold: 20,
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
        threshold: 20,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configDbLoadAlarm: {
        alarmName: 'CustomDbLoadAlarm',
        threshold: 4,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configReadLatencyAlarm: {
        alarmName: 'CustomReadLatencyAlarm',
        threshold: 20,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configWriteLatencyAlarm: {
        alarmName: 'CustomWriteLatencyAlarm',
        threshold: 20,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configAuroraVolumeBytesLeftTotalAlarm: {
        alarmName: 'CustomAuroraVolumeBytesLeftTotalAlarm',
        threshold: 20,
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        treatMissingData: cloudwatch.TreatMissingData.IGNORE,
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      configAuroraBinLogReplicationLagAlarm: {
        alarmName: 'CustomAuroraBinLogReplicationLagAlarm',
        threshold: 20,
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

  const vpc = new ec2.Vpc(stack, 'test-vpc', {
    maxAzs: 3,
    vpcName: 'test-vpc',
    subnetConfiguration: [
      {
        name: 'public',
        subnetType: ec2.SubnetType.PUBLIC,
      },
      {
        name: 'private',
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    ],
  });

  const rdsSecurityGroup = new ec2.SecurityGroup(
    stack,
    'rds-security-group',
    {
      vpc: vpc,
      securityGroupName: 'rds-security-group',
      description: 'Security group for RDS',
    },
  );

  const writerInstance = rds.ClusterInstance.provisioned('writer-instance', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
    instanceIdentifier: 'writer-instance',
  });

  const readerInstance = rds.ClusterInstance.provisioned('reader-instance1', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
    instanceIdentifier: 'reader-instance',
  });

  new rdsAlarms.DatabaseCluster(stack, 'AuroraMySQLCluster', {
    engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_07_0 }),
    vpc: vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    clusterIdentifier: 'test1',
    writer: writerInstance,
    readers: [readerInstance],
    defaultDatabaseName: 'test',
    credentials: rds.Credentials.fromGeneratedSecret('admin', { secretName: 'sample-database-config' }),
    securityGroups: [rdsSecurityGroup],
  });

  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  Object.values(rdsAlarms.RdsRecommendedAlarmsMetrics).forEach(metricName => {
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
