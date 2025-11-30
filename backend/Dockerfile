FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN apk add --no-cache python3 make g++ \
	&& npm rebuild bcrypt --build-from-source
RUN chmod +x ./node_modules/.bin/tsc
RUN npm run build
EXPOSE 4000
CMD ["npm","start"]