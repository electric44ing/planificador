export type Status = "sin_planificar" | "pendiente" | "progreso" | "completada";

export const Categories = [
  "Presupuestar",
  "Trabajo",
  "Tarea_comercial",
  "Tarea_administrativa",
  "Reunion",
  "Visita",
  "RRHH",
  "Revision",
] as const;

export type Category = (typeof Categories)[number];

export type Accion = {
  fecha: string;
  texto: string;
};

// --- Enums from Prisma Schema ---
export const UserRoles = ["USER", "ADMIN"] as const;
export type UserRole = (typeof UserRoles)[number];

export const EmployeeRoles = [
  "Director",
  "Director_Operaciones",
  "Oficina_Tecnica",
  "Oficial",
  "Administracion",
] as const;
export type EmployeeRole = (typeof EmployeeRoles)[number];

export const Priorities = ["BAJA", "MEDIA", "ALTA"] as const;
export type Priority = (typeof Priorities)[number];

// --- Model Types ---
export type Employee = {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
};

export type User = {
  id: string;
  email: string;
  role: UserRole;
};

export type Task = {
  id: string;
  titulo: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  categoria: Category;
  priority: Priority;
  acciones: Accion[];
  status: Status;
  responsableId?: string | null;
  responsable?: Employee | null;
  collaborators?: Employee[];
};

export const categoryColors: { [key in Category]: string } = {
  Presupuestar: "bg-purple-200 text-purple-800",
  Trabajo: "bg-blue-200 text-blue-800",
  Tarea_comercial: "bg-green-200 text-green-800",
  Tarea_administrativa: "bg-yellow-200 text-yellow-800",
  Reunion: "bg-pink-200 text-pink-800",
  Visita: "bg-indigo-200 text-indigo-800",
  RRHH: "bg-red-200 text-red-800",
  Revision: "bg-gray-300 text-gray-800",
};

export const priorityColors: { [key in Priority]: string } = {
  BAJA: "text-orange-600",
  MEDIA: "text-violet-600",
  ALTA: "text-red-800",
};

export const statusColors: { [key in Status]: string } = {
  sin_planificar: "bg-gray-200",
  pendiente: "bg-yellow-200",
  progreso: "bg-blue-200",
  completada: "bg-green-200",
};
