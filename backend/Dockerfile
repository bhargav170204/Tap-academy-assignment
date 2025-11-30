FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN chmod +x ./node_modules/.bin/tsc
RUN npm run build
EXPOSE 4000
CMD ["npm","start"]