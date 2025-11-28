import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/Providers";
import { TasksProvider } from "@/context/TasksContext";
import { getTasksData, getEmployeesData } from "@/lib/data";
import Header from "@/components/Header";
import { Task } from "@/types";

export const dynamic = "force-dynamic"; // Force dynamic rendering, disable caching

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Planificador de Tareas",
  description: "Tablero Kanban para servicios eléctricos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rawTasks = await getTasksData();
  const initialEmployees = await getEmployeesData();

  // Serialize date fields for the client-side context provider
  const initialTasks: Task[] = rawTasks.map((task) => ({
    ...task,
    startDate: task.startDate.toISOString(),
    endDate: task.endDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    acciones: task.acciones.map((accion) => ({
      ...accion,
      // Assuming 'fecha' in 'Accion' from the DB is a Date object
      fecha: (accion.fecha as unknown as Date).toISOString(),
    })),
  }));

  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50`}>
        <NextAuthProvider>
          <TasksProvider
            initialTasks={initialTasks}
            initialEmployees={initialEmployees}
          >
            <Header />
            <main className="flex flex-col items-center w-full">
              {children}
            </main>
          </TasksProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
