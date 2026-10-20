import { unzipSync } from "fflate";
import {
  FILE_TYPES,
  MAX_IMPORT_FILE_BYTES,
  fileExt,
  formatBytes,
} from "@/lib/productCsv";

/**
 * The images ZIP of a product import, read in the browser. Only the index is
 * read up front; files are decompressed one at a time when they're needed.
 */
export type ImportZip = {
  name: string;
  data: Uint8Array;
  fileCount: number;
  /** lower-case path → path as stored */
  byPath: Map<string, string>;
  /** lower-case base name → every path with that name */
  byName: Map<string, string[]>;
  sizes: Map<string, number>;
  /** path → object URL, for thumbnails in the preview */
  previews: Map<string, string>;
};

const baseName = (path: string) => path.split("/").pop() ?? path;

export function readZip(name: string, data: Uint8Array): ImportZip {
  const zip: ImportZip = {
    name,
    data,
    fileCount: 0,
    byPath: new Map(),
    byName: new Map(),
    sizes: new Map(),
    previews: new Map(),
  };
  unzipSync(data, {
    filter: (file) => {
      // folders, macOS resource forks and hidden files
      if (file.name.endsWith("/") || /(^|\/)(__MACOSX\/|\.)/.test(file.name)) {
        return false;
      }
      const key = file.name.toLowerCase();
      zip.byPath.set(key, file.name);
      zip.byName.set(baseName(key), [...(zip.byName.get(baseName(key)) ?? []), file.name]);
      zip.sizes.set(file.name, file.originalSize);
      zip.fileCount++;
      return false; // index only, nothing decompressed
    },
  });
  return zip;
}

/** Find a cell's file name in the ZIP: by path first, then by name alone. */
export function findInZip(
  zip: ImportZip | null,
  ref: string,
): { path: string } | { error: string } {
  if (!zip) return { error: `"${ref}" is a file name — add the ZIP that contains it` };
  const key = ref.trim().replace(/\\/g, "/").replace(/^\.?\//, "").toLowerCase();
  const matches = zip.byPath.has(key)
    ? [zip.byPath.get(key)!]
    : (zip.byName.get(baseName(key)) ?? []);
  if (matches.length > 1) {
    return {
      error: `"${ref}" matches ${matches.length} files in the ZIP — use its folder path, e.g. "${matches[0]}"`,
    };
  }
  const path = matches[0];
  if (!path) return { error: `"${ref}" isn't in ${zip.name}` };
  const size = zip.sizes.get(path) ?? 0;
  if (size > MAX_IMPORT_FILE_BYTES) {
    return {
      error: `"${ref}" is ${formatBytes(size)} — files can be up to ${formatBytes(MAX_IMPORT_FILE_BYTES)}`,
    };
  }
  return { path };
}

export function extractFromZip(zip: ImportZip, path: string): File {
  const bytes = unzipSync(zip.data, { filter: (f) => f.name === path })[path];
  if (!bytes) throw new Error(`"${path}" couldn't be read from the ZIP`);
  return new File([bytes as Uint8Array<ArrayBuffer>], baseName(path));
}

const PREVIEW_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
};

/** Object URL of an image in the ZIP, created once and cached. */
export function zipPreviewUrl(zip: ImportZip, path: string): string | undefined {
  const ext = fileExt(path);
  if (!(FILE_TYPES.image as readonly string[]).includes(ext)) return undefined;
  let url = zip.previews.get(path);
  if (!url) {
    try {
      const file = extractFromZip(zip, path);
      url = URL.createObjectURL(new Blob([file], { type: PREVIEW_TYPES[ext] }));
      zip.previews.set(path, url);
    } catch {
      return undefined;
    }
  }
  return url;
}

export function closeZip(zip: ImportZip | null) {
  zip?.previews.forEach((url) => URL.revokeObjectURL(url));
  zip?.previews.clear();
}
