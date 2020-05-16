# Engineering Statistics

### Set up locally
Dev:
`AWS_PROFILE=eng-stats-dev AWS_REGION=us-east-1 CHAMBER_KMS_KEY_ALIAS=aws/ssm chamber export --format dotenv --output-file ./.env.dev engstats-dev-8-us-east-1`

Test:
`AWS_PROFILE=eng-stats-test AWS_REGION=us-east-1 CHAMBER_KMS_KEY_ALIAS=aws/ssm chamber export --format dotenv --output-file ./.env.test engstats-test-8-us-east-1`

Staging:
`AWS_PROFILE=eng-stats-staging AWS_REGION=us-east-1 CHAMBER_KMS_KEY_ALIAS=aws/ssm chamber export --format dotenv --output-file ./.env.staging engstats-staging-8-us-east-1`

Prod:
`AWS_PROFILE=eng-stats-prod AWS_REGION=us-east-1 CHAMBER_KMS_KEY_ALIAS=aws/ssm chamber export --format dotenv --output-file ./.env.prod engstats-prod-8-us-east-1`


### Update remote
Dev:
`AWS_PROFILE=eng-stats-dev AWS_REGION=us-east-1 CHAMBER_KMS_KEY_ALIAS=aws/ssm chamber import engstats-dev-8-us-east-1 ./.secrets/engstats-dev.json`

Test:
`AWS_PROFILE=eng-stats-test AWS_REGION=us-east-1 CHAMBER_KMS_KEY_ALIAS=aws/ssm chamber import engstats-test-8-us-east-1 ./.secrets/engstats-test.json`

Staging:
`AWS_PROFILE=eng-stats-staging AWS_REGION=us-east-1 CHAMBER_KMS_KEY_ALIAS=aws/ssm chamber import engstats-staging-8-us-east-1 ./.secrets/engstats-staging.json`

Prod:
`AWS_PROFILE=eng-stats-prod AWS_REGION=us-east-1 CHAMBER_KMS_KEY_ALIAS=aws/ssm chamber import engstats-prod-8-us-east-1 ./.secrets/engstats-prod.json`


### Code Requirements
* ASDF
* JQ
* AWS Cli