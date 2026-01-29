"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, FileAudio, FileVideo, File } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error";
}

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes?: string;
  maxFiles?: number;
}

function getFileIcon(type: string) {
  if (type.startsWith("audio/")) return FileAudio;
  if (type.startsWith("video/")) return FileVideo;
  if (type.includes("pdf") || type.includes("document")) return FileText;
  return File;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  onFilesSelected,
  acceptedTypes = ".pdf,.doc,.docx,.txt,.mp3,.mp4,.wav,.m4a,.webm",
  maxFiles = 5,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      const newFiles = Array.from(fileList).slice(0, maxFiles - files.length);

      const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: "uploading" as const,
      }));

      setFiles((prev) => [...prev, ...uploadedFiles]);

      // Simulate upload progress
      uploadedFiles.forEach((uploadedFile) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id
                  ? { ...f, progress: 100, status: "complete" as const }
                  : f
              )
            );
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === uploadedFile.id ? { ...f, progress } : f
              )
            );
          }
        }, 200);
      });

      onFilesSelected(newFiles);
    },
    [files.length, maxFiles, onFilesSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className={cn(
              "rounded-full p-4 transition-colors",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "h-8 w-8",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <div>
            <p className="text-lg font-medium">
              Drag and drop your files here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse from your computer
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports PDF, Word, text files, and audio/video recordings (max {maxFiles} files)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded files</p>
          <div className="space-y-2">
            {files.map((uploadedFile) => {
              const FileIcon = getFileIcon(uploadedFile.file.type);
              return (
                <div
                  key={uploadedFile.id}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="rounded-lg bg-muted p-2">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                    {uploadedFile.status === "uploading" && (
                      <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removeFile(uploadedFile.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
