# Refactoring Todolist → Task/Subtask

## Résumé des changements

Ce refactoring supprime complètement le concept de **Todolist** pour simplifier l'architecture :

**Avant :** `User → Todolist → Task → Subtask`
**Après :** `User → Task → Subtask`

## Modifications apportées

### 1. Schéma Prisma
- **Supprimé :** modèle `Todolist`
- **Modifié :** modèle `Task` 
  - `todolist_id` → `user_id`
  - Relation directe avec `User`

### 2. Structure des modules
- **Renommé :** `src/todolist/` → `src/task/`
- **Supprimé :** 
  - `TodolistService`
  - `TodolistController` 
  - DTOs `CreateTodolistDto`, `UpdateTodolistDto`
- **Modifié :**
  - `TaskService` : gère directement les tâches utilisateur
  - `SubtaskService` : supprimé références todolist
  - `TaskController` : nouvelle API simplifiée

### 3. API endpoints

**Nouveaux endpoints :**
```
GET    /tasks              # Toutes les tâches de l'utilisateur
POST   /tasks              # Créer une tâche
GET    /tasks/:id          # Une tâche par ID
PATCH  /tasks/:id          # Modifier une tâche
DELETE /tasks/:id          # Supprimer une tâche
GET    /tasks/:id/statistics # Statistiques d'une tâche

POST   /tasks/:taskId/subtasks     # Créer une sous-tâche
GET    /tasks/:taskId/subtasks     # Sous-tâches d'une tâche
GET    /tasks/subtasks/:id         # Une sous-tâche par ID
PATCH  /tasks/subtasks/:id         # Modifier une sous-tâche
DELETE /tasks/subtasks/:id         # Supprimer une sous-tâche
PATCH  /tasks/subtasks/:id/toggle  # Basculer statut sous-tâche

GET    /tasks/user/all             # Toutes les tâches + stats globales
```

### 4. Permissions
- `todolist:read/write/delete` → `task:read/write/delete`

### 5. Migration de données
Le script `migration-refactor.sql` migre automatiquement :
1. Ajoute `user_id` à `Task`
2. Migre les données via les relations `Todolist`
3. Supprime `todolist_id` et `Todolist`

## Avantages

✅ **Simplicité** : Architecture plus directe et compréhensible
✅ **Performance** : Moins de jointures nécessaires
✅ **Maintenabilité** : Moins de couches d'abstraction
✅ **Flexibilité** : Les tâches appartiennent directement aux utilisateurs

## Migration

1. **Backup de la base de données**
2. **Appliquer le script SQL :**
   ```bash
   # Si Docker est démarré
   docker exec -i postgres-dev psql -U user -d airfle < migration-refactor.sql
   ```
3. **Régénérer le client Prisma :**
   ```bash
   npx prisma generate
   ```
4. **Tester l'API**

## Nouveaux types TypeScript

```typescript
// Avant
type TodolistWithRelations = {
  id: string;
  tasks: Task[];
  user: User;
}

// Après  
type TaskWithRelations = {
  id: string;
  user: User;
  subtasks: Subtask[];
}
```

## Tests recommandés

- [ ] Créer une tâche via `POST /tasks`
- [ ] Lister les tâches via `GET /tasks`
- [ ] Ajouter des sous-tâches via `POST /tasks/:id/subtasks`
- [ ] Vérifier les statistiques via `GET /tasks/user/all`
- [ ] Tester les permissions selon les rôles 