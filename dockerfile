                                                                               
FROM node:16-alpine as builder

USER node

WORKDIR /home/node

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . /home/node/

RUN yarn build

FROM node:16-alpine

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/yarn.lock /home/node/
COPY --from=builder /home/node/dist/ /home/node/dist/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/


CMD ["node", "dist/main.js"]


