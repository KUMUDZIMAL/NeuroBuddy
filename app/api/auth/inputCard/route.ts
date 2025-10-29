import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/models/User";
import Analysis2 from "@/models/Analysis2";
import Analysis from "@/models/Analysis";

interface AnalysisData {
  mood?: string;
  emotion?: string;
  sleep?: number;
  betterMe?: string;
  quickNote?: string;
  water?: number;
  calories?: number;
  Kcalories?: number;
  age?: number;
  gender?:string;
  createdAt?: string; // Ensure consistent structure
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch data concurrently for both collections
    const [user, analyses, analysis2] = await Promise.all([
      User.findById(decoded.id),
      Analysis.find({ userId: decoded.id }), // Fetch all Analysis entries for the user
      Analysis2.find({ userId: decoded.id }), // Fetch all Analysis2 entries for the user
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure the analysis data is aligned and returns consistent structure
    const analysisData = analyses.map((analysis, index) => {
      const fallbackAnalysis2 = {
        emotion: null,
        sleep: null,
        betterMe: null,
        quickNote: null,
        water: null,
        calories: null,
        Kcalories: null,
        createdAt: null, // Fallback for createdAt
      };

      const analysis2Entry = analysis2[index] || fallbackAnalysis2;

      // Log entries with missing createdAt for debugging
      if (!analysis2Entry.createdAt) {
        console.warn(`Missing createdAt for entry at index ${index}`, analysis2Entry);
      }

      return {
        mood: analysis.mood || null,
        emotion: analysis2Entry.emotion,
        sleep: analysis2Entry.sleep,
        betterMe: analysis2Entry.betterMe,
        quickNote: analysis2Entry.quickNote,
        water: analysis2Entry.water,
        calories: analysis2Entry.calories / 1000,
        Kcalories: analysis2Entry.Kcalories,
        age: user.age,  // Fetch age from the User collection
        gender: user.gender,  // Fetch gender from the User collection
        createdAt: analysis2Entry.createdAt
          ? new Date(analysis2Entry.createdAt).toISOString()
          : null, // Handle undefined createdAt safely
      };
    });

    console.log("Analysis Data to be sent:", analysisData);

    return NextResponse.json({
      username: user.username,
      analysis: analysisData,
    });
  } catch (error) {
    console.error("Error during token validation or data retrieval:", error);
    return NextResponse.json({ error: "Invalid token or server error" }, { status: 401 });
  }
}
