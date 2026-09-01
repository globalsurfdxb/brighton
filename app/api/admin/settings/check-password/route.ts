import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import connectDB from "@/lib/mongodb";
import Admin from "@/app/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }
    const { currentPassword } = await request.json();
    const user = await Admin.findOne({});
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password", success: false },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { message: "Enter your new password now", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error checking password", error);
    return NextResponse.json(
      { message: "Error checking password", success: false },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    console.log("first");
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }
    const { newPassword } = await request.json();
    const user = await Admin.findOne({});
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return NextResponse.json(
      { message: "Password changed successfully", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error changing password", error);
    return NextResponse.json(
      { message: "Error changing password", success: false },
      { status: 500 },
    );
  }
}
