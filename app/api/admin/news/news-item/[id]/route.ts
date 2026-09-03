import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/app/models/News";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

async function getOrCreateDoc() {
  let doc = await News.findOne();
  if (!doc) doc = await News.create({});
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
    const news = doc.news.id(id);

    if (!news) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: news, message: "News fetched successfully" },
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
      const existing = doc.news.find(
        (p: any) => p.slug === body.slug && String(p._id) !== id,
      );
      if (existing) {
        return NextResponse.json(
          { message: "A news with this slug already exists" },
          { status: 409 },
        );
      }
    }

    const news = doc.news.id(id);
    if (!news) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    Object.assign(news, body);
    await doc.save();

    revalidateTag("News", "default");

    return NextResponse.json(
      { data: news, message: "News updated successfully" },
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
    const news = doc.news.id(id);

    if (!news) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    news.deleteOne();
    await doc.save();

    revalidateTag("News", "default");

    return NextResponse.json(
      { data: doc.news, message: "News deleted successfully" },
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
