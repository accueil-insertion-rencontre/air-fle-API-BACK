#!/bin/bash

# 🔐 Script pour créer l'admin sur le VPS
# Usage: ./create-admin-vps.sh

echo "🔐 Création de l'utilisateur admin sur le VPS..."

# 1. Copier le script create-admin.ts dans le conteneur
echo "📋 Copie du script create-admin.ts..."
docker cp scripts/create-admin.ts air-fle-api-prod:/app/create-admin.ts

# 2. Compiler et exécuter le script
echo "🔨 Compilation et exécution..."
docker exec air-fle-api-prod sh -c "cd /app && npx tsc create-admin.ts --target es2020 --module commonjs --outDir . && node create-admin.js"

echo "✅ Admin créé avec succès !"
echo "📧 Email: admin@airfle.com"
echo "🔑 Mot de passe: celui que tu as configuré dans le script" 