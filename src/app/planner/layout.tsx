import { TasksProvider } from "@/context/TasksContext";
import { getTasksData, getEmployeesData } from "@/lib/data";
import { Task } from "@/types";
import PlannerNavHeader from "@/components/planner/PlannerNavHeader";

// This ensures this layout is always dynamically rendered
export const dynamic = "force-dynamic";

export default async function PlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch initial data for the tasks context
  const [rawTasks, initialEmployees] = await Promise.all([
    getTasksData(),
    getEmployeesData(),
  ]);

  // Serialize date fields for the client-side context provider
  const initialTasks: Task[] = rawTasks.map((task) => ({
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
    <TasksProvider
      initialTasks={initialTasks}
      initialEmployees={initialEmployees}
    >
      <PlannerNavHeader />
      <main className="flex flex-col items-center w-full">{children}</main>
    </TasksProvider>
  );
}
