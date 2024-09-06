# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Bucket <a name="Bucket" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket"></a>

An extension for the S3 Bucket construct that provides methods to create recommended alarms.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.Initializer"></a>

```typescript
import { Bucket } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new Bucket(scope: Construct, id: string, props?: BucketProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.Initializer.parameter.props">props</a></code> | <code>aws-cdk-lib.aws_s3.BucketProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.Initializer.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_s3.BucketProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addEventNotification">addEventNotification</a></code> | Adds a bucket notification event destination. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addObjectCreatedNotification">addObjectCreatedNotification</a></code> | Subscribes a destination to receive notifications when an object is created in the bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addObjectRemovedNotification">addObjectRemovedNotification</a></code> | Subscribes a destination to receive notifications when an object is removed from the bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addToResourcePolicy">addToResourcePolicy</a></code> | Adds a statement to the resource policy for a principal (i.e. account/role/service) to perform actions on this bucket and/or its contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for this bucket or objects. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.arnForObjects">arnForObjects</a></code> | Returns an ARN that represents all objects within the bucket that match the key pattern specified. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.enableEventBridgeNotification">enableEventBridgeNotification</a></code> | Enables event bridge notification, causing all events below to be sent to EventBridge:. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantDelete">grantDelete</a></code> | Grants s3:DeleteObject* permission to an IAM principal for objects in this bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPublicAccess">grantPublicAccess</a></code> | Allows unrestricted access to objects from this bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPut">grantPut</a></code> | Grants s3:PutObject* and s3:Abort* permissions for this bucket to an IAM principal. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPutAcl">grantPutAcl</a></code> | Grant the given IAM identity permissions to modify the ACLs of objects in the given Bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantRead">grantRead</a></code> | Grant read permissions for this bucket and it's contents to an IAM principal (Role/Group/User). |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantReadWrite">grantReadWrite</a></code> | Grants read/write permissions for this bucket and it's contents to an IAM principal (Role/Group/User). |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantWrite">grantWrite</a></code> | Grant write permissions to this bucket to an IAM principal. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailEvent">onCloudTrailEvent</a></code> | Define a CloudWatch event that triggers when something happens to this repository. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailPutObject">onCloudTrailPutObject</a></code> | Defines an AWS CloudWatch event that triggers when an object is uploaded to the specified paths (keys) in this bucket using the PutObject API call. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailWriteObject">onCloudTrailWriteObject</a></code> | Defines an AWS CloudWatch event that triggers when an object at the specified paths (keys) in this bucket are written to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.s3UrlForObject">s3UrlForObject</a></code> | The S3 URL of an S3 object. For example:. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.transferAccelerationUrlForObject">transferAccelerationUrlForObject</a></code> | The https Transfer Acceleration URL of an S3 object. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.urlForObject">urlForObject</a></code> | The https URL of an S3 object. Specify `regional: false` at the options for non-regional URLs. For example:. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.virtualHostedUrlForObject">virtualHostedUrlForObject</a></code> | The virtual hosted-style URL of an S3 object. Specify `regional: false` at the options for non-regional URL. For example:. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addCorsRule">addCorsRule</a></code> | Adds a cross-origin access configuration for objects in an Amazon S3 bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addInventory">addInventory</a></code> | Add an inventory configuration. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addLifecycleRule">addLifecycleRule</a></code> | Add a lifecycle rule to the bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addMetric">addMetric</a></code> | Adds a metrics configuration for the CloudWatch request metrics from the bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.alarm4xxErrors">alarm4xxErrors</a></code> | Creates an alarm that monitors the 4xx errors for the S3 bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.alarm5xxErrors">alarm5xxErrors</a></code> | Creates an alarm that monitors the 5xx errors for the S3 bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.applyRecommendedAlarms">applyRecommendedAlarms</a></code> | Creates the recommended alarms for the S3 bucket. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addEventNotification` <a name="addEventNotification" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addEventNotification"></a>

```typescript
public addEventNotification(event: EventType, dest: IBucketNotificationDestination, filters: NotificationKeyFilter): void
```

Adds a bucket notification event destination.

> [https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html)

*Example*

```typescript
   declare const myLambda: lambda.Function;
   const bucket = new s3.Bucket(this, 'MyBucket');
   bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(myLambda), {prefix: 'home/myusername/*'});
```


###### `event`<sup>Required</sup> <a name="event" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addEventNotification.parameter.event"></a>

- *Type:* aws-cdk-lib.aws_s3.EventType

The event to trigger the notification.

---

###### `dest`<sup>Required</sup> <a name="dest" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addEventNotification.parameter.dest"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucketNotificationDestination

The notification destination (Lambda, SNS Topic or SQS Queue).

---

###### `filters`<sup>Required</sup> <a name="filters" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addEventNotification.parameter.filters"></a>

- *Type:* aws-cdk-lib.aws_s3.NotificationKeyFilter

S3 object key filter rules to determine which objects trigger this event.

Each filter must include a `prefix` and/or `suffix`
that will be matched against the s3 object key. Refer to the S3 Developer Guide
for details about allowed filter rules.

---

##### `addObjectCreatedNotification` <a name="addObjectCreatedNotification" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addObjectCreatedNotification"></a>

```typescript
public addObjectCreatedNotification(dest: IBucketNotificationDestination, filters: NotificationKeyFilter): void
```

Subscribes a destination to receive notifications when an object is created in the bucket.

This is identical to calling
`onEvent(EventType.OBJECT_CREATED)`.

###### `dest`<sup>Required</sup> <a name="dest" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addObjectCreatedNotification.parameter.dest"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucketNotificationDestination

The notification destination (see onEvent).

---

###### `filters`<sup>Required</sup> <a name="filters" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addObjectCreatedNotification.parameter.filters"></a>

- *Type:* aws-cdk-lib.aws_s3.NotificationKeyFilter

Filters (see onEvent).

---

##### `addObjectRemovedNotification` <a name="addObjectRemovedNotification" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addObjectRemovedNotification"></a>

```typescript
public addObjectRemovedNotification(dest: IBucketNotificationDestination, filters: NotificationKeyFilter): void
```

Subscribes a destination to receive notifications when an object is removed from the bucket.

This is identical to calling
`onEvent(EventType.OBJECT_REMOVED)`.

###### `dest`<sup>Required</sup> <a name="dest" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addObjectRemovedNotification.parameter.dest"></a>

- *Type:* aws-cdk-lib.aws_s3.IBucketNotificationDestination

The notification destination (see onEvent).

---

###### `filters`<sup>Required</sup> <a name="filters" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addObjectRemovedNotification.parameter.filters"></a>

- *Type:* aws-cdk-lib.aws_s3.NotificationKeyFilter

Filters (see onEvent).

---

##### `addToResourcePolicy` <a name="addToResourcePolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addToResourcePolicy"></a>

```typescript
public addToResourcePolicy(permission: PolicyStatement): AddToResourcePolicyResult
```

Adds a statement to the resource policy for a principal (i.e. account/role/service) to perform actions on this bucket and/or its contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for this bucket or objects.

Note that the policy statement may or may not be added to the policy.
For example, when an `IBucket` is created from an existing bucket,
it's not possible to tell whether the bucket already has a policy
attached, let alone to re-use that policy to add more statements to it.
So it's safest to do nothing in these cases.

###### `permission`<sup>Required</sup> <a name="permission" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addToResourcePolicy.parameter.permission"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

the policy statement to be added to the bucket's policy.

---

##### `arnForObjects` <a name="arnForObjects" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.arnForObjects"></a>

```typescript
public arnForObjects(keyPattern: string): string
```

Returns an ARN that represents all objects within the bucket that match the key pattern specified.

To represent all keys, specify ``"*"``.

If you need to specify a keyPattern with multiple components, concatenate them into a single string, e.g.:

  arnForObjects(`home/${team}/${user}/*`)

###### `keyPattern`<sup>Required</sup> <a name="keyPattern" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.arnForObjects.parameter.keyPattern"></a>

- *Type:* string

---

##### `enableEventBridgeNotification` <a name="enableEventBridgeNotification" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.enableEventBridgeNotification"></a>

```typescript
public enableEventBridgeNotification(): void
```

Enables event bridge notification, causing all events below to be sent to EventBridge:.

Object Deleted (DeleteObject)
- Object Deleted (Lifecycle expiration)
- Object Restore Initiated
- Object Restore Completed
- Object Restore Expired
- Object Storage Class Changed
- Object Access Tier Changed
- Object ACL Updated
- Object Tags Added
- Object Tags Deleted

##### `grantDelete` <a name="grantDelete" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantDelete"></a>

```typescript
public grantDelete(identity: IGrantable, objectsKeyPattern?: any): Grant
```

Grants s3:DeleteObject* permission to an IAM principal for objects in this bucket.

###### `identity`<sup>Required</sup> <a name="identity" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantDelete.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

The principal.

---

###### `objectsKeyPattern`<sup>Optional</sup> <a name="objectsKeyPattern" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantDelete.parameter.objectsKeyPattern"></a>

- *Type:* any

Restrict the permission to a certain key pattern (default '*').

Parameter type is `any` but `string` should be passed in.

---

##### `grantPublicAccess` <a name="grantPublicAccess" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPublicAccess"></a>

```typescript
public grantPublicAccess(allowedActions: string, keyPrefix?: string): Grant
```

Allows unrestricted access to objects from this bucket.

IMPORTANT: This permission allows anyone to perform actions on S3 objects
in this bucket, which is useful for when you configure your bucket as a
website and want everyone to be able to read objects in the bucket without
needing to authenticate.

Without arguments, this method will grant read ("s3:GetObject") access to
all objects ("*") in the bucket.

The method returns the `iam.Grant` object, which can then be modified
as needed. For example, you can add a condition that will restrict access only
to an IPv4 range like this:

    const grant = bucket.grantPublicAccess();
    grant.resourceStatement!.addCondition(‘IpAddress’, { “aws:SourceIp”: “54.240.143.0/24” });

Note that if this `IBucket` refers to an existing bucket, possibly not
managed by CloudFormation, this method will have no effect, since it's
impossible to modify the policy of an existing bucket.

###### `allowedActions`<sup>Required</sup> <a name="allowedActions" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPublicAccess.parameter.allowedActions"></a>

- *Type:* string

the set of S3 actions to allow.

Default is "s3:GetObject".

---

###### `keyPrefix`<sup>Optional</sup> <a name="keyPrefix" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPublicAccess.parameter.keyPrefix"></a>

- *Type:* string

the prefix of S3 object keys (e.g. `home/*`). Default is "*".

---

##### `grantPut` <a name="grantPut" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPut"></a>

```typescript
public grantPut(identity: IGrantable, objectsKeyPattern?: any): Grant
```

Grants s3:PutObject* and s3:Abort* permissions for this bucket to an IAM principal.

If encryption is used, permission to use the key to encrypt the contents
of written files will also be granted to the same principal.

###### `identity`<sup>Required</sup> <a name="identity" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPut.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

The principal.

---

###### `objectsKeyPattern`<sup>Optional</sup> <a name="objectsKeyPattern" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPut.parameter.objectsKeyPattern"></a>

- *Type:* any

Restrict the permission to a certain key pattern (default '*').

Parameter type is `any` but `string` should be passed in.

---

##### `grantPutAcl` <a name="grantPutAcl" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPutAcl"></a>

```typescript
public grantPutAcl(identity: IGrantable, objectsKeyPattern?: string): Grant
```

Grant the given IAM identity permissions to modify the ACLs of objects in the given Bucket.

If your application has the '@aws-cdk/aws-s3:grantWriteWithoutAcl' feature flag set,
calling `grantWrite` or `grantReadWrite` no longer grants permissions to modify the ACLs of the objects;
in this case, if you need to modify object ACLs, call this method explicitly.

###### `identity`<sup>Required</sup> <a name="identity" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPutAcl.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

###### `objectsKeyPattern`<sup>Optional</sup> <a name="objectsKeyPattern" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantPutAcl.parameter.objectsKeyPattern"></a>

- *Type:* string

---

##### `grantRead` <a name="grantRead" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantRead"></a>

```typescript
public grantRead(identity: IGrantable, objectsKeyPattern?: any): Grant
```

Grant read permissions for this bucket and it's contents to an IAM principal (Role/Group/User).

If encryption is used, permission to use the key to decrypt the contents
of the bucket will also be granted to the same principal.

###### `identity`<sup>Required</sup> <a name="identity" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantRead.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

The principal.

---

###### `objectsKeyPattern`<sup>Optional</sup> <a name="objectsKeyPattern" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantRead.parameter.objectsKeyPattern"></a>

- *Type:* any

Restrict the permission to a certain key pattern (default '*').

Parameter type is `any` but `string` should be passed in.

---

##### `grantReadWrite` <a name="grantReadWrite" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantReadWrite"></a>

```typescript
public grantReadWrite(identity: IGrantable, objectsKeyPattern?: any): Grant
```

Grants read/write permissions for this bucket and it's contents to an IAM principal (Role/Group/User).

If an encryption key is used, permission to use the key for
encrypt/decrypt will also be granted.

Before CDK version 1.85.0, this method granted the `s3:PutObject*` permission that included `s3:PutObjectAcl`,
which could be used to grant read/write object access to IAM principals in other accounts.
If you want to get rid of that behavior, update your CDK version to 1.85.0 or later,
and make sure the `@aws-cdk/aws-s3:grantWriteWithoutAcl` feature flag is set to `true`
in the `context` key of your cdk.json file.
If you've already updated, but still need the principal to have permissions to modify the ACLs,
use the `grantPutAcl` method.

###### `identity`<sup>Required</sup> <a name="identity" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantReadWrite.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

###### `objectsKeyPattern`<sup>Optional</sup> <a name="objectsKeyPattern" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantReadWrite.parameter.objectsKeyPattern"></a>

- *Type:* any

---

##### `grantWrite` <a name="grantWrite" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantWrite"></a>

```typescript
public grantWrite(identity: IGrantable, objectsKeyPattern?: any, allowedActionPatterns?: string[]): Grant
```

Grant write permissions to this bucket to an IAM principal.

If encryption is used, permission to use the key to encrypt the contents
of written files will also be granted to the same principal.

Before CDK version 1.85.0, this method granted the `s3:PutObject*` permission that included `s3:PutObjectAcl`,
which could be used to grant read/write object access to IAM principals in other accounts.
If you want to get rid of that behavior, update your CDK version to 1.85.0 or later,
and make sure the `@aws-cdk/aws-s3:grantWriteWithoutAcl` feature flag is set to `true`
in the `context` key of your cdk.json file.
If you've already updated, but still need the principal to have permissions to modify the ACLs,
use the `grantPutAcl` method.

###### `identity`<sup>Required</sup> <a name="identity" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantWrite.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

###### `objectsKeyPattern`<sup>Optional</sup> <a name="objectsKeyPattern" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantWrite.parameter.objectsKeyPattern"></a>

- *Type:* any

---

###### `allowedActionPatterns`<sup>Optional</sup> <a name="allowedActionPatterns" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.grantWrite.parameter.allowedActionPatterns"></a>

- *Type:* string[]

---

##### `onCloudTrailEvent` <a name="onCloudTrailEvent" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailEvent"></a>

```typescript
public onCloudTrailEvent(id: string, options?: OnCloudTrailBucketEventOptions): Rule
```

Define a CloudWatch event that triggers when something happens to this repository.

Requires that there exists at least one CloudTrail Trail in your account
that captures the event. This method will not create the Trail.

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailEvent.parameter.id"></a>

- *Type:* string

The id of the rule.

---

###### `options`<sup>Optional</sup> <a name="options" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailEvent.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_s3.OnCloudTrailBucketEventOptions

Options for adding the rule.

---

##### `onCloudTrailPutObject` <a name="onCloudTrailPutObject" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailPutObject"></a>

```typescript
public onCloudTrailPutObject(id: string, options?: OnCloudTrailBucketEventOptions): Rule
```

Defines an AWS CloudWatch event that triggers when an object is uploaded to the specified paths (keys) in this bucket using the PutObject API call.

Note that some tools like `aws s3 cp` will automatically use either
PutObject or the multipart upload API depending on the file size,
so using `onCloudTrailWriteObject` may be preferable.

Requires that there exists at least one CloudTrail Trail in your account
that captures the event. This method will not create the Trail.

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailPutObject.parameter.id"></a>

- *Type:* string

The id of the rule.

---

###### `options`<sup>Optional</sup> <a name="options" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailPutObject.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_s3.OnCloudTrailBucketEventOptions

Options for adding the rule.

---

##### `onCloudTrailWriteObject` <a name="onCloudTrailWriteObject" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailWriteObject"></a>

```typescript
public onCloudTrailWriteObject(id: string, options?: OnCloudTrailBucketEventOptions): Rule
```

Defines an AWS CloudWatch event that triggers when an object at the specified paths (keys) in this bucket are written to.

This includes
the events PutObject, CopyObject, and CompleteMultipartUpload.

Note that some tools like `aws s3 cp` will automatically use either
PutObject or the multipart upload API depending on the file size,
so using this method may be preferable to `onCloudTrailPutObject`.

Requires that there exists at least one CloudTrail Trail in your account
that captures the event. This method will not create the Trail.

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailWriteObject.parameter.id"></a>

- *Type:* string

The id of the rule.

---

###### `options`<sup>Optional</sup> <a name="options" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.onCloudTrailWriteObject.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_s3.OnCloudTrailBucketEventOptions

Options for adding the rule.

---

##### `s3UrlForObject` <a name="s3UrlForObject" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.s3UrlForObject"></a>

```typescript
public s3UrlForObject(key?: string): string
```

The S3 URL of an S3 object. For example:.

`s3://onlybucket`
- `s3://bucket/key`

###### `key`<sup>Optional</sup> <a name="key" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.s3UrlForObject.parameter.key"></a>

- *Type:* string

The S3 key of the object.

If not specified, the S3 URL of the
bucket is returned.

---

##### `transferAccelerationUrlForObject` <a name="transferAccelerationUrlForObject" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.transferAccelerationUrlForObject"></a>

```typescript
public transferAccelerationUrlForObject(key?: string, options?: TransferAccelerationUrlOptions): string
```

The https Transfer Acceleration URL of an S3 object.

Specify `dualStack: true` at the options
for dual-stack endpoint (connect to the bucket over IPv6). For example:

- `https://bucket.s3-accelerate.amazonaws.com`
- `https://bucket.s3-accelerate.amazonaws.com/key`

###### `key`<sup>Optional</sup> <a name="key" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.transferAccelerationUrlForObject.parameter.key"></a>

- *Type:* string

The S3 key of the object.

If not specified, the URL of the
bucket is returned.

---

###### `options`<sup>Optional</sup> <a name="options" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.transferAccelerationUrlForObject.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_s3.TransferAccelerationUrlOptions

Options for generating URL.

---

##### `urlForObject` <a name="urlForObject" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.urlForObject"></a>

```typescript
public urlForObject(key?: string): string
```

The https URL of an S3 object. Specify `regional: false` at the options for non-regional URLs. For example:.

`https://s3.us-west-1.amazonaws.com/onlybucket`
- `https://s3.us-west-1.amazonaws.com/bucket/key`
- `https://s3.cn-north-1.amazonaws.com.cn/china-bucket/mykey`

###### `key`<sup>Optional</sup> <a name="key" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.urlForObject.parameter.key"></a>

- *Type:* string

The S3 key of the object.

If not specified, the URL of the
bucket is returned.

---

##### `virtualHostedUrlForObject` <a name="virtualHostedUrlForObject" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.virtualHostedUrlForObject"></a>

```typescript
public virtualHostedUrlForObject(key?: string, options?: VirtualHostedStyleUrlOptions): string
```

The virtual hosted-style URL of an S3 object. Specify `regional: false` at the options for non-regional URL. For example:.

`https://only-bucket.s3.us-west-1.amazonaws.com`
- `https://bucket.s3.us-west-1.amazonaws.com/key`
- `https://bucket.s3.amazonaws.com/key`
- `https://china-bucket.s3.cn-north-1.amazonaws.com.cn/mykey`

###### `key`<sup>Optional</sup> <a name="key" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.virtualHostedUrlForObject.parameter.key"></a>

- *Type:* string

The S3 key of the object.

If not specified, the URL of the
bucket is returned.

---

###### `options`<sup>Optional</sup> <a name="options" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.virtualHostedUrlForObject.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_s3.VirtualHostedStyleUrlOptions

Options for generating URL.

---

##### `addCorsRule` <a name="addCorsRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addCorsRule"></a>

```typescript
public addCorsRule(rule: CorsRule): void
```

Adds a cross-origin access configuration for objects in an Amazon S3 bucket.

###### `rule`<sup>Required</sup> <a name="rule" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addCorsRule.parameter.rule"></a>

- *Type:* aws-cdk-lib.aws_s3.CorsRule

The CORS configuration rule to add.

---

##### `addInventory` <a name="addInventory" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addInventory"></a>

```typescript
public addInventory(inventory: Inventory): void
```

Add an inventory configuration.

###### `inventory`<sup>Required</sup> <a name="inventory" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addInventory.parameter.inventory"></a>

- *Type:* aws-cdk-lib.aws_s3.Inventory

configuration to add.

---

##### `addLifecycleRule` <a name="addLifecycleRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addLifecycleRule"></a>

```typescript
public addLifecycleRule(rule: LifecycleRule): void
```

Add a lifecycle rule to the bucket.

###### `rule`<sup>Required</sup> <a name="rule" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addLifecycleRule.parameter.rule"></a>

- *Type:* aws-cdk-lib.aws_s3.LifecycleRule

The rule to add.

---

##### `addMetric` <a name="addMetric" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addMetric"></a>

```typescript
public addMetric(metric: BucketMetrics): void
```

Adds a metrics configuration for the CloudWatch request metrics from the bucket.

###### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.addMetric.parameter.metric"></a>

- *Type:* aws-cdk-lib.aws_s3.BucketMetrics

The metric configuration to add.

---

##### `alarm4xxErrors` <a name="alarm4xxErrors" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.alarm4xxErrors"></a>

```typescript
public alarm4xxErrors(props?: S3Bucket4xxErrorsAlarmConfig): S3Bucket4xxErrorsAlarm
```

Creates an alarm that monitors the 4xx errors for the S3 bucket.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.alarm4xxErrors.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig">S3Bucket4xxErrorsAlarmConfig</a>

---

##### `alarm5xxErrors` <a name="alarm5xxErrors" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.alarm5xxErrors"></a>

```typescript
public alarm5xxErrors(props?: S3Bucket5xxErrorsAlarmConfig): S3Bucket5xxErrorsAlarm
```

Creates an alarm that monitors the 5xx errors for the S3 bucket.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.alarm5xxErrors.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig">S3Bucket5xxErrorsAlarmConfig</a>

---

##### `applyRecommendedAlarms` <a name="applyRecommendedAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.applyRecommendedAlarms"></a>

```typescript
public applyRecommendedAlarms(props?: S3RecommendedAlarmsConfig): S3RecommendedAlarms
```

Creates the recommended alarms for the S3 bucket.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#S3](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#S3)

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.applyRecommendedAlarms.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig">S3RecommendedAlarmsConfig</a>

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketArn">fromBucketArn</a></code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketAttributes">fromBucketAttributes</a></code> | Creates a Bucket construct that represents an external bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketName">fromBucketName</a></code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromCfnBucket">fromCfnBucket</a></code> | Create a mutable `IBucket` based on a low-level `CfnBucket`. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.validateBucketName">validateBucketName</a></code> | Thrown an exception if the given bucket name is not valid. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.isConstruct"></a>

```typescript
import { Bucket } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Bucket.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.isOwnedResource"></a>

```typescript
import { Bucket } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Bucket.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.isResource"></a>

```typescript
import { Bucket } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Bucket.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromBucketArn` <a name="fromBucketArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketArn"></a>

```typescript
import { Bucket } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Bucket.fromBucketArn(scope: Construct, id: string, bucketArn: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketArn.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketArn.parameter.id"></a>

- *Type:* string

---

###### `bucketArn`<sup>Required</sup> <a name="bucketArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketArn.parameter.bucketArn"></a>

- *Type:* string

---

##### `fromBucketAttributes` <a name="fromBucketAttributes" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketAttributes"></a>

```typescript
import { Bucket } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Bucket.fromBucketAttributes(scope: Construct, id: string, attrs: BucketAttributes)
```

Creates a Bucket construct that represents an external bucket.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketAttributes.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketAttributes.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `attrs`<sup>Required</sup> <a name="attrs" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketAttributes.parameter.attrs"></a>

- *Type:* aws-cdk-lib.aws_s3.BucketAttributes

A `BucketAttributes` object.

Can be obtained from a call to
`bucket.export()` or manually created.

---

##### `fromBucketName` <a name="fromBucketName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketName"></a>

```typescript
import { Bucket } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Bucket.fromBucketName(scope: Construct, id: string, bucketName: string)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketName.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketName.parameter.id"></a>

- *Type:* string

---

###### `bucketName`<sup>Required</sup> <a name="bucketName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromBucketName.parameter.bucketName"></a>

- *Type:* string

---

##### `fromCfnBucket` <a name="fromCfnBucket" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromCfnBucket"></a>

```typescript
import { Bucket } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Bucket.fromCfnBucket(cfnBucket: CfnBucket)
```

Create a mutable `IBucket` based on a low-level `CfnBucket`.

###### `cfnBucket`<sup>Required</sup> <a name="cfnBucket" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.fromCfnBucket.parameter.cfnBucket"></a>

- *Type:* aws-cdk-lib.aws_s3.CfnBucket

---

##### `validateBucketName` <a name="validateBucketName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.validateBucketName"></a>

```typescript
import { Bucket } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Bucket.validateBucketName(physicalName: string, allowLegacyBucketNaming?: boolean)
```

Thrown an exception if the given bucket name is not valid.

###### `physicalName`<sup>Required</sup> <a name="physicalName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.validateBucketName.parameter.physicalName"></a>

- *Type:* string

name of the bucket.

---

###### `allowLegacyBucketNaming`<sup>Optional</sup> <a name="allowLegacyBucketNaming" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.validateBucketName.parameter.allowLegacyBucketNaming"></a>

- *Type:* boolean

allow legacy bucket naming style, default is false.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketArn">bucketArn</a></code> | <code>string</code> | The ARN of the bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketDomainName">bucketDomainName</a></code> | <code>string</code> | The IPv4 DNS name of the specified bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketDualStackDomainName">bucketDualStackDomainName</a></code> | <code>string</code> | The IPv6 DNS name of the specified bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketName">bucketName</a></code> | <code>string</code> | The name of the bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketRegionalDomainName">bucketRegionalDomainName</a></code> | <code>string</code> | The regional domain name of the specified bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketWebsiteDomainName">bucketWebsiteDomainName</a></code> | <code>string</code> | The Domain name of the static website. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketWebsiteUrl">bucketWebsiteUrl</a></code> | <code>string</code> | The URL of the static website. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.encryptionKey">encryptionKey</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | Optional KMS encryption key associated with this bucket. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.isWebsite">isWebsite</a></code> | <code>boolean</code> | If this bucket has been configured for static website hosting. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.policy">policy</a></code> | <code>aws-cdk-lib.aws_s3.BucketPolicy</code> | The resource policy associated with this bucket. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `bucketArn`<sup>Required</sup> <a name="bucketArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketArn"></a>

```typescript
public readonly bucketArn: string;
```

- *Type:* string

The ARN of the bucket.

---

##### `bucketDomainName`<sup>Required</sup> <a name="bucketDomainName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketDomainName"></a>

```typescript
public readonly bucketDomainName: string;
```

- *Type:* string

The IPv4 DNS name of the specified bucket.

---

##### `bucketDualStackDomainName`<sup>Required</sup> <a name="bucketDualStackDomainName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketDualStackDomainName"></a>

```typescript
public readonly bucketDualStackDomainName: string;
```

- *Type:* string

The IPv6 DNS name of the specified bucket.

---

##### `bucketName`<sup>Required</sup> <a name="bucketName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketName"></a>

```typescript
public readonly bucketName: string;
```

- *Type:* string

The name of the bucket.

---

##### `bucketRegionalDomainName`<sup>Required</sup> <a name="bucketRegionalDomainName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketRegionalDomainName"></a>

```typescript
public readonly bucketRegionalDomainName: string;
```

- *Type:* string

The regional domain name of the specified bucket.

---

##### `bucketWebsiteDomainName`<sup>Required</sup> <a name="bucketWebsiteDomainName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketWebsiteDomainName"></a>

```typescript
public readonly bucketWebsiteDomainName: string;
```

- *Type:* string

The Domain name of the static website.

---

##### `bucketWebsiteUrl`<sup>Required</sup> <a name="bucketWebsiteUrl" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.bucketWebsiteUrl"></a>

```typescript
public readonly bucketWebsiteUrl: string;
```

- *Type:* string

The URL of the static website.

---

##### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.encryptionKey"></a>

```typescript
public readonly encryptionKey: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey

Optional KMS encryption key associated with this bucket.

---

##### `isWebsite`<sup>Optional</sup> <a name="isWebsite" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.isWebsite"></a>

```typescript
public readonly isWebsite: boolean;
```

- *Type:* boolean

If this bucket has been configured for static website hosting.

---

##### `policy`<sup>Optional</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Bucket.property.policy"></a>

```typescript
public readonly policy: BucketPolicy;
```

- *Type:* aws-cdk-lib.aws_s3.BucketPolicy

The resource policy associated with this bucket.

If `autoCreatePolicy` is true, a `BucketPolicy` will be created upon the
first call to addToResourcePolicy(s).

---


### Function <a name="Function" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function"></a>

An extension of the Lambda function construct that provides methods to create recommended alarms.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.Initializer"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new Function(scope: Construct, id: string, props: FunctionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.Initializer.parameter.props">props</a></code> | <code>aws-cdk-lib.aws_lambda.FunctionProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.Initializer.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_lambda.FunctionProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEventSource">addEventSource</a></code> | Adds an event source to this function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEventSourceMapping">addEventSourceMapping</a></code> | Adds an event source that maps to this AWS Lambda function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.addFunctionUrl">addFunctionUrl</a></code> | Adds a url to this lambda function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.addPermission">addPermission</a></code> | Adds a permission to the Lambda resource policy. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.addToRolePolicy">addToRolePolicy</a></code> | Adds a statement to the IAM role assumed by the instance. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.configureAsyncInvoke">configureAsyncInvoke</a></code> | Configures options for asynchronous invocation. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.considerWarningOnInvokeFunctionPermissions">considerWarningOnInvokeFunctionPermissions</a></code> | A warning will be added to functions under the following conditions: - permissions that include `lambda:InvokeFunction` are added to the unqualified function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvoke">grantInvoke</a></code> | Grant the given identity permissions to invoke this Lambda. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeCompositePrincipal">grantInvokeCompositePrincipal</a></code> | Grant multiple principals the ability to invoke this Lambda via CompositePrincipal. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeLatestVersion">grantInvokeLatestVersion</a></code> | Grant the given identity permissions to invoke the $LATEST version or unqualified version of this Lambda. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeUrl">grantInvokeUrl</a></code> | Grant the given identity permissions to invoke this Lambda Function URL. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeVersion">grantInvokeVersion</a></code> | Grant the given identity permissions to invoke the given version of this Lambda. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metric">metric</a></code> | Return the given named metric for this Function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricDuration">metricDuration</a></code> | How long execution of this Lambda takes. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricErrors">metricErrors</a></code> | How many invocations of this Lambda fail. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricInvocations">metricInvocations</a></code> | How often this Lambda is invoked. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricThrottles">metricThrottles</a></code> | How often this Lambda is throttled. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.addAlias">addAlias</a></code> | Defines an alias for this function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEnvironment">addEnvironment</a></code> | Adds an environment variable to this Lambda function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.addLayers">addLayers</a></code> | Adds one or more Lambda Layers to this Lambda function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.invalidateVersionBasedOn">invalidateVersionBasedOn</a></code> | Mix additional information into the hash of the Version object. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmConcurrentExecutions">alarmConcurrentExecutions</a></code> | Creates an alarm that monitors the number of concurrent executions. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmDuration">alarmDuration</a></code> | Creates an alarm that monitors the duration of the function invocations. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmErrors">alarmErrors</a></code> | Creates an alarm that monitors the number of errors. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmThrottles">alarmThrottles</a></code> | Creates an alarm that monitors the number of throttles. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.applyRecommendedAlarms">applyRecommendedAlarms</a></code> | Creates recommended alarms for the Lambda function. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addEventSource` <a name="addEventSource" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEventSource"></a>

```typescript
public addEventSource(source: IEventSource): void
```

Adds an event source to this function.

Event sources are implemented in the aws-cdk-lib/aws-lambda-event-sources module.

The following example adds an SQS Queue as an event source:
```
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
myFunction.addEventSource(new SqsEventSource(myQueue));
```

###### `source`<sup>Required</sup> <a name="source" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEventSource.parameter.source"></a>

- *Type:* aws-cdk-lib.aws_lambda.IEventSource

---

##### `addEventSourceMapping` <a name="addEventSourceMapping" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEventSourceMapping"></a>

```typescript
public addEventSourceMapping(id: string, options: EventSourceMappingOptions): EventSourceMapping
```

Adds an event source that maps to this AWS Lambda function.

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEventSourceMapping.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEventSourceMapping.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.EventSourceMappingOptions

---

##### `addFunctionUrl` <a name="addFunctionUrl" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addFunctionUrl"></a>

```typescript
public addFunctionUrl(options?: FunctionUrlOptions): FunctionUrl
```

Adds a url to this lambda function.

###### `options`<sup>Optional</sup> <a name="options" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addFunctionUrl.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.FunctionUrlOptions

---

##### `addPermission` <a name="addPermission" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addPermission"></a>

```typescript
public addPermission(id: string, permission: Permission): void
```

Adds a permission to the Lambda resource policy.

> [Permission for details.](Permission for details.)

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addPermission.parameter.id"></a>

- *Type:* string

The id for the permission construct.

---

###### `permission`<sup>Required</sup> <a name="permission" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addPermission.parameter.permission"></a>

- *Type:* aws-cdk-lib.aws_lambda.Permission

The permission to grant to this Lambda function.

---

##### `addToRolePolicy` <a name="addToRolePolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addToRolePolicy"></a>

```typescript
public addToRolePolicy(statement: PolicyStatement): void
```

Adds a statement to the IAM role assumed by the instance.

###### `statement`<sup>Required</sup> <a name="statement" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addToRolePolicy.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

---

##### `configureAsyncInvoke` <a name="configureAsyncInvoke" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.configureAsyncInvoke"></a>

```typescript
public configureAsyncInvoke(options: EventInvokeConfigOptions): void
```

Configures options for asynchronous invocation.

###### `options`<sup>Required</sup> <a name="options" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.configureAsyncInvoke.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.EventInvokeConfigOptions

---

##### `considerWarningOnInvokeFunctionPermissions` <a name="considerWarningOnInvokeFunctionPermissions" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.considerWarningOnInvokeFunctionPermissions"></a>

```typescript
public considerWarningOnInvokeFunctionPermissions(scope: Construct, action: string): void
```

A warning will be added to functions under the following conditions: - permissions that include `lambda:InvokeFunction` are added to the unqualified function.

function.currentVersion is invoked before or after the permission is created.

This applies only to permissions on Lambda functions, not versions or aliases.
This function is overridden as a noOp for QualifiedFunctionBase.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.considerWarningOnInvokeFunctionPermissions.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `action`<sup>Required</sup> <a name="action" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.considerWarningOnInvokeFunctionPermissions.parameter.action"></a>

- *Type:* string

---

##### `grantInvoke` <a name="grantInvoke" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvoke"></a>

```typescript
public grantInvoke(grantee: IGrantable): Grant
```

Grant the given identity permissions to invoke this Lambda.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvoke.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantInvokeCompositePrincipal` <a name="grantInvokeCompositePrincipal" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeCompositePrincipal"></a>

```typescript
public grantInvokeCompositePrincipal(compositePrincipal: CompositePrincipal): Grant[]
```

Grant multiple principals the ability to invoke this Lambda via CompositePrincipal.

###### `compositePrincipal`<sup>Required</sup> <a name="compositePrincipal" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeCompositePrincipal.parameter.compositePrincipal"></a>

- *Type:* aws-cdk-lib.aws_iam.CompositePrincipal

---

##### `grantInvokeLatestVersion` <a name="grantInvokeLatestVersion" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeLatestVersion"></a>

```typescript
public grantInvokeLatestVersion(grantee: IGrantable): Grant
```

Grant the given identity permissions to invoke the $LATEST version or unqualified version of this Lambda.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeLatestVersion.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantInvokeUrl` <a name="grantInvokeUrl" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeUrl"></a>

```typescript
public grantInvokeUrl(grantee: IGrantable): Grant
```

Grant the given identity permissions to invoke this Lambda Function URL.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeUrl.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantInvokeVersion` <a name="grantInvokeVersion" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeVersion"></a>

```typescript
public grantInvokeVersion(grantee: IGrantable, version: IVersion): Grant
```

Grant the given identity permissions to invoke the given version of this Lambda.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeVersion.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

###### `version`<sup>Required</sup> <a name="version" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.grantInvokeVersion.parameter.version"></a>

- *Type:* aws-cdk-lib.aws_lambda.IVersion

---

##### `metric` <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Function.

###### `metricName`<sup>Required</sup> <a name="metricName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricDuration` <a name="metricDuration" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricDuration"></a>

```typescript
public metricDuration(props?: MetricOptions): Metric
```

How long execution of this Lambda takes.

Average over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricDuration.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricErrors` <a name="metricErrors" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricErrors"></a>

```typescript
public metricErrors(props?: MetricOptions): Metric
```

How many invocations of this Lambda fail.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricErrors.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricInvocations` <a name="metricInvocations" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricInvocations"></a>

```typescript
public metricInvocations(props?: MetricOptions): Metric
```

How often this Lambda is invoked.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricInvocations.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricThrottles` <a name="metricThrottles" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricThrottles"></a>

```typescript
public metricThrottles(props?: MetricOptions): Metric
```

How often this Lambda is throttled.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricThrottles.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `addAlias` <a name="addAlias" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addAlias"></a>

```typescript
public addAlias(aliasName: string, options?: AliasOptions): Alias
```

Defines an alias for this function.

The alias will automatically be updated to point to the latest version of
the function as it is being updated during a deployment.

```ts
declare const fn: lambda.Function;

fn.addAlias('Live');

// Is equivalent to

new lambda.Alias(this, 'AliasLive', {
  aliasName: 'Live',
  version: fn.currentVersion,
});
```

###### `aliasName`<sup>Required</sup> <a name="aliasName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addAlias.parameter.aliasName"></a>

- *Type:* string

The name of the alias.

---

###### `options`<sup>Optional</sup> <a name="options" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addAlias.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.AliasOptions

Alias options.

---

##### `addEnvironment` <a name="addEnvironment" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEnvironment"></a>

```typescript
public addEnvironment(key: string, value: string, options?: EnvironmentOptions): Function
```

Adds an environment variable to this Lambda function.

If this is a ref to a Lambda function, this operation results in a no-op.

###### `key`<sup>Required</sup> <a name="key" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEnvironment.parameter.key"></a>

- *Type:* string

The environment variable key.

---

###### `value`<sup>Required</sup> <a name="value" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEnvironment.parameter.value"></a>

- *Type:* string

The environment variable's value.

---

###### `options`<sup>Optional</sup> <a name="options" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addEnvironment.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_lambda.EnvironmentOptions

Environment variable options.

---

##### `addLayers` <a name="addLayers" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addLayers"></a>

```typescript
public addLayers(layers: ILayerVersion): void
```

Adds one or more Lambda Layers to this Lambda function.

###### `layers`<sup>Required</sup> <a name="layers" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.addLayers.parameter.layers"></a>

- *Type:* aws-cdk-lib.aws_lambda.ILayerVersion

the layers to be added.

---

##### `invalidateVersionBasedOn` <a name="invalidateVersionBasedOn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.invalidateVersionBasedOn"></a>

```typescript
public invalidateVersionBasedOn(x: string): void
```

Mix additional information into the hash of the Version object.

The Lambda Function construct does its best to automatically create a new
Version when anything about the Function changes (its code, its layers,
any of the other properties).

However, you can sometimes source information from places that the CDK cannot
look into, like the deploy-time values of SSM parameters. In those cases,
the CDK would not force the creation of a new Version object when it actually
should.

This method can be used to invalidate the current Version object. Pass in
any string into this method, and make sure the string changes when you know
a new Version needs to be created.

This method may be called more than once.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.invalidateVersionBasedOn.parameter.x"></a>

- *Type:* string

---

##### `alarmConcurrentExecutions` <a name="alarmConcurrentExecutions" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmConcurrentExecutions"></a>

```typescript
public alarmConcurrentExecutions(props?: LambdaConcurrentExecutionsAlarmConfig): LambdaConcurrentExecutionsAlarm
```

Creates an alarm that monitors the number of concurrent executions.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmConcurrentExecutions.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig">LambdaConcurrentExecutionsAlarmConfig</a>

---

##### `alarmDuration` <a name="alarmDuration" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmDuration"></a>

```typescript
public alarmDuration(props: LambdaDurationAlarmConfig): LambdaDurationAlarm
```

Creates an alarm that monitors the duration of the function invocations.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmDuration.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig">LambdaDurationAlarmConfig</a>

---

##### `alarmErrors` <a name="alarmErrors" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmErrors"></a>

```typescript
public alarmErrors(props: LambdaErrorsAlarmConfig): LambdaErrorsAlarm
```

Creates an alarm that monitors the number of errors.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmErrors.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig">LambdaErrorsAlarmConfig</a>

---

##### `alarmThrottles` <a name="alarmThrottles" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmThrottles"></a>

```typescript
public alarmThrottles(props: LambdaThrottlesAlarmConfig): LambdaThrottlesAlarm
```

Creates an alarm that monitors the number of throttles.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.alarmThrottles.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig">LambdaThrottlesAlarmConfig</a>

---

##### `applyRecommendedAlarms` <a name="applyRecommendedAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.applyRecommendedAlarms"></a>

```typescript
public applyRecommendedAlarms(props: LambdaRecommendedAlarmsConfig): LambdaRecommendedAlarms
```

Creates recommended alarms for the Lambda function.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Lambda](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Lambda)

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.applyRecommendedAlarms.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig">LambdaRecommendedAlarmsConfig</a>

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.classifyVersionProperty">classifyVersionProperty</a></code> | Record whether specific properties in the `AWS::Lambda::Function` resource should also be associated to the Version resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionArn">fromFunctionArn</a></code> | Import a lambda function into the CDK using its ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionAttributes">fromFunctionAttributes</a></code> | Creates a Lambda function object which represents a function not defined within this stack. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionName">fromFunctionName</a></code> | Import a lambda function into the CDK using its name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAll">metricAll</a></code> | Return the given named metric for this Lambda. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllConcurrentExecutions">metricAllConcurrentExecutions</a></code> | Metric for the number of concurrent executions across all Lambdas. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllDuration">metricAllDuration</a></code> | Metric for the Duration executing all Lambdas. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllErrors">metricAllErrors</a></code> | Metric for the number of Errors executing all Lambdas. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllInvocations">metricAllInvocations</a></code> | Metric for the number of invocations of all Lambdas. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllThrottles">metricAllThrottles</a></code> | Metric for the number of throttled invocations of all Lambdas. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllUnreservedConcurrentExecutions">metricAllUnreservedConcurrentExecutions</a></code> | Metric for the number of unreserved concurrent executions across all Lambdas. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.isConstruct"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.isOwnedResource"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.isResource"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `classifyVersionProperty` <a name="classifyVersionProperty" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.classifyVersionProperty"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.classifyVersionProperty(propertyName: string, locked: boolean)
```

Record whether specific properties in the `AWS::Lambda::Function` resource should also be associated to the Version resource.

See 'currentVersion' section in the module README for more details.

###### `propertyName`<sup>Required</sup> <a name="propertyName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.classifyVersionProperty.parameter.propertyName"></a>

- *Type:* string

The property to classify.

---

###### `locked`<sup>Required</sup> <a name="locked" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.classifyVersionProperty.parameter.locked"></a>

- *Type:* boolean

whether the property should be associated to the version or not.

---

##### `fromFunctionArn` <a name="fromFunctionArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionArn"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.fromFunctionArn(scope: Construct, id: string, functionArn: string)
```

Import a lambda function into the CDK using its ARN.

For `Function.addPermissions()` to work on this imported lambda, make sure that is
in the same account and region as the stack you are importing it into.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionArn.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionArn.parameter.id"></a>

- *Type:* string

---

###### `functionArn`<sup>Required</sup> <a name="functionArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionArn.parameter.functionArn"></a>

- *Type:* string

---

##### `fromFunctionAttributes` <a name="fromFunctionAttributes" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionAttributes"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.fromFunctionAttributes(scope: Construct, id: string, attrs: FunctionAttributes)
```

Creates a Lambda function object which represents a function not defined within this stack.

For `Function.addPermissions()` to work on this imported lambda, set the sameEnvironment property to true
if this imported lambda is in the same account and region as the stack you are importing it into.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionAttributes.parameter.scope"></a>

- *Type:* constructs.Construct

The parent construct.

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionAttributes.parameter.id"></a>

- *Type:* string

The name of the lambda construct.

---

###### `attrs`<sup>Required</sup> <a name="attrs" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionAttributes.parameter.attrs"></a>

- *Type:* aws-cdk-lib.aws_lambda.FunctionAttributes

the attributes of the function to import.

---

##### `fromFunctionName` <a name="fromFunctionName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionName"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.fromFunctionName(scope: Construct, id: string, functionName: string)
```

Import a lambda function into the CDK using its name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionName.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionName.parameter.id"></a>

- *Type:* string

---

###### `functionName`<sup>Required</sup> <a name="functionName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.fromFunctionName.parameter.functionName"></a>

- *Type:* string

---

##### `metricAll` <a name="metricAll" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAll"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.metricAll(metricName: string, props?: MetricOptions)
```

Return the given named metric for this Lambda.

###### `metricName`<sup>Required</sup> <a name="metricName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAll.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAll.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllConcurrentExecutions` <a name="metricAllConcurrentExecutions" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllConcurrentExecutions"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.metricAllConcurrentExecutions(props?: MetricOptions)
```

Metric for the number of concurrent executions across all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllConcurrentExecutions.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllDuration` <a name="metricAllDuration" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllDuration"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.metricAllDuration(props?: MetricOptions)
```

Metric for the Duration executing all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllDuration.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllErrors` <a name="metricAllErrors" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllErrors"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.metricAllErrors(props?: MetricOptions)
```

Metric for the number of Errors executing all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllErrors.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllInvocations` <a name="metricAllInvocations" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllInvocations"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.metricAllInvocations(props?: MetricOptions)
```

Metric for the number of invocations of all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllInvocations.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllThrottles` <a name="metricAllThrottles" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllThrottles"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.metricAllThrottles(props?: MetricOptions)
```

Metric for the number of throttled invocations of all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllThrottles.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricAllUnreservedConcurrentExecutions` <a name="metricAllUnreservedConcurrentExecutions" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllUnreservedConcurrentExecutions"></a>

```typescript
import { Function } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Function.metricAllUnreservedConcurrentExecutions(props?: MetricOptions)
```

Metric for the number of unreserved concurrent executions across all Lambdas.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.metricAllUnreservedConcurrentExecutions.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.architecture">architecture</a></code> | <code>aws-cdk-lib.aws_lambda.Architecture</code> | The architecture of this Lambda Function (this is an optional attribute and defaults to X86_64). |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.connections">connections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | Access the Connections object. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.functionArn">functionArn</a></code> | <code>string</code> | ARN of this function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.functionName">functionName</a></code> | <code>string</code> | Name of this function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.grantPrincipal">grantPrincipal</a></code> | <code>aws-cdk-lib.aws_iam.IPrincipal</code> | The principal this Lambda Function is running as. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.isBoundToVpc">isBoundToVpc</a></code> | <code>boolean</code> | Whether or not this Lambda function was bound to a VPC. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.latestVersion">latestVersion</a></code> | <code>aws-cdk-lib.aws_lambda.IVersion</code> | The `$LATEST` version of this function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.permissionsNode">permissionsNode</a></code> | <code>constructs.Node</code> | The construct node where permissions are attached. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.resourceArnsForGrantInvoke">resourceArnsForGrantInvoke</a></code> | <code>string[]</code> | The ARN(s) to put into the resource field of the generated IAM policy for grantInvoke(). |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | Execution role associated with this function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.currentVersion">currentVersion</a></code> | <code>aws-cdk-lib.aws_lambda.Version</code> | Returns a `lambda.Version` which represents the current version of this Lambda function. A new version will be created every time the function's configuration changes. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | The LogGroup where the Lambda function's logs are made available. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.runtime">runtime</a></code> | <code>aws-cdk-lib.aws_lambda.Runtime</code> | The runtime configured for this lambda. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.deadLetterQueue">deadLetterQueue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The DLQ (as queue) associated with this Lambda Function (this is an optional attribute). |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.deadLetterTopic">deadLetterTopic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The DLQ (as topic) associated with this Lambda Function (this is an optional attribute). |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.timeout">timeout</a></code> | <code>aws-cdk-lib.Duration</code> | The timeout configured for this lambda. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `architecture`<sup>Required</sup> <a name="architecture" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.architecture"></a>

```typescript
public readonly architecture: Architecture;
```

- *Type:* aws-cdk-lib.aws_lambda.Architecture

The architecture of this Lambda Function (this is an optional attribute and defaults to X86_64).

---

##### `connections`<sup>Required</sup> <a name="connections" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.connections"></a>

```typescript
public readonly connections: Connections;
```

- *Type:* aws-cdk-lib.aws_ec2.Connections

Access the Connections object.

Will fail if not a VPC-enabled Lambda Function

---

##### `functionArn`<sup>Required</sup> <a name="functionArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.functionArn"></a>

```typescript
public readonly functionArn: string;
```

- *Type:* string

ARN of this function.

---

##### `functionName`<sup>Required</sup> <a name="functionName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.functionName"></a>

```typescript
public readonly functionName: string;
```

- *Type:* string

Name of this function.

---

##### `grantPrincipal`<sup>Required</sup> <a name="grantPrincipal" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.grantPrincipal"></a>

```typescript
public readonly grantPrincipal: IPrincipal;
```

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

The principal this Lambda Function is running as.

---

##### `isBoundToVpc`<sup>Required</sup> <a name="isBoundToVpc" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.isBoundToVpc"></a>

```typescript
public readonly isBoundToVpc: boolean;
```

- *Type:* boolean

Whether or not this Lambda function was bound to a VPC.

If this is is `false`, trying to access the `connections` object will fail.

---

##### `latestVersion`<sup>Required</sup> <a name="latestVersion" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.latestVersion"></a>

```typescript
public readonly latestVersion: IVersion;
```

- *Type:* aws-cdk-lib.aws_lambda.IVersion

The `$LATEST` version of this function.

Note that this is reference to a non-specific AWS Lambda version, which
means the function this version refers to can return different results in
different invocations.

To obtain a reference to an explicit version which references the current
function configuration, use `lambdaFunction.currentVersion` instead.

---

##### `permissionsNode`<sup>Required</sup> <a name="permissionsNode" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.permissionsNode"></a>

```typescript
public readonly permissionsNode: Node;
```

- *Type:* constructs.Node

The construct node where permissions are attached.

---

##### `resourceArnsForGrantInvoke`<sup>Required</sup> <a name="resourceArnsForGrantInvoke" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.resourceArnsForGrantInvoke"></a>

```typescript
public readonly resourceArnsForGrantInvoke: string[];
```

- *Type:* string[]

The ARN(s) to put into the resource field of the generated IAM policy for grantInvoke().

---

##### `role`<sup>Optional</sup> <a name="role" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

Execution role associated with this function.

---

##### `currentVersion`<sup>Required</sup> <a name="currentVersion" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.currentVersion"></a>

```typescript
public readonly currentVersion: Version;
```

- *Type:* aws-cdk-lib.aws_lambda.Version

Returns a `lambda.Version` which represents the current version of this Lambda function. A new version will be created every time the function's configuration changes.

You can specify options for this version using the `currentVersionOptions`
prop when initializing the `lambda.Function`.

---

##### `logGroup`<sup>Required</sup> <a name="logGroup" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup

The LogGroup where the Lambda function's logs are made available.

If either `logRetention` is set or this property is called, a CloudFormation custom resource is added to the stack that
pre-creates the log group as part of the stack deployment, if it already doesn't exist, and sets the correct log retention
period (never expire, by default).

Further, if the log group already exists and the `logRetention` is not set, the custom resource will reset the log retention
to never expire even if it was configured with a different value.

---

##### `runtime`<sup>Required</sup> <a name="runtime" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.runtime"></a>

```typescript
public readonly runtime: Runtime;
```

- *Type:* aws-cdk-lib.aws_lambda.Runtime

The runtime configured for this lambda.

---

##### `deadLetterQueue`<sup>Optional</sup> <a name="deadLetterQueue" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.deadLetterQueue"></a>

```typescript
public readonly deadLetterQueue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue

The DLQ (as queue) associated with this Lambda Function (this is an optional attribute).

---

##### `deadLetterTopic`<sup>Optional</sup> <a name="deadLetterTopic" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.deadLetterTopic"></a>

```typescript
public readonly deadLetterTopic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The DLQ (as topic) associated with this Lambda Function (this is an optional attribute).

---

##### `timeout`<sup>Optional</sup> <a name="timeout" id="@renovosolutions/cdk-library-cloudwatch-alarms.Function.property.timeout"></a>

```typescript
public readonly timeout: Duration;
```

- *Type:* aws-cdk-lib.Duration

The timeout configured for this lambda.

---


### LambdaConcurrentExecutionsAlarm <a name="LambdaConcurrentExecutionsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm"></a>

This alarm can proactively detect if the concurrency of the function is approaching the Region-level concurrency quota of your account, so that you can act on it.

A function is
throttled if it reaches the Region-level concurrency quota
of the account.

The alarm is triggered when the number of concurrent executions
exceeds the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.Initializer"></a>

```typescript
import { LambdaConcurrentExecutionsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new LambdaConcurrentExecutionsAlarm(scope: Construct, id: string, props: LambdaConcurrentExecutionsAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps">LambdaConcurrentExecutionsAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps">LambdaConcurrentExecutionsAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.isConstruct"></a>

```typescript
import { LambdaConcurrentExecutionsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaConcurrentExecutionsAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.isOwnedResource"></a>

```typescript
import { LambdaConcurrentExecutionsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaConcurrentExecutionsAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.isResource"></a>

```typescript
import { LambdaConcurrentExecutionsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaConcurrentExecutionsAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.fromAlarmArn"></a>

```typescript
import { LambdaConcurrentExecutionsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaConcurrentExecutionsAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.fromAlarmName"></a>

```typescript
import { LambdaConcurrentExecutionsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaConcurrentExecutionsAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### LambdaDurationAlarm <a name="LambdaDurationAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm"></a>

This alarm can detect a long running duration of a Lambda function.

High runtime duration indicates that
a function is taking a longer time for invocation, and
can also impact the concurrency capacity of invocation
if Lambda is handling a higher number of events. It is
critical to know if the Lambda function is constantly
taking longer execution time than expected.

The alarm is triggered when the duration of the function
invocations exceeds the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.Initializer"></a>

```typescript
import { LambdaDurationAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new LambdaDurationAlarm(scope: Construct, id: string, props: LambdaDurationAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps">LambdaDurationAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps">LambdaDurationAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.isConstruct"></a>

```typescript
import { LambdaDurationAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaDurationAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.isOwnedResource"></a>

```typescript
import { LambdaDurationAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaDurationAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.isResource"></a>

```typescript
import { LambdaDurationAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaDurationAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.fromAlarmArn"></a>

```typescript
import { LambdaDurationAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaDurationAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.fromAlarmName"></a>

```typescript
import { LambdaDurationAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaDurationAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### LambdaErrorsAlarm <a name="LambdaErrorsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm"></a>

The alarm helps detect high error counts in function invocations.

The alarm is triggered when the number of errors exceeds the specified
threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.Initializer"></a>

```typescript
import { LambdaErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new LambdaErrorsAlarm(scope: Construct, id: string, props: LambdaErrorsAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps">LambdaErrorsAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps">LambdaErrorsAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.isConstruct"></a>

```typescript
import { LambdaErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaErrorsAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.isOwnedResource"></a>

```typescript
import { LambdaErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaErrorsAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.isResource"></a>

```typescript
import { LambdaErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaErrorsAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.fromAlarmArn"></a>

```typescript
import { LambdaErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaErrorsAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.fromAlarmName"></a>

```typescript
import { LambdaErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaErrorsAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### LambdaRecommendedAlarms <a name="LambdaRecommendedAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms"></a>

A construct that creates recommended alarms for a Lambda function.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Lambda](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Lambda)

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.Initializer"></a>

```typescript
import { LambdaRecommendedAlarms } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new LambdaRecommendedAlarms(scope: Construct, id: string, props: LambdaRecommendedAlarmsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps">LambdaRecommendedAlarmsProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps">LambdaRecommendedAlarmsProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.isConstruct"></a>

```typescript
import { LambdaRecommendedAlarms } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaRecommendedAlarms.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.property.alarmConcurrentExecutions">alarmConcurrentExecutions</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm">LambdaConcurrentExecutionsAlarm</a></code> | The concurrent executions alarm for the Lambda function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.property.alarmDuration">alarmDuration</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm">LambdaDurationAlarm</a></code> | The duration alarm for the Lambda function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.property.alarmErrors">alarmErrors</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm">LambdaErrorsAlarm</a></code> | The error alarm for the Lambda function. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.property.alarmThrottles">alarmThrottles</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm">LambdaThrottlesAlarm</a></code> | The throttles alarm for the Lambda function. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `alarmConcurrentExecutions`<sup>Optional</sup> <a name="alarmConcurrentExecutions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.property.alarmConcurrentExecutions"></a>

```typescript
public readonly alarmConcurrentExecutions: LambdaConcurrentExecutionsAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarm">LambdaConcurrentExecutionsAlarm</a>

The concurrent executions alarm for the Lambda function.

---

##### `alarmDuration`<sup>Optional</sup> <a name="alarmDuration" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.property.alarmDuration"></a>

```typescript
public readonly alarmDuration: LambdaDurationAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarm">LambdaDurationAlarm</a>

The duration alarm for the Lambda function.

---

##### `alarmErrors`<sup>Optional</sup> <a name="alarmErrors" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.property.alarmErrors"></a>

```typescript
public readonly alarmErrors: LambdaErrorsAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarm">LambdaErrorsAlarm</a>

The error alarm for the Lambda function.

---

##### `alarmThrottles`<sup>Optional</sup> <a name="alarmThrottles" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarms.property.alarmThrottles"></a>

```typescript
public readonly alarmThrottles: LambdaThrottlesAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm">LambdaThrottlesAlarm</a>

The throttles alarm for the Lambda function.

---


### LambdaThrottlesAlarm <a name="LambdaThrottlesAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm"></a>

The alarm helps detect a high number of throttled invocation requests for a Lambda function.

It is important to know if requests are constantly
getting rejected due to throttling and if you need to improve Lambda
function performance or increase concurrency capacity to avoid constant
throttling.

The alarm is triggered when the number of throttles exceeds or equals
the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.Initializer"></a>

```typescript
import { LambdaThrottlesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new LambdaThrottlesAlarm(scope: Construct, id: string, props: LambdaThrottlesAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps">LambdaThrottlesAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps">LambdaThrottlesAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.isConstruct"></a>

```typescript
import { LambdaThrottlesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaThrottlesAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.isOwnedResource"></a>

```typescript
import { LambdaThrottlesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaThrottlesAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.isResource"></a>

```typescript
import { LambdaThrottlesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaThrottlesAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.fromAlarmArn"></a>

```typescript
import { LambdaThrottlesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaThrottlesAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.fromAlarmName"></a>

```typescript
import { LambdaThrottlesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

LambdaThrottlesAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### Queue <a name="Queue" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue"></a>

An extension of the SQS Queue construct that adds methods to create recommended alarms.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.Initializer"></a>

```typescript
import { Queue } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new Queue(scope: Construct, id: string, props?: QueueProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.Initializer.parameter.props">props</a></code> | <code>aws-cdk-lib.aws_sqs.QueueProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.Initializer.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_sqs.QueueProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.addToResourcePolicy">addToResourcePolicy</a></code> | Adds a statement to the IAM resource policy associated with this queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grant">grant</a></code> | Grant the actions defined in queueActions to the identity Principal given on this SQS queue resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grantConsumeMessages">grantConsumeMessages</a></code> | Grant permissions to consume messages from a queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grantPurge">grantPurge</a></code> | Grant an IAM principal permissions to purge all messages from the queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grantSendMessages">grantSendMessages</a></code> | Grant access to send messages to a queue to the given identity. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metric">metric</a></code> | Return the given named metric for this Queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateAgeOfOldestMessage">metricApproximateAgeOfOldestMessage</a></code> | The approximate age of the oldest non-deleted message in the queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateNumberOfMessagesDelayed">metricApproximateNumberOfMessagesDelayed</a></code> | The number of messages in the queue that are delayed and not available for reading immediately. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateNumberOfMessagesNotVisible">metricApproximateNumberOfMessagesNotVisible</a></code> | The number of messages that are in flight. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateNumberOfMessagesVisible">metricApproximateNumberOfMessagesVisible</a></code> | The number of messages available for retrieval from the queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfEmptyReceives">metricNumberOfEmptyReceives</a></code> | The number of ReceiveMessage API calls that did not return a message. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfMessagesDeleted">metricNumberOfMessagesDeleted</a></code> | The number of messages deleted from the queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfMessagesReceived">metricNumberOfMessagesReceived</a></code> | The number of messages returned by calls to the ReceiveMessage action. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfMessagesSent">metricNumberOfMessagesSent</a></code> | The number of messages added to a queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricSentMessageSize">metricSentMessageSize</a></code> | The size of messages added to a queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmApproximateAgeOfOldestMessage">alarmApproximateAgeOfOldestMessage</a></code> | Creates an alarm that watches the age of the oldest message in the queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmApproximateNumberOfMessagesNotVisible">alarmApproximateNumberOfMessagesNotVisible</a></code> | Creates an alarm that watches the number of messages that are in flight. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmApproximateNumberOfMessagesVisible">alarmApproximateNumberOfMessagesVisible</a></code> | Creates an alarm that watches the number of messages that are visible in the queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmNumberOfMessagesSent">alarmNumberOfMessagesSent</a></code> | Creates an alarm that watches the number of messages that are sent. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.applyRecommendedAlarms">applyRecommendedAlarms</a></code> | Creates the recommended alarms for an SQS queue. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addToResourcePolicy` <a name="addToResourcePolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.addToResourcePolicy"></a>

```typescript
public addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult
```

Adds a statement to the IAM resource policy associated with this queue.

If this queue was created in this stack (`new Queue`), a queue policy
will be automatically created upon the first call to `addToPolicy`. If
the queue is imported (`Queue.import`), then this is a no-op.

###### `statement`<sup>Required</sup> <a name="statement" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.addToResourcePolicy.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

---

##### `grant` <a name="grant" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grant"></a>

```typescript
public grant(grantee: IGrantable, actions: string): Grant
```

Grant the actions defined in queueActions to the identity Principal given on this SQS queue resource.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grant.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

Principal to grant right to.

---

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grant.parameter.actions"></a>

- *Type:* string

The actions to grant.

---

##### `grantConsumeMessages` <a name="grantConsumeMessages" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grantConsumeMessages"></a>

```typescript
public grantConsumeMessages(grantee: IGrantable): Grant
```

Grant permissions to consume messages from a queue.

This will grant the following permissions:

  - sqs:ChangeMessageVisibility
  - sqs:DeleteMessage
  - sqs:ReceiveMessage
  - sqs:GetQueueAttributes
  - sqs:GetQueueUrl

If encryption is used, permission to use the key to decrypt the contents of the queue will also be granted to the same principal.

This will grant the following KMS permissions:

  - kms:Decrypt

###### `grantee`<sup>Required</sup> <a name="grantee" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grantConsumeMessages.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

Principal to grant consume rights to.

---

##### `grantPurge` <a name="grantPurge" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grantPurge"></a>

```typescript
public grantPurge(grantee: IGrantable): Grant
```

Grant an IAM principal permissions to purge all messages from the queue.

This will grant the following permissions:

 - sqs:PurgeQueue
 - sqs:GetQueueAttributes
 - sqs:GetQueueUrl

###### `grantee`<sup>Required</sup> <a name="grantee" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grantPurge.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

Principal to grant send rights to.

---

##### `grantSendMessages` <a name="grantSendMessages" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grantSendMessages"></a>

```typescript
public grantSendMessages(grantee: IGrantable): Grant
```

Grant access to send messages to a queue to the given identity.

This will grant the following permissions:

 - sqs:SendMessage
 - sqs:GetQueueAttributes
 - sqs:GetQueueUrl

If encryption is used, permission to use the key to encrypt/decrypt the contents of the queue will also be granted to the same principal.

This will grant the following KMS permissions:

 - kms:Decrypt
 - kms:Encrypt
 - kms:ReEncrypt*
 - kms:GenerateDataKey*

###### `grantee`<sup>Required</sup> <a name="grantee" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.grantSendMessages.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

Principal to grant send rights to.

---

##### `metric` <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Queue.

###### `metricName`<sup>Required</sup> <a name="metricName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricApproximateAgeOfOldestMessage` <a name="metricApproximateAgeOfOldestMessage" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateAgeOfOldestMessage"></a>

```typescript
public metricApproximateAgeOfOldestMessage(props?: MetricOptions): Metric
```

The approximate age of the oldest non-deleted message in the queue.

Maximum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateAgeOfOldestMessage.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricApproximateNumberOfMessagesDelayed` <a name="metricApproximateNumberOfMessagesDelayed" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateNumberOfMessagesDelayed"></a>

```typescript
public metricApproximateNumberOfMessagesDelayed(props?: MetricOptions): Metric
```

The number of messages in the queue that are delayed and not available for reading immediately.

Maximum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateNumberOfMessagesDelayed.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricApproximateNumberOfMessagesNotVisible` <a name="metricApproximateNumberOfMessagesNotVisible" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateNumberOfMessagesNotVisible"></a>

```typescript
public metricApproximateNumberOfMessagesNotVisible(props?: MetricOptions): Metric
```

The number of messages that are in flight.

Maximum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateNumberOfMessagesNotVisible.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricApproximateNumberOfMessagesVisible` <a name="metricApproximateNumberOfMessagesVisible" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateNumberOfMessagesVisible"></a>

```typescript
public metricApproximateNumberOfMessagesVisible(props?: MetricOptions): Metric
```

The number of messages available for retrieval from the queue.

Maximum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricApproximateNumberOfMessagesVisible.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricNumberOfEmptyReceives` <a name="metricNumberOfEmptyReceives" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfEmptyReceives"></a>

```typescript
public metricNumberOfEmptyReceives(props?: MetricOptions): Metric
```

The number of ReceiveMessage API calls that did not return a message.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfEmptyReceives.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricNumberOfMessagesDeleted` <a name="metricNumberOfMessagesDeleted" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfMessagesDeleted"></a>

```typescript
public metricNumberOfMessagesDeleted(props?: MetricOptions): Metric
```

The number of messages deleted from the queue.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfMessagesDeleted.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricNumberOfMessagesReceived` <a name="metricNumberOfMessagesReceived" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfMessagesReceived"></a>

```typescript
public metricNumberOfMessagesReceived(props?: MetricOptions): Metric
```

The number of messages returned by calls to the ReceiveMessage action.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfMessagesReceived.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricNumberOfMessagesSent` <a name="metricNumberOfMessagesSent" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfMessagesSent"></a>

```typescript
public metricNumberOfMessagesSent(props?: MetricOptions): Metric
```

The number of messages added to a queue.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricNumberOfMessagesSent.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricSentMessageSize` <a name="metricSentMessageSize" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricSentMessageSize"></a>

```typescript
public metricSentMessageSize(props?: MetricOptions): Metric
```

The size of messages added to a queue.

Average over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.metricSentMessageSize.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `alarmApproximateAgeOfOldestMessage` <a name="alarmApproximateAgeOfOldestMessage" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmApproximateAgeOfOldestMessage"></a>

```typescript
public alarmApproximateAgeOfOldestMessage(props: SqsApproximateAgeOfOldestMessageAlarmConfig): SqsApproximateAgeOfOldestMessageAlarm
```

Creates an alarm that watches the age of the oldest message in the queue.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmApproximateAgeOfOldestMessage.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig">SqsApproximateAgeOfOldestMessageAlarmConfig</a>

---

##### `alarmApproximateNumberOfMessagesNotVisible` <a name="alarmApproximateNumberOfMessagesNotVisible" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmApproximateNumberOfMessagesNotVisible"></a>

```typescript
public alarmApproximateNumberOfMessagesNotVisible(props: SqsApproximateNumberOfMessagesNotVisibleAlarmConfig): SqsApproximateNumberOfMessagesNotVisibleAlarm
```

Creates an alarm that watches the number of messages that are in flight.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmApproximateNumberOfMessagesNotVisible.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig">SqsApproximateNumberOfMessagesNotVisibleAlarmConfig</a>

---

##### `alarmApproximateNumberOfMessagesVisible` <a name="alarmApproximateNumberOfMessagesVisible" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmApproximateNumberOfMessagesVisible"></a>

```typescript
public alarmApproximateNumberOfMessagesVisible(props: SqsApproximateNumberOfMessagesVisibleAlarmConfig): SqsApproximateNumberOfMessagesVisibleAlarm
```

Creates an alarm that watches the number of messages that are visible in the queue.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmApproximateNumberOfMessagesVisible.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig">SqsApproximateNumberOfMessagesVisibleAlarmConfig</a>

---

##### `alarmNumberOfMessagesSent` <a name="alarmNumberOfMessagesSent" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmNumberOfMessagesSent"></a>

```typescript
public alarmNumberOfMessagesSent(props?: SqsNumberOfMessagesSentAlarmConfig): SqsNumberOfMessagesSentAlarm
```

Creates an alarm that watches the number of messages that are sent.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.alarmNumberOfMessagesSent.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig">SqsNumberOfMessagesSentAlarmConfig</a>

---

##### `applyRecommendedAlarms` <a name="applyRecommendedAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.applyRecommendedAlarms"></a>

```typescript
public applyRecommendedAlarms(props: SqsRecommendedAlarmsConfig): void
```

Creates the recommended alarms for an SQS queue.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.applyRecommendedAlarms.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig">SqsRecommendedAlarmsConfig</a>

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.fromQueueArn">fromQueueArn</a></code> | Import an existing SQS queue provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.fromQueueAttributes">fromQueueAttributes</a></code> | Import an existing queue. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.isConstruct"></a>

```typescript
import { Queue } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Queue.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.isOwnedResource"></a>

```typescript
import { Queue } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Queue.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.isResource"></a>

```typescript
import { Queue } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Queue.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromQueueArn` <a name="fromQueueArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.fromQueueArn"></a>

```typescript
import { Queue } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Queue.fromQueueArn(scope: Construct, id: string, queueArn: string)
```

Import an existing SQS queue provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.fromQueueArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct.

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.fromQueueArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `queueArn`<sup>Required</sup> <a name="queueArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.fromQueueArn.parameter.queueArn"></a>

- *Type:* string

queue ARN (i.e. arn:aws:sqs:us-east-2:444455556666:queue1).

---

##### `fromQueueAttributes` <a name="fromQueueAttributes" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.fromQueueAttributes"></a>

```typescript
import { Queue } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Queue.fromQueueAttributes(scope: Construct, id: string, attrs: QueueAttributes)
```

Import an existing queue.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.fromQueueAttributes.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.fromQueueAttributes.parameter.id"></a>

- *Type:* string

---

###### `attrs`<sup>Required</sup> <a name="attrs" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.fromQueueAttributes.parameter.attrs"></a>

- *Type:* aws-cdk-lib.aws_sqs.QueueAttributes

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.fifo">fifo</a></code> | <code>boolean</code> | Whether this queue is an Amazon SQS FIFO queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.queueArn">queueArn</a></code> | <code>string</code> | The ARN of this queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.queueName">queueName</a></code> | <code>string</code> | The name of this queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.queueUrl">queueUrl</a></code> | <code>string</code> | The URL of this queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.encryptionMasterKey">encryptionMasterKey</a></code> | <code>aws-cdk-lib.aws_kms.IKey</code> | If this queue is encrypted, this is the KMS key. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.encryptionType">encryptionType</a></code> | <code>aws-cdk-lib.aws_sqs.QueueEncryption</code> | Whether the contents of the queue are encrypted, and by what type of key. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.deadLetterQueue">deadLetterQueue</a></code> | <code>aws-cdk-lib.aws_sqs.DeadLetterQueue</code> | If this queue is configured with a dead-letter queue, this is the dead-letter queue settings. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `fifo`<sup>Required</sup> <a name="fifo" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.fifo"></a>

```typescript
public readonly fifo: boolean;
```

- *Type:* boolean

Whether this queue is an Amazon SQS FIFO queue.

If false, this is a standard queue.

---

##### `queueArn`<sup>Required</sup> <a name="queueArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.queueArn"></a>

```typescript
public readonly queueArn: string;
```

- *Type:* string

The ARN of this queue.

---

##### `queueName`<sup>Required</sup> <a name="queueName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.queueName"></a>

```typescript
public readonly queueName: string;
```

- *Type:* string

The name of this queue.

---

##### `queueUrl`<sup>Required</sup> <a name="queueUrl" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.queueUrl"></a>

```typescript
public readonly queueUrl: string;
```

- *Type:* string

The URL of this queue.

---

##### `encryptionMasterKey`<sup>Optional</sup> <a name="encryptionMasterKey" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.encryptionMasterKey"></a>

```typescript
public readonly encryptionMasterKey: IKey;
```

- *Type:* aws-cdk-lib.aws_kms.IKey

If this queue is encrypted, this is the KMS key.

---

##### `encryptionType`<sup>Optional</sup> <a name="encryptionType" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.encryptionType"></a>

```typescript
public readonly encryptionType: QueueEncryption;
```

- *Type:* aws-cdk-lib.aws_sqs.QueueEncryption

Whether the contents of the queue are encrypted, and by what type of key.

---

##### `deadLetterQueue`<sup>Optional</sup> <a name="deadLetterQueue" id="@renovosolutions/cdk-library-cloudwatch-alarms.Queue.property.deadLetterQueue"></a>

```typescript
public readonly deadLetterQueue: DeadLetterQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.DeadLetterQueue

If this queue is configured with a dead-letter queue, this is the dead-letter queue settings.

---


### S3Bucket4xxErrorsAlarm <a name="S3Bucket4xxErrorsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm"></a>

An alarm that monitors the 4xx errors for an S3 bucket.

This alarm is used to create a baseline for typical 4xx error
rates so that you can look into any abnormalities that might
indicate a setup issue.

The alarm is triggered when the 4xx error rate exceeds the % threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.Initializer"></a>

```typescript
import { S3Bucket4xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new S3Bucket4xxErrorsAlarm(scope: IConstruct, id: string, props: S3Bucket4xxErrorsAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps">S3Bucket4xxErrorsAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps">S3Bucket4xxErrorsAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.isConstruct"></a>

```typescript
import { S3Bucket4xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3Bucket4xxErrorsAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.isOwnedResource"></a>

```typescript
import { S3Bucket4xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3Bucket4xxErrorsAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.isResource"></a>

```typescript
import { S3Bucket4xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3Bucket4xxErrorsAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.fromAlarmArn"></a>

```typescript
import { S3Bucket4xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3Bucket4xxErrorsAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.fromAlarmName"></a>

```typescript
import { S3Bucket4xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3Bucket4xxErrorsAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### S3Bucket5xxErrorsAlarm <a name="S3Bucket5xxErrorsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm"></a>

An alarm that monitors the 5xx errors for an S3 bucket.

This alarm can help to detect if the application is
experiencing issues due to 5xx errors.

The alarm is triggered when the 5xx error rate exceeds the % threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.Initializer"></a>

```typescript
import { S3Bucket5xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new S3Bucket5xxErrorsAlarm(scope: IConstruct, id: string, props: S3Bucket5xxErrorsAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps">S3Bucket5xxErrorsAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps">S3Bucket5xxErrorsAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.isConstruct"></a>

```typescript
import { S3Bucket5xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3Bucket5xxErrorsAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.isOwnedResource"></a>

```typescript
import { S3Bucket5xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3Bucket5xxErrorsAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.isResource"></a>

```typescript
import { S3Bucket5xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3Bucket5xxErrorsAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.fromAlarmArn"></a>

```typescript
import { S3Bucket5xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3Bucket5xxErrorsAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.fromAlarmName"></a>

```typescript
import { S3Bucket5xxErrorsAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3Bucket5xxErrorsAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### S3RecommendedAlarms <a name="S3RecommendedAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms"></a>

A construct that creates the recommended alarms for an S3 bucket.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#S3](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#S3)

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.Initializer"></a>

```typescript
import { S3RecommendedAlarms } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new S3RecommendedAlarms(scope: Construct, id: string, props: S3RecommendedAlarmsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps">S3RecommendedAlarmsProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps">S3RecommendedAlarmsProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.isConstruct"></a>

```typescript
import { S3RecommendedAlarms } from '@renovosolutions/cdk-library-cloudwatch-alarms'

S3RecommendedAlarms.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.property.alarm4xxErrors">alarm4xxErrors</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm">S3Bucket4xxErrorsAlarm</a></code> | The 4xx errors alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.property.alarm5xxErrors">alarm5xxErrors</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm">S3Bucket5xxErrorsAlarm</a></code> | The 5xx errors alarm. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `alarm4xxErrors`<sup>Optional</sup> <a name="alarm4xxErrors" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.property.alarm4xxErrors"></a>

```typescript
public readonly alarm4xxErrors: S3Bucket4xxErrorsAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarm">S3Bucket4xxErrorsAlarm</a>

The 4xx errors alarm.

---

##### `alarm5xxErrors`<sup>Optional</sup> <a name="alarm5xxErrors" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarms.property.alarm5xxErrors"></a>

```typescript
public readonly alarm5xxErrors: S3Bucket5xxErrorsAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarm">S3Bucket5xxErrorsAlarm</a>

The 5xx errors alarm.

---


### SnsNumberOfMessagesPublishedAlarm <a name="SnsNumberOfMessagesPublishedAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm"></a>

An alarm that monitors the number of messages published to an SNS topic.

This alarm helps you proactively monitor and detect significant drops in
notification publishing. This helps you identify potential issues with
your application or business processes, so that you can take appropriate
actions to maintain the expected flow of notifications. You should create
this alarm if you expect your system to have a minimum traffic that it
is serving.

The alarm is triggered when the number of messages published to the topic
is less than the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.Initializer"></a>

```typescript
import { SnsNumberOfMessagesPublishedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SnsNumberOfMessagesPublishedAlarm(scope: IConstruct, id: string, props: SnsNumberOfMessagesPublishedAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps">SnsNumberOfMessagesPublishedAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps">SnsNumberOfMessagesPublishedAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.isConstruct"></a>

```typescript
import { SnsNumberOfMessagesPublishedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfMessagesPublishedAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.isOwnedResource"></a>

```typescript
import { SnsNumberOfMessagesPublishedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfMessagesPublishedAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.isResource"></a>

```typescript
import { SnsNumberOfMessagesPublishedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfMessagesPublishedAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.fromAlarmArn"></a>

```typescript
import { SnsNumberOfMessagesPublishedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfMessagesPublishedAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.fromAlarmName"></a>

```typescript
import { SnsNumberOfMessagesPublishedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfMessagesPublishedAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SnsNumberOfNotificationsDeliveredAlarm <a name="SnsNumberOfNotificationsDeliveredAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm"></a>

An alarm that monitors the number of notifications delivered by an SNS topic.

This alarm helps you detect a drop in the volume of messages delivered.
You should create this alarm if you expect your system to have a
minimum traffic that it is serving.

The alarm is triggered when the number of messages delivered by the topic
is less than the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsDeliveredAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SnsNumberOfNotificationsDeliveredAlarm(scope: IConstruct, id: string, props: SnsNumberOfNotificationsDeliveredAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps">SnsNumberOfNotificationsDeliveredAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps">SnsNumberOfNotificationsDeliveredAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.isConstruct"></a>

```typescript
import { SnsNumberOfNotificationsDeliveredAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsDeliveredAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.isOwnedResource"></a>

```typescript
import { SnsNumberOfNotificationsDeliveredAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsDeliveredAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.isResource"></a>

```typescript
import { SnsNumberOfNotificationsDeliveredAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsDeliveredAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.fromAlarmArn"></a>

```typescript
import { SnsNumberOfNotificationsDeliveredAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsDeliveredAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.fromAlarmName"></a>

```typescript
import { SnsNumberOfNotificationsDeliveredAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsDeliveredAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SnsNumberOfNotificationsFailedAlarm <a name="SnsNumberOfNotificationsFailedAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm"></a>

An alarm that monitors the number of notifications failed by an SNS topic.

This alarm helps you proactively find issues with the delivery of notifications
and take appropriate actions to address them.

The alarm is triggered when the number of messages failed by the topic
is greater than the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFailedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SnsNumberOfNotificationsFailedAlarm(scope: IConstruct, id: string, props: SnsNumberOfNotificationsFailedAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps">SnsNumberOfNotificationsFailedAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps">SnsNumberOfNotificationsFailedAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.isConstruct"></a>

```typescript
import { SnsNumberOfNotificationsFailedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFailedAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.isOwnedResource"></a>

```typescript
import { SnsNumberOfNotificationsFailedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFailedAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.isResource"></a>

```typescript
import { SnsNumberOfNotificationsFailedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFailedAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.fromAlarmArn"></a>

```typescript
import { SnsNumberOfNotificationsFailedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFailedAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.fromAlarmName"></a>

```typescript
import { SnsNumberOfNotificationsFailedAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFailedAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SnsNumberOfNotificationsFailedToRedriveToDlqAlarm <a name="SnsNumberOfNotificationsFailedToRedriveToDlqAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm"></a>

An alarm that monitors the number of notifications failed to redrive to the dead-letter queue.

The alarm is used to detect messages that couldn't be moved to a dead-letter
queue.

The alarm is triggered when the number of messages failed to redrive to the
dead-letter queue is greater than the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFailedToRedriveToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SnsNumberOfNotificationsFailedToRedriveToDlqAlarm(scope: IConstruct, id: string, props: SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps">SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps">SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isConstruct"></a>

```typescript
import { SnsNumberOfNotificationsFailedToRedriveToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isOwnedResource"></a>

```typescript
import { SnsNumberOfNotificationsFailedToRedriveToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isResource"></a>

```typescript
import { SnsNumberOfNotificationsFailedToRedriveToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmArn"></a>

```typescript
import { SnsNumberOfNotificationsFailedToRedriveToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmName"></a>

```typescript
import { SnsNumberOfNotificationsFailedToRedriveToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm <a name="SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm"></a>

An alarm that monitors the number of notifications filtered out due to invalid attributes.

The alarm is used to detect if the published messages are not valid or
if inappropriate filters have been applied to a subscriber.

The alarm is triggered when the number of messages filtered out due to
invalid attributes is greater than the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm(scope: IConstruct, id: string, props: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps">SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps">SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isConstruct"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isOwnedResource"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isResource"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmArn"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmName"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm <a name="SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm"></a>

An alarm that monitors the number of notifications filtered out due to invalid message body.

The alarm is used to detect if the published messages are not valid or
if inappropriate filters have been applied to a subscriber.

The alarm is triggered when the number of messages filtered out due to
invalid message body is greater than the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm(scope: IConstruct, id: string, props: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps">SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps">SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isConstruct"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isOwnedResource"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isResource"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmArn"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmName"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SnsNumberOfNotificationsRedrivenToDlqAlarm <a name="SnsNumberOfNotificationsRedrivenToDlqAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm"></a>

An alarm that monitors the number of notifications redriven to the dead-letter queue.

The alarm is used to detect messages that moved to a dead-letter
queue. We recommend that you create this alarm when SNS is coupled
with SQS, Lambda or Firehose.

The alarm is triggered when the number of messages redriven to the
dead-letter queue is greater than the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsRedrivenToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SnsNumberOfNotificationsRedrivenToDlqAlarm(scope: IConstruct, id: string, props: SnsNumberOfNotificationsRedrivenToDlqAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps">SnsNumberOfNotificationsRedrivenToDlqAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps">SnsNumberOfNotificationsRedrivenToDlqAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.isConstruct"></a>

```typescript
import { SnsNumberOfNotificationsRedrivenToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsRedrivenToDlqAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.isOwnedResource"></a>

```typescript
import { SnsNumberOfNotificationsRedrivenToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsRedrivenToDlqAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.isResource"></a>

```typescript
import { SnsNumberOfNotificationsRedrivenToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsRedrivenToDlqAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmArn"></a>

```typescript
import { SnsNumberOfNotificationsRedrivenToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmName"></a>

```typescript
import { SnsNumberOfNotificationsRedrivenToDlqAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SnsRecommendedAlarms <a name="SnsRecommendedAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms"></a>

A construct that creates recommended alarms for an SNS topic.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SNS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SNS)

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.Initializer"></a>

```typescript
import { SnsRecommendedAlarms } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SnsRecommendedAlarms(scope: Construct, id: string, props: SnsRecommendedAlarmsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps">SnsRecommendedAlarmsProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps">SnsRecommendedAlarmsProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.isConstruct"></a>

```typescript
import { SnsRecommendedAlarms } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SnsRecommendedAlarms.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfMessagesPublished">alarmNumberOfMessagesPublished</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm">SnsNumberOfMessagesPublishedAlarm</a></code> | The NumberOfMessagesPublished alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsDelivered">alarmNumberOfNotificationsDelivered</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm">SnsNumberOfNotificationsDeliveredAlarm</a></code> | The NumberOfNotificationsDelivered alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsFailed">alarmNumberOfNotificationsFailed</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm">SnsNumberOfNotificationsFailedAlarm</a></code> | The NumberOfNotificationsFailed alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsFailedToRedriveToDlq">alarmNumberOfNotificationsFailedToRedriveToDlq</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm">SnsNumberOfNotificationsFailedToRedriveToDlqAlarm</a></code> | The NumberOfNotificationsFailedToRedriveToDlq alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsFilteredOutInvalidAttributes">alarmNumberOfNotificationsFilteredOutInvalidAttributes</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm">SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm</a></code> | The NumberOfNotificationsFilteredOutInvalidAttributes alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsFilteredOutInvalidMessageBody">alarmNumberOfNotificationsFilteredOutInvalidMessageBody</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm">SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm</a></code> | The NumberOfNotificationsFilteredOutInvalidMessageBody alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsRedrivenToDlq">alarmNumberOfNotificationsRedrivenToDlq</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm">SnsNumberOfNotificationsRedrivenToDlqAlarm</a></code> | The NumberOfNotificationsRedrivenToDlq alarm. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `alarmNumberOfMessagesPublished`<sup>Optional</sup> <a name="alarmNumberOfMessagesPublished" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfMessagesPublished"></a>

```typescript
public readonly alarmNumberOfMessagesPublished: SnsNumberOfMessagesPublishedAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarm">SnsNumberOfMessagesPublishedAlarm</a>

The NumberOfMessagesPublished alarm.

---

##### `alarmNumberOfNotificationsDelivered`<sup>Optional</sup> <a name="alarmNumberOfNotificationsDelivered" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsDelivered"></a>

```typescript
public readonly alarmNumberOfNotificationsDelivered: SnsNumberOfNotificationsDeliveredAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarm">SnsNumberOfNotificationsDeliveredAlarm</a>

The NumberOfNotificationsDelivered alarm.

---

##### `alarmNumberOfNotificationsFailed`<sup>Optional</sup> <a name="alarmNumberOfNotificationsFailed" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsFailed"></a>

```typescript
public readonly alarmNumberOfNotificationsFailed: SnsNumberOfNotificationsFailedAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarm">SnsNumberOfNotificationsFailedAlarm</a>

The NumberOfNotificationsFailed alarm.

---

##### `alarmNumberOfNotificationsFailedToRedriveToDlq`<sup>Optional</sup> <a name="alarmNumberOfNotificationsFailedToRedriveToDlq" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsFailedToRedriveToDlq"></a>

```typescript
public readonly alarmNumberOfNotificationsFailedToRedriveToDlq: SnsNumberOfNotificationsFailedToRedriveToDlqAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarm">SnsNumberOfNotificationsFailedToRedriveToDlqAlarm</a>

The NumberOfNotificationsFailedToRedriveToDlq alarm.

---

##### `alarmNumberOfNotificationsFilteredOutInvalidAttributes`<sup>Optional</sup> <a name="alarmNumberOfNotificationsFilteredOutInvalidAttributes" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsFilteredOutInvalidAttributes"></a>

```typescript
public readonly alarmNumberOfNotificationsFilteredOutInvalidAttributes: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm">SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm</a>

The NumberOfNotificationsFilteredOutInvalidAttributes alarm.

---

##### `alarmNumberOfNotificationsFilteredOutInvalidMessageBody`<sup>Optional</sup> <a name="alarmNumberOfNotificationsFilteredOutInvalidMessageBody" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsFilteredOutInvalidMessageBody"></a>

```typescript
public readonly alarmNumberOfNotificationsFilteredOutInvalidMessageBody: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm">SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm</a>

The NumberOfNotificationsFilteredOutInvalidMessageBody alarm.

---

##### `alarmNumberOfNotificationsRedrivenToDlq`<sup>Optional</sup> <a name="alarmNumberOfNotificationsRedrivenToDlq" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarms.property.alarmNumberOfNotificationsRedrivenToDlq"></a>

```typescript
public readonly alarmNumberOfNotificationsRedrivenToDlq: SnsNumberOfNotificationsRedrivenToDlqAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarm">SnsNumberOfNotificationsRedrivenToDlqAlarm</a>

The NumberOfNotificationsRedrivenToDlq alarm.

---


### SqsApproximateAgeOfOldestMessageAlarm <a name="SqsApproximateAgeOfOldestMessageAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm"></a>

An alarm that watches the age of the oldest message in the queue.

This alarm is used to detect whether the age of the oldest message
in the QueueName queue is too high. High age can be an indication
that messages are not processed quickly enough or that there are
some poison-pill messages that are stuck in the queue and can't
be processed.

This alarm is triggered when the age of the oldest message in the
queue exceeds or is equal to the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.Initializer"></a>

```typescript
import { SqsApproximateAgeOfOldestMessageAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SqsApproximateAgeOfOldestMessageAlarm(scope: IConstruct, id: string, props: SqsApproximateAgeOfOldestMessageAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps">SqsApproximateAgeOfOldestMessageAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps">SqsApproximateAgeOfOldestMessageAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.isConstruct"></a>

```typescript
import { SqsApproximateAgeOfOldestMessageAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateAgeOfOldestMessageAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.isOwnedResource"></a>

```typescript
import { SqsApproximateAgeOfOldestMessageAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateAgeOfOldestMessageAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.isResource"></a>

```typescript
import { SqsApproximateAgeOfOldestMessageAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateAgeOfOldestMessageAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.fromAlarmArn"></a>

```typescript
import { SqsApproximateAgeOfOldestMessageAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateAgeOfOldestMessageAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.fromAlarmName"></a>

```typescript
import { SqsApproximateAgeOfOldestMessageAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateAgeOfOldestMessageAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SqsApproximateNumberOfMessagesNotVisibleAlarm <a name="SqsApproximateNumberOfMessagesNotVisibleAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm"></a>

An alarm that watches the number of messages that are in flight.

This alarm is used to detect a high number of in-flight messages
in the queue. If consumers do not delete messages within the
visibility timeout period, when the queue is polled, messages
reappear in the queue. For FIFO queues, there can be a maximum
of 20,000 in-flight messages. If you reach this quota, SQS returns
no error messages. A FIFO queue looks through the first 20k
messages to determine available message groups. This means that
if you have a backlog of messages in a single message group,
you cannot consume messages from other message groups that were
sent to the queue at a later time until you successfully
consume the messages from the backlog.

This alarm is triggered when the number of messages that are in
flight exceeds or is equal to the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.Initializer"></a>

```typescript
import { SqsApproximateNumberOfMessagesNotVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SqsApproximateNumberOfMessagesNotVisibleAlarm(scope: IConstruct, id: string, props: SqsApproximateNumberOfMessagesNotVisibleAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps">SqsApproximateNumberOfMessagesNotVisibleAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps">SqsApproximateNumberOfMessagesNotVisibleAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.isConstruct"></a>

```typescript
import { SqsApproximateNumberOfMessagesNotVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateNumberOfMessagesNotVisibleAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.isOwnedResource"></a>

```typescript
import { SqsApproximateNumberOfMessagesNotVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateNumberOfMessagesNotVisibleAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.isResource"></a>

```typescript
import { SqsApproximateNumberOfMessagesNotVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateNumberOfMessagesNotVisibleAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmArn"></a>

```typescript
import { SqsApproximateNumberOfMessagesNotVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmName"></a>

```typescript
import { SqsApproximateNumberOfMessagesNotVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SqsApproximateNumberOfMessagesVisibleAlarm <a name="SqsApproximateNumberOfMessagesVisibleAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm"></a>

An alarm that watches the number of messages that are visible in the queue.

This alarm is used to detect whether the message
count of the active queue is too high and consumers
are slow to process the messages or there are not
enough consumers to process them.

This alarm is triggered when the number of messages
that are visible in the queue exceeds or is equal to
the specified threshold.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.Initializer"></a>

```typescript
import { SqsApproximateNumberOfMessagesVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SqsApproximateNumberOfMessagesVisibleAlarm(scope: IConstruct, id: string, props: SqsApproximateNumberOfMessagesVisibleAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps">SqsApproximateNumberOfMessagesVisibleAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps">SqsApproximateNumberOfMessagesVisibleAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.isConstruct"></a>

```typescript
import { SqsApproximateNumberOfMessagesVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateNumberOfMessagesVisibleAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.isOwnedResource"></a>

```typescript
import { SqsApproximateNumberOfMessagesVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateNumberOfMessagesVisibleAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.isResource"></a>

```typescript
import { SqsApproximateNumberOfMessagesVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateNumberOfMessagesVisibleAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmArn"></a>

```typescript
import { SqsApproximateNumberOfMessagesVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmName"></a>

```typescript
import { SqsApproximateNumberOfMessagesVisibleAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SqsNumberOfMessagesSentAlarm <a name="SqsNumberOfMessagesSentAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm"></a>

An alarm that watches the number of messages that are sent.

This alarm is used to detect when a producer stops sending messages.

This alarm is triggered when the number of messages sent is less than
or equal to the specified threshold. By default, 0.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.Initializer"></a>

```typescript
import { SqsNumberOfMessagesSentAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SqsNumberOfMessagesSentAlarm(scope: IConstruct, id: string, props: SqsNumberOfMessagesSentAlarmProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.Initializer.parameter.scope">scope</a></code> | <code>constructs.IConstruct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps">SqsNumberOfMessagesSentAlarmProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.Initializer.parameter.scope"></a>

- *Type:* constructs.IConstruct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps">SqsNumberOfMessagesSentAlarmProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.addAlarmAction">addAlarmAction</a></code> | Trigger this action if the alarm fires. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.addInsufficientDataAction">addInsufficientDataAction</a></code> | Trigger this action if there is insufficient data to evaluate the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.addOkAction">addOkAction</a></code> | Trigger this action if the alarm returns from breaching state into ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.renderAlarmRule">renderAlarmRule</a></code> | AlarmRule indicating ALARM state for Alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.toAnnotation">toAnnotation</a></code> | Turn this alarm into a horizontal annotation. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addAlarmAction` <a name="addAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.addAlarmAction"></a>

```typescript
public addAlarmAction(actions: IAlarmAction): void
```

Trigger this action if the alarm fires.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.addAlarmAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addInsufficientDataAction` <a name="addInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.addInsufficientDataAction"></a>

```typescript
public addInsufficientDataAction(actions: IAlarmAction): void
```

Trigger this action if there is insufficient data to evaluate the alarm.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.addInsufficientDataAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `addOkAction` <a name="addOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.addOkAction"></a>

```typescript
public addOkAction(actions: IAlarmAction): void
```

Trigger this action if the alarm returns from breaching state into ok state.

Typically SnsAction or AutoScalingAction.

###### `actions`<sup>Required</sup> <a name="actions" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.addOkAction.parameter.actions"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction

---

##### `renderAlarmRule` <a name="renderAlarmRule" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.renderAlarmRule"></a>

```typescript
public renderAlarmRule(): string
```

AlarmRule indicating ALARM state for Alarm.

##### `toAnnotation` <a name="toAnnotation" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.toAnnotation"></a>

```typescript
public toAnnotation(): HorizontalAnnotation
```

Turn this alarm into a horizontal annotation.

This is useful if you want to represent an Alarm in a non-AlarmWidget.
An `AlarmWidget` can directly show an alarm, but it can only show a
single alarm and no other metrics. Instead, you can convert the alarm to
a HorizontalAnnotation and add it as an annotation to another graph.

This might be useful if:

- You want to show multiple alarms inside a single graph, for example if
  you have both a "small margin/long period" alarm as well as a
  "large margin/short period" alarm.

- You want to show an Alarm line in a graph with multiple metrics in it.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.fromAlarmArn">fromAlarmArn</a></code> | Import an existing CloudWatch alarm provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.fromAlarmName">fromAlarmName</a></code> | Import an existing CloudWatch alarm provided an Name. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.isConstruct"></a>

```typescript
import { SqsNumberOfMessagesSentAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsNumberOfMessagesSentAlarm.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.isOwnedResource"></a>

```typescript
import { SqsNumberOfMessagesSentAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsNumberOfMessagesSentAlarm.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.isResource"></a>

```typescript
import { SqsNumberOfMessagesSentAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsNumberOfMessagesSentAlarm.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromAlarmArn` <a name="fromAlarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.fromAlarmArn"></a>

```typescript
import { SqsNumberOfMessagesSentAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsNumberOfMessagesSentAlarm.fromAlarmArn(scope: Construct, id: string, alarmArn: string)
```

Import an existing CloudWatch alarm provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.fromAlarmArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.fromAlarmArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.fromAlarmArn.parameter.alarmArn"></a>

- *Type:* string

Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo).

---

##### `fromAlarmName` <a name="fromAlarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.fromAlarmName"></a>

```typescript
import { SqsNumberOfMessagesSentAlarm } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsNumberOfMessagesSentAlarm.fromAlarmName(scope: Construct, id: string, alarmName: string)
```

Import an existing CloudWatch alarm provided an Name.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.fromAlarmName.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct (usually `this`).

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.fromAlarmName.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.fromAlarmName.parameter.alarmName"></a>

- *Type:* string

Alarm Name.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.alarmArn">alarmArn</a></code> | <code>string</code> | ARN of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.alarmName">alarmName</a></code> | <code>string</code> | Name of this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.metric">metric</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IMetric</code> | The metric object this alarm was based on. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `alarmArn`<sup>Required</sup> <a name="alarmArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.alarmArn"></a>

```typescript
public readonly alarmArn: string;
```

- *Type:* string

ARN of this alarm.

---

##### `alarmName`<sup>Required</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string

Name of this alarm.

---

##### `metric`<sup>Required</sup> <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm.property.metric"></a>

```typescript
public readonly metric: IMetric;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IMetric

The metric object this alarm was based on.

---


### SqsRecommendedAlarms <a name="SqsRecommendedAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms"></a>

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.Initializer"></a>

```typescript
import { SqsRecommendedAlarms } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SqsRecommendedAlarms(scope: Construct, id: string, props: SqsRecommendedAlarmsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps">SqsRecommendedAlarmsProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps">SqsRecommendedAlarmsProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.isConstruct"></a>

```typescript
import { SqsRecommendedAlarms } from '@renovosolutions/cdk-library-cloudwatch-alarms'

SqsRecommendedAlarms.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.property.alarmApproximateAgeOfOldestMessage">alarmApproximateAgeOfOldestMessage</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm">SqsApproximateAgeOfOldestMessageAlarm</a></code> | The approximate age of oldest message alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.property.alarmApproximateNumberOfMessagesNotVisible">alarmApproximateNumberOfMessagesNotVisible</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm">SqsApproximateNumberOfMessagesNotVisibleAlarm</a></code> | The approximate number of messages not visible alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.property.alarmApproximateNumberOfMessagesVisible">alarmApproximateNumberOfMessagesVisible</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm">SqsApproximateNumberOfMessagesVisibleAlarm</a></code> | The approximate number of messages visible alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.property.alarmNumberOfMessagesSent">alarmNumberOfMessagesSent</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm">SqsNumberOfMessagesSentAlarm</a></code> | The number of messages sent alarm. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `alarmApproximateAgeOfOldestMessage`<sup>Optional</sup> <a name="alarmApproximateAgeOfOldestMessage" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.property.alarmApproximateAgeOfOldestMessage"></a>

```typescript
public readonly alarmApproximateAgeOfOldestMessage: SqsApproximateAgeOfOldestMessageAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarm">SqsApproximateAgeOfOldestMessageAlarm</a>

The approximate age of oldest message alarm.

---

##### `alarmApproximateNumberOfMessagesNotVisible`<sup>Optional</sup> <a name="alarmApproximateNumberOfMessagesNotVisible" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.property.alarmApproximateNumberOfMessagesNotVisible"></a>

```typescript
public readonly alarmApproximateNumberOfMessagesNotVisible: SqsApproximateNumberOfMessagesNotVisibleAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarm">SqsApproximateNumberOfMessagesNotVisibleAlarm</a>

The approximate number of messages not visible alarm.

---

##### `alarmApproximateNumberOfMessagesVisible`<sup>Optional</sup> <a name="alarmApproximateNumberOfMessagesVisible" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.property.alarmApproximateNumberOfMessagesVisible"></a>

```typescript
public readonly alarmApproximateNumberOfMessagesVisible: SqsApproximateNumberOfMessagesVisibleAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarm">SqsApproximateNumberOfMessagesVisibleAlarm</a>

The approximate number of messages visible alarm.

---

##### `alarmNumberOfMessagesSent`<sup>Optional</sup> <a name="alarmNumberOfMessagesSent" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarms.property.alarmNumberOfMessagesSent"></a>

```typescript
public readonly alarmNumberOfMessagesSent: SqsNumberOfMessagesSentAlarm;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarm">SqsNumberOfMessagesSentAlarm</a>

The number of messages sent alarm.

---


### Topic <a name="Topic" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic"></a>

An extension of the SNS topic construct that provides helper methods to create recommended alarms.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.Initializer"></a>

```typescript
import { Topic } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new Topic(scope: Construct, id: string, props?: TopicProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.Initializer.parameter.props">props</a></code> | <code>aws-cdk-lib.aws_sns.TopicProps</code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.Initializer.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_sns.TopicProps

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.addSubscription">addSubscription</a></code> | Subscribe some endpoint to this topic. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.addToResourcePolicy">addToResourcePolicy</a></code> | Adds a statement to the IAM resource policy associated with this topic. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.bindAsNotificationRuleTarget">bindAsNotificationRuleTarget</a></code> | Represents a notification target That allows SNS topic to associate with this rule target. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.grantPublish">grantPublish</a></code> | Grant topic publishing permissions to the given identity. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.grantSubscribe">grantSubscribe</a></code> | Grant topic subscribing permissions to the given identity. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metric">metric</a></code> | Return the given named metric for this Topic. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfMessagesPublished">metricNumberOfMessagesPublished</a></code> | The number of messages published to your Amazon SNS topics. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsDelivered">metricNumberOfNotificationsDelivered</a></code> | The number of messages successfully delivered from your Amazon SNS topics to subscribing endpoints. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFailed">metricNumberOfNotificationsFailed</a></code> | The number of messages that Amazon SNS failed to deliver. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFilteredOut">metricNumberOfNotificationsFilteredOut</a></code> | The number of messages that were rejected by subscription filter policies. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFilteredOutInvalidAttributes">metricNumberOfNotificationsFilteredOutInvalidAttributes</a></code> | The number of messages that were rejected by subscription filter policies because the messages' attributes are invalid. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFilteredOutNoMessageAttributes">metricNumberOfNotificationsFilteredOutNoMessageAttributes</a></code> | The number of messages that were rejected by subscription filter policies because the messages have no attributes. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricPublishSize">metricPublishSize</a></code> | Metric for the size of messages published through this topic. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricSMSMonthToDateSpentUSD">metricSMSMonthToDateSpentUSD</a></code> | The charges you have accrued since the start of the current calendar month for sending SMS messages. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricSMSSuccessRate">metricSMSSuccessRate</a></code> | The rate of successful SMS message deliveries. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.addLoggingConfig">addLoggingConfig</a></code> | Adds a delivery status logging configuration to the topic. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfMessagesPublished">alarmNumberOfMessagesPublished</a></code> | Creates an alarm for the NumberOfMessagesPublished metric. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsDelivered">alarmNumberOfNotificationsDelivered</a></code> | Creates an alarm for the NumberOfNotificationsDelivered metric. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFailed">alarmNumberOfNotificationsFailed</a></code> | Creates an alarm for the NumberOfNotificationsFailed metric. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFailedToRedriveToDlq">alarmNumberOfNotificationsFailedToRedriveToDlq</a></code> | Creates an alarm for the NumberOfNotificationsFailedToRedriveToDlq metric. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFilteredOutInvalidAttributes">alarmNumberOfNotificationsFilteredOutInvalidAttributes</a></code> | Creates an alarm for the NumberOfNotificationsFilteredOutInvalidAttributes metric. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFilteredOutInvalidMessageBody">alarmNumberOfNotificationsFilteredOutInvalidMessageBody</a></code> | Creates an alarm for the NumberOfNotificationsFilteredOutInvalidMessageBody metric. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsRedrivenToDlq">alarmNumberOfNotificationsRedrivenToDlq</a></code> | Creates an alarm for the NumberOfNotificationsRedrivenToDlq metric. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.applyRecommendedAlarms">applyRecommendedAlarms</a></code> | Creates recommended alarms for the SNS topic. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addSubscription` <a name="addSubscription" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.addSubscription"></a>

```typescript
public addSubscription(topicSubscription: ITopicSubscription): Subscription
```

Subscribe some endpoint to this topic.

###### `topicSubscription`<sup>Required</sup> <a name="topicSubscription" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.addSubscription.parameter.topicSubscription"></a>

- *Type:* aws-cdk-lib.aws_sns.ITopicSubscription

---

##### `addToResourcePolicy` <a name="addToResourcePolicy" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.addToResourcePolicy"></a>

```typescript
public addToResourcePolicy(statement: PolicyStatement): AddToResourcePolicyResult
```

Adds a statement to the IAM resource policy associated with this topic.

If this topic was created in this stack (`new Topic`), a topic policy
will be automatically created upon the first call to `addToResourcePolicy`. If
the topic is imported (`Topic.import`), then this is a no-op.

###### `statement`<sup>Required</sup> <a name="statement" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.addToResourcePolicy.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

---

##### `bindAsNotificationRuleTarget` <a name="bindAsNotificationRuleTarget" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.bindAsNotificationRuleTarget"></a>

```typescript
public bindAsNotificationRuleTarget(_scope: Construct): NotificationRuleTargetConfig
```

Represents a notification target That allows SNS topic to associate with this rule target.

###### `_scope`<sup>Required</sup> <a name="_scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.bindAsNotificationRuleTarget.parameter._scope"></a>

- *Type:* constructs.Construct

---

##### `grantPublish` <a name="grantPublish" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.grantPublish"></a>

```typescript
public grantPublish(grantee: IGrantable): Grant
```

Grant topic publishing permissions to the given identity.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.grantPublish.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `grantSubscribe` <a name="grantSubscribe" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.grantSubscribe"></a>

```typescript
public grantSubscribe(grantee: IGrantable): Grant
```

Grant topic subscribing permissions to the given identity.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.grantSubscribe.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

##### `metric` <a name="metric" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

Return the given named metric for this Topic.

###### `metricName`<sup>Required</sup> <a name="metricName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricNumberOfMessagesPublished` <a name="metricNumberOfMessagesPublished" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfMessagesPublished"></a>

```typescript
public metricNumberOfMessagesPublished(props?: MetricOptions): Metric
```

The number of messages published to your Amazon SNS topics.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfMessagesPublished.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricNumberOfNotificationsDelivered` <a name="metricNumberOfNotificationsDelivered" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsDelivered"></a>

```typescript
public metricNumberOfNotificationsDelivered(props?: MetricOptions): Metric
```

The number of messages successfully delivered from your Amazon SNS topics to subscribing endpoints.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsDelivered.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricNumberOfNotificationsFailed` <a name="metricNumberOfNotificationsFailed" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFailed"></a>

```typescript
public metricNumberOfNotificationsFailed(props?: MetricOptions): Metric
```

The number of messages that Amazon SNS failed to deliver.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFailed.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricNumberOfNotificationsFilteredOut` <a name="metricNumberOfNotificationsFilteredOut" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFilteredOut"></a>

```typescript
public metricNumberOfNotificationsFilteredOut(props?: MetricOptions): Metric
```

The number of messages that were rejected by subscription filter policies.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFilteredOut.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricNumberOfNotificationsFilteredOutInvalidAttributes` <a name="metricNumberOfNotificationsFilteredOutInvalidAttributes" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFilteredOutInvalidAttributes"></a>

```typescript
public metricNumberOfNotificationsFilteredOutInvalidAttributes(props?: MetricOptions): Metric
```

The number of messages that were rejected by subscription filter policies because the messages' attributes are invalid.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFilteredOutInvalidAttributes.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricNumberOfNotificationsFilteredOutNoMessageAttributes` <a name="metricNumberOfNotificationsFilteredOutNoMessageAttributes" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFilteredOutNoMessageAttributes"></a>

```typescript
public metricNumberOfNotificationsFilteredOutNoMessageAttributes(props?: MetricOptions): Metric
```

The number of messages that were rejected by subscription filter policies because the messages have no attributes.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricNumberOfNotificationsFilteredOutNoMessageAttributes.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricPublishSize` <a name="metricPublishSize" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricPublishSize"></a>

```typescript
public metricPublishSize(props?: MetricOptions): Metric
```

Metric for the size of messages published through this topic.

Average over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricPublishSize.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricSMSMonthToDateSpentUSD` <a name="metricSMSMonthToDateSpentUSD" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricSMSMonthToDateSpentUSD"></a>

```typescript
public metricSMSMonthToDateSpentUSD(props?: MetricOptions): Metric
```

The charges you have accrued since the start of the current calendar month for sending SMS messages.

Maximum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricSMSMonthToDateSpentUSD.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricSMSSuccessRate` <a name="metricSMSSuccessRate" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricSMSSuccessRate"></a>

```typescript
public metricSMSSuccessRate(props?: MetricOptions): Metric
```

The rate of successful SMS message deliveries.

Sum over 5 minutes

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.metricSMSSuccessRate.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `addLoggingConfig` <a name="addLoggingConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.addLoggingConfig"></a>

```typescript
public addLoggingConfig(config: LoggingConfig): void
```

Adds a delivery status logging configuration to the topic.

###### `config`<sup>Required</sup> <a name="config" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.addLoggingConfig.parameter.config"></a>

- *Type:* aws-cdk-lib.aws_sns.LoggingConfig

---

##### `alarmNumberOfMessagesPublished` <a name="alarmNumberOfMessagesPublished" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfMessagesPublished"></a>

```typescript
public alarmNumberOfMessagesPublished(props: SnsNumberOfMessagesPublishedAlarmConfig): SnsNumberOfMessagesPublishedAlarm
```

Creates an alarm for the NumberOfMessagesPublished metric.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfMessagesPublished.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig">SnsNumberOfMessagesPublishedAlarmConfig</a>

---

##### `alarmNumberOfNotificationsDelivered` <a name="alarmNumberOfNotificationsDelivered" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsDelivered"></a>

```typescript
public alarmNumberOfNotificationsDelivered(props: SnsNumberOfNotificationsDeliveredAlarmConfig): SnsNumberOfNotificationsDeliveredAlarm
```

Creates an alarm for the NumberOfNotificationsDelivered metric.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsDelivered.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig">SnsNumberOfNotificationsDeliveredAlarmConfig</a>

---

##### `alarmNumberOfNotificationsFailed` <a name="alarmNumberOfNotificationsFailed" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFailed"></a>

```typescript
public alarmNumberOfNotificationsFailed(props: SnsNumberOfNotificationsFailedAlarmConfig): SnsNumberOfNotificationsFailedAlarm
```

Creates an alarm for the NumberOfNotificationsFailed metric.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFailed.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig">SnsNumberOfNotificationsFailedAlarmConfig</a>

---

##### `alarmNumberOfNotificationsFailedToRedriveToDlq` <a name="alarmNumberOfNotificationsFailedToRedriveToDlq" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFailedToRedriveToDlq"></a>

```typescript
public alarmNumberOfNotificationsFailedToRedriveToDlq(props?: SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig): SnsNumberOfNotificationsFailedToRedriveToDlqAlarm
```

Creates an alarm for the NumberOfNotificationsFailedToRedriveToDlq metric.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFailedToRedriveToDlq.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig">SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig</a>

---

##### `alarmNumberOfNotificationsFilteredOutInvalidAttributes` <a name="alarmNumberOfNotificationsFilteredOutInvalidAttributes" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFilteredOutInvalidAttributes"></a>

```typescript
public alarmNumberOfNotificationsFilteredOutInvalidAttributes(props?: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig): SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm
```

Creates an alarm for the NumberOfNotificationsFilteredOutInvalidAttributes metric.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFilteredOutInvalidAttributes.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig">SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig</a>

---

##### `alarmNumberOfNotificationsFilteredOutInvalidMessageBody` <a name="alarmNumberOfNotificationsFilteredOutInvalidMessageBody" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFilteredOutInvalidMessageBody"></a>

```typescript
public alarmNumberOfNotificationsFilteredOutInvalidMessageBody(props?: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig): SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm
```

Creates an alarm for the NumberOfNotificationsFilteredOutInvalidMessageBody metric.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsFilteredOutInvalidMessageBody.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig">SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig</a>

---

##### `alarmNumberOfNotificationsRedrivenToDlq` <a name="alarmNumberOfNotificationsRedrivenToDlq" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsRedrivenToDlq"></a>

```typescript
public alarmNumberOfNotificationsRedrivenToDlq(props?: SnsNumberOfNotificationsRedrivenToDlqAlarmConfig): SnsNumberOfNotificationsRedrivenToDlqAlarm
```

Creates an alarm for the NumberOfNotificationsRedrivenToDlq metric.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.alarmNumberOfNotificationsRedrivenToDlq.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig">SnsNumberOfNotificationsRedrivenToDlqAlarmConfig</a>

---

##### `applyRecommendedAlarms` <a name="applyRecommendedAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.applyRecommendedAlarms"></a>

```typescript
public applyRecommendedAlarms(props: SnsRecommendedAlarmsConfig): SnsRecommendedAlarms
```

Creates recommended alarms for the SNS topic.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SNS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SNS)

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.applyRecommendedAlarms.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig">SnsRecommendedAlarmsConfig</a>

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.fromTopicArn">fromTopicArn</a></code> | Import an existing SNS topic provided an ARN. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.fromTopicAttributes">fromTopicAttributes</a></code> | Import an existing SNS topic provided a topic attributes. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.isConstruct"></a>

```typescript
import { Topic } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Topic.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.isOwnedResource"></a>

```typescript
import { Topic } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Topic.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.isResource"></a>

```typescript
import { Topic } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Topic.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromTopicArn` <a name="fromTopicArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.fromTopicArn"></a>

```typescript
import { Topic } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Topic.fromTopicArn(scope: Construct, id: string, topicArn: string)
```

Import an existing SNS topic provided an ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.fromTopicArn.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct.

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.fromTopicArn.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `topicArn`<sup>Required</sup> <a name="topicArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.fromTopicArn.parameter.topicArn"></a>

- *Type:* string

topic ARN (i.e. arn:aws:sns:us-east-2:444455556666:MyTopic).

---

##### `fromTopicAttributes` <a name="fromTopicAttributes" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.fromTopicAttributes"></a>

```typescript
import { Topic } from '@renovosolutions/cdk-library-cloudwatch-alarms'

Topic.fromTopicAttributes(scope: Construct, id: string, attrs: TopicAttributes)
```

Import an existing SNS topic provided a topic attributes.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.fromTopicAttributes.parameter.scope"></a>

- *Type:* constructs.Construct

The parent creating construct.

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.fromTopicAttributes.parameter.id"></a>

- *Type:* string

The construct's name.

---

###### `attrs`<sup>Required</sup> <a name="attrs" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.fromTopicAttributes.parameter.attrs"></a>

- *Type:* aws-cdk-lib.aws_sns.TopicAttributes

the attributes of the topic to import.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.contentBasedDeduplication">contentBasedDeduplication</a></code> | <code>boolean</code> | Enables content-based deduplication for FIFO topics. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.fifo">fifo</a></code> | <code>boolean</code> | Whether this topic is an Amazon SNS FIFO queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.topicArn">topicArn</a></code> | <code>string</code> | The ARN of the topic. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.topicName">topicName</a></code> | <code>string</code> | The name of the topic. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `contentBasedDeduplication`<sup>Required</sup> <a name="contentBasedDeduplication" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.contentBasedDeduplication"></a>

```typescript
public readonly contentBasedDeduplication: boolean;
```

- *Type:* boolean

Enables content-based deduplication for FIFO topics.

---

##### `fifo`<sup>Required</sup> <a name="fifo" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.fifo"></a>

```typescript
public readonly fifo: boolean;
```

- *Type:* boolean

Whether this topic is an Amazon SNS FIFO queue.

If false, this is a standard topic.

---

##### `topicArn`<sup>Required</sup> <a name="topicArn" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.topicArn"></a>

```typescript
public readonly topicArn: string;
```

- *Type:* string

The ARN of the topic.

---

##### `topicName`<sup>Required</sup> <a name="topicName" id="@renovosolutions/cdk-library-cloudwatch-alarms.Topic.property.topicName"></a>

```typescript
public readonly topicName: string;
```

- *Type:* string

The name of the topic.

---


## Structs <a name="Structs" id="Structs"></a>

### AlarmBaseProps <a name="AlarmBaseProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.AlarmBaseProps"></a>

The base properties for an alarm where default values are consistent across all alarms.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.AlarmBaseProps.Initializer"></a>

```typescript
import { AlarmBaseProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const alarmBaseProps: AlarmBaseProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.AlarmBaseProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.AlarmBaseProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.AlarmBaseProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.AlarmBaseProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.AlarmBaseProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.AlarmBaseProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.AlarmBaseProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.AlarmBaseProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

### LambdaAlarmBaseConfig <a name="LambdaAlarmBaseConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig"></a>

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.Initializer"></a>

```typescript
import { LambdaAlarmBaseConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaAlarmBaseConfig: LambdaAlarmBaseConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaAlarmBaseConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

### LambdaConcurrentExecutionsAlarmConfig <a name="LambdaConcurrentExecutionsAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig"></a>

Configuration for the ConcurrentExecutions alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.Initializer"></a>

```typescript
import { LambdaConcurrentExecutionsAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaConcurrentExecutionsAlarmConfig: LambdaConcurrentExecutionsAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statictis is compared. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to monitor if the concurrency of the function is approaching the Region-level concurrency limit of your account. A function starts to be throttled if it reaches the concurrency limit.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* lambdaFunction.functionName + ' - ConcurrentExecutions'

The alarm name.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 10

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 10

The number of periods over which data is compared to the specified threshold.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 900

The value against which the specified statictis is compared.

Set the threshold to about 90% of the concurrency quota set
for the account in the Region. By default, your account has
a concurrency quota of 1,000 across all functions in a Region.
However, you can check the quota of your account, as it can
be increased by contacting AWS support.

---

### LambdaConcurrentExecutionsAlarmProps <a name="LambdaConcurrentExecutionsAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps"></a>

The properties for the LambdaConcurrentExecutionsAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.Initializer"></a>

```typescript
import { LambdaConcurrentExecutionsAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaConcurrentExecutionsAlarmProps: LambdaConcurrentExecutionsAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statictis is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.lambdaFunction">lambdaFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function to monitor. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to monitor if the concurrency of the function is approaching the Region-level concurrency limit of your account. A function starts to be throttled if it reaches the concurrency limit.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* lambdaFunction.functionName + ' - ConcurrentExecutions'

The alarm name.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 10

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 10

The number of periods over which data is compared to the specified threshold.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 900

The value against which the specified statictis is compared.

Set the threshold to about 90% of the concurrency quota set
for the account in the Region. By default, your account has
a concurrency quota of 1,000 across all functions in a Region.
However, you can check the quota of your account, as it can
be increased by contacting AWS support.

---

##### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmProps.property.lambdaFunction"></a>

```typescript
public readonly lambdaFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function to monitor.

---

### LambdaDurationAlarmConfig <a name="LambdaDurationAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig"></a>

Configuration for the Duration alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.Initializer"></a>

```typescript
import { LambdaDurationAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaDurationAlarmConfig: LambdaDurationAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statictis is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statictis is compared.

The threshold for the duration depends on your application
and workloads and your performance requirements. For
high-performance requirements, set the threshold to a
shorter time to see if the function is meeting expectations.
You can also analyze historical data for duration metrics
to see the if the time taken matches the performance
expectation of the function, and then set the threshold to
a longer time than the historical average. Make sure to
set the threshold lower than the configured function
timeout.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm detects long duration times for processing an event by a Lambda function. Long durations might be because of changes in function code making the function take longer to execute, or the function's dependencies taking longer.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* lambdaFunction.functionName + ' - Duration'

The alarm name.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

### LambdaDurationAlarmProps <a name="LambdaDurationAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps"></a>

The properties for the LambdaDurationAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.Initializer"></a>

```typescript
import { LambdaDurationAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaDurationAlarmProps: LambdaDurationAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statictis is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.lambdaFunction">lambdaFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function to monitor. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statictis is compared.

The threshold for the duration depends on your application
and workloads and your performance requirements. For
high-performance requirements, set the threshold to a
shorter time to see if the function is meeting expectations.
You can also analyze historical data for duration metrics
to see the if the time taken matches the performance
expectation of the function, and then set the threshold to
a longer time than the historical average. Make sure to
set the threshold lower than the configured function
timeout.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm detects long duration times for processing an event by a Lambda function. Long durations might be because of changes in function code making the function take longer to execute, or the function's dependencies taking longer.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* lambdaFunction.functionName + ' - Duration'

The alarm name.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmProps.property.lambdaFunction"></a>

```typescript
public readonly lambdaFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function to monitor.

---

### LambdaErrorsAlarmConfig <a name="LambdaErrorsAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig"></a>

Configuration for the Errors alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.Initializer"></a>

```typescript
import { LambdaErrorsAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaErrorsAlarmConfig: LambdaErrorsAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistics is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistics is compared.

Set the threshold to a number greater than zero. The exact
value can depend on the tolerance for errors in your
application. Understand the criticality of the invocations
that the function is handling. For some applications, any
error might be unacceptable, while other applications might
allow for a certain margin of error.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm detects high error counts. Errors includes the exceptions thrown by the code as well as exceptions thrown by the Lambda runtime. You can check the logs related to the function to diagnose the issue.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* lambdaFunction.functionName + ' - Errors'

The alarm name.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 3

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 3

The number of periods over which data is compared to the specified threshold.

---

### LambdaErrorsAlarmProps <a name="LambdaErrorsAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps"></a>

The properties for the LambdaErrorsAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.Initializer"></a>

```typescript
import { LambdaErrorsAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaErrorsAlarmProps: LambdaErrorsAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistics is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.lambdaFunction">lambdaFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function to monitor. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistics is compared.

Set the threshold to a number greater than zero. The exact
value can depend on the tolerance for errors in your
application. Understand the criticality of the invocations
that the function is handling. For some applications, any
error might be unacceptable, while other applications might
allow for a certain margin of error.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm detects high error counts. Errors includes the exceptions thrown by the code as well as exceptions thrown by the Lambda runtime. You can check the logs related to the function to diagnose the issue.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* lambdaFunction.functionName + ' - Errors'

The alarm name.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 3

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 3

The number of periods over which data is compared to the specified threshold.

---

##### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmProps.property.lambdaFunction"></a>

```typescript
public readonly lambdaFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function to monitor.

---

### LambdaRecommendedAlarmsConfig <a name="LambdaRecommendedAlarmsConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig"></a>

Configuration for Lambda recommended alarms.

Default actions are overridden by the actions specified in the
individual alarm configurations.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.Initializer"></a>

```typescript
import { LambdaRecommendedAlarmsConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaRecommendedAlarmsConfig: LambdaRecommendedAlarmsConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.configDurationAlarm">configDurationAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig">LambdaDurationAlarmConfig</a></code> | The configuration for the Duration alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.configErrorsAlarm">configErrorsAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig">LambdaErrorsAlarmConfig</a></code> | The configuration for the Errors alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.configThrottlesAlarm">configThrottlesAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig">LambdaThrottlesAlarmConfig</a></code> | The configuration for the Throttles alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.configConcurrentExecutionsAlarm">configConcurrentExecutionsAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig">LambdaConcurrentExecutionsAlarmConfig</a></code> | The configuration for the ConcurrentExecutions alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.defaultAlarmAction">defaultAlarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.defaultInsufficientDataAction">defaultInsufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.defaultOkAction">defaultOkAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.excludeAlarms">excludeAlarms</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics">LambdaRecommendedAlarmsMetrics</a>[]</code> | Alarm metrics to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |

---

##### `configDurationAlarm`<sup>Required</sup> <a name="configDurationAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.configDurationAlarm"></a>

```typescript
public readonly configDurationAlarm: LambdaDurationAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig">LambdaDurationAlarmConfig</a>

The configuration for the Duration alarm.

---

##### `configErrorsAlarm`<sup>Required</sup> <a name="configErrorsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.configErrorsAlarm"></a>

```typescript
public readonly configErrorsAlarm: LambdaErrorsAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig">LambdaErrorsAlarmConfig</a>

The configuration for the Errors alarm.

---

##### `configThrottlesAlarm`<sup>Required</sup> <a name="configThrottlesAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.configThrottlesAlarm"></a>

```typescript
public readonly configThrottlesAlarm: LambdaThrottlesAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig">LambdaThrottlesAlarmConfig</a>

The configuration for the Throttles alarm.

---

##### `configConcurrentExecutionsAlarm`<sup>Optional</sup> <a name="configConcurrentExecutionsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.configConcurrentExecutionsAlarm"></a>

```typescript
public readonly configConcurrentExecutionsAlarm: LambdaConcurrentExecutionsAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig">LambdaConcurrentExecutionsAlarmConfig</a>

The configuration for the ConcurrentExecutions alarm.

---

##### `defaultAlarmAction`<sup>Optional</sup> <a name="defaultAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.defaultAlarmAction"></a>

```typescript
public readonly defaultAlarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm is triggered.

---

##### `defaultInsufficientDataAction`<sup>Optional</sup> <a name="defaultInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.defaultInsufficientDataAction"></a>

```typescript
public readonly defaultInsufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm has insufficient data.

---

##### `defaultOkAction`<sup>Optional</sup> <a name="defaultOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.defaultOkAction"></a>

```typescript
public readonly defaultOkAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm enters the ok state.

---

##### `excludeAlarms`<sup>Optional</sup> <a name="excludeAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.excludeAlarms"></a>

```typescript
public readonly excludeAlarms: LambdaRecommendedAlarmsMetrics[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics">LambdaRecommendedAlarmsMetrics</a>[]
- *Default:* None

Alarm metrics to exclude from the recommended alarms.

---

##### `excludeResources`<sup>Optional</sup> <a name="excludeResources" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]

The resources to exclude from the recommended alarms.

Use a resources id to exclude a specific resource.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

### LambdaRecommendedAlarmsProps <a name="LambdaRecommendedAlarmsProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps"></a>

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.Initializer"></a>

```typescript
import { LambdaRecommendedAlarmsProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaRecommendedAlarmsProps: LambdaRecommendedAlarmsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.configDurationAlarm">configDurationAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig">LambdaDurationAlarmConfig</a></code> | The configuration for the Duration alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.configErrorsAlarm">configErrorsAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig">LambdaErrorsAlarmConfig</a></code> | The configuration for the Errors alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.configThrottlesAlarm">configThrottlesAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig">LambdaThrottlesAlarmConfig</a></code> | The configuration for the Throttles alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.configConcurrentExecutionsAlarm">configConcurrentExecutionsAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig">LambdaConcurrentExecutionsAlarmConfig</a></code> | The configuration for the ConcurrentExecutions alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.defaultAlarmAction">defaultAlarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.defaultInsufficientDataAction">defaultInsufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.defaultOkAction">defaultOkAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.excludeAlarms">excludeAlarms</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics">LambdaRecommendedAlarmsMetrics</a>[]</code> | Alarm metrics to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.lambdaFunction">lambdaFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The lambda function to apply the recommended alarms. |

---

##### `configDurationAlarm`<sup>Required</sup> <a name="configDurationAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.configDurationAlarm"></a>

```typescript
public readonly configDurationAlarm: LambdaDurationAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaDurationAlarmConfig">LambdaDurationAlarmConfig</a>

The configuration for the Duration alarm.

---

##### `configErrorsAlarm`<sup>Required</sup> <a name="configErrorsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.configErrorsAlarm"></a>

```typescript
public readonly configErrorsAlarm: LambdaErrorsAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaErrorsAlarmConfig">LambdaErrorsAlarmConfig</a>

The configuration for the Errors alarm.

---

##### `configThrottlesAlarm`<sup>Required</sup> <a name="configThrottlesAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.configThrottlesAlarm"></a>

```typescript
public readonly configThrottlesAlarm: LambdaThrottlesAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig">LambdaThrottlesAlarmConfig</a>

The configuration for the Throttles alarm.

---

##### `configConcurrentExecutionsAlarm`<sup>Optional</sup> <a name="configConcurrentExecutionsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.configConcurrentExecutionsAlarm"></a>

```typescript
public readonly configConcurrentExecutionsAlarm: LambdaConcurrentExecutionsAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaConcurrentExecutionsAlarmConfig">LambdaConcurrentExecutionsAlarmConfig</a>

The configuration for the ConcurrentExecutions alarm.

---

##### `defaultAlarmAction`<sup>Optional</sup> <a name="defaultAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.defaultAlarmAction"></a>

```typescript
public readonly defaultAlarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm is triggered.

---

##### `defaultInsufficientDataAction`<sup>Optional</sup> <a name="defaultInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.defaultInsufficientDataAction"></a>

```typescript
public readonly defaultInsufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm has insufficient data.

---

##### `defaultOkAction`<sup>Optional</sup> <a name="defaultOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.defaultOkAction"></a>

```typescript
public readonly defaultOkAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm enters the ok state.

---

##### `excludeAlarms`<sup>Optional</sup> <a name="excludeAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.excludeAlarms"></a>

```typescript
public readonly excludeAlarms: LambdaRecommendedAlarmsMetrics[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics">LambdaRecommendedAlarmsMetrics</a>[]
- *Default:* None

Alarm metrics to exclude from the recommended alarms.

---

##### `excludeResources`<sup>Optional</sup> <a name="excludeResources" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]

The resources to exclude from the recommended alarms.

Use a resources id to exclude a specific resource.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsProps.property.lambdaFunction"></a>

```typescript
public readonly lambdaFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The lambda function to apply the recommended alarms.

---

### LambdaThrottlesAlarmConfig <a name="LambdaThrottlesAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig"></a>

Configuration for the Throttles alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.Initializer"></a>

```typescript
import { LambdaThrottlesAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaThrottlesAlarmConfig: LambdaThrottlesAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statictis is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statictis is compared.

Set the threshold to a number greater than zero. The exact value
of the threshold can depend on the tolerance of the application.
Set the threshold according to its usage and scaling requirements
of the function.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm detects a high number of throttled invocation requests. Throttling occurs when there is no concurrency is available for scale up. There are several approaches to resolve this issue. 1) Request a concurrency increase from AWS Support in this Region. 2) Identify performance issues in the function to improve the speed of processing and therefore improve throughput. 3) Increase the batch size of the function, so that more messages are processed by each function invocation.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* lambdaFunction.functionName + ' - Throttles'

The alarm name.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

### LambdaThrottlesAlarmProps <a name="LambdaThrottlesAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps"></a>

The properties for the LambdaThrottlesAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.Initializer"></a>

```typescript
import { LambdaThrottlesAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const lambdaThrottlesAlarmProps: LambdaThrottlesAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statictis is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.lambdaFunction">lambdaFunction</a></code> | <code>aws-cdk-lib.aws_lambda.IFunction</code> | The Lambda function to monitor. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statictis is compared.

Set the threshold to a number greater than zero. The exact value
of the threshold can depend on the tolerance of the application.
Set the threshold according to its usage and scaling requirements
of the function.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm detects a high number of throttled invocation requests. Throttling occurs when there is no concurrency is available for scale up. There are several approaches to resolve this issue. 1) Request a concurrency increase from AWS Support in this Region. 2) Identify performance issues in the function to improve the speed of processing and therefore improve throughput. 3) Increase the batch size of the function, so that more messages are processed by each function invocation.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* lambdaFunction.functionName + ' - Throttles'

The alarm name.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `lambdaFunction`<sup>Required</sup> <a name="lambdaFunction" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaThrottlesAlarmProps.property.lambdaFunction"></a>

```typescript
public readonly lambdaFunction: IFunction;
```

- *Type:* aws-cdk-lib.aws_lambda.IFunction

The Lambda function to monitor.

---

### S3Bucket4xxErrorsAlarmConfig <a name="S3Bucket4xxErrorsAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig"></a>

Configuration for the 4xx errors alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.Initializer"></a>

```typescript
import { S3Bucket4xxErrorsAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const s3Bucket4xxErrorsAlarmConfig: S3Bucket4xxErrorsAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The alarm description. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0.05

The value against which the specified statistic is compared.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps us report the total number of 4xx error status codes that are made in response to client requests. 403 error codes might indicate an incorrect IAM policy, and 404 error codes might indicate mis-behaving client application, for example. Enabling S3 server access logging on a temporary basis will help you to pinpoint the issue's origin using the fields HTTP status and Error Code. To understand more about the error code, see Error Responses (https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html).

The alarm description.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* bucket.bucketName + ' - 4xxErrors'

The alarm name.

---

### S3Bucket4xxErrorsAlarmProps <a name="S3Bucket4xxErrorsAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps"></a>

Properties for the S3Bucket4xxErrorsAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.Initializer"></a>

```typescript
import { S3Bucket4xxErrorsAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const s3Bucket4xxErrorsAlarmProps: S3Bucket4xxErrorsAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The alarm description. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | The S3 bucket to monitor. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0.05

The value against which the specified statistic is compared.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps us report the total number of 4xx error status codes that are made in response to client requests. 403 error codes might indicate an incorrect IAM policy, and 404 error codes might indicate mis-behaving client application, for example. Enabling S3 server access logging on a temporary basis will help you to pinpoint the issue's origin using the fields HTTP status and Error Code. To understand more about the error code, see Error Responses (https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html).

The alarm description.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* bucket.bucketName + ' - 4xxErrors'

The alarm name.

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmProps.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

The S3 bucket to monitor.

---

### S3Bucket5xxErrorsAlarmConfig <a name="S3Bucket5xxErrorsAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig"></a>

Configuration for the 5xx errors alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.Initializer"></a>

```typescript
import { S3Bucket5xxErrorsAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const s3Bucket5xxErrorsAlarmConfig: S3Bucket5xxErrorsAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The alarm description. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0.05

The value against which the specified statistic is compared.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps you detect a high number of server-side errors. These errors indicate that a client made a request that the server couldn’t complete. This can help you correlate the issue your application is facing because of S3. For more information to help you efficiently handle or reduce errors, see Optimizing performance design patterns (https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html#optimizing-performance-timeouts-retries). Errors might also be caused by an the issue with S3, check AWS service health dashboard for the status of Amazon S3 in your Region.

The alarm description.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* bucket.bucketName + ' - 5xxErrors'

The alarm name.

---

### S3Bucket5xxErrorsAlarmProps <a name="S3Bucket5xxErrorsAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps"></a>

Properties for the S3Bucket5xxErrorsAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.Initializer"></a>

```typescript
import { S3Bucket5xxErrorsAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const s3Bucket5xxErrorsAlarmProps: S3Bucket5xxErrorsAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The alarm description. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | The S3 bucket to monitor. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0.05

The value against which the specified statistic is compared.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps you detect a high number of server-side errors. These errors indicate that a client made a request that the server couldn’t complete. This can help you correlate the issue your application is facing because of S3. For more information to help you efficiently handle or reduce errors, see Optimizing performance design patterns (https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html#optimizing-performance-timeouts-retries). Errors might also be caused by an the issue with S3, check AWS service health dashboard for the status of Amazon S3 in your Region.

The alarm description.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* bucket.bucketName + ' - 5xxErrors'

The alarm name.

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmProps.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

The S3 bucket to monitor.

---

### S3BucketHttpErrorsAlarmConfig <a name="S3BucketHttpErrorsAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig"></a>

The optional configuration for the 4xx and 5xx error alarms for an S3 bucket.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.Initializer"></a>

```typescript
import { S3BucketHttpErrorsAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const s3BucketHttpErrorsAlarmConfig: S3BucketHttpErrorsAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3BucketHttpErrorsAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0.05

The value against which the specified statistic is compared.

---

### S3RecommendedAlarmsConfig <a name="S3RecommendedAlarmsConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig"></a>

Configurations for the recommended alarms for an S3 bucket.

Default actions are overridden by the actions specified in the
individual alarm configurations.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.Initializer"></a>

```typescript
import { S3RecommendedAlarmsConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const s3RecommendedAlarmsConfig: S3RecommendedAlarmsConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.config4xxErrorsAlarm">config4xxErrorsAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig">S3Bucket4xxErrorsAlarmConfig</a></code> | The configuration for the 4xx errors alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.config5xxErrorsAlarm">config5xxErrorsAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig">S3Bucket5xxErrorsAlarmConfig</a></code> | The configuration for the 5xx errors alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.defaultAlarmAction">defaultAlarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.defaultInsufficientDataAction">defaultInsufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.defaultOkAction">defaultOkAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.excludeAlarms">excludeAlarms</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsMetrics">S3RecommendedAlarmsMetrics</a>[]</code> | Alarm metrics to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |

---

##### `config4xxErrorsAlarm`<sup>Optional</sup> <a name="config4xxErrorsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.config4xxErrorsAlarm"></a>

```typescript
public readonly config4xxErrorsAlarm: S3Bucket4xxErrorsAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig">S3Bucket4xxErrorsAlarmConfig</a>

The configuration for the 4xx errors alarm.

---

##### `config5xxErrorsAlarm`<sup>Optional</sup> <a name="config5xxErrorsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.config5xxErrorsAlarm"></a>

```typescript
public readonly config5xxErrorsAlarm: S3Bucket5xxErrorsAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig">S3Bucket5xxErrorsAlarmConfig</a>

The configuration for the 5xx errors alarm.

---

##### `defaultAlarmAction`<sup>Optional</sup> <a name="defaultAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.defaultAlarmAction"></a>

```typescript
public readonly defaultAlarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm is triggered.

---

##### `defaultInsufficientDataAction`<sup>Optional</sup> <a name="defaultInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.defaultInsufficientDataAction"></a>

```typescript
public readonly defaultInsufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm has insufficient data.

---

##### `defaultOkAction`<sup>Optional</sup> <a name="defaultOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.defaultOkAction"></a>

```typescript
public readonly defaultOkAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm enters the ok state.

---

##### `excludeAlarms`<sup>Optional</sup> <a name="excludeAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.excludeAlarms"></a>

```typescript
public readonly excludeAlarms: S3RecommendedAlarmsMetrics[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsMetrics">S3RecommendedAlarmsMetrics</a>[]
- *Default:* None

Alarm metrics to exclude from the recommended alarms.

---

##### `excludeResources`<sup>Optional</sup> <a name="excludeResources" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]

The resources to exclude from the recommended alarms.

Use a resources id to exclude a specific resource.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

### S3RecommendedAlarmsProps <a name="S3RecommendedAlarmsProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps"></a>

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.Initializer"></a>

```typescript
import { S3RecommendedAlarmsProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const s3RecommendedAlarmsProps: S3RecommendedAlarmsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.config4xxErrorsAlarm">config4xxErrorsAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig">S3Bucket4xxErrorsAlarmConfig</a></code> | The configuration for the 4xx errors alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.config5xxErrorsAlarm">config5xxErrorsAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig">S3Bucket5xxErrorsAlarmConfig</a></code> | The configuration for the 5xx errors alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.defaultAlarmAction">defaultAlarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.defaultInsufficientDataAction">defaultInsufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.defaultOkAction">defaultOkAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.excludeAlarms">excludeAlarms</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsMetrics">S3RecommendedAlarmsMetrics</a>[]</code> | Alarm metrics to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.bucket">bucket</a></code> | <code>aws-cdk-lib.aws_s3.IBucket</code> | The S3 bucket to apply the recommended alarms to. |

---

##### `config4xxErrorsAlarm`<sup>Optional</sup> <a name="config4xxErrorsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.config4xxErrorsAlarm"></a>

```typescript
public readonly config4xxErrorsAlarm: S3Bucket4xxErrorsAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket4xxErrorsAlarmConfig">S3Bucket4xxErrorsAlarmConfig</a>

The configuration for the 4xx errors alarm.

---

##### `config5xxErrorsAlarm`<sup>Optional</sup> <a name="config5xxErrorsAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.config5xxErrorsAlarm"></a>

```typescript
public readonly config5xxErrorsAlarm: S3Bucket5xxErrorsAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3Bucket5xxErrorsAlarmConfig">S3Bucket5xxErrorsAlarmConfig</a>

The configuration for the 5xx errors alarm.

---

##### `defaultAlarmAction`<sup>Optional</sup> <a name="defaultAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.defaultAlarmAction"></a>

```typescript
public readonly defaultAlarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm is triggered.

---

##### `defaultInsufficientDataAction`<sup>Optional</sup> <a name="defaultInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.defaultInsufficientDataAction"></a>

```typescript
public readonly defaultInsufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm has insufficient data.

---

##### `defaultOkAction`<sup>Optional</sup> <a name="defaultOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.defaultOkAction"></a>

```typescript
public readonly defaultOkAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm enters the ok state.

---

##### `excludeAlarms`<sup>Optional</sup> <a name="excludeAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.excludeAlarms"></a>

```typescript
public readonly excludeAlarms: S3RecommendedAlarmsMetrics[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsMetrics">S3RecommendedAlarmsMetrics</a>[]
- *Default:* None

Alarm metrics to exclude from the recommended alarms.

---

##### `excludeResources`<sup>Optional</sup> <a name="excludeResources" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]

The resources to exclude from the recommended alarms.

Use a resources id to exclude a specific resource.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `bucket`<sup>Required</sup> <a name="bucket" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsProps.property.bucket"></a>

```typescript
public readonly bucket: IBucket;
```

- *Type:* aws-cdk-lib.aws_s3.IBucket

The S3 bucket to apply the recommended alarms to.

---

### SnsAlarmBaseConfig <a name="SnsAlarmBaseConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig"></a>

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.Initializer"></a>

```typescript
import { SnsAlarmBaseConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsAlarmBaseConfig: SnsAlarmBaseConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsAlarmBaseConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

### SnsNumberOfMessagesPublishedAlarmConfig <a name="SnsNumberOfMessagesPublishedAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig"></a>

Configuration for the NumberOfMessagesPublished alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.Initializer"></a>

```typescript
import { SnsNumberOfMessagesPublishedAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfMessagesPublishedAlarmConfig: SnsNumberOfMessagesPublishedAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

The number of messages published should be in line with the expected number of
published messages for your application. You can also analyze the historical data,
trends and traffic to find the right threshold.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm can detect when the number of SNS messages published is too low. For troubleshooting, check why the publishers are sending less traffic.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfMessagesPublished'

The alarm name.

---

### SnsNumberOfMessagesPublishedAlarmProps <a name="SnsNumberOfMessagesPublishedAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps"></a>

Properties for the SnsNumberOfMessagesPublishedAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.Initializer"></a>

```typescript
import { SnsNumberOfMessagesPublishedAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfMessagesPublishedAlarmProps: SnsNumberOfMessagesPublishedAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.topic">topic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The SNS topic for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

The number of messages published should be in line with the expected number of
published messages for your application. You can also analyze the historical data,
trends and traffic to find the right threshold.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm can detect when the number of SNS messages published is too low. For troubleshooting, check why the publishers are sending less traffic.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfMessagesPublished'

The alarm name.

---

##### `topic`<sup>Required</sup> <a name="topic" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmProps.property.topic"></a>

```typescript
public readonly topic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The SNS topic for which to create the alarm.

---

### SnsNumberOfNotificationsDeliveredAlarmConfig <a name="SnsNumberOfNotificationsDeliveredAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig"></a>

Configuration for the NumberOfNotificationsDelivered alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsDeliveredAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsDeliveredAlarmConfig: SnsNumberOfNotificationsDeliveredAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

The number of messages delivered should be in line with the expected number of
messages produced and the number of consumers. You can also analyze the historical
data, trends and traffic to find the right threshold.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm can detect when the number of SNS messages delivered is too low. This could be because of unintentional unsubscribing of an endpoint, or because of an SNS event that causes messages to experience delay.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsDelivered'

The alarm name.

---

### SnsNumberOfNotificationsDeliveredAlarmProps <a name="SnsNumberOfNotificationsDeliveredAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps"></a>

Properties for the SnsNumberOfNotificationsDeliveredAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsDeliveredAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsDeliveredAlarmProps: SnsNumberOfNotificationsDeliveredAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.topic">topic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The SNS topic for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

The number of messages delivered should be in line with the expected number of
messages produced and the number of consumers. You can also analyze the historical
data, trends and traffic to find the right threshold.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm can detect when the number of SNS messages delivered is too low. This could be because of unintentional unsubscribing of an endpoint, or because of an SNS event that causes messages to experience delay.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsDelivered'

The alarm name.

---

##### `topic`<sup>Required</sup> <a name="topic" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmProps.property.topic"></a>

```typescript
public readonly topic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The SNS topic for which to create the alarm.

---

### SnsNumberOfNotificationsFailedAlarmConfig <a name="SnsNumberOfNotificationsFailedAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig"></a>

Configuration for the NumberOfNotificationsFailed alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFailedAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsFailedAlarmConfig: SnsNumberOfNotificationsFailedAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

The recommended threshold value for this alarm is highly dependent on the
impact of failed notifications. Review the SLAs provided to your end users,
fault tolerance and criticality of notifications and analyze historical data,
and then select a threshold accordingly. The number of notifications failed
should be 0 for topics that have only SQS, Lambda or Firehose subscriptions.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm can detect when the number of failed SNS messages is too high. To troubleshoot failed notifications, enable logging to CloudWatch Logs. Checking the logs can help you find which subscribers are failing, as well as the status codes they are returning.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsFailed'

The alarm name.

---

### SnsNumberOfNotificationsFailedAlarmProps <a name="SnsNumberOfNotificationsFailedAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps"></a>

Properties for the SnsNumberOfNotificationsFailedAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFailedAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsFailedAlarmProps: SnsNumberOfNotificationsFailedAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.topic">topic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The SNS topic for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

The recommended threshold value for this alarm is highly dependent on the
impact of failed notifications. Review the SLAs provided to your end users,
fault tolerance and criticality of notifications and analyze historical data,
and then select a threshold accordingly. The number of notifications failed
should be 0 for topics that have only SQS, Lambda or Firehose subscriptions.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm can detect when the number of failed SNS messages is too high. To troubleshoot failed notifications, enable logging to CloudWatch Logs. Checking the logs can help you find which subscribers are failing, as well as the status codes they are returning.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsFailed'

The alarm name.

---

##### `topic`<sup>Required</sup> <a name="topic" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmProps.property.topic"></a>

```typescript
public readonly topic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The SNS topic for which to create the alarm.

---

### SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig <a name="SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig"></a>

Configuration for the NumberOfNotificationsFailedToRedriveToDlq alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig: SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to monitor messages that couldn't be moved to a dead-letter queue. Check whether your dead-letter queue exists and that it's configured correctly. Also, verify that SNS has permissions to access the dead-letter queue. Refer to the dead-letter queue documentation (https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html) to learn more.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsFailedToRedriveToDlq'

The alarm name.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0

The value against which the specified statistic is compared.

It's almost always a mistake if messages can't be moved to the dead-letter queue.
The recommendation for the threshold is 0, meaning all messages that fail processing
must be able to reach the dead-letter queue when the queue has been configured.

---

### SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps <a name="SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps"></a>

Properties for the SnsNumberOfNotificationsFailedToRedriveToDlqAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsFailedToRedriveToDlqAlarmProps: SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.topic">topic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The SNS topic for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to monitor messages that couldn't be moved to a dead-letter queue. Check whether your dead-letter queue exists and that it's configured correctly. Also, verify that SNS has permissions to access the dead-letter queue. Refer to the dead-letter queue documentation (https://docs.aws.amazon.com/sns/latest/dg/sns-dead-letter-queues.html) to learn more.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsFailedToRedriveToDlq'

The alarm name.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0

The value against which the specified statistic is compared.

It's almost always a mistake if messages can't be moved to the dead-letter queue.
The recommendation for the threshold is 0, meaning all messages that fail processing
must be able to reach the dead-letter queue when the queue has been configured.

---

##### `topic`<sup>Required</sup> <a name="topic" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmProps.property.topic"></a>

```typescript
public readonly topic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The SNS topic for which to create the alarm.

---

### SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig <a name="SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig"></a>

Configuration for the NumberOfNotificationsFilteredOutInvalidAttributes alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to monitor and resolve potential problems with the publisher or subscribers. Check if a publisher is publishing messages with invalid attributes or if an inappropriate filter is applied to a subscriber. You can also analyze CloudWatch Logs to help find the root cause of the issue.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsFilteredOut-InvalidAttributes'

The alarm name.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0

The value against which the specified statistic is compared.

Invalid attributes are almost always a mistake by the publisher. We recommend
to set the threshold to 0 because invalid attributes are not expected in a
healthy system.

---

### SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps <a name="SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps"></a>

Properties for the SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.topic">topic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The SNS topic for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to monitor and resolve potential problems with the publisher or subscribers. Check if a publisher is publishing messages with invalid attributes or if an inappropriate filter is applied to a subscriber. You can also analyze CloudWatch Logs to help find the root cause of the issue.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsFilteredOut-InvalidAttributes'

The alarm name.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0

The value against which the specified statistic is compared.

Invalid attributes are almost always a mistake by the publisher. We recommend
to set the threshold to 0 because invalid attributes are not expected in a
healthy system.

---

##### `topic`<sup>Required</sup> <a name="topic" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmProps.property.topic"></a>

```typescript
public readonly topic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The SNS topic for which to create the alarm.

---

### SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig <a name="SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig"></a>

Configuration for the NumberOfNotificationsFilteredOutInvalidMessageBody alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to monitor and resolve potential problems with the publisher or subscribers. Check if a publisher is publishing messages with invalid message bodies, or if an inappropriate filter is applied to a subscriber. You can also analyze CloudWatch Logs to help find the root cause of the issue.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsFilteredOut-InvalidMessageBody'

The alarm name.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0

The value against which the specified statistic is compared.

Invalid message bodies are almost always a mistake by the publisher.
We recommend to set the threshold to 0 because invalid message bodies
are not expected in a healthy system.

---

### SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps <a name="SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps"></a>

Properties for the SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.topic">topic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The SNS topic for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to monitor and resolve potential problems with the publisher or subscribers. Check if a publisher is publishing messages with invalid message bodies, or if an inappropriate filter is applied to a subscriber. You can also analyze CloudWatch Logs to help find the root cause of the issue.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsFilteredOut-InvalidMessageBody'

The alarm name.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0

The value against which the specified statistic is compared.

Invalid message bodies are almost always a mistake by the publisher.
We recommend to set the threshold to 0 because invalid message bodies
are not expected in a healthy system.

---

##### `topic`<sup>Required</sup> <a name="topic" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmProps.property.topic"></a>

```typescript
public readonly topic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The SNS topic for which to create the alarm.

---

### SnsNumberOfNotificationsRedrivenToDlqAlarmConfig <a name="SnsNumberOfNotificationsRedrivenToDlqAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig"></a>

Configuration for the NumberOfNotificationsRedrivenToDlq alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsRedrivenToDlqAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsRedrivenToDlqAlarmConfig: SnsNumberOfNotificationsRedrivenToDlqAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to monitor the number of messages that are moved to a dead-letter queue.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsRedrivenToDlq'

The alarm name.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0

The value against which the specified statistic is compared.

In a healthy system of any subscriber type, messages should not be moved
to the dead-letter queue. We recommend that you be notified if any messages
land in the queue, so that you can identify and address the root cause,
and potentially redrive the messages in the dead-letter queue to prevent
data loss.

---

### SnsNumberOfNotificationsRedrivenToDlqAlarmProps <a name="SnsNumberOfNotificationsRedrivenToDlqAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps"></a>

Properties for the SnsNumberOfNotificationsRedrivenToDlqAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.Initializer"></a>

```typescript
import { SnsNumberOfNotificationsRedrivenToDlqAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsNumberOfNotificationsRedrivenToDlqAlarmProps: SnsNumberOfNotificationsRedrivenToDlqAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.topic">topic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The SNS topic for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 5

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 5

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to monitor the number of messages that are moved to a dead-letter queue.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* topic.topicName + ' - NumberOfNotificationsRedrivenToDlq'

The alarm name.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0

The value against which the specified statistic is compared.

In a healthy system of any subscriber type, messages should not be moved
to the dead-letter queue. We recommend that you be notified if any messages
land in the queue, so that you can identify and address the root cause,
and potentially redrive the messages in the dead-letter queue to prevent
data loss.

---

##### `topic`<sup>Required</sup> <a name="topic" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmProps.property.topic"></a>

```typescript
public readonly topic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The SNS topic for which to create the alarm.

---

### SnsRecommendedAlarmsConfig <a name="SnsRecommendedAlarmsConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig"></a>

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.Initializer"></a>

```typescript
import { SnsRecommendedAlarmsConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsRecommendedAlarmsConfig: SnsRecommendedAlarmsConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfMessagesPublishedAlarm">configNumberOfMessagesPublishedAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig">SnsNumberOfMessagesPublishedAlarmConfig</a></code> | The configuration for the NumberOfMessagesPublished alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsDeliveredAlarm">configNumberOfNotificationsDeliveredAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig">SnsNumberOfNotificationsDeliveredAlarmConfig</a></code> | The configuration for the NumberOfNotificationsDelivered alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsFailedAlarm">configNumberOfNotificationsFailedAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig">SnsNumberOfNotificationsFailedAlarmConfig</a></code> | The configuration for the NumberOfNotificationsFailed alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsFailedToRedriveToDlqAlarm">configNumberOfNotificationsFailedToRedriveToDlqAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig">SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig</a></code> | The configuration for the NumberOfNotificationsFailedToRedriveToDlq alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsFilteredOutInvalidAttributesAlarm">configNumberOfNotificationsFilteredOutInvalidAttributesAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig">SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig</a></code> | The configuration for the NumberOfNotificationsFilteredOutInvalidAttributes alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm">configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig">SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig</a></code> | The configuration for the NumberOfNotificationsFilteredOutInvalidMessageBody alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsRedrivenToDlqAlarm">configNumberOfNotificationsRedrivenToDlqAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig">SnsNumberOfNotificationsRedrivenToDlqAlarmConfig</a></code> | The configuration for the NumberOfNotificationsRedrivenToDlq alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.defaultAlarmAction">defaultAlarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.defaultInsufficientDataAction">defaultInsufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.defaultOkAction">defaultOkAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.excludeAlarms">excludeAlarms</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics">SnsRecommendedAlarmsMetrics</a>[]</code> | Alarm metrics to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |

---

##### `configNumberOfMessagesPublishedAlarm`<sup>Required</sup> <a name="configNumberOfMessagesPublishedAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfMessagesPublishedAlarm"></a>

```typescript
public readonly configNumberOfMessagesPublishedAlarm: SnsNumberOfMessagesPublishedAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig">SnsNumberOfMessagesPublishedAlarmConfig</a>

The configuration for the NumberOfMessagesPublished alarm.

---

##### `configNumberOfNotificationsDeliveredAlarm`<sup>Required</sup> <a name="configNumberOfNotificationsDeliveredAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsDeliveredAlarm"></a>

```typescript
public readonly configNumberOfNotificationsDeliveredAlarm: SnsNumberOfNotificationsDeliveredAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig">SnsNumberOfNotificationsDeliveredAlarmConfig</a>

The configuration for the NumberOfNotificationsDelivered alarm.

---

##### `configNumberOfNotificationsFailedAlarm`<sup>Required</sup> <a name="configNumberOfNotificationsFailedAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsFailedAlarm"></a>

```typescript
public readonly configNumberOfNotificationsFailedAlarm: SnsNumberOfNotificationsFailedAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig">SnsNumberOfNotificationsFailedAlarmConfig</a>

The configuration for the NumberOfNotificationsFailed alarm.

---

##### `configNumberOfNotificationsFailedToRedriveToDlqAlarm`<sup>Optional</sup> <a name="configNumberOfNotificationsFailedToRedriveToDlqAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsFailedToRedriveToDlqAlarm"></a>

```typescript
public readonly configNumberOfNotificationsFailedToRedriveToDlqAlarm: SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig">SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig</a>

The configuration for the NumberOfNotificationsFailedToRedriveToDlq alarm.

---

##### `configNumberOfNotificationsFilteredOutInvalidAttributesAlarm`<sup>Optional</sup> <a name="configNumberOfNotificationsFilteredOutInvalidAttributesAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsFilteredOutInvalidAttributesAlarm"></a>

```typescript
public readonly configNumberOfNotificationsFilteredOutInvalidAttributesAlarm: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig">SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig</a>

The configuration for the NumberOfNotificationsFilteredOutInvalidAttributes alarm.

---

##### `configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm`<sup>Optional</sup> <a name="configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm"></a>

```typescript
public readonly configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig">SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig</a>

The configuration for the NumberOfNotificationsFilteredOutInvalidMessageBody alarm.

---

##### `configNumberOfNotificationsRedrivenToDlqAlarm`<sup>Optional</sup> <a name="configNumberOfNotificationsRedrivenToDlqAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.configNumberOfNotificationsRedrivenToDlqAlarm"></a>

```typescript
public readonly configNumberOfNotificationsRedrivenToDlqAlarm: SnsNumberOfNotificationsRedrivenToDlqAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig">SnsNumberOfNotificationsRedrivenToDlqAlarmConfig</a>

The configuration for the NumberOfNotificationsRedrivenToDlq alarm.

---

##### `defaultAlarmAction`<sup>Optional</sup> <a name="defaultAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.defaultAlarmAction"></a>

```typescript
public readonly defaultAlarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm is triggered.

---

##### `defaultInsufficientDataAction`<sup>Optional</sup> <a name="defaultInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.defaultInsufficientDataAction"></a>

```typescript
public readonly defaultInsufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm has insufficient data.

---

##### `defaultOkAction`<sup>Optional</sup> <a name="defaultOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.defaultOkAction"></a>

```typescript
public readonly defaultOkAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm enters the ok state.

---

##### `excludeAlarms`<sup>Optional</sup> <a name="excludeAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.excludeAlarms"></a>

```typescript
public readonly excludeAlarms: SnsRecommendedAlarmsMetrics[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics">SnsRecommendedAlarmsMetrics</a>[]
- *Default:* None

Alarm metrics to exclude from the recommended alarms.

---

##### `excludeResources`<sup>Optional</sup> <a name="excludeResources" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]

The resources to exclude from the recommended alarms.

Use a resources id to exclude a specific resource.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

### SnsRecommendedAlarmsProps <a name="SnsRecommendedAlarmsProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps"></a>

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.Initializer"></a>

```typescript
import { SnsRecommendedAlarmsProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const snsRecommendedAlarmsProps: SnsRecommendedAlarmsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfMessagesPublishedAlarm">configNumberOfMessagesPublishedAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig">SnsNumberOfMessagesPublishedAlarmConfig</a></code> | The configuration for the NumberOfMessagesPublished alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsDeliveredAlarm">configNumberOfNotificationsDeliveredAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig">SnsNumberOfNotificationsDeliveredAlarmConfig</a></code> | The configuration for the NumberOfNotificationsDelivered alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsFailedAlarm">configNumberOfNotificationsFailedAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig">SnsNumberOfNotificationsFailedAlarmConfig</a></code> | The configuration for the NumberOfNotificationsFailed alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsFailedToRedriveToDlqAlarm">configNumberOfNotificationsFailedToRedriveToDlqAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig">SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig</a></code> | The configuration for the NumberOfNotificationsFailedToRedriveToDlq alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsFilteredOutInvalidAttributesAlarm">configNumberOfNotificationsFilteredOutInvalidAttributesAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig">SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig</a></code> | The configuration for the NumberOfNotificationsFilteredOutInvalidAttributes alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm">configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig">SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig</a></code> | The configuration for the NumberOfNotificationsFilteredOutInvalidMessageBody alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsRedrivenToDlqAlarm">configNumberOfNotificationsRedrivenToDlqAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig">SnsNumberOfNotificationsRedrivenToDlqAlarmConfig</a></code> | The configuration for the NumberOfNotificationsRedrivenToDlq alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.defaultAlarmAction">defaultAlarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.defaultInsufficientDataAction">defaultInsufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.defaultOkAction">defaultOkAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.excludeAlarms">excludeAlarms</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics">SnsRecommendedAlarmsMetrics</a>[]</code> | Alarm metrics to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.topic">topic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | The SNS topic for which to create the alarms. |

---

##### `configNumberOfMessagesPublishedAlarm`<sup>Required</sup> <a name="configNumberOfMessagesPublishedAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfMessagesPublishedAlarm"></a>

```typescript
public readonly configNumberOfMessagesPublishedAlarm: SnsNumberOfMessagesPublishedAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfMessagesPublishedAlarmConfig">SnsNumberOfMessagesPublishedAlarmConfig</a>

The configuration for the NumberOfMessagesPublished alarm.

---

##### `configNumberOfNotificationsDeliveredAlarm`<sup>Required</sup> <a name="configNumberOfNotificationsDeliveredAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsDeliveredAlarm"></a>

```typescript
public readonly configNumberOfNotificationsDeliveredAlarm: SnsNumberOfNotificationsDeliveredAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsDeliveredAlarmConfig">SnsNumberOfNotificationsDeliveredAlarmConfig</a>

The configuration for the NumberOfNotificationsDelivered alarm.

---

##### `configNumberOfNotificationsFailedAlarm`<sup>Required</sup> <a name="configNumberOfNotificationsFailedAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsFailedAlarm"></a>

```typescript
public readonly configNumberOfNotificationsFailedAlarm: SnsNumberOfNotificationsFailedAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedAlarmConfig">SnsNumberOfNotificationsFailedAlarmConfig</a>

The configuration for the NumberOfNotificationsFailed alarm.

---

##### `configNumberOfNotificationsFailedToRedriveToDlqAlarm`<sup>Optional</sup> <a name="configNumberOfNotificationsFailedToRedriveToDlqAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsFailedToRedriveToDlqAlarm"></a>

```typescript
public readonly configNumberOfNotificationsFailedToRedriveToDlqAlarm: SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig">SnsNumberOfNotificationsFailedToRedriveToDlqAlarmConfig</a>

The configuration for the NumberOfNotificationsFailedToRedriveToDlq alarm.

---

##### `configNumberOfNotificationsFilteredOutInvalidAttributesAlarm`<sup>Optional</sup> <a name="configNumberOfNotificationsFilteredOutInvalidAttributesAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsFilteredOutInvalidAttributesAlarm"></a>

```typescript
public readonly configNumberOfNotificationsFilteredOutInvalidAttributesAlarm: SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig">SnsNumberOfNotificationsFilteredOutInvalidAttributesAlarmConfig</a>

The configuration for the NumberOfNotificationsFilteredOutInvalidAttributes alarm.

---

##### `configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm`<sup>Optional</sup> <a name="configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm"></a>

```typescript
public readonly configNumberOfNotificationsFilteredOutInvalidMessageBodyAlarm: SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig">SnsNumberOfNotificationsFilteredOutInvalidMessageBodyAlarmConfig</a>

The configuration for the NumberOfNotificationsFilteredOutInvalidMessageBody alarm.

---

##### `configNumberOfNotificationsRedrivenToDlqAlarm`<sup>Optional</sup> <a name="configNumberOfNotificationsRedrivenToDlqAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.configNumberOfNotificationsRedrivenToDlqAlarm"></a>

```typescript
public readonly configNumberOfNotificationsRedrivenToDlqAlarm: SnsNumberOfNotificationsRedrivenToDlqAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsNumberOfNotificationsRedrivenToDlqAlarmConfig">SnsNumberOfNotificationsRedrivenToDlqAlarmConfig</a>

The configuration for the NumberOfNotificationsRedrivenToDlq alarm.

---

##### `defaultAlarmAction`<sup>Optional</sup> <a name="defaultAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.defaultAlarmAction"></a>

```typescript
public readonly defaultAlarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm is triggered.

---

##### `defaultInsufficientDataAction`<sup>Optional</sup> <a name="defaultInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.defaultInsufficientDataAction"></a>

```typescript
public readonly defaultInsufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm has insufficient data.

---

##### `defaultOkAction`<sup>Optional</sup> <a name="defaultOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.defaultOkAction"></a>

```typescript
public readonly defaultOkAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm enters the ok state.

---

##### `excludeAlarms`<sup>Optional</sup> <a name="excludeAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.excludeAlarms"></a>

```typescript
public readonly excludeAlarms: SnsRecommendedAlarmsMetrics[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics">SnsRecommendedAlarmsMetrics</a>[]
- *Default:* None

Alarm metrics to exclude from the recommended alarms.

---

##### `excludeResources`<sup>Optional</sup> <a name="excludeResources" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]

The resources to exclude from the recommended alarms.

Use a resources id to exclude a specific resource.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `topic`<sup>Required</sup> <a name="topic" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsProps.property.topic"></a>

```typescript
public readonly topic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

The SNS topic for which to create the alarms.

---

### SqsAlarmBaseConfig <a name="SqsAlarmBaseConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig"></a>

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.Initializer"></a>

```typescript
import { SqsAlarmBaseConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsAlarmBaseConfig: SqsAlarmBaseConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsAlarmBaseConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

### SqsApproximateAgeOfOldestMessageAlarmConfig <a name="SqsApproximateAgeOfOldestMessageAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig"></a>

Configuration for the ApproximateAgeOfOldestMessage alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.Initializer"></a>

```typescript
import { SqsApproximateAgeOfOldestMessageAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsApproximateAgeOfOldestMessageAlarmConfig: SqsApproximateAgeOfOldestMessageAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

The recommended threshold value for this alarm is highly dependent on the expected message
processing time. You can use historical data to calculate the average message processing time,
and then set the threshold to 50% higher than the maximum expected SQS message processing
time by queue consumers.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm watches the age of the oldest message in the queue. You can use this alarm to monitor if your consumers are processing SQS messages at the desired speed. Consider increasing the consumer count or consumer throughput to reduce message age. This metric can be used in combination with ApproximateNumberOfMessagesVisible to determine how big the queue backlog is and how quickly messages are being processed. To prevent messages from being deleted before processed, consider configuring the dead-letter queue to sideline potential poison pill messages.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* queue.queueName + ' - ApproximateAgeOfOldestMessage'

The alarm name.

---

### SqsApproximateAgeOfOldestMessageAlarmProps <a name="SqsApproximateAgeOfOldestMessageAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps"></a>

Properties for the SqsApproximateAgeOfOldestMessageAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.Initializer"></a>

```typescript
import { SqsApproximateAgeOfOldestMessageAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsApproximateAgeOfOldestMessageAlarmProps: SqsApproximateAgeOfOldestMessageAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.queue">queue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The SQS queue for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

The recommended threshold value for this alarm is highly dependent on the expected message
processing time. You can use historical data to calculate the average message processing time,
and then set the threshold to 50% higher than the maximum expected SQS message processing
time by queue consumers.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm watches the age of the oldest message in the queue. You can use this alarm to monitor if your consumers are processing SQS messages at the desired speed. Consider increasing the consumer count or consumer throughput to reduce message age. This metric can be used in combination with ApproximateNumberOfMessagesVisible to determine how big the queue backlog is and how quickly messages are being processed. To prevent messages from being deleted before processed, consider configuring the dead-letter queue to sideline potential poison pill messages.

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* queue.queueName + ' - ApproximateAgeOfOldestMessage'

The alarm name.

---

##### `queue`<sup>Required</sup> <a name="queue" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmProps.property.queue"></a>

```typescript
public readonly queue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue

The SQS queue for which to create the alarm.

---

### SqsApproximateNumberOfMessagesNotVisibleAlarmConfig <a name="SqsApproximateNumberOfMessagesNotVisibleAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig"></a>

Configuration for the ApproximateNumberOfMessagesNotVisible alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.Initializer"></a>

```typescript
import { SqsApproximateNumberOfMessagesNotVisibleAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsApproximateNumberOfMessagesNotVisibleAlarmConfig: SqsApproximateNumberOfMessagesNotVisibleAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

The recommended threshold value for this alarm is highly dependent on the expected number
of messages in flight. You can use historical data to calculate the maximum expected
number of messages in flight and set the threshold to 50% over this value. If consumers
of the queue are processing but not deleting messages from the queue, this number will
suddenly increase.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to detect a high number of in-flight messages with respect to QueueName. For troubleshooting, check message backlog decreasing (https://repost.aws/knowledge-center/sqs-message-backlog).

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* queue.queueName + ' - ApproximateNumberOfMessagesNotVisible'

The alarm name.

---

### SqsApproximateNumberOfMessagesNotVisibleAlarmProps <a name="SqsApproximateNumberOfMessagesNotVisibleAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps"></a>

Properties for the SqsApproximateNumberOfMessagesNotVisibleAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.Initializer"></a>

```typescript
import { SqsApproximateNumberOfMessagesNotVisibleAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsApproximateNumberOfMessagesNotVisibleAlarmProps: SqsApproximateNumberOfMessagesNotVisibleAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.queue">queue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The SQS queue for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

The recommended threshold value for this alarm is highly dependent on the expected number
of messages in flight. You can use historical data to calculate the maximum expected
number of messages in flight and set the threshold to 50% over this value. If consumers
of the queue are processing but not deleting messages from the queue, this number will
suddenly increase.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to detect a high number of in-flight messages with respect to QueueName. For troubleshooting, check message backlog decreasing (https://repost.aws/knowledge-center/sqs-message-backlog).

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* queue.queueName + ' - ApproximateNumberOfMessagesNotVisible'

The alarm name.

---

##### `queue`<sup>Required</sup> <a name="queue" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmProps.property.queue"></a>

```typescript
public readonly queue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue

The SQS queue for which to create the alarm.

---

### SqsApproximateNumberOfMessagesVisibleAlarmConfig <a name="SqsApproximateNumberOfMessagesVisibleAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig"></a>

Configuration for the ApproximateNumberOfMessagesVisible alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.Initializer"></a>

```typescript
import { SqsApproximateNumberOfMessagesVisibleAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsApproximateNumberOfMessagesVisibleAlarmConfig: SqsApproximateNumberOfMessagesVisibleAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

An unexpectedly high number of messages visible indicates that messages are not being
processed by a consumer at the expected rate. You should consider historical data when
you set this threshold.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to detect a high number of in-flight messages with respect to QueueName. For troubleshooting, check message backlog decreasing (https://repost.aws/knowledge-center/sqs-message-backlog).

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* queue.queueName + ' - ApproximateNumberOfMessagesVisible'

The alarm name.

---

### SqsApproximateNumberOfMessagesVisibleAlarmProps <a name="SqsApproximateNumberOfMessagesVisibleAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps"></a>

Properties for the SqsApproximateNumberOfMessagesVisibleAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.Initializer"></a>

```typescript
import { SqsApproximateNumberOfMessagesVisibleAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsApproximateNumberOfMessagesVisibleAlarmProps: SqsApproximateNumberOfMessagesVisibleAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.queue">queue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The SQS queue for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `threshold`<sup>Required</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number

The value against which the specified statistic is compared.

An unexpectedly high number of messages visible indicates that messages are not being
processed by a consumer at the expected rate. You should consider historical data when
you set this threshold.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to detect a high number of in-flight messages with respect to QueueName. For troubleshooting, check message backlog decreasing (https://repost.aws/knowledge-center/sqs-message-backlog).

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* queue.queueName + ' - ApproximateNumberOfMessagesVisible'

The alarm name.

---

##### `queue`<sup>Required</sup> <a name="queue" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmProps.property.queue"></a>

```typescript
public readonly queue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue

The SQS queue for which to create the alarm.

---

### SqsNumberOfMessagesSentAlarmConfig <a name="SqsNumberOfMessagesSentAlarmConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig"></a>

Configuration for the NumberOfMessagesSent alarm.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.Initializer"></a>

```typescript
import { SqsNumberOfMessagesSentAlarmConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsNumberOfMessagesSentAlarmConfig: SqsNumberOfMessagesSentAlarmConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to detect a high number of in-flight messages with respect to QueueName. For troubleshooting, check message backlog decreasing (https://repost.aws/knowledge-center/sqs-message-backlog).

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* queue.queueName + ' - NumberOfMessagesSent'

The alarm name.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0

The value against which the specified statistic is compared.

If the number of messages sent is 0, the producer is not sending any messages.
If this queue has a low TPS, increase the number of EvaluationPeriods accordingly.

---

### SqsNumberOfMessagesSentAlarmProps <a name="SqsNumberOfMessagesSentAlarmProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps"></a>

Properties for the SqsNumberOfMessagesSentAlarm construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.Initializer"></a>

```typescript
import { SqsNumberOfMessagesSentAlarmProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsNumberOfMessagesSentAlarmProps: SqsNumberOfMessagesSentAlarmProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.alarmAction">alarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.insufficientDataAction">insufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.okAction">okAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.datapointsToAlarm">datapointsToAlarm</a></code> | <code>number</code> | The number of data points that must be breaching to trigger the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.evaluationPeriods">evaluationPeriods</a></code> | <code>number</code> | The number of periods over which data is compared to the specified threshold. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.period">period</a></code> | <code>aws-cdk-lib.Duration</code> | The period over which the specified statistic is applied. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.alarmDescription">alarmDescription</a></code> | <code>string</code> | The description of the alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.alarmName">alarmName</a></code> | <code>string</code> | The alarm name. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.threshold">threshold</a></code> | <code>number</code> | The value against which the specified statistic is compared. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.queue">queue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The SQS queue for which to create the alarm. |

---

##### `alarmAction`<sup>Optional</sup> <a name="alarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.alarmAction"></a>

```typescript
public readonly alarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm is triggered.

---

##### `insufficientDataAction`<sup>Optional</sup> <a name="insufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.insufficientDataAction"></a>

```typescript
public readonly insufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm has insufficient data.

---

##### `okAction`<sup>Optional</sup> <a name="okAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.okAction"></a>

```typescript
public readonly okAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The action to take when an alarm enters the ok state.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `datapointsToAlarm`<sup>Optional</sup> <a name="datapointsToAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.datapointsToAlarm"></a>

```typescript
public readonly datapointsToAlarm: number;
```

- *Type:* number
- *Default:* 15

The number of data points that must be breaching to trigger the alarm.

---

##### `evaluationPeriods`<sup>Optional</sup> <a name="evaluationPeriods" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.evaluationPeriods"></a>

```typescript
public readonly evaluationPeriods: number;
```

- *Type:* number
- *Default:* 15

The number of periods over which data is compared to the specified threshold.

---

##### `period`<sup>Optional</sup> <a name="period" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.period"></a>

```typescript
public readonly period: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(1)

The period over which the specified statistic is applied.

---

##### `alarmDescription`<sup>Optional</sup> <a name="alarmDescription" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.alarmDescription"></a>

```typescript
public readonly alarmDescription: string;
```

- *Type:* string
- *Default:* This alarm helps to detect a high number of in-flight messages with respect to QueueName. For troubleshooting, check message backlog decreasing (https://repost.aws/knowledge-center/sqs-message-backlog).

The description of the alarm.

---

##### `alarmName`<sup>Optional</sup> <a name="alarmName" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.alarmName"></a>

```typescript
public readonly alarmName: string;
```

- *Type:* string
- *Default:* queue.queueName + ' - NumberOfMessagesSent'

The alarm name.

---

##### `threshold`<sup>Optional</sup> <a name="threshold" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.threshold"></a>

```typescript
public readonly threshold: number;
```

- *Type:* number
- *Default:* 0

The value against which the specified statistic is compared.

If the number of messages sent is 0, the producer is not sending any messages.
If this queue has a low TPS, increase the number of EvaluationPeriods accordingly.

---

##### `queue`<sup>Required</sup> <a name="queue" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmProps.property.queue"></a>

```typescript
public readonly queue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue

The SQS queue for which to create the alarm.

---

### SqsRecommendedAlarmsConfig <a name="SqsRecommendedAlarmsConfig" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig"></a>

Configuration for the recommended alarms for an SQS queue.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.Initializer"></a>

```typescript
import { SqsRecommendedAlarmsConfig } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsRecommendedAlarmsConfig: SqsRecommendedAlarmsConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.configApproximateAgeOfOldestMessageAlarm">configApproximateAgeOfOldestMessageAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig">SqsApproximateAgeOfOldestMessageAlarmConfig</a></code> | The configuration for the approximate age of oldest message alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.configApproximateNumberOfMessagesNotVisibleAlarm">configApproximateNumberOfMessagesNotVisibleAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig">SqsApproximateNumberOfMessagesNotVisibleAlarmConfig</a></code> | The configuration for the approximate number of messages not visible alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.configApproximateNumberOfMessagesVisibleAlarm">configApproximateNumberOfMessagesVisibleAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig">SqsApproximateNumberOfMessagesVisibleAlarmConfig</a></code> | The configuration for the approximate number of messages visible alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.configNumberOfMessagesSentAlarm">configNumberOfMessagesSentAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig">SqsNumberOfMessagesSentAlarmConfig</a></code> | The configuration for the number of messages sent alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.defaultAlarmAction">defaultAlarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.defaultInsufficientDataAction">defaultInsufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.defaultOkAction">defaultOkAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.excludeAlarms">excludeAlarms</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics">SqsRecommendedAlarmsMetrics</a>[]</code> | Alarm metrics to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |

---

##### `configApproximateAgeOfOldestMessageAlarm`<sup>Required</sup> <a name="configApproximateAgeOfOldestMessageAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.configApproximateAgeOfOldestMessageAlarm"></a>

```typescript
public readonly configApproximateAgeOfOldestMessageAlarm: SqsApproximateAgeOfOldestMessageAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig">SqsApproximateAgeOfOldestMessageAlarmConfig</a>

The configuration for the approximate age of oldest message alarm.

---

##### `configApproximateNumberOfMessagesNotVisibleAlarm`<sup>Required</sup> <a name="configApproximateNumberOfMessagesNotVisibleAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.configApproximateNumberOfMessagesNotVisibleAlarm"></a>

```typescript
public readonly configApproximateNumberOfMessagesNotVisibleAlarm: SqsApproximateNumberOfMessagesNotVisibleAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig">SqsApproximateNumberOfMessagesNotVisibleAlarmConfig</a>

The configuration for the approximate number of messages not visible alarm.

---

##### `configApproximateNumberOfMessagesVisibleAlarm`<sup>Required</sup> <a name="configApproximateNumberOfMessagesVisibleAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.configApproximateNumberOfMessagesVisibleAlarm"></a>

```typescript
public readonly configApproximateNumberOfMessagesVisibleAlarm: SqsApproximateNumberOfMessagesVisibleAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig">SqsApproximateNumberOfMessagesVisibleAlarmConfig</a>

The configuration for the approximate number of messages visible alarm.

---

##### `configNumberOfMessagesSentAlarm`<sup>Optional</sup> <a name="configNumberOfMessagesSentAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.configNumberOfMessagesSentAlarm"></a>

```typescript
public readonly configNumberOfMessagesSentAlarm: SqsNumberOfMessagesSentAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig">SqsNumberOfMessagesSentAlarmConfig</a>

The configuration for the number of messages sent alarm.

---

##### `defaultAlarmAction`<sup>Optional</sup> <a name="defaultAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.defaultAlarmAction"></a>

```typescript
public readonly defaultAlarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm is triggered.

---

##### `defaultInsufficientDataAction`<sup>Optional</sup> <a name="defaultInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.defaultInsufficientDataAction"></a>

```typescript
public readonly defaultInsufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm has insufficient data.

---

##### `defaultOkAction`<sup>Optional</sup> <a name="defaultOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.defaultOkAction"></a>

```typescript
public readonly defaultOkAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm enters the ok state.

---

##### `excludeAlarms`<sup>Optional</sup> <a name="excludeAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.excludeAlarms"></a>

```typescript
public readonly excludeAlarms: SqsRecommendedAlarmsMetrics[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics">SqsRecommendedAlarmsMetrics</a>[]
- *Default:* None

Alarm metrics to exclude from the recommended alarms.

---

##### `excludeResources`<sup>Optional</sup> <a name="excludeResources" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]

The resources to exclude from the recommended alarms.

Use a resources id to exclude a specific resource.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

### SqsRecommendedAlarmsProps <a name="SqsRecommendedAlarmsProps" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps"></a>

Properties for the SqsRecommendedAlarms construct.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.Initializer"></a>

```typescript
import { SqsRecommendedAlarmsProps } from '@renovosolutions/cdk-library-cloudwatch-alarms'

const sqsRecommendedAlarmsProps: SqsRecommendedAlarmsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.configApproximateAgeOfOldestMessageAlarm">configApproximateAgeOfOldestMessageAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig">SqsApproximateAgeOfOldestMessageAlarmConfig</a></code> | The configuration for the approximate age of oldest message alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.configApproximateNumberOfMessagesNotVisibleAlarm">configApproximateNumberOfMessagesNotVisibleAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig">SqsApproximateNumberOfMessagesNotVisibleAlarmConfig</a></code> | The configuration for the approximate number of messages not visible alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.configApproximateNumberOfMessagesVisibleAlarm">configApproximateNumberOfMessagesVisibleAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig">SqsApproximateNumberOfMessagesVisibleAlarmConfig</a></code> | The configuration for the approximate number of messages visible alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.configNumberOfMessagesSentAlarm">configNumberOfMessagesSentAlarm</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig">SqsNumberOfMessagesSentAlarmConfig</a></code> | The configuration for the number of messages sent alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.defaultAlarmAction">defaultAlarmAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm is triggered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.defaultInsufficientDataAction">defaultInsufficientDataAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm has insufficient data. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.defaultOkAction">defaultOkAction</a></code> | <code>aws-cdk-lib.aws_cloudwatch.IAlarmAction</code> | The default action to take when an alarm enters the ok state. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.excludeAlarms">excludeAlarms</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics">SqsRecommendedAlarmsMetrics</a>[]</code> | Alarm metrics to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.excludeResources">excludeResources</a></code> | <code>string[]</code> | The resources to exclude from the recommended alarms. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.treatMissingData">treatMissingData</a></code> | <code>aws-cdk-lib.aws_cloudwatch.TreatMissingData</code> | How to handle missing data for this alarm. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.queue">queue</a></code> | <code>aws-cdk-lib.aws_sqs.IQueue</code> | The SQS queue for which to create the alarms. |

---

##### `configApproximateAgeOfOldestMessageAlarm`<sup>Required</sup> <a name="configApproximateAgeOfOldestMessageAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.configApproximateAgeOfOldestMessageAlarm"></a>

```typescript
public readonly configApproximateAgeOfOldestMessageAlarm: SqsApproximateAgeOfOldestMessageAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateAgeOfOldestMessageAlarmConfig">SqsApproximateAgeOfOldestMessageAlarmConfig</a>

The configuration for the approximate age of oldest message alarm.

---

##### `configApproximateNumberOfMessagesNotVisibleAlarm`<sup>Required</sup> <a name="configApproximateNumberOfMessagesNotVisibleAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.configApproximateNumberOfMessagesNotVisibleAlarm"></a>

```typescript
public readonly configApproximateNumberOfMessagesNotVisibleAlarm: SqsApproximateNumberOfMessagesNotVisibleAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesNotVisibleAlarmConfig">SqsApproximateNumberOfMessagesNotVisibleAlarmConfig</a>

The configuration for the approximate number of messages not visible alarm.

---

##### `configApproximateNumberOfMessagesVisibleAlarm`<sup>Required</sup> <a name="configApproximateNumberOfMessagesVisibleAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.configApproximateNumberOfMessagesVisibleAlarm"></a>

```typescript
public readonly configApproximateNumberOfMessagesVisibleAlarm: SqsApproximateNumberOfMessagesVisibleAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsApproximateNumberOfMessagesVisibleAlarmConfig">SqsApproximateNumberOfMessagesVisibleAlarmConfig</a>

The configuration for the approximate number of messages visible alarm.

---

##### `configNumberOfMessagesSentAlarm`<sup>Optional</sup> <a name="configNumberOfMessagesSentAlarm" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.configNumberOfMessagesSentAlarm"></a>

```typescript
public readonly configNumberOfMessagesSentAlarm: SqsNumberOfMessagesSentAlarmConfig;
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsNumberOfMessagesSentAlarmConfig">SqsNumberOfMessagesSentAlarmConfig</a>

The configuration for the number of messages sent alarm.

---

##### `defaultAlarmAction`<sup>Optional</sup> <a name="defaultAlarmAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.defaultAlarmAction"></a>

```typescript
public readonly defaultAlarmAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm is triggered.

---

##### `defaultInsufficientDataAction`<sup>Optional</sup> <a name="defaultInsufficientDataAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.defaultInsufficientDataAction"></a>

```typescript
public readonly defaultInsufficientDataAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm has insufficient data.

---

##### `defaultOkAction`<sup>Optional</sup> <a name="defaultOkAction" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.defaultOkAction"></a>

```typescript
public readonly defaultOkAction: IAlarmAction;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.IAlarmAction
- *Default:* None

The default action to take when an alarm enters the ok state.

---

##### `excludeAlarms`<sup>Optional</sup> <a name="excludeAlarms" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.excludeAlarms"></a>

```typescript
public readonly excludeAlarms: SqsRecommendedAlarmsMetrics[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics">SqsRecommendedAlarmsMetrics</a>[]
- *Default:* None

Alarm metrics to exclude from the recommended alarms.

---

##### `excludeResources`<sup>Optional</sup> <a name="excludeResources" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.excludeResources"></a>

```typescript
public readonly excludeResources: string[];
```

- *Type:* string[]

The resources to exclude from the recommended alarms.

Use a resources id to exclude a specific resource.

---

##### `treatMissingData`<sup>Optional</sup> <a name="treatMissingData" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.treatMissingData"></a>

```typescript
public readonly treatMissingData: TreatMissingData;
```

- *Type:* aws-cdk-lib.aws_cloudwatch.TreatMissingData
- *Default:* TreatMissingData.MISSING

How to handle missing data for this alarm.

---

##### `queue`<sup>Required</sup> <a name="queue" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsProps.property.queue"></a>

```typescript
public readonly queue: IQueue;
```

- *Type:* aws-cdk-lib.aws_sqs.IQueue

The SQS queue for which to create the alarms.

---

## Classes <a name="Classes" id="Classes"></a>

### LambdaRecommendedAlarmsAspect <a name="LambdaRecommendedAlarmsAspect" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsAspect"></a>

- *Implements:* aws-cdk-lib.IAspect

An aspect that applies recommended alarms for Lambda functions.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Lambda](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#Lambda)

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsAspect.Initializer"></a>

```typescript
import { LambdaRecommendedAlarmsAspect } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new LambdaRecommendedAlarmsAspect(props: LambdaRecommendedAlarmsConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsAspect.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig">LambdaRecommendedAlarmsConfig</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsAspect.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsConfig">LambdaRecommendedAlarmsConfig</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsAspect.visit">visit</a></code> | All aspects can visit an IConstruct. |

---

##### `visit` <a name="visit" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsAspect.visit"></a>

```typescript
public visit(node: IConstruct): void
```

All aspects can visit an IConstruct.

###### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsAspect.visit.parameter.node"></a>

- *Type:* constructs.IConstruct

---




### S3RecommendedAlarmsAspect <a name="S3RecommendedAlarmsAspect" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsAspect"></a>

- *Implements:* aws-cdk-lib.IAspect

Configures the recommended alarms for an S3 bucket.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#S3](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#S3)

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsAspect.Initializer"></a>

```typescript
import { S3RecommendedAlarmsAspect } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new S3RecommendedAlarmsAspect(props?: S3RecommendedAlarmsConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsAspect.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig">S3RecommendedAlarmsConfig</a></code> | *No description.* |

---

##### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsAspect.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsConfig">S3RecommendedAlarmsConfig</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsAspect.visit">visit</a></code> | All aspects can visit an IConstruct. |

---

##### `visit` <a name="visit" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsAspect.visit"></a>

```typescript
public visit(node: IConstruct): void
```

All aspects can visit an IConstruct.

###### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsAspect.visit.parameter.node"></a>

- *Type:* constructs.IConstruct

---




### SnsRecommendedAlarmsAspect <a name="SnsRecommendedAlarmsAspect" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsAspect"></a>

- *Implements:* aws-cdk-lib.IAspect

An aspect that applies recommended alarms to SNS topics.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SNS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SNS)

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsAspect.Initializer"></a>

```typescript
import { SnsRecommendedAlarmsAspect } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SnsRecommendedAlarmsAspect(props: SnsRecommendedAlarmsConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsAspect.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig">SnsRecommendedAlarmsConfig</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsAspect.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsConfig">SnsRecommendedAlarmsConfig</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsAspect.visit">visit</a></code> | All aspects can visit an IConstruct. |

---

##### `visit` <a name="visit" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsAspect.visit"></a>

```typescript
public visit(node: IConstruct): void
```

All aspects can visit an IConstruct.

###### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsAspect.visit.parameter.node"></a>

- *Type:* constructs.IConstruct

---




### SqsRecommendedAlarmsAspect <a name="SqsRecommendedAlarmsAspect" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsAspect"></a>

- *Implements:* aws-cdk-lib.IAspect

Configured the recommended alarms for an SQS queue.

Requires defining thresholds for some alarms.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SQS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Best_Practice_Recommended_Alarms_AWS_Services.html#SQS)

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsAspect.Initializer"></a>

```typescript
import { SqsRecommendedAlarmsAspect } from '@renovosolutions/cdk-library-cloudwatch-alarms'

new SqsRecommendedAlarmsAspect(props: SqsRecommendedAlarmsConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsAspect.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig">SqsRecommendedAlarmsConfig</a></code> | *No description.* |

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsAspect.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsConfig">SqsRecommendedAlarmsConfig</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsAspect.visit">visit</a></code> | All aspects can visit an IConstruct. |

---

##### `visit` <a name="visit" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsAspect.visit"></a>

```typescript
public visit(node: IConstruct): void
```

All aspects can visit an IConstruct.

###### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsAspect.visit.parameter.node"></a>

- *Type:* constructs.IConstruct

---





## Enums <a name="Enums" id="Enums"></a>

### LambdaRecommendedAlarmsMetrics <a name="LambdaRecommendedAlarmsMetrics" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics"></a>

The recommended metrics for Lambda alarms.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics.ERRORS">ERRORS</a></code> | Errors include the exceptions thrown by the code as well as exceptions thrown by the Lambda runtime. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics.THROTTLES">THROTTLES</a></code> | Throttles occur when there is no concurrency available for scale up. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics.DURATION">DURATION</a></code> | Duration is the time taken for the function to process an event. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics.CONCURRENT_EXECUTIONS">CONCURRENT_EXECUTIONS</a></code> | ConcurrentExecutions is the number of concurrent executions of the function. |

---

##### `ERRORS` <a name="ERRORS" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics.ERRORS"></a>

Errors include the exceptions thrown by the code as well as exceptions thrown by the Lambda runtime.

---


##### `THROTTLES` <a name="THROTTLES" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics.THROTTLES"></a>

Throttles occur when there is no concurrency available for scale up.

---


##### `DURATION` <a name="DURATION" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics.DURATION"></a>

Duration is the time taken for the function to process an event.

---


##### `CONCURRENT_EXECUTIONS` <a name="CONCURRENT_EXECUTIONS" id="@renovosolutions/cdk-library-cloudwatch-alarms.LambdaRecommendedAlarmsMetrics.CONCURRENT_EXECUTIONS"></a>

ConcurrentExecutions is the number of concurrent executions of the function.

---


### S3RecommendedAlarmsMetrics <a name="S3RecommendedAlarmsMetrics" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsMetrics"></a>

The recommended metrics for S3 bucket alarms.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsMetrics.ERRORS_4XX">ERRORS_4XX</a></code> | 4xxErrors are errors (4xx error codes) that are made in response to client requests. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsMetrics.ERRORS_5XX">ERRORS_5XX</a></code> | 5xxErrors are server errors (5xx error codes) that are made in response to client requests. |

---

##### `ERRORS_4XX` <a name="ERRORS_4XX" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsMetrics.ERRORS_4XX"></a>

4xxErrors are errors (4xx error codes) that are made in response to client requests.

---


##### `ERRORS_5XX` <a name="ERRORS_5XX" id="@renovosolutions/cdk-library-cloudwatch-alarms.S3RecommendedAlarmsMetrics.ERRORS_5XX"></a>

5xxErrors are server errors (5xx error codes) that are made in response to client requests.

---


### SnsRecommendedAlarmsMetrics <a name="SnsRecommendedAlarmsMetrics" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics"></a>

The recommended metrics for SNS topic alarms.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_PUBLISHED">NUMBER_OF_MESSAGES_PUBLISHED</a></code> | The number of messages published to the topic. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_DELIVERED">NUMBER_OF_NOTIFICATIONS_DELIVERED</a></code> | The number of notifications delivered. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FAILED">NUMBER_OF_NOTIFICATIONS_FAILED</a></code> | The number of notifications failed. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_ATTRIBUTES">NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_ATTRIBUTES</a></code> | The number of notifications filtered out due to invalid attributes. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_MESSAGE_BODY">NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_MESSAGE_BODY</a></code> | The number of notifications filtered out due to invalid message body. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_REDRIVEN_TO_DLQ">NUMBER_OF_NOTIFICATIONS_REDRIVEN_TO_DLQ</a></code> | The number of notifications redriven to the dead-letter queue. |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FAILED_TO_REDRIVE_TO_DLQ">NUMBER_OF_NOTIFICATIONS_FAILED_TO_REDRIVE_TO_DLQ</a></code> | The number of notifications failed to redrive to the dead-letter queue. |

---

##### `NUMBER_OF_MESSAGES_PUBLISHED` <a name="NUMBER_OF_MESSAGES_PUBLISHED" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_PUBLISHED"></a>

The number of messages published to the topic.

---


##### `NUMBER_OF_NOTIFICATIONS_DELIVERED` <a name="NUMBER_OF_NOTIFICATIONS_DELIVERED" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_DELIVERED"></a>

The number of notifications delivered.

---


##### `NUMBER_OF_NOTIFICATIONS_FAILED` <a name="NUMBER_OF_NOTIFICATIONS_FAILED" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FAILED"></a>

The number of notifications failed.

---


##### `NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_ATTRIBUTES` <a name="NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_ATTRIBUTES" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_ATTRIBUTES"></a>

The number of notifications filtered out due to invalid attributes.

---


##### `NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_MESSAGE_BODY` <a name="NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_MESSAGE_BODY" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FILTERED_OUT_INVALID_MESSAGE_BODY"></a>

The number of notifications filtered out due to invalid message body.

---


##### `NUMBER_OF_NOTIFICATIONS_REDRIVEN_TO_DLQ` <a name="NUMBER_OF_NOTIFICATIONS_REDRIVEN_TO_DLQ" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_REDRIVEN_TO_DLQ"></a>

The number of notifications redriven to the dead-letter queue.

---


##### `NUMBER_OF_NOTIFICATIONS_FAILED_TO_REDRIVE_TO_DLQ` <a name="NUMBER_OF_NOTIFICATIONS_FAILED_TO_REDRIVE_TO_DLQ" id="@renovosolutions/cdk-library-cloudwatch-alarms.SnsRecommendedAlarmsMetrics.NUMBER_OF_NOTIFICATIONS_FAILED_TO_REDRIVE_TO_DLQ"></a>

The number of notifications failed to redrive to the dead-letter queue.

---


### SqsRecommendedAlarmsMetrics <a name="SqsRecommendedAlarmsMetrics" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics"></a>

The recommended metrics for SQS queue alarms.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics.APPROXIMATE_AGE_OF_OLDEST_MESSAGE">APPROXIMATE_AGE_OF_OLDEST_MESSAGE</a></code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics.APPROXIMATE_NUMBER_OF_MESSAGES_NOT_VISIBLE">APPROXIMATE_NUMBER_OF_MESSAGES_NOT_VISIBLE</a></code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics.APPROXIMATE_NUMBER_OF_MESSAGES_VISIBLE">APPROXIMATE_NUMBER_OF_MESSAGES_VISIBLE</a></code> | *No description.* |
| <code><a href="#@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_SENT">NUMBER_OF_MESSAGES_SENT</a></code> | *No description.* |

---

##### `APPROXIMATE_AGE_OF_OLDEST_MESSAGE` <a name="APPROXIMATE_AGE_OF_OLDEST_MESSAGE" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics.APPROXIMATE_AGE_OF_OLDEST_MESSAGE"></a>

---


##### `APPROXIMATE_NUMBER_OF_MESSAGES_NOT_VISIBLE` <a name="APPROXIMATE_NUMBER_OF_MESSAGES_NOT_VISIBLE" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics.APPROXIMATE_NUMBER_OF_MESSAGES_NOT_VISIBLE"></a>

---


##### `APPROXIMATE_NUMBER_OF_MESSAGES_VISIBLE` <a name="APPROXIMATE_NUMBER_OF_MESSAGES_VISIBLE" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics.APPROXIMATE_NUMBER_OF_MESSAGES_VISIBLE"></a>

---


##### `NUMBER_OF_MESSAGES_SENT` <a name="NUMBER_OF_MESSAGES_SENT" id="@renovosolutions/cdk-library-cloudwatch-alarms.SqsRecommendedAlarmsMetrics.NUMBER_OF_MESSAGES_SENT"></a>

---

