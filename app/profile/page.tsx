"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Award,
  Target,
  Brain,
  Bell,
  Shield,
  Moon,
  Sun,
  Download,
  Settings,
  Edit
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    habitAlerts: true,
    moodCheckins: false,
    weeklyReports: true,
  });

  const [profile, setProfile] = useState({
    name: "Harsh Upadhyay",
    email: "Upadhyayharsh435@gmail.com", 
    phone: "9284534975",
    birthday: "06-11-2003",
    joinDate: "2024-01-01",
    bio: "Living with ADHD and using NeuroBuddy to build better habits and track my mental wellness journey.",
    goals: "Improve focus, reduce anxiety, build consistent meditation practice",
  });

  const stats = {
    totalHabits: 12,
    currentStreak: 23,
    cbtSessions: 45,
    eegHours: 38,
    joinedDaysAgo: Math.floor((new Date().getTime() - new Date(profile.joinDate).getTime()) / (1000 * 60 * 60 * 24)),
  };

  const achievements = [
    { id: 1, title: "First Week", description: "Completed your first week of habit tracking", earned: true },
    { id: 2, title: "Meditation Master", description: "Completed 30 meditation sessions", earned: true },
    { id: 3, title: "CBT Champion", description: "Practiced CBT exercises for 14 days straight", earned: true },
    { id: 4, title: "Focus Guru", description: "Achieved 80+ focus score 10 times", earned: false },
    { id: 5, title: "Streak Superstar", description: "Maintain a 30-day habit streak", earned: false },
    { id: 6, title: "EEG Explorer", description: "Upload 50 EEG sessions", earned: false },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to the backend
    console.log("Profile saved:", profile);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <AppLayout>
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Profile Settings 👤
          </h1>
          <p className="text-muted-foreground">
            Manage your account and personalize your NeuroBuddy experience
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="btn-calm"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} className="btn-therapy">
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card className="gradient-calm border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" alt={profile.name} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
              <p className="text-muted-foreground mb-2">{profile.email}</p>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <Calendar className="w-3 h-3 mr-1" />
                  {stats.joinedDaysAgo} days active
                </Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Award className="w-3 h-3 mr-1" />
                  {stats.currentStreak} day streak
                </Badge>
              </div>
              <p className="text-sm text-foreground">{profile.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="gradient-calm border-0">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.totalHabits}</p>
            <p className="text-sm text-muted-foreground">Total Habits</p>
          </CardContent>
        </Card>
        <Card className="gradient-calm border-0">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-dopamine-orange mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card className="gradient-calm border-0">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.cbtSessions}</p>
            <p className="text-sm text-muted-foreground">CBT Sessions</p>
          </CardContent>
        </Card>
        <Card className="gradient-calm border-0">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{stats.eegHours}h</p>
            <p className="text-sm text-muted-foreground">EEG Tracking</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={profile.birthday}
                  onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="goals">Current Goals</Label>
              <Textarea
                id="goals"
                value={profile.goals}
                onChange={(e) => setProfile({ ...profile, goals: e.target.value })}
                disabled={!isEditing}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings & Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-primary" />
              Settings & Preferences
            </CardTitle>
            <CardDescription>
              Customize your NeuroBuddy experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleTheme} />
            </div>

            {/* Notifications */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-foreground">Notifications</h4>
              </div>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [key]: checked })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-foreground">Privacy</h4>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full btn-calm" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full btn-calm text-destructive border-destructive/20" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-primary" />
            Achievements
          </CardTitle>
          <CardDescription>
            Track your milestones and unlock new badges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.earned
                    ? "bg-gradient-celebration text-white border-success/20 shadow-celebration"
                    : "bg-muted/20 border-muted text-muted-foreground"
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.earned ? "bg-white/20" : "bg-muted"
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{achievement.title}</h4>
                    {achievement.earned && (
                      <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs">
                        Earned
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm opacity-90">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </AppLayout>
  );
}
