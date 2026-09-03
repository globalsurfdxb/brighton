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
    const doc = await getOrCreateDoc();

    return NextResponse.json(
      { data: doc.topics, message: "Topics fetched successfully" },
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

export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { message: "Title is required" },
        { status: 400 },
      );
    }

    const doc = await getOrCreateDoc();
    doc.topics.push({ title: body.title.trim() });
    await doc.save();

    revalidateTag("Blogs", "default");

    return NextResponse.json(
      { data: doc.topics, message: "Topic added successfully" },
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

export async function PATCH(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { message: "id is required" },
        { status: 400 },
      );
    }

    const doc = await getOrCreateDoc();
    const topic = doc.topics.id(body.id);
    if (!topic) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    topic.title = body.title?.trim();
    await doc.save();

    revalidateTag("Blogs", "default");

    return NextResponse.json(
      { data: doc.topics, message: "Topic updated successfully" },
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

export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "id is required" },
        { status: 400 },
      );
    }

    const doc = await getOrCreateDoc();
    const topic = doc.topics.id(id);
    if (!topic) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    topic.deleteOne();
    await doc.save();

    revalidateTag("Blogs", "default");

    return NextResponse.json(
      { data: doc.topics, message: "Topic deleted successfully" },
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