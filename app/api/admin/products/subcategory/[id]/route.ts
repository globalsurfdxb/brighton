import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { SubCategory } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  const subCategory = await SubCategory.findById(id).populate("category");
  if (!subCategory)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(subCategory);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const subCategory = await SubCategory.findByIdAndUpdate(id, body, {
    returnDocument: "after",
  });
  if (!subCategory)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(subCategory);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}