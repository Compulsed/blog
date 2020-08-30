## Plan
- [x] Install AWS Cli through Pip 
- [x] Buildkite pipeline creation
- [x] asdf set up
- [x] Set up AWS Accounts (OrganizationAccountAccessRole, Billing: 145722906259, BuildKite: 085226998778)
- [x] Set up buildkite pipelines
- [x] Set up local AWS Profiles
- [x] EC2 SSH Keys using SSM
- [x] Return some posts through the GraphQL API (Static)
- [x] Ziet Frontend
- [x] Display All Posts
- [x] Wire up posts to read directly from the database
  - [x] design table schema
  - [x] create migration script
  - [x] populate with dummy data on staging
  - [x] hook up with API
- [x] Render markdown contents
- [x] Image support

# Frontend Plan
- [ ] Form sumission errors when missing secret
- [ ] Integrate google analytics
- [ ] Segment Frontend
- [ ] AppCues Frontend
- [ ] Build out an about me page

# Backend Plan
- [ ] Mutation to create a new post
- [ ] Mutation to update a post
- [ ] Back up data
- [ ] Set production to always on
- [ ] Fix duplication between types querying data (put into service / repo layer)

## Testing Improvements
- [ ] API Performance monitoring (jest?)

## Before Production
- [ ] Remove automatic seeding data

## Automate (AUTOMATE:)
- [ ] New AWS account set up
- [ ] Setting up Vercel & Route 53 for each environment

## Nice to have upcoming
- [ ] Fix error link on frontend
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


## Awkward Code, and improvements (IMPROVEMENT:)
- [ ] Should make for env files to be specified as AWS_REGION, AWS_SDK.. etc are needed
- [ ] Move compose into backend -- Buildkite CD (does not support microservices nicely)
- [ ] Uploads extracted AWS SDK to lambda function (docker image with AWS CLI)
- [ ] process.env.SECRET_ARN || process.env.SECRET_ARN_REF in code
- [ ] Move to AWS_DEFAULT_REGION rather than AWS_REGION
- [ ] Vercel project for each stage

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