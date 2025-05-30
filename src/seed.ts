import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🚨 ATTENTION: Ce script crée des comptes par défaut avec des mots de passe prédéfinis.');
  console.log('🔒 SÉCURITÉ: Changez immédiatement ces mots de passe en production !');
  console.log('');

  // Créer les rôles par défaut s'ils n'existent pas déjà
  const adminRole = await prisma.role.upsert({
    where: { rolename: 'admin' },
    update: {},
    create: {
      rolename: 'admin'
    },
  });

  const teacherRole = await prisma.role.upsert({
    where: { rolename: 'teacher' },
    update: {},
    create: {
      rolename: 'teacher'
    },
  });

  console.log('Rôles créés:', { adminRole, teacherRole });

  // Créer un utilisateur admin par défaut
  // ⚠️ SÉCURITÉ: Mot de passe temporaire - À CHANGER IMMÉDIATEMENT en production !
  const hashedAdminPassword = await argon2.hash('Admin123');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@airfle.com' },
    update: {
      password: hashedAdminPassword // Mettre à jour le mot de passe pour utiliser Argon2
    },
    create: {
      firstname: 'Admin',
      lastname: 'System',
      email: 'admin@airfle.com',
      password: hashedAdminPassword,
      role: {
        connect: {
          id: adminRole.id,
        },
      },
    },
  });

  console.log('✅ Utilisateur admin créé:', { id: adminUser.id, email: adminUser.email });
  console.log('🔑 Mot de passe admin temporaire: Admin123');

  // Créer un utilisateur enseignant par défaut
  // ⚠️ SÉCURITÉ: Mot de passe temporaire - À CHANGER IMMÉDIATEMENT en production !
  const hashedTeacherPassword = await argon2.hash('Teacher123');
  
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@airfle.com' },
    update: {
      password: hashedTeacherPassword // Mettre à jour le mot de passe pour utiliser Argon2
    },
    create: {
      firstname: 'Teacher',
      lastname: 'User',
      email: 'teacher@airfle.com',
      password: hashedTeacherPassword,
      role: {
        connect: {
          id: teacherRole.id,
        },
      },
    },
  });

  console.log('✅ Utilisateur enseignant créé:', { id: teacherUser.id, email: teacherUser.email });
  console.log('🔑 Mot de passe teacher temporaire: Teacher123');
  
  console.log('');
  console.log('🚨 IMPORTANT: Changez ces mots de passe dès la première connexion !');
  console.log('🔒 Utilisez des mots de passe forts et uniques pour chaque environnement.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 