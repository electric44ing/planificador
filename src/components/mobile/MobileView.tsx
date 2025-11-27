"use client";

import { useState, useMemo } from "react";
import { Task, Status, Employee } from "@/types";
import MobileTaskCard from "./MobileTaskCard";
import TaskModal from "../TaskModal";

type MobileViewProps = {
  initialTasks: Task[];
  employees: Employee[];
  employeeId: string;
};

const TABS: { label: string; status: Status }[] = [
  { label: "Pendiente", status: "pendiente" },
  { label: "En Progreso", status: "progreso" },
  { label: "Completada", status: "completada" },
];

export default function MobileView({
  initialTasks,
  employees,
  employeeId,
}: MobileViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<Status>("pendiente");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.status === activeTab),
    [tasks, activeTab],
  );

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (
    taskData: Omit<Task, "id" | "responsable" | "createdAt" | "updatedAt"> & {
      collaboratorIds?: string[];
    },
  ) => {
    if (!selectedTask) return;

    handleCloseModal();
    const originalTasks = tasks;

    // Optimistic update
    const tempUpdatedTask: Task = {
      ...selectedTask,
      ...taskData,
    };
    setTasks(
      tasks.map((t) => (t.id === selectedTask.id ? tempUpdatedTask : t)),
    );

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error("Failed to update task");

      const finalUpdatedTask = await response.json();
      setTasks((currentTasks) =>
        currentTasks.map((t) =>
          t.id === finalUpdatedTask.id ? finalUpdatedTask : t,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la tarea. Revirtiendo cambios.");
      setTasks(originalTasks);
    }
  };

  // Employees cannot delete tasks from the mobile view.
  const handleDeleteTask = () => {};

  return (
    <>
      <div className="p-2 md:p-4">
        {/* Tab Navigation */}
        <div className="flex justify-center bg-white p-1 rounded-lg shadow-sm mb-4 sticky top-2 z-10">
          {TABS.map((tab) => (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={`flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors duration-200 ${
                activeTab === tab.status
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="flex flex-col items-center">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <MobileTaskCard
                key={task.id}
                task={task}
                employeeId={employeeId}
                onClick={() => handleCardClick(task)}
              />
            ))
          ) : (
            <div className="text-center mt-16">
              <p className="text-gray-500">
                No hay tareas en la sección "{activeTab.replace("_", " ")}".
              </p>
            </div>
          )}
        </div>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        taskToEdit={selectedTask}
        employees={employees}
        viewMode="employee"
      />
    </>
  );
}
