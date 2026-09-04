import { NextRequest, NextResponse } from "next/server";
import { Category } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ _id: -1 });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const category = await Category.create(body);
  return NextResponse.json(category, { status: 201 });
}
