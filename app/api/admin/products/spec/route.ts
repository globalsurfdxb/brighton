import { NextRequest, NextResponse } from "next/server";
import { Spec } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const specs = await Spec.find().sort({ order: 1, _id: 1 });
  return NextResponse.json(specs);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  if (body.order === undefined) {
    body.order = await Spec.countDocuments();
  }
  const spec = await Spec.create(body);
  return NextResponse.json(spec, { status: 201 });
}
