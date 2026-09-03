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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    const doc = await getOrCreateDoc();
    const project = doc.projects.id(id);

    if (!project) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: project, message: "Project fetched successfully" },
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
      const existing = doc.projects.find(
        (p: any) => p.slug === body.slug && String(p._id) !== id,
      );
      if (existing) {
        return NextResponse.json(
          { message: "A project with this slug already exists" },
          { status: 409 },
        );
      }
    }

    const project = doc.projects.id(id);
    if (!project) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    Object.assign(project, body);
    await doc.save();

    revalidateTag("Projects", "default");

    return NextResponse.json(
      { data: project, message: "Project updated successfully" },
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
    const project = doc.projects.id(id);

    if (!project) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    project.deleteOne();
    await doc.save();

    revalidateTag("Projects", "default");

    return NextResponse.json(
      { data: doc.projects, message: "Project deleted successfully" },
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
