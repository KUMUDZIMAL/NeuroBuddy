import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Habit from "@/models/Habit";
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
  const habits = await Habit.find({ userId }).sort({ createdAt: -1 });

  const today = new Date().toISOString().split("T")[0];
  const habitsWithStatus = habits.map((h) => {
    const lastDate = h.lastCompletedDate ? new Date(h.lastCompletedDate).toISOString().split("T")[0] : null;
    const completedToday = lastDate === today;
    return { ...h.toObject(), completedToday };
  });

  return NextResponse.json({ habits: habitsWithStatus });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { name, description, frequency, targetPerWeek } = await req.json();

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const habit = await Habit.create({
    userId,
    name,
    description: description || "",
    frequency: frequency || "daily",
    streak: 0,
    completedThisWeek: 0,
    targetPerWeek: frequency === "weekly" ? targetPerWeek : undefined,
  });

  return NextResponse.json({ habit: { ...habit.toObject(), completedToday: false } }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { id, action } = await req.json();

  if (!id) return NextResponse.json({ error: "Habit ID required" }, { status: 400 });

  const habit = await Habit.findOne({ _id: id, userId });
  if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

  if (action === "toggle") {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const lastDateStr = habit.lastCompletedDate ? new Date(habit.lastCompletedDate).toISOString().split("T")[0] : null;
    const wasCompletedToday = lastDateStr === todayStr;

    if (wasCompletedToday) {
      habit.lastCompletedDate = undefined as any;
      habit.streak = Math.max(0, habit.streak - 1);
      habit.completedThisWeek = Math.max(0, habit.completedThisWeek - 1);
    } else {
      habit.lastCompletedDate = today;
      habit.streak += 1;
      habit.completedThisWeek += 1;
    }
    await habit.save();

    const newLastDateStr = habit.lastCompletedDate ? new Date(habit.lastCompletedDate).toISOString().split("T")[0] : null;
    return NextResponse.json({ habit: { ...habit.toObject(), completedToday: newLastDateStr === todayStr } });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Habit ID required" }, { status: 400 });

  const habit = await Habit.findOneAndDelete({ _id: id, userId });
  if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 });

  return NextResponse.json({ message: "Habit deleted" });
}
