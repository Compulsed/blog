const util = require('util');

const knex = require('knex');
const PostgresClient = require('knex/lib/dialects/postgres');
const Transaction = require('knex/lib/transaction')

function DataAPIClient() {
    function ClientRDSDataAPI(config) {
        PostgresClient.call(this, config);
    }

    util.inherits(ClientRDSDataAPI, PostgresClient);

    Object.assign(ClientRDSDataAPI.prototype, {
        driverName: 'rds-data',

        _driver() {
            return require('data-api-client')(this.config.connection);
        },

        transaction(...args) {
            class DataAPITransaction extends Transaction {
                async begin(connection) {
                  const result = await connection.beginTransaction();
              
                  connection.__knexTxId = result.transactionId;
                  connection.isTransaction = true;
                  connection.rdsTransactionId = result.transactionId;
                  return connection;
                }
            };

            return new DataAPITransaction(this, ...args);
        },

        acquireConnection() {
            const connection = this._driver(this.connectionSettings);
            return Promise.resolve(connection);
        },

        destroy() {
            return Promise.resolve();
        },

        async _query(connection, queryObject) {
            if (!queryObject || typeof queryObject === 'string') {
                queryObject = { sql: queryObject };
            }

            if (!queryObject.sql) {
                return;
            }

            const sqlString = knex
                .raw(
                    queryObject.sql.replace(/`/g, '"').replace(/\$(\d+)/g, '?'),
                    queryObject.bindings
                )
                .toString();

            const query = {
                sql: sqlString,
                continueAfterTimeout: true,
            };

            if (queryObject.options && queryObject.options.nestTables) {
            query.includeResultMetadata = true;
            }

            if (connection.__knexTxId) {
                query.transactionId = connection.__knexTxId;
            }

            const response = await connection
                .query(query)

            response.rows = response.records;

            queryObject.response = queryObject.output
                ? queryObject.output(response)
                : response;
            
            return queryObject;
        },

        processResponse(response) {
            if (response.method === 'insert') {
                response.response = response.response.records;
            }

            if (response.method === 'select') {
                if (!response.options || !response.options.nestTables) {
                    response.response = response.response.records;
                }
                else {
                    const res = [];
                    const { records, columnMetadata } = response.response;

                    for (let i = 0; i < columnMetadata.length; i++) {
                        const { tableName } = columnMetadata[i];
                        const { label } = columnMetadata[i];

                        for (let j = 0; j < records.length; j++) {
                            if (!res[j]) res[j] = {};
                            if (!res[j][tableName]) res[j][tableName] = {};
                            res[j][tableName][label] = records[j][label];
                        }
                    }
                    response.response = res;
                }
            }

            if (response.method === 'del' || response.method === 'update') {
                response.response = response.response.numberOfRecordsUpdated;
            }

            return response.response;
        }
    });

    return ClientRDSDataAPI;
}

const knexClient = require("knex")({
    client: dataAPIClient(),
    connection: {
        secretArn: process.env.SECRET_ARN || process.env.SECRET_ARN_REF,
        resourceArn: process.env.DB_ARN,
        database: process.env.DATABASE_NAME,
    }
});

module.exports = { knexClient };