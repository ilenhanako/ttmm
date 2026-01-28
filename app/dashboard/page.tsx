import { Calendar, CheckSquare, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { meetings, tasks, users } from "@/lib/mock-data";

const stats = [
  {
    title: "Total Meetings",
    value: meetings.length.toString(),
    description: "This month",
    icon: Calendar,
  },
  {
    title: "Active Tasks",
    value: tasks.filter((t) => t.status !== "done").length.toString(),
    description: "Pending completion",
    icon: CheckSquare,
  },
  {
    title: "Upcoming",
    value: meetings.filter((m) => m.status === "upcoming").length.toString(),
    description: "Scheduled meetings",
    icon: Clock,
  },
  {
    title: "Team Members",
    value: users.length.toString(),
    description: "Active users",
    icon: Users,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "urgent":
      return "destructive";
    case "high":
      return "default";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "secondary";
  }
}

function getUserById(id: string) {
  return users.find((u) => u.id === id);
}

export default function DashboardPage() {
  const recentMeetings = meetings.slice(0, 3);
  const recentTasks = tasks.filter((t) => t.status !== "done").slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your meetings and tasks.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Meetings</CardTitle>
            <CardDescription>Your latest meeting activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <p className="font-medium leading-none">{meeting.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {meeting.date} at {meeting.time}
                  </p>
                </div>
                <Badge className={getStatusColor(meeting.status)} variant="secondary">
                  {meeting.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Active Tasks</CardTitle>
            <CardDescription>Tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.map((task) => {
              const assignee = getUserById(task.assignee);
              return (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={assignee?.avatar} alt={assignee?.name} />
                      <AvatarFallback>
                        {assignee?.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-medium leading-none text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getPriorityColor(task.priority) as "default" | "secondary" | "destructive" | "outline"}>
                    {task.priority}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
