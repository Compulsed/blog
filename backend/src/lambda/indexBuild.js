const indexBuild = require('../services/build');

const handler = async (event, context) => {
  console.log(JSON.stringify({ event, context }));

  await indexBuild(event.detail.build.uuid);
};

module.exports = { handler };