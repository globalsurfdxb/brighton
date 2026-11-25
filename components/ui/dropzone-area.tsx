"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import type { DropzoneRootProps, DropzoneInputProps, FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils/cn";

interface DropzoneAreaProps {
  rootProps: DropzoneRootProps;
  inputProps: DropzoneInputProps;
  icon: LucideIcon;
  isDragActive: boolean;
  isUploading: boolean;
  noun: string;
  formats?: string;
  hint?: string;
  progress?: number;
}

export function DropzoneArea({
  rootProps,
  inputProps,
  icon: Icon,
  isDragActive,
  isUploading,
  noun,
  formats,
  hint,
  progress,
}: DropzoneAreaProps) {
  return (
    <div
      {...rootProps}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-secondary/70 bg-cream-background/40 px-6 py-8 text-center transition-colors duration-200",
        "hover:border-primary/40 hover:bg-cream-background/80 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/10",
        isDragActive && "border-primary bg-cream-background",
        isUploading && "pointer-events-none opacity-70",
      )}
    >
      <input {...inputProps} />
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border border-secondary/60 bg-white text-description-color shadow-sm transition-colors duration-200 group-hover:text-primary",
          isDragActive && "text-primary",
        )}
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </span>

      {isUploading ? (
        <div className="flex w-full max-w-[220px] flex-col items-center gap-2">
          <p className="text-sm font-medium text-primary">
            Uploading{progress !== undefined ? ` ${Math.round(progress * 100)}%` : "…"}
          </p>
          {progress !== undefined && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary/40">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-200"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-description-color">
            {isDragActive ? (
              <span className="font-medium text-primary">Drop {noun} here</span>
            ) : (
              <>
                <span className="font-medium text-primary underline-offset-2 group-hover:underline">
                  Click to upload
                </span>{" "}
                or drag and drop {noun}
              </>
            )}
          </p>
          {formats && (
            <p className="text-xs text-description-color/70">{formats}</p>
          )}
          {hint && <p className="text-xs text-description-color/70">{hint}</p>}
        </div>
      )}
    </div>
  );
}

export function rejectionMessage(rejections: FileRejection[], formats?: string) {
  const code = rejections[0]?.errors[0]?.code;
  if (code === "file-invalid-type")
    return formats ? `Unsupported file type. Use ${formats}.` : "Unsupported file type.";
  if (code === "too-many-files") return "Please choose one file at a time.";
  return rejections[0]?.errors[0]?.message || "This file can't be uploaded.";
}

export function UploaderError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-red-600">
      {message}
    </p>
  );
}
