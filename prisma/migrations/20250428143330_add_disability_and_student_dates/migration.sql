-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "date_cir" TIMESTAMP(3),
ADD COLUMN     "date_titre_sejour" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Disability" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Disability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentDisability" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "disability_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentDisability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentDisability_student_id_disability_id_key" ON "StudentDisability"("student_id", "disability_id");

-- AddForeignKey
ALTER TABLE "StudentDisability" ADD CONSTRAINT "StudentDisability_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentDisability" ADD CONSTRAINT "StudentDisability_disability_id_fkey" FOREIGN KEY ("disability_id") REFERENCES "Disability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
