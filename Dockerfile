FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Générer les fichiers Prisma avec la cible musl
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"] 