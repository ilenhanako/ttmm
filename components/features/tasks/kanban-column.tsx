"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { TaskCard } from "./task-card";
import type { Task, User } from "@/lib/mock-data";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  users: User[];
  color: "red" | "blue" | "yellow" | "green";
}

function getColumnColors(color: string) {
  switch (color) {
    case "blue":
      return "bg-blue-50 border-blue-200";
    case "yellow":
      return "bg-yellow-50 border-yellow-200";
    case "green":
      return "bg-green-50 border-green-200";
    default:
      return "bg-red-50 border-red-200";
  }
}

function getHeaderColors(color: string) {
  switch (color) {
    case "blue":
      return "text-blue-700";
    case "yellow":
      return "text-yellow-700";
    case "green":
      return "text-green-700";
    default:
      return "text-red-700";
  }
}

export function KanbanColumn({
  id,
  title,
  tasks,
  users,
  color,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border-2 min-h-[500px] w-full min-w-[280px]",
        getColumnColors(color),
        isOver && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="p-3 border-b border-inherit">
        <div className="flex items-center justify-between">
          <h3 className={cn("font-semibold text-sm", getHeaderColors(color))}>
            {title}
          </h3>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full bg-white/60",
              getHeaderColors(color)
            )}
          >
            {tasks.length}
          </span>
        </div>
      </div>
      <div ref={setNodeRef} className="flex-1 p-2 space-y-2 overflow-y-auto">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} users={users} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
