"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/layout/AppLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Upload, BrainCircuit, History as HistoryIcon, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface EEGSession {
  _id: string;
  date: string;
  focusScore: number;
  stressLevel: number;
  calmness: number;
  disorder: string;
}

export default function EEG() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [eegSessions, setEegSessions] = useState<EEGSession[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [latestMetrics, setLatestMetrics] = useState<{
    focus: number;
    stress: number;
    relax: number;
    prediction: string;
    confidence: number;
    probabilities: Record<string, number>;
  } | null>(null);

  const fetchAnalyses = useCallback(async () => {
    try {
      const res = await fetch("/api/eeg-analysis", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.analyses.map((a: any) => ({
          _id: a._id,
          date: new Date(a.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }),
          focusScore: a.focus,
          stressLevel: a.stress,
          calmness: a.relax,
          disorder: a.disorder,
        }));
        setEegSessions(mapped);

        if (data.analyses.length > 0) {
          const latest = data.analyses[0];
          setLatestMetrics({ focus: latest.focus, stress: latest.stress, relax: latest.relax, prediction: latest.disorder, confidence: latest.confidence, probabilities: latest.probabilities || {} });
        }
      }
    } catch (err) { console.error("Failed to fetch EEG analyses:", err); }
    finally { setDataLoading(false); }
  }, []);

  useEffect(() => { fetchAnalyses(); }, [fetchAnalyses]);

  const averageMetrics = {
    focus: eegSessions.length ? Math.round(eegSessions.reduce((sum, s) => sum + s.focusScore, 0) / eegSessions.length) : 0,
    stress: eegSessions.length ? Math.round(eegSessions.reduce((sum, s) => sum + s.stressLevel, 0) / eegSessions.length) : 0,
    calmness: eegSessions.length ? Math.round(eegSessions.reduce((sum, s) => sum + s.calmness, 0) / eegSessions.length) : 0,
  };

  const getScoreColor = (score: number, reverse = false) => {
    if (reverse) { if (score <= 30) return "text-green-600"; if (score <= 60) return "text-yellow-500"; return "text-red-600"; }
    else { if (score >= 70) return "text-green-600"; if (score >= 40) return "text-yellow-500"; return "text-red-600"; }
  };

  const getScoreIcon = (score: number, reverse = false) => {
    if (reverse) { if (score <= 30) return <TrendingDown className="w-4 h-4 text-green-600" />; if (score <= 60) return <Minus className="w-4 h-4 text-yellow-500" />; return <TrendingUp className="w-4 h-4 text-red-600" />; }
    else { if (score >= 70) return <TrendingUp className="w-4 h-4 text-green-600" />; if (score >= 40) return <Minus className="w-4 h-4 text-yellow-500" />; return <TrendingDown className="w-4 h-4 text-red-600" />; }
  };

  const disorderAbbrMap: Record<string, string> = {
    "Acute stress disorder": "AcSD",
    "Adjustment disorder": "AD",
    "Alcohol use disorder": "AUD",
    "Behavioral addiction disorder": "BAD",
    "Bipolar disorder": "BD",
    "Depressive disorder": "DD",
    "Healthy control": "HC",
    "Obsessive compulsitve disorder": "OCD",
    "Obsessive compulsive disorder": "OCD",
    "Panic disorder": "PD",
    "Posttraumatic stress disorder": "PTSD",
    "Schizophrenia": "SCZ",
    "Social anxiety disorder": "SAD"
  };

  const handleAnalyze = async () => {
    if (!file) { alert("Please upload an EEG file first!"); return; }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze_eeg", { method: "POST", body: formData });
      if (!res.ok) { const errData = await res.json(); throw new Error(errData.error || "Failed to analyze EEG"); }

      const data = await res.json();

      const saveRes = await fetch("/api/eeg-analysis", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ focus: data.focus, stress: data.stress, relax: data.relax, disorder: data.predicted_disorder, confidence: data.confidence, probabilities: data.probabilities }),
      });

      if (saveRes.ok) {
        const saved = await saveRes.json();
        const newSession: EEGSession = {
          _id: saved.analysis._id,
          date: new Date(saved.analysis.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }),
          focusScore: data.focus, stressLevel: data.stress, calmness: data.relax, disorder: data.predicted_disorder,
        };
        setLatestMetrics({ focus: data.focus, stress: data.stress, relax: data.relax, prediction: data.predicted_disorder, confidence: data.confidence, probabilities: data.probabilities });
        setEegSessions((prev) => [newSession, ...prev].slice(0, 10));
      }
      alert("Analysis Complete!");
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  if (dataLoading) {
    return (<AppLayout><div className="flex items-center justify-center h-full"><div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div></div></AppLayout>);
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">EEG Insights 🧠</h1><p className="text-muted-foreground">AI-Powered Neuro-Analysis</p></div>
          <div className="flex gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} className="text-xs" />
            <Button onClick={handleAnalyze} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">{loading ? "Analyzing..." : "Analyze Recording"}</Button>
          </div>
        </div>

        {latestMetrics && (
          <Card className="border-blue-200 bg-blue-50/30 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 rounded-full text-white"><BrainCircuit /></div>
                  <div><p className="text-xs text-blue-600 font-bold uppercase">AI Prediction</p><h2 className="text-3xl font-black text-slate-900">{latestMetrics.prediction}</h2></div>
                </div>
                <div className="text-right"><p className="text-sm text-muted-foreground font-medium">Confidence Score</p><Badge className="text-xl px-4 py-1 bg-white border-2 border-blue-200 text-blue-700">{latestMetrics.confidence}%</Badge></div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard title="Focus Level" value={latestMetrics?.focus || averageMetrics.focus} subtitle="Real-time Score" color={getScoreColor(latestMetrics?.focus || averageMetrics.focus)} icon={getScoreIcon(latestMetrics?.focus || averageMetrics.focus)} />
          <MetricCard title="Stress Level" value={latestMetrics?.stress || averageMetrics.stress} reverse color={getScoreColor(latestMetrics?.stress || averageMetrics.stress, true)} icon={getScoreIcon(latestMetrics?.stress || averageMetrics.stress, true)} subtitle="Emotional Tension" />
          <MetricCard title="Calmness" value={latestMetrics?.relax || averageMetrics.calmness} subtitle="Neural Relaxation" color={getScoreColor(latestMetrics?.relax || averageMetrics.calmness)} icon={getScoreIcon(latestMetrics?.relax || averageMetrics.calmness)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="col-span-1 lg:col-span-1">
            <CardHeader><CardTitle className="text-lg">AI Probability Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={latestMetrics ? Object.entries(latestMetrics.probabilities).map(([name, value]) => ({ fullName: name, name: disorderAbbrMap[name] || name, value })) : []}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" width={40} fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: "transparent" }} labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label} />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={15}>
                      {latestMetrics && Object.entries(latestMetrics.probabilities).map((entry, index) => (
                        <Cell key={index} fill={entry[0] === latestMetrics.prediction ? "#2563eb" : "#e2e8f0"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-4 border-t flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground h-[120px] overflow-y-auto">
                {Object.entries(disorderAbbrMap).map(([long, short]) => (
                  long !== "Obsessive compulsitve disorder" && <div key={long} className="w-[calc(50%-1rem)]"><span className="font-bold text-slate-700">{short}:</span> {long}</div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1 lg:col-span-1">
            <CardHeader><CardTitle className="text-lg">Average Performance</CardTitle></CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: "Focus", value: averageMetrics.focus }, { name: "Stress", value: averageMetrics.stress }, { name: "Relax", value: averageMetrics.calmness }]}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg border-slate-200 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b">
            <div><CardTitle className="text-xl font-bold flex items-center gap-2"><HistoryIcon className="text-blue-600" size={24} />Neural Recording History</CardTitle><CardDescription>Your last 10 sessions from database</CardDescription></div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-bold border-b">
                  <tr><th className="px-6 py-4">Date & Time</th><th className="px-6 py-4">Predicted Disorder</th><th className="px-6 py-4 text-center">Focus</th><th className="px-6 py-4 text-center">Stress</th><th className="px-6 py-4 text-center">Calm</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {eegSessions.length > 0 ? (
                    eegSessions.map((session, index) => (
                      <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-5 font-semibold text-slate-700">{session.date}</td>
                        <td className="px-6 py-5"><Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-100 font-bold">{session.disorder}</Badge></td>
                        <td className="px-6 py-5 text-center font-black">{session.focusScore}%</td>
                        <td className="px-6 py-5 text-center font-black">{session.stressLevel}%</td>
                        <td className="px-6 py-5 text-center font-black">{session.calmness}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">No logs found. Upload a file to start tracking.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function MetricCard({ title, value, color, icon, subtitle }: any) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div><p className="text-sm text-muted-foreground font-semibold uppercase tracking-tight">{title}</p><p className={`text-4xl font-black ${color}`}>{value}%</p><p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-bold">{subtitle}</p></div>
          <div className="p-3 bg-slate-50 rounded-2xl shadow-inner">{icon}</div>
        </div>
        <Progress value={value} className="h-2" />
      </CardContent>
    </Card>
  );
}
