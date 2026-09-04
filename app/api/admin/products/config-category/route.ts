import { NextRequest, NextResponse } from "next/server";
import { ConfigCategory } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const configCategories = await ConfigCategory.find().sort({ _id: -1 });
  return NextResponse.json(configCategories);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const configCategory = await ConfigCategory.create(body);
  return NextResponse.json(configCategory, { status: 201 });
}
