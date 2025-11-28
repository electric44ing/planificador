"use client";

import { useState, useEffect } from "react";

type FolderStatus = {
  yearFolderExists: boolean;
  studyFolderExists: boolean;
  yearFolder: { id: string; name: string } | null;
  studyFolder: { id: string; name: string } | null;
};

export default function DriveManager() {
  const [status, setStatus] = useState<FolderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    const checkFolderStructure = async () => {
      try {
        setIsLoading(true);
        setError("");
        const currentYear = new Date().getFullYear().toString();
        const response = await fetch(
          `/api/drive/check-year-folder?year=${currentYear}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al verificar las carpetas.");
        }

        setStatus(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error inesperado.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkFolderStructure();
  }, []);

  const handleCreateProjectFolder = () => {
    if (!newProjectName.trim()) {
      alert("Por favor, introduce un nombre para el proyecto.");
      return;
    }
    // TODO: Call the API to create the folder
    alert(
      `TODO: Llamar a la API para crear la carpeta "${newProjectName}" dentro de la carpeta con ID: ${status?.studyFolder?.id}`,
    );
  };

  const renderStatus = () => {
    if (isLoading) {
      return <p className="text-gray-500">Verificando carpetas en Drive...</p>;
    }
    if (error) {
      return <p className="text-red-600">{error}</p>;
    }
    if (!status) {
      return <p className="text-gray-500">No se pudo obtener el estado.</p>;
    }

    if (!status.yearFolderExists) {
      return (
        <p className="text-orange-600">
          La carpeta del año "{status.yearFolder?.name || new Date().getFullYear()}" no
          existe en la raíz de Drive. Debe ser creada manualmente.
        </p>
      );
    }

    if (!status.studyFolderExists) {
      return (
        <p className="text-orange-600">
          La carpeta "OBRAS EN ESTUDIO" no existe dentro de "
          {status.yearFolder?.name}". Debe ser creada manualmente.
        </p>
      );
    }

    // If everything exists, show the creation UI
    return (
      <div>
        <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-4">
          <p className="font-semibold text-green-800">Estructura de carpetas encontrada:</p>
          <p className="text-sm text-gray-600">
            {status.yearFolder.name} / {status.studyFolder.name}
          </p>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Nombre del nuevo proyecto"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleCreateProjectFolder}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Crear carpeta de proyecto en el Drive
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Gestor de Carpetas de Drive
      </h2>
      {renderStatus()}
    </div>
  );
}
