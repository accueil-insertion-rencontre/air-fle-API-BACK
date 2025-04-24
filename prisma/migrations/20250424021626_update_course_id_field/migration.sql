/*
  Warnings:

  - You are about to drop the column `session_id` on the `Absence` table. All the data in the column will be lost.
  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `session_id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `UserCourse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,course_id]` on the table `Absence` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,course_id]` on the table `UserCourse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `course_id` to the `Absence` table without a default value. This is not possible if the table is not empty.
  - The required column `course_id` was added to the `Course` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `course_id` to the `UserCourse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Absence" DROP CONSTRAINT "Absence_session_id_fkey";

-- DropForeignKey
ALTER TABLE "UserCourse" DROP CONSTRAINT "UserCourse_session_id_fkey";

-- DropIndex
DROP INDEX "Absence_student_id_session_id_key";

-- DropIndex
DROP INDEX "UserCourse_user_id_session_id_key";

-- AlterTable
ALTER TABLE "Absence" DROP COLUMN "session_id",
ADD COLUMN     "course_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Course" DROP CONSTRAINT "Course_pkey",
DROP COLUMN "session_id",
ADD COLUMN     "course_id" TEXT NOT NULL,
ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("course_id");

-- AlterTable
ALTER TABLE "UserCourse" DROP COLUMN "session_id",
ADD COLUMN     "course_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Absence_student_id_course_id_key" ON "Absence"("student_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserCourse_user_id_course_id_key" ON "UserCourse"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "Absence" ADD CONSTRAINT "Absence_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;
