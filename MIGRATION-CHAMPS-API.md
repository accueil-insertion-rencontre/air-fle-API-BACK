# 🔄 MIGRATION DES CHAMPS API - GUIDE POUR LE FRONTEND ANGULAR

## ⚠️ CHANGEMENT MAJEUR : API COHÉRENTE

L'API a été **complètement nettoyée** pour éliminer toutes les incohérences. Tous les endpoints retournent maintenant **exactement les noms de champs du schéma de base de données** sans aucune transformation.

## 📋 MAPPINGS DES CHAMPS PAR ENTITÉ

### 👥 USERS (Utilisateurs)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  role: string,
  isActive: boolean
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  user_uuid: string,
  user_firstname: string,
  user_lastname: string,
  user_mail: string,
  user_password: string,
  role_uuid: string,
  user_isactive: boolean,
  user_created_at: Date
}
```

### 🎓 STUDENTS (Étudiants)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  firstname: string,
  lastname: string,
  email: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  student_uuid: string,
  student_firstname: string,
  student_lastname: string,
  student_mail: string,
  student_phone: string,
  student_birthdate: Date,
  student_created_at: Date,
  nationality_uuid: string,
  gender_uuid: string,
  status_uuid: string,
  french_level_uuid: string,
  financing_uuid: string,
  orientation_uuid?: string,
  exit_reason_uuid?: string
}
```

### 📚 ABSENCES
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  student_id: string,
  course_id: string,
  reason: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  absence_uuid: string,
  student_uuid: string,
  course_uuid: string,
  absence_reason: string,
  absence_created_at: Date
}
```

### 👥 GROUPS (Groupes)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  label: string,
  session_id: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  group_uuid: string,
  group_label: string,
  session_uuid: string,
  group_created_at: Date
}
```

### 📅 SESSIONS
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  label: string,
  startedAt: Date,
  finishedAt: Date
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  session_uuid: string,
  session_label: string,
  session_started_at: Date,
  session_finished_at: Date,
  session_created_at: Date
}
```

### 📖 COURSES (Cours)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  intitule: string,
  day: Date,
  start_hour: Date,
  end_hour: Date,
  group_id: string,
  color: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  course_uuid: string,
  course_name: string,
  course_day: Date,
  course_start_hour: Date,
  course_end_hour: Date,
  group_uuid: string,
  course_color: string,
  course_created_at: Date
}
```

### 📝 EXAMS (Examens)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  label: string,
  taked_at: Date,
  note: string,
  student_id: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  exam_uuid: string,
  exam_label: string,
  exam_taked_at: Date,
  exam_score: string,
  student_uuid: string,
  exam_created_at: Date
}
```

### 🌍 NATIONALITIES (Nationalités)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  label: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  nationality_uuid: string,
  nationality_label: string,
  nationality_created_at: Date
}
```

### 🎯 ORIENTATIONS
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  type: string,
  description: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  orientation_uuid: string,
  orientation_type: string,
  orientation_description: string,
  orientation_created_at: Date
}
```

### 💰 FINANCINGS (Financements)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  type: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  financing_uuid: string,
  financing_type: string,
  financing_created_at: Date
}
```

### ♿ DISABILITIES (Handicaps)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  label: string,
  description: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  disability_uuid: string,
  disability_label: string,
  disability_description: string,
  disability_created_at: Date
}
```

### ⚧️ GENDERS (Genres)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  label: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  gender_uuid: string,
  gender_label: string,
  gender_created_at: Date
}
```

### 📆 PERIODS (Périodes)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  label: string,
  startedAt: Date,
  endedAt: Date,
  actual_period: boolean
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  period_uuid: string,
  period_label: string,
  period_started_at: Date,
  period_ended_at: Date,
  period_actual_period: boolean,
  period_created_at: Date
}
```

### 📊 STATUS (Statuts)
```typescript
// ❌ ANCIENS CHAMPS (à remplacer)
{
  id: string,
  label: string
}

// ✅ NOUVEAUX CHAMPS (schéma réel)
{
  status_uuid: string,
  status_label: string,
  status_created_at: Date
}
```

### 🇫🇷 FRENCH_LEVELS (Niveaux de français)
```typescript
// ✅ CHAMPS (déjà conformes)
{
  french_level_uuid: string,
  french_level_label: string,
  french_level_created_at: Date
}
```

### 🚪 EXIT_REASONS (Raisons de sortie)
```typescript
// ✅ CHAMPS (déjà conformes)
{
  exit_reason_uuid: string,
  exit_reason_label: string,
  exit_reason_created_at: Date
}
```

### 🏠 ADDRESSES (Adresses)
```typescript
// ✅ CHAMPS (déjà conformes)
{
  address_uuid: string,
  address_street: string,
  address_city: string,
  address_postal_code: string,
  address_country: string,
  address_created_at: Date
}
```

## 🔄 CHANGEMENTS DANS LES PARAMÈTRES DE REQUÊTE

### Filtres et recherches
```typescript
// ❌ ANCIENS PARAMÈTRES
?firstname=John&lastname=Doe&email=john@example.com

// ✅ NOUVEAUX PARAMÈTRES
?student_firstname=John&student_lastname=Doe&student_mail=john@example.com
```

### Paramètres d'URL
```typescript
// ❌ ANCIENS
/students/:id/groups/:groupId
/courses/:id/teachers/:teacherId

// ✅ NOUVEAUX
/students/:id/groups/:group_uuid
/courses/:id/teachers/:teacher_uuid
```

## 🛠️ ACTIONS À EFFECTUER DANS LE FRONTEND

### 1. **Interfaces TypeScript**
Mettre à jour TOUTES les interfaces avec les nouveaux noms de champs.

### 2. **Services Angular**
- Modifier tous les appels HTTP
- Mettre à jour les paramètres de requête
- Corriger les URLs avec les nouveaux noms de paramètres

### 3. **Composants**
- Mettre à jour les propriétés des objets
- Corriger les bindings dans les templates
- Ajuster les formulaires réactifs

### 4. **Templates HTML**
- Mettre à jour tous les `{{ objet.ancien_champ }}` vers `{{ objet.nouveau_champ }}`
- Corriger les `*ngFor` et les pipes

### 5. **Formulaires**
- Mettre à jour les `FormControl` names
- Corriger les validations
- Ajuster les mappings de données

## ⚡ EXEMPLE DE MIGRATION RAPIDE

```typescript
// ❌ AVANT
interface Student {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

const student: Student = {
  id: response.id,
  firstname: response.firstname,
  lastname: response.lastname,
  email: response.email
};

// ✅ APRÈS
interface Student {
  student_uuid: string;
  student_firstname: string;
  student_lastname: string;
  student_mail: string;
}

const student: Student = {
  student_uuid: response.student_uuid,
  student_firstname: response.student_firstname,
  student_lastname: response.student_lastname,
  student_mail: response.student_mail
};
```

## 🎯 PRIORITÉS DE MIGRATION

1. **CRITIQUE** : Interfaces et services (empêche la compilation)
2. **IMPORTANT** : Composants principaux (étudiants, utilisateurs)
3. **MOYEN** : Formulaires et validations
4. **FAIBLE** : Affichage et cosmétique

## ✅ VÉRIFICATION

Pour vérifier que tout fonctionne :
1. Compiler sans erreurs TypeScript
2. Tester les appels API dans la console réseau
3. Vérifier que les données s'affichent correctement
4. Tester les formulaires de création/modification

---

**🚨 IMPORTANT** : Cette migration est **OBLIGATOIRE**. L'ancienne API avec les transformations n'existe plus. Tous les endpoints retournent maintenant les vrais noms de champs de la base de données. 