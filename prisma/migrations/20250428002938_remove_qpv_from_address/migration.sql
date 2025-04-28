/*
  Warnings:

  - You are about to drop the column `qpv` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the `UserWorkingHour` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkingHour` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserWorkingHour" DROP CONSTRAINT "UserWorkingHour_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserWorkingHour" DROP CONSTRAINT "UserWorkingHour_working_hour_id_fkey";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "qpv";

-- DropTable
DROP TABLE "UserWorkingHour";

-- DropTable
DROP TABLE "WorkingHour";
