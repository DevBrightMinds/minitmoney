FROM node:18-alpine

WORKDIR /app

COPY package*.json . 

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

EXPOSE 8086 

CMD [ "npm", "run", "start"]