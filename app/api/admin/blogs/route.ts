import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blogs from "@/app/models/Blogs";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

async function getOrCreateDoc() {
  let doc = await Blogs.findOne();
  if (!doc) doc = await Blogs.create({});
  return doc;
}

export async function GET() {
  try {
    await connectDB();

    const blogs = await getOrCreateDoc();

    return NextResponse.json(
      { data: blogs, message: "Blogs page fetched successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { topics, blogs, ...rest } = body;

    const doc = await getOrCreateDoc();
    Object.assign(doc, rest);
    await doc.save();

    revalidateTag("Blogs", "default");

    return NextResponse.json(
      { data: doc, message: "Blogs page updated successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}