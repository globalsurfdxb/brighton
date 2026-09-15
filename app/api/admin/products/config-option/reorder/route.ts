import { NextRequest, NextResponse } from "next/server";
import { ConfigOption } from "@/app/models/product";
import connectDB from "@/lib/mongodb";

export async function PATCH(req: NextRequest) {
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
      ConfigOption.findByIdAndUpdate(id, { order: index }),
    ),
  );

  const configOptions = await ConfigOption.find({ _id: { $in: ids } })
    .populate("category")
    .sort({ order: 1 });
  return NextResponse.json(configOptions);
}
