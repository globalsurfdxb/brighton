import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { ConfigCategory } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const configCategories = await ConfigCategory.find().sort({
    order: 1,
    _id: 1,
  });
  return NextResponse.json(configCategories);
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  if (body.order === undefined) {
    body.order = await ConfigCategory.countDocuments();
  }
  const configCategory = await ConfigCategory.create(body);
  return NextResponse.json(configCategory, { status: 201 });
}
