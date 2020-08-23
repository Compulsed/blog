## Plan
- [x] Install AWS Cli through Pip 
- [x] Buildkite pipeline creation
- [x] asdf set up
- [x] Set up AWS Accounts (OrganizationAccountAccessRole, Billing: 145722906259, BuildKite: 085226998778)
- [x] Set up buildkite pipelines
- [x] Set up local AWS Profiles
- [x] EC2 SSH Keys using SSM
- [x] Return some posts through the GraphQL API (Static)

# Frontend Plan
- [ ] Ziet Frontend
- [ ] Display All Posts
- [ ] Segment Frontend
- [ ] AppCues Frontend

# Backend Plan
- [ ] Wire up posts to read directly from the database
- [ ] Mutation to create a new post
- [ ] Mutation to update a post

## Testing Improvements
- [ ] API Performance monitoring (jest?)

## Before Production
- [ ] Limit Execution role in serverless.yml as it is *
- [ ] Remove * CIDR from BastionSecurityGroup
- [ ] DeletionPolicy: Delete, change this if production
- [ ] Organisation Slub is a variable

## Nice to have upcoming
- [ ] Jira stories into repo
- [ ] Logging framework
  - [ ] Database logs
- [ ] Cloudwatch Metrics
- [ ] TypeScript / DI support
- [ ] Support for XRay
- [ ] Load testing
- [ ] Insomnia api in repo
- [ ] Custom Git commit messaging
- [ ] Jest Support
- [ ] Apollo Engine support
- [ ] Support named stages (not just dev)
- [ ] Web sockets
- [ ] HTTP Api rather than RestAPI
- [ ] DNS on database
- [ ] DNS on API
- [ ] IAM Auth on database
- [ ] Proper logger support

## Automate (AUTOMATE:)
- [ ] New AWS account set up

## Awkward Code, and improvements (IMPROVEMENT:)
- [ ] Should make for env files to be specified as AWS_REGION, AWS_SDK.. etc are needed
- [ ] Move compose into backend -- Buildkite CD (does not support microservices nicely)
- [ ] Uploads extracted AWS SDK to lambda function (docker image with AWS CLI)
- [ ] process.env.SECRET_ARN || process.env.SECRET_ARN_REF in code
- [ ] Move to AWS_DEFAULT_REGION rather than AWS_REGION

## Optional (OPTIONAL:)
- [ ] Serverless CI/CD
- [ ] Serverless Platform
- [ ] Use aws-vault
- [ ] Consider commiting ~/.aws/config to source control

## Unknowns: 
- [ ] Should key names in outputs, resources, contain 'engstats' prefix for better naming? Creates more semantic names
- [ ] Consider putting any names under `custom:` so that they consistently contain stack name
- [ ] Do any resources in stack contain the stack name? -- Might be duplicated

## Aurora Serverless
Limitations:
- https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html#aurora-serverless.limitations

## Notes
3 Ways lambda can connect to RDS
- Lambda in VPC
- RDS Data API
- RDS Proxy