"use client";

import Link from "next/link";
import { Calendar, Clock, CheckSquare, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Meeting, User } from "@/lib/mock-data";

interface MeetingCardProps {
  meeting: Meeting;
  participants: User[];
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

export function MeetingCard({ meeting, participants }: MeetingCardProps) {
  const displayParticipants = participants.slice(0, 4);
  const remainingCount = participants.length - 4;

  return (
    <Link href={`/dashboard/meetings/${meeting.id}`}>
      <Card className="h-full transition-colors hover:bg-accent/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight line-clamp-2">
              {meeting.title}
            </h3>
            <Badge className={cn(getStatusColor(meeting.status))} variant="secondary">
              {meeting.status}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{meeting.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{meeting.time}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="flex flex-wrap gap-1">
            {meeting.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-0">
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {displayParticipants.map((participant) => (
                <Avatar key={participant.id} className="h-7 w-7 border-2 border-background">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback className="text-xs">
                    {participant.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {remainingCount > 0 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +{remainingCount}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {meeting.actionItems && meeting.actionItems > 0 && (
              <div className="flex items-center gap-1">
                <CheckSquare className="h-3.5 w-3.5" />
                <span>{meeting.actionItems}</span>
              </div>
            )}
            <ChevronRight className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
