"use client";

import { KanbanBoard } from "@/components/features/tasks";
import { tasks, users } from "@/lib/mock-data";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          Manage and track your action items
        </p>
      </div>

      <KanbanBoard initialTasks={tasks} users={users} />
    </div>
  );
}
