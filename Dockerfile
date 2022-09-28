FROM node:latest AS base
WORKDIR /app
ENV DOCKER=true
COPY package.json ./

FROM base AS dev
ENV NODE_ENV=development
RUN npm install --verbose
COPY . /app
HEALTHCHECK --interval=1m --start-period=30s --retries=2 CMD curl --fail --silent http://localhost:3000/healthcheck || exit 1
CMD [ "npx", "nodemon", "/app/src/app.js" ]

FROM base AS prod
ENV NODE_ENV=production
RUN npm install --verbose
COPY . /app
HEALTHCHECK --interval=1m --start-period=30s --retries=2 CMD curl --fail --silent http://localhost:3000/healthcheck || exit 1
EXPOSE 3000
CMD [ "node", "/app/src/app.js" ]
