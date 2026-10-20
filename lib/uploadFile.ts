/**
 * Upload a file from the browser straight to blob storage: ask our API for a
 * short-lived upload URL, then PUT the file to it. Resolves to the stored
 * file's public URL.
 *
 * The storage account needs a CORS rule allowing PUT from the site's origin —
 * see `npm run blob-cors`.
 */
export async function uploadFile(
  file: Blob,
  fileName: string,
  options: {
    purpose?: "import";
    /** 0 → 1 as the file is sent. */
    onProgress?: (fraction: number) => void;
  } = {},
): Promise<string> {
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName, purpose: options.purpose }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Upload failed");

  // XMLHttpRequest rather than fetch: it reports upload progress
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.uploadUrl);
    xhr.setRequestHeader("x-ms-blob-type", "BlockBlob");
    xhr.setRequestHeader(
      "x-ms-blob-content-type",
      file.type || "application/octet-stream",
    );
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) options.onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload failed (storage answered ${xhr.status})`));
    // a CORS rejection surfaces as a bare network error
    xhr.onerror = () =>
      reject(
        new Error(
          "Upload failed — check your connection, and that storage CORS allows this site",
        ),
      );
    xhr.send(file);
  });

  return data.url as string;
}
