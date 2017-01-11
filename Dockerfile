FROM mhart/alpine-node:latest

WORKDIR /usr/src/buckless-client

EXPOSE 8081

CMD ["npm", "run", "serve"]

RUN apk update && \
    apk add --no-cache git openssh make gcc g++ python && \
    mkdir -p /usr/src/buckless-client

COPY package.json /usr/src/buckless-client/

RUN npm install

COPY . /usr/src/buckless-client/

RUN npm build
