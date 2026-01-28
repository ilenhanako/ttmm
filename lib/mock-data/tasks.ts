export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  dueDate: string;
  meetingId: string;
  createdAt: string;
  tags: string[];
}

export const tasks: Task[] = [
  {
    id: "1",
    title: "Prepare Q1 budget proposal",
    description: "Create detailed budget breakdown for Q1 initiatives including headcount and tooling costs.",
    status: "in_progress",
    priority: "high",
    assignee: "1",
    dueDate: "2024-01-20",
    meetingId: "1",
    createdAt: "2024-01-15",
    tags: ["finance", "planning"],
  },
  {
    id: "2",
    title: "Schedule stakeholder interviews",
    description: "Coordinate with product team to schedule interviews with key stakeholders for roadmap input.",
    status: "done",
    priority: "medium",
    assignee: "2",
    dueDate: "2024-01-22",
    meetingId: "1",
    createdAt: "2024-01-15",
    tags: ["stakeholder", "interviews"],
  },
  {
    id: "3",
    title: "Update project timeline",
    description: "Revise project timeline based on new resource allocation discussed in the meeting.",
    status: "todo",
    priority: "medium",
    assignee: "3",
    dueDate: "2024-01-25",
    meetingId: "1",
    createdAt: "2024-01-15",
    tags: ["timeline", "planning"],
  },
  {
    id: "4",
    title: "Create feature specifications",
    description: "Document detailed specifications for the new dashboard features discussed in product roadmap.",
    status: "in_progress",
    priority: "high",
    assignee: "3",
    dueDate: "2024-01-28",
    meetingId: "2",
    createdAt: "2024-01-18",
    tags: ["documentation", "product"],
  },
  {
    id: "5",
    title: "Review API documentation",
    description: "Review and update API documentation for the upcoming integration.",
    status: "review",
    priority: "medium",
    assignee: "4",
    dueDate: "2024-01-24",
    meetingId: "2",
    createdAt: "2024-01-18",
    tags: ["api", "documentation"],
  },
  {
    id: "6",
    title: "Implement sprint velocity tracking",
    description: "Set up automated velocity tracking based on retrospective insights.",
    status: "todo",
    priority: "low",
    assignee: "4",
    dueDate: "2024-01-30",
    meetingId: "3",
    createdAt: "2024-01-22",
    tags: ["automation", "metrics"],
  },
  {
    id: "7",
    title: "Prepare client demo environment",
    description: "Set up demo environment with sample data for client onboarding presentation.",
    status: "in_progress",
    priority: "urgent",
    assignee: "2",
    dueDate: "2024-01-24",
    meetingId: "4",
    createdAt: "2024-01-23",
    tags: ["demo", "client"],
  },
  {
    id: "8",
    title: "Write onboarding documentation",
    description: "Create step-by-step onboarding guide for new clients.",
    status: "todo",
    priority: "high",
    assignee: "1",
    dueDate: "2024-01-25",
    meetingId: "4",
    createdAt: "2024-01-23",
    tags: ["documentation", "onboarding"],
  },
];
