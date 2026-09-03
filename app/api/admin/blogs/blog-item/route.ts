import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blogs from "@/app/models/Blogs";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { message: "Title and slug are required" },
        { status: 400 },
      );
    }

    let doc = await Blogs.findOne();
    if (!doc) doc = await Blogs.create({});

    const existing = doc.blogs.find((p: any) => p.slug === body.slug);
    if (existing) {
      return NextResponse.json(
        { message: "A blog with this slug already exists" },
        { status: 409 },
      );
    }

    doc.blogs.push(body);
    await doc.save();
    const created = doc.blogs[doc.blogs.length - 1];

    revalidateTag("Blogs", "default");

    return NextResponse.json(
      { data: created, message: "Blog created successfully" },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}