"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { uploadFile } from "@/lib/uploadFile";
import { Loader2 } from "lucide-react";
import "./tinymce-admin-theme.css";

const noopSubscribe = () => () => {};

const DEFAULT_CONTENT_CSS =
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

const DEFAULT_CONTENT_STYLE = `
  @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
  body { padding: 10px; }
`;

const FILE_PICKER_ACCEPT: Record<string, string> = {
  image: "image/*",
  media: "video/*",
  file: ".pdf,.doc,.docx,.xls,.xlsx",
};

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
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const [initialContent] = useState(() => newsContent ?? "");
  const hasSetInitialContent = useRef(!!newsContent);
  const userEdited = useRef(false);

  useEffect(() => {
    if (!hasSetInitialContent.current && newsContent && editorRef.current) {
      editorRef.current.setContent(newsContent);
      hasSetInitialContent.current = true;
    }
  }, [newsContent]);

  const uploadToBlobStorage = useCallback(
    (file: File | Blob, filename = "image.png") => uploadFile(file, filename),
    [],
  );

  const withUploadFeedback = useCallback(
    async <T,>(fn: () => Promise<T>, label = "image") => {
      let notification: { close: () => void } | null = null;
      try {
        setIsUploadingImage(true);
        if (editorRef.current) {
          notification = editorRef.current.notificationManager.open({
            text: `Uploading ${label}...`,
            type: "info",
            timeout: 0,
          });
        }
        const result = await fn();
        editorRef.current?.notificationManager.open({
          text: `${label[0].toUpperCase()}${label.slice(1)} uploaded successfully`,
          type: "success",
          timeout: 2000,
        });
        return result;
      } catch (error) {
        console.error(`TinyMCE ${label} upload error:`, error);
        editorRef.current?.notificationManager.open({
          text: `${label[0].toUpperCase()}${label.slice(1)} upload failed`,
          type: "error",
          timeout: 3000,
        });
        throw error;
      } finally {
        setIsUploadingImage(false);
        notification?.close();
      }
    },
    [],
  );

  const filePickerCallback = useCallback(
    (
      cb: (url: string, meta?: { title?: string; alt?: string }) => void,
      _value: string,
      meta: Record<string, unknown>,
    ) => {
      const filetype = (meta.filetype as string) ?? "image";
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", FILE_PICKER_ACCEPT[filetype] ?? "*/*");

      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;

        try {
          const uploadedUrl = await withUploadFeedback(
            () => uploadToBlobStorage(file, file.name),
            filetype === "media" ? "video" : filetype,
          );
          cb(uploadedUrl, { title: file.name });
        } catch {
          // error notification already handled in withUploadFeedback
        }
      });

      input.click();
    },
    [uploadToBlobStorage, withUploadFeedback],
  );

  const imagesUploadHandler = useCallback(
    async (blobInfo: { blob: () => Blob; filename: () => string }) => {
      return await withUploadFeedback(() =>
        uploadToBlobStorage(blobInfo.blob(), blobInfo.filename()),
      );
    },
    [uploadToBlobStorage, withUploadFeedback],
  );

  // Stable init object — only changes if useCustomStyles actually flips.
  const editorInit = useMemo(
    () => ({
      height: 500,
      menubar: false,
      theme: "silver",
      image_title: true,
      automatic_uploads: false,
      file_picker_types: "image media file",
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
        "removeformat | help | code | image media link",

      file_picker_callback: filePickerCallback,
      images_upload_handler: imagesUploadHandler,
    }),
    [useCustomStyles, filePickerCallback, imagesUploadHandler],
  );

  if (!mounted || isLoading) {
    return (
      <div className="flex h-[500px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-secondary/60 bg-cream-background/40">
        <Loader2 className="h-7 w-7 animate-spin text-description-color" />
        <p className="text-sm text-description-color">Loading editor…</p>
      </div>
    );
  }

  return (
    <>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_KEY}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
          editor.on("dirty", () => {
            userEdited.current = true;
            setNewsContent(editor.getContent());
          });
          if (!hasSetInitialContent.current && newsContent) {
            editor.setContent(newsContent);
            hasSetInitialContent.current = true;
          }
        }}
        initialValue={initialContent}
        onEditorChange={(content, editor) => {
          if (editor.isDirty()) userEdited.current = true;
          if (userEdited.current) setNewsContent(content);
        }}
        init={editorInit}
      />
      {isUploadingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-sm font-medium text-primary">Uploading file…</p>
          </div>
        </div>
      )}
    </>
  );
}