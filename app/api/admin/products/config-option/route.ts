import { NextRequest, NextResponse } from "next/server";
import { ConfigOption } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  await connectDB();
  const categoryId = req.nextUrl.searchParams.get("category");
  const filter = categoryId ? { category: categoryId } : {};
  const configOptions = await ConfigOption.find(filter)
    .populate("category")
    .sort({ order: 1, _id: 1 });
  return NextResponse.json(configOptions);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  if (body.order === undefined) {
    const filter = body.category ? { category: body.category } : {};
    body.order = await ConfigOption.countDocuments(filter);
  }
  const configOption = await ConfigOption.create(body);
  return NextResponse.json(configOption, { status: 201 });
}