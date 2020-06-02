const { logger } = require('./logger');

const dataAPICLient = require('data-api-client')({
    secretArn: process.env.SECRET_ARN || process.env.SECRET_ARN_REF,
    resourceArn: process.env.DB_ARN,
    database: process.env.DATABASE_NAME,    
});

const query = (...args) => {
    logger.info('Data API Query: ', args[0], args[1].length);

    return dataAPICLient.query(...args);
}
  
module.exports = { query }