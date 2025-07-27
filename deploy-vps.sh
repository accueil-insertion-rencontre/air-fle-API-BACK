#!/bin/bash

# 🚀 Script de déploiement Air-FLE API sur VPS
# Usage: ./deploy-vps.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement Air-FLE API sur VPS..."

# 1. Vérification de Docker
echo "🐳 Vérification de Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Installe-le d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Installe-le d'abord."
    exit 1
fi

# 2. Création du fichier .env.production si il n'existe pas
if [ ! -f .env.production ]; then
    echo "📝 Création du fichier .env.production..."
    cat > .env.production << EOF
# Configuration API
DATABASE_URL=postgresql://postgres:postgres@postgres-prod:5432/airfle?schema=public
JWT_SECRET=votre_clé_secrète_très_sécurisée_pour_production_dev_2024
NODE_ENV=production
PORT=3000

# Configuration PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=airfle

# Configuration Redis
REDIS_URL=redis://redis-prod:6379

# Variables pour Docker Compose
DB_PASSWORD=postgres
REDIS_PASSWORD=
EOF
    echo "✅ Fichier .env.production créé"
fi

# 3. Création du dossier backups
mkdir -p backups

# 4. Arrêt des conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose -f docker-compose.prod.yml down

# 5. Nettoyage des images (optionnel)
read -p "🧹 Voulez-vous nettoyer les images Docker ? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Nettoyage des images..."
    docker system prune -f
fi

# 6. Build et démarrage
echo "🔨 Build et démarrage des services..."
docker-compose -f docker-compose.prod.yml up --build -d

# 7. Attendre que les services soient prêts
echo "⏳ Attente que les services soient prêts..."
sleep 30

# 8. Vérification de la santé
echo "🏥 Vérification de la santé des services..."
docker-compose -f docker-compose.prod.yml ps

# 9. Test de l'API
echo "🧪 Test de l'API..."
if curl -f http://localhost:3000/api/v1/health > /dev/null 2>&1; then
    echo "✅ API accessible sur http://localhost:3000"
else
    echo "❌ API non accessible. Vérifiez les logs:"
    docker-compose -f docker-compose.prod.yml logs api-prod
fi

echo "🎉 Déploiement terminé !"
echo "📊 Logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 Arrêt: docker-compose -f docker-compose.prod.yml down"
echo "🔄 Redémarrage: docker-compose -f docker-compose.prod.yml restart" 