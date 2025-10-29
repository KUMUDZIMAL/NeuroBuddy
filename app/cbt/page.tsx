"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import AppLayout from "../../components/layout/AppLayout";
import { 
  Brain, 
  Wind, 
  Target, 
  Heart, 
  Clock,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Activity
} from "lucide-react";

interface Exercise {
  id: string;
  title: string;
  description: string;
  category: "breathing" | "grounding" | "reframing" | "mindfulness";
  duration: number; // in minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  completedToday: boolean;
  totalCompletions: number;
}

export default function CBT() {
  const [exercises] = useState<Exercise[]>([
    {
      id: "1",
      title: "4-7-8 Breathing",
      description: "Calming breath technique: inhale for 4, hold for 7, exhale for 8",
      category: "breathing",
      duration: 5,
      difficulty: "beginner",
      completedToday: true,
      totalCompletions: 12,
    },
    {
      id: "2",
      title: "5-4-3-2-1 Grounding",
      description: "Notice 5 things you see, 4 you hear, 3 you feel, 2 you smell, 1 you taste",
      category: "grounding",
      duration: 3,
      difficulty: "beginner",
      completedToday: false,
      totalCompletions: 8,
    },
    {
      id: "3", 
      title: "Thought Challenging",
      description: "Identify negative thoughts and challenge them with evidence",
      category: "reframing",
      duration: 10,
      difficulty: "intermediate",
      completedToday: false,
      totalCompletions: 6,
    },
    {
      id: "4",
      title: "Body Scan Meditation",
      description: "Progressive relaxation by focusing on different body parts",
      category: "mindfulness",
      duration: 15,
      difficulty: "intermediate",
      completedToday: false,
      totalCompletions: 4,
    },
    {
      id: "5",
      title: "STOP Technique",
      description: "Stop, Take a breath, Observe, Proceed mindfully",
      category: "mindfulness",
      duration: 2,
      difficulty: "beginner",
      completedToday: false,
      totalCompletions: 15,
    },
  ]);

  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const categoryColors = {
    breathing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    grounding: "bg-green-500/10 text-green-500 border-green-500/20", 
    reframing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    mindfulness: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  const categoryIcons = {
    breathing: Wind,
    grounding: Target,
    reframing: Brain,
    mindfulness: Heart,
  };

  const difficultyColors = {
    beginner: "bg-success/10 text-success border-success/20",
    intermediate: "bg-warning/10 text-warning border-warning/20",
    advanced: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const completedToday = exercises.filter(e => e.completedToday).length;
  const totalExercises = exercises.length;
  const progressPercentage = (completedToday / totalExercises) * 100;

  const startExercise = (exerciseId: string) => {
    setActiveExercise(exerciseId);
    setTimer(0);
    setIsRunning(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <AppLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            CBT Exercises 🧠
          </h1>
          <p className="text-muted-foreground">
            Cognitive Behavioral Therapy techniques for mental wellness
          </p>
        </div>
        <Badge variant="outline" className="mt-4 md:mt-0 bg-primary/10 text-primary border-primary/20">
          <Activity className="w-3 h-3 mr-1" />
          {completedToday}/{totalExercises} completed today
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card className="gradient-calm border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Today's Progress</h3>
              <p className="text-sm text-muted-foreground">Keep building your mental wellness toolkit</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{Math.round(progressPercentage)}%</p>
              <p className="text-xs text-success">Daily goal</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Active Exercise Timer */}
      {activeExercise && (
        <Card className="gradient-focus border-0 shadow-focus">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {exercises.find(e => e.id === activeExercise)?.title}
              </h3>
              <div className="text-4xl font-mono font-bold text-primary mb-4">
                {formatTime(timer)}
              </div>
              <div className="flex justify-center space-x-2">
                <Button 
                  onClick={() => setIsRunning(!isRunning)}
                  className="btn-therapy"
                >
                  {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setActiveExercise(null);
                    setIsRunning(false);
                    setTimer(0);
                  }}
                  className="btn-calm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(categoryColors).map(([category, colorClass]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          const categoryExercises = exercises.filter(e => e.category === category);
          const completed = categoryExercises.filter(e => e.completedToday).length;
          
          return (
            <Card key={category} className="gradient-calm border-0">
              <CardContent className="p-4 text-center">
                <Icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium text-foreground capitalize">{category}</h3>
                <p className="text-xs text-muted-foreground">{completed}/{categoryExercises.length} done</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => {
          const Icon = categoryIcons[exercise.category];
          return (
            <Card 
              key={exercise.id}
              className={`transition-all duration-300 hover:shadow-md ${
                exercise.completedToday ? "bg-success/5 border-success/20" : "hover:bg-muted/50"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">{exercise.title}</CardTitle>
                      {exercise.completedToday && (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={categoryColors[exercise.category]}>
                        {exercise.category}
                      </Badge>
                      <Badge variant="outline" className={difficultyColors[exercise.difficulty]}>
                        {exercise.difficulty}
                      </Badge>
                      <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-muted">
                        <Clock className="w-3 h-3 mr-1" />
                        {exercise.duration}min
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {exercise.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Completed {exercise.totalCompletions} times
                    </span>
                  </div>
                  <Button 
                    onClick={() => startExercise(exercise.id)}
                    disabled={activeExercise === exercise.id}
                    className={exercise.completedToday ? "btn-celebration" : "btn-therapy"}
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {exercise.completedToday ? "Practice Again" : "Start Exercise"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            CBT Quick Tips
          </CardTitle>
          <CardDescription>
            Remember these key principles while practicing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-medium text-foreground mb-2">🎯 Be Present</h4>
              <p className="text-sm text-muted-foreground">
                Focus on the current moment and sensations rather than past regrets or future worries.
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-success/5 to-success/10 rounded-lg border border-success/20">
              <h4 className="font-medium text-foreground mb-2">🌱 Practice Regularly</h4>
              <p className="text-sm text-muted-foreground">
                Consistency matters more than perfection. Even 2-3 minutes daily can make a difference.
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-warning/5 to-warning/10 rounded-lg border border-warning/20">
              <h4 className="font-medium text-foreground mb-2">💭 Challenge Thoughts</h4>
              <p className="text-sm text-muted-foreground">
                Ask yourself: "Is this thought helpful? Is it based on facts or assumptions?"
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-500/5 to-purple-500/10 rounded-lg border border-purple-500/20">
              <h4 className="font-medium text-foreground mb-2">🎈 Be Kind to Yourself</h4>
              <p className="text-sm text-muted-foreground">
                Treat yourself with the same compassion you'd show a good friend.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </AppLayout>
  );
}