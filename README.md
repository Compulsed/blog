# Blog
[![Build status](https://badge.buildkite.com/0d04ab9bd8fb4277716aad48dfb0c3a38efaafa030013e507a.svg?step=Staging)](https://buildkite.com/dale-salter/blog-merge)

## Information

This is the public repo for [dalejsalter.com](https://dalejsalter.com).

Backend was kick started with [serverless-aurora-graphql-starter](https://github.com/Compulsed/serverless-aurora-graphql-starter)

## Technologies

### Frontend
- Server Side Rendering through Vercel/ Next.JS [Vercel](https://vercel.com/)
- Apollo Client
- React / React Bootstrap
- Axios

### Backend
- Serverless Framework (w/ Serverless offline)
- GraphQL.js (ApolloServer) on Lambda (For API)
- Serverless Aurora Postgres
- Data API w/ Data API Client
- Knex (Running DB Migrations / Seeds)
- ASDF (Version management, node, jq, yarn)
- Direnv (Managing multiple environments)
- Oprah (For managing secrets & credentials)
- Cloudformation template for a temporarily spinning up a bastion host