import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import Analysis from "@/models/Analysis";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { mood } = await req.json();

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    const analysisData = {
      userId: user._id,
      mood,
    };

    const analysis = new Analysis(analysisData);
    await analysis.save();

    return NextResponse.json({ username: user.username, analysis });
  } catch (error) {
    // Log the error for debugging
    console.error("Error in mood analysis:", error);
    
    // Check if it's a JWT error
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Catch any other errors
    return NextResponse.json({ error: "Server error or invalid data" }, { status: 500 });
  }
}
