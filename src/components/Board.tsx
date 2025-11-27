"use client";

import { Task, Status, Employee } from "@/types";
import React, { useState } from "react";
import Column from "./Column";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import TaskModal from "./TaskModal";
import { useTasks } from "@/context/TasksContext";

const statusMap: { [key in Status]: string } = {
  sin_planificar: "Sin Planificar",
  pendiente: "Pendiente",
  progreso: "En Progreso",
  completada: "Completada",
};

export default function Board() {
  const { tasks, setTasks, employees } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const columns: Status[] = [
    "sin_planificar",
    "pendiente",
    "progreso",
    "completada",
  ];

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (
    taskData: Omit<Task, "id" | "responsable" | "createdAt" | "updatedAt"> & {
      collaboratorIds?: string[];
    },
  ) => {
    // Close modal immediately for a faster perceived response
    handleCloseModal();

    if (editingTask) {
      // --- Optimistic Update ---
      const originalTasks = tasks;

      const tempUpdatedTask: Task = {
        ...editingTask,
        ...taskData,
        responsable: taskData.responsableId
          ? employees.find((e) => e.id === taskData.responsableId)
          : undefined,
        collaborators: (taskData.collaboratorIds || [])
          .map((id) => employees.find((e) => e.id === id))
          .filter(Boolean) as Employee[],
      };

      setTasks(
        tasks.map((t) => (t.id === editingTask.id ? tempUpdatedTask : t)),
      );

      try {
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error("Failed to update task");

        const finalUpdatedTask = await response.json();
        setTasks(
          originalTasks.map((t) =>
            t.id === finalUpdatedTask.id ? finalUpdatedTask : t,
          ),
        );
      } catch (error) {
        console.error(error);
        alert("Error al actualizar la tarea. Revirtiendo cambios.");
        setTasks(originalTasks); // Revert on error
      }
    } else {
      // --- Optimistic Create ---
      const tempId = `temp-${Date.now()}`;
      const originalTasks = tasks;

      const tempNewTask: Task = {
        id: tempId,
        createdAt: new Date().toISOString(),
        ...taskData,
        updatedAt: new Date().toISOString(),
        responsable: taskData.responsableId
          ? employees.find((e) => e.id === taskData.responsableId)
          : undefined,
        collaborators: (taskData.collaboratorIds || [])
          .map((id) => employees.find((e) => e.id === id))
          .filter(Boolean) as Employee[],
        acciones: [], // Start with no actions
      };

      setTasks([...tasks, tempNewTask]);

      try {
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error("Failed to create task");

        const finalNewTask = await response.json();
        setTasks((currentTasks) =>
          currentTasks.map((t) => (t.id === tempId ? finalNewTask : t)),
        );
      } catch (error) {
        console.error(error);
        alert("Error al crear la tarea. Revirtiendo cambios.");
        setTasks(originalTasks); // Revert on error
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const originalTasks = tasks;
    setTasks(tasks.filter((t) => t.id !== taskId));
    handleCloseModal();

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la tarea. Revirtiendo cambios.");
      setTasks(originalTasks);
    }
  };

  const getTasksByStatus = (status: Status) => {
    return tasks
      .filter((task) => task.status === status)
      .sort((a, b) => {
        const dateA = new Date(a.endDate);
        const dateB = new Date(b.endDate);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        const createdAtA = new Date(a.createdAt);
        const createdAtB = new Date(b.createdAt);
        return createdAtA.getTime() - createdAtB.getTime();
      });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const task = tasks.find((t) => t.id === active.id);
      const newStatus = over.id as Status;

      if (task && task.status !== newStatus) {
        if (!task.responsableId && newStatus !== "sin_planificar") {
          alert(
            "Una tarea debe tener un responsable para poder moverla a esta columna.",
          );
          return;
        }

        const originalTasks = tasks;
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === active.id ? { ...t, status: newStatus } : t,
          ),
        );

        try {
          const response = await fetch(`/api/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });
          if (!response.ok)
            throw new Error("Failed to update task status on server");
        } catch (error) {
          console.error(error);
          alert("Error al mover la tarea. Revirtiendo cambio.");
          setTasks(originalTasks);
        }
      }
    }
  };

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {columns.map((status) => (
            <Column
              key={status}
              status={status}
              title={statusMap[status]}
              tasks={getTasksByStatus(status)}
              onCardClick={handleOpenEditModal}
              headerButton={
                status === "sin_planificar" ? (
                  <button
                    onClick={handleOpenCreateModal}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    + Nueva Tarea
                  </button>
                ) : undefined
              }
            />
          ))}
        </div>
      </DndContext>
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        taskToEdit={editingTask}
        employees={employees}
        viewMode="admin"
      />
    </>
  );
}
