FROM mhart/alpine-node:latest

RUN apk update && \
    apk add --no-cache git openssh make gcc g++ python && \
    mkdir -p /usr/src/buckless-client

WORKDIR /usr/src/buckless-client

COPY . /usr/src/buckless-client/

RUN npm install && \
    npm build

EXPOSE 8081
CMD ["npm", "run", "serve"]
