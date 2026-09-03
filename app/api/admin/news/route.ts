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

export async function GET() {
  try {
    await connectDB();

    const news = await getOrCreateDoc();

    return NextResponse.json(
      { data: news, message: "News page fetched successfully" },
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
    const { topics, news, ...rest } = body;

    const doc = await getOrCreateDoc();
    Object.assign(doc, rest);
    await doc.save();

    revalidateTag("News", "default");

    return NextResponse.json(
      { data: doc, message: "News page updated successfully" },
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
