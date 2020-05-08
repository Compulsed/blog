FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json yarn.lock ./

RUN yarn install --pure-lockfile
RUN pip install awscli --upgrade --user

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" &&\
    unzip awscliv2.zip &&\
    sudo ./aws/install


# Bundle app source
COPY . .