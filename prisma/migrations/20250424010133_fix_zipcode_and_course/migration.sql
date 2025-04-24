/*
  Warnings:

  - You are about to drop the column `course_id` on the `Absence` table. All the data in the column will be lost.
  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `Todolist` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Todolist` table. All the data in the column will be lost.
  - You are about to drop the column `share` on the `Todolist` table. All the data in the column will be lost.
  - You are about to drop the column `course_id` on the `UserCourse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,session_id]` on the table `Absence` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,session_id]` on the table `UserCourse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `session_id` to the `Absence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `UserCourse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Absence" DROP CONSTRAINT "Absence_course_id_fkey";

-- DropForeignKey
ALTER TABLE "UserCourse" DROP CONSTRAINT "UserCourse_course_id_fkey";

-- DropIndex
DROP INDEX "Absence_student_id_course_id_key";

-- DropIndex
DROP INDEX "UserCourse_user_id_course_id_key";

-- AlterTable
ALTER TABLE "Absence" DROP COLUMN "course_id",
ADD COLUMN     "session_id" TEXT NOT NULL;

-- Modification pour Address.zipcode (conversion de string vers int)
-- On crée une colonne temporaire pour stocker les nouveaux int
ALTER TABLE "Address" ADD COLUMN "zipcode_int" INTEGER;
-- On convertit les valeurs existantes
UPDATE "Address" SET "zipcode_int" = CAST("zipcode" AS INTEGER) WHERE "zipcode" ~ E'^\\d+$';
-- Puis on supprime l'ancienne colonne
ALTER TABLE "Address" DROP COLUMN "zipcode";
-- On renomme la nouvelle colonne
ALTER TABLE "Address" RENAME COLUMN "zipcode_int" TO "zipcode";
-- On rend la colonne NOT NULL
ALTER TABLE "Address" ALTER COLUMN "zipcode" SET NOT NULL;

-- AlterTable - Course: on ajoute d'abord session_id comme optionnel
ALTER TABLE "Course" DROP CONSTRAINT "Course_pkey",
DROP COLUMN "id",
ADD COLUMN     "session_id" TEXT;

-- Mettre à jour les valeurs existantes dans Course
UPDATE "Course" SET "session_id" = gen_random_uuid()::text WHERE "session_id" IS NULL;

-- Maintenant on peut rendre session_id obligatoire et clé primaire
ALTER TABLE "Course" ALTER COLUMN "session_id" SET NOT NULL;
ALTER TABLE "Course" ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("session_id");

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "date_entree_france" SET DATA TYPE TEXT,
ALTER COLUMN "date_test_initial" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Todolist" DROP COLUMN "completed",
DROP COLUMN "password",
DROP COLUMN "share",
ALTER COLUMN "completionPercentage" SET DEFAULT 0,
ALTER COLUMN "completionPercentage" SET DATA TYPE DECIMAL(15,2);

-- AlterTable
ALTER TABLE "UserCourse" DROP COLUMN "course_id",
ADD COLUMN     "session_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Absence_student_id_session_id_key" ON "Absence"("student_id", "session_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserCourse_user_id_session_id_key" ON "UserCourse"("user_id", "session_id");

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Course"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Course"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;
