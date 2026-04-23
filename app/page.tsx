"use client";
import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Brain, Zap, TrendingUp, Calendar, Heart, Activity, Award, MessageCircle, Check, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

interface HabitItem { _id: string; name: string; completedToday: boolean; streak: number; }

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("User");
  const [weeklyStreak, setWeeklyStreak] = useState(0);
  const [todayHabits, setTodayHabits] = useState<HabitItem[]>([]);
  const [latestEEG, setLatestEEG] = useState<{ focus: number; stress: number; disorder: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [userRes, habitsRes, eegRes] = await Promise.all([
        fetch("/api/auth/user", { credentials: "include" }),
        fetch("/api/habits", { credentials: "include" }),
        fetch("/api/eeg-analysis", { credentials: "include" }),
      ]);

      if (userRes.ok) { const userData = await userRes.json(); setUsername(userData.username || "User"); }

      if (habitsRes.ok) {
        const habitsData = await habitsRes.json();
        const habits = habitsData.habits || [];
        setTodayHabits(habits.slice(0, 4).map((h: any) => ({ _id: h._id, name: h.name, completedToday: h.completedToday, streak: h.streak })));
        const maxStreak = habits.length > 0 ? Math.max(...habits.map((h: any) => h.streak)) : 0;
        setWeeklyStreak(maxStreak);
      }

      if (eegRes.ok) {
        const eegData = await eegRes.json();
        if (eegData.analyses && eegData.analyses.length > 0) {
          const latest = eegData.analyses[0];
          setLatestEEG({ focus: latest.focus, stress: latest.stress, disorder: latest.disorder });
        }
      }
    } catch (err) { console.error("Failed to fetch dashboard data:", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const toggleHabit = async (habitId: string) => {
    try {
      const res = await fetch("/api/habits", {
        method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ id: habitId, action: "toggle" }),
      });
      if (res.ok) { setTodayHabits(todayHabits.map((h) => h._id === habitId ? { ...h, completedToday: !h.completedToday } : h)); }
    } catch (err) { console.error("Failed to toggle habit:", err); }
  };

  const completedHabits = todayHabits.filter((h) => h.completedToday).length;
  const totalHabits = todayHabits.length;
  const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

  const recentInsights = [
    "Your focus levels are 23% higher on meditation days",
    "Completing morning habits boosts afternoon productivity",
    "Your stress decreases significantly after CBT exercises",
  ];

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

  if (loading) {
    return (<AppLayout><div className="flex items-center justify-center h-full"><div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div></div></AppLayout>);
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div><h1 className="text-3xl font-bold text-foreground mb-2">Good morning, {username}! 👋</h1><p className="text-muted-foreground">You&apos;re doing great this week. Let&apos;s keep the momentum going!</p></div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2"><Badge variant="outline" className="bg-success/10 text-success border-success/20"><Award className="w-3 h-3 mr-1" />{weeklyStreak} day streak!</Badge></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="gradient-calm border-0"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Today&apos;s Progress</p><p className="text-2xl font-bold text-foreground">{completedHabits}/{totalHabits}</p><p className="text-xs text-success">{Math.round(progressPercentage)}% complete</p></div><Target className="w-8 h-8 text-primary" /></div><Progress value={progressPercentage} className="mt-3" /></CardContent></Card>
          <Card className="gradient-calm border-0"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Weekly Streak</p><p className="text-2xl font-bold text-foreground">{weeklyStreak} days</p><p className="text-xs text-success">Keep going!</p></div><Zap className="w-8 h-8 text-dopamine-orange" /></div></CardContent></Card>
          <Card className="gradient-calm border-0"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">EEG Status</p><p className="text-base font-bold text-foreground leading-tight">{latestEEG ? <>{latestEEG.disorder} <br/><span className="text-sm text-muted-foreground font-normal">{disorderAbbrMap[latestEEG.disorder] ? `(${disorderAbbrMap[latestEEG.disorder]})` : ""}</span></> : "N/A"}</p><p className="text-xs text-success mt-1">{latestEEG ? `Focus: ${latestEEG.focus}%` : "No data yet"}</p></div><Heart className="w-8 h-8 text-primary" /></div></CardContent></Card>
          <Card className="gradient-calm border-0"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Focus Score</p><p className="text-2xl font-bold text-foreground">{latestEEG ? `${latestEEG.focus}/100` : "N/A"}</p><p className="text-xs text-success">{latestEEG && latestEEG.focus >= 70 ? "Above average" : latestEEG ? "Needs improvement" : "Upload EEG data"}</p></div><Brain className="w-8 h-8 text-primary" /></div></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-primary" />Today&apos;s Habits</CardTitle><CardDescription>Stay consistent with your daily wellness routine</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {todayHabits.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground"><Target className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>No habits yet. Add some from the Habits page!</p></div>
              ) : (
                todayHabits.map((habit) => (
                  <div key={habit._id} onClick={() => toggleHabit(habit._id)} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${habit.completedToday ? "bg-green-50 border-green-200" : "bg-muted/50 hover:bg-muted/80"}`}>
                    <div className="flex items-center space-x-3">
                      {habit.completedToday ? <Check className="w-5 h-5 text-foreground" strokeWidth={3} /> : <Circle className="w-5 h-5 text-muted-foreground hover:text-foreground" strokeWidth={2} />}
                      <div><p className="font-medium text-foreground">{habit.name}</p><p className="text-sm text-muted-foreground">{habit.streak} day streak</p></div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-primary" />AI Insights</CardTitle><CardDescription>Personalized observations about your progress</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {recentInsights.map((insight, index) => (<div key={index} className="p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20"><p className="text-sm text-foreground">{insight}</p></div>))}
              <Button className="w-full btn-therapy" size="sm" onClick={() => router.push("/chatbot")}><MessageCircle className="w-4 h-4 mr-2" />Chat with AI Therapist</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle><CardDescription>Jump into your wellness activities</CardDescription></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 btn-calm" onClick={() => router.push("/cbt")}><Brain className="w-6 h-6" /><span className="text-sm">CBT Exercise</span></Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 btn-calm" onClick={() => router.push("/eeg")}><Activity className="w-6 h-6" /><span className="text-sm">Check EEG</span></Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 btn-calm" onClick={() => router.push("/chatbot")}><MessageCircle className="w-6 h-6" /><span className="text-sm">Daily Check-in</span></Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 btn-calm" onClick={() => router.push("/habits")}><Target className="w-6 h-6" /><span className="text-sm">Add Habit</span></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
