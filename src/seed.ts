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

  console.log('✅ Rôles créés:', { adminRole, teacherRole });

  // === DONNÉES DE RÉFÉRENCE ===

  // 1. GENRES
  console.log('📝 Création des genres...');
  const genders = [
    { label: 'Homme' },
    { label: 'Femme' },
    { label: 'Autre' },
    { label: 'Non spécifié' }
  ];

  for (const gender of genders) {
    const existingGender = await prisma.gender.findFirst({
      where: { label: gender.label }
    });
    if (!existingGender) {
      await prisma.gender.create({
        data: gender,
      });
    }
  }

  // 2. NIVEAUX DE FRANÇAIS (CECR)
  console.log('📚 Création des niveaux de français...');
  const frenchLevels = [
    { code: 'A0', description: 'Débutant absolu - Aucune connaissance' },
    { code: 'A1', description: 'Utilisateur élémentaire - Niveau découverte' },
    { code: 'A1+', description: 'Utilisateur élémentaire - A1 renforcé' },
    { code: 'A2', description: 'Utilisateur élémentaire - Niveau de survie' },
    { code: 'A2+', description: 'Utilisateur élémentaire - A2 renforcé' },
    { code: 'B1', description: 'Utilisateur indépendant - Niveau seuil' },
    { code: 'B1+', description: 'Utilisateur indépendant - B1 renforcé' },
    { code: 'B2', description: 'Utilisateur indépendant - Niveau avancé' },
    { code: 'C1', description: 'Utilisateur expérimenté - Niveau autonome' },
    { code: 'C2', description: 'Utilisateur expérimenté - Niveau maîtrise' },
    { code: 'FLE-P', description: 'Français Langue Étrangère - Professionnel' },
    { code: 'Alpha', description: 'Alphabétisation' },
    { code: 'Post-Alpha', description: 'Post-Alphabétisation' }
  ];

  for (const level of frenchLevels) {
    const existingLevel = await prisma.frenchLevel.findFirst({
      where: { code: level.code }
    });
    if (!existingLevel) {
      await prisma.frenchLevel.create({
        data: level,
      });
    }
  }

  // 3. TYPES DE FINANCEMENT
  console.log('💰 Création des types de financement...');
  const financings = [
    { type: 'OFII' },
    { type: 'OPCO' },
    { type: 'CPF' },
    { type: 'Pôle Emploi' },
    { type: 'Région' },
    { type: 'CAF' },
    { type: 'Autofinancement' },
    { type: 'Entreprise' },
    { type: 'Mission Locale' },
    { type: 'ASP' },
    { type: 'CCAS' },
    { type: 'Autre' }
  ];

  for (const financing of financings) {
    const existingFinancing = await prisma.financing.findFirst({
      where: { type: financing.type }
    });
    if (!existingFinancing) {
      await prisma.financing.create({
        data: financing,
      });
    }
  }

  // 4. HANDICAPS
  console.log('♿ Création des types de handicaps...');
  const disabilities = [
    { label: 'Handicap moteur', description: 'Difficultés de déplacement, paralysies' },
    { label: 'Handicap visuel', description: 'Cécité, malvoyance' },
    { label: 'Handicap auditif', description: 'Surdité, malentendance' },
    { label: 'Handicap mental', description: 'Déficience intellectuelle' },
    { label: 'Handicap psychique', description: 'Troubles psychiatriques' },
    { label: 'Trouble DYS', description: 'Dyslexie, dyspraxie, dysorthographie' },
    { label: 'Trouble autistique', description: 'Troubles du spectre autistique' },
    { label: 'Handicap cognitif', description: 'Troubles de la mémoire, attention' },
    { label: 'Maladie invalidante', description: 'Maladies chroniques invalidantes' },
    { label: 'Polyhandicap', description: 'Association de plusieurs handicaps' },
    { label: 'Autre', description: 'Autre type de handicap non listé' }
  ];

  for (const disability of disabilities) {
    const existingDisability = await prisma.disability.findFirst({
      where: { label: disability.label }
    });
    if (!existingDisability) {
      await prisma.disability.create({
        data: disability,
      });
    }
  }

  // 5. STATUTS ADMINISTRATIFS
  console.log('📋 Création des statuts...');
  const statuses = [
    { label: 'Actif' },
    { label: 'En attente' },
    { label: 'Suspendu' },
    { label: 'Diplômé' },
    { label: 'Abandon' },
    { label: 'Exclus' },
    { label: 'Transféré' },
    { label: 'Congé maladie' },
    { label: 'Congé maternité' }
  ];

  for (const status of statuses) {
    const existingStatus = await prisma.status.findFirst({
      where: { label: status.label }
    });
    if (!existingStatus) {
      await prisma.status.create({
        data: status,
      });
    }
  }

  // 6. ORIENTATIONS
  console.log('🎯 Création des orientations...');
  const orientations = [
    { type: 'Emploi direct', description: 'Orientation vers l\'emploi' },
    { type: 'Formation professionnelle', description: 'Poursuite en formation pro' },
    { type: 'Formation générale', description: 'Poursuite études générales' },
    { type: 'Création d\'entreprise', description: 'Projet entrepreneurial' },
    { type: 'Remise à niveau', description: 'Consolidation des acquis' },
    { type: 'Spécialisation', description: 'Formation spécialisée' },
    { type: 'VAE', description: 'Validation des Acquis de l\'Expérience' },
    { type: 'Autre formation', description: 'Autre type de formation' },
    { type: 'Arrêt temporaire', description: 'Pause dans le parcours' },
    { type: 'Non définie', description: 'Orientation non encore définie' }
  ];

  for (const orientation of orientations) {
    const existingOrientation = await prisma.orientation.findFirst({
      where: { type: orientation.type }
    });
    if (!existingOrientation) {
      await prisma.orientation.create({
        data: orientation,
      });
    }
  }

  // 7. RAISONS DE SORTIE
  console.log('🚪 Création des raisons de sortie...');
  const exitReasons = [
    { reason: 'Fin de formation' },
    { reason: 'Emploi trouvé' },
    { reason: 'Déménagement' },
    { reason: 'Problème personnel' },
    { reason: 'Problème de santé' },
    { reason: 'Problème financier' },
    { reason: 'Inadéquation formation' },
    { reason: 'Exclusion' },
    { reason: 'Abandon personnel' },
    { reason: 'Autre formation' },
    { reason: 'Retour au pays' },
    { reason: 'Non assiduité' }
  ];

  for (const exitReason of exitReasons) {
    const existingExitReason = await prisma.exitReason.findFirst({
      where: { reason: exitReason.reason }
    });
    if (!existingExitReason) {
      await prisma.exitReason.create({
        data: exitReason,
      });
    }
  }

  // 8. NATIONALITÉS (Liste complète des pays)
  console.log('🌍 Création des nationalités...');
  const nationalities = [
    { label: 'Afghanistan' },
    { label: 'Afrique du Sud' },
    { label: 'Albanie' },
    { label: 'Algérie' },
    { label: 'Allemagne' },
    { label: 'Andorre' },
    { label: 'Angola' },
    { label: 'Antigua-et-Barbuda' },
    { label: 'Arabie Saoudite' },
    { label: 'Argentine' },
    { label: 'Arménie' },
    { label: 'Australie' },
    { label: 'Autriche' },
    { label: 'Azerbaïdjan' },
    { label: 'Bahamas' },
    { label: 'Bahreïn' },
    { label: 'Bangladesh' },
    { label: 'Barbade' },
    { label: 'Belgique' },
    { label: 'Belize' },
    { label: 'Bénin' },
    { label: 'Bhoutan' },
    { label: 'Biélorussie' },
    { label: 'Birmanie (Myanmar)' },
    { label: 'Bolivie' },
    { label: 'Bosnie-Herzégovine' },
    { label: 'Botswana' },
    { label: 'Brésil' },
    { label: 'Brunei' },
    { label: 'Bulgarie' },
    { label: 'Burkina Faso' },
    { label: 'Burundi' },
    { label: 'Cambodge' },
    { label: 'Cameroun' },
    { label: 'Canada' },
    { label: 'Cap-Vert' },
    { label: 'Centrafrique' },
    { label: 'Chili' },
    { label: 'Chine' },
    { label: 'Chypre' },
    { label: 'Colombie' },
    { label: 'Comores' },
    { label: 'Congo' },
    { label: 'Congo (RDC)' },
    { label: 'Corée du Nord' },
    { label: 'Corée du Sud' },
    { label: 'Costa Rica' },
    { label: 'Côte d\'Ivoire' },
    { label: 'Croatie' },
    { label: 'Cuba' },
    { label: 'Danemark' },
    { label: 'Djibouti' },
    { label: 'Dominique' },
    { label: 'Égypte' },
    { label: 'Émirats Arabes Unis' },
    { label: 'Équateur' },
    { label: 'Érythrée' },
    { label: 'Espagne' },
    { label: 'Estonie' },
    { label: 'Eswatini' },
    { label: 'États-Unis' },
    { label: 'Éthiopie' },
    { label: 'Fidji' },
    { label: 'Finlande' },
    { label: 'France' },
    { label: 'Gabon' },
    { label: 'Gambie' },
    { label: 'Géorgie' },
    { label: 'Ghana' },
    { label: 'Grèce' },
    { label: 'Grenade' },
    { label: 'Guatemala' },
    { label: 'Guinée' },
    { label: 'Guinée-Bissau' },
    { label: 'Guinée équatoriale' },
    { label: 'Guyana' },
    { label: 'Haïti' },
    { label: 'Honduras' },
    { label: 'Hongrie' },
    { label: 'Îles Cook' },
    { label: 'Îles Marshall' },
    { label: 'Îles Salomon' },
    { label: 'Inde' },
    { label: 'Indonésie' },
    { label: 'Irak' },
    { label: 'Iran' },
    { label: 'Irlande' },
    { label: 'Islande' },
    { label: 'Israël' },
    { label: 'Italie' },
    { label: 'Jamaïque' },
    { label: 'Japon' },
    { label: 'Jordanie' },
    { label: 'Kazakhstan' },
    { label: 'Kenya' },
    { label: 'Kirghizistan' },
    { label: 'Kiribati' },
    { label: 'Koweït' },
    { label: 'Laos' },
    { label: 'Lesotho' },
    { label: 'Lettonie' },
    { label: 'Liban' },
    { label: 'Liberia' },
    { label: 'Libye' },
    { label: 'Liechtenstein' },
    { label: 'Lituanie' },
    { label: 'Luxembourg' },
    { label: 'Macédoine du Nord' },
    { label: 'Madagascar' },
    { label: 'Malaisie' },
    { label: 'Malawi' },
    { label: 'Maldives' },
    { label: 'Mali' },
    { label: 'Malte' },
    { label: 'Maroc' },
    { label: 'Maurice' },
    { label: 'Mauritanie' },
    { label: 'Mexique' },
    { label: 'Micronésie' },
    { label: 'Moldavie' },
    { label: 'Monaco' },
    { label: 'Mongolie' },
    { label: 'Monténégro' },
    { label: 'Mozambique' },
    { label: 'Namibie' },
    { label: 'Nauru' },
    { label: 'Népal' },
    { label: 'Nicaragua' },
    { label: 'Niger' },
    { label: 'Nigeria' },
    { label: 'Niue' },
    { label: 'Norvège' },
    { label: 'Nouvelle-Zélande' },
    { label: 'Oman' },
    { label: 'Ouganda' },
    { label: 'Ouzbékistan' },
    { label: 'Pakistan' },
    { label: 'Palaos' },
    { label: 'Palestine' },
    { label: 'Panama' },
    { label: 'Papouasie-Nouvelle-Guinée' },
    { label: 'Paraguay' },
    { label: 'Pays-Bas' },
    { label: 'Pérou' },
    { label: 'Philippines' },
    { label: 'Pologne' },
    { label: 'Portugal' },
    { label: 'Qatar' },
    { label: 'République dominicaine' },
    { label: 'République tchèque' },
    { label: 'Roumanie' },
    { label: 'Royaume-Uni' },
    { label: 'Russie' },
    { label: 'Rwanda' },
    { label: 'Saint-Christophe-et-Niévès' },
    { label: 'Saint-Marin' },
    { label: 'Saint-Vincent-et-les-Grenadines' },
    { label: 'Sainte-Lucie' },
    { label: 'Salvador' },
    { label: 'Samoa' },
    { label: 'São Tomé-et-Principe' },
    { label: 'Sénégal' },
    { label: 'Serbie' },
    { label: 'Seychelles' },
    { label: 'Sierra Leone' },
    { label: 'Singapour' },
    { label: 'Slovaquie' },
    { label: 'Slovénie' },
    { label: 'Somalie' },
    { label: 'Soudan' },
    { label: 'Soudan du Sud' },
    { label: 'Sri Lanka' },
    { label: 'Suède' },
    { label: 'Suisse' },
    { label: 'Suriname' },
    { label: 'Syrie' },
    { label: 'Tadjikistan' },
    { label: 'Tanzanie' },
    { label: 'Tchad' },
    { label: 'Thaïlande' },
    { label: 'Timor oriental' },
    { label: 'Togo' },
    { label: 'Tonga' },
    { label: 'Trinité-et-Tobago' },
    { label: 'Tunisie' },
    { label: 'Turkménistan' },
    { label: 'Turquie' },
    { label: 'Tuvalu' },
    { label: 'Ukraine' },
    { label: 'Uruguay' },
    { label: 'Vanuatu' },
    { label: 'Vatican' },
    { label: 'Venezuela' },
    { label: 'Vietnam' },
    { label: 'Yémen' },
    { label: 'Zambie' },
    { label: 'Zimbabwe' },
    { label: 'Apatride' },
    { label: 'Non spécifiée' }
  ];

  // Création par batch pour optimiser les performances
  const batchSize = 50;
  for (let i = 0; i < nationalities.length; i += batchSize) {
    const batch = nationalities.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async nationality => {
        const existingNationality = await prisma.nationality.findFirst({
          where: { label: nationality.label }
        });
        if (!existingNationality) {
          await prisma.nationality.create({
            data: nationality,
          });
        }
      })
    );
  }

  console.log('✅ Toutes les données de référence ont été créées !');

  // === UTILISATEURS PAR DÉFAUT ===
  console.log('👥 Création des utilisateurs par défaut...');

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
  console.log('🎉 SEED TERMINÉ AVEC SUCCÈS !');
  console.log('📊 Données créées :');
  console.log('   - Rôles: 2');
  console.log('   - Genres: 4');
  console.log('   - Niveaux de français: 13');
  console.log('   - Types de financement: 12');
  console.log('   - Handicaps: 11');
  console.log('   - Statuts: 9');
  console.log('   - Orientations: 10');
  console.log('   - Raisons de sortie: 12');
  console.log('   - Nationalités: 198');
  console.log('   - Utilisateurs: 2');
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