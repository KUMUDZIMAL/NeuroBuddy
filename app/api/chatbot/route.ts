import Groq from "groq-sdk";
import { Pinecone } from '@pinecone-database/pinecone';
import { NextResponse, NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import EEGAnalysis from '@/models/EEGAnalysis';
import jwt, { JwtPayload } from 'jsonwebtoken';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index('neurobuddy-docs');

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

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    let current: any = null;
    const userId = await getUserId(req as any);

    if (userId) {
      await dbConnect();
      const latestAnalysis = await EEGAnalysis.findOne({ userId }).sort({ createdAt: -1 });
      if (latestAnalysis) {
        current = {
          focus: latestAnalysis.focus,
          stress: latestAnalysis.stress,
          relax: latestAnalysis.relax,
          disorder: latestAnalysis.disorder,
          confidence: latestAnalysis.confidence,
        };
      }
    }

    const detectedDisorder = current?.disorder?.toLowerCase() || "general";

    let embRes;
    try {
      embRes = await fetch("http://127.0.0.1:5000/get_embedding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });
    } catch {
      console.error("Flask embedding server not available");
    }

    let medicalContext = "";
    if (embRes?.ok) {
      const { vector } = await embRes.json();
      const queryResponse = await index.namespace(detectedDisorder).query({
        vector: vector,
        topK: 2,
        includeMetadata: true,
      });
      medicalContext = queryResponse.matches
        .map((m) => m.metadata?.text)
        .join("\n\n");
    }

    const systemPrompt = `
      You are NeuroBuddy, a brain-aware AI assistant.
      USER CURRENT STATE: ${current ? `Focus ${current.focus}%, Stress ${current.stress}%, Relax ${current.relax}%, Disorder: ${current.disorder} (Confidence: ${current.confidence}%)` : "No EEG data available yet."}

      VERIFIED MEDICAL CONTEXT FROM OUR DATABASE (Namespace: ${detectedDisorder}):
      ${medicalContext || "No specific guide found in database for this disorder yet."}

      INSTRUCTIONS:
      - Use the MEDICAL CONTEXT to suggest specific coping techniques.
      - If the user's focus is low, prioritize focus-boosting advice from the context.
      - Be concise, supportive, and mention: "Based on our medical guides..."
    `;

    const stream = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...history.slice(-4).map((m: any) => ({ role: m.role, content: m.content })),
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      }
    });

    return new Response(readable, { headers: { 'Content-Type': 'text/event-stream' } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "RAG Error" }, { status: 500 });
  }
}
