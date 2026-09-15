import { GeneratedQr } from "@/app/models/product";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const qr = await GeneratedQr.findByIdAndDelete(id);
  if (!qr) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
