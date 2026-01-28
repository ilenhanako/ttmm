"use client";

import { Calendar } from "lucide-react";
import { MeetingCard } from "./meeting-card";
import type { Meeting, User } from "@/lib/mock-data";

interface MeetingListProps {
  meetings: Meeting[];
  users: User[];
}

function getParticipants(participantIds: string[], users: User[]): User[] {
  return users.filter((user) => participantIds.includes(user.id));
}

export function MeetingList({ meetings, users }: MeetingListProps) {
  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <Calendar className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No meetings found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filter to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
          participants={getParticipants(meeting.participants, users)}
        />
      ))}
    </div>
  );
}
