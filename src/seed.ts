import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
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
  const hashedPassword = await argon2.hash('admin123');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@airfle.com' },
    update: {
      password: hashedPassword // Mettre à jour le mot de passe pour utiliser Argon2
    },
    create: {
      firstname: 'Admin',
      lastname: 'System',
      email: 'admin@airfle.com',
      password: hashedPassword,
      role: {
        connect: {
          id: adminRole.id,
        },
      },
    },
  });

  console.log('Utilisateur admin créé:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 