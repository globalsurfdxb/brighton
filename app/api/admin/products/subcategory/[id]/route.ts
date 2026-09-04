import { NextRequest, NextResponse } from "next/server";
import { SubCategory } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const subCategory = await SubCategory.findById(params.id).populate(
    "category",
  );
  if (!subCategory)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(subCategory);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const body = await req.json();
  const subCategory = await SubCategory.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  if (!subCategory)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(subCategory);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  const subCategory = await SubCategory.findByIdAndDelete(params.id);
  if (!subCategory)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
