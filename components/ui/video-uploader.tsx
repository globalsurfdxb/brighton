"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";

interface VideoUploaderProps {
  value?: string;
  onChange: (url: string, videoData?: File) => void;
  className?: string;
  deleteAfterUpload?: boolean;
}

export function VideoUploader({
  value,
  onChange,
  className,
  deleteAfterUpload = false,
}: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (response.status !== 200) {
          setLocalVideoUrl(null);
          setError("Upload failed");
          return;
        }

        const data = await response.json();
        onChange(data.url, file);
        if (!deleteAfterUpload) {
          setLocalVideoUrl(data.url);
        }
      } catch (err) {
        setLocalVideoUrl(null);
        setError(err instanceof Error ? err.message : "Failed to upload video");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, deleteAfterUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const displayUrl = localVideoUrl || value;
  const showPreview = !isUploading && !deleteAfterUpload && !!displayUrl;

  const removeVideo = () => {
    // Purely clears the field, same as ImageUploader — the blob garbage
    // collector reclaims the now-unreferenced file later.
    setLocalVideoUrl(null);
    onChange("", undefined);
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {showPreview ? (
        <div className="relative w-full max-w-[400px] aspect-video overflow-hidden rounded-lg border border-black/20">
          <video
            src={displayUrl as string}
            controls
            className="object-cover w-full h-full"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2 bg-red-500"
            onClick={removeVideo}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 transition-colors hover:border-gray-400",
            "flex flex-col items-center justify-center gap-2 cursor-pointer",
            isDragActive && "border-blue-500 bg-blue-50",
            isUploading && "pointer-events-none opacity-60",
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? "Drop the video here"
                  : "Drag & drop a video here, or click to select"}
              </p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
