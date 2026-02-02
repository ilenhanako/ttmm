import { PrismaClient } from "@prisma/client";

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log("✓ Database connection: OK", result);

    // Test pgvector extension
    const vectorCheck = await prisma.$queryRaw`
      SELECT extname, extversion
      FROM pg_extension
      WHERE extname = 'vector'
    `;
    console.log("✓ pgvector extension:", vectorCheck);

    // Test tables exist
    const tables = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    console.log(
      "✓ Tables:",
      tables.map((t) => t.tablename)
    );

    // Test vector operations work
    await prisma.$queryRaw`
      SELECT '[1,2,3]'::vector(3) <=> '[4,5,6]'::vector(3) as distance
    `;
    console.log("✓ Vector operations: OK");

    // Count rows in each table
    const userCount = await prisma.user.count();
    const meetingCount = await prisma.meeting.count();
    const actionItemCount = await prisma.actionItem.count();
    const departmentCount = await prisma.department.count();
    const roleCount = await prisma.role.count();
    const permissionCount = await prisma.permission.count();
    console.log(
      `✓ Data: ${userCount} users, ${meetingCount} meetings, ${actionItemCount} action items, ${departmentCount} departments, ${roleCount} roles, ${permissionCount} permissions`
    );

    console.log("\nAll checks passed!");
  } catch (error) {
    console.error("Connection test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
