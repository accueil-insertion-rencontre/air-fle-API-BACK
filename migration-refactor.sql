-- Migration pour refactoriser Todolist -> Task direct à User
-- Étape 1: Ajouter la colonne user_id à Task
ALTER TABLE "Task" ADD COLUMN "user_id" TEXT;

-- Étape 2: Migrer les données - connecter chaque Task à son User via Todolist
UPDATE "Task" 
SET "user_id" = (
  SELECT "user_id" 
  FROM "Todolist" 
  WHERE "Todolist"."id" = "Task"."todolist_id"
);

-- Étape 3: Rendre user_id NOT NULL après migration des données
ALTER TABLE "Task" ALTER COLUMN "user_id" SET NOT NULL;

-- Étape 4: Ajouter la contrainte de clé étrangère
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" 
FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Étape 5: Supprimer l'ancienne contrainte et colonne todolist_id
ALTER TABLE "Task" DROP CONSTRAINT "Task_todolist_id_fkey";
ALTER TABLE "Task" DROP COLUMN "todolist_id";

-- Étape 6: Supprimer le champ dueAt des Subtask (seules les Task ont une date d'échéance)
ALTER TABLE "Subtask" DROP COLUMN "dueAt";

-- Étape 7: Supprimer la table Todolist
DROP TABLE "Todolist"; 