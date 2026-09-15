import { NextRequest, NextResponse } from "next/server";
import { GeneratedQr } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const qrs = await GeneratedQr.find().sort({ createdAt: -1 });
  return NextResponse.json(qrs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const qr = await GeneratedQr.create(body);
  return NextResponse.json(qr, { status: 201 });
}
