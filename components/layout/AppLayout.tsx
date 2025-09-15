"use client";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <header className="bg-card border-b border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-therapy rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">NB</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">NeuroBuddy</h1>
                <p className="text-xs text-muted-foreground">AI Therapy Companion</p>
              </div>
            </div>
          </header>
        )}
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
        
        {/* Mobile Navigation */}
        {isMobile && (
          <nav className="bg-card border-t border-border p-2">
            <div className="flex justify-around">
              {/* Mobile nav items will go here */}
              <p className="text-xs text-muted-foreground text-center py-2">
                Mobile navigation coming soon
              </p>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}