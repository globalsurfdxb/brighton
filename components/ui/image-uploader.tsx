"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { uploadFile } from "@/lib/uploadFile";
import { Button } from "./button";
import { DropzoneArea, UploaderError, rejectionMessage } from "./dropzone-area";

const IMAGE_FORMATS = "PNG, JPG, WEBP, GIF or SVG";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string, imageData?: File) => void;
  className?: string;
  deleteAfterUpload?: boolean;
  isLogo?: boolean;
  multiple?: boolean;
  recommendedDimension?: string;
}

export function ImageUploader({
  value,
  onChange,
  className,
  deleteAfterUpload = false,
  isLogo = false,
  multiple = false,
  recommendedDimension,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        setIsUploading(true);
        setError(null);

        const url = await uploadFile(file, file.name);
        onChange(url, file);
        if (!deleteAfterUpload) {
          setLocalImageUrl(url);
        }
      } catch (err) {
        setLocalImageUrl(null);
        setError(err instanceof Error ? err.message : "Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, deleteAfterUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"],
    },
    maxFiles: multiple ? undefined : 1,
    multiple: multiple,
    onDropRejected: (rejections) =>
      setError(rejectionMessage(rejections, IMAGE_FORMATS)),
  });

  const displayUrl = localImageUrl || value;
  const showPreview = !isUploading && !deleteAfterUpload && !!displayUrl;

  const removeImage = () => {
    // Purely clears the field. No blob is deleted here — the image only really
    // goes away when the form is submitted without it and the blob
    // garbage-collector later reclaims the now-unreferenced file. This is what
    // keeps the DB reference and storage from ever drifting apart, even if the
    // page is refreshed before submit.
    setLocalImageUrl(null);
    onChange("", undefined);
    // toast.success("Image removed");
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      {showPreview ? (
        <div
          className={cn(
            "group relative overflow-hidden rounded-xl border border-secondary/60 shadow-sm",
            isLogo
              ? "h-[100px] w-[100px] bg-black"
              : "aspect-[4/3] w-full max-w-[300px] bg-cream-background",
          )}
        >
          <Image
            src={displayUrl as string}
            alt="Uploaded image"
            className={isLogo ? "object-contain p-2" : "object-cover"}
            fill
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            title="Remove image"
            aria-label="Remove image"
            className="absolute right-2 top-2 h-8 w-8 rounded-full shadow-md"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <DropzoneArea
          rootProps={getRootProps()}
          inputProps={getInputProps()}
          icon={ImageIcon}
          isDragActive={isDragActive}
          isUploading={isUploading}
          noun={multiple ? "images" : "an image"}
          formats={IMAGE_FORMATS}
          hint={recommendedDimension}
        />
      )}
      <UploaderError message={error} />
    </div>
  );
}
