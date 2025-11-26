"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useTasks } from "@/context/TasksContext";
import ProgressBar, { ProgressBarSegment } from "./ProgressBar";
import { getTrafficLightColor } from "@/lib/utils";
import { statusColors } from "@/types";

const Header = () => {
  const { tasks } = useTasks();

  const dueDateSegments = useMemo((): ProgressBarSegment[] => {
    if (!tasks || tasks.length === 0) return [];

    let redCount = 0;
    let yellowCount = 0;
    let greenCount = 0;

    tasks.forEach((task) => {
      const color = getTrafficLightColor(task.endDate);
      if (color === "red") redCount++;
      else if (color === "yellow") yellowCount++;
      else if (color === "green") greenCount++;
    });

    const total = tasks.length;
    return [
      {
        label: "Vencidas (<2d)",
        percent: (redCount / total) * 100,
        colorClass: "bg-red-500",
      },
      {
        label: "Próximas (2-3d)",
        percent: (yellowCount / total) * 100,
        colorClass: "bg-yellow-500",
      },
      {
        label: "Con tiempo (>3d)",
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
    <header className="w-full p-2 bg-white border-b shadow-sm">
      <div className="max-w-full mx-auto px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Electric 44 Logo"
              style={{ width: "160px", height: "57px" }}
            />
            <h1 className="ml-4 text-2xl font-bold text-gray-900 hidden sm:block">
              Planificador
            </h1>
          </Link>
        </div>

        {/* Center Section */}
        <div className="flex-1 flex justify-center items-center px-4">
          <div className="w-full max-w-lg space-y-1">
            <ProgressBar
              title={`Tareas por Vencimiento (${tasks.length})`}
              segments={dueDateSegments}
            />
            <ProgressBar title="Tareas por Estado" segments={statusSegments} />
          </div>
        </div>

        {/* Right Section */}
        <nav className="flex items-center justify-end space-x-4 flex-1">
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Tablero
          </Link>
          <Link
            href="/calendar"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Calendario
          </Link>
          <Link
            href="/admin"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
