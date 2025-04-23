/*
  Warnings:

  - You are about to drop the column `teacher` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `FrenchLevel` table. All the data in the column will be lost.
  - You are about to drop the column `initial_period` on the `Period` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Status` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `Status` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `center_initial` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `french_level_id` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `ExitReasonExam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TodolistUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkingHours` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `group_id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taked_at` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_level_id` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exit_reason_id` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `financing_id` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initial_level_id` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_id` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Made the column `gender_id` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nationality_id` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orientation_id` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `title` to the `Todolist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Todolist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ExitReasonExam" DROP CONSTRAINT "ExitReasonExam_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "ExitReasonExam" DROP CONSTRAINT "ExitReasonExam_exit_reason_id_fkey";

-- DropForeignKey
ALTER TABLE "ExitReasonExam" DROP CONSTRAINT "ExitReasonExam_student_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupStudent" DROP CONSTRAINT "GroupStudent_group_id_fkey";

-- DropForeignKey
ALTER TABLE "GroupStudent" DROP CONSTRAINT "GroupStudent_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Status" DROP CONSTRAINT "Status_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_address_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_french_level_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_gender_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_nationality_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_orientation_id_fkey";

-- DropForeignKey
ALTER TABLE "TodolistUser" DROP CONSTRAINT "TodolistUser_todolist_id_fkey";

-- DropForeignKey
ALTER TABLE "TodolistUser" DROP CONSTRAINT "TodolistUser_user_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkingHours" DROP CONSTRAINT "WorkingHours_user_id_fkey";

-- DropIndex
DROP INDEX "Course_user_id_idx";

-- DropIndex
DROP INDEX "Session_group_id_key";

-- DropIndex
DROP INDEX "Student_email_key";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "qpv" TEXT;

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "teacher",
DROP COLUMN "text",
DROP COLUMN "title",
DROP COLUMN "user_id",
ADD COLUMN     "day" TIMESTAMP(3),
ADD COLUMN     "end_hour" TIMESTAMP(3),
ADD COLUMN     "group_id" TEXT NOT NULL,
ADD COLUMN     "intitule" TEXT,
ADD COLUMN     "start_hour" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "type",
ADD COLUMN     "note" TEXT,
ADD COLUMN     "student_id" TEXT NOT NULL,
ADD COLUMN     "taked_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FrenchLevel" DROP COLUMN "label",
ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "session_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Period" DROP COLUMN "initial_period",
ADD COLUMN     "actual_period" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "group_id",
ADD COLUMN     "label" TEXT;

-- AlterTable
ALTER TABLE "Status" DROP COLUMN "createdAt",
DROP COLUMN "student_id";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "address_id",
DROP COLUMN "age",
DROP COLUMN "center_initial",
DROP COLUMN "french_level_id",
DROP COLUMN "photo",
ADD COLUMN     "current_level_id" TEXT NOT NULL,
ADD COLUMN     "date_test_initial" TIMESTAMP(3),
ADD COLUMN     "exit_reason_id" TEXT NOT NULL,
ADD COLUMN     "financing_id" TEXT NOT NULL,
ADD COLUMN     "initial_level_id" TEXT NOT NULL,
ADD COLUMN     "placeOfBirth" TEXT,
ADD COLUMN     "status_id" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "gender_id" SET NOT NULL,
ALTER COLUMN "nationality_id" SET NOT NULL,
ALTER COLUMN "orientation_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "Todolist" ADD COLUMN     "dueAt" TIMESTAMP(3),
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthdate" TIMESTAMP(3);

-- DropTable
DROP TABLE "ExitReasonExam";

-- DropTable
DROP TABLE "GroupStudent";

-- DropTable
DROP TABLE "TodolistUser";

-- DropTable
DROP TABLE "WorkingHours";

-- CreateTable
CREATE TABLE "WorkingHour" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkingHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financing" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Financing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Continuation" (
    "id" TEXT NOT NULL,
    "temporality" TEXT,
    "commentary" TEXT,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "Continuation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAddress" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,

    CONSTRAINT "StudentAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentGroup" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "StudentGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCourse" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "UserCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupPeriod" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "period_id" TEXT NOT NULL,

    CONSTRAINT "GroupPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorkingHour" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "working_hour_id" TEXT NOT NULL,

    CONSTRAINT "UserWorkingHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Continuation_student_id_key" ON "Continuation"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAddress_student_id_address_id_key" ON "StudentAddress"("student_id", "address_id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentGroup_student_id_group_id_key" ON "StudentGroup"("student_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserCourse_user_id_course_id_key" ON "UserCourse"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupPeriod_group_id_period_id_key" ON "GroupPeriod"("group_id", "period_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkingHour_user_id_working_hour_id_key" ON "UserWorkingHour"("user_id", "working_hour_id");

-- CreateIndex
CREATE INDEX "Course_group_id_idx" ON "Course"("group_id");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_gender_id_fkey" FOREIGN KEY ("gender_id") REFERENCES "Gender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_current_level_id_fkey" FOREIGN KEY ("current_level_id") REFERENCES "FrenchLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_initial_level_id_fkey" FOREIGN KEY ("initial_level_id") REFERENCES "FrenchLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_nationality_id_fkey" FOREIGN KEY ("nationality_id") REFERENCES "Nationality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_orientation_id_fkey" FOREIGN KEY ("orientation_id") REFERENCES "Orientation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_exit_reason_id_fkey" FOREIGN KEY ("exit_reason_id") REFERENCES "ExitReason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_financing_id_fkey" FOREIGN KEY ("financing_id") REFERENCES "Financing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todolist" ADD CONSTRAINT "Todolist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Continuation" ADD CONSTRAINT "Continuation_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAddress" ADD CONSTRAINT "StudentAddress_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAddress" ADD CONSTRAINT "StudentAddress_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentGroup" ADD CONSTRAINT "StudentGroup_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCourse" ADD CONSTRAINT "UserCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupPeriod" ADD CONSTRAINT "GroupPeriod_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupPeriod" ADD CONSTRAINT "GroupPeriod_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkingHour" ADD CONSTRAINT "UserWorkingHour_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkingHour" ADD CONSTRAINT "UserWorkingHour_working_hour_id_fkey" FOREIGN KEY ("working_hour_id") REFERENCES "WorkingHour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
