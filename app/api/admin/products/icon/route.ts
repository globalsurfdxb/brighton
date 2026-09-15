import { NextRequest, NextResponse } from "next/server";
import { Icon } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const icons = await Icon.find().sort({ _id: -1 });
  return NextResponse.json(icons);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const icon = await Icon.create(body);
  return NextResponse.json(icon, { status: 201 });
}
