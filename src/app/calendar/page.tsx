import TaskCalendar from "@/components/calendar/TaskCalendar";
import { getTasksData, getEmployeesData } from "@/lib/data";
import { Task } from "@/types";

export default async function CalendarPage() {
  // Fetch data in parallel
  const [rawTasks, employees] = await Promise.all([
    getTasksData(),
    getEmployeesData(),
  ]);

  // Serialize date fields for the client component as it can't receive Date objects directly
  const tasks: Task[] = rawTasks.map((task) => ({
    ...task,
    startDate: task.startDate.toISOString(),
    endDate: task.endDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    // Ensure nested date fields in 'acciones' are also serialized
    acciones: task.acciones.map((accion) => ({
      ...accion,
      // Assuming 'fecha' in 'Accion' from the DB is a Date object
      // and the 'Accion' type in `types.ts` expects a string.
      fecha: (accion.fecha as unknown as Date).toISOString(),
    })),
  }));

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 px-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Vista de Calendario
      </h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <TaskCalendar tasks={tasks} employees={employees} />
      </div>
    </div>
  );
}
