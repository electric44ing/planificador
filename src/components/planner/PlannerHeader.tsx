"use client";

import React, { useMemo } from "react";
import { useTasks } from "@/context/TasksContext";
import ProgressBar, { ProgressBarSegment } from "../ProgressBar";
import { getTrafficLightColor } from "@/lib/utils";
import { statusColors } from "@/types";

export default function PlannerHeader() {
  const { tasks } = useTasks();

  const dueDateSegments = useMemo((): ProgressBarSegment[] => {
    if (!tasks || tasks.length === 0) return [];
    let redCount = 0,
      yellowCount = 0,
      greenCount = 0;
    tasks.forEach((task) => {
      const color = getTrafficLightColor(task.endDate);
      if (color === "red") redCount++;
      else if (color === "yellow") yellowCount++;
      else greenCount++;
    });
    const total = tasks.length;
    return [
      {
        label: "Vencidas",
        percent: (redCount / total) * 100,
        colorClass: "bg-red-500",
      },
      {
        label: "Próximas",
        percent: (yellowCount / total) * 100,
        colorClass: "bg-yellow-500",
      },
      {
        label: "Con tiempo",
        percent: (greenCount / total) * 100,
        colorClass: "bg-green-500",
      },
    ];
  }, [tasks]);

  const statusSegments = useMemo((): ProgressBarSegment[] => {
    if (!tasks || tasks.length === 0) return [];
    const statusCounts = {
      sin_planificar: 0,
      pendiente: 0,
      progreso: 0,
      completada: 0,
    };
    tasks.forEach((task) => {
      statusCounts[task.status]++;
    });
    const total = tasks.length;
    return [
      {
        label: "Sin Planificar",
        percent: (statusCounts.sin_planificar / total) * 100,
        colorClass: statusColors.sin_planificar,
      },
      {
        label: "Pendiente",
        percent: (statusCounts.pendiente / total) * 100,
        colorClass: statusColors.pendiente,
      },
      {
        label: "En Progreso",
        percent: (statusCounts.progreso / total) * 100,
        colorClass: statusColors.progreso,
      },
      {
        label: "Completada",
        percent: (statusCounts.completada / total) * 100,
        colorClass: statusColors.completada,
      },
    ];
  }, [tasks]);

  return (
    <div className="w-full max-w-4xl mx-auto my-4">
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Resumen del Planificador
        </h2>
        <div className="space-y-2">
          <ProgressBar
            title={`Tareas por Vencimiento (${tasks.length})`}
            segments={dueDateSegments}
          />
          <ProgressBar title="Tareas por Estado" segments={statusSegments} />
        </div>
      </div>
    </div>
  );
}
