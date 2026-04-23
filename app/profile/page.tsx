"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Calendar, Award, Target, Brain, Bell, Shield, Moon, Sun, Download, Settings, Edit } from "lucide-react";
import jsPDF from "jspdf";

interface ProfileData {
  name: string; email: string; phone: string; birthday: string; bio: string; goals: string; joinDate: string;
  notifications: { dailyReminders: boolean; habitAlerts: boolean; moodCheckins: boolean; weeklyReports: boolean };
}

interface Stats { totalHabits: number; currentStreak: number; cbtSessions: number; eegSessions: number; joinedDaysAgo: number; }

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "", email: "", phone: "", birthday: "", bio: "", goals: "", joinDate: "",
    notifications: { dailyReminders: true, habitAlerts: true, moodCheckins: false, weeklyReports: true },
  });
  const [stats, setStats] = useState<Stats>({ totalHabits: 0, currentStreak: 0, cbtSessions: 0, eegSessions: 0, joinedDaysAgo: 0 });
  const [notifications, setNotifications] = useState(profile.notifications);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setStats(data.stats);
        setNotifications(data.profile.notifications);
      }
    } catch (err) { console.error("Failed to fetch profile:", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ bio: profile.bio, phone: profile.phone, birthday: profile.birthday, goals: profile.goals, notifications }),
      });
      if (res.ok) { const data = await res.json(); setProfile(data.profile); setIsEditing(false); }
    } catch (err) { console.error("Failed to save profile:", err); }
    finally { setSaving(false); }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = "/auth/login";
  };

  const toggleTheme = () => { setDarkMode(!darkMode); document.documentElement.classList.toggle("dark"); };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    try {
      const res = await fetch("/api/profile", { method: "DELETE", credentials: "include" });
      if (res.ok) { window.location.href = "/auth/login"; }
    } catch (err) { console.error("Failed to delete account:", err); }
  };

  const handleDownloadData = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Colors (Tailwind palette)
    const primaryColor: [number, number, number] = [124, 58, 237]; // violet-600
    const textDark: [number, number, number] = [15, 23, 42]; // slate-900
    const textMuted: [number, number, number] = [100, 116, 139]; // slate-500
    const bgLight: [number, number, number] = [248, 250, 252]; // slate-50
    const borderColor: [number, number, number] = [226, 232, 240]; // slate-200

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text("NeuroBuddy", 20, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textMuted);
    doc.text("AI-Powered Mental Health & Neuro-Analysis", 20, 32);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...textDark);
    doc.text("USER DATA REPORT", pageWidth - 20, 25, { align: "right" });

    const dateStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textMuted);
    doc.text(`Generated: ${dateStr}`, pageWidth - 20, 32, { align: "right" });

    // Divider
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.line(20, 40, pageWidth - 20, 40);

    let yPos = 55;

    const addSection = (title: string, y: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...primaryColor);
      doc.text(title.toUpperCase(), 20, y);
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(1);
      const textWidth = doc.getTextWidth(title.toUpperCase());
      doc.line(20, y + 3, 20 + textWidth, y + 3);
      return y + 15;
    };

    const addField = (label: string, value: string, x: number, y: number, w: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...textMuted);
      doc.text(label.toUpperCase(), x, y);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...textDark);
      
      const splitText = doc.splitTextToSize(value || "Not provided", w);
      doc.text(splitText, x, y + 6);
      return y;
    };

    // 1. Personal Information
    yPos = addSection("Personal Profile", yPos);
    
    // Grid
    const col1 = 20;
    const col2 = pageWidth / 2 + 10;
    const colWidth = (pageWidth / 2) - 30;

    let row1Y = yPos;
    addField("Full Name", profile.name, col1, row1Y, colWidth);
    addField("Email Address", profile.email, col2, row1Y, colWidth);
    yPos += 18;
    
    let row2Y = yPos;
    addField("Phone Number", profile.phone, col1, row2Y, colWidth);
    addField("Date of Birth", profile.birthday, col2, row2Y, colWidth);
    yPos += 20;

    // Bio Box
    doc.setFillColor(...bgLight);
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.1);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    doc.text("BIOGRAPHY", col1, yPos);
    yPos += 4;
    
    const bioText = doc.splitTextToSize(profile.bio || "No biography provided.", pageWidth - 44);
    const bioHeight = Math.max((bioText.length * 6) + 10, 20);
    doc.roundedRect(20, yPos, pageWidth - 40, bioHeight, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textDark);
    doc.text(bioText, 25, yPos + 8);
    yPos += bioHeight + 12;

    // Goals Box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    doc.text("CURRENT GOALS", col1, yPos);
    yPos += 4;
    
    const goalsText = doc.splitTextToSize(profile.goals || "No goals set.", pageWidth - 44);
    const goalsHeight = Math.max((goalsText.length * 6) + 10, 20);
    doc.roundedRect(20, yPos, pageWidth - 40, goalsHeight, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textDark);
    doc.text(goalsText, 25, yPos + 8);
    yPos += goalsHeight + 15;

    // 2. Statistics
    yPos = addSection("Account Statistics", yPos);

    const drawStatBox = (title: string, value: string, x: number, y: number) => {
      doc.setFillColor(...bgLight);
      doc.setDrawColor(...borderColor);
      doc.roundedRect(x, y, 36, 25, 2, 2, "FD");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...primaryColor);
      doc.text(value, x + 18, y + 12, { align: "center" });
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...textMuted);
      doc.text(title.toUpperCase(), x + 18, y + 19, { align: "center" });
    };

    const gap = (pageWidth - 40 - (36 * 4)) / 3;
    drawStatBox("Total Habits", stats.totalHabits.toString(), 20, yPos);
    drawStatBox("Day Streak", stats.currentStreak.toString(), 20 + 36 + gap, yPos);
    drawStatBox("CBT Sessions", stats.cbtSessions.toString(), 20 + (36 + gap) * 2, yPos);
    drawStatBox("EEG Sessions", stats.eegSessions.toString(), 20 + (36 + gap) * 3, yPos);
    
    yPos += 35;
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...textMuted);
    doc.text(`* Account has been active for ${stats.joinedDaysAgo} days.`, 20, yPos);
    yPos += 15;

    // 3. Notification Preferences
    yPos = addSection("Notification Preferences", yPos);

    const addPref = (label: string, status: boolean, x: number, y: number) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...textDark);
      doc.text(label, x, y);

      const statusText = status ? "ENABLED" : "DISABLED";
      const statusColor: [number, number, number] = status ? [22, 163, 74] : [220, 38, 38];
      const statusBg: [number, number, number] = status ? [220, 252, 231] : [254, 226, 226];

      doc.setFillColor(...statusBg);
      doc.roundedRect(x + 40, y - 4, 22, 6, 1, 1, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...statusColor);
      doc.text(statusText, x + 51, y + 0.5, { align: "center" });
    };

    addPref("Daily Reminders", notifications.dailyReminders, col1, yPos);
    addPref("Habit Alerts", notifications.habitAlerts, col2, yPos);
    yPos += 12;
    addPref("Mood Check-ins", notifications.moodCheckins, col1, yPos);
    addPref("Weekly Reports", notifications.weeklyReports, col2, yPos);

    // Footer
    doc.setDrawColor(...borderColor);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text("This report contains confidential medical and personal information. DO NOT SHARE.", pageWidth / 2, pageHeight - 12, { align: "center" });

    doc.save(`${(profile.name || "User").replace(/\s+/g, '_')}_NeuroBuddy_Report.pdf`);
  };

  if (loading) {
    return (<AppLayout><div className="flex items-center justify-center h-full"><div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div></div></AppLayout>);
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div><h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings 👤</h1><p className="text-muted-foreground">Manage your account and personalize your NeuroBuddy experience</p></div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="btn-calm"><Edit className="w-4 h-4 mr-2" />{isEditing ? "Cancel" : "Edit Profile"}</Button>
            {isEditing && (<Button onClick={handleSave} className="btn-therapy" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>)}
          </div>
        </div>

        <Card className="gradient-calm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24"><AvatarImage src="" alt={profile.name} /><AvatarFallback className="text-2xl bg-primary text-primary-foreground">{profile.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                <p className="text-muted-foreground mb-2">{profile.email}</p>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20"><Calendar className="w-3 h-3 mr-1" />{stats.joinedDaysAgo} days active</Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20"><Award className="w-3 h-3 mr-1" />{stats.currentStreak} day streak</Badge>
                </div>
                <p className="text-sm text-foreground">{profile.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="gradient-calm border-0"><CardContent className="p-4 text-center"><Target className="w-8 h-8 text-primary mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{stats.totalHabits}</p><p className="text-sm text-muted-foreground">Total Habits</p></CardContent></Card>
          <Card className="gradient-calm border-0"><CardContent className="p-4 text-center"><Award className="w-8 h-8 text-dopamine-orange mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{stats.currentStreak}</p><p className="text-sm text-muted-foreground">Day Streak</p></CardContent></Card>
          <Card className="gradient-calm border-0"><CardContent className="p-4 text-center"><Brain className="w-8 h-8 text-success mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{stats.cbtSessions}</p><p className="text-sm text-muted-foreground">CBT Sessions</p></CardContent></Card>
          <Card className="gradient-calm border-0"><CardContent className="p-4 text-center"><Calendar className="w-8 h-8 text-warning mx-auto mb-2" /><p className="text-2xl font-bold text-foreground">{stats.eegSessions}</p><p className="text-sm text-muted-foreground">EEG Sessions</p></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center"><User className="w-5 h-5 mr-2 text-primary" />Personal Information</CardTitle><CardDescription>Update your personal details and preferences</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="name">Full Name</Label><Input id="name" value={profile.name} disabled /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={profile.email} disabled /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} disabled={!isEditing} /></div>
                <div><Label htmlFor="birthday">Birthday</Label><Input id="birthday" type="date" value={profile.birthday} onChange={(e) => setProfile({ ...profile, birthday: e.target.value })} disabled={!isEditing} /></div>
              </div>
              <div><Label htmlFor="bio">Bio</Label><Textarea id="bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} disabled={!isEditing} rows={3} /></div>
              <div><Label htmlFor="goals">Current Goals</Label><Textarea id="goals" value={profile.goals} onChange={(e) => setProfile({ ...profile, goals: e.target.value })} disabled={!isEditing} rows={2} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center"><Settings className="w-5 h-5 mr-2 text-primary" />Settings & Preferences</CardTitle><CardDescription>Customize your NeuroBuddy experience</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">{darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}<div><p className="font-medium text-foreground">Dark Mode</p><p className="text-sm text-muted-foreground">Toggle dark/light theme</p></div></div>
                <Switch checked={darkMode} onCheckedChange={toggleTheme} />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-4"><Bell className="w-5 h-5 text-primary" /><h4 className="font-medium text-foreground">Notifications</h4></div>
                <div className="space-y-3">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</p>
                      <Switch checked={value} onCheckedChange={(checked) => setNotifications({ ...notifications, [key]: checked })} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-4"><Shield className="w-5 h-5 text-primary" /><h4 className="font-medium text-foreground">Account</h4></div>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full btn-calm" size="sm" onClick={handleDownloadData}><Download className="w-4 h-4 mr-2" />Download My Data</Button>
                  <Button onClick={handleLogout} variant="outline" className="w-full btn-calm" size="sm">Logout</Button>
                  <Button variant="outline" className="w-full btn-calm text-destructive border-destructive/20" size="sm" onClick={handleDeleteAccount}>Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
