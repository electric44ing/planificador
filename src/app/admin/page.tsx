import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Employee } from "@/types";
import EmployeeManager from "@/components/admin/EmployeeManager";

async function getEmployees() {
  const employees = await prisma.employee.findMany();
  return employees;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // 1. Security Check
  if (session?.user?.role !== "ADMIN") {
    // Redirect to login page if not an admin
    redirect("/login");
  }

  // 2. Fetch Data
  const employees = await getEmployees();

  // 3. Render UI
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Panel de Administración
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Gestionar Empleados
        </h2>
        <EmployeeManager initialEmployees={employees} />
      </div>
    </div>
  );
}
