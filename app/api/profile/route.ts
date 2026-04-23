import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Habit from "@/models/Habit";
import CBTExercise from "@/models/CBTExercise";
import EEGAnalysis from "@/models/EEGAnalysis";
import jwt, { JwtPayload } from "jsonwebtoken";

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    return decoded?.id || null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const user = await User.findById(userId).select("-password");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const totalHabits = await Habit.countDocuments({ userId });
  const habits = await Habit.find({ userId });
  const currentStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;
  const cbtSessions = await CBTExercise.aggregate([
    { $match: { userId: user._id } },
    { $group: { _id: null, total: { $sum: "$totalCompletions" } } },
  ]);
  const eegCount = await EEGAnalysis.countDocuments({ userId });

  const stats = {
    totalHabits,
    currentStreak,
    cbtSessions: cbtSessions[0]?.total || 0,
    eegSessions: eegCount,
    joinedDaysAgo: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
  };

  return NextResponse.json({
    profile: {
      name: user.username,
      email: user.email,
      phone: user.phone || "",
      birthday: user.birthday || "",
      bio: user.bio || "",
      goals: user.goals || "",
      age: user.age,
      gender: user.gender,
      joinDate: user.createdAt,
      notifications: user.notifications || {
        dailyReminders: true,
        habitAlerts: true,
        moodCheckins: false,
        weeklyReports: true,
      },
    },
    stats,
  });
}

export async function PUT(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  const updates = await req.json();
  const allowedFields = ["bio", "phone", "birthday", "goals", "notifications"];
  const updateData: Record<string, any> = {};

  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      updateData[key] = updates[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select("-password");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    profile: {
      name: user.username,
      email: user.email,
      phone: user.phone || "",
      birthday: user.birthday || "",
      bio: user.bio || "",
      goals: user.goals || "",
      age: user.age,
      gender: user.gender,
      joinDate: user.createdAt,
      notifications: user.notifications || {
        dailyReminders: true,
        habitAlerts: true,
        moodCheckins: false,
        weeklyReports: true,
      },
    },
  });
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  await Habit.deleteMany({ userId });
  await CBTExercise.deleteMany({ userId });
  await EEGAnalysis.deleteMany({ userId });
  await User.findByIdAndDelete(userId);

  const response = NextResponse.json({ message: "Account deleted successfully" });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
