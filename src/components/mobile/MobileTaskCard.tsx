"use client";

import { Task } from "@/types";
import { getTrafficLightColor } from "@/lib/utils";

type MobileTaskCardProps = {
  task: Task;
  employeeId: string;
  onClick: () => void;
};

export default function MobileTaskCard({
  task,
  employeeId,
  onClick,
}: MobileTaskCardProps) {
  const userRole =
    task.responsableId === employeeId ? "Responsable" : "Colaborador";

  const dueDateColor = getTrafficLightColor(task.endDate);
  const dueDateColorClass = {
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    green: "bg-green-500",
  }[dueDateColor];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 mb-3 w-full cursor-pointer active:bg-gray-100"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-800 pr-2">{task.titulo}</h3>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            userRole === "Responsable"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {userRole}
        </span>
      </div>
      <div className="mt-3 flex justify-between items-center text-sm text-gray-600">
        <p>
          <span className="font-semibold">Vence:</span>{" "}
          {new Date(task.endDate).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <div className="flex items-center">
          <span className="mr-2 font-semibold">Urgencia:</span>
          <div
            className={`w-4 h-4 rounded-full ${dueDateColorClass}`}
            title={`Color de urgencia: ${dueDateColor}`}
          ></div>
        </div>
      </div>
    </div>
  );
}
