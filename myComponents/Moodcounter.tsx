"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type Mood = {
  emoji: string;
  label: string;
  count: number;
};

export default function MoodCounter() {
  const [moods, setMoods] = useState<Mood[]>([
    { emoji: "😊", label: "Great", count: 0 },
    { emoji: "😃", label: "Good", count: 0 },
    { emoji: "😞", label: "Bad", count: 0 },
    { emoji: "😕", label: "Meh", count: 0 },
    { emoji: "😴", label: "Tired", count: 0 },
    { emoji: "🌟", label: "Awesome", count: 0 },
    { emoji: "😍", label: "Loved", count: 0 },
    { emoji: "🙂", label: "Okay", count: 0 },
    { emoji: "😥", label: "Anxious", count: 0 },
    { emoji: "😡", label: "Upset", count: 0 },
  ]);

  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const fetchMoodData = async () => {
    try {
      const response = await fetch("/api/auth/mood");
      if (!response.ok) {
        console.error("Error fetching mood data:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Fetched mood data:", data.analysis); // Debugging log

      // Update moods with counts from API
      const updatedMoods = moods.map((mood) => {
        const foundMood = data.analysis.find(
          (entry: { mood: string; count: number }) => entry.mood === mood.label
        );
        return {
          ...mood,
          count: foundMood ? foundMood.count : 0, // Update count or default to 0
        };
      });

      setMoods(updatedMoods);
    } catch (error) {
      console.error("Error fetching mood data:", error);
    }
  };

  const handleMoodClick = (mood: Mood) => {
    setSelectedMood(mood);
  };

  useEffect(() => {
    fetchMoodData(); // Fetch mood data on component load
  }, []);

  return (
    <div className="w-full h-full py-6 px-4"> {/* Increased height and padding */}
      <h2 className="text-lg font-semibold mb-4 text-slate-800">Mood Count</h2>
      <div className="grid grid-cols-5 gap-4 mb-6"> {/* Adjusted gap and margin */}
        {moods.map((mood) => (
          <Button
            key={mood.label}
            variant="outline"
            className="text-3xl p-4 h-16" // Increased button size
            onClick={() => handleMoodClick(mood)}
          >
            {mood.emoji}
          </Button>
        ))}
      </div>
      {selectedMood && (
        <div className="text-center mt-6">
          <p className="text-lg text-slate-700">
            {selectedMood.emoji} {selectedMood.label}: {selectedMood.count}
          </p>
        </div>
      )}
    </div>
  );
}
