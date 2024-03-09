FROM node:18-alpine

RUN mkdir -p /app

COPY . /app

WORKDIR /app

RUN npm ci

RUN rm -rf .next

RUN npm run build

CMD ["npm", "start"]