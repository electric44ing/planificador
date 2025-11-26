import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TasksProvider } from "@/context/TasksContext";
import { getTasksData, getEmployeesData } from "@/lib/data";
import Header from "@/components/Header";

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
  const initialTasks = await getTasksData();
  const initialEmployees = await getEmployeesData();

  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50`}>
        <TasksProvider
          initialTasks={initialTasks}
          initialEmployees={initialEmployees}
        >
          <Header />
          <main className="flex flex-col items-center w-full">{children}</main>
        </TasksProvider>
      </body>
    </html>
  );
}
