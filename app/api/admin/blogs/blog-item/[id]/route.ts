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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const doc = await getOrCreateDoc();
    const blog = doc.blogs.id(id);

    if (!blog) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: blog, message: "Blog fetched successfully" },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const doc = await getOrCreateDoc();

    if (body.slug) {
      const existing = doc.blogs.find(
        (p: any) => p.slug === body.slug && String(p._id) !== id,
      );
      if (existing) {
        return NextResponse.json(
          { message: "A blog with this slug already exists" },
          { status: 409 },
        );
      }
    }

    const blog = doc.blogs.id(id);
    if (!blog) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    Object.assign(blog, body);
    await doc.save();

    revalidateTag("Blogs", "default");

    return NextResponse.json(
      { data: blog, message: "Blog updated successfully" },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;

    const doc = await getOrCreateDoc();
    const blog = doc.blogs.id(id);

    if (!blog) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    blog.deleteOne();
    await doc.save();

    revalidateTag("Blogs", "default");

    return NextResponse.json(
      { data: doc.blogs, message: "Blog deleted successfully" },
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
