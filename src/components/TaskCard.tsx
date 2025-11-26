import {
  Task,
  Category,
  categoryColors,
  Priority,
  priorityColors,
  Status,
  statusColors,
} from "@/types";
import { getTrafficLightColor } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import React from "react";
import { useDraggable } from "@dnd-kit/core";

type TaskCardProps = {
  task: Task;
  onClick: (task: Task) => void;
};

const statusBorderColors: { [key in Status]: string } = {
  sin_planificar: "border-gray-300",
  pendiente: "border-yellow-300",
  progreso: "border-blue-300",
  completada: "border-green-300",
};

const trafficLightColorMap: { [key: string]: string } = {
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  gray: "bg-gray-400",
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const trafficLightColor =
    trafficLightColorMap[getTrafficLightColor(task.endDate)];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={() => onClick(task)}
      className={`relative p-4 mb-4 rounded-lg shadow-md border-l-4 ${
        statusColors[task.status]
      } ${statusBorderColors[task.status]} ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow pr-4">
          <div className="flex items-center space-x-2 mb-2">
            <span
              className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${
                categoryColors[task.categoria]
              }`}
            >
              {task.categoria.replace(/_/g, " ")}
            </span>
          </div>
          <p className="font-semibold text-gray-800">{task.titulo}</p>
          <p className="text-sm text-gray-600 mt-2">
            {formatDate(task.startDate)} - {formatDate(task.endDate)}
          </p>
          <div className="mt-3">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-500 mr-1 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-gray-700 font-medium truncate">
                {task.responsable?.name || "Sin asignar"}
              </p>
            </div>
            {task.collaborators && task.collaborators.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 ml-5">
                {(task.collaborators || []).map((collaborator) => (
                  <span
                    key={collaborator.id}
                    className="bg-gray-300 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full"
                    title={collaborator.name}
                  >
                    {collaborator.name.split(" ")[0]}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center mb-2">
            <div
              className={`w-3 h-3 rounded-full mr-1.5 ${trafficLightColor}`}
            ></div>
            <span
              className={`text-xs font-semibold uppercase ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
          </div>
          <div
            {...listeners}
            className="p-2 cursor-grab active:cursor-grabbing"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 5h10v10H5V5z" />
              <path d="M7 7h2v2H7V7zM7 11h2v2H7v-2zM11 7h2v2h-2V7zM11 11h2v2h-2v-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
