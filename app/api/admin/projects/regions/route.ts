import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/app/models/Projects";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

async function getOrCreateDoc() {
  let doc = await Project.findOne();
  if (!doc) doc = await Project.create({});
  return doc;
}

export async function GET() {
  try {
    await connectDB();
    const doc = await getOrCreateDoc();

    return NextResponse.json(
      { data: doc.regions, message: "Regions fetched successfully" },
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
    doc.regions.push({ title: body.title.trim() });
    await doc.save();

    revalidateTag("Projects", "default");

    return NextResponse.json(
      { data: doc.regions, message: "Region added successfully" },
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
    const region = doc.regions.id(body.id);
    if (!region) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    region.title = body.title?.trim();
    await doc.save();

    revalidateTag("Projects", "default");

    return NextResponse.json(
      { data: doc.regions, message: "Region updated successfully" },
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
    const region = doc.regions.id(id);
    if (!region) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    region.deleteOne();
    await doc.save();

    revalidateTag("Projects", "default");

    return NextResponse.json(
      { data: doc.regions, message: "Region deleted successfully" },
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