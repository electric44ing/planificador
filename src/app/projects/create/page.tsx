import BaseHeader from "@/components/common/BaseHeader";
import DriveManager from "@/components/projects/DriveManager";

export default function CreateProjectPage() {
  return (
    <>
      <BaseHeader />
      <div className="flex w-full h-[calc(100vh-81px)]">
        {/* Main Content Section (60%) */}
        <div className="w-[60%] bg-gray-50 p-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Crear Presupuesto/Proyecto
          </h1>
          <p className="mt-2 text-gray-500">
            Sección principal (en construcción).
          </p>
        </div>

        {/* Auxiliary Information Section (40%) */}
        <div className="w-[40%] bg-white border-l p-8">
          <DriveManager />
        </div>
      </div>
    </>
  );
}
