import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/app/models/News";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

// news live as an embedded array, so their order is the array order
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

    const doc = await News.findOne();
    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    type NewsSubdoc = { _id: unknown; toObject: () => object };
    const byId = new Map<string, NewsSubdoc>(
      doc.news.map((p: NewsSubdoc) => [String(p._id), p]),
    );
    if (
      ids.length !== byId.size ||
      new Set(ids).size !== ids.length ||
      !ids.every((id: string) => byId.has(String(id)))
    ) {
      return NextResponse.json(
        { message: "News list is out of date, please refresh" },
        { status: 409 },
      );
    }

    doc.news = ids.map((id: string) => byId.get(String(id))!.toObject());
    await doc.save();

    revalidateTag("News", "default");

    return NextResponse.json(
      { data: doc.news, message: "News order updated" },
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
