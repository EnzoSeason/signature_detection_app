FROM node:16-alpine

WORKDIR /frontend

COPY package.json .
COPY package-lock.json .
RUN npm ci --silent

COPY . .
RUN npm run build