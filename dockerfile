
FROM node:lts as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node  . .

RUN yarn build

FROM node:lts-slim

ENV NODE_ENV production
ENV PORT=4000
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]