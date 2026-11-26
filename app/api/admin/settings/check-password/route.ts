import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/verifyAdmin";
import connectDB from "@/lib/mongodb";
import Admin from "@/app/models/Admin";
import bcrypt from "bcryptjs";

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 },
      );
    }
    const { currentPassword, newPassword } = await request.json();
    if (typeof currentPassword !== "string" || !currentPassword) {
      return NextResponse.json(
        { message: "Current password is required", success: false },
        { status: 400 },
      );
    }
    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { message: "New password must be at least 8 characters", success: false },
        { status: 400 },
      );
    }
    const user = await Admin.findOne({});
    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect", success: false },
        { status: 400 },
      );
    }
    if (await bcrypt.compare(newPassword, user.password)) {
      return NextResponse.json(
        {
          message: "New password must be different from the current one",
          success: false,
        },
        { status: 400 },
      );
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return NextResponse.json(
      { message: "Password changed successfully", success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error changing password", error);
    return NextResponse.json(
      { message: "Error changing password", success: false },
      { status: 500 },
    );
  }
}
