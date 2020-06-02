/* {
  "version": "0",
  "id": "58e9e8c8-2092-c5b2-284d-6a498ab0a9bc",
  "detail-type": "Build Created",
  "source": "aws.partner/buildkite.com/dale-salter/dcd84cbb-a66f-4659-a2c1-36d141c0de18",
  "account": "878489430596",
  "time": "2020-06-02T07:11:50Z",
  "region": "us-east-1",
  "resources": [],
  "detail": {
      "version": 1,
      "build": {
          "uuid": "1a5d5209-411c-482e-ab31-ef44b77469ab",
          "graphql_id": "QnVpbGQtLS0xYTVkNTIwOS00MTFjLTQ4MmUtYWIzMS1lZjQ0Yjc3NDY5YWI=",
          "number": 111,
          "commit": "HEAD",
          "message": "Manually Triggered",
          "branch": "master",
          "state": "scheduled",
          "source": "ui",
          "started_at": null,
          "finished_at": null
      },
      "pipeline": {
          "uuid": "00b6f4db-061c-4b54-ba4d-0d07654ab90b",
          "graphql_id": "UGlwZWxpbmUtLS0wMGI2ZjRkYi0wNjFjLTRiNTQtYmE0ZC0wZDA3NjU0YWI5MGI=",
          "slug": "eng-stats-merge"
      },
      "organization": {
          "uuid": "13d3da51-c3d5-4f27-9391-bbb6d20f3de2",
          "graphql_id": "T3JnYW5pemF0aW9uLS0tMTNkM2RhNTEtYzNkNS00ZjI3LTkzOTEtYmJiNmQyMGYzZGUy",
          "slug": "dale-salter"
      }
  }
}
*/

const { indexBuild } = require('./build');

const handler = async (event, context) => {
  console.log(JSON.stringify({ event, context }));

  await indexBuild(event.detail.build.uuid);
};

module.exports = { handler };