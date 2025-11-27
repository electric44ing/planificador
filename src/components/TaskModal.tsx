import {
  Task,
  Category,
  Categories,
  Accion,
  Employee,
  Priority,
  Priorities,
  Status,
} from "@/types";
import { formatDate, toYYYYMMDD } from "@/lib/formatters";
import React, { useState, useEffect, useMemo } from "react";

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    task: Omit<Task, "id" | "responsable" | "createdAt" | "updatedAt"> & {
      collaboratorIds?: string[];
    },
  ) => void;
  onDelete: (taskId: string) => void;
  taskToEdit?: Task | null;
  employees: Employee[];
  viewMode?: "admin" | "employee";
};

const statusOptions: Status[] = ["pendiente", "progreso", "completada"];

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  taskToEdit,
  employees,
  viewMode = "admin",
}: TaskModalProps) {
  const [titulo, setTitulo] = useState("");
  const [description, setDescription] = useState("");
  const [responsableId, setResponsableId] = useState<string | undefined>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoria, setCategoria] = useState<Category>(Categories[0]);
  const [priority, setPriority] = useState<Priority>("MEDIA");
  const [status, setStatus] = useState<Status>("pendiente"); // New status state
  const [acciones, setAcciones] = useState<Accion[]>([]);
  const [nuevaAccion, setNuevaAccion] = useState("");
  const [collaboratorIds, setCollaboratorIds] = useState<string[]>([]);

  useEffect(() => {
    if (taskToEdit) {
      setTitulo(taskToEdit.titulo);
      setDescription(taskToEdit.description || "");
      setResponsableId(taskToEdit.responsableId || undefined);
      setStartDate(toYYYYMMDD(taskToEdit.startDate));
      setEndDate(toYYYYMMDD(taskToEdit.endDate));
      setCategoria(taskToEdit.categoria);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status); // Set status on edit
      setAcciones(taskToEdit.acciones || []);
      setCollaboratorIds(taskToEdit.collaborators?.map((c) => c.id) || []);
    } else {
      // Reset for new task
      setTitulo("");
      setDescription("");
      setResponsableId(undefined);
      setStartDate("");
      setEndDate("");
      setCategoria(Categories[0]);
      setPriority("MEDIA");
      setStatus("sin_planificar");
      setAcciones([]);
      setCollaboratorIds([]);
    }
    setNuevaAccion("");
  }, [taskToEdit, isOpen]);

  const availableEmployees = useMemo(() => {
    const currentIds = new Set([responsableId, ...collaboratorIds]);
    return employees.filter((emp) => !currentIds.has(emp.id));
  }, [employees, responsableId, collaboratorIds]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!titulo || !startDate || !endDate) {
      alert("Por favor, complete al menos el título y las fechas.");
      return;
    }
    onSave({
      titulo,
      description,
      responsableId: responsableId,
      startDate,
      endDate,
      categoria,
      priority,
      status, // Include status in save data
      acciones,
      collaboratorIds,
    });
  };

  const handleDelete = () => {
    if (
      taskToEdit &&
      window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")
    ) {
      onDelete(taskToEdit.id);
    }
  };

  const handleAddAccion = () => {
    if (nuevaAccion.trim() === "") return;
    const accion: Accion = {
      fecha: new Date().toISOString(),
      texto: nuevaAccion.trim(),
    };
    setAcciones([...acciones, accion]);
    setNuevaAccion("");
  };

  const handleAddCollaborator = (employeeId: string) => {
    if (employeeId && !collaboratorIds.includes(employeeId)) {
      setCollaboratorIds([...collaboratorIds, employeeId]);
    }
  };

  const handleRemoveCollaborator = (employeeId: string) => {
    setCollaboratorIds(collaboratorIds.filter((id) => id !== employeeId));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {taskToEdit ? "Editar Tarea" : "Nueva Tarea"}
        </h2>
        <div className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Show Status field only when editing or in employee view */}
            {(taskToEdit || viewMode === "employee") && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"
              >
                {Priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fecha Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Admin-only fields */}
          {viewMode === "admin" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoría
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as Category)}
                    className="mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"
                  >
                    {Categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Responsable
                  </label>
                  <select
                    value={responsableId || ""}
                    onChange={(e) =>
                      setResponsableId(e.target.value || undefined)
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sin asignar</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Colaboradores */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Colaboradores
                </label>
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  {collaboratorIds.map((id) => {
                    const collaborator = employees.find((e) => e.id === id);
                    return (
                      <div
                        key={id}
                        className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
                      >
                        <span>{collaborator?.name || "..."}</span>
                        <button
                          onClick={() => handleRemoveCollaborator(id)}
                          className="ml-2 text-gray-500 hover:text-gray-800"
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2">
                  <select
                    value=""
                    onChange={(e) => handleAddCollaborator(e.target.value)}
                    disabled={!responsableId}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>
                      {responsableId
                        ? "+ Añadir colaborador..."
                        : "Primero asigne un responsable"}
                    </option>
                    {availableEmployees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Acciones Realizadas */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Acciones Realizadas
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto mb-4 pr-2">
              {acciones.length > 0 ? (
                acciones
                  .slice()
                  .reverse()
                  .map((accion, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded-md">
                      <p className="text-sm text-gray-700">{accion.texto}</p>
                      <p className="text-xs text-gray-500 text-right">
                        {formatDate(accion.fecha)}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500">
                  No hay acciones registradas.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={nuevaAccion}
                onChange={(e) => setNuevaAccion(e.target.value)}
                placeholder="Añadir nueva acción..."
                className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleAddAccion}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 self-end"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-between items-center">
          <div>
            {taskToEdit && viewMode === "admin" && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            )}
          </div>
          <div className="space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {taskToEdit ? "Guardar Cambios" : "Crear Tarea"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
