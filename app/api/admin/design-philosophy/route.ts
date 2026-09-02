import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DesignPhilosophy from "@/app/models/DesignPhilosophy";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await connectDB();

    const doc = await DesignPhilosophy.findOne({});

    if (!doc) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: doc, message: "Design philosophy page fetched successfully" },
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

    const updated = await DesignPhilosophy.findOneAndUpdate({}, body, {
      upsert: true,
      new: true,
    });

    revalidateTag("DesignPhilosophy", "default");

    return NextResponse.json(
      { data: updated, message: "Design philosophy page updated successfully" },
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
