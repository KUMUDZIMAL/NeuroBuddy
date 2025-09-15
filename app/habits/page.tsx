"use client";
import { useState } from "react";
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
  Clock, 
  CheckCircle2, 
  Circle, 
  Trash2,
  Edit,
  Calendar,
  TrendingUp,
  Award
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AppLayout from "@/components/layout/AppLayout";

interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: "daily" | "weekly";
  streak: number;
  completedToday: boolean;
  completedThisWeek: number;
  targetPerWeek?: number;
}

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Morning Meditation",
      description: "10 minutes of mindfulness to start the day",
      frequency: "daily",
      streak: 12,
      completedToday: true,
      completedThisWeek: 6,
    },
    {
      id: "2", 
      name: "Take Medication",
      description: "ADHD medication with breakfast",
      frequency: "daily",
      streak: 23,
      completedToday: true,
      completedThisWeek: 7,
    },
    {
      id: "3",
      name: "CBT Exercise",
      description: "Practice cognitive behavioral therapy techniques",
      frequency: "weekly",
      streak: 4,
      completedToday: false,
      completedThisWeek: 2,
      targetPerWeek: 3,
    },
    {
      id: "4",
      name: "Evening Reflection",
      description: "Journal about the day and plan tomorrow",
      frequency: "daily",
      streak: 8,
      completedToday: false,
      completedThisWeek: 5,
    },
  ]);

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    frequency: "daily" as "daily" | "weekly",
    targetPerWeek: 7
  });

  const toggleHabitCompletion = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompletedToday = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompletedToday,
          completedThisWeek: newCompletedToday ? habit.completedThisWeek + 1 : habit.completedThisWeek - 1,
          streak: newCompletedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit.name,
        description: newHabit.description,
        frequency: newHabit.frequency,
        streak: 0,
        completedToday: false,
        completedThisWeek: 0,
        targetPerWeek: newHabit.frequency === "weekly" ? newHabit.targetPerWeek : undefined
      };
      setHabits([...habits, habit]);
      setNewHabit({ name: "", description: "", frequency: "daily", targetPerWeek: 7 });
      setIsAddingHabit(false);
    }
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const overallProgress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
  const longestStreak = Math.max(...habits.map(h => h.streak));

  return (
    <AppLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Daily Habits 🎯
          </h1>
          <p className="text-muted-foreground">
            Build consistency and track your wellness journey
          </p>
        </div>
        <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
          <DialogTrigger asChild>
            <Button className="btn-therapy">
              <Plus className="w-4 h-4 mr-2" />
              Add New Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Habit</DialogTitle>
              <DialogDescription>
                Add a new habit to track your wellness progress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Habit Name</Label>
                <Input
                  id="name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="e.g., Morning meditation"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  placeholder="Describe your habit..."
                />
              </div>
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <select
                  id="frequency"
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as "daily" | "weekly" })}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              {newHabit.frequency === "weekly" && (
                <div>
                  <Label htmlFor="target">Target per week</Label>
                  <Input
                    id="target"
                    type="number"
                    value={newHabit.targetPerWeek}
                    onChange={(e) => setNewHabit({ ...newHabit, targetPerWeek: parseInt(e.target.value) })}
                    min="1"
                    max="7"
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <Button onClick={addHabit} className="btn-therapy flex-1">
                  Create Habit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingHabit(false)}
                  className="btn-calm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Progress</p>
                <p className="text-2xl font-bold text-foreground">{completedToday}/{totalHabits}</p>
                <p className="text-xs text-success">{Math.round(overallProgress)}% complete</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
            <Progress value={overallProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <p className="text-2xl font-bold text-foreground">{longestStreak} days</p>
                <p className="text-xs text-success">Keep going!</p>
              </div>
              <Award className="w-8 h-8 text-dopamine-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Habits</p>
                <p className="text-2xl font-bold text-foreground">{totalHabits}</p>
                <p className="text-xs text-muted-foreground">Active trackers</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habits List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-primary" />
            Your Habits
          </CardTitle>
          <CardDescription>
            Track your daily and weekly wellness activities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                habit.completedToday
                  ? "bg-success/10 border-success/20 shadow-celebration"
                  : "bg-card hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className="mt-1 transition-all duration-200 hover:scale-110"
                  >
                    {habit.completedToday ? (
                      <CheckCircle2 className="w-6 h-6 text-success sparkle-animation" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`font-medium ${habit.completedToday ? "text-success" : "text-foreground"}`}>
                        {habit.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          habit.frequency === "daily" 
                            ? "bg-primary/10 text-primary border-primary/20" 
                            : "bg-warning/10 text-warning border-warning/20"
                        }`}
                      >
                        {habit.frequency}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {habit.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Award className="w-3 h-3 mr-1" />
                        {habit.streak} day streak
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {habit.completedThisWeek}/7 this week
                      </span>
                      {habit.targetPerWeek && (
                        <span className="flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          Target: {habit.targetPerWeek}/week
                        </span>
                      )}
                    </div>
                    {habit.frequency === "weekly" && habit.targetPerWeek && (
                      <div className="mt-2">
                        <Progress 
                          value={(habit.completedThisWeek / habit.targetPerWeek) * 100} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHabit(habit.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
    </AppLayout>
  );
}