import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Renovo Solutions',
  authorAddress: 'webmaster+cdk@renovo1.com',
  projenrcTs: true,
  cdkVersion: '2.241.0',
  constructsVersion: '10.5.1',
  jsiiVersion: '^5.9',
  defaultReleaseBranch: 'master',
  packageManager: javascript.NodePackageManager.PNPM,
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
  buildWorkflow: false,
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
    module: 'renovosolutions_recommended_cloudwatch_alarms',
  },
  tsconfigDev: {
    compilerOptions: {
      isolatedModules: true,
    },
  },
});

project.eslint?.addRules({
  '@typescript-eslint/no-unused-vars': ['error', {
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_',
  }],
});

new javascript.UpgradeDependencies(project, {
  include: ['projen'],
  taskName: 'upgrade-projen',
  workflow: false,
  workflowOptions: {
    schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
  },
});

// Ignore the release workflow file so it's not committed to git
project.gitignore.exclude('!/.github/workflows/release.yml');
project.gitignore.addPatterns('.github/workflows/release.yml');

project.synth();
