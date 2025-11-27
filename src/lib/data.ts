import prisma from "./prisma";

export const getTasksData = async () => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        acciones: true,
        responsable: true,
        collaborators: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks from DB:", error);
    return [];
  }
};

export const getEmployeesData = async () => {
  try {
    const employees = await prisma.employee.findMany();
    return employees;
  } catch (error) {
    console.error("Error fetching employees from DB:", error);
    return [];
  }
};

export const getEmployeeTasks = async (employeeId: string) => {
  if (!employeeId) return [];

  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { responsableId: employeeId },
          { collaborators: { some: { id: employeeId } } },
        ],
      },
      include: {
        acciones: true,
        responsable: true,
        collaborators: true,
      },
      orderBy: {
        endDate: "asc",
      },
    });
    return tasks;
  } catch (error) {
    console.error("Error fetching employee tasks from DB:", error);
    return [];
  }
};
