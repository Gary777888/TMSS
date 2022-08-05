FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN adduser -D dummy

USER dummy

COPY . .

EXPOSE ${PORT}

CMD ["node", "server.js"]