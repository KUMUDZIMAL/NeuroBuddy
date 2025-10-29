"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Timer } from "lucide-react";

export default function AssessmentChoice() {
  const router = useRouter();

  const handleChoice = (type: "quick" | "detailed") => {
    if (type === "quick") router.push("/assessment");
    else router.push("/disorder");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <Card className="w-full max-w-xl shadow-lg border-none rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-indigo-700">
            🧠 Choose Your Assessment Type
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Select how deep you want to explore your mental state today.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6 mt-4">
          {/* Quick Assessment */}
          <div className="flex flex-col items-center bg-white shadow-sm rounded-xl p-6 w-full md:w-1/2 border hover:shadow-md transition">
            <Timer className="w-10 h-10 text-indigo-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Quick Assessment</h3>
            <p className="text-gray-600 text-sm text-center mb-4">
              Takes less than 5 minutes - just a short check to get an overview.
            </p>
            <Button
              onClick={() => handleChoice("quick")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
            >
              Start Quick Test
            </Button>
          </div>

          {/* Detailed Assessment */}
          <div className="flex flex-col items-center bg-white shadow-sm rounded-xl p-6 w-full md:w-1/2 border hover:shadow-md transition">
            <Brain className="w-10 h-10 text-indigo-600 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Detailed Assessment</h3>
            <p className="text-gray-600 text-sm text-center mb-4">
              A complete evaluation that analyzes your behavior patterns in depth.
            </p>
            <Button
              onClick={() => handleChoice("detailed")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
            >
              Start Detailed Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
