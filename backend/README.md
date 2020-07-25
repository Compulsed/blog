# Engineering Statistics

### Set up locally


### Code Requirements
* ASDF
* JQ
* AWS Cli


### Challenges:

Data API Client:
- Must use ::uuid and ::jsonb because postgres inference does not work when using parameterised values
- Where In (array) is not supported yet: http://knexjs.org/#Utility-BatchInsert
- No migrations functionality
 
Knex w/ Data API Client issues:
- Must use 'raw' when doing upserting, as this is specific to DDB providers and has not been implemented yet
- Unknown how to successfully do batchInserts (http://knexjs.org/#Utility-BatchInsert), as it requires a transaction


### Chamber -> Oprah Migration
- [x] Upload local oprah values to dev
- [x] Serverless.yml (using oprah rather than env)
- [ ] bin
- [ ] pull-request.yml
- [ ] migrate.yml
- [ ] ci-test (hard)
- [x] Upload test / staging / production values

Values still required as env:
- AWS_ACCOUNT_ID
- AWS_REGION
- AWS_PROFILE