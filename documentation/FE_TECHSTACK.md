
```
{
"framework": "Next.js 14 (App Router)",
"language": "TypeScript",
"styling": "Tailwind CSS",
"components": "Shadcn/ui",
"icons": "Lucide React",
"state": "React useState/useContext (no external state management)",
"data": "Mock JSON files",
"deployment": "Vercel (preview)"
}

```

---

## 📁 Project Structure
```

meeting-mockup/
├── app/
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Landing page
│ ├── login/
│ │ └── page.tsx # Login mockup
│ └── dashboard/
│ ├── layout.tsx # Dashboard layout with sidebar
│ ├── page.tsx # Dashboard home
│ ├── meetings/
│ │ ├── page.tsx # Meeting list
│ │ ├── [id]/page.tsx # Meeting detail
│ │ └── upload/page.tsx # Upload mockup
│ ├── tasks/
│ │ ├── page.tsx # Task list/Kanban
│ │ └── [id]/page.tsx # Task detail
│ └── chat/
│ └── page.tsx # Chatbot interface
│
├── components/
│ ├── ui/ # Shadcn components
│ │ ├── button.tsx
│ │ ├── card.tsx
│ │ ├── badge.tsx
│ │ ├── dialog.tsx
│ │ ├── input.tsx
│ │ ├── select.tsx
│ │ ├── tabs.tsx
│ │ ├── avatar.tsx
│ │ └── ...
│ │
│ ├── layout/
│ │ ├── sidebar.tsx # Navigation sidebar
│ │ ├── header.tsx # Top header with user menu
│ │ └── breadcrumb.tsx # Breadcrumb navigation
│ │
│ └── features/
│ ├── meetings/
│ │ ├── meeting-card.tsx # Meeting card component
│ │ ├── meeting-list.tsx # List view
│ │ ├── meeting-filters.tsx # Filter controls
│ │ ├── upload-form.tsx # PDF upload form
│ │ └── pdf-viewer-mock.tsx # PDF viewer mockup
│ │
│ ├── tasks/
│ │ ├── task-card.tsx # Task card
│ │ ├── task-list.tsx # List view
│ │ ├── kanban-board.tsx # Kanban board
│ │ ├── kanban-column.tsx # Kanban column
│ │ ├── task-detail-modal.tsx # Task detail dialog
│ │ ├── status-badge.tsx # Status indicator
│ │ └── priority-badge.tsx # Priority indicator
│ │
│ └── chat/
│ ├── chat-interface.tsx # Main chat UI
│ ├── message-bubble.tsx # Chat message
│ ├── citation-card.tsx # Citation display
│ └── chat-input.tsx # Message input
│
├── lib/
│ ├── mock-data/
│ │ ├── users.ts # Mock users
│ │ ├── meetings.ts # Mock meetings
│ │ ├── tasks.ts # Mock tasks
│ │ └── chat-responses.ts # Mock chat data
│ │
│ └── utils/
│ ├── format-date.ts # Date formatting
│ └── cn.ts # Class name utility
│
├── public/
│ ├── sample-meeting.pdf # Sample PDF
│ └── avatars/ # User avatars
│
├── .env.local
├── package.json
├── tailwind.config.ts
└── README.md
