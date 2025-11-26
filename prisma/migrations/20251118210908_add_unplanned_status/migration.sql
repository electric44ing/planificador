-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'sin_planificar';

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "responsable" DROP NOT NULL;
