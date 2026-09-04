import { NextRequest, NextResponse } from "next/server";
import { ConfigOption } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const configOption = await ConfigOption.findById(id).populate("category");
  if (!configOption)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(configOption);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const configOption = await ConfigOption.findByIdAndUpdate(id, body, {
    new: true,
  });
  if (!configOption)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(configOption);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const configOption = await ConfigOption.findByIdAndDelete(id);
  if (!configOption)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
