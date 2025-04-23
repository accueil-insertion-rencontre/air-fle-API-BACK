/*
  Warnings:

  - You are about to drop the column `period_id` on the `Session` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_period_id_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "period_id";
