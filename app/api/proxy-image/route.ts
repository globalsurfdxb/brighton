import { NextRequest, NextResponse } from "next/server";

// Client-side PDF generation (@react-pdf/renderer) fetches <Image> sources
// directly from the browser. Our uploaded assets live on Azure Blob Storage,
// which isn't CORS-configured for this origin, so that fetch fails silently
// and the PDF renders blank. Routing through this same-origin proxy avoids
// the cross-origin request entirely.
const ALLOWED_HOSTS = ["azurebloglearn.blob.core.windows.net"];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  const upstream = await fetch(parsed.toString());
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 502 },
    );
  }

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
