"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/layout/AppLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import {
  Activity,
  Upload,
  TrendingUp,
  TrendingDown,
  Minus,
  BrainCircuit,
  AlertCircle
} from "lucide-react";

interface EEGSession {
  id: string;
  date: Date;
  duration: number;
  focusScore: number;
  stressLevel: number;
  calmness: number;
  meditation: boolean;
}

export default function EEG() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [eegSessions, setEegSessions] = useState<EEGSession[]>([]);

  const [latestMetrics, setLatestMetrics] = useState<{
    focus: number;
    stress: number;
    relax: number;
    prediction: string;
    confidence: number;
    probabilities: Record<string, number>;
  } | null>(null);

  const averageMetrics = {
    focus: eegSessions.length ? Math.round(eegSessions.reduce((sum, s) => sum + s.focusScore, 0) / eegSessions.length) : 0,
    stress: eegSessions.length ? Math.round(eegSessions.reduce((sum, s) => sum + s.stressLevel, 0) / eegSessions.length) : 0,
    calmness: eegSessions.length ? Math.round(eegSessions.reduce((sum, s) => sum + s.calmness, 0) / eegSessions.length) : 0,
  };

  const getScoreColor = (score: number, reverse = false) => {
    if (reverse) {
      if (score <= 30) return "text-green-600";
      if (score <= 60) return "text-yellow-500";
      return "text-red-600";
    } else {
      if (score >= 70) return "text-green-600";
      if (score >= 40) return "text-yellow-500";
      return "text-red-600";
    }
  };

  const getScoreIcon = (score: number, reverse = false) => {
    if (reverse) {
      if (score <= 30) return <TrendingDown className="w-4 h-4 text-green-600" />;
      if (score <= 60) return <Minus className="w-4 h-4 text-yellow-500" />;
      return <TrendingUp className="w-4 h-4 text-red-600" />;
    } else {
      if (score >= 70) return <TrendingUp className="w-4 h-4 text-green-600" />;
      if (score >= 40) return <Minus className="w-4 h-4 text-yellow-500" />;
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload an EEG file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze_eeg", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze EEG");
      }

      const data = await res.json();

      setLatestMetrics({
        focus: data.focus,
        stress: data.stress,
        relax: data.relax,
        prediction: data.predicted_disorder,
        confidence: data.confidence,
        probabilities: data.probabilities
      });

      const newSession: EEGSession = {
        id: Date.now().toString(),
        date: new Date(),
        duration: 20,
        focusScore: data.focus,
        stressLevel: data.stress,
        calmness: data.relax,
        meditation: data.relax > 60,
      };

      setEegSessions((prev) => [newSession, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">EEG Insights 🧠</h1>
            <p className="text-muted-foreground">Track brain activity and cognitive patterns</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileChange}
              className="text-sm border rounded-lg p-2 bg-background w-full max-w-xs"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
              {loading ? "Analyzing..." : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Analyze Recording
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ML Prediction Result (Shown only after analysis) */}
        {latestMetrics && (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-full text-white">
                    <BrainCircuit className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium uppercase tracking-wider">AI Diagnosis Result</p>
                    <h2 className="text-2xl font-bold text-slate-900">{latestMetrics.prediction}</h2>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <Badge variant="secondary" className="text-lg px-3 py-1 bg-white border">
                    {latestMetrics.confidence}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Real-time Cognitive Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Focus Level"
            value={latestMetrics ? latestMetrics.focus : averageMetrics.focus}
            reverse={false}
            subtitle={latestMetrics ? "Current Session" : "Global Average"}
            getScoreColor={getScoreColor}
            getScoreIcon={getScoreIcon}
          />
          <MetricCard
            title="Stress Indicator"
            value={latestMetrics ? latestMetrics.stress : averageMetrics.stress}
            reverse={true}
            subtitle={latestMetrics ? "Current Session" : "Global Average"}
            getScoreColor={getScoreColor}
            getScoreIcon={getScoreIcon}
          />
          <MetricCard
            title="Calmness / Relax"
            value={latestMetrics ? latestMetrics.relax : averageMetrics.calmness}
            reverse={false}
            subtitle={latestMetrics ? "Current Session" : "Global Average"}
            getScoreColor={getScoreColor}
            getScoreIcon={getScoreIcon}
          />
        </div>

        {/* Detailed Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Probability Chart */}
          {latestMetrics?.probabilities && (
            <Card>
              <CardHeader>
                <CardTitle>Probability Breakdown</CardTitle>
                <CardDescription>ML classification distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={Object.entries(latestMetrics.probabilities).map(([name, value]) => ({ name, value }))}
                      margin={{ left: 40, right: 40 }}
                    >
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {Object.entries(latestMetrics.probabilities).map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry[0] === latestMetrics.prediction ? "#2563eb" : "#cbd5e1"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historical Trends or Average Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Metric Comparison</CardTitle>
              <CardDescription>Average performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Focus", value: averageMetrics.focus },
                      { name: "Stress", value: averageMetrics.stress },
                      { name: "Relax", value: averageMetrics.calmness },
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function MetricCard({ title, value, reverse, subtitle, getScoreColor, getScoreIcon }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className={`text-3xl font-bold ${getScoreColor(value, reverse)}`}>
              {value}%
            </p>
            <p className="text-xs text-muted-foreground mt-1 uppercase font-semibold tracking-tighter">
              {subtitle}
            </p>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">
            {getScoreIcon(value, reverse)}
          </div>
        </div>
        <Progress value={value} className="mt-4 h-2" />
      </CardContent>
    </Card>
  );
}