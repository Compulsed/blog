const AWS = require('aws-sdk');

module.exports = {
    client: 'postgresql',
    connection: async () => {
        var cfParams = {
            StackName: `engstats-${process.env.STAGE}-${process.env.AWS_REGION}`
        };
        
        const { Stacks } = await (new AWS.CloudFormation())
            .describeStacks(cfParams)
            .promise()
            
        const DatabaseSecretARN = Stacks[0]
            .Outputs
            .find(o => o.OutputKey === 'DatabaseSecretArn')
            .OutputValue;

        const smParams = {
            SecretId: DatabaseSecretARN, 
            VersionStage: "AWSPREVIOUS"
        };

        const { SecretString } = await (new AWS.SecretsManager())
            .getSecretValue(smParams)
            .promise()

        const { password, username } = JSON.parse(SecretString);

        const config =  {
            host: `localhost`,
            port: process.env.DATABASE_LOCAL_PORT,
            user: username,
            password : password,
            database : process.env.DATABASE_NAME,
            min: 2,
            max: 6,
            createTimeoutMillis: 3000,
            acquireTimeoutMillis: 30000,
            idleTimeoutMillis: 30000,
            reapIntervalMillis: 1000,
            createRetryIntervalMillis: 100,
            propagateCreateError: false // Fixes: https://github.com/knex/knex/issues/2820
        };

        return config;
    },
    migrations: {
        directory:  './migrations'
    },
    seeds: {
        directory:  './seeds'
    }
}