import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/mongodb";
import CatalogueRequest from "@/app/models/CatalogueRequest";
import DigitalCatalogue from "@/app/models/DigitalCatalogue";

// Streams the uploaded catalogue PDF from our own origin. The flipbook reads
// the file with pdf.js in the browser, and Azure Blob Storage isn't
// CORS-configured for this site, so a direct fetch would fail. The file is
// only served against a stored form submission.
export async function GET(request: NextRequest) {
  try {
    const requestId = request.nextUrl.searchParams.get("request");
    if (!requestId || !isValidObjectId(requestId)) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await connectDB();
    const submission = await CatalogueRequest.exists({ _id: requestId });
    if (!submission) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const catalogueDoc = await DigitalCatalogue.findOne({});
    const catalogueUrl: string | undefined =
      catalogueDoc?.firstSection?.catalogueLink;
    if (!catalogueUrl) {
      return NextResponse.json(
        { message: "Catalogue not available" },
        { status: 404 },
      );
    }

    const upstream = await fetch(catalogueUrl);
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { message: "Failed to fetch the catalogue file" },
        { status: 502 },
      );
    }

    const rawName = decodeURIComponent(
      catalogueUrl.split("/").pop() || "brighton-catalogue.pdf",
    );
    // Uploaded blobs are stored as `${Date.now()}-original-name.ext`.
    const fileName = rawName.replace(/^\d+-/, "");
    const disposition =
      request.nextUrl.searchParams.get("download") === "1"
        ? "attachment"
        : "inline";

    const headers = new Headers({
      "Content-Type": upstream.headers.get("content-type") ?? "application/pdf",
      "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      "Cache-Control": "private, max-age=3600",
    });
    const length = upstream.headers.get("content-length");
    if (length) headers.set("Content-Length", length);

    return new NextResponse(upstream.body, { headers });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
