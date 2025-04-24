# Air-FLE API

API de gestion pour Air-FLE

## Description

Cette API permet la gestion des principales fonctionnalités dont Air-FLE a besoin :
- Gestion des étudiants
- Gestion des cours et des sessions
- Authentification des utilisateurs
- Suivi des absences

## Installation avec Docker (recommandé)

```bash
# Cloner le dépôt
git clone https://github.com/UnknOownU/air-fle-API.git
cd air-fle-API

# Lancer l'application avec Docker Compose
docker-compose up
```

L'API sera disponible à l'adresse [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

La documentation Swagger est accessible à [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Installation sans Docker

```bash
# Cloner le dépôt
git clone https://github.com/UnknOownU/air-fle-API.git
cd air-fle-API

# Installer les dépendances
npm install

# Configurer la base de données
# Créer un fichier .env à la racine du projet avec :
# DATABASE_URL="postgresql://user:password@localhost:5432/airfle?schema=public"

# Démarrer l'application
npm run start:dev
```

## Principales fonctionnalités

- **Authentification**
  - Connexion des utilisateurs
  - Gestion des rôles (admin, professeur)

- **Gestion des étudiants**
  - Ajout, modification et suppression d'étudiants
  - Suivi des informations personnelles

- **Gestion des cours**
  - Organisation des sessions
  - Suivi des présences

## Technologies utilisées

- NestJS
- PostgreSQL
- Prisma ORM
- Docker
