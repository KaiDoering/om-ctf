FROM node:19.0.0-alpine

WORKDIR /app

COPY static/ static/
COPY *.mjs ./
COPY package.json .
COPY package-lock.json .

RUN npm ci

CMD [ "npm", "start" ]