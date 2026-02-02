# PostgreSQL + pgvector Database Setup

## Overview
Set up a local PostgreSQL database with pgvector extension using Docker, configure Prisma ORM, create the schema, and verify the connection.

## Files to Create

| # | File | Purpose |
|---|------|---------|
| 1 | `docker-compose.yml` | PostgreSQL with pgvector container |
| 2 | `scripts/init-pgvector.sql` | Enable vector extension on init |
| 3 | `.env` | DATABASE_URL for Prisma CLI (gitignored) |
| 4 | `.env.local` | All env vars for Next.js runtime (gitignored) |
| 5 | `.env.example` | Committed template for developers |
| 6 | `prisma/schema.prisma` | Full database schema (12 models) |
| 7 | `prisma/seed.ts` | Seed with existing mock data |
| 8 | `lib/db.ts` | Prisma client singleton |
| 9 | `lib/db-vector.ts` | pgvector raw SQL helpers |
| 10 | `scripts/test-db.ts` | Connection verification script |

## Files to Modify

| # | File | Change |
|---|------|--------|
| 1 | `package.json` | Add prisma, @prisma/client, ts-node; add db scripts and seed config |
| 2 | `.gitignore` | Add `.env` |

---

## Step 1: Docker Compose

**File: `docker-compose.yml`**

- Use `pgvector/pgvector:pg16` image (pgvector pre-compiled)
- Expose port 5432
- Named volume `pgdata` for persistence
- Mount `scripts/init-pgvector.sql` to `/docker-entrypoint-initdb.d/` to auto-enable the extension
- Credentials: `ttmm_user` / `ttmm_password` / db: `ttmm`

**File: `scripts/init-pgvector.sql`**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Step 2: Environment Variables

**`.env`** (for Prisma CLI - doesn't read .env.local):
```
DATABASE_URL="postgresql://ttmm_user:ttmm_password@localhost:5432/ttmm?schema=public"
```

**`.env.local`** (for Next.js runtime):
```
DATABASE_URL="postgresql://ttmm_user:ttmm_password@localhost:5432/ttmm?schema=public"
PYTHON_SERVICE_URL="http://localhost:8000"
OPENAI_API_KEY=""
```

**`.env.example`** (committed template):
Same as `.env.local` but with placeholder values.

Add `.env` to `.gitignore` (`.env*.local` is already there).

## Step 3: Install Dependencies

```bash
npm install @prisma/client
npm install prisma ts-node --save-dev
```

## Step 4: Prisma Schema

**File: `prisma/schema.prisma`**

Uses `previewFeatures = ["postgresqlExtensions"]` and `extensions = [vector]` so Prisma includes `CREATE EXTENSION vector` in migrations.

### Models (12 total)

#### RBAC Models

**Department** (`departments`)
- id (cuid), name, createdAt
- Relations: users

**Role** (`roles`)
- id (cuid), name, description?, level (Int), createdAt
- Relations: permissions (RolePermission[]), users (UserRole[])

**Permission** (`permissions`)
- id (cuid), resource, action, description?, createdAt
- Relations: roles (RolePermission[])

**RolePermission** (`role_permissions`)
- id (cuid), roleId (FK->Role), permissionId (FK->Permission), constraints (Json?), createdAt
- Unique constraint on [roleId, permissionId]
- `constraints` stores conditional rules (e.g. `draft_only_own_content`)

**UserRole** (`user_roles`)
- id (cuid), userId (FK->User), roleId (FK->Role), assignedAt
- Unique constraint on [userId, roleId]

#### Core Models

**User** (`users`)
- id (cuid), name, email (unique), avatar?, departmentId? (FK->Department), createdAt, updatedAt
- Relations: department, userRoles, createdMeetings, assignedTasks, chatMessages, meetingParticipants

**Meeting** (`meetings`)
- id (cuid), title, pdfUrl?, date?, time?, duration?, status (enum: UPCOMING/COMPLETED/CANCELLED), summary?, tags[], createdBy (FK->User), createdAt, updatedAt
- Relations: creator, chunks, actionItems, citations, participants

**MeetingParticipant** (`meeting_participants`)
- id (cuid), meetingId (FK->Meeting), userId (FK->User), createdAt
- Unique constraint on [meetingId, userId]
- Replaces the `participants: string[]` array from mock data with a proper join table

**MeetingChunk** (`meeting_chunks`)
- id (cuid), meetingId (FK->Meeting), content, chunkIndex, pageNumbers[], startChar?, endChar?
- `embedding Unsupported("vector(1536)")?` -- pgvector column for OpenAI embeddings
- Index on meetingId
- Fields match the Python service's TextChunk output (index, page_numbers, start_char, end_char)

**ActionItem** (`action_items`)
- id (cuid), meetingId (FK->Meeting), title, description?, assignedTo? (FK->User), status (enum: TODO/IN_PROGRESS/REVIEW/DONE), priority (enum: LOW/MEDIUM/HIGH/URGENT), isApproved (default false), dueDate?, tags[], createdAt, updatedAt
- Indexes on meetingId, assignedTo, status

**ChatMessage** (`chat_messages`)
- id (cuid), userId (FK->User), content, role (enum: USER/ASSISTANT), createdAt
- Index on userId

**Citation** (`citations`)
- id (cuid), messageId (FK->ChatMessage), meetingId (FK->Meeting), excerpt, timestamp?, createdAt
- Indexes on messageId, meetingId

### Key decisions
- Roles are managed via RBAC join tables (UserRole, RolePermission) instead of a simple enum on User
- The old `role` enum field on User is replaced by the `UserRole` join table for flexible role assignment
- User optionally belongs to a Department via `departmentId`
- Permission constraints stored as JSON allow fine-grained rules (e.g. "can only edit own drafts")
- All FKs use `onDelete: Cascade` for meeting-owned data (chunks, action items, participants, citations)
- `assignedTo` on ActionItem uses `onDelete: SetNull` (keep task if user deleted)
- `@@map("snake_case")` on all models for idiomatic DB naming
- `Unsupported("vector(1536)")` for the embedding column -- Prisma generates valid migration SQL but excludes it from TypeScript types; all vector ops use raw SQL

## Step 5: Initialize Prisma & Run Migrations

```bash
# Start database
docker compose up -d db

# Generate Prisma client
npx prisma generate

# Create and apply initial migration
npx prisma migrate dev --name init

# Create vector index migration (manual SQL)
npx prisma migrate dev --create-only --name add_vector_index
# Edit the generated migration to add HNSW index SQL (see below)

# Apply the vector index migration
npx prisma migrate dev
```

Vector index SQL:
```sql
CREATE INDEX IF NOT EXISTS meeting_chunks_embedding_idx
  ON meeting_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

## Step 6: Create DB Helpers

**File: `lib/db.ts`** -- Standard Next.js Prisma singleton pattern:
- Store PrismaClient on `globalThis` to survive hot reloads in dev
- Enable query logging in development

**File: `lib/db-vector.ts`** -- Raw SQL helpers for pgvector:
- `storeChunkEmbedding(chunkId, embedding[])` -- UPDATE with `::vector` cast
- `findSimilarChunks(queryEmbedding[], limit, meetingId?)` -- cosine distance search using `<=>` operator

## Step 7: Seed Script

**File: `prisma/seed.ts`**

Migrates the existing mock data from `lib/mock-data/` into the database:
- Department (e.g. "Engineering")
- 3 roles (Admin, Member, Viewer) with permissions seeded via RolePermission
- Permissions for each resource/action pair (meetings.upload, tasks.update, etc.)
- 5 users (Sarah, Michael, Emily, David, Alex) assigned to department and roles via UserRole
- 6 meetings with participants via the join table
- 8 action items linked to meetings and users
- Uses `upsert` for idempotent re-runs

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## Step 8: Test Connection

**File: `scripts/test-db.ts`**

Verifies:
1. Basic connection (`SELECT 1`)
2. pgvector extension is installed (`pg_extension`)
3. All tables exist (`pg_tables`)
4. Vector operations work (`::vector` cast + `<=>` distance)
5. Row counts after seeding

Add script to `package.json`:
```json
{
  "scripts": {
    "db:test": "npx ts-node --compiler-options {\"module\":\"CommonJS\"} scripts/test-db.ts",
    "db:studio": "npx prisma studio",
    "db:migrate": "npx prisma migrate dev",
    "db:seed": "npx prisma db seed",
    "db:reset": "npx prisma migrate reset"
  }
}
```

---

## Verification

1. `docker compose up -d db` -- container starts, pgvector extension enabled
2. `npx prisma migrate dev` -- migrations apply without errors
3. `npx prisma db seed` -- mock data seeded
4. `npm run db:test` -- all checks pass (connection, pgvector, tables, data)
5. `npx prisma studio` -- visual confirmation at localhost:5555
