"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "./priority-badge";
import type { Task, User } from "@/lib/mock-data";

interface TaskCardProps {
  task: Task;
  users: User[];
}

export function TaskCard({ task, users }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assignee = users.find((user) => user.id === task.assignee);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md",
        isDragging && "opacity-50 shadow-lg"
      )}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <p className="font-medium text-sm leading-tight line-clamp-2">
              {task.title}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="flex items-center justify-between pt-1">
              {assignee && (
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                    <AvatarFallback className="text-[10px]">
                      {assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                    {assignee.name.split(" ")[0]}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{task.dueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
