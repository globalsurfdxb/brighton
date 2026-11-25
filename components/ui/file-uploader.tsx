"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, FileUp, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { uploadFile } from "@/lib/uploadFile";
import { Button } from "./button";
import { DropzoneArea, UploaderError, rejectionMessage } from "./dropzone-area";

interface FileUploaderProps {
  value?: string;
  onChange: (url: string, fileName: string, size: string) => void;
  className?: string;
  accept?: Record<string, string[]>;
}

export const DOCUMENT_ACCEPT: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
};

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
  accept = DOCUMENT_ACCEPT,
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Only holds the human-readable name of a file just uploaded in this
  // session — otherwise we derive it from `value`, so a name loaded later
  // (e.g. after an async form reset) still displays correctly.
  const [localFileName, setLocalFileName] = useState<string | null>(null);
  const fileName = localFileName ?? fileNameFromUrl(value);
  const formats = Object.values(accept)
    .flat()
    .map((ext) => ext.replace(".", "").toUpperCase())
    .join(", ");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setIsUploading(true);
        setError(null);

        const url = await uploadFile(file, file.name);
        setLocalFileName(file.name);
        onChange(url, file.name, formatBytes(file.size));
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
    onDropRejected: (rejections) =>
      setError(rejectionMessage(rejections, formats)),
  });

  const removeFile = () => {
    // Purely clears the field, same as ImageUploader — the blob garbage
    // collector reclaims the now-unreferenced file later.
    setLocalFileName(null);
    onChange("", "", "0");
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      {value && fileName ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-secondary/60 bg-white p-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <FileText className="h-5 w-5" />
            </span>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              title="Open file in a new tab"
              className="truncate text-sm font-medium text-primary hover:underline"
            >
              {fileName}
            </a>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Remove file"
            aria-label="Remove file"
            className="shrink-0 rounded-full text-description-color hover:bg-red-50 hover:text-red-600"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <DropzoneArea
          rootProps={getRootProps()}
          inputProps={getInputProps()}
          icon={FileUp}
          isDragActive={isDragActive}
          isUploading={isUploading}
          noun="a file"
          formats={formats}
        />
      )}
      <UploaderError message={error} />
    </div>
  );
}
