import Groq from "groq-sdk";
import { Pinecone } from '@pinecone-database/pinecone';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index('neurobuddy-docs');

export async function POST(req: Request) {
  try {
    const { message, history, neuroHistory } = await req.json();

    const current = neuroHistory && neuroHistory.length > 0 ? neuroHistory[0] : null;
    const detectedDisorder = current?.disorder?.toLowerCase() || "general";

    // 1. Get Embedding from Flask
    const embRes = await fetch("http://127.0.0.1:5000/get_embedding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
    const { vector } = await embRes.json();

    // 2. Query Pinecone using Specific Namespace
    const queryResponse = await index.namespace(detectedDisorder).query({
      vector: vector,
      topK: 2,
      includeMetadata: true,
    });

    const medicalContext = queryResponse.matches
      .map((m) => m.metadata?.text)
      .join("\n\n");

    // 3. Construct Augmented Prompt
    const systemPrompt = `
      You are NeuroBuddy, a brain-aware AI assistant. 
      USER CURRENT STATE: Focus ${current?.focus}%, Stress ${current?.stress}%, Disorder: ${current?.disorder}.

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