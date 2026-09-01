"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

const DEFAULT_CONTENT_CSS =
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

const DEFAULT_CONTENT_STYLE = `
  @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
  body { padding: 10px; }
`;

const NEWS_CONTENT_STYLE = `
  body { padding: 10px; }

  .news-content h3 {
    font-size: 28px;
    line-height: 1.3;
    font-family: "itc-book", sans-serif;
    letter-spacing: -0.01em;
    color: #0A0A0A;
  }

  .news-content p {
    font-size: 18px;
    line-height: 1.54545455;
    font-family: "itc-medium", sans-serif;
    letter-spacing: -0.01em;
    color: #6B6B70;
  }

  .news-content img {
    border-radius: 10px;
    width: 100%;
    height: auto;
    max-height: 600px;
    object-fit: cover;
  }

  .news-content ul {
    list-style-type: disc;
    margin-left: 24px;
  }

  .news-content ul li {
    font-size: 18px;
    line-height: 1.54545455;
    font-family: "itc-medium", sans-serif;
    letter-spacing: -0.01em;
    color: #6B6B70;
  }

  .news-content ul li::marker {
    font-size: 18px;
  }

  @media (min-width: 768px) {
    .news-content h3 {
      line-height: 1.35714286;
    }
    .news-content p {
      line-height: 1.55555556;
    }
    .news-content ul {
      margin-left: 30px;
    }
    .news-content ul li {
      line-height: 1.55555556;
    }
    .news-content ul li::marker {
      font-size: 24px;
    }
  }
`;

export default function TinyEditor({
  setNewsContent,
  newsContent,
  isLoading,
  useCustomStyles = true,
}: {
  newsContent?: string;
  setNewsContent: Dispatch<SetStateAction<string>>;
  isLoading?: boolean;
  useCustomStyles?: boolean;
}) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const hasSetInitialContent = useRef(false);

  useEffect(() => {
    if (!hasSetInitialContent.current && newsContent && editorRef.current) {
      editorRef.current.setContent(newsContent);
      hasSetInitialContent.current = true;
    }
  }, [newsContent]);

  const uploadImageToDropbox = useCallback(
    async (file: File | Blob, filename = "image.png") => {
      const formData = new FormData();
      formData.append("file", file, filename);
      formData.append("fileType", "image");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Image upload failed");
      }

      return data.url as string;
    },
    [],
  );

  const withUploadFeedback = useCallback(async <T,>(fn: () => Promise<T>) => {
    let notification: { close: () => void } | null = null;
    try {
      setIsUploadingImage(true);
      if (editorRef.current) {
        notification = editorRef.current.notificationManager.open({
          text: "Uploading image...",
          type: "info",
          timeout: 0,
        });
      }
      const result = await fn();
      editorRef.current?.notificationManager.open({
        text: "Image uploaded successfully",
        type: "success",
        timeout: 2000,
      });
      return result;
    } catch (error) {
      console.error("TinyMCE image upload error:", error);
      editorRef.current?.notificationManager.open({
        text: "Image upload failed",
        type: "error",
        timeout: 3000,
      });
      throw error;
    } finally {
      setIsUploadingImage(false);
      notification?.close();
    }
  }, []);

  const filePickerCallback = useCallback(
    (cb: (url: string, meta?: { title: string }) => void) => {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");

      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;

        try {
          const uploadedUrl = await withUploadFeedback(() =>
            uploadImageToDropbox(file, file.name),
          );
          cb(uploadedUrl, { title: file.name });
        } catch {
          // error notification already handled in withUploadFeedback
        }
      });

      input.click();
    },
    [uploadImageToDropbox, withUploadFeedback],
  );

  const imagesUploadHandler = useCallback(
    async (blobInfo: { blob: () => Blob; filename: () => string }) => {
      return await withUploadFeedback(() =>
        uploadImageToDropbox(blobInfo.blob(), blobInfo.filename()),
      );
    },
    [uploadImageToDropbox, withUploadFeedback],
  );

  // Stable init object — only changes if useCustomStyles actually flips.
  const editorInit = useMemo(
    () => ({
      height: 500,
      menubar: false,
      theme: "silver",
      image_title: true,
      automatic_uploads: false,
      file_picker_types: "image",
      paste_data_images: true,

      content_css: useCustomStyles ? false : DEFAULT_CONTENT_CSS,
      body_class: useCustomStyles ? "news-content" : "",
      content_style: useCustomStyles
        ? NEWS_CONTENT_STYLE
        : DEFAULT_CONTENT_STYLE,

      plugins: [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "help",
        "wordcount",
      ],

      toolbar:
        "undo redo | blocks | " +
        "bold italic forecolor | alignleft aligncenter " +
        "alignright alignjustify | bullist numlist outdent indent | " +
        "removeformat | help | code | image",

      file_picker_callback: filePickerCallback,
      images_upload_handler: imagesUploadHandler,
    }),
    [useCustomStyles, filePickerCallback, imagesUploadHandler],
  );

  if (!mounted || isLoading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center border border-black/10 rounded-md">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_KEY}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          if (!hasSetInitialContent.current && newsContent) {
            editor.setContent(newsContent);
            hasSetInitialContent.current = true;
          }
        }}
        initialValue="<p></p>"
        onEditorChange={(content) => setNewsContent(content)}
        init={editorInit}
      />
      {isUploadingImage && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/20">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
    </>
  );
}