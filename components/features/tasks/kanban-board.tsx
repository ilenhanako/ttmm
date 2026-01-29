"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanColumn } from "./kanban-column";
import { TaskCard } from "./task-card";
import type { Task, User } from "@/lib/mock-data";

interface KanbanBoardProps {
  initialTasks: Task[];
  users: User[];
}

const columns = [
  { id: "todo", title: "To Do", color: "red" as const },
  { id: "in_progress", title: "In Progress", color: "blue" as const },
  { id: "review", title: "Review", color: "yellow" as const },
  { id: "done", title: "Done", color: "green" as const },
];

export function KanbanBoard({ initialTasks, users }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if we're over a column
    const overColumn = columns.find((col) => col.id === overId);
    if (overColumn) {
      // Moving to a different column
      if (activeTask.status !== overId) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, status: overId as Task["status"] } : t
          )
        );
      }
    } else {
      // Moving over another task
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask && activeTask.status !== overTask.status) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === activeId ? { ...t, status: overTask.status } : t
          )
        );
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Final status update when dropped on a column
    const overColumn = columns.find((col) => col.id === overId);
    if (overColumn && activeTask.status !== overId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: overId as Task["status"] } : t
        )
      );
    }
  }

  function getTasksForColumn(columnId: string) {
    return tasks.filter((task) => task.status === columnId);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={getTasksForColumn(column.id)}
            users={users}
            color={column.color}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} users={users} />}
      </DragOverlay>
    </DndContext>
  );
}
