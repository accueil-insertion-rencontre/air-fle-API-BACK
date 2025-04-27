FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Générer les fichiers Prisma avec la cible musl
RUN npx prisma generate

# Build l'application
RUN npm run build

EXPOSE 3000

# La commande de démarrage est maintenant définie dans docker-compose.yml 