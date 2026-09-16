import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/app/models/product";


function sanitizeRefFields(value: any): any {
  if (Array.isArray(value)) {
    return value
      .map(sanitizeRefFields)
      .filter((v) => v !== "");
  }
  if (value && typeof value === "object") {
    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = sanitizeRefFields(val);
    }
    return result;
  }
  return value;
}

function stripEmptyRefs(body: Record<string, any>) {
  const clean = sanitizeRefFields(body);
  // top-level ref fields: unset instead of casting ""
  ["category", "subCategory"].forEach((key) => {
    if (clean[key] === "") delete clean[key];
  });
  if (clean.secondSection?.configurations) {
    clean.secondSection.configurations = clean.secondSection.configurations.map(
      (c: any) => ({
        ...c,
        category: c.category === "" ? undefined : c.category,
        defaultOption: c.defaultOption === "" ? undefined : c.defaultOption,
      }),
    );
  }
  return clean;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const product = await Product.findById(id)
    .populate("category")
    .populate("subCategory")
    .populate("secondSection.configurations.category")
    .populate("secondSection.configurations.options")
    .populate("secondSection.configurations.defaultOption")
    .populate("specs.common.spec")
    .populate("datasheet.icons.common.icon")
    .populate("datasheet.icons.specific");
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const cleanBody = stripEmptyRefs(body);

  try {
    const product = await Product.findByIdAndUpdate(id, cleanBody, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Failed to update product" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const product = await Product.findByIdAndDelete(id);
  if (!product)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}