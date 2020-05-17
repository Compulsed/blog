FROM segment/chamber:2 AS chamber
FROM node:12

COPY --from=chamber /chamber /bin/chamber

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json yarn.lock ./

RUN yarn install --pure-lockfile

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" &&\
    unzip awscliv2.zip &&\
    ./aws/install

RUN apt-get update && apt-get upgrade -y 
RUN apt-get install jq postgresql-client -y

# Bundle app source
COPY . .