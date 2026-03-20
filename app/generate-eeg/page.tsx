"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/AppLayout";
import {
  Download,
  BrainCircuit,
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  Sparkles
} from "lucide-react";

interface DiagnosisData {
  condition: string;
  confidence: number;
}

export default function GenerateEEG() {
  const [diagnoses, setDiagnoses] = useState<DiagnosisData[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<Blob | null>(null);
  const [error, setError] = useState<string>("");

  // Load diagnosis from localStorage on mount
  useEffect(() => {
    loadDiagnosisFromStorage();
  }, []);

  const loadDiagnosisFromStorage = () => {
    try {
      // Try to load from assessment (AI-driven quick test)
      const assessmentData = localStorage.getItem("assessment_diagnosis");
      if (assessmentData) {
        const parsed = JSON.parse(assessmentData);
        const disorders = Object.entries(parsed)
          .filter(([key, value]) => key !== "timestamp" && typeof value === "number")
          .map(([condition, confidence]) => ({
            condition,
            confidence: confidence as number,
          }));
        setDiagnoses(disorders);
        return;
      }

      // Try to load from detailed disorder survey (28-question)
      const disorderData = localStorage.getItem("disorder_diagnosis");
      if (disorderData) {
        const parsed = JSON.parse(disorderData);
        const disorders = Object.entries(parsed)
          .filter(([key, value]) => key !== "timestamp" && typeof value === "number")
          .map(([condition, confidence]) => ({
            condition,
            confidence: confidence as number,
          }));
        setDiagnoses(disorders);
        return;
      }

      setError("No diagnosis found. Please complete an assessment first.");
    } catch (err) {
      console.error("Error loading diagnosis:", err);
      setError("Failed to load diagnosis data. Please try taking an assessment again.");
    }
  };

  const handleGenerateEEG = async () => {
    if (diagnoses.length === 0) {
      setError("No diagnosis data available. Please complete an assessment first.");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedFile(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_eeg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ disorders: diagnoses }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate EEG data");
      }

      const blob = await response.blob();
      setGeneratedFile(blob);
    } catch (err: any) {
      console.error("Error generating EEG:", err);
      setError(err.message || "An error occurred while generating EEG data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedFile) return;

    const url = URL.createObjectURL(generatedFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = `synthetic_eeg_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Generate Synthetic EEG Data</h1>
              <p className="text-muted-foreground">
                Create personalized EEG data based on your diagnosis profile
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              1. <strong>Your Diagnosis:</strong> We use the results from your assessment
              to determine your neurological/mental health profile.
            </p>
            <p>
              2. <strong>Statistical Generation:</strong> Synthetic EEG band power data
              is generated using statistical profiles from real clinical datasets.
            </p>
            <p>
              3. <strong>Confidence-Based Variance:</strong> Higher confidence scores produce
              data closer to typical patterns; lower confidence adds more variability.
            </p>
            <p>
              4. <strong>Upload & Analyze:</strong> Download the CSV file and upload it
              to the EEG Analysis page to see how the AI predicts your condition.
            </p>
          </CardContent>
        </Card>

        {/* Diagnosis Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Diagnosis Profile</CardTitle>
            <CardDescription>
              {diagnoses.length > 0
                ? "Loaded from your latest assessment"
                : "No diagnosis data found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {diagnoses.length > 0 ? (
              <div className="space-y-3">
                {diagnoses.map((disorder, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <BrainCircuit className="h-5 w-5 text-slate-600" />
                      <span className="font-medium">{disorder.condition}</span>
                    </div>
                    <Badge
                      variant={
                        disorder.confidence >= 70 ? "default" : "secondary"
                      }
                      className="text-sm"
                    >
                      {disorder.confidence}% confidence
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">
                  No diagnosis data found. Please complete an assessment first.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/assessment")}
                  >
                    Quick Assessment (AI)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/disorder")}
                  >
                    Detailed Survey (28-Q)
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        {diagnoses.length > 0 && !generatedFile && (
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleGenerateEEG}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating EEG Data...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Synthetic EEG Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success & Download */}
        {generatedFile && (
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                EEG Data Generated Successfully!
              </CardTitle>
              <CardDescription>
                Your personalized synthetic EEG data is ready for download
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">synthetic_eeg_data.csv</p>
                  <p className="text-sm text-muted-foreground">
                    114 EEG band power features
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/eeg")}
                  className="flex-1"
                >
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Go to EEG Analysis
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setGeneratedFile(null);
                  setError("");
                }}
                className="w-full"
              >
                Generate New Data
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
