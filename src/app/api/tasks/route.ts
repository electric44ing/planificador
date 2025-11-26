import { getTasksData } from "@/lib/data";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tasks = await getTasksData();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Error fetching tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { acciones, responsableId, collaboratorIds, ...taskData } = data;

    // Convert date strings to Date objects
    if (taskData.startDate) taskData.startDate = new Date(taskData.startDate);
    if (taskData.endDate) taskData.endDate = new Date(taskData.endDate);

    const dataToSave: any = { ...taskData };

    if (responsableId) {
      dataToSave.responsable = {
        connect: { id: responsableId },
      };
      // If a responsible is assigned on creation, status is 'pendiente'
      dataToSave.status = "pendiente";
    } else {
      dataToSave.status = "sin_planificar";
    }

    if (collaboratorIds && collaboratorIds.length > 0) {
      dataToSave.collaborators = {
        connect: collaboratorIds.map((id: string) => ({ id })),
      };
    }

    const accionesConFechas = (acciones || []).map((accion: any) => ({
      texto: accion.texto,
      fecha: new Date(accion.fecha),
    }));

    const newTask = await prisma.task.create({
      data: {
        ...dataToSave,
        acciones: {
          create: accionesConFechas,
        },
      },
      include: {
        acciones: true,
        responsable: true,
        collaborators: true,
      },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    // Prisma validation errors can be caught here
    if (
      error instanceof Error &&
      "code" in error &&
      (error as any).code === "P2002"
    ) {
      return NextResponse.json(
        { message: "A validation error occurred" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Error creating task" },
      { status: 500 },
    );
  }
}
