import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  try {
    // Clear the session or authentication token (cookie)
    const cookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      sameSite: "strict", // Protect against CSRF
      expires: new Date(0), // Expire immediately
      path: "/", // Cookie applies to the entire site
    });

    // Add the cookie to the response headers
    const response = NextResponse.json({ message: "Logged out successfully" });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const methods = ["POST"];
