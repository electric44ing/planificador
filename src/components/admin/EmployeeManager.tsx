"use client";

import { useState } from "react";
import { Employee, EmployeeRole } from "@/types";
import EmployeeModal from "./EmployeeModal";

type EmployeeManagerProps = {
  initialEmployees: Employee[];
};

export default function EmployeeManager({
  initialEmployees,
}: EmployeeManagerProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleOpenModal = (employee: Employee | null) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSave = async (employeeData: {
    name: string;
    email: string;
    role: EmployeeRole;
  }) => {
    try {
      if (editingEmployee) {
        // Update existing employee
        const response = await fetch(
          `/api/admin/employees/${editingEmployee.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData),
          },
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update employee");
        }
        const updatedEmployee = await response.json();
        setEmployees(
          employees.map((emp) =>
            emp.id === updatedEmployee.id ? updatedEmployee : emp,
          ),
        );
      } else {
        // Create new employee and user
        const response = await fetch("/api/admin/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create employee");
        }
        const { employee: newEmployee, temporaryPassword } =
          await response.json();
        setEmployees([...employees, newEmployee]);
        // Show the temporary password to the admin
        alert(
          `Usuario creado con éxito.\n\nCorreo: ${newEmployee.email}\nContraseña Temporal: ${temporaryPassword}\n\nPor favor, guarda esta contraseña y compártela con el empleado.`,
        );
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An unknown error occurred while saving the employee.");
      }
    }
  };

  const handleDelete = async (employeeId: string) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este empleado?")
    ) {
      try {
        const response = await fetch(`/api/admin/employees/${employeeId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete employee");
        }
        setEmployees(employees.filter((emp) => emp.id !== employeeId));
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          alert(`Error: ${error.message}`);
        } else {
          alert("An unknown error occurred while deleting the employee.");
        }
      }
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => handleOpenModal(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Añadir Empleado
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Nombre</th>
              <th className="py-2 px-4 border-b text-left">
                Correo Electrónico
              </th>
              <th className="py-2 px-4 border-b text-left">Rol</th>
              <th className="py-2 px-4 border-b text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b">{employee.email}</td>
                <td className="py-2 px-4 border-b">{employee.role}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleOpenModal(employee)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        employeeToEdit={editingEmployee}
      />
    </div>
  );
}
