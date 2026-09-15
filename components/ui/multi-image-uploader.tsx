"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MultiImageUploaderProps {
  onUpload: (urls: string[]) => void;
  className?: string;
  recommendedDimension?: string;
}

export function MultiImageUploader({
  onUpload,
  className,
  recommendedDimension,
}: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      try {
        setIsUploading(true);
        setError(null);

        const urls = await Promise.all(
          acceptedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/api/admin/upload", {
              method: "POST",
              body: formData,
            });
            if (response.status !== 200) throw new Error("Upload failed");
            const data = await response.json();
            return data.url as string;
          }),
        );

        onUpload(urls);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to upload images",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".svg"],
    },
    multiple: true,
  });

  return (
    <div className={cn("space-y-2 w-full", className)}>
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
            <p className="text-gray-600">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="text-gray-600">
              {isDragActive
                ? "Drop the images here"
                : "Drag & drop images here, or click to select multiple"}
            </p>
            {recommendedDimension && (
              <p className="text-center text-xs text-gray-500">
                {recommendedDimension}
              </p>
            )}
          </>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
