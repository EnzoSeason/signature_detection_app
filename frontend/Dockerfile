FROM node:14-alpine

WORKDIR /frontend

COPY package.json .
COPY package-lock.json .
RUN npm ci --silent

COPY . .