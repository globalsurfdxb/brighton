import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Service from "@/app/models/Services";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await connectDB();

    const services = await Service.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { data: services, message: "Services fetched successfully" },
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

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { message: "Name and slug are required" },
        { status: 400 },
      );
    }

    const existing = await Service.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { message: "A service with this slug already exists" },
        { status: 409 },
      );
    }

    const created = await Service.create(body);

    revalidateTag("Services", "default");

    return NextResponse.json(
      { data: created, message: "Service created successfully" },
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
