import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Calendar, Clock, Users, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { meetings, users, tasks } from "@/lib/mock-data";
import { PdfViewerMock } from "@/components/features/meetings";

interface MeetingDetailPageProps {
  params: { id: string };
}

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

function getTaskStatusColor(status: string) {
  switch (status) {
    case "done":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "review":
      return "bg-yellow-100 text-yellow-800";
    case "todo":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const meeting = meetings.find((m) => m.id === params.id);

  if (!meeting) {
    notFound();
  }

  const meetingTasks = tasks.filter((t) => t.meetingId === params.id);
  const participantUsers = users.filter((u) =>
    meeting.participants.includes(u.id)
  );

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/meetings">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Meetings
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{meeting.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{meeting.time}</span>
            </div>
            <span>|</span>
            <span>{meeting.duration}</span>
          </div>
        </div>
        <Badge className={getStatusColor(meeting.status)} variant="secondary">
          {meeting.status}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="action-items">
            Action Items ({meetingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="participants">
            Participants ({participantUsers.length})
          </TabsTrigger>
          <TabsTrigger value="minutes">Meeting Minutes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {meeting.summary ? (
                <p className="text-muted-foreground">{meeting.summary}</p>
              ) : (
                <p className="text-muted-foreground italic">
                  No summary available for this meeting.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {meeting.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{participantUsers.length}</div>
                <p className="text-xs text-muted-foreground">team members</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Items</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{meetingTasks.length}</div>
                <p className="text-xs text-muted-foreground">
                  {meetingTasks.filter((t) => t.status === "done").length} completed
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Action Items Tab */}
        <TabsContent value="action-items" className="space-y-4">
          {meetingTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckSquare className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">No action items</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  No tasks were created from this meeting.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {meetingTasks.map((task) => {
                const assignee = users.find((u) => u.id === task.assignee);
                return (
                  <Card key={task.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={assignee?.avatar} alt={assignee?.name} />
                          <AvatarFallback className="text-xs">
                            {assignee?.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Due: {task.dueDate} · Assigned to {assignee?.name}
                          </p>
                        </div>
                      </div>
                      <Badge className={getTaskStatusColor(task.status)} variant="secondary">
                        {task.status.replace("_", " ")}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          <Button variant="outline" asChild>
            <Link href="/dashboard/tasks">View All Tasks</Link>
          </Button>
        </TabsContent>

        {/* Participants Tab */}
        <TabsContent value="participants" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {participantUsers.map((participant) => (
              <Card key={participant.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback>
                      {participant.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{participant.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {participant.email}
                    </p>
                  </div>
                  <Badge variant="outline">{participant.role}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Meeting Minutes Tab */}
        <TabsContent value="minutes">
          <PdfViewerMock meetingTitle={meeting.title} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
