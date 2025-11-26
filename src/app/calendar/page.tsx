import TaskCalendar from "@/components/calendar/TaskCalendar";
import { getTasksData, getEmployeesData } from "@/lib/data";

export default async function CalendarPage() {
  // Fetch data in parallel
  const [tasks, employees] = await Promise.all([
    getTasksData(),
    getEmployeesData(),
  ]);

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
