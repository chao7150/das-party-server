FROM node:15.11.0-slim AS builder

WORKDIR /usr/src/app
COPY . ./
RUN yarn install
RUN yarn build

FROM node:15.11.0-alpine

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY --from=builder /usr/src/app/build ./build/

EXPOSE 8080

CMD yarn start