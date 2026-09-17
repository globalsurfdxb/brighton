import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import connectDB from "@/lib/mongodb";
import CatalogueRequest from "@/app/models/CatalogueRequest";
import DigitalCatalogue from "@/app/models/DigitalCatalogue";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { sendEmail } from "@/lib/azureEmail";
import {
  buildCatalogueApprovedEmail,
  CATALOGUE_EMAIL_LOGO_CID,
} from "@/lib/emailTemplates/catalogueRequestApproved";

const LOGO_PATH = path.join(
  process.cwd(),
  "public",
  "assets",
  "logos",
  "brighton-wordmark.png",
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const catalogueRequest = await CatalogueRequest.findById(id);
    if (!catalogueRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    if (catalogueRequest.status === "approved") {
      return NextResponse.json(
        { message: "This request has already been approved" },
        { status: 409 },
      );
    }

    const catalogueDoc = await DigitalCatalogue.findOne({});
    const catalogueUrl: string | undefined = catalogueDoc?.firstSection?.catalogueLink;

    if (!catalogueUrl) {
      return NextResponse.json(
        {
          message:
            "Upload a digital catalogue file on the Digital Catalogue page before approving requests",
        },
        { status: 400 },
      );
    }

    const fileResponse = await fetch(catalogueUrl);
    if (!fileResponse.ok) {
      return NextResponse.json(
        { message: "Failed to fetch the uploaded catalogue file" },
        { status: 500 },
      );
    }

    const fileBuffer = Buffer.from(await fileResponse.arrayBuffer());
    const contentType =
      fileResponse.headers.get("content-type") || "application/octet-stream";

    const rawName = decodeURIComponent(
      catalogueUrl.split("/").pop() || "brighton-catalogue.pdf",
    );
    // Uploaded blobs are stored as `${Date.now()}-original-name.ext`.
    const fileName = rawName.replace(/^\d+-/, "");

    const { subject, html, plainText } = buildCatalogueApprovedEmail({
      name: catalogueRequest.name,
      catalogueFileName: fileName,
    });

    const logoBuffer = await readFile(LOGO_PATH);

    await sendEmail({
      to: catalogueRequest.email,
      toName: catalogueRequest.name,
      subject,
      html,
      plainText,
      attachments: [
        {
          name: fileName,
          contentType,
          contentInBase64: fileBuffer.toString("base64"),
        },
        {
          name: "brighton-logo.png",
          contentType: "image/png",
          contentInBase64: logoBuffer.toString("base64"),
          contentId: CATALOGUE_EMAIL_LOGO_CID,
        },
      ],
    });

    catalogueRequest.status = "approved";
    catalogueRequest.approvedAt = new Date();
    await catalogueRequest.save();

    return NextResponse.json(
      {
        data: catalogueRequest,
        message: "Catalogue emailed to the requester successfully",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
