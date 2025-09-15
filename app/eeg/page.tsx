"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Activity, 
  Upload, 
  Brain, 
  Zap, 
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Calendar,
  Clock,
  BarChart3
} from "lucide-react";

interface EEGSession {
  id: string;
  date: Date;
  duration: number; // in minutes
  focusScore: number; // 0-100
  stressLevel: number; // 0-100
  calmness: number; // 0-100
  meditation: boolean;
}

export default function EEG() {
  const [eegSessions] = useState<EEGSession[]>([
    {
      id: "1",
      date: new Date(2024, 0, 15, 9, 30),
      duration: 20,
      focusScore: 85,
      stressLevel: 25,
      calmness: 78,
      meditation: true,
    },
    {
      id: "2", 
      date: new Date(2024, 0, 15, 14, 15),
      duration: 45,
      focusScore: 65,
      stressLevel: 60,
      calmness: 45,
      meditation: false,
    },
    {
      id: "3",
      date: new Date(2024, 0, 14, 10, 0),
      duration: 30,
      focusScore: 72,
      stressLevel: 40,
      calmness: 65,
      meditation: true,
    },
    {
      id: "4",
      date: new Date(2024, 0, 14, 16, 30),
      duration: 25,
      focusScore: 58,
      stressLevel: 75,
      calmness: 35,
      meditation: false,
    },
  ]);

  const [selectedTimeframe, setSelectedTimeframe] = useState<"today" | "week" | "month">("week");

  const averageMetrics = {
    focus: Math.round(eegSessions.reduce((sum, session) => sum + session.focusScore, 0) / eegSessions.length),
    stress: Math.round(eegSessions.reduce((sum, session) => sum + session.stressLevel, 0) / eegSessions.length),
    calmness: Math.round(eegSessions.reduce((sum, session) => sum + session.calmness, 0) / eegSessions.length),
  };

  const totalSessions = eegSessions.length;
  const totalDuration = eegSessions.reduce((sum, session) => sum + session.duration, 0);
  const meditationSessions = eegSessions.filter(session => session.meditation).length;

  const getScoreColor = (score: number, reverse: boolean = false) => {
    if (reverse) {
      if (score <= 30) return "text-success";
      if (score <= 60) return "text-warning";
      return "text-destructive";
    } else {
      if (score >= 70) return "text-success";
      if (score >= 40) return "text-warning";
      return "text-destructive";
    }
  };

  const getScoreIcon = (score: number, reverse: boolean = false) => {
    if (reverse) {
      if (score <= 30) return <TrendingDown className="w-4 h-4 text-success" />;
      if (score <= 60) return <Minus className="w-4 h-4 text-warning" />;
      return <TrendingUp className="w-4 h-4 text-destructive" />;
    } else {
      if (score >= 70) return <TrendingUp className="w-4 h-4 text-success" />;
      if (score >= 40) return <Minus className="w-4 h-4 text-warning" />;
      return <TrendingDown className="w-4 h-4 text-destructive" />;
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
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button variant="outline" className="btn-calm">
            <Upload className="w-4 h-4 mr-2" />
            Upload EEG Data
          </Button>
          <Button variant="outline" className="btn-calm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <Card className="gradient-calm border-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">Analysis Period</h3>
              <p className="text-sm text-muted-foreground">Select timeframe for insights</p>
            </div>
            <div className="flex space-x-2">
              {(["today", "week", "month"] as const).map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={selectedTimeframe === timeframe ? "btn-therapy" : "btn-calm"}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Focus</p>
                <p className={`text-2xl font-bold ${getScoreColor(averageMetrics.focus)}`}>
                  {averageMetrics.focus}%
                </p>
                <p className="text-xs text-muted-foreground">Based on {totalSessions} sessions</p>
              </div>
              <div className="flex flex-col items-center">
                <Brain className="w-8 h-8 text-primary mb-1" />
                {getScoreIcon(averageMetrics.focus)}
              </div>
            </div>
            <Progress value={averageMetrics.focus} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stress Level</p>
                <p className={`text-2xl font-bold ${getScoreColor(averageMetrics.stress, true)}`}>
                  {averageMetrics.stress}%
                </p>
                <p className="text-xs text-muted-foreground">Lower is better</p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-8 h-8 text-warning mb-1" />
                {getScoreIcon(averageMetrics.stress, true)}
              </div>
            </div>
            <Progress value={averageMetrics.stress} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Calmness</p>
                <p className={`text-2xl font-bold ${getScoreColor(averageMetrics.calmness)}`}>
                  {averageMetrics.calmness}%
                </p>
                <p className="text-xs text-muted-foreground">Relaxation state</p>
              </div>
              <div className="flex flex-col items-center">
                <Activity className="w-8 h-8 text-success mb-1" />
                {getScoreIcon(averageMetrics.calmness)}
              </div>
            </div>
            <Progress value={averageMetrics.calmness} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Session History and Brain Wave Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Recent Sessions
            </CardTitle>
            <CardDescription>
              Your latest EEG monitoring sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {eegSessions.slice(0, 4).map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-lg border bg-gradient-to-r from-card to-muted/20 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-foreground">
                      {session.date.toLocaleDateString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {session.duration}min
                    </Badge>
                    {session.meditation && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                        Meditation
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Focus</p>
                    <p className={`font-semibold ${getScoreColor(session.focusScore)}`}>
                      {session.focusScore}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Stress</p>
                    <p className={`font-semibold ${getScoreColor(session.stressLevel, true)}`}>
                      {session.stressLevel}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Calm</p>
                    <p className={`font-semibold ${getScoreColor(session.calmness)}`}>
                      {session.calmness}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Brain Wave Visualization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Brain Wave Patterns
            </CardTitle>
            <CardDescription>
              Simulated EEG wave visualization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Alpha Waves */}
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">Alpha Waves (8-12 Hz)</h4>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
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
                  <h4 className="font-medium text-foreground">Beta Waves (13-30 Hz)</h4>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    Focused
                  </Badge>
                </div>
                <div className="h-8 bg-green-500/20 rounded relative overflow-hidden">
                  <div className="h-full w-full eeg-wave bg-green-500/40" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active concentration and problem-solving
                </p>
              </div>

              {/* Theta Waves */}
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">Theta Waves (4-7 Hz)</h4>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                    Meditative
                  </Badge>
                </div>
                <div className="h-8 bg-purple-500/20 rounded relative overflow-hidden">
                  <div className="h-full w-full eeg-wave bg-purple-500/40" style={{ animationDelay: '1s' }}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Deep meditation and intuitive insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            Session Statistics
          </CardTitle>
          <CardDescription>
            Overview of your EEG monitoring activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalSessions}</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{Math.round(totalDuration / 60)}h</p>
              <p className="text-sm text-muted-foreground">Total Duration</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{meditationSessions}</p>
              <p className="text-sm text-muted-foreground">Meditation Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{Math.round(totalDuration / totalSessions)}min</p>
              <p className="text-sm text-muted-foreground">Avg Session</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Instructions */}
      <Card className="border-dashed border-2">
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Upload Your EEG Data
          </h3>
          <p className="text-muted-foreground mb-4">
            Support for Muse, NeuroSky, and other EEG devices. Upload CSV or JSON files to get personalized insights.
          </p>
          <Button className="btn-therapy">
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: .csv, .json (max 10MB)
          </p>
        </CardContent>
      </Card>
    </div>
    </AppLayout>
  );
}