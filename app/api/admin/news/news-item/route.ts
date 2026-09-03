import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/app/models/News";
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

    let doc = await News.findOne();
    if (!doc) doc = await News.create({});

    const existing = doc.news.find((p: any) => p.slug === body.slug);
    if (existing) {
      return NextResponse.json(
        { message: "A news with this slug already exists" },
        { status: 409 },
      );
    }

    doc.news.push(body);
    await doc.save();
    const created = doc.news[doc.news.length - 1];

    revalidateTag("News", "default");

    return NextResponse.json(
      { data: created, message: "News created successfully" },
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