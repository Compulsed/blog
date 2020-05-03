## Plan
- [x] asdf set up
- [x] Dotenv set up
- [x] Backend completely in CF
- [x] Deploy a single stage
- [x] Query via TablePlus
- [ ] VPC Bastion host
- [ ] GraphQL returning a value
- [ ] GraphQL querying Serverless Aurora
- [ ] CI / CD Code Pipeline (Multi account)

## Before Production
- [ ] Limit Execution role in serverless.yml as it is *

## Nice to have
- [ ] TypeScript / DI support
- [ ] Custom VPC (Project does not have off default VPC)
- [ ] Support for XRay
- [ ] Load testing
- [ ] Insomnia api in repo
- [ ] Custom Git commit messaging
- [ ] Jest Support
- [ ] Apollo Engine support
- [ ] Support named stages (not just dev)
- [ ] Web sockets
- [ ] HTTP Api rather than RestAPI

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