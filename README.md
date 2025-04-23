# Air-FLE API

API de gestion pour l'école de français Air-FLE, développée avec NestJS.

## Description

Cette API gère les différents aspects du système de gestion de l'école Air-FLE :
- Gestion des étudiants et de leurs informations
- Gestion des cours et des sessions
- Authentification et autorisation des utilisateurs
- Gestion des groupes et des périodes
- Suivi des absences et des examens

## Technologies

- [NestJS](https://nestjs.com/) - Framework Node.js moderne
- [Prisma](https://www.prisma.io/) - ORM moderne pour TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Base de données relationnelle
- [Docker](https://www.docker.com/) - Conteneurisation de l'application
- [Swagger](https://swagger.io/) - Documentation de l'API

## Pré-requis

- [Docker](https://www.docker.com/) (recommandé)
- [Node.js](https://nodejs.org/) v18+ (si exécution sans Docker)
- [npm](https://www.npmjs.com/) v9+ (si exécution sans Docker)

## Démarrage rapide avec Docker

Le moyen le plus simple de lancer l'application est d'utiliser Docker Compose :

```bash
# Cloner le dépôt
git clone https://github.com/UnknOownU/air-fle-API.git
cd air-fle-API

# Lancer l'application avec Docker Compose
docker-compose up
```

L'application sera disponible à l'adresse [http://localhost:3000/api/v1](http://localhost:3000/api/v1).

La documentation Swagger sera accessible à [http://localhost:3000/api/docs](http://localhost:3000/api/docs).

## Installation manuelle (sans Docker)

Si vous préférez exécuter l'application sans Docker :

```bash
# Cloner le dépôt
git clone https://github.com/UnknOownU/air-fle-API.git
cd air-fle-API

# Installer les dépendances
npm install

# Configurer la base de données (PostgreSQL doit être installé)
# Modifier le fichier .env avec vos informations de connexion

# Appliquer les migrations Prisma
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Démarrer l'application en mode développement
npm run start:dev
```

## Configuration

La configuration de l'application se fait via des variables d'environnement. Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/airfle?schema=public"

# JWT
JWT_SECRET="votre-secret-jwt-super-secret"
JWT_EXPIRATION="1d"

# Serveur
PORT=3000
```

## Structure du projet

```
src/
├── absence/        # Module de gestion des absences
├── address/        # Module de gestion des adresses
├── auth/           # Module d'authentification
├── common/         # Utilitaires partagés
├── continuation/   # Module de suivi de la progression
├── course/         # Module de gestion des cours
├── exam/           # Module de gestion des examens
├── exit-reason/    # Module de gestion des raisons de sortie
├── financing/      # Module de gestion des financements
├── french-level/   # Module de gestion des niveaux de français
├── gender/         # Module de gestion des genres
├── group/          # Module de gestion des groupes
├── nationality/    # Module de gestion des nationalités
├── orientation/    # Module de gestion des orientations
├── period/         # Module de gestion des périodes
├── prisma/         # Configuration et service Prisma
├── session/        # Module de gestion des sessions
├── status/         # Module de gestion des statuts
├── student/        # Module de gestion des étudiants
├── todolist/       # Module de gestion des tâches
├── user/           # Module de gestion des utilisateurs
├── working-hour/   # Module de gestion des heures de travail
├── app.module.ts   # Module principal de l'application
├── main.ts         # Point d'entrée de l'application
└── seed.ts         # Script de génération de données
```

## API Endpoints

L'API est organisée avec un préfixe global `/api/v1`.

Voici quelques-uns des endpoints principaux :

- **Authentification**
  - POST `/api/v1/auth/login` - Connexion
  - POST `/api/v1/auth/register` - Inscription (admin uniquement)

- **Utilisateurs**
  - GET `/api/v1/users` - Liste des utilisateurs
  - GET `/api/v1/users/:id` - Détail d'un utilisateur
  - POST `/api/v1/users` - Création d'un utilisateur
  - PATCH `/api/v1/users/:id` - Mise à jour d'un utilisateur
  - DELETE `/api/v1/users/:id` - Suppression d'un utilisateur

- **Étudiants**
  - GET `/api/v1/students` - Liste des étudiants
  - GET `/api/v1/students/:id` - Détail d'un étudiant
  - POST `/api/v1/students` - Création d'un étudiant
  - PATCH `/api/v1/students/:id` - Mise à jour d'un étudiant
  - DELETE `/api/v1/students/:id` - Suppression d'un étudiant

### Documentation Swagger

Pour une liste complète des endpoints et des schémas de données, consultez la documentation Swagger :

[http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture de tests
npm run test:cov
```

## Déploiement en production

Pour le déploiement en production, nous recommandons d'utiliser Docker avec un orchestrateur comme Kubernetes ou Docker Swarm.

```bash
# Construire l'image Docker
docker build -t air-fle-api:1.0.0 .

# Exécuter l'image
docker run -p 3000:3000 --env-file .env.production air-fle-api:1.0.0
```

## Contribuer

1. Fork le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'feat: add some amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## Contact

Pour toute question ou suggestion, veuillez contacter l'équipe de développement.
