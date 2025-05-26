/*
  Warnings:

  - You are about to drop the column `todolist_id` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Todolist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_todolist_id_fkey";

-- DropForeignKey
ALTER TABLE "Todolist" DROP CONSTRAINT "Todolist_user_id_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "todolist_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Todolist";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
