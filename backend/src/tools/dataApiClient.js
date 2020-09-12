const { logger } = require('./logger');
const { getDatabaseSecretArn } = require('./getDatabaseSecretArn');
const { getCacheValue, persistCacheValue, updateAllQueries } = require('./queryCache');

const makedataAPIClient = async () => {
    const databaseSecretARN = await getDatabaseSecretArn();

    return require('data-api-client')({
        secretArn: databaseSecretARN, 
        resourceArn: process.env.DB_ARN,
        database: process.env.DATABASE_NAME,
    });
}

// Cached per container
const dataAPIClientPromise = makedataAPIClient();

const queryWithCache = async (...args) => {
    logger.info('queryWithCache: ', args[0], args[1] && args[1].length);

    const cache = await getCacheValue(args);

    if (cache) {
        return cache;
    }
    
    const queryResult = await (await dataAPIClientPromise)
        .query(...args);
    
    await persistCacheValue(args, queryResult);

    return queryResult;
}

const queryNoCache = async (...args) => {
    logger.info('queryNoCache: ', args[0], args[1] && args[1].length);

    const dataApiClient = await dataAPIClientPromise;
    
    return dataApiClient
        .query(...args);
}

const queryMutation = async (...args) => {
    logger.info('queryMutation: ', args[0], args[1] && args[1].length);

    const dataApiClient = await dataAPIClientPromise;

    const updateResponse = dataApiClient
        .query(...args);

    await updateAllQueries(dataApiClient);

    return updateResponse;
}

module.exports = { queryWithCache, queryNoCache, queryMutation };