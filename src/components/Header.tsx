"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTasks } from "@/context/TasksContext";
import ProgressBar, { ProgressBarSegment } from "./ProgressBar";
import { getTrafficLightColor } from "@/lib/utils";
import { statusColors } from "@/types";

const Header = () => {
  const { data: session, status } = useSession();
  const { tasks } = useTasks();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === "authenticated";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const dueDateSegments = useMemo((): ProgressBarSegment[] => {
    if (!tasks || tasks.length === 0) return [];
    // ... (logic remains the same)
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
    // ... (logic remains the same)
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
            {isAuthenticated && (
              <h1 className="ml-4 text-2xl font-bold text-gray-900 hidden sm:block">
                Planificador
              </h1>
            )}
          </Link>
        </div>

        {/* Center Section */}
        {isAuthenticated && (
          <div className="flex-1 flex justify-center items-center px-4">
            <div className="w-full max-w-lg space-y-1">
              <ProgressBar
                title={`Tareas por Vencimiento (${tasks.length})`}
                segments={dueDateSegments}
              />
              <ProgressBar
                title="Tareas por Estado"
                segments={statusSegments}
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center justify-end space-x-4 flex-1">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <span className="font-medium text-sm text-gray-700 hidden md:inline">
                  {session.user?.email}
                </span>
                {/* Generic User Icon */}
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border">
                  <div className="p-4 border-b">
                    <p className="text-sm font-semibold text-gray-800">
                      {session.user?.name || "Usuario"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link
                      href="/account/change-password"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Cambiar Contraseña
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-500 hover:text-white rounded-md"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-600 font-medium"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
