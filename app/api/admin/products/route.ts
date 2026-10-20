import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import connectDB from "@/lib/mongodb";
import { Product } from "@/app/models/product";

export async function GET(req: NextRequest) {
  await connectDB();
  const categoryId = req.nextUrl.searchParams.get("category");
  const subCategoryId = req.nextUrl.searchParams.get("subCategory");

  const filter: Record<string, string> = {};
  if (categoryId) filter.category = categoryId;
  if (subCategoryId) filter.subCategory = subCategoryId;

  const products = await Product.find(filter)
    .populate("category")
    .populate("subCategory")
    .sort({ order: 1, _id: -1 });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json(product, { status: 201 });
}
