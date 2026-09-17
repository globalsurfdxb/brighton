import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CatalogueRequest from "@/app/models/CatalogueRequest";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function DELETE(
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

    const deleted = await CatalogueRequest.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Catalogue request deleted successfully" },
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
