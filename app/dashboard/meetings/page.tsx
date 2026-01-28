"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeetingFilters, MeetingList } from "@/components/features/meetings";
import { meetings, users } from "@/lib/mock-data";

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const matchesSearch = meeting.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || meeting.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Track and manage your meeting notes
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/meetings/upload">
            <Plus className="mr-2 h-4 w-4" />
            New Meeting
          </Link>
        </Button>
      </div>

      <MeetingFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <MeetingList meetings={filteredMeetings} users={users} />
    </div>
  );
}
