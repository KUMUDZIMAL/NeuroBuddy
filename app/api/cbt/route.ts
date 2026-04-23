import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import CBTExercise from "@/models/CBTExercise";
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

const DEFAULT_EXERCISES = [
  { title: "4-7-8 Breathing", description: "Calming breath technique: inhale for 4, hold for 7, exhale for 8", category: "breathing", duration: 5, difficulty: "beginner" },
  { title: "5-4-3-2-1 Grounding", description: "Notice 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste", category: "grounding", duration: 3, difficulty: "beginner" },
  { title: "Thought Challenging", description: "Identify negative thoughts and challenge them with evidence", category: "reframing", duration: 10, difficulty: "intermediate" },
  { title: "Body Scan Meditation", description: "Progressive relaxation by focusing on different body parts", category: "mindfulness", duration: 15, difficulty: "intermediate" },
  { title: "STOP Technique", description: "Stop, Take a breath, Observe, Proceed mindfully", category: "mindfulness", duration: 2, difficulty: "beginner" },
];

export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  let exercises = await CBTExercise.find({ userId }).sort({ createdAt: 1 });

  if (exercises.length === 0) {
    const newExercises = DEFAULT_EXERCISES.map((e) => ({
      userId,
      ...e,
      totalCompletions: 0,
    }));
    exercises = await CBTExercise.insertMany(newExercises);
  }

  const today = new Date().toISOString().split("T")[0];
  const exercisesWithStatus = exercises.map((e) => {
    const lastDate = e.lastCompletedDate ? new Date(e.lastCompletedDate).toISOString().split("T")[0] : null;
    const completedToday = lastDate === today;
    return { ...e.toObject(), completedToday };
  });

  return NextResponse.json({ exercises: exercisesWithStatus });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { title, description, category, duration, difficulty } = await req.json();

  if (!title || !category) return NextResponse.json({ error: "Title and category required" }, { status: 400 });

  const exercise = await CBTExercise.create({
    userId,
    title,
    description: description || "",
    category,
    duration: duration || 5,
    difficulty: difficulty || "beginner",
    totalCompletions: 0,
  });

  return NextResponse.json({ exercise: { ...exercise.toObject(), completedToday: false } }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { id, action } = await req.json();

  if (!id) return NextResponse.json({ error: "Exercise ID required" }, { status: 400 });

  const exercise = await CBTExercise.findOne({ _id: id, userId });
  if (!exercise) return NextResponse.json({ error: "Exercise not found" }, { status: 404 });

  if (action === "complete") {
    exercise.lastCompletedDate = new Date();
    exercise.totalCompletions += 1;
    await exercise.save();
    return NextResponse.json({ exercise: { ...exercise.toObject(), completedToday: true } });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Exercise ID required" }, { status: 400 });

  const exercise = await CBTExercise.findOneAndDelete({ _id: id, userId });
  if (!exercise) return NextResponse.json({ error: "Exercise not found" }, { status: 404 });

  return NextResponse.json({ message: "Exercise deleted" });
}
