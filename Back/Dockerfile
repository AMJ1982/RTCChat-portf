
FROM node:16.17.0-bullseye-slim AS base-stage

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:16.17.0-bullseye-slim AS production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm ci --only=production

COPY --from=base-stage /usr/src/app/build ./build

COPY --from=base-stage /usr/src/app/front-build ./front-build

CMD ["npm", "run", "start"]