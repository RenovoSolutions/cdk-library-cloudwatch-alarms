import {
  aws_s3 as s3,
  aws_cloudwatch_actions as cloudwatch_actions,
  aws_sns as sns,
  aws_lambda as lambda,
  App,
  Stack,
  Aspects,
  Duration,
} from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as s3alarms from '../src/s3';

test('Snapshot', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new s3alarms.S3RecommendedAlarmsAspect,
  );

  new s3.Bucket(stack, 'Bucket', {});

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('SnapshotWithExclusion', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new s3alarms.S3RecommendedAlarmsAspect({
      excludeAlarms: [s3alarms.S3RecommendedAlarmsMetrics.ERRORS_4XX],
    }),
  );

  new s3.Bucket(stack, 'Bucket', {});

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('SnapshotForBucketConstruct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const bucket = new s3alarms.Bucket(stack, 'Bucket', {});

  bucket.applyRecommendedAlarms();

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('SnapshotDefaultActionsInUse', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const bucket2 = new s3.Bucket(stack, 'Bucket', {
    bucketName: 'bucket',
  });

  const topic = new sns.Topic(stack, 'Topic');

  new s3alarms.S3RecommendedAlarms(stack, 'BucketAlarms', {
    bucket: bucket2,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
  });

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('SnapshotWithResourceExclusion', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new s3alarms.S3RecommendedAlarmsAspect,
  );

  new s3.Bucket(stack, 'Bucket', {});

  const bucket2 = new s3.Bucket(stack, 'Bucket2', {});

  bucket2.node.addMetadata('S3RecommendedAlarmsAspect:Exclude', 'true');

  const template = Template.fromStack(stack);

  expect(template).toMatchSnapshot();
});

test('stack should contain recommended alarms for each bucket if recommended alarms aspect is applied with no exclusions', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new s3alarms.S3RecommendedAlarmsAspect,
  );

  new s3.Bucket(stack, 'Bucket1', {
    bucketName: 'bucket1',
  });

  new s3.Bucket(stack, 'Bucket2', {
    bucketName: 'bucket2',
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(s3alarms.S3RecommendedAlarmsMetrics).length * 2;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Bucket1', 'Bucket2'].forEach(bucketName => {
    Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(bucketName) && resourceProperties.MetricName === metricName;
      });

      expect(alarms.length).toBe(1);
    });
  });
});

test('stack should not include an alarm if its excluded when aspect is applied', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new s3alarms.S3RecommendedAlarmsAspect({
      excludeAlarms: [s3alarms.S3RecommendedAlarmsMetrics.ERRORS_4XX],
    }),
  );

  new s3.Bucket(stack, 'Bucket1', {
    bucketName: 'bucket1',
  });

  new s3.Bucket(stack, 'Bucket2', {
    bucketName: 'bucket2',
  });

  const template = Template.fromStack(stack);

  const numAlarms = (Object.keys(s3alarms.S3RecommendedAlarmsMetrics).length - 1) * 2;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Bucket1', 'Bucket2'].forEach(bucketName => {
    Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
      const alarms5xx = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(bucketName) && resourceProperties.MetricName === metricName;
      });

      if (metricName === s3alarms.S3RecommendedAlarmsMetrics.ERRORS_4XX) {
        expect(alarms5xx.length).toBe(0);
      } else {
        expect(alarms5xx.length).toBe(1);
      }
    });
  });
});

test('stack should contain recommended alarms for the bucket where recommended alarms were enabled with no exclusions using Bucket construct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new s3.Bucket(stack, 'Bucket1', {
    bucketName: 'bucket1',
  });

  const bucket2 = new s3alarms.Bucket(stack, 'Bucket2', {
    bucketName: 'bucket2',
  });

  bucket2.applyRecommendedAlarms();

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(s3alarms.S3RecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Bucket1') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(0);
  });

  Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Bucket2') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('stack should contain recommended alarms for the bucket where recommended alarms were enabled with no exclusions using recommended alarms construct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  new s3.Bucket(stack, 'Bucket1', {
    bucketName: 'bucket1',
  });

  const bucket2 = new s3.Bucket(stack, 'Bucket2', {
    bucketName: 'bucket2',
  });

  new s3alarms.S3RecommendedAlarms(stack, 'Bucket2Alarms', {
    bucket: bucket2,
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(s3alarms.S3RecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Bucket1') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(0);
  });

  Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Bucket2') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('default alarm actions are used when provided in configuration', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const bucket2 = new s3.Bucket(stack, 'Bucket', {
    bucketName: 'bucket',
  });

  const topic = new sns.Topic(stack, 'Topic');

  new s3alarms.S3RecommendedAlarms(stack, 'BucketAlarms', {
    bucket: bucket2,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
  });

  const template = Template.fromStack(stack);

  Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
    }));
  });
});

test('No alarm actions are used when none provided in configuration', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const bucket2 = new s3.Bucket(stack, 'Bucket', {
    bucketName: 'bucket',
  });

  const topic = new sns.Topic(stack, 'Topic');

  new s3alarms.S3RecommendedAlarms(stack, 'BucketAlarms', {
    bucket: bucket2,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
  });

  const template = Template.fromStack(stack);

  template.findResources('AWS::CloudWatch::Alarm', {
    AlarmActions: Match.absent(),
    OkActions: Match.absent(),
    InsufficientDataActions: Match.absent(),
  });
});

test('default alarm actions are overridden when individual alarm actions are provided in configuration', () => {
  const app = new App({
    context: {
      '@aws-cdk/aws-cloudwatch-actions:changeLambdaPermissionLogicalIdForLambdaAction': true,
    },
  });
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const bucket2 = new s3.Bucket(stack, 'Bucket', {
    bucketName: 'bucket',
  });

  const topic = new sns.Topic(stack, 'Topic');

  const alarmLambda = new lambda.Function(stack, 'Lambda', {
    runtime: lambda.Runtime.NODEJS_20_X,
    handler: 'index.handler',
    code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
  });

  new s3alarms.S3RecommendedAlarms(stack, 'BucketAlarms', {
    bucket: bucket2,
    defaultAlarmAction: new cloudwatch_actions.SnsAction(topic),
    defaultOkAction: new cloudwatch_actions.SnsAction(topic),
    defaultInsufficientDataAction: new cloudwatch_actions.SnsAction(topic),
    config4xxErrorsAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
    config5xxErrorsAlarm: {
      alarmAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      okAction: new cloudwatch_actions.LambdaAction(alarmLambda),
      insufficientDataAction: new cloudwatch_actions.LambdaAction(alarmLambda),
    },
  });

  const template = Template.fromStack(stack);

  Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      OKActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
      InsufficientDataActions: [Match.objectLike({ 'Fn::GetAtt': [Match.stringLikeRegexp('^Lambda.*'), 'Arn'] })],
    }));
  });
});

test('alarms can be applied individually to buckets using extended construct', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const bucket2 = new s3alarms.Bucket(stack, 'Bucket', {
    bucketName: 'bucket',
  });

  bucket2.alarm4xxErrors();
  bucket2.alarm5xxErrors();

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(s3alarms.S3RecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
    const alarms = Object.keys(resources).filter(resourceName => {
      const resource = resources[resourceName];
      const resourceProperties = resource.Properties;

      return resourceName.startsWith('Bucket') && resourceProperties.MetricName === metricName;
    });

    expect(alarms.length).toBe(1);
  });
});

test('setting configuration for an alarm where it is not required configures the alarm with the given config', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new s3alarms.S3RecommendedAlarmsAspect({
      config4xxErrorsAlarm: {
        threshold: 0.10,
      },
      config5xxErrorsAlarm: {
        threshold: 0.10,
      },
    }),
  );

  new s3.Bucket(stack, 'Bucket');

  const template = Template.fromStack(stack);

  Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      Threshold: 0.10,
    }));
  });
});

test('optional alarm configurations can be overwritten', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  const topic = new sns.Topic(stack, 'Topic');

  const topicAction = new cloudwatch_actions.SnsAction(topic);

  appAspects.add(
    new s3alarms.S3RecommendedAlarmsAspect({
      config4xxErrorsAlarm: {
        alarmName: 'Custom4xxErrorsAlarm',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
      config5xxErrorsAlarm: {
        alarmName: 'Custom5xxErrorsAlarm',
        period: Duration.minutes(5),
        evaluationPeriods: 25,
        datapointsToAlarm: 25,
        alarmDescription: 'Custom alarm description',
        alarmAction: topicAction,
        okAction: topicAction,
        insufficientDataAction: topicAction,
      },
    }),
  );

  new s3.Bucket(stack, 'Bucket');

  const template = Template.fromStack(stack);

  Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
    template.hasResourceProperties('AWS::CloudWatch::Alarm', Match.objectLike({
      MetricName: metricName,
      AlarmName: Match.stringLikeRegexp('^Custom.*'),
      Period: 300,
      EvaluationPeriods: 25,
      DatapointsToAlarm: 25,
      AlarmDescription: 'Custom alarm description',
      AlarmActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      OKActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
      InsufficientDataActions: [Match.objectLike({ Ref: Match.stringLikeRegexp('^Topic.*') })],
    }));
  });
});

Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
  test(`alarm for ${metricName} should not exceed one day period`, () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack', {
      env: {
        account: '123456789012', // not a real account
        region: 'us-east-1',
      },
    });

    const bucket = new s3.Bucket(stack, 'Bucket');

    const excludeAllButOneMetric = Object.values(s3alarms.S3RecommendedAlarmsMetrics).filter(m => m !== metricName);

    expect(() => {
      new s3alarms.S3RecommendedAlarms(stack, 'BucketAlarms', {
        bucket,
        excludeAlarms: excludeAllButOneMetric,
        config4xxErrorsAlarm: {
          period: Duration.days(1),
          evaluationPeriods: 25,
        },
        config5xxErrorsAlarm: {
          period: Duration.days(1),
          evaluationPeriods: 25,
        },
      });
    }).toThrowError('The period (86400) over which'),

    Template.fromStack(stack);
  });
});

test('when a resource is excluded from the aspect config it should not have alarms', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack', {
    env: {
      account: '123456789012', // not a real account
      region: 'us-east-1',
    },
  });

  const appAspects = Aspects.of(app);

  appAspects.add(
    new s3alarms.S3RecommendedAlarmsAspect({
      excludeResources: ['Bucket1'],
    }),
  );

  new s3.Bucket(stack, 'Bucket1', {
    bucketName: 'bucket1',
  });

  new s3.Bucket(stack, 'Bucket2', {
    bucketName: 'bucket2',
  });

  const template = Template.fromStack(stack);

  const numAlarms = Object.keys(s3alarms.S3RecommendedAlarmsMetrics).length;

  template.resourceCountIs('AWS::CloudWatch::Alarm', numAlarms);

  const resources = template.findResources('AWS::CloudWatch::Alarm');

  ['Bucket1', 'Bucket2'].forEach(bucketName => {
    Object.values(s3alarms.S3RecommendedAlarmsMetrics).forEach(metricName => {
      const alarms = Object.keys(resources).filter(resourceName => {
        const resource = resources[resourceName];
        const resourceProperties = resource.Properties;

        return resourceName.startsWith(bucketName) && resourceProperties.MetricName === metricName;
      });

      if (bucketName === 'Bucket1') {
        expect(alarms.length).toBe(0);
      } else {
        expect(alarms.length).toBe(1);
      }
    });
  });
});
