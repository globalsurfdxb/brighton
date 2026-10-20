"use client";

/**
 * Full-screen flipbook for the digital catalogue.
 *
 * pdf.js renders PDF pages to images and page-flip animates them as a book.
 * Both libraries are loaded on demand so they stay out of the page bundle.
 * Pages are rendered lazily around the reader's position, so a large
 * catalogue opens quickly and only pays for the pages actually viewed.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Loader2, X } from "lucide-react";
import type { PageFlip } from "page-flip";
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";
import type { CatalogueAccess } from "@/app/types/catalogueRequest";

const ease = [0.65, 0, 0.35, 1] as [number, number, number, number];

// Below this page width the book switches to single-page (portrait) mode.
const MIN_PAGE_WIDTH = 220;
// Pages rendered ahead of / behind the reader's position.
const RENDER_AHEAD = 4;
const RENDER_BEHIND = 2;
// Upper bound on rendered page width in device pixels, to cap memory use.
const MAX_RENDER_WIDTH = 1600;

type Status = "loading" | "ready" | "error";

interface CatalogueFlipbookProps {
  access: CatalogueAccess | null;
  onClose: () => void;
}

export default function CatalogueFlipbook({
  access,
  onClose,
}: CatalogueFlipbookProps) {
  useEffect(() => {
    if (!access) return;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [access, onClose]);

  return (
    <AnimatePresence>
      {access && (
        <motion.div
          key="catalogue-flipbook"
          role="dialog"
          aria-modal="true"
          aria-label="Brighton catalogue"
          data-lenis-prevent
          className="fixed inset-0 z-[110] flex flex-col bg-[#111]/95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease }}
        >
          <Book access={access} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Book({
  access,
  onClose,
}: {
  access: CatalogueAccess;
  onClose: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [pageCount, setPageCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;
    let pdf: PDFDocumentProxy | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const objectUrls: string[] = [];

    (async () => {
      try {
        const [pdfjs, { PageFlip }] = await Promise.all([
          import("pdfjs-dist"),
          import("page-flip"),
        ]);
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        // The file endpoint doesn't serve byte ranges, so fetch it whole.
        loadingTask = pdfjs.getDocument({
          url: access.viewUrl,
          disableRange: true,
        });
        pdf = await loadingTask.promise;
        if (cancelled) return;

        const firstPage = await pdf.getPage(1);
        const base = firstPage.getViewport({ scale: 1 });
        const ratio = base.width / base.height;
        const total = pdf.numPages;

        // Sizes the book to the largest spread (or single page) that fits.
        const fitBook = (book: HTMLElement) => {
          const { clientWidth: w, clientHeight: h } = stage;
          const spread = Math.min(w, h * 2 * ratio);
          book.style.width = `${
            spread < MIN_PAGE_WIDTH * 2 ? Math.min(w, h * ratio) : spread
          }px`;
        };

        // page-flip removes its root element on destroy, so it gets a node
        // React doesn't own.
        const book = document.createElement("div");
        book.className = "mx-auto";
        stage.appendChild(book);
        fitBook(book);

        const pages: HTMLElement[] = [];
        const images: HTMLImageElement[] = [];
        for (let i = 0; i < total; i++) {
          const page = document.createElement("div");
          page.className = "bg-white";
          const img = document.createElement("img");
          img.alt = `Catalogue page ${i + 1}`;
          img.draggable = false;
          img.className = "block h-full w-full object-contain select-none";
          page.appendChild(img);
          pages.push(page);
          images.push(img);
        }

        // Book width covers a single page in portrait and gives headroom for
        // zooming in landscape.
        const renderWidth = Math.min(
          MAX_RENDER_WIDTH,
          book.clientWidth * (window.devicePixelRatio || 1),
        );
        const rendered = new Set<number>();

        const renderPage = async (index: number) => {
          if (!pdf || rendered.has(index) || index < 0 || index >= total) return;
          rendered.add(index);
          try {
            const page = await pdf.getPage(index + 1);
            const viewport = page.getViewport({
              scale: renderWidth / page.getViewport({ scale: 1 }).width,
            });
            const canvas = document.createElement("canvas");
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            await page.render({ canvas, viewport }).promise;
            const blob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob(resolve, "image/jpeg", 0.85),
            );
            if (!blob || cancelled) return;
            const url = URL.createObjectURL(blob);
            objectUrls.push(url);
            images[index].src = url;
          } catch (error) {
            rendered.delete(index);
            console.error(error);
          }
        };

        const renderAround = (index: number) => {
          for (let i = index - RENDER_BEHIND; i <= index + RENDER_AHEAD; i++) {
            void renderPage(i);
          }
        };

        // Show the cover before handing control to the reader.
        await renderPage(0);
        if (cancelled) return;

        const flip = new PageFlip(book, {
          width: base.width,
          height: base.height,
          size: "stretch",
          minWidth: MIN_PAGE_WIDTH,
          maxWidth: 2000,
          showCover: true,
          usePortrait: true,
          mobileScrollSupport: false,
          maxShadowOpacity: 0.4,
          flippingTime: 800,
        });
        // page-flip sets the book to 100% width on init; restore the fitted size.
        fitBook(book);
        flip.loadFromHTML(pages);
        flip.on("flip", (e) => {
          const index = Number(e.data);
          setCurrent(index);
          renderAround(index);
        });
        flip.on("changeOrientation", (e) =>
          setIsLandscape(e.data === "landscape"),
        );
        flipRef.current = flip;

        resizeObserver = new ResizeObserver(() => {
          fitBook(book);
          flip.update();
        });
        resizeObserver.observe(stage);

        setPageCount(total);
        setIsLandscape(flip.getOrientation() === "landscape");
        setStatus("ready");
        renderAround(0);
      } catch (error) {
        console.error(error);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      flipRef.current?.destroy();
      flipRef.current = null;
      void loadingTask?.destroy();
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      stage.replaceChildren();
    };
  }, [access.viewUrl]);

  const flipPrev = useCallback(() => flipRef.current?.flipPrev(), []);
  const flipNext = useCallback(() => flipRef.current?.flipNext(), []);

  useEffect(() => {
    if (status !== "ready") return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") flipPrev();
      if (e.key === "ArrowRight") flipNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [status, flipPrev, flipNext]);

  // With the cover shown alone, spreads are (1,2), (3,4), …
  const showsSpread =
    isLandscape && current > 0 && current + 1 < pageCount;
  const pageLabel = showsSpread
    ? `${current + 1}–${current + 2}`
    : `${current + 1}`;

  const iconButton =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 hover:bg-white hover:text-black cursor-pointer disabled:opacity-30 disabled:pointer-events-none";

  return (
    <>
      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-10">
        <p className="text-subtitle text-white">Brighton Catalogue</p>

        <div className="flex items-center gap-3">
          <a
            href={access.downloadUrl}
            download
            className="flex h-10 items-center gap-2 rounded-full border border-white/30 px-5 text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">Download PDF</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close catalogue"
            className={iconButton}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center px-3 md:px-20">
        <div ref={stageRef} className="flex h-full w-full items-center" />

        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Loading catalogue…</p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <p>The catalogue preview couldn&apos;t be loaded.</p>
            <a
              href={access.downloadUrl}
              download
              className="rounded-full border border-white/30 px-5 py-2 text-sm transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Download the PDF instead
            </a>
          </div>
        )}

        {status === "ready" && (
          <>
            <button
              type="button"
              onClick={flipPrev}
              disabled={current === 0}
              aria-label="Previous page"
              className={`${iconButton} absolute left-3 top-1/2 z-10 -translate-y-1/2 bg-black/40 md:left-6`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={flipNext}
              disabled={current + (showsSpread ? 2 : 1) >= pageCount}
              aria-label="Next page"
              className={`${iconButton} absolute right-3 top-1/2 z-10 -translate-y-1/2 bg-black/40 md:right-6`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <p className="py-4 text-center text-sm text-white/70" aria-live="polite">
        {status === "ready" ? `Page ${pageLabel} of ${pageCount}` : " "}
      </p>
    </>
  );
}
