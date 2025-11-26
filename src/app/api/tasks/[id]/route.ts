import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  try {
    const data = await request.json();
    const { acciones, collaboratorIds, responsableId, status, ...taskData } =
      data;

    // 1. Fetch the task to check its current status
    const currentTask = await prisma.task.findUnique({ where: { id } });
    if (!currentTask) {
      return NextResponse.json(
        { message: `Task with id ${id} not found` },
        { status: 404 },
      );
    }

    // Convert date strings to Date objects if they exist
    if (taskData.startDate) taskData.startDate = new Date(taskData.startDate);
    if (taskData.endDate) taskData.endDate = new Date(taskData.endDate);

    let updateData: any = { ...taskData };

    // Business Rule: Change status if responsible is assigned to an unplanned task
    if (responsableId && currentTask.status === "sin_planificar") {
      updateData.status = "pendiente";
    } else if (status) {
      // Handle status changes from other sources, like drag-and-drop
      updateData.status = status;
    }

    // Handle responsible update
    if (responsableId !== undefined) {
      updateData.responsable = responsableId
        ? { connect: { id: responsableId } }
        : { disconnect: true };
    }

    if (acciones) {
      const accionesParaCrear = (acciones || []).map((accion: any) => ({
        texto: accion.texto,
        fecha: new Date(accion.fecha),
      }));
      updateData.acciones = {
        deleteMany: {},
        create: accionesParaCrear,
      };
    }

    // Handle collaborators update
    if (Array.isArray(collaboratorIds)) {
      updateData.collaborators = {
        set: collaboratorIds.map((id: string) => ({ id })),
      };
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        acciones: true,
        responsable: true,
        collaborators: true,
      },
    });
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    return NextResponse.json(
      { message: `Error updating task ${id}` },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  try {
    // Prisma requires deleting related records first if there's a relation.
    await prisma.accion.deleteMany({
      where: { taskId: id },
    });

    await prisma.task.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    return NextResponse.json(
      { message: `Error deleting task ${id}` },
      { status: 500 },
    );
  }
}
