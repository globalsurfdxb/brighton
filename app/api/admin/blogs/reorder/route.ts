import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blogs from "@/app/models/Blogs";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

// blogs live as an embedded array, so their order is the array order
export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { ids } = await request.json();
    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { message: "ids must be an array" },
        { status: 400 },
      );
    }

    const doc = await Blogs.findOne();
    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    type BlogSubdoc = { _id: unknown; toObject: () => object };
    const byId = new Map<string, BlogSubdoc>(
      doc.blogs.map((p: BlogSubdoc) => [String(p._id), p]),
    );
    if (
      ids.length !== byId.size ||
      new Set(ids).size !== ids.length ||
      !ids.every((id: string) => byId.has(String(id)))
    ) {
      return NextResponse.json(
        { message: "Blog list is out of date, please refresh" },
        { status: 409 },
      );
    }

    doc.blogs = ids.map((id: string) => byId.get(String(id))!.toObject());
    await doc.save();

    revalidateTag("Blogs", "default");

    return NextResponse.json(
      { data: doc.blogs, message: "Blog order updated" },
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
