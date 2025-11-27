import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { EmployeeRole, Prisma } from "@prisma/client";
import { getEmployeesData } from "@/lib/data";
import * as bcrypt from "bcryptjs";

// GET /api/admin/employees - Get all employees
export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const employees = await getEmployeesData();
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 },
    );
  }
}

// POST /api/admin/employees - Create a new employee and a corresponding user
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { name, email, role } = await request.json();

    if (
      !name ||
      !email ||
      !role ||
      !Object.values(EmployeeRole).includes(role)
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Generate a temporary password
    const temporaryPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    // Use a transaction to ensure both employee and user are created, or neither.
    const newEmployee = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("Ya existe un usuario con este correo.");
      }
      const existingEmployee = await tx.employee.findUnique({
        where: { email },
      });
      if (existingEmployee) {
        throw new Error("Ya existe un empleado con este correo.");
      }

      const createdEmployee = await tx.employee.create({
        data: { name, email, role },
      });

      await tx.user.create({
        data: {
          email: email,
          password: hashedPassword,
          role: "USER",
          employeeId: createdEmployee.id,
        },
      });

      return createdEmployee;
    });

    return NextResponse.json(
      { employee: newEmployee, temporaryPassword },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating employee and user:", error);
    if (
      error instanceof Error &&
      (error.message.includes("Ya existe un usuario") ||
        error.message.includes("Ya existe un empleado"))
    ) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "El correo electrónico ya está en uso." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create employee and user" },
      { status: 500 },
    );
  }
}
