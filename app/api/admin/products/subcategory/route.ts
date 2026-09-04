import { NextRequest, NextResponse } from "next/server";
import { SubCategory } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  await connectDB();
  const categoryId = req.nextUrl.searchParams.get("category");
  const filter = categoryId ? { category: categoryId } : {};
  const subCategories = await SubCategory.find(filter)
    .populate("category")
    .sort({ _id: -1 });
  return NextResponse.json(subCategories);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const subCategory = await SubCategory.create(body);
  return NextResponse.json(subCategory, { status: 201 });
}