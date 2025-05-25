-- AlterTable
ALTER TABLE "Todolist" ADD COLUMN     "parentTaskId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "Todolist" ADD CONSTRAINT "Todolist_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Todolist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
