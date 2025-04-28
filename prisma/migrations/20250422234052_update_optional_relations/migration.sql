-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_current_level_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_exit_reason_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_orientation_id_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "orientation_id" DROP NOT NULL,
ALTER COLUMN "current_level_id" DROP NOT NULL,
ALTER COLUMN "exit_reason_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_current_level_id_fkey" FOREIGN KEY ("current_level_id") REFERENCES "FrenchLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_orientation_id_fkey" FOREIGN KEY ("orientation_id") REFERENCES "Orientation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_exit_reason_id_fkey" FOREIGN KEY ("exit_reason_id") REFERENCES "ExitReason"("id") ON DELETE SET NULL ON UPDATE CASCADE;
