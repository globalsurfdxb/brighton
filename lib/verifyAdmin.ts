import { NextRequest } from "next/server";
import * as jose from "jose";
import { jwtSecret } from "@/lib/jwtSecret";

export async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get("adminToken")?.value || "";

  if (!token) {
    return false;
  }

  try {
    await jose.jwtVerify(token, jwtSecret());
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
