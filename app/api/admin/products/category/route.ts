import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { Category } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ _id: -1 });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const category = await Category.create(body);
  return NextResponse.json(category, { status: 201 });
}
