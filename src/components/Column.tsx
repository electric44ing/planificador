import { Task, Status } from "@/types";
import React from "react";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

type ColumnProps = {
  title: string;
  status: Status;
  tasks: Task[];
  onCardClick: (task: Task) => void;
  headerButton?: React.ReactNode;
};

export default function Column({
  title,
  status,
  tasks,
  onCardClick,
  headerButton,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-100 rounded-lg p-4 w-full md:w-1/3 transition-colors duration-300 ${
        isOver ? "bg-gray-200" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {headerButton}
      </div>
      <div className="min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
}
