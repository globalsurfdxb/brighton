import { NextRequest, NextResponse } from "next/server";
import { ConfigCategory } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const configCategory = await ConfigCategory.findById(id);
  if (!configCategory)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(configCategory);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const configCategory = await ConfigCategory.findByIdAndUpdate(
    id,
    body,
    { new: true },
  );
  if (!configCategory)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(configCategory);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const configCategory = await ConfigCategory.findByIdAndDelete(id);
  if (!configCategory)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
