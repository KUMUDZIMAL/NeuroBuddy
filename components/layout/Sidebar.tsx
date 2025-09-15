"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Target,
  MessageCircle,
  Brain,
  Activity,
  User,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Habits", href: "/habits", icon: Target },
  { name: "AI Chat", href: "/chat", icon: MessageCircle },
  { name: "CBT Exercises", href: "/cbt", icon: Brain },
  { name: "EEG Insights", href: "/eeg", icon: Activity },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <div
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-therapy rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">
                  NeuroBuddy
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  AI Therapy Companion
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5", collapsed ? "" : "mr-3")} />
              {!collapsed && <span>{item.name}</span>}
              {active && !collapsed && (
                <div className="ml-auto w-2 h-2 bg-current rounded-full animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 text-center">
            <p>Supporting your mental wellness journey</p>
            <div className="mt-2 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
