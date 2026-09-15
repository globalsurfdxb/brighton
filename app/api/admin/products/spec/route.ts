import { NextRequest, NextResponse } from "next/server";
import { Spec } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const specs = await Spec.find().sort({ _id: -1 });
  return NextResponse.json(specs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const spec = await Spec.create(body);
  return NextResponse.json(spec, { status: 201 });
}
