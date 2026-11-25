"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Images } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { uploadFile } from "@/lib/uploadFile";
import { DropzoneArea, UploaderError, rejectionMessage } from "./dropzone-area";

const IMAGE_FORMATS = "PNG, JPG, WEBP, GIF or SVG";

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
          acceptedFiles.map((file) => uploadFile(file, file.name)),
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
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"],
    },
    multiple: true,
    onDropRejected: (rejections) =>
      setError(rejectionMessage(rejections, IMAGE_FORMATS)),
  });

  return (
    <div className={cn("w-full space-y-3", className)}>
      <DropzoneArea
        rootProps={getRootProps()}
        inputProps={getInputProps()}
        icon={Images}
        isDragActive={isDragActive}
        isUploading={isUploading}
        noun="images"
        formats={`${IMAGE_FORMATS} · select several at once`}
        hint={recommendedDimension}
      />
      <UploaderError message={error} />
    </div>
  );
}
