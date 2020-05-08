## Plan
- [x] asdf set up
- [x] Dotenv set up
- [x] Backend completely in CF
- [x] Deploy a single stage
- [x] Query via TablePlus
- [x] VPC Bastion host
  - [x] Conditionally launch Bastion host -- EC2_KEY_NAME included
  - [x] Clean up bastion rules
- [x] GraphQL returning a value in client
- [x] GraphQL querying Serverless Aurora
- [x] Database migration script
- [x] Database Seed (Does can this be done with DataAPI?)
- [x] Data Faker
- [x] CI / CD Pipeline (Multi account)
- [x] CI / CD Pipeline (Deploy new instance on CI, validates CF)
- [ ] GraphQL triggered by test
- [ ] GitHub commits into repo
- [ ] Buildkite commits into repo (Event Bridge)
- [ ] Jira stories into repo
- [ ] Build out frontend
- [ ] Authentication (cognito?)

## Before Production
- [ ] API Authentication
- [ ] Limit Execution role in serverless.yml as it is *
- [ ] Remove * CIDR from BastionSecurityGroup

## Nice to have
- [ ] Logging framework
  - [ ] Database logs
- [ ] Cloudwatch Metrics
- [ ] TypeScript / DI support
- [x] Custom VPC (Project does not have off default VPC)
- [ ] Support for XRay
- [ ] Load testing
- [ ] Insomnia api in repo
- [ ] Custom Git commit messaging
- [ ] Jest Support
- [ ] Apollo Engine support
- [ ] Support named stages (not just dev)
- [ ] Web sockets
- [ ] HTTP Api rather than RestAPI
- [ ] Bastion defined as separate cloudformation stack
- [ ] DNS on database
- [ ] DNS on API
- [ ] IAM Auth on database
- [ ] Move compose into backend (does not support microservices nicely)
  
## Optional
- [ ] Serverless CI/CD
- [ ] Serverless Platform
  
## Unknowns: 
- [ ] Should key names in outputs, resources, contain 'engstats' prefix for better naming? Creates more semantic names
- [ ] Consider putting any names under `custom:` so that they consistently contain stack name
- [ ] Do any resources in stack contain the stack name twice?

## Aurora Serverless
Limitations:
- https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html#aurora-serverless.limitations