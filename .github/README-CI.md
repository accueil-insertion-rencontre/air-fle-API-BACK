# 🚀 Documentation CI/CD - Air FLE API

## 📋 **Vue d'ensemble**

Cette CI/CD automatise l'exécution de **41 tests** (Student + Financing) sur chaque push et Pull Request.

---

## 🎯 **Workflows Créés**

### **1. 🚀 CI/CD Pipeline** (`.github/workflows/ci.yml`)
- **Déclencheurs** : Push sur `main`/`develop`
- **Jobs** : Tests complets + Build Docker + Résumé
- **Services** : PostgreSQL 15 + Redis 7

### **2. 🔍 PR Verification** (`.github/workflows/pr-check.yml`)
- **Déclencheurs** : Pull Requests vers `main`/`develop`
- **Jobs** : Vérifications bloquantes + Tests obligatoires + Rapport
- **Commentaires automatiques** sur les PR

---

## 🧪 **Tests Exécutés**

### **🎓 Module Student (34 tests unitaires)**
```bash
# Tests simples/mocks sans dépendances
test/student/student.spec.ts          # 10 tests basiques
test/student/student.service.spec.ts  # 8 tests service
test/student/student.controller.spec.ts # 6 tests controller
test/student/student.rbac.spec.ts     # 10 tests RBAC
```

### **💰 Module Financing (7 tests intégration)**
```bash
# Tests HTTP réels avec base de données
test/financing/financing.integration.spec.ts # 7 tests endpoints CRUD
```

---

## 📊 **Répartition par Gravité**

| Gravité | Nb Tests | Description | Statut CI |
|---------|----------|-------------|-----------|
| 🔴 **Critique** | **17 tests** | Auth, CRUD, validation | ❌ **Bloquant** |
| 🟡 **Majeur** | **18 tests** | RBAC, erreurs, flux | ❌ **Bloquant** |
| 🟢 **Mineur** | **6 tests** | Listes, pagination | ✅ **Non-bloquant** |

---

## 🏗️ **Architecture CI**

### **Services automatiques** :
- **PostgreSQL 15** : Base de données pour tests intégration
- **Redis 7** : Cache pour l'application complète
- **Node.js 20** : Environnement d'exécution

### **Variables d'environnement** :
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/air_fle_test
JWT_SECRET=test_jwt_secret_for_ci_cd_pipeline_2024
REDIS_HOST=localhost
REDIS_PORT=6379
NODE_ENV=test
```

---

## 🚦 **Statuts des Builds**

### **✅ Critères de succès** :
- ✅ ESLint passe sans erreur
- ✅ Prettier format correct
- ✅ Build NestJS réussit
- ✅ 41/41 tests passent
- ✅ Docker build réussit

### **❌ Critères d'échec** :
- ❌ Erreurs de linting
- ❌ Format code incorrect
- ❌ Échec build
- ❌ Tests en échec
- ❌ Docker build échoue

---

## 🛠️ **Commandes Locales**

### **Reproduire la CI localement** :
```bash
# 1. Install dependencies
npm ci

# 2. Linting
npm run lint

# 3. Format check
npm run format -- --check

# 4. Build
npm run build

# 5. Tests Student (unitaires)
npm run test test/student/

# 6. Tests Financing (intégration) - nécessite DB
npm run test test/financing/

# 7. Tous les tests avec coverage
npm run test:cov
```

### **Setup base de données test** :
```bash
# Docker PostgreSQL
docker run --name postgres-test -e POSTGRES_PASSWORD=password -e POSTGRES_DB=air_fle_test -p 5432:5432 -d postgres:15

# Migrations
DATABASE_URL=postgresql://postgres:password@localhost:5432/air_fle_test npx prisma migrate deploy
```

---

## 📈 **Rapports Automatiques**

### **🔍 Pull Requests** :
- ✅ Commentaire automatique avec statut détaillé
- 📊 Résumé : 17 critiques + 18 majeurs + 6 mineurs
- 🚀 Validation avant merge automatique

### **📊 Coverage** :
- 📁 Upload automatique vers Codecov
- 📈 Suivi de l'évolution de la couverture
- 🎯 Seuils de qualité configurables

---

## 🚨 **Actions en cas d'échec**

### **❌ Linting échoue** :
```bash
npm run lint --fix  # Auto-fix
```

### **❌ Format incorrect** :
```bash
npm run format     # Auto-format
```

### **❌ Tests échouent** :
```bash
# Tests unitaires Student
npm run test test/student/ -- --reporter=verbose

# Tests intégration Financing
npm run test test/financing/ -- --reporter=verbose
```

### **❌ Build échoue** :
```bash
npm run build      # Vérifier les erreurs TypeScript
```

---

## 🎯 **Métriques de Performance**

### **⏱️ Temps d'exécution** :
- **Tests Student** : ~30 secondes (34 tests unitaires)
- **Tests Financing** : ~60 secondes (7 tests + DB setup)
- **Build complet** : ~45 secondes
- **Total CI** : ~3-4 minutes

### **📦 Ressources** :
- **RAM** : 2GB (services DB + Redis + Node)
- **CPU** : 2 vCPUs (parallélisation jobs)
- **Storage** : 1GB (node_modules + build)

---

## 🚀 **Déploiement**

### **Branches protégées** :
- `main` : Production (CI obligatoire)
- `develop` : Staging (CI obligatoire)

### **Stratégie de merge** :
1. ✅ Tous les tests passent (41/41)
2. ✅ Code review approuvée
3. ✅ Pas de conflits
4. 🚀 Auto-deploy après merge

---

## 📞 **Support & Debug**

### **Logs détaillés** :
- GitHub Actions : Logs complets par job
- Test results : Output Vitest avec stack traces
- Coverage : Rapports détaillés par fichier

### **Debug local** :
```bash
# Mode debug
npm run test:debug test/student/

# Mode watch
npm run test:watch test/financing/

# Verbose mode
npm run test -- --reporter=verbose
```

---

*Documentation CI/CD - Air FLE API* ✅ 