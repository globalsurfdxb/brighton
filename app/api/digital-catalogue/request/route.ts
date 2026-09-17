import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CatalogueRequest from "@/app/models/CatalogueRequest";
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
    await CatalogueRequest.create(parsed.data);

    return NextResponse.json(
      { message: "Request received successfully" },
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
