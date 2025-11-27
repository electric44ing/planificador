import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getEmployeeTasks, getEmployeesData } from "@/lib/data";
import { Task } from "@/types";
import MobileView from "@/components/mobile/MobileView";

export default async function MobilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/mobile");
  }

  const employeeId = session.user.employeeId;
  if (!employeeId) {
    return (
      <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          Acceso Denegado
        </h1>
        <p className="text-gray-700">
          Tu cuenta de usuario no está vinculada a un perfil de empleado.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Por favor, contacta a un administrador para que te asignen a un perfil
          de empleado.
        </p>
      </div>
    );
  }

  // Fetch both tasks and employees in parallel
  const [rawTasks, employees] = await Promise.all([
    getEmployeeTasks(employeeId),
    getEmployeesData(),
  ]);

  // Serialize tasks for the client component
  const tasks: Task[] = rawTasks.map((task) => ({
    ...task,
    startDate: task.startDate.toISOString(),
    endDate: task.endDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    acciones: task.acciones.map((accion) => ({
      ...accion,
      fecha: (accion.fecha as unknown as Date).toISOString(),
    })),
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      <MobileView
        initialTasks={tasks}
        employees={employees}
        employeeId={employeeId}
      />
    </div>
  );
}
