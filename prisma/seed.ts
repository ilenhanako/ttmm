import {
  PrismaClient,
  MeetingStatus,
  TaskStatus,
  TaskPriority,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ============================================
  // Department
  // ============================================
  const ski = await prisma.department.upsert({
    where: { id: "dept-ski" },
    update: {},
    create: { id: "dept-ski", name: "Strategy, Knowledge and Innovation" },
  });
  console.log("✓ Department seeded");

  // ============================================
  // Roles
  // ============================================
  const adminRole = await prisma.role.upsert({
    where: { id: "role-admin" },
    update: {},
    create: {
      id: "role-admin",
      name: "Admin",
      description: "Full access to all resources",
      level: 100,
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { id: "role-member" },
    update: {},
    create: {
      id: "role-member",
      name: "Member",
      description: "Standard team member access",
      level: 50,
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { id: "role-viewer" },
    update: {},
    create: {
      id: "role-viewer",
      name: "Viewer",
      description: "Read-only access",
      level: 10,
    },
  });
  console.log("✓ Roles seeded");

  // ============================================
  // Permissions
  // ============================================
  const permissionData = [
    {
      id: "perm-meetings-upload",
      resource: "meetings",
      action: "upload",
      description: "Upload PDF meeting minutes",
    },
    {
      id: "perm-meetings-view",
      resource: "meetings",
      action: "view",
      description: "View meetings",
    },
    {
      id: "perm-meetings-edit",
      resource: "meetings",
      action: "edit",
      description: "Edit meetings",
    },
    {
      id: "perm-meetings-delete",
      resource: "meetings",
      action: "delete",
      description: "Delete meetings",
    },
    {
      id: "perm-tasks-view",
      resource: "tasks",
      action: "view",
      description: "View tasks",
    },
    {
      id: "perm-tasks-update",
      resource: "tasks",
      action: "update",
      description: "Update task status",
    },
    {
      id: "perm-tasks-approve",
      resource: "tasks",
      action: "approve",
      description: "Approve or reject tasks",
    },
    {
      id: "perm-tasks-edit",
      resource: "tasks",
      action: "edit",
      description: "Edit tasks descriptions",
    },
    {
      id: "perm-tasks-assign",
      resource: "tasks",
      action: "assign",
      description: "Assign tasks to users",
    },
    {
      id: "perm-chat-query",
      resource: "chat",
      action: "query",
      description: "Query the chatbot",
    },
    {
      id: "perm-reports-generate",
      resource: "reports",
      action: "generate",
      description: "Generate reports",
    },
  ];

  for (const perm of permissionData) {
    await prisma.permission.upsert({
      where: { id: perm.id },
      update: {},
      create: perm,
    });
  }
  console.log("✓ Permissions seeded");

  // ============================================
  // RolePermissions
  // ============================================
  // Admin gets all permissions
  for (const perm of permissionData) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  // Member gets view, update tasks, chat
  const memberPermIds = [
    "perm-meetings-view",
    "perm-tasks-view",
    "perm-tasks-edit",
    "perm-tasks-update",
    "perm-chat-query",
  ];
  for (const permId of memberPermIds) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: memberRole.id,
          permissionId: permId,
        },
      },
      update: {},
      create: { roleId: memberRole.id, permissionId: permId },
    });
  }

  // Viewer gets view meetings, view tasks, chat
  const viewerPermIds = [
    "perm-meetings-view",
    "perm-tasks-view",
    "perm-chat-query",
  ];
  for (const permId of viewerPermIds) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: viewerRole.id,
          permissionId: permId,
        },
      },
      update: {},
      create: { roleId: viewerRole.id, permissionId: permId },
    });
  }
  console.log("✓ RolePermissions seeded");

  // ============================================
  // Users
  // ============================================
  const sarah = await prisma.user.upsert({
    where: { email: "sarah.chen@company.com" },
    update: {},
    create: {
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      avatar: "/avatars/sarah.jpg",
      departmentId: ski.id,
    },
  });

  const michael = await prisma.user.upsert({
    where: { email: "michael.johnson@company.com" },
    update: {},
    create: {
      name: "Michael Johnson",
      email: "michael.johnson@company.com",
      avatar: "/avatars/michael.jpg",
      departmentId: ski.id,
    },
  });

  const emily = await prisma.user.upsert({
    where: { email: "emily.rodriguez@company.com" },
    update: {},
    create: {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      avatar: "/avatars/emily.jpg",
      departmentId: ski.id,
    },
  });

  const david = await prisma.user.upsert({
    where: { email: "david.kim@company.com" },
    update: {},
    create: {
      name: "David Kim",
      email: "david.kim@company.com",
      avatar: "/avatars/david.jpg",
      departmentId: ski.id,
    },
  });

  const alex = await prisma.user.upsert({
    where: { email: "alex.thompson@company.com" },
    update: {},
    create: {
      name: "Alex Thompson",
      email: "alex.thompson@company.com",
      avatar: "/avatars/alex.jpg",
      departmentId: ski.id,
    },
  });
  console.log("✓ Users seeded");

  // ============================================
  // UserRoles
  // ============================================
  const userRoleAssignments = [
    { userId: sarah.id, roleId: adminRole.id },
    { userId: michael.id, roleId: memberRole.id },
    { userId: emily.id, roleId: memberRole.id },
    { userId: david.id, roleId: memberRole.id },
    { userId: alex.id, roleId: viewerRole.id },
  ];

  for (const assignment of userRoleAssignments) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: assignment.userId,
          roleId: assignment.roleId,
        },
      },
      update: {},
      create: assignment,
    });
  }
  console.log("✓ UserRoles seeded");

  // ============================================
  // Meetings
  // ============================================
  const meeting1 = await prisma.meeting.upsert({
    where: { id: "meeting-1" },
    update: {},
    create: {
      id: "meeting-1",
      title: "Q1 Planning Review",
      date: new Date("2024-01-15"),
      time: "10:00 AM",
      duration: "1h 30m",
      status: MeetingStatus.COMPLETED,
      summary:
        "Discussed Q1 objectives and key results. Agreed on priority projects for the quarter.",
      tags: ["planning", "quarterly"],
      createdBy: sarah.id,
    },
  });

  const meeting2 = await prisma.meeting.upsert({
    where: { id: "meeting-2" },
    update: {},
    create: {
      id: "meeting-2",
      title: "Product Roadmap Discussion",
      date: new Date("2024-01-18"),
      time: "2:00 PM",
      duration: "1h",
      status: MeetingStatus.COMPLETED,
      summary:
        "Reviewed product roadmap for H1. Identified key features and dependencies.",
      tags: ["product", "roadmap"],
      createdBy: sarah.id,
    },
  });

  const meeting3 = await prisma.meeting.upsert({
    where: { id: "meeting-3" },
    update: {},
    create: {
      id: "meeting-3",
      title: "Sprint Retrospective",
      date: new Date("2024-01-22"),
      time: "3:00 PM",
      duration: "45m",
      status: MeetingStatus.COMPLETED,
      summary:
        "Team reflected on sprint performance. Identified areas for improvement.",
      tags: ["sprint", "agile"],
      createdBy: michael.id,
    },
  });

  const meeting4 = await prisma.meeting.upsert({
    where: { id: "meeting-4" },
    update: {},
    create: {
      id: "meeting-4",
      title: "Client Onboarding Call",
      date: new Date("2024-01-25"),
      time: "11:00 AM",
      duration: "1h",
      status: MeetingStatus.UPCOMING,
      tags: ["client", "onboarding"],
      createdBy: sarah.id,
    },
  });

  const meeting5 = await prisma.meeting.upsert({
    where: { id: "meeting-5" },
    update: {},
    create: {
      id: "meeting-5",
      title: "Weekly Team Sync",
      date: new Date("2024-01-26"),
      time: "9:00 AM",
      duration: "30m",
      status: MeetingStatus.UPCOMING,
      tags: ["weekly", "sync"],
      createdBy: sarah.id,
    },
  });

  const meeting6 = await prisma.meeting.upsert({
    where: { id: "meeting-6" },
    update: {},
    create: {
      id: "meeting-6",
      title: "Design Review Session",
      date: new Date("2024-01-28"),
      time: "4:00 PM",
      duration: "1h 15m",
      status: MeetingStatus.UPCOMING,
      tags: ["design", "review"],
      createdBy: sarah.id,
    },
  });
  console.log("✓ Meetings seeded");

  // ============================================
  // MeetingParticipants
  // ============================================
  const participantData = [
    // Meeting 1: Sarah, Michael, Emily, David
    { meetingId: meeting1.id, userId: sarah.id },
    { meetingId: meeting1.id, userId: michael.id },
    { meetingId: meeting1.id, userId: emily.id },
    { meetingId: meeting1.id, userId: david.id },
    // Meeting 2: Sarah, Emily, Alex
    { meetingId: meeting2.id, userId: sarah.id },
    { meetingId: meeting2.id, userId: emily.id },
    { meetingId: meeting2.id, userId: alex.id },
    // Meeting 3: Michael, Emily, David
    { meetingId: meeting3.id, userId: michael.id },
    { meetingId: meeting3.id, userId: emily.id },
    { meetingId: meeting3.id, userId: david.id },
    // Meeting 4: Sarah, Michael
    { meetingId: meeting4.id, userId: sarah.id },
    { meetingId: meeting4.id, userId: michael.id },
    // Meeting 5: All
    { meetingId: meeting5.id, userId: sarah.id },
    { meetingId: meeting5.id, userId: michael.id },
    { meetingId: meeting5.id, userId: emily.id },
    { meetingId: meeting5.id, userId: david.id },
    { meetingId: meeting5.id, userId: alex.id },
    // Meeting 6: Sarah, Emily, Alex
    { meetingId: meeting6.id, userId: sarah.id },
    { meetingId: meeting6.id, userId: emily.id },
    { meetingId: meeting6.id, userId: alex.id },
  ];

  for (const p of participantData) {
    await prisma.meetingParticipant.upsert({
      where: {
        meetingId_userId: { meetingId: p.meetingId, userId: p.userId },
      },
      update: {},
      create: p,
    });
  }
  console.log("✓ MeetingParticipants seeded");

  // ============================================
  // ActionItems (Tasks)
  // ============================================
  const actionItemsData = [
    {
      id: "task-1",
      meetingId: meeting1.id,
      title: "Prepare Q1 budget proposal",
      description:
        "Create detailed budget breakdown for Q1 initiatives including headcount and tooling costs.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assignedTo: sarah.id,
      dueDate: new Date("2024-01-20"),
      tags: ["finance", "planning"],
      isApproved: true,
    },
    {
      id: "task-2",
      meetingId: meeting1.id,
      title: "Schedule stakeholder interviews",
      description:
        "Coordinate with product team to schedule interviews with key stakeholders for roadmap input.",
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      assignedTo: michael.id,
      dueDate: new Date("2024-01-22"),
      tags: ["stakeholder", "interviews"],
      isApproved: true,
    },
    {
      id: "task-3",
      meetingId: meeting1.id,
      title: "Update project timeline",
      description:
        "Revise project timeline based on new resource allocation discussed in the meeting.",
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      assignedTo: emily.id,
      dueDate: new Date("2024-01-25"),
      tags: ["timeline", "planning"],
      isApproved: true,
    },
    {
      id: "task-4",
      meetingId: meeting2.id,
      title: "Create feature specifications",
      description:
        "Document detailed specifications for the new dashboard features discussed in product roadmap.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assignedTo: emily.id,
      dueDate: new Date("2024-01-28"),
      tags: ["documentation", "product"],
      isApproved: true,
    },
    {
      id: "task-5",
      meetingId: meeting2.id,
      title: "Review API documentation",
      description:
        "Review and update API documentation for the upcoming integration.",
      status: TaskStatus.REVIEW,
      priority: TaskPriority.MEDIUM,
      assignedTo: david.id,
      dueDate: new Date("2024-01-24"),
      tags: ["api", "documentation"],
      isApproved: true,
    },
    {
      id: "task-6",
      meetingId: meeting3.id,
      title: "Implement sprint velocity tracking",
      description:
        "Set up automated velocity tracking based on retrospective insights.",
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      assignedTo: david.id,
      dueDate: new Date("2024-01-30"),
      tags: ["automation", "metrics"],
      isApproved: true,
    },
    {
      id: "task-7",
      meetingId: meeting4.id,
      title: "Prepare client demo environment",
      description:
        "Set up demo environment with sample data for client onboarding presentation.",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
      assignedTo: michael.id,
      dueDate: new Date("2024-01-24"),
      tags: ["demo", "client"],
      isApproved: true,
    },
    {
      id: "task-8",
      meetingId: meeting4.id,
      title: "Write onboarding documentation",
      description:
        "Create step-by-step onboarding guide for new clients.",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assignedTo: sarah.id,
      dueDate: new Date("2024-01-25"),
      tags: ["documentation", "onboarding"],
      isApproved: true,
    },
  ];

  for (const item of actionItemsData) {
    await prisma.actionItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    });
  }
  console.log("✓ ActionItems seeded");

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });