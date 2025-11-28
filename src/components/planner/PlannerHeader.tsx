"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTasks } from "@/context/TasksContext";
import BaseHeader from "../common/BaseHeader";
import ProgressBar, { ProgressBarSegment } from "../ProgressBar";
import { getTrafficLightColor } from "@/lib/utils";
import { statusColors } from "@/types";

export default function PlannerHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
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
    tasks.forEach((task) => statusCounts[task.status]++);
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
    <BaseHeader>
      <div className="flex items-center justify-start gap-x-12 w-full">
        {/* Nav Links */}
        <nav className="flex items-center space-x-6 flex-shrink-0">
          <Link
            href="/planner"
            className={`font-medium ${
              pathname.startsWith("/planner")
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Planificador
          </Link>
          <Link
            href="/calendar"
            className={`font-medium ${
              pathname.startsWith("/calendar")
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Calendario
          </Link>
        </nav>

        {/* Progress Bars */}
        <div className="w-full max-w-lg space-y-1">
          <ProgressBar
            title={`Tareas por Vencimiento (${tasks.length})`}
            segments={dueDateSegments}
          />
          <ProgressBar title="Tareas por Estado" segments={statusSegments} />
        </div>
      </div>
    </BaseHeader>
  );
}
