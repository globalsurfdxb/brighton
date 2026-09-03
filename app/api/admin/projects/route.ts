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

    const project = await getOrCreateDoc();

    return NextResponse.json(
      { data: project, message: "Project page fetched successfully" },
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
    const { regions, sectors, projects, ...rest } = body;

    const doc = await getOrCreateDoc();
    Object.assign(doc, rest);
    await doc.save();

    revalidateTag("Projects", "default");

    return NextResponse.json(
      { data: doc, message: "Project page updated successfully" },
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
