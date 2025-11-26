import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { EmployeeRole } from "@prisma/client";

// PUT /api/admin/employees/[id] - Update an employee
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const id = params.id;
    const { name, role } = await request.json();

    if (!name || !role || !Object.values(EmployeeRole).includes(role)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: { name, role },
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

// DELETE /api/admin/employees/[id] - Delete an employee
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const id = params.id;
    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Employee deleted successfully" }, { status: 200 });
  } catch (error) {
    // Handle cases where the employee might be linked to tasks
    if (error.code === 'P2003') { // Foreign key constraint failed
        return NextResponse.json({ error: "Cannot delete employee because they are assigned to one or more tasks." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
