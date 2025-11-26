-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pendiente', 'progreso', 'completada');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Presupuestar', 'Trabajo', 'Tarea_comercial', 'Tarea_administrativa', 'Reunion', 'Visita', 'RRHH', 'Revision');

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "responsable" TEXT NOT NULL,
    "categoria" "Category" NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accion" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "texto" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Accion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Accion" ADD CONSTRAINT "Accion_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
