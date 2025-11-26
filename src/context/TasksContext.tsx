"use client";

import { Task, Employee } from "@/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface TasksContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  employees: Employee[];
  initialDataLoaded: boolean;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({
  children,
  initialTasks,
  initialEmployees,
}: {
  children: ReactNode;
  initialTasks: Task[];
  initialEmployees: Employee[];
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [employees] = useState<Employee[]>(initialEmployees);
  const [initialDataLoaded] = useState(true);

  return (
    <TasksContext.Provider
      value={{ tasks, setTasks, employees, initialDataLoaded }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
