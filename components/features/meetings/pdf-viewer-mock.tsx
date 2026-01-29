"use client";

import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PdfViewerMockProps {
  meetingTitle: string;
}

export function PdfViewerMock({ meetingTitle }: PdfViewerMockProps) {
  return (
    <Card>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span className="font-medium">Meeting Minutes</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">1 / 3</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">100%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Page Mock */}
      <CardContent className="flex justify-center bg-muted/50 p-8">
        <div className="w-full max-w-[680px] rounded bg-white p-10 shadow-sm">
          {/* Document Header */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">{meetingTitle}</h2>
            <p className="mt-1 text-sm text-gray-500">Meeting Minutes — Confidential</p>
          </div>

          {/* Mock content lines */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 h-3 w-24 rounded bg-gray-300" />
              <div className="space-y-2">
                <div className="h-2.5 w-full rounded bg-gray-200" />
                <div className="h-2.5 w-11/12 rounded bg-gray-200" />
                <div className="h-2.5 w-4/5 rounded bg-gray-200" />
              </div>
            </div>

            <div>
              <div className="mb-2 h-3 w-32 rounded bg-gray-300" />
              <div className="space-y-2">
                <div className="h-2.5 w-full rounded bg-gray-200" />
                <div className="h-2.5 w-10/12 rounded bg-gray-200" />
                <div className="h-2.5 w-full rounded bg-gray-200" />
                <div className="h-2.5 w-9/12 rounded bg-gray-200" />
              </div>
            </div>

            <div>
              <div className="mb-2 h-3 w-28 rounded bg-gray-300" />
              <div className="space-y-2">
                <div className="h-2.5 w-full rounded bg-gray-200" />
                <div className="h-2.5 w-11/12 rounded bg-gray-200" />
                <div className="h-2.5 w-3/4 rounded bg-gray-200" />
                <div className="h-2.5 w-full rounded bg-gray-200" />
                <div className="h-2.5 w-5/6 rounded bg-gray-200" />
              </div>
            </div>

            <div>
              <div className="mb-2 h-3 w-36 rounded bg-gray-300" />
              <div className="space-y-2">
                <div className="h-2.5 w-full rounded bg-gray-200" />
                <div className="h-2.5 w-10/12 rounded bg-gray-200" />
                <div className="h-2.5 w-full rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
