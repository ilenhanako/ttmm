export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Citation[];
}

export interface Citation {
  id: string;
  meetingId: string;
  meetingTitle: string;
  excerpt: string;
  timestamp: string;
}

export const sampleChatHistory: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "What were the main action items from the Q1 Planning Review?",
    timestamp: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    role: "assistant",
    content: "Based on the Q1 Planning Review meeting, here are the main action items:\n\n1. **Prepare Q1 budget proposal** - Assigned to Sarah Chen, due Jan 20\n2. **Schedule stakeholder interviews** - Assigned to Michael Johnson, due Jan 22\n3. **Update project timeline** - Assigned to Emily Rodriguez, due Jan 25\n\nThe team also discussed prioritizing the new dashboard features and agreed to reconvene next week to review progress.",
    timestamp: "2024-01-20T10:30:15Z",
    citations: [
      {
        id: "c1",
        meetingId: "1",
        meetingTitle: "Q1 Planning Review",
        excerpt: "Sarah will prepare the Q1 budget proposal by end of week...",
        timestamp: "00:15:30",
      },
      {
        id: "c2",
        meetingId: "1",
        meetingTitle: "Q1 Planning Review",
        excerpt: "Michael to coordinate stakeholder interviews with product team...",
        timestamp: "00:28:45",
      },
    ],
  },
  {
    id: "3",
    role: "user",
    content: "Who is responsible for the API documentation?",
    timestamp: "2024-01-20T10:32:00Z",
  },
  {
    id: "4",
    role: "assistant",
    content: "David Kim is responsible for reviewing and updating the API documentation. This task was assigned during the Product Roadmap Discussion meeting and is due on January 24th. The task is currently in review status.",
    timestamp: "2024-01-20T10:32:10Z",
    citations: [
      {
        id: "c3",
        meetingId: "2",
        meetingTitle: "Product Roadmap Discussion",
        excerpt: "David will handle the API documentation review before the integration...",
        timestamp: "00:42:15",
      },
    ],
  },
];

export const mockResponses: Record<string, string> = {
  default: "I can help you find information from your meetings. Try asking about action items, decisions, or specific topics discussed in your meetings.",
  noResults: "I couldn't find any relevant information in your meeting transcripts. Could you try rephrasing your question?",
  greeting: "Hello! I'm your meeting assistant. I can help you search through meeting transcripts, find action items, and recall key decisions. What would you like to know?",
};
