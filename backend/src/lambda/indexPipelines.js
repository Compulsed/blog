const { writePipelines } = require('../services/pipelines');

const handler = async (event, context) => {
    await writePipelines();
};

module.exports = { handler };