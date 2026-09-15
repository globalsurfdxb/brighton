import { Spec } from "@/app/models/product";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const spec = await Spec.findByIdAndUpdate(id, body, {
    returnDocument: "after",
  });
  if (!spec) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(spec);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const spec = await Spec.findByIdAndDelete(id);
  if (!spec) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
