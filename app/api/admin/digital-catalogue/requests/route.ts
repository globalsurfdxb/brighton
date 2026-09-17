import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CatalogueRequest from "@/app/models/CatalogueRequest";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function GET(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const requests = await CatalogueRequest.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        data: requests,
        message: "Catalogue requests fetched successfully",
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

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "No request IDs provided" },
        { status: 400 },
      );
    }

    await connectDB();
    await CatalogueRequest.deleteMany({ _id: { $in: ids } });

    return NextResponse.json(
      { message: "Catalogue requests deleted successfully" },
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
