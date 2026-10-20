import { BlobSASPermissions, BlobServiceClient } from "@azure/storage-blob";

const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "uploads";

let containerClient: ReturnType<BlobServiceClient["getContainerClient"]> | null =
  null;

function getContainerClient() {
  if (containerClient) return containerClient;

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("Please add AZURE_STORAGE_CONNECTION_STRING to your .env");
  }

  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  containerClient = blobServiceClient.getContainerClient(containerName);
  return containerClient;
}

export async function uploadToBlob(
  file: Buffer,
  fileName: string,
  contentType: string,
) {
  const client = getContainerClient();
  const blockBlobClient = client.getBlockBlobClient(fileName);
  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: contentType },
  });
  return blockBlobClient.url;
}

/**
 * Upload unless a blob with this name already exists (names are expected to be
 * content-addressed). A reused blob gets its last-modified time refreshed so
 * the orphan sweep's grace period restarts before the import references it.
 */
export async function uploadToBlobOnce(
  file: Buffer,
  fileName: string,
  contentType: string,
) {
  const blockBlobClient = getContainerClient().getBlockBlobClient(fileName);
  if (await blockBlobClient.exists()) {
    await blockBlobClient.setMetadata({ reused: new Date().toISOString() });
    return blockBlobClient.url;
  }
  await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: { blobContentType: contentType },
  });
  return blockBlobClient.url;
}

/**
 * A short-lived URL the browser can PUT one file to, so uploads go straight
 * to storage instead of through our server (no request-size limits). It can
 * only create / write that one blob.
 */
export async function createUploadUrl(blobName: string) {
  const blob = getContainerClient().getBlockBlobClient(blobName);
  try {
    const uploadUrl = await blob.generateSasUrl({
      permissions: BlobSASPermissions.parse("cw"),
      // allow for clock skew between us and Azure
      startsOn: new Date(Date.now() - 5 * 60_000),
      expiresOn: new Date(Date.now() + 15 * 60_000),
    });
    return { uploadUrl, url: blob.url };
  } catch (e) {
    throw new Error(
      "Can't create an upload link: AZURE_STORAGE_CONNECTION_STRING must include the AccountKey",
      { cause: e },
    );
  }
}

/** Read one blob, refusing anything over `maxBytes`. */
export async function downloadFromBlob(blobName: string, maxBytes: number) {
  const blob = getContainerClient().getBlockBlobClient(blobName);
  const { contentLength = 0 } = await blob.getProperties();
  if (contentLength > maxBytes) return null;
  return blob.downloadToBuffer();
}

export async function deleteFromBlob(fileName: string) {
  const client = getContainerClient();
  await client.getBlockBlobClient(fileName).deleteIfExists();
}

export function getBlobBaseUrl(): string {
  // e.g. https://acct.blob.core.windows.net/uploads
  return getContainerClient().url;
}

/** Is this string one of our own storage-blob URLs? */
export function isOwnBlobUrl(url: unknown): url is string {
  if (typeof url !== "string" || !url) return false;
  try {
    return url.split("?")[0].startsWith(getBlobBaseUrl());
  } catch {
    return false;
  }
}

export function getBlobNameFromUrl(url: string): string {
  const { pathname } = new URL(url.split("?")[0]);
  const parts = pathname.split("/").filter(Boolean); // [container, ...blobPath]
  parts.shift(); // drop the container segment
  return decodeURIComponent(parts.join("/"));
}

/**
 * Stream every blob in the container, newest API page at a time. Yields name +
 * last-modified so the garbage-collector never has to buffer the whole listing.
 */
export async function* listAllBlobs(): AsyncGenerator<{
  name: string;
  lastModified: Date;
}> {
  const client = getContainerClient();
  for await (const blob of client.listBlobsFlat()) {
    yield {
      name: blob.name,
      lastModified: blob.properties.lastModified ?? new Date(0),
    };
  }
}
