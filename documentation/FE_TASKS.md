# Tasks Page with Kanban Board
Create a tasks page at `/dashboard/tasks` with an interactive Kanban board. Tasks can be dragged between columns (todo, in_progress, review, done) using @dnd-kit library.

```
Dependencies to Install:
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilitie
```

## Files
1. `components/features/tasks/task-card.tsx`  │ Draggable task card with priority, assignee, due date
2. `components/features/tasks/kanban-column.tsx`  │ Droppable column container with header and task list
3. `components/features/tasks/kanban-board.tsx`  │ Main board with DndContext, manages drag state 
4. `components/features/tasks/priority-badge.tsx` │ Priority indicator (urgent/high/medium/low)
5. `components/features/tasks/index.ts`           │ Barrel exports
6. `app/dashboard/tasks/page.tsx`                 │ Tasks page rendering the Kanban board  

## Kanban Columns
Column: To Do  │ Status Value: todo  │ Color: Gray
Column: In Progress  │ Status Value: in_progress  │ Color: Blue
Column: Review  │ Status Value: review  │ Color: Yellow
Column: Done  │ Status Value: done  │ Color: Green