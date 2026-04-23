"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Target,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  TrendingUp,
  Award,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AppLayout from "@/components/layout/AppLayout";

interface Habit {
  _id: string;
  name: string;
  description: string;
  frequency: "daily" | "weekly";
  streak: number;
  completedToday: boolean;
  completedThisWeek: number;
  targetPerWeek?: number;
}

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    frequency: "daily" as "daily" | "weekly",
    targetPerWeek: 7,
  });

  const fetchHabits = useCallback(async () => {
    try {
      const res = await fetch("/api/habits", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setHabits(data.habits);
      }
    } catch (err) {
      console.error("Failed to fetch habits:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const toggleHabitCompletion = async (habitId: string) => {
    try {
      const res = await fetch("/api/habits", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: habitId, action: "toggle" }),
      });
      if (res.ok) {
        const data = await res.json();
        setHabits(habits.map((h) => (h._id === habitId ? data.habit : h)));
      }
    } catch (err) {
      console.error("Failed to toggle habit:", err);
    }
  };

  const addHabit = async () => {
    if (!newHabit.name.trim()) return;

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newHabit),
      });
      if (res.ok) {
        const data = await res.json();
        setHabits([...habits, data.habit]);
        setNewHabit({ name: "", description: "", frequency: "daily", targetPerWeek: 7 });
        setIsAddingHabit(false);
      }
    } catch (err) {
      console.error("Failed to add habit:", err);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      const res = await fetch("/api/habits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: habitId }),
      });
      if (res.ok) {
        setHabits(habits.filter((h) => h._id !== habitId));
      }
    } catch (err) {
      console.error("Failed to delete habit:", err);
    }
  };

  const completedToday = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;
  const overallProgress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Daily Habits 🎯</h1>
            <p className="text-muted-foreground">Build consistency and track your wellness journey</p>
          </div>
          <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
            <DialogTrigger asChild>
              <Button className="btn-therapy"><Plus className="w-4 h-4 mr-2" />Add New Habit</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Habit</DialogTitle>
                <DialogDescription>Add a new habit to track your wellness progress</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div><Label htmlFor="name">Habit Name</Label><Input id="name" value={newHabit.name} onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })} placeholder="e.g., Morning meditation" /></div>
                <div><Label htmlFor="description">Description</Label><Textarea id="description" value={newHabit.description} onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })} placeholder="Describe your habit..." /></div>
                <div><Label htmlFor="frequency">Frequency</Label><select id="frequency" value={newHabit.frequency} onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as "daily" | "weekly" })} className="w-full p-2 border rounded-md bg-background"><option value="daily">Daily</option><option value="weekly">Weekly</option></select></div>
                {newHabit.frequency === "weekly" && (<div><Label htmlFor="target">Target per week</Label><Input id="target" type="number" value={newHabit.targetPerWeek} onChange={(e) => setNewHabit({ ...newHabit, targetPerWeek: parseInt(e.target.value) })} min="1" max="7" /></div>)}
                <div className="flex space-x-2">
                  <Button onClick={addHabit} className="btn-therapy flex-1">Create Habit</Button>
                  <Button variant="outline" onClick={() => setIsAddingHabit(false)} className="btn-calm">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="gradient-calm border-0"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Today&apos;s Progress</p><p className="text-2xl font-bold text-foreground">{completedToday}/{totalHabits}</p><p className="text-xs text-success">{Math.round(overallProgress)}% complete</p></div><Target className="w-8 h-8 text-primary" /></div><Progress value={overallProgress} className="mt-3" /></CardContent></Card>
          <Card className="gradient-calm border-0"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Longest Streak</p><p className="text-2xl font-bold text-foreground">{longestStreak} days</p><p className="text-xs text-success">Keep going!</p></div><Award className="w-8 h-8 text-dopamine-orange" /></div></CardContent></Card>
          <Card className="gradient-calm border-0"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Habits</p><p className="text-2xl font-bold text-foreground">{totalHabits}</p><p className="text-xs text-muted-foreground">Active trackers</p></div><TrendingUp className="w-8 h-8 text-primary" /></div></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-primary" />Your Habits</CardTitle>
            <CardDescription>Track your daily and weekly wellness activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground"><Target className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No habits yet. Add your first habit to start tracking!</p></div>
            ) : (
              habits.map((habit) => (
                <div key={habit._id} className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${habit.completedToday ? "bg-success/10 border-success/20 shadow-celebration" : "bg-card hover:bg-muted/50"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <button onClick={() => toggleHabitCompletion(habit._id)} className="mt-1 transition-all duration-200 hover:scale-110">
                        {habit.completedToday ? <CheckCircle2 className="w-6 h-6 text-success sparkle-animation" /> : <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium ${habit.completedToday ? "text-success" : "text-foreground"}`}>{habit.name}</h3>
                          <Badge variant="outline" className={`text-xs ${habit.frequency === "daily" ? "bg-primary/10 text-primary border-primary/20" : "bg-warning/10 text-warning border-warning/20"}`}>{habit.frequency}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{habit.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center"><Award className="w-3 h-3 mr-1" />{habit.streak} day streak</span>
                          <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" />{habit.completedThisWeek}/7 this week</span>
                          {habit.targetPerWeek && <span className="flex items-center"><Target className="w-3 h-3 mr-1" />Target: {habit.targetPerWeek}/week</span>}
                        </div>
                        {habit.frequency === "weekly" && habit.targetPerWeek && (<div className="mt-2"><Progress value={(habit.completedThisWeek / habit.targetPerWeek) * 100} className="h-2" /></div>)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteHabit(habit._id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
