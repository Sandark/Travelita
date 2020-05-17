FROM node:14

ENV NODE_ENV production

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npx webpack --config webpack.config.prod.js

COPY . .

EXPOSE 8080

CMD ["npm", "start"]