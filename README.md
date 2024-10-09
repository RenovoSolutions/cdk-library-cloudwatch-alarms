# cdk-library-cloudwatch-alarms

WIP - Library to provide constructs, aspects, and construct extensions to more easily set up alarms for AWS resources in CDK code based on AWS recommended alarms list. This project is still in early development so YMMV.

## Usage

This library is flexible in its approach and there are multiple paths to configuring alarms depending on how you'd like to work with the recommended alarms.

## Feature Availability

Intended feature list as of Aug 2024

- [x] Aspects to apply recommended alarms to a wide scope such as a whole CDK app
  - [x] Ability to exclude specific alarms
  - [x] Ability to define a default set of alarm actions
  - [x] Ability to modify the configuration of each alarm type
  - [ ] Ability to exclude specific resources
- [x] Constructs to ease alarm configuration for individual resources at a granular scope
  - [x] Constructs for each available alarm according to the coverage table
  - [x] Constructs for applying all recommended alarms to a specific resource
  - [x] Ability to exclude specific alarms from the all recommended alarms construct
- [x] Extended versions of resource constructs with alarm helper methods

## Resource Coverage

If its not shown it hasn't been worked on.

| Service   | Status | Notes |
| --- | --- | --- |
| S3  | <ul><li>[x] 4xxErrors</li><li>[x] 5xxErrors</li><li>[ ] OperationsFailedReplication</li></ul> | Replication errors are difficult to set up in CDK at the moment due to rule properties being IResolvables and replication rules not being available on the L2 Bucket construct |
| SQS | <ul><li>[x] ApproximateAgeOfOldestMessage</li><li>[x] ApproximateNumberOfMessagesNotVisible</li><li>[x] ApproximateNumberOfMessagesVisible</li><li>[x] NumberOfMessagesSent | All alarms with the exception of number of messages sent require a user defined threshold because its very usecase specific |
| SNS | <ul><li>[x] NumberOfMessagesPublished</li><li>[x] NumberOfNotificationsDelivered</li><li>[x] NumberOfNotificationsFailed</li><li>[x] NumberOfNotificationsFilteredOut-InvalidAttributes</li><li>[x] NumberOfNotificationsFilteredOut-InvalidMessageBody</li><li>[x] NumberOfNotificationsRedrivenToDlq</li><li>[x] NumberOfNotificationsFailedToRedriveToDlq</li><li>[ ] SMSMonthToDateSpentUSD</li><li>[ ] SMSSuccessRate</li></ul> | Some alarms require a threshold to be defined. SMS alarms are not implememented.
| Lambda | <ul><li>[ ] ClaimedAccountConcurrency</li><li>[x] Errors</li><li>[x] Throttles</li><li>[x] Duration</li><li>[x] ConcurrentExecutions</li></ul> | ClaimedAccountConcurrency is account wide and one time so not covered by this library at this time |
| RDS | <b>For database & cluster instances</b><br/><ul><li>[x] CPUUtilization</li><li>[x] DatabaseConnections</li><li>[x] FreeableMemory</li><li>[x] FreeLocalStorage</li><li>[x] FreeStorageSpace</li><li>[x] ReadLatency</li><li>[x] WriteLatency</li><li>[x] DBLoad</li></ul><b>For clusters</b><br/><ul><li>[x] AuroraVolumeBytesLeftTotal</li><li>[x] AuroraBinlogReplicaLag</li></ul> | Some alarms require a `threshold` to be defined. `AuroraVolumeBytesLeftTotal` and `AuroraBinlogReplicaLag` alarms are created only for Aurora MySQL clusters. |
| ECS | <ul><li>[x] CPUUtilization</li><li>[x] MemoryUtilization</li><li>[x] EphemeralStorageUtilized</li><li>[x] RunningTaskCount</li></ul> | The alarms are applied to `FargateService` constructs only. `EphemeralStorageUtilized` requires a `threshold` to be defined. |
| EFS | <ul><li>[x] PercentIOLimit</li><li>[x] BurstCreditBalance</li></ul> | The alarms are applied to `FileSystem` constructs. |
| EC2 | <ul><li>[x] CPUUtilization</li><li>[x] StatusCheckFailed</li></ul> | The alarms are applied to `Instance` constructs. |
| AutoScaling | <ul><li>[x] GroupInServiceCapacity</li></ul> | The alarms are applied to `AutoScalingGroup` constructs. The alarm requires a `threshold` to be defined. |

### Aspects

Below is an example of configuring the Lambda aspect. You must configure non-defaults for alarms which is most cases is only a `threshold`. Since the aspect is applied at the `app` level it applies to both the `TestStack` and `TestStack2` lambda functions and will create all available recommended alarms for those functions. See references for additional details on Aspects which can be applied to the app, stack, or individual constructs depending on your use case.

```typescript
import { App, Stack, Aspects, aws_lambda as lambda } from 'aws-cdk-lib';
import * as recommendedalarms from '@renovosolutions/cdk-library-cloudwatch-alarms';

const app = new App();
const stack = new Stack(app, 'TestStack', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

const stack2 = new Stack(app, 'TestStack2', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

const appAspects = Aspects.of(app);

appAspects.add(
  new recommendedalarms.LambdaRecommendedAlarmsAspect({
    configDurationAlarm: {
      threshold: 15,
    },
    configErrorsAlarm: {
      threshold: 1,
    },
    configThrottlesAlarm: {
      threshold: 0,
    },
  }),
);

new lambda.Function(stack, 'Lambda', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
});

new lambda.Function(stack2, 'Lambda2', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
});
```

### Recommended Alarm Constructs

You can also apply alarms to a specific resource using the recommended alarm construct for a given resource type. For example if you have an S3 Bucket you might do something like below. None of the S3 alarms require configuration so no config props are needed in this case:

```typescript
import { App, Stack, Aspects, aws_s3 as s3 } from 'aws-cdk-lib';
import * as recommendedalarms from '@renovosolutions/cdk-library-cloudwatch-alarms';

const app = new App();
const stack = new Stack(app, 'TestStack', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

const bucket = new s3.Bucket(stack, 'Bucket', {});

new recommendedalarms.S3RecommendedAlarms(stack, 'RecommendedAlarms', {
  bucket,
});
```

### Individual Constructs

You can also apply specific alarms from their individual constructs:

```typescript
import { App, Stack, Aspects, aws_s3 as s3 } from 'aws-cdk-lib';
import * as recommendedalarms from '@renovosolutions/cdk-library-cloudwatch-alarms';

const app = new App();
const stack = new Stack(app, 'TestStack', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

const bucket = new s3.Bucket(stack, 'Bucket', {});

new recommendedalarms.S3Bucket5xxErrorsAlarm(stack, 'RecommendedAlarms', {
  bucket,
  threshold: 0.10,
});
```

### Construct Extensions

You can use extended versions of the constructs you are familiar with to expose helper methods for alarms if you'd like to keep alarms more tightly coupled to specific resources.

```typescript
import { App, Stack, Aspects, aws_s3 as s3 } from 'aws-cdk-lib';
import * as recommendedalarms from '@renovosolutions/cdk-library-cloudwatch-alarms';

const app = new App();
const stack = new Stack(app, 'TestStack', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

  const bucket = new recommendedalarms.Bucket(stack, 'Bucket', {});

  bucket.applyRecommendedAlarms();
```

### Alarm Actions

You can apply alarm actions using the default actions on an aspect or all recommended alarms construct or you can apply individual alarm actions for helper methods of individual constructs. See below where default actions are set but an override is set for a specific alarm for the alarm action to use a different SNS topic.

```typescript
import { App, Stack, Aspects, aws_lambda as lambda } from 'aws-cdk-lib';
import * as recommendedalarms from '@renovosolutions/cdk-library-cloudwatch-alarms';

const app = new App();
const stack = new Stack(app, 'TestStack', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

const stack2 = new Stack(app, 'TestStack2', {
  env: {
    account: '123456789012',
    region: 'us-east-1',
  },
});

const alarmTopic = new sns.Topic(stack, 'Topic');
const topicAction =  new cloudwatch_actions.SnsAction(alarmTopic)

const alarmTopic2 = new sns.Topic(stack, 'Topic');
const topicAction2 =  new cloudwatch_actions.SnsAction(alarmTopic2)

const appAspects = Aspects.of(app);

appAspects.add(
  new recommendedalarms.LambdaRecommendedAlarmsAspect({
    defaultAlarmAction: topicAction,
    defaultOkAction: topicAction,
    defaultInsufficientDataAction: topicAction,
    configDurationAlarm: {
      threshold: 15,
      alarmAction: topicAction2,
    },
    configErrorsAlarm: {
      threshold: 1,
    },
    configThrottlesAlarm: {
      threshold: 0,
    },

  }),
);

new lambda.Function(stack, 'Lambda', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
});

new lambda.Function(stack2, 'Lambda2', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
});
```

### Exclusions

You can exclude specific alarms or specific resources. Alarms use the available metrics enums and resources use the string used for a resources id. For example below Lambda1 will not have alarms created and there will be no alarm for the Duration metric for either lambda function.

```typescript
import { App, Stack, Aspects, aws_lambda as lambda } from 'aws-cdk-lib';
import * as recommendedalarms from '@renovosolutions/cdk-library-cloudwatch-alarms';

const app = new App();
const stack = new Stack(app, 'TestStack', {
  env: {
    account: '123456789012', // not a real account
    region: 'us-east-1',
  },
});

const appAspects = Aspects.of(app);

appAspects.add(
  new recommendedalarms.LambdaRecommendedAlarmsAspect({
    excludeResources: ['Lambda1'],
    excludeAlarms: [recommendedalarms.LambdaRecommendedAlarmsMetrics.DURATION],
    configDurationAlarm: {
      threshold: 15,
    },
    configErrorsAlarm: {
      threshold: 1,
    },
    configThrottlesAlarm: {
      threshold: 0,
    },
  }),
);

new lambda.Function(stack, 'Lambda1', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
});

new lambda.Function(stack, 'Lambda2', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline('exports.handler = async (event) => { console.log(event); }'),
});
```

## References

- [AWS Recommended Alarms](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html)
- [Aspects and the AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/aspects.html)
