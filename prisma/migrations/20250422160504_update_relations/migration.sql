/*
  Warnings:

  - You are about to drop the column `session_id` on the `Absence` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,course_id]` on the table `Absence` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[group_id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `course_id` to the `Absence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Absence" DROP CONSTRAINT "Absence_session_id_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_session_id_fkey";

-- DropIndex
DROP INDEX "Absence_student_id_session_id_key";

-- DropIndex
DROP INDEX "Course_session_id_key";

-- AlterTable
ALTER TABLE "Absence" DROP COLUMN "session_id",
ADD COLUMN     "course_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "session_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Absence_student_id_course_id_key" ON "Absence"("student_id", "course_id");

-- CreateIndex
CREATE INDEX "Course_user_id_idx" ON "Course"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_group_id_key" ON "Session"("group_id");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
