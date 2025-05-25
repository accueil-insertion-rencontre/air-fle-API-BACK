/*
  Warnings:

  - You are about to drop the column `completionPercentage` on the `Todolist` table. All the data in the column will be lost.
  - You are about to drop the column `parentTaskId` on the `Todolist` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Todolist` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Todolist" DROP CONSTRAINT "Todolist_parentTaskId_fkey";

-- AlterTable
ALTER TABLE "Todolist" DROP COLUMN "completionPercentage",
DROP COLUMN "parentTaskId",
DROP COLUMN "status";

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completionPercentage" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3),
    "todolist_id" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subtask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3),
    "task_id" TEXT NOT NULL,

    CONSTRAINT "Subtask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_todolist_id_fkey" FOREIGN KEY ("todolist_id") REFERENCES "Todolist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
