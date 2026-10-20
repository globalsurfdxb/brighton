import { createHash } from "node:crypto";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { uploadToBlobOnce } from "@/lib/azureBlob";
import {
  FILE_TYPES,
  MAX_IMPORT_FILE_BYTES,
  fileExt,
  type FileKind,
} from "@/lib/productCsv";

/**
 * Server side of the product import's file step: download a linked file (or
 * take one from the images ZIP), check what it really is, and store it in
 * blob storage under a content-addressed name.
 */

const FETCH_TIMEOUT_MS = 20_000;
const MAX_REDIRECTS = 5;

/** A failure worth showing to the admin as-is. */
export class ImportFileError extends Error {}

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // photometric data files; browsers report these with no MIME type
  lbx: "application/octet-stream",
  ies: "application/octet-stream",
  ldt: "application/octet-stream",
};

// ------------------------------------------------------------ file type

const startsWith = (bytes: Buffer, signature: number[], offset = 0) =>
  signature.every((b, i) => bytes[offset + i] === b);

const ascii = (bytes: Buffer, start: number, end: number) =>
  bytes.subarray(start, end).toString("latin1");

const looksLikeHtml = (bytes: Buffer) =>
  /^\s*(<!doctype html|<html)|<head[\s>]|<body[\s>]/i.test(ascii(bytes, 0, 2048));

/**
 * The file's real type from its first bytes. The name only breaks ties the
 * bytes can't (old Office formats, text-based photometric files).
 */
function detectExt(bytes: Buffer, nameHint: string): string | null {
  const hint = fileExt(nameHint);
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "jpg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (ascii(bytes, 0, 4) === "GIF8") return "gif";
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 12) === "WEBP") return "webp";
  if (ascii(bytes, 4, 8) === "ftyp" && /^avi[fs]$/.test(ascii(bytes, 8, 12))) return "avif";
  if (ascii(bytes, 0, 5) === "%PDF-") return "pdf";
  // Office 2007+ files are ZIPs; their part names say which one
  if (startsWith(bytes, [0x50, 0x4b, 0x03, 0x04])) {
    if (bytes.includes("word/")) return "docx";
    if (bytes.includes("xl/")) return "xlsx";
    return null;
  }
  // Office 97-2003 compound file
  if (startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) {
    if (hint === "doc" || hint === "xls") return hint;
    if (bytes.includes(Buffer.from("WordDocument", "utf16le"))) return "doc";
    if (bytes.includes(Buffer.from("Workbook", "utf16le"))) return "xls";
    return null;
  }
  if (looksLikeHtml(bytes)) return null;
  const head = ascii(bytes, 0, 4096);
  if (/<svg[\s>]/i.test(head)) {
    // stored files are served as-is, so no scripts
    return /<script|javascript:|\son[a-z]+\s*=/i.test(bytes.toString("utf8"))
      ? null
      : "svg";
  }
  if (hint === "ies" || hint === "ldt" || hint === "lbx") return hint;
  return null;
}

const KIND_LABEL: Record<FileKind, string> = {
  image: "an image (JPG, PNG, WebP, GIF, AVIF or SVG)",
  document: "a PDF, Word, Excel or photometric (.ies, .ldt, .lbx) file",
};

/** Throws an ImportFileError unless the bytes are a file this column takes. */
export function identifyFile(bytes: Buffer, nameHint: string, kind: FileKind) {
  if (bytes.length === 0) throw new ImportFileError("The file is empty");
  const ext = detectExt(bytes, nameHint);
  if (!ext) {
    throw new ImportFileError(
      looksLikeHtml(bytes)
        ? "The link opened a web page, not the file. Share it as “Anyone with the link” and use the file's link, not a folder."
        : `Not ${KIND_LABEL[kind]}`,
    );
  }
  if (!(FILE_TYPES[kind] as readonly string[]).includes(ext)) {
    throw new ImportFileError(`This is a .${ext} file; this column needs ${KIND_LABEL[kind]}`);
  }
  return { ext, contentType: CONTENT_TYPES[ext] };
}

// -------------------------------------------------------------- storage

/** "My Photo (1).JPG" → "My-Photo-1.jpg" */
function safeFileName(nameHint: string, ext: string) {
  const base = (nameHint.split(/[\\/]/).pop() ?? "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);
  return `${base || "file"}.${ext}`;
}

/**
 * Store a checked file. The name is derived from the content hash, so the
 * same file imported twice (or used by many products) is one blob, and a
 * re-import of the same OneDrive link resolves to the link already saved.
 */
export async function storeImportFile(
  bytes: Buffer,
  nameHint: string,
  kind: FileKind,
): Promise<string> {
  if (bytes.length > MAX_IMPORT_FILE_BYTES) {
    throw new ImportFileError(
      `File is larger than ${MAX_IMPORT_FILE_BYTES / 1024 / 1024} MB`,
    );
  }
  const { ext, contentType } = identifyFile(bytes, nameHint, kind);
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 20);
  return uploadToBlobOnce(
    bytes,
    `imports/${hash}/${safeFileName(nameHint, ext)}`,
    contentType,
  );
}

// ------------------------------------------------------------ downloads

/**
 * Share links open a viewer page; these are the URLs that return the file
 * itself, best first. Each is tried until one yields a valid file.
 */
export function downloadCandidates(link: string): string[] {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return [link];
  }
  const host = url.hostname.toLowerCase();

  if (
    host === "1drv.ms" ||
    host === "onedrive.live.com" ||
    host.endsWith(".sharepoint.com")
  ) {
    const candidates: string[] = [];
    if (host.endsWith(".sharepoint.com")) {
      const direct = new URL(url);
      direct.searchParams.set("download", "1");
      candidates.push(direct.toString());
    }
    if (host === "onedrive.live.com" && /\/(redir|embed|view\.aspx)/i.test(url.pathname)) {
      const direct = new URL(url);
      direct.pathname = "/download";
      candidates.push(direct.toString());
    }
    // OneDrive shares API: "u!" + unpadded base64url of the share link
    const shareId = Buffer.from(link).toString("base64url");
    candidates.push(`https://api.onedrive.com/v1.0/shares/u!${shareId}/root/content`);
    candidates.push(link);
    return candidates;
  }

  if (host === "drive.google.com" || host === "docs.google.com") {
    const id =
      url.pathname.match(/\/d\/([\w-]+)/)?.[1] ?? url.searchParams.get("id");
    if (id) {
      return [
        // confirm=t skips the "can't scan for viruses" page on large files
        `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
        `https://drive.google.com/uc?export=download&id=${id}`,
      ];
    }
  }

  if (host === "www.dropbox.com" || host === "dropbox.com") {
    const direct = new URL(url);
    direct.searchParams.set("dl", "1");
    return [direct.toString()];
  }

  return [link];
}

function isPrivateIPv4(ip: string) {
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

function isPrivateIP(ip: string) {
  if (isIP(ip) === 4) return isPrivateIPv4(ip);
  const v6 = ip.toLowerCase();
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  if (mapped) return isPrivateIPv4(mapped);
  return (
    v6 === "::" ||
    v6 === "::1" ||
    /^f[cd]/.test(v6) || // unique local
    /^fe[89ab]/.test(v6) || // link local
    v6.startsWith("ff") // multicast
  );
}

/**
 * Admins paste these links, but the server fetches them: refuse anything that
 * points into our own network (localhost, cloud metadata, private ranges).
 * Checked on every redirect hop.
 */
async function assertPublicUrl(url: URL) {
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new ImportFileError("Only http(s) links can be imported");
  }
  const host = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(host)
    ? [host]
    : await lookup(host, { all: true })
        .then((list) => list.map((a) => a.address))
        .catch(() => {
          throw new ImportFileError(`Couldn't find the server “${host}”`);
        });
  if (addresses.some(isPrivateIP)) {
    throw new ImportFileError("Links to private network addresses aren't allowed");
  }
}

function fileNameFromHeaders(res: Response, url: URL) {
  const disposition = res.headers.get("content-disposition") ?? "";
  const encoded = disposition.match(/filename\*\s*=\s*[^']*''([^;]+)/i)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded.trim());
    } catch {}
  }
  const plain = disposition.match(/filename\s*=\s*"?([^";]+)"?/i)?.[1];
  if (plain) return plain.trim();
  try {
    return decodeURIComponent(url.pathname.split("/").pop() ?? "");
  } catch {
    return "";
  }
}

/** GET with manual, re-checked redirects and a hard size cap. */
async function download(link: string): Promise<{ bytes: Buffer; name: string }> {
  let url = new URL(link);
  for (let hop = 0; ; hop++) {
    await assertPublicUrl(url);
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; BrightonProductImport/1.0)" },
    });

    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      if (hop >= MAX_REDIRECTS) throw new ImportFileError("Too many redirects");
      url = new URL(location, url);
      continue;
    }
    if (res.status === 401 || res.status === 403) {
      throw new ImportFileError(
        "Access denied. The link isn't shared publicly — share it as “Anyone with the link”, or add the file to the ZIP.",
      );
    }
    if (res.status === 404) throw new ImportFileError("File not found at this link");
    if (!res.ok || !res.body) {
      throw new ImportFileError(`The server answered ${res.status}`);
    }
    const declared = Number(res.headers.get("content-length"));
    if (declared > MAX_IMPORT_FILE_BYTES) {
      throw new ImportFileError(
        `File is larger than ${MAX_IMPORT_FILE_BYTES / 1024 / 1024} MB`,
      );
    }

    const chunks: Uint8Array[] = [];
    let total = 0;
    const reader = res.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_IMPORT_FILE_BYTES) {
        await reader.cancel();
        throw new ImportFileError(
          `File is larger than ${MAX_IMPORT_FILE_BYTES / 1024 / 1024} MB`,
        );
      }
      chunks.push(value);
    }
    return { bytes: Buffer.concat(chunks), name: fileNameFromHeaders(res, url) };
  }
}

/**
 * Download a linked file, trying each direct-download form of a share link
 * until one is a valid file for this column. Reports the most useful failure.
 */
export async function fetchImportFile(
  link: string,
  kind: FileKind,
): Promise<{ bytes: Buffer; name: string }> {
  const errors: string[] = [];
  for (const candidate of downloadCandidates(link)) {
    try {
      const file = await download(candidate);
      identifyFile(file.bytes, file.name, kind);
      return file;
    } catch (e) {
      if (e instanceof ImportFileError) errors.push(e.message);
      else if (e instanceof Error && e.name === "TimeoutError")
        errors.push("The download timed out");
      else errors.push("Couldn't download the file");
    }
  }
  // a type / sharing problem says more than a fallback URL's 404
  const priority = [/web page|isn't shared|needs|^Not /i, /larger than|timed out/i];
  for (const pattern of priority) {
    const match = errors.find((e) => pattern.test(e));
    if (match) throw new ImportFileError(match);
  }
  throw new ImportFileError(errors[0] ?? "Couldn't download the file");
}
