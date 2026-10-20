import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/app/models/product";
import connectDB from "@/lib/mongodb";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function PATCH(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { ids } = await req.json();
  if (!Array.isArray(ids)) {
    return NextResponse.json(
      { error: "ids must be an array" },
      { status: 400 },
    );
  }

  await Product.bulkWrite(
    ids.map((id: string, index: number) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
    })),
  );
  return NextResponse.json({ ok: true });
}
