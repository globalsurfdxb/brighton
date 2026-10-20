import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createUploadUrl } from "@/lib/azureBlob";
import { verifyAdmin } from "@/lib/verifyAdmin";

/**
 * Hands out a short-lived upload URL; the browser then PUTs the file straight
 * to blob storage (see lib/uploadFile.ts), so file size isn't limited by our
 * server or host. Body: { fileName, purpose? }.
 *
 * purpose "import" stages a product-import file under import-staging/, where
 * /api/admin/products/import/file checks it and stores it for real.
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { fileName, purpose } = (await request.json()) as {
      fileName?: string;
      purpose?: "import";
    };
    if (!fileName) {
      return NextResponse.json({ message: "No file name provided" }, { status: 400 });
    }

    const safeName =
      fileName
        .split(/[\\/]/)
        .pop()!
        .replace(/\s+/g, "-")
        .replace(/^\.+/, "") || "file";
    const blobName =
      purpose === "import"
        ? `import-staging/${randomUUID()}/${safeName}`
        : `${Date.now()}-${safeName}`;
    // Not referenced by any document yet. If the admin never saves a form that
    // uses it, the blob garbage-collector reclaims it after the grace period.
    const { uploadUrl, url } = await createUploadUrl(blobName);

    return NextResponse.json({ uploadUrl, url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}
