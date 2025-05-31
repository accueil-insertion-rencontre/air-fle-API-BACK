/*
  Warnings:

  - You are about to drop the column `dueAt` on the `Subtask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "departure_level_id" TEXT;

-- AlterTable
ALTER TABLE "Subtask" DROP COLUMN "dueAt";

-- CreateTable
CREATE TABLE "LearnerHistory" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "action_type" TEXT NOT NULL,
    "change_type" TEXT NOT NULL,
    "change_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previous_data" JSONB,
    "new_data" JSONB,
    "description" TEXT,
    "changed_by_user_id" TEXT,

    CONSTRAINT "LearnerHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LearnerHistory_student_id_change_date_idx" ON "LearnerHistory"("student_id", "change_date");

-- CreateIndex
CREATE INDEX "LearnerHistory_entity_type_action_type_idx" ON "LearnerHistory"("entity_type", "action_type");

-- CreateIndex
CREATE INDEX "LearnerHistory_change_type_idx" ON "LearnerHistory"("change_type");

-- CreateIndex
CREATE INDEX "LearnerHistory_entity_id_idx" ON "LearnerHistory"("entity_id");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_departure_level_id_fkey" FOREIGN KEY ("departure_level_id") REFERENCES "FrenchLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerHistory" ADD CONSTRAINT "LearnerHistory_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearnerHistory" ADD CONSTRAINT "LearnerHistory_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
