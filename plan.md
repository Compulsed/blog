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
- [ ] GraphQL triggered by test
- [ ] CI / CD Pipeline (Multi account)
- [ ] CI / CD Pipeline (Deploy new instance on CI, validates CF)
- [ ] Data Faker

## Technical Debt
- [ ] Database name now exists in env? 

## Before Production
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
  
## Optional
- [ ] Serverless CI/CD
- [ ] Serverless Platform
  
## Unknowns: 
- [ ] Should key names in outputs, resources, contain 'engstats' prefix for better naming? Creates more semantic names
- [ ] Consider putting any names under `custom:` so that they consistently contain stack name
- [ ] Do any resources in stack contain the stack name twice?

## Aurora Serverless
Successes
- No VPC required
- Scales down
- 

Limitations:
- Cannot load data in or save data to S3 (can use CSV?)
- 5c per 10,000 accesses 
- No publically accessible URL (same for regular aurora?                                                   )

Question:
- Can you use RDS proxy with this?

## Aurora
Successes:
- 

Limitations:
- 

Questions:
- Does DataAPI work with regular aurora?
- Does RDS Proxy work with regular aurora?