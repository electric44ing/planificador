"use client";

import { useState } from "react";
import { Task, Employee } from "@/types";
import {
  Calendar,
  dateFnsLocalizer,
  EventProps,
  View,
  Views,
} from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import TaskModal from "../TaskModal";
import { categoryColors } from "@/types";

const locales = {
  es: es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource: Task;
}

type TaskCalendarProps = {
  tasks: Task[];
  employees: Employee[];
};

export default function TaskCalendar({
  tasks: initialTasks,
  employees,
}: TaskCalendarProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  // Add 1 day to end date for proper all-day event rendering in calendar
  const events: CalendarEvent[] = tasks.map((task) => ({
    title: task.titulo,
    start: new Date(task.startDate),
    end: new Date(
      new Date(task.endDate).setDate(new Date(task.endDate).getDate() + 1),
    ),
    resource: task,
  }));

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedTask(event.resource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (
    taskData: Omit<Task, "id" | "status" | "responsable" | "createdAt">,
  ) => {
    if (selectedTask) {
      // Edit existing task
      try {
        const response = await fetch(`/api/tasks/${selectedTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error("Failed to update task");
        const updatedTask = await response.json();
        setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
      } catch (error) {
        console.error(error);
        alert("Error al actualizar la tarea");
      }
    }
    // Creating new tasks from the calendar view is not implemented,
    // as there's no UI for it. The modal will only open for existing tasks.
    handleCloseModal();
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete task");
      setTasks(tasks.filter((t) => t.id !== taskId));
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la tarea");
    }
  };

  const EventComponent = ({ event }: EventProps<CalendarEvent>) => {
    const bgColor = categoryColors[event.resource.categoria] || "bg-gray-200";
    return (
      <div className={`${bgColor} p-1 rounded-md text-xs`}>{event.title}</div>
    );
  };

  return (
    <div style={{ height: "80vh" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        culture="es"
        onSelectEvent={handleSelectEvent}
        components={{
          event: EventComponent,
        }}
        date={date}
        view={view}
        views={["month", "agenda"]}
        onNavigate={setDate}
        onView={(newView) => setView(newView)}
        popup={false}
        dayLayoutAlgorithm="no-overlap"
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          date: "Fecha",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "No hay eventos en este rango.",
          showMore: (total) => `+ Ver más (${total})`,
        }}
      />
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        taskToEdit={selectedTask}
        employees={employees}
      />
    </div>
  );
}
