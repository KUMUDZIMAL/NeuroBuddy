import { dbConnect } from '../../../lib/mongodb'; // Your database connection utility
import Analysis2 from '@/models/Analysis2'; // Mongoose model for saving data
import { NextResponse, NextRequest } from 'next/server';
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    // Use NextRequest to access cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.error("No token found in cookies");
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!decoded || !decoded.id) {
      console.error("Decoded token does not contain user ID");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      console.error("User  not found for ID:", decoded.id);
      return NextResponse.json({ error: "User  not found" }, { status: 404 });
    }

    // Parse the incoming request body
    const { emotion, sleep, betterMe, quickNote, water, calories } = await req.json();

    // Connect to the database
    await dbConnect();

    // Create a new analysis entry
    const analysisEntry = new Analysis2({
      userId: user._id, // Make sure to pass the userId from the frontend
      username:user.username,
      emotion: emotion.split(',').map((e: string) => e.trim()), // Convert to array
      sleep,
      betterMe: betterMe.split(',').map((b: string) => b.trim()), // Convert to array
      quickNote,
      water,
      calories,
    });

    // Save to the database
    await analysisEntry.save();

    return NextResponse.json({ message: 'Data saved successfully!' }, { status: 201 });
  } catch (error) {
    // Type assertion for error
    if (error instanceof Error) {
      console.error("Error in POST /api/analysis2:", error);
      return NextResponse.json({ error: 'Error saving data', details: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
  }
}