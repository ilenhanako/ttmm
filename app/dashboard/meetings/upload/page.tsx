"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/features/meetings/file-upload";

export default function MeetingUploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, you would upload files and process them here
    router.push("/dashboard/meetings");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/meetings">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Meeting</h1>
          <p className="text-muted-foreground">
            Upload recordings or documents to create a new meeting entry
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
              <CardDescription>
                Provide basic information about the meeting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Meeting Title
                </label>
                <Input
                  id="title"
                  placeholder="e.g., Q1 Planning Session"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
              <CardDescription>
                Upload meeting recordings, transcripts, or notes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFilesSelected={handleFilesSelected} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Processing
              </CardTitle>
              <CardDescription>What happens after you upload</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    1
                  </span>
                  <span>Key topics and decisions are extracted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    2
                  </span>
                  <span>Action items are identified and assigned</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    3
                  </span>
                  <span>Meeting summary is generated</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={files.length === 0 || isProcessing}
          >
            {isProcessing ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Process Meeting
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
