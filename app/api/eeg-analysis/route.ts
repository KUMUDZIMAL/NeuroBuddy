import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
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
  const analyses = await EEGAnalysis.find({ userId }).sort({ createdAt: -1 }).limit(10);

  const formatted = analyses.map((a) => ({
    _id: a._id,
    focus: a.focus,
    stress: a.stress,
    relax: a.relax,
    disorder: a.disorder,
    confidence: a.confidence,
    probabilities: a.probabilities ? Object.fromEntries(a.probabilities) : {},
    timestamp: a.createdAt,
  }));

  return NextResponse.json({ analyses: formatted });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const { focus, stress, relax, disorder, confidence, probabilities } = await req.json();

  if (focus == null || stress == null || relax == null || !disorder) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const analysis = await EEGAnalysis.create({
    userId,
    focus,
    stress,
    relax,
    disorder,
    confidence: confidence || 0,
    probabilities: probabilities || {},
  });

  return NextResponse.json({
    analysis: {
      _id: analysis._id,
      focus: analysis.focus,
      stress: analysis.stress,
      relax: analysis.relax,
      disorder: analysis.disorder,
      confidence: analysis.confidence,
      probabilities: analysis.probabilities ? Object.fromEntries(analysis.probabilities) : {},
      timestamp: analysis.createdAt,
    },
  }, { status: 201 });
}
