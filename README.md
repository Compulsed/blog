# Blog

## Build Status

| Pipeline      | Status        |
| ------------- |:-------------:|
| Production    | [![Build status](https://badge.buildkite.com/73683d1965cbb64e0e158c533a53295876e0870ea30113c1a4.svg?step=Production)](https://buildkite.com/dale-salter/blog-deploy) |
| Staging       | [![Build status](https://badge.buildkite.com/0d04ab9bd8fb4277716aad48dfb0c3a38efaafa030013e507a.svg?step=Staging)](https://buildkite.com/dale-salter/blog-merge) |
| Pull Request  | [![Build status](https://badge.buildkite.com/823d065e3be06422c56e4f2a217256256eb2216dc9e872cec6.svg?branch=master)](https://buildkite.com/dale-salter/blog-pr) |


## Todo list

Required:
- [] Set up AWS Accounts (OrganizationAccountAccessRole, Billing: 145722906259, BuildKite: 085226998778)
- [] Set up buildkite pipelines
- [x] Set up local AWS Profiles

Bonus:
- [] Use aws-vault
- [] Consider commiting ~/.aws/config to source control

Automate:
- New AWS account set up
- Buildkite pipeline