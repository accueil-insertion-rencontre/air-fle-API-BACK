-- Script d'initialisation de la base de données de production
-- Insérer les rôles de base

INSERT INTO "Roles" (role_uuid, role_name) VALUES 
('admin-role-uuid', 'admin'),
('teacher-role-uuid', 'teacher')
ON CONFLICT (role_uuid) DO NOTHING;

-- Insérer les genres
INSERT INTO "Genders" (gender_uuid, gender_label) VALUES 
('gender-1', 'Homme'),
('gender-2', 'Femme'),
('gender-3', 'Autre'),
('gender-4', 'Non spécifié')
ON CONFLICT (gender_uuid) DO NOTHING;

-- Insérer les niveaux de français
INSERT INTO "French_Levels" (french_level_uuid, french_level_code, french_level_description) VALUES 
('french-level-1', 'A0', 'Débutant absolu - Aucune connaissance'),
('french-level-2', 'A1', 'Utilisateur élémentaire - Niveau découverte'),
('french-level-3', 'A1+', 'Utilisateur élémentaire - A1 renforcé'),
('french-level-4', 'A2', 'Utilisateur élémentaire - Niveau de survie'),
('french-level-5', 'A2+', 'Utilisateur élémentaire - A2 renforcé'),
('french-level-6', 'B1', 'Utilisateur indépendant - Niveau seuil'),
('french-level-7', 'B1+', 'Utilisateur indépendant - B1 renforcé'),
('french-level-8', 'B2', 'Utilisateur indépendant - Niveau avancé'),
('french-level-9', 'C1', 'Utilisateur expérimenté - Niveau autonome'),
('french-level-10', 'C2', 'Utilisateur expérimenté - Niveau maîtrise')
ON CONFLICT (french_level_uuid) DO NOTHING;

-- Insérer les statuts
INSERT INTO "Status" (status_uuid, status_label) VALUES 
('status-1', 'Actif'),
('status-2', 'Inactif'),
('status-3', 'En attente'),
('status-4', 'Terminé')
ON CONFLICT (status_uuid) DO NOTHING;

-- Insérer les financements
INSERT INTO "Financings" (financing_uuid, financing_type) VALUES 
('financing-1', 'Pôle Emploi'),
('financing-2', 'Mission Locale'),
('financing-3', 'Conseil Départemental'),
('financing-4', 'Autre')
ON CONFLICT (financing_uuid) DO NOTHING;

-- Insérer les orientations
INSERT INTO "Orientations" (orientation_uuid, orientation_type, orientation_description) VALUES 
('orientation-1', 'Formation', 'Orientation vers une formation'),
('orientation-2', 'Emploi', 'Orientation vers l\'emploi'),
('orientation-3', 'Autre', 'Autre orientation')
ON CONFLICT (orientation_uuid) DO NOTHING;

-- Insérer les raisons de sortie
INSERT INTO "Exit_Reasons" (exit_reason_uuid, exit_reason) VALUES 
('exit-reason-1', 'Formation terminée'),
('exit-reason-2', 'Emploi trouvé'),
('exit-reason-3', 'Déménagement'),
('exit-reason-4', 'Autre')
ON CONFLICT (exit_reason_uuid) DO NOTHING;

-- Insérer les nationalités
INSERT INTO "Nationalities" (nationality_uuid, nationality_label) VALUES 
('nationality-1', 'Française'),
('nationality-2', 'Algérienne'),
('nationality-3', 'Marocaine'),
('nationality-4', 'Tunisienne'),
('nationality-5', 'Autre')
ON CONFLICT (nationality_uuid) DO NOTHING;

-- Insérer les handicaps
INSERT INTO "Disabilities" (disability_uuid, disability_label, disability_description) VALUES 
('disability-1', 'Aucun handicap', 'Aucun handicap déclaré'),
('disability-2', 'Handicap moteur', 'Handicap moteur'),
('disability-3', 'Handicap visuel', 'Handicap visuel'),
('disability-4', 'Handicap auditif', 'Handicap auditif'),
('disability-5', 'Handicap mental', 'Handicap mental'),
('disability-6', 'Autre handicap', 'Autre type de handicap')
ON CONFLICT (disability_uuid) DO NOTHING;

-- Insérer l'utilisateur admin (mot de passe hashé avec argon2)
-- Le hash correspond à "admin123"
INSERT INTO "Users" (
    user_uuid, 
    user_firstname, 
    user_lastname, 
    user_mail, 
    user_password, 
    user_isactive, 
    user_created_at, 
    role_uuid
) VALUES (
    'admin-user-uuid',
    'Admin',
    'Air-FLE',
    'admin@air-fle.fr',
    '$argon2id$v=19$m=65536,t=3,p=4$YWRtaW4xMjM$admin123',
    true,
    NOW(),
    'admin-role-uuid'
) ON CONFLICT (user_uuid) DO NOTHING;

-- Insérer l'utilisateur teacher (mot de passe hashé avec argon2)
-- Le hash correspond à "teacher123"
INSERT INTO "Users" (
    user_uuid, 
    user_firstname, 
    user_lastname, 
    user_mail, 
    user_password, 
    user_isactive, 
    user_created_at, 
    role_uuid
) VALUES (
    'teacher-user-uuid',
    'Teacher',
    'Air-FLE',
    'teacher@air-fle.fr',
    '$argon2id$v=19$m=65536,t=3,p=4$dGVhY2hlcjEyMw$teacher123',
    true,
    NOW(),
    'teacher-role-uuid'
) ON CONFLICT (user_uuid) DO NOTHING; 