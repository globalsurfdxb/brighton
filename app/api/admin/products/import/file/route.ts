import { NextRequest, NextResponse } from "next/server";
import {
  deleteFromBlob,
  downloadFromBlob,
  getBlobBaseUrl,
  getBlobNameFromUrl,
  isOwnBlobUrl,
} from "@/lib/azureBlob";
import { verifyAdmin } from "@/lib/verifyAdmin";
import {
  FILE_TYPES,
  MAX_IMPORT_FILE_BYTES,
  isLink,
  type FileKind,
} from "@/lib/productCsv";
import {
  ImportFileError,
  fetchImportFile,
  storeImportFile,
} from "@/lib/importFiles";

/** import-staging/<uuid>/<file name> — exactly what /api/admin/upload issues. */
const STAGED_NAME = /^import-staging\/[0-9a-f-]{36}\/[^/]+$/;

/**
 * One file of a product import, so a large import is many short requests
 * rather than one long one. Body: { kind: "image" | "document" } plus either
 * `url` (a link to download) or `staged` (a ZIP file the browser uploaded to
 * import-staging/ via /api/admin/upload). Answers with the stored link.
 */
export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { kind, url, staged } = (await req.json()) as {
      kind: FileKind;
      url?: string;
      staged?: string;
    };
    if (!(kind in FILE_TYPES)) {
      return NextResponse.json({ message: "Unknown file kind" }, { status: 400 });
    }

    if (url) {
      if (!isLink(url)) {
        return NextResponse.json({ message: "Not a link" }, { status: 400 });
      }
      // already ours — nothing to copy
      if (isOwnBlobUrl(url)) return NextResponse.json({ url });
      const { bytes, name } = await fetchImportFile(url, kind);
      return NextResponse.json({ url: await storeImportFile(bytes, name, kind) });
    }

    if (staged) {
      const blobName = isOwnBlobUrl(staged) ? getBlobNameFromUrl(staged) : "";
      if (!STAGED_NAME.test(blobName) || /\/\.{1,2}$/.test(blobName)) {
        return NextResponse.json({ message: "Not a staged upload" }, { status: 400 });
      }
      try {
        const bytes = await downloadFromBlob(blobName, MAX_IMPORT_FILE_BYTES);
        if (!bytes) {
          throw new ImportFileError(
            `File is larger than ${MAX_IMPORT_FILE_BYTES / 1024 / 1024} MB`,
          );
        }
        return NextResponse.json({
          url: await storeImportFile(bytes, blobName, kind),
        });
      } finally {
        // the staged copy is done with either way; the orphan sweep catches
        // any that a failed delete leaves behind
        await deleteFromBlob(blobName).catch(() => {});
      }
    }

    return NextResponse.json({ message: "No file or link" }, { status: 400 });
  } catch (e) {
    if (e instanceof ImportFileError) {
      return NextResponse.json({ message: e.message }, { status: 422 });
    }
    console.error("Import file error:", e);
    return NextResponse.json({ message: "Couldn't store the file" }, { status: 500 });
  }
}

/** Our storage's base URL, so the client can skip links that are already ours. */
export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ blobBaseUrl: getBlobBaseUrl() });
}
