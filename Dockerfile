FROM node:18-alpine

RUN mkdir -p /app

COPY . /app

WORKDIR /app

RUN npm ci

CMD ["node", "server/index.js"]