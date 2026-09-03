import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/app/models/Projects";
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

    let doc = await Project.findOne();
    if (!doc) doc = await Project.create({});

    const existing = doc.projects.find((p: any) => p.slug === body.slug);
    if (existing) {
      return NextResponse.json(
        { message: "A project with this slug already exists" },
        { status: 409 },
      );
    }

    doc.projects.push(body);
    await doc.save();
    const created = doc.projects[doc.projects.length - 1];

    revalidateTag("Projects", "default");

    return NextResponse.json(
      { data: created, message: "Project created successfully" },
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