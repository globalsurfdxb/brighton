"use client";

/**
 * Client-only entry point for producing the datasheet PDF.
 *
 * The heavy `@react-pdf/renderer` bundle and the document component are both
 * pulled in via dynamic `import()` so they stay out of the initial page
 * payload and only load when a user actually clicks "Download".
 */

import type { DatasheetData } from "./types";

let cached: Promise<{
  pdf: typeof import("@react-pdf/renderer")["pdf"];
  DatasheetDocument: typeof import("./DatasheetDocument")["DatasheetDocument"];
}> | null = null;

function loadRenderer() {
  if (!cached) {
    cached = Promise.all([
      import("@react-pdf/renderer"),
      import("./DatasheetDocument"),
    ]).then(([mod, doc]) => ({
      pdf: mod.pdf,
      DatasheetDocument: doc.DatasheetDocument,
    }));
  }
  return cached;
}

/** Renders `data` to a PDF `Blob`. Throws on failure — callers handle UI state. */
export async function renderDatasheetBlob(data: DatasheetData): Promise<Blob> {
  const { pdf, DatasheetDocument } = await loadRenderer();
  return pdf(<DatasheetDocument data={data} />).toBlob();
}

/**
 * Renders the datasheet and triggers a browser download.
 * Safe to call only in the browser.
 */
export async function downloadDatasheet(data: DatasheetData): Promise<void> {
  const blob = await renderDatasheetBlob(data);
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${data.meta.fileName}.pdf`;
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  } finally {
    // Release on the next tick so the click has a chance to start the download.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
