FROM node:19.0.0-alpine

ENV FLAG="CTF{p0llution_1s_b4d_for_th3_environmen7}"

WORKDIR /app

COPY static/ static/
COPY *.mjs ./
COPY package.json .
COPY package-lock.json .

RUN npm ci

CMD [ "npm", "start" ]