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
} from "recharts";
import {
  Activity,
  Upload,
  TrendingUp,
  TrendingDown,
  Minus,
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
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "today" | "week" | "month"
  >("week");

  // EEG session history
  const [eegSessions, setEegSessions] = useState<EEGSession[]>([
    {
      id: "1",
      date: new Date(2024, 0, 15, 9, 30),
      duration: 20,
      focusScore: 75,
      stressLevel: 40,
      calmness: 65,
      meditation: true,
    },
  ]);

  // Latest uploaded metrics (separate from averages)
  const [latestMetrics, setLatestMetrics] = useState<{
    focus: number;
    stress: number;
    relax: number;
  } | null>(null);

  // --- Average Metrics (calculated from sessions) ---
  const averageMetrics = {
    focus: Math.round(
      eegSessions.reduce((sum, s) => sum + s.focusScore, 0) / eegSessions.length
    ),
    stress: Math.round(
      eegSessions.reduce((sum, s) => sum + s.stressLevel, 0) / eegSessions.length
    ),
    calmness: Math.round(
      eegSessions.reduce((sum, s) => sum + s.calmness, 0) / eegSessions.length
    ),
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
      if (score <= 30)
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      if (score <= 60) return <Minus className="w-4 h-4 text-yellow-500" />;
      return <TrendingUp className="w-4 h-4 text-red-600" />;
    } else {
      if (score >= 70)
        return <TrendingUp className="w-4 h-4 text-green-600" />;
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
      alert("Please upload an EEG Excel file first!");
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

      if (!res.ok) throw new Error("Failed to analyze EEG data");

      const data = await res.json();
      setLatestMetrics(data); // store only for latest upload

      // add to EEG session history
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
    } catch (err) {
      console.error(err);
      alert("Error analyzing EEG file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              EEG Insights 🧠
            </h1>
            <p className="text-muted-foreground">
              Track your brain activity and focus patterns
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col items-center space-y-3">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Analyzing..." : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Upload & Analyze
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Average Metrics Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Average Brain Metrics</CardTitle>
            <CardDescription>Calculated from all recorded sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Focus */}
              <MetricCard
                title="Average Focus"
                value={averageMetrics.focus}
                reverse={false}
                subtitle={`${eegSessions.length} sessions`}
                getScoreColor={getScoreColor}
                getScoreIcon={getScoreIcon}
              />
              {/* Stress */}
              <MetricCard
                title="Average Stress"
                value={averageMetrics.stress}
                reverse={true}
                subtitle="Lower is better"
                getScoreColor={getScoreColor}
                getScoreIcon={getScoreIcon}
              />
              {/* Calmness */}
              <MetricCard
                title="Average Calmness"
                value={averageMetrics.calmness}
                reverse={false}
                subtitle="Relaxation state"
                getScoreColor={getScoreColor}
                getScoreIcon={getScoreIcon}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart for Average Metrics */}
     {/* Bar Chart + Frequency Visualization Side by Side */}
<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* 📊 Average Bar Chart */}
  <div>
    <h3 className="text-lg font-semibold text-center mb-4">
      Average EEG Mental State Metrics (%)
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={[
          { name: "Focus", value: averageMetrics.focus },
          { name: "Stress", value: averageMetrics.stress },
          { name: "Calm", value: averageMetrics.calmness },
        ]}
      >
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* 🧠 Brain Wave Frequency Visualization */}
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Activity className="w-5 h-5 mr-2 text-primary" />
        Brain Wave Patterns
      </CardTitle>
      <CardDescription>
        Simulated EEG wave visualization (Alpha, Beta, Theta)
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Alpha Waves */}
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-foreground">
              Alpha Waves (8–12 Hz)
            </h4>
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-500 border-blue-500/20"
            >
              Relaxed
            </Badge>
          </div>
          <div className="h-8 bg-blue-500/20 rounded relative overflow-hidden">
            <div className="h-full w-full eeg-wave bg-blue-500/40"></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Associated with relaxed awareness and creativity
          </p>
        </div>

        {/* Beta Waves */}
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-foreground">
              Beta Waves (13–30 Hz)
            </h4>
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-500 border-green-500/20"
            >
              Focused
            </Badge>
          </div>
          <div className="h-8 bg-green-500/20 rounded relative overflow-hidden">
            <div
              className="h-full w-full eeg-wave bg-green-500/40"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Active concentration and problem-solving
          </p>
        </div>

        {/* Theta Waves */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-foreground">
              Theta Waves (4–7 Hz)
            </h4>
            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-500 border-purple-500/20"
            >
              Meditative
            </Badge>
          </div>
          <div className="h-8 bg-purple-500/20 rounded relative overflow-hidden">
            <div
              className="h-full w-full eeg-wave bg-purple-500/40"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Deep meditation and intuitive insights
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</div>


        {/* Latest Recording Section */}
        {latestMetrics && (
          <Card className="mt-8 border border-blue-300/40">
            <CardHeader>
              <CardTitle>Latest Recording</CardTitle>
              <CardDescription>
                Metrics from the most recent EEG file upload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard
                  title="Focus"
                  value={latestMetrics.focus}
                  reverse={false}
                  subtitle="Latest session"
                  getScoreColor={getScoreColor}
                  getScoreIcon={getScoreIcon}
                />
                <MetricCard
                  title="Stress"
                  value={latestMetrics.stress}
                  reverse={true}
                  subtitle="Latest session"
                  getScoreColor={getScoreColor}
                  getScoreIcon={getScoreIcon}
                />
                <MetricCard
                  title="Calmness"
                  value={latestMetrics.relax}
                  reverse={false}
                  subtitle="Latest session"
                  getScoreColor={getScoreColor}
                  getScoreIcon={getScoreIcon}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Session Metrics Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Daily EEG Session Metrics</CardTitle>
            <CardDescription>
              Focus, Stress, and Calmness trends by session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="p-3 text-center text-sm font-semibold text-gray-700">
                      Focus (%)
                    </th>
                    <th className="p-3 text-center text-sm font-semibold text-gray-700">
                      Stress (%)
                    </th>
                    <th className="p-3 text-center text-sm font-semibold text-gray-700">
                      Calmness (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eegSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="border-t text-sm text-gray-700 hover:bg-gray-50"
                    >
               <td className="p-3">
  {new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(session.date)}{" "}
  {session.date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</td>

                      <td className="p-3 text-center">{session.focusScore}</td>
                      <td className="p-3 text-center">{session.stressLevel}</td>
                      <td className="p-3 text-center">{session.calmness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

/* Helper Component */
function MetricCard({
  title,
  value,
  reverse,
  subtitle,
  getScoreColor,
  getScoreIcon,
}: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${getScoreColor(value, reverse)}`}>
              {value}%
            </p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          {getScoreIcon(value, reverse)}
        </div>
        <Progress value={value} className="mt-3" />
      </CardContent>
    </Card>
  );
}
