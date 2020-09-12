const AWS = require('aws-sdk');
const stringHash = require('string-hash');
const Bluebird = require('bluebird');

const s3 = new AWS.S3();

const _generateHash = args => 
    String(stringHash(JSON.stringify(args)))

const getCacheValue = async (args) => {
    return (await _getCacheValueByHash(_generateHash(args))).queryResult;
}

const _getCacheValueByHash = async (hash) => {
    try {
        const result = await s3.getObject({
            Bucket: process.env.QUERY_CACHE_BUCKET,
            Key: hash
        })
        .promise();

        return JSON.parse(result.Body.toString());
    } catch (err) {
        if (err.statusCode === 404) {
            return null; // cacheMiss
        }
        
        throw err;
    }
}

const persistCacheValue = async (args, queryResult) => {
    const hash = _generateHash(args);

    try {
        await s3.putObject({
            Bucket: process.env.QUERY_CACHE_BUCKET,
            Key: hash,
            Body: JSON.stringify({
                args,
                queryResult,
            }, null, 2)
        })
        .promise();
    } catch (err) {
        console.error('Unable to persist', err);
        throw error;
    }
}

const updateAllQueries = dataApiClient => {
    const getAllCacheEntries = () => 
        s3.listObjectsV2({ Bucket: process.env.QUERY_CACHE_BUCKET })
            .promise();


    const getArgsInCacheEntries = s3Objects => Bluebird.map(
        s3Objects.Contents,
        ({ Key: hash }) => _getCacheValueByHash(hash).then(({ args }) => args)
    );

    const getRefreshedValues = queryArgs => Bluebird.map(
        queryArgs,
        async (args) => ({ args, queryResult: await dataApiClient.query(...args) })
    );

    const persistRefreshedValues = freshQueryResponses => Bluebird.map(
        freshQueryResponses,
        ({ args, queryResult }) => persistCacheValue(args, queryResult)
    );

    return getAllCacheEntries()
        .then(getArgsInCacheEntries)
        .then(getRefreshedValues)
        .then(persistRefreshedValues);
}

module.exports = { getCacheValue, persistCacheValue, updateAllQueries };