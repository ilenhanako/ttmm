import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high" | "urgent";
}

function getPriorityStyles(priority: string) {
  switch (priority) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-primary/10 text-primary border-primary/20";
    case "medium":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "low":
      return "border-gray-300 text-gray-600";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge
      variant={priority === "low" ? "outline" : "secondary"}
      className={cn("text-xs capitalize", getPriorityStyles(priority))}
    >
      {priority}
    </Badge>
  );
}
