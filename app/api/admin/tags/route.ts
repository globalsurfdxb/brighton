import connectDB from "@/lib/mongodb";
import Tag from "@/app/models/Tags";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { headerScript, bodyScript } = body;
    const tag = await Tag.findOne({});
    if (tag) {
      tag.headerScript = headerScript;
      tag.bodyScript = bodyScript;
      await tag.save();
      return NextResponse.json(
        { message: "Tag updated successfully" },
        { status: 200 },
      );
    } else {
      const tag = new Tag({ headerScript, bodyScript });
      await tag.save();
      return NextResponse.json(
        { message: "Tag created successfully" },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log("Error saving tag", error);
    return NextResponse.json(
      { message: "Failed to save tag" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const tag = await Tag.findOne({});
    return NextResponse.json({ tag }, { status: 200 });
  } catch (error) {
    console.log("Error fetching tag", error);
    return NextResponse.json(
      { message: "Failed to fetch tag" },
      { status: 500 },
    );
  }
}
