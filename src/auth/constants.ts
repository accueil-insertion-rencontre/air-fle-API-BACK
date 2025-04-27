export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'airFleSecretKey2025',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
};

// Avertissement de sécurité 
if (!process.env.JWT_SECRET) {
  console.warn('⚠️ AVERTISSEMENT: JWT_SECRET non défini dans les variables d\'environnement. Utilisation de la clé par défaut en développement uniquement.');
  console.warn('⚠️ NE PAS utiliser la clé par défaut en production!');
} 