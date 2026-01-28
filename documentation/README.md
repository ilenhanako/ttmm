```
stateDiagram-v2
    [*] --> PDFUploaded: Admin uploads PDF
    
    PDFUploaded --> AIProcessing: System triggers AI
    AIProcessing --> PendingReview: Tasks extracted
    
    PendingReview --> AdminReview: Admin opens review
    
    AdminReview --> Approved: Admin approves
    AdminReview --> Edited: Admin edits
    AdminReview --> Rejected: Admin rejects
    AdminReview --> ManualAdded: Admin adds manual task
    
    Edited --> Approved: Admin saves
    ManualAdded --> Approved: Admin saves
    Rejected --> [*]: Discarded
    
    Approved --> ToDo: Published to user
    
    ToDo --> InProgress: User starts work
    InProgress --> Blocked: User flags blocker
    InProgress --> Done: User completes
    
    Blocked --> InProgress: Issue resolved
    Blocked --> Reassigned: Manager reassigns
    
    Reassigned --> ToDo: New owner notified
    
    Done --> Verified: Manager verifies
    Verified --> Archived: Admin archives
    Archived --> [*]
    
    note right of PendingReview
        Admin can:
        - Approve
        - Edit wording
        - Delete
        - Add manual tasks
    end note
    
    note right of InProgress
        User can:
        - Update status
        - Add notes
        - View citations
    end note
    
    note right of Blocked
        Triggers:
        - Manager notification
        - Auto-escalation if >3 days
    end note
```

---

### Common User Scenarios

#### Scenario 1: Weekly Team Meeting Upload
**Actor:** Manager  
**Goal:** Upload and process weekly team meeting

1. Manager uploads PDF of team meeting minutes
2. System extracts 5 action items automatically
3. Manager reviews AI citations (all accurate)
4. Manager approves 4 tasks, edits 1 for clarity
5. Manager assigns tasks to team members
6. Team members receive email notifications
7. Tasks appear in each member's dashboard

**Time:** ~5 minutes (vs 30 minutes manual extraction)

---

#### Scenario 2: User Checks Task Progress
**Actor:** Normal User  
**Goal:** Update task status and check deadline

1. User logs in, sees 3 tasks assigned
2. User marks "Prepare Q1 Report" as In Progress
3. User clicks "View Source" to verify requirements
4. PDF opens showing exact paragraph with details
5. User marks "Review Budget" as Blocked
6. User enters reason: "Waiting for finance data"
7. Manager receives notification about blocker
8. User asks chatbot: "When is the Q1 report deadline?"
9. Chatbot responds: "March 31st, as discussed in the Q1 Planning meeting"

**Time:** ~3 minutes

---

#### Scenario 3: Admin Generates Department Report
**Actor:** Admin  
**Goal:** Generate quarterly performance report

1. Admin filters meetings by Q4 2024
2. Admin exports all tasks from Engineering dept
3. System generates report showing:
   - 45 total tasks created
   - 38 completed (84% completion rate)
   - 7 blocked tasks (needs attention)
   - Average completion time: 5 days
4. Admin identifies recurring blockers: "Waiting for design approval"
5. Admin schedules process improvement meeting

**Time:** ~2 minutes (vs hours of manual analysis)

---

## 📊 Permission Matrix

| Resource | Action | Admin | Manager | User |
|----------|--------|-------|---------|------|
| **Meetings** | Upload PDF | ✅ All | ✅ Dept | ❌ |
| | View Draft | ✅ All | ✅ Dept | ❌ |
| | View Approved | ✅ All | ✅ All | ✅ Dept |
| | Edit/Delete | ✅ All | ✅ Own | ❌ |
| | Verify Citations | ✅ All | ✅ Dept | ❌ |
| **Action Items** | Create Manual | ✅ All | ✅ Dept | ❌ |
| | Approve/Reject | ✅ All | ✅ Dept | ❌ |
| | Edit | ✅ All | ✅ Dept | ❌ |
| | View All | ✅ All | ✅ Dept | ❌ |
| | View Assigned | ✅ All | ✅ All | ✅ Own |
| | Update Status | ✅ All | ✅ All | ✅ Own |
| | Reassign | ✅ All | ✅ Dept | ❌ |
| **Chatbot** | Query All | ✅ All | ✅ Dept | ✅ Dept |
| **Reports** | Generate All | ✅ All | ❌ | ❌ |
| | Generate Dept | ✅ All | ✅ Dept | ❌ |

---

[Rest of the README continues with System Architecture, Technology Stack, etc... same as before]

---

# 🚀 MVP Development Plan

## MVP Scope Definition

### Core Features (Must-Have)
1. ✅ User authentication (Admin & User roles only)
2. ✅ PDF upload
3. ✅ AI task extraction
4. ✅ Task approval workflow
5. ✅ Basic task list view
6. ✅ Simple chatbot (RAG-based)

### Phase 2 Features (Nice-to-Have)
- Manager role
- Kanban board UI
- Advanced filters
- Department scoping
- Citation viewer with PDF highlights
- Email notifications
- Analytics dashboard

---

## MVP Tech Stack (Simplified)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Frontend/Backend | Next.js 14 [Typescript for Frontend] | Full-stack in one codebase |
| Database | PostgreSQL + pgvector | Vector search capability |
| Cache | Redis (optional for MVP) | Can skip initially |
| AI | OpenAI GPT-4 + Embeddings | Easiest to integrate |
| PDF Processing | Unstructured (Python) | Best quality extraction |
| Orchestration | LangChain (skip LangGraph) | Simpler for MVP |
| Auth | NextAuth.js | Quick setup |
| UI | Shadcn/ui + Tailwind | Pre-built components |
| Deployment | Vercel + Supabase + Railway | Free tier available |

---

## 8-Week MVP Development Timeline

### Week 1-2: Foundation & Setup
**Goal:** Project setup, auth, and database

#### Tasks:
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Shadcn/ui and Tailwind CSS
- [ ] Configure PostgreSQL with Supabase (free tier)
- [ ] Enable pgvector extension
- [ ] Create Prisma schema (simplified):
  - `users` (id, name, email, role)
  - `meetings` (id, title, pdf_url, created_by, status)
  - `meeting_chunks` (id, meeting_id, content, page_number, embedding)
  - `action_items` (id, meeting_id, description, assigned_to, status, is_approved)
- [ ] Run migrations
- [ ] Setup NextAuth.js with credentials provider
- [ ] Create login/register pages
- [ ] Build basic dashboard layout

**Deliverable:** Working authentication + empty dashboard

---

### Week 3: Python PDF Service
**Goal:** PDF text extraction service

#### Tasks:
- [ ] Setup Python FastAPI project
- [ ] Install Unstructured library
- [ ] Create `/extract-pdf` endpoint
- [ ] Implement text chunking (1000 chars, 200 overlap)
- [ ] Test with sample PDFs
- [ ] Deploy to Railway free tier
- [ ] Create Docker container

**Deliverable:** Working PDF → text chunks API

---

### Week 4: PDF Upload & Processing
**Goal:** Admin can upload PDFs and see chunks

#### Tasks:
- [ ] Create upload page UI (form with file picker)
- [ ] Setup AWS S3 / Vercel Blob for PDF storage
- [ ] Build `/api/upload` route:
  - Save PDF to storage
  - Call Python service
  - Save chunks to database
- [ ] Create meeting list page
- [ ] Create meeting detail page (show chunks)
- [ ] Add loading states

**Deliverable:** Admin can upload PDF and view extracted text

---

### Week 5: AI Task Extraction
**Goal:** Extract tasks from chunks using OpenAI

#### Tasks:
- [ ] Setup OpenAI API key
- [ ] Create task extraction prompt template
- [ ] Build LangChain chain:
  - Input: meeting chunks
  - Process: LLM extraction
  - Output: JSON array of tasks
- [ ] Update `/api/upload` to call AI extraction
- [ ] Save tasks to `action_items` table (is_approved = false)
- [ ] Create task review UI for admin
- [ ] Add approve/reject buttons

**Deliverable:** System auto-generates tasks needing approval

---

### Week 6: Task Management
**Goal:** Admin approves tasks, users see assignments

#### Tasks:
- [ ] Build task approval flow:
  - Admin sees pending tasks
  - Admin can edit description
  - Admin can assign to users
  - Admin can approve/reject
- [ ] Create task list page for users
- [ ] Add task status update UI:
  - Dropdown: To Do → In Progress → Done
- [ ] Build `/api/tasks/[id]` PATCH endpoint
- [ ] Add simple filters (status, assigned to me)

**Deliverable:** Complete task workflow (create → approve → assign → complete)

---

### Week 7: Embeddings & Chatbot
**Goal:** Simple RAG chatbot

#### Tasks:
- [ ] Generate embeddings for chunks:
  - Call OpenAI embeddings API
  - Store vectors in `meeting_chunks.embedding`
- [ ] Create vector search function:
  - Convert user question to embedding
  - Query pgvector for similar chunks
- [ ] Build RAG chain:
  - Retrieve relevant chunks
  - Send to GPT-4 with context
  - Return answer
- [ ] Create chat UI page
- [ ] Build `/api/chat` endpoint
- [ ] Display answers with simple citation IDs

**Deliverable:** Working chatbot that answers questions

---

### Week 8: Polish & Deploy
**Goal:** Production-ready MVP

#### Tasks:
- [ ] Add error handling everywhere
- [ ] Add loading skeletons
- [ ] Improve UI/UX polish
- [ ] Add toast notifications
- [ ] Write basic README
- [ ] Setup environment variables in Vercel
- [ ] Deploy Next.js to Vercel
- [ ] Deploy Python service to Railway
- [ ] Test end-to-end in production
- [ ] Create demo video
- [ ] Seed database with sample data

**Deliverable:** Live MVP at yourapp.vercel.app

---

## MVP File Structure (Minimal)
```
meeting-mvp/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard home
│   │   ├── meetings/
│   │   │   ├── page.tsx             # List meetings
│   │   │   ├── [id]/page.tsx        # View meeting
│   │   │   └── upload/page.tsx      # Upload form
│   │   ├── tasks/
│   │   │   ├── page.tsx             # Task list
│   │   │   └── [id]/page.tsx        # Task detail
│   │   └── chat/page.tsx            # Chatbot
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── upload/route.ts
│       ├── meetings/[id]/route.ts
│       ├── tasks/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       └── chat/route.ts
│
├── components/
│   ├── ui/                          # Shadcn components
│   └── features/
│       ├── upload-form.tsx
│       ├── task-card.tsx
│       ├── task-list.tsx
│       └── chat-interface.tsx
│
├── lib/
│   ├── db.ts                        # Prisma client
│   ├── s3.ts                        # S3 upload
│   ├── ai/
│   │   ├── task-extraction.ts       # LangChain chain
│   │   └── rag-chain.ts             # RAG chatbot
│   └── auth.ts                      # NextAuth config
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── python-service/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── .env.local
├── package.json
└── README.md
```

---

## MVP API Endpoints (Minimal)

### Authentication
```
POST /api/auth/signup
POST /api/auth/login
```

### Meetings
```
POST   /api/upload          # Upload PDF
GET    /api/meetings        # List meetings
GET    /api/meetings/[id]   # Get meeting details
```

### Tasks
```
GET    /api/tasks                    # List tasks (with filters)
PATCH  /api/tasks/[id]               # Update task
POST   /api/tasks/[id]/approve       # Approve task (admin only)
```

### Chatbot
```
POST   /api/chat            # Send question, get answer
```

### Python Service
```
POST   http://python-service/extract-pdf