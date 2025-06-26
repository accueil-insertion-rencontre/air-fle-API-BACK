# 🔐 **RBAC - Matrice des Permissions**

## 📊 **Vue d'ensemble des Rôles**

| Rôle | Description | Niveau d'accès |
|------|-------------|----------------|
| **👑 Admin** | Administrateur système | Accès complet à toutes les fonctionnalités |
| **👨‍🏫 Teacher** | Enseignant/Formateur | Accès aux fonctionnalités pédagogiques et gestion étudiants |

---

## 🎯 **Matrice des Permissions par Module**

### Légende
- ✅ **Autorisé** (Accès complet)
- ❌ **Interdit** (Aucun accès)

---

## 👥 **MODULE UTILISATEURS**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire utilisateurs** | ✅ | ❌ |
| **Créer utilisateur** | ✅ | ❌ |
| **Modifier utilisateur** | ✅ | ❌ |
| **Supprimer utilisateur** | ✅ | ❌ |
| **Gérer statut utilisateur** | ✅ | ❌ |
| **Consulter profil personnel** | ✅ | ✅ |

---

## 🎓 **MODULE ÉTUDIANTS**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire étudiants** | ✅ | ✅ |
| **Créer étudiant** | ✅ | ✅ |
| **Modifier étudiant** | ✅ | ✅ |
| **Supprimer étudiant** | ✅ | ✅ |
| **Gérer handicaps étudiant** | ✅ | ❌ |
| **Consulter historique étudiant** | ✅ | ✅ |

---

## 👥 **MODULE GROUPES**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire groupes** | ✅ | ✅ |
| **Créer groupe** | ✅ | ✅ |
| **Modifier groupe** | ✅ | ✅ |
| **Supprimer groupe** | ✅ | ❌ |
| **Ajouter étudiant au groupe** | ✅ | ✅ |
| **Retirer étudiant du groupe** | ✅ | ✅ |
| **Consulter étudiants du groupe** | ✅ | ✅ |

---

## 📚 **MODULE COURS**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire cours** | ✅ | ✅ |
| **Créer cours** | ✅ | ✅ |
| **Modifier cours** | ✅ | ✅ |
| **Supprimer cours** | ✅ | ❌ |
| **Assigner enseignant** | ✅ | ✅ |
| **Retirer tous les enseignants** | ✅ | ❌ |

---

## 📝 **MODULE EXAMENS**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire examens** | ✅ | ✅ |
| **Créer examen** | ✅ | ✅ |
| **Modifier examen** | ✅ | ✅ |
| **Supprimer examen** | ✅ | ❌ |

---

## 🚫 **MODULE ABSENCES**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire absences** | ✅ | ✅ |
| **Créer absence** | ✅ | ✅ |
| **Modifier absence** | ✅ | ✅ |
| **Supprimer absence** | ✅ | ✅ |

---

## 📅 **MODULE SESSIONS**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire sessions** | ✅ | ✅ |
| **Créer session** | ✅ | ✅ |
| **Modifier session** | ✅ | ❌ |
| **Supprimer session** | ✅ | ❌ |

---

## 🔄 **MODULE CONTINUATION**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire continuations** | ✅ | ✅ |
| **Créer continuation** | ✅ | ✅ |
| **Modifier continuation** | ✅ | ✅ |
| **Supprimer continuation** | ✅ | ❌ |

---

## 📄 **MODULE DOCUMENTS**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Générer certificats** | ✅ | ✅ |
| **Prévisualiser certificats** | ✅ | ✅ |
| **Consulter données certificat** | ✅ | ✅ |

---

## 📋 **MODULE TÂCHES**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire ses tâches** | ✅ | ✅ |
| **Créer tâche** | ✅ | ✅ |
| **Modifier ses tâches** | ✅ | ✅ |
| **Supprimer ses tâches** | ✅ | ✅ |
| **Gérer sous-tâches** | ✅ | ✅ |
| **Consulter statistiques** | ✅ | ✅ |

---

## 🔧 **MODULES RÉFÉRENTIELS** (Configuration)

### 📊 **Statuts**
| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire statuts** | ✅ | ✅ |
| **Créer statut** | ✅ | ❌ |
| **Modifier statut** | ✅ | ❌ |
| **Supprimer statut** | ✅ | ❌ |

### 🧑‍🦽 **Handicaps**
| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire handicaps** | ✅ | ✅ |
| **Créer handicap** | ✅ | ❌ |
| **Modifier handicap** | ✅ | ❌ |
| **Supprimer handicap** | ✅ | ❌ |

### 🏳️ **Nationalités, Genres, Niveaux Français, etc.**
| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire données référentielles** | ✅ | ✅ |
| **Créer/Modifier/Supprimer** | ✅ | ✅ |

### ⏰ **Périodes**
| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire périodes** | ✅ | ✅ |
| **Créer/Modifier/Supprimer** | ✅ | ❌ |

### 🎯 **Orientations**
| Action | Admin | Teacher |
|--------|-------|---------|
| **Lire orientations** | ✅ | ✅ |
| **Créer/Modifier/Supprimer** | ✅ | ❌ |

---

## 🔐 **MODULE AUTHENTIFICATION**

| Action | Admin | Teacher |
|--------|-------|---------|
| **Connexion/Déconnexion** | ✅ | ✅ |
| **Changer mot de passe** | ✅ | ✅ |
| **Réinitialiser mot de passe** | ✅ | ✅ |
| **Consulter ses permissions** | ✅ | ✅ |
| **Vérifier permissions** | ✅ | ✅ |
| **Lister toutes les permissions** | ✅ | ❌ |
| **Lister tous les rôles** | ✅ | ❌ |
| **Consulter permissions d'un rôle** | ✅ | ❌ |

---

## 📈 **Statistiques d'utilisation**

| Fonctionnalité | Utilisation Admin | Utilisation Teacher |
|----------------|------------------|-------------------|
| **Configuration système** | 🔥🔥🔥🔥🔥 | 🔥 |
| **Suivi pédagogique** | 🔥🔥🔥 | 🔥🔥🔥🔥🔥 |
| **Administration utilisateurs** | 🔥��🔥🔥🔥 | ❌ |

---

## ⚠️ **Notes de Sécurité**

### 🔒 **Restrictions importantes :**
1. **Teachers** ne peuvent pas gérer d'autres utilisateurs
2. **Teachers** peuvent supprimer des étudiants mais pas des cours
3. Seuls les **Admins** peuvent gérer les référentiels système
4. Certaines opérations critiques (suppression de sessions, périodes) sont réservées aux **Admins**

### 🛡️ **Sécurité renforcée :**
- Limitation des tentatives de connexion (5 max)
- Verrouillage temporaire après échecs (15 min)
- Tokens de réinitialisation (validité 24h)
- JWT avec expiration (1 jour)

---

## 🎯 **Principe SOLID respecté**

✅ **Single Responsibility** : Chaque rôle a des responsabilités bien définies  
✅ **Interface Segregation** : Interfaces spécialisées par domaine  
✅ **Dependency Inversion** : Injection de dépendances pour la sécurité  

Cette matrice assure une **séparation claire des responsabilités** entre administrateurs et enseignants, respectant les principes de sécurité et les bonnes pratiques SOLID.

---

*Dernière mise à jour : Janvier 2025* 