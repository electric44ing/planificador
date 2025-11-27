import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { EmployeeRole, Prisma } from "@prisma/client";

// PUT /api/admin/employees/[id] - Update an employee
export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const id = params.id;
    const { name, email, role } = await request.json();

    if (
      !name ||
      !email ||
      !role ||
      !Object.values(EmployeeRole).includes(role)
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Check if email is already taken by another employee
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });
    if (existingEmployee && existingEmployee.id !== id) {
      return NextResponse.json(
        { error: "Este correo ya está en uso por otro empleado." },
        { status: 409 },
      );
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: { name, email, role },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Este correo ya está en uso por otro empleado." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/employees/[id] - Delete an employee and their associated user
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const id = params.id;

    // Use a transaction to ensure both user and employee are deleted
    await prisma.$transaction(async (tx) => {
      // Find the user associated with this employee
      const user = await tx.user.findUnique({
        where: { employeeId: id },
      });

      // If a user is linked, delete them first
      if (user) {
        await tx.user.delete({ where: { id: user.id } });
      }

      // Then, attempt to delete the employee
      // This will still fail if the employee is linked to tasks, which is handled below
      await tx.employee.delete({
        where: { id },
      });
    });

    return NextResponse.json(
      { message: "Empleado y usuario asociado eliminados con éxito." },
      { status: 200 },
    );
  } catch (error) {
    // Handle specific Prisma errors, e.g., foreign key constraint on Tasks
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          {
            error:
              "No se puede eliminar el empleado porque está asignado a una o más tareas.",
          },
          { status: 409 }, // 409 Conflict
        );
      }
    }
    // Handle all other errors
    console.error("Failed to delete employee:", error);
    return NextResponse.json(
      { error: "Error al eliminar el empleado." },
      { status: 500 },
    );
  }
}
