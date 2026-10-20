import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { ConfigCategory } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const { ids } = await req.json();
  if (!Array.isArray(ids)) {
    return NextResponse.json(
      { error: "ids must be an array" },
      { status: 400 },
    );
  }

  await Promise.all(
    ids.map((id: string, index: number) =>
      ConfigCategory.findByIdAndUpdate(id, { order: index }),
    ),
  );

  const configCategories = await ConfigCategory.find().sort({
    order: 1,
    _id: 1,
  });
  return NextResponse.json(configCategories);
}
