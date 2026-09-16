"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { File as FileIcon, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";

interface FileUploaderProps {
  value?: string;
  onChange: (url: string, fileName: string, size: string) => void;
  className?: string;
  accept?: Record<string, string[]>;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
}

function fileNameFromUrl(url?: string): string {
  if (!url) return "";
  const parts = url.split("/");
  return parts[parts.length - 1];
}

export function FileUploader({
  value,
  onChange,
  className,
  accept = {
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      [".docx"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  },
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Only holds the human-readable name of a file just uploaded in this
  // session — otherwise we derive it from `value`, so a name loaded later
  // (e.g. after an async form reset) still displays correctly.
  const [localFileName, setLocalFileName] = useState<string | null>(null);
  const fileName = localFileName ?? fileNameFromUrl(value);

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
          setError("Upload failed");
          return;
        }

        const data = await response.json();
        setLocalFileName(file.name);
        onChange(data.url, file.name, formatBytes(file.size));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload file");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    // Purely clears the field, same as ImageUploader — the blob garbage
    // collector reclaims the now-unreferenced file later.
    setLocalFileName(null);
    onChange("", "", "0");
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {value && fileName ? (
        <div className="flex items-center justify-between p-4 border rounded-lg border-black/20">
          <div className="flex items-center gap-2 break-word min-w-0">
            <FileIcon className="h-5 w-5 shrink-0 text-blue-500" />
            <span className="text-sm truncate">{fileName}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={removeFile}
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
              <FileIcon className="h-10 w-10 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? "Drop the file here"
                  : "Drag & drop a file here, or click to select"}
              </p>
            </>
          )}
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
