"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Film, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { uploadFile } from "@/lib/uploadFile";
import { Button } from "./button";
import { DropzoneArea, UploaderError, rejectionMessage } from "./dropzone-area";

const VIDEO_FORMATS = "MP4, WEBM, MOV, AVI or MKV";

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
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setIsUploading(true);
        setError(null);

        setProgress(0);
        const url = await uploadFile(file, file.name, { onProgress: setProgress });
        onChange(url, file);
        if (!deleteAfterUpload) {
          setLocalVideoUrl(url);
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
    onDropRejected: (rejections) =>
      setError(rejectionMessage(rejections, VIDEO_FORMATS)),
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
    <div className={cn("w-full space-y-3", className)}>
      {showPreview ? (
        <div className="relative aspect-video w-full max-w-[400px] overflow-hidden rounded-xl border border-secondary/60 bg-black shadow-sm">
          <video
            src={displayUrl as string}
            controls
            className="h-full w-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            title="Remove video"
            aria-label="Remove video"
            className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-md"
            onClick={removeVideo}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <DropzoneArea
          rootProps={getRootProps()}
          inputProps={getInputProps()}
          icon={Film}
          isDragActive={isDragActive}
          isUploading={isUploading}
          noun="a video"
          formats={VIDEO_FORMATS}
          progress={isUploading ? progress : undefined}
        />
      )}
      <UploaderError message={error} />
    </div>
  );
}
