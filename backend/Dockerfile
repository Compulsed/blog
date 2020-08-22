FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json yarn.lock ./

RUN yarn install --pure-lockfile

RUN cd /tmp &&\
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" &&\
    unzip awscliv2.zip &&\
    ./aws/install &&\
    cd -;

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install \
        jq \
        postgresql-client \
        python3 \
        pip3 \
        -y && \
    pip3 --no-cache-dir install --upgrade awscli

# Bundle app source
COPY . .