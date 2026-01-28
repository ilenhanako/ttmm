export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  status: "upcoming" | "completed" | "cancelled";
  summary?: string;
  actionItems?: number;
  tags: string[];
}

export const meetings: Meeting[] = [
  {
    id: "1",
    title: "Q1 Planning Review",
    date: "2024-01-15",
    time: "10:00 AM",
    duration: "1h 30m",
    participants: ["1", "2", "3", "4"],
    status: "completed",
    summary: "Discussed Q1 objectives and key results. Agreed on priority projects for the quarter.",
    actionItems: 5,
    tags: ["planning", "quarterly"],
  },
  {
    id: "2",
    title: "Product Roadmap Discussion",
    date: "2024-01-18",
    time: "2:00 PM",
    duration: "1h",
    participants: ["1", "3", "5"],
    status: "completed",
    summary: "Reviewed product roadmap for H1. Identified key features and dependencies.",
    actionItems: 3,
    tags: ["product", "roadmap"],
  },
  {
    id: "3",
    title: "Sprint Retrospective",
    date: "2024-01-22",
    time: "3:00 PM",
    duration: "45m",
    participants: ["2", "3", "4"],
    status: "completed",
    summary: "Team reflected on sprint performance. Identified areas for improvement.",
    actionItems: 4,
    tags: ["sprint", "agile"],
  },
  {
    id: "4",
    title: "Client Onboarding Call",
    date: "2024-01-25",
    time: "11:00 AM",
    duration: "1h",
    participants: ["1", "2"],
    status: "upcoming",
    tags: ["client", "onboarding"],
  },
  {
    id: "5",
    title: "Weekly Team Sync",
    date: "2024-01-26",
    time: "9:00 AM",
    duration: "30m",
    participants: ["1", "2", "3", "4", "5"],
    status: "upcoming",
    tags: ["weekly", "sync"],
  },
  {
    id: "6",
    title: "Design Review Session",
    date: "2024-01-28",
    time: "4:00 PM",
    duration: "1h 15m",
    participants: ["1", "3", "5"],
    status: "upcoming",
    tags: ["design", "review"],
  },
];
