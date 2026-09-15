import { Icon } from "@/app/models/product";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const icon = await Icon.findByIdAndUpdate(id, body, {
    returnDocument: "after",
  });
  if (!icon) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(icon);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const icon = await Icon.findByIdAndDelete(id);
  if (!icon) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
