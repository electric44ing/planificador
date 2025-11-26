import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { EmployeeRole } from "@prisma/client";
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
    const { name, role } = await request.json();

    if (!name || !role || !Object.values(EmployeeRole).includes(role)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        role,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 },
    );
  }
}
