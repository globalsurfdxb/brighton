import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CatalogueRequest from "@/app/models/CatalogueRequest";
import DigitalCatalogue from "@/app/models/DigitalCatalogue";
import { catalogueFormSchema } from "@/lib/validations/catalogueFormSchema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = catalogueFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid form data" },
        { status: 400 },
      );
    }

    await connectDB();
    // Every submission is kept for the admin's records, even if the
    // catalogue file turns out to be unavailable below.
    const catalogueRequest = await CatalogueRequest.create(parsed.data);

    const catalogueDoc = await DigitalCatalogue.findOne({});
    if (!catalogueDoc?.firstSection?.catalogueLink) {
      return NextResponse.json(
        { message: "The catalogue is not available right now. Please try again later." },
        { status: 503 },
      );
    }

    const fileUrl = `/api/digital-catalogue/file?request=${catalogueRequest._id}`;

    return NextResponse.json(
      {
        data: {
          viewUrl: fileUrl,
          downloadUrl: `${fileUrl}&download=1`,
        },
        message: "Request received successfully",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
