import Link from "next/link";
import Image from "next/image";
import HomeHeader from "@/components/home/HomeHeader";

export default function PlatformHomePage() {
  return (
    <>
      <HomeHeader />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center p-8">
        <Image
          src="/logo.png"
          alt="Electric 44 Logo"
          width={240}
          height={85}
          priority
        />
        <h1 className="text-4xl font-bold text-gray-800 mt-6">
          Plataforma de Seguimiento de Proyectos
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Bienvenido. Selecciona un módulo para continuar.
        </p>

        <div className="mt-12 border rounded-lg p-6 w-full max-w-md bg-white shadow-sm">
          <h2 className="text-xl font-semibold text-gray-700">
            Módulos Disponibles
          </h2>
          <div className="mt-4 space-y-3">
            <Link
              href="/planner"
              className="flex items-center w-full text-left px-6 py-4 text-lg text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              <span className="text-2xl mr-4">📅</span>
              <span>Planificador de Tareas</span>
            </Link>
            <Link
              href="/projects/create"
              className="flex items-center w-full text-left px-6 py-4 text-lg text-green-700 font-semibold bg-green-50 hover:bg-green-100 rounded-md transition-colors"
              title="Crear un nuevo presupuesto o proyecto"
            >
              <span className="text-2xl mr-4">📝</span>
              <span>Crear Presupuesto/Proyecto</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
