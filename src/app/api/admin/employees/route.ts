import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { EmployeeRole, Prisma } from "@prisma/client"; // <-- Corrected import
import { getEmployeesData } from "@/lib/data";

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

// POST /api/admin/employees - Create a new employee
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

    // Check if employee with that email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "Ya existe un empleado con este correo." },
        { status: 409 },
      );
    }

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        role,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error(error);
    // Handle potential race conditions or other DB errors
    if (
      error instanceof Prisma.PrismaClientKnownRequestError && // <-- Corrected usage
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe un empleado con este correo." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 },
    );
  }
}
