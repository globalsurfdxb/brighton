import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/app/models/Services";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const service = await Service.findById(id);

    if (!service) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: service, message: "Service fetched successfully" },
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

export async function PATCH(
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
    const body = await request.json();

    if (body.slug) {
      const existing = await Service.findOne({
        slug: body.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return NextResponse.json(
          { message: "A service with this slug already exists" },
          { status: 409 },
        );
      }
    }

    const updated = await Service.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    revalidateTag("Services", "default");

    return NextResponse.json(
      { data: updated, message: "Service updated successfully" },
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

    const deleted = await Service.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    revalidateTag("Services", "default");

    return NextResponse.json(
      { message: "Service deleted successfully" },
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
