import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Renovo Solutions',
  authorAddress: 'webmaster+cdk@renovo1.com',
  projenrcTs: true,
  cdkVersion: '2.154.1',
  defaultReleaseBranch: 'master',
  name: '@renovosolutions/cdk-library-cloudwatch-alarms',
  description: 'AWS CDK Construct Library to automatically create CloudWatch Alarms for resources in a CDK app based on resource type.',
  repositoryUrl: 'https://github.com/RenovoSolutions/cdk-library-cloudwatch-alarms.git',
  keywords: [
    'cloudwatch',
    'alarms',
    'cdk',
    'aws-cdk',
    'aws-cdk-construct',
    'projen',
  ],
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflow: false,
    exclude: ['projen'],
  },
  githubOptions: {
    mergify: false,
    pullRequestLintOptions: {
      semanticTitle: false,
    },
  },
  stale: false,
  releaseToNpm: true,
  release: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  docgen: true,
  eslint: true,
  publishToPypi: {
    distName: 'renovosolutions.aws-cdk-cloudwatch-alarms',
    module: 'alarms',
  },
});

new javascript.UpgradeDependencies(project, {
  include: ['projen'],
  taskName: 'upgrade-projen',
  workflow: true,
  workflowOptions: {
    schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
  },
});

project.synth();
