import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import Analysis from "../../../../models/Analysis";
import Analysis2 from "../../../../models/Analysis2";
import User from "../../../../models/User";

export async function GET(req: NextRequest) {
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

    const userId = new Types.ObjectId(user._id);

    const analysis = await Analysis.aggregate([
      { $match: { userId } },
      {
        $project: {
          mood: 1,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      {
        $group: {
          _id: { date: "$date", mood: "$mood" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    if (analysis.length === 0) {
      return NextResponse.json(
        { message: "No mood data found for this user", analysis: [] },
        { status: 200 }
      );
    }

    const formattedAnalysis = analysis.map((entry) => ({
      date: entry._id.date,
      mood: entry._id.mood,
      count: entry.count,
    }));

    return NextResponse.json({ analysis: formattedAnalysis });
  } catch (error) {
    console.error("Error fetching mood data:", error);
    return NextResponse.json(
      { error: "Failed to fetch mood data" },
      { status: 500 }
    );
  }
}

