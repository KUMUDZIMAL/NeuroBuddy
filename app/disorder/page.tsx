"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2, Brain, Smile } from "lucide-react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

export default function DisorderDetection() {
  const router = useRouter();
  const [age, setAge] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // ✨ 28 Questions
  const questions = [
    "Do you often feel nervous or anxious?",
    "Do you experience panic attacks or sudden fear?",
    "Do you breathe rapidly during stressful moments?",
    "Do you sweat excessively even when not physically active?",
    "Do you have trouble concentrating on tasks?",
    "Do you face trouble sleeping?",
    "Do you feel hopeless or helpless often?",
    "Do you get angry or irritated easily?",
    "Have you noticed major changes in your eating habits?",
    "Do you sometimes have suicidal thoughts?",
    "Do you feel tired even after resting well?",
    "Do you avoid people or activities you once enjoyed?",
    "Do you feel negative or guilty without reason?",
    "Do you experience hallucinations or see things not there?",
    "Do you worry excessively about everyday matters?",
    "Do you find it hard to relax even in calm situations?",
    "Do you fear losing control or going crazy?",
    "Do you withdraw from social activities or gatherings?",
    "Do you get irritated by small things frequently?",
    "Do you often feel emotionally empty or numb?",
    "Do you lack motivation to start or finish tasks?",
    "Do you experience racing or uncontrollable thoughts?",
    "Do you often feel worthless or not good enough?",
    "Do you feel disconnected from reality or people?",
    "Do you have trouble making even simple decisions?",
    "Do you feel restless most of the time?",
    "Do you have difficulty remembering recent things?",
    "Do you feel tired almost all the time?",
  ];

  const handleToggle = (index: number, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    const payload = {
      age,
      ...questions.reduce((acc, _, i) => {
        acc[`q${i + 1}`] = answers[i] ? "yes" : "no";
        return acc;
      }, {} as Record<string, string>),
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data.result || "⚠️ No result from server");
    } catch (error) {
      console.error("Error:", error);
      setResult("⚠️ Backend connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-xl border-none rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            🧠 Mental Disorder Detection Survey
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-4">
            <label className="text-lg font-medium">Age:</label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder="Enter your age"
              className="w-24"
            />
          </div>

          <div className="grid gap-4">
            {questions.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
              >
                <span className="text-sm font-medium text-gray-700 w-4/5">{q}</span>
                <Switch
                  checked={answers[i] || false}
                  onCheckedChange={(v) => handleToggle(i, v)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Analyzing...
                </>
              ) : (
                "Analyze My Responses"
              )}
            </Button>
          </div>

          {result && (
            <div>
            <div
              className={`mt-8 text-center text-lg font-semibold p-4 rounded-xl ${
                result.includes("🧠")
                  ? "bg-red-100 text-red-700 border border-red-300 font-bold"
                  : "bg-green-100 text-green-700 border border-green-300 font-bold"
              }`}
            >
              {result.includes("🧠") ? (
                <Brain className="inline mr-2" />
              ) : (
                <Smile className="inline mr-2" />
              )}
              {result}
            </div>
           {/* 💬 AI Therapist Assistant Section */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-indigo-100 mt-4">
                <h2 className="text-xl font-semibold text-indigo-700 mb-3">
                  Ask AI Therapist Assistant to know more about it
                </h2>
            
                <Button
                  onClick={() => router.push("/chatbot")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat Now
                </Button>
              </div>
            </div>
          )}
          

          <div className="flex justify-center mt-6">
            <Button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
