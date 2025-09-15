"use client";
import AppLayout from "@/components/layout/AppLayout";
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Brain, 
  Zap, 
  TrendingUp, 
  Calendar,
  Heart,
  Activity,
  Award,
  MessageCircle,
  Check,
  Circle
} from "lucide-react";

export default function Dashboard() {
  const [weeklyStreak, setWeeklyStreak] = useState(5);
  const [currentMood, setCurrentMood] = useState("positive");

  const [todayHabits, setTodayHabits] = useState([
    { name: "Morning meditation", completedToday: true, time: "9:00 AM" },
    { name: "Take medication", completedToday: true, time: "9:30 AM" },
    { name: "Pomodoro work session", completedToday: false, time: "2:00 PM" },
    { name: "Evening reflection", completedToday: false, time: "8:00 PM" },
  ]);

  const recentInsights = [
    "Your focus levels are 23% higher on meditation days",
    "Completing morning habits boosts afternoon productivity",
    "Your stress decreases significantly after CBT exercises"
  ];

  const completedHabits = todayHabits.filter(h => h.completedToday).length;
  const totalHabits = todayHabits.length;
  const progressPercentage = (completedHabits / totalHabits) * 100;

  // ✅ Toggle completion on click
  const toggleHabit = (index: number) => {
    const updated = [...todayHabits];
    updated[index].completedToday = !updated[index].completedToday;
    setTodayHabits(updated);
  };

  return (
    <AppLayout>
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Good morning, Harsh! 👋
          </h1>
          <p className="text-muted-foreground">
            You're doing great this week. Let's keep the momentum going!
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <Award className="w-3 h-3 mr-1" />
            {weeklyStreak} day streak!
          </Badge>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Progress</p>
                <p className="text-2xl font-bold text-foreground">{completedHabits}/{totalHabits}</p>
                <p className="text-xs text-success">+{Math.round(progressPercentage)}% complete</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
            <Progress value={progressPercentage} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Streak</p>
                <p className="text-2xl font-bold text-foreground">{weeklyStreak} days</p>
                <p className="text-xs text-success">Personal record!</p>
              </div>
              <Zap className="w-8 h-8 text-dopamine-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Mood</p>
                <p className="text-2xl font-bold text-foreground capitalize">{currentMood}</p>
                <p className="text-xs text-success">Trending upward</p>
              </div>
              <Heart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Focus Score</p>
                <p className="text-2xl font-bold text-foreground">8.2/10</p>
                <p className="text-xs text-success">Above average</p>
              </div>
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ✅ Updated Today's Habits */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Today's Habits
            </CardTitle>
            <CardDescription>
              Stay consistent with your daily wellness routine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayHabits.map((habit, index) => (
              <div
                key={index}
                onClick={() => toggleHabit(index)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  habit.completedToday
                    ? "bg-green-50 border-green-200"
                    : "bg-muted/50 hover:bg-muted/80"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Tick / Circle */}
                  {habit.completedToday ? (
                    <Check className="w-5 h-5 text-foreground" strokeWidth={3} />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-foreground" strokeWidth={2} />
                  )}

                  <div>
                    <p className="font-medium text-foreground">{habit.name}</p>
                    <p className="text-sm text-muted-foreground">{habit.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Personalized observations about your progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInsights.map((insight, index) => (
              <div
                key={index}
                className="p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20"
              >
                <p className="text-sm text-foreground">{insight}</p>
              </div>
            ))}
            <Button className="w-full btn-therapy" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with AI Therapist
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Jump into your wellness activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 btn-calm">
              <Brain className="w-6 h-6" />
              <span className="text-sm">CBT Exercise</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 btn-calm">
              <Activity className="w-6 h-6" />
              <span className="text-sm">Check EEG</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 btn-calm">
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm">Daily Check-in</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 btn-calm">
              <Target className="w-6 h-6" />
              <span className="text-sm">Add Habit</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </AppLayout>
  );
}
