"use client";

import { useState, useEffect } from "react";
import { Employee, EmployeeRole, EmployeeRoles } from "@/types";

type EmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: { name: string; role: EmployeeRole }) => void;
  employeeToEdit: Employee | null;
};

export default function EmployeeModal({
  isOpen,
  onClose,
  onSave,
  employeeToEdit,
}: EmployeeModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<EmployeeRole>(EmployeeRoles[0]);

  useEffect(() => {
    if (employeeToEdit) {
      setName(employeeToEdit.name);
      setRole(employeeToEdit.role);
    } else {
      setName("");
      setRole(EmployeeRoles[0]);
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name) {
      alert("Por favor, introduce un nombre.");
      return;
    }
    onSave({ name, role });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {employeeToEdit ? "Editar Empleado" : "Nuevo Empleado"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as EmployeeRole)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {EmployeeRoles.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
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
            {employeeToEdit ? "Guardar Cambios" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}
