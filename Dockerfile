FROM node:18-alpine

RUN mkdir -p /app/insta-next

COPY . /app/insta-next

WORKDIR /app/insta-next

RUN npm ci

RUN rm -rf .next

RUN npm run build

CMD ["npm", "start"]