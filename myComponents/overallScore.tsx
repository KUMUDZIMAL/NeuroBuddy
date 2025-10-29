"use client";
import { useEffect, useState } from "react";

// Define types for scores
const items = [
  { id: "happy", label: "happy", icon: "❤️", score: 20 },
  { id: "excited", label: "excited", icon: "✨", score: 19 },
  { id: "grateful", label: "grateful", icon: "🤝", score: 18},
  { id: "relaxed", label: "relaxed", icon: "🌴", score: 19 },
  { id: "content", label: "content", icon: "🏰", score: 20 },
  { id: "tired", label: "tired", icon: "🛏️", score: 16 },
  { id: "unsure", label: "unsure", icon: "🤔", score: 16 },
  { id: "bored", label: "bored", icon: "😴", score: 15 },
  { id: "anxious", label: "anxious", icon: "😰", score: 13},
  { id: "angry", label: "angry", icon: "😡", score: 12 },
  { id: "stressed", label: "stressed", icon: "😫", score: 12 },
  { id: "sad", label: "sad", icon: "😢", score: 11 },
  { id: "desperate", label: "desperate", icon: "😩", score: 11 },
];

const moods = [
  { emoji: "🌟", label: "Awesome", score: 20 },
  { emoji: "😊", label: "Great", score: 19 },
  { emoji: "😍", label: "Loved", score: 18 },
  { emoji: "🙂", label: "Okay", score: 17 },
  { emoji: "😕", label: "Meh", score: 15 },
  { emoji: "😥", label: "Anxious", score: 14 },
  { emoji: "☹️", label: "Bad", score: 13 },
  { emoji: "😖", label: "Terrible", score: 12 },
  { emoji: "😡", label: "Upset", score: 11 },
];

interface Scores {
  moodScore: number;
  emotionScore: number;
  sleepScore: number;
  betterMeScore: number;
  waterScore: number;
  calorieScore: number;
}

interface CalculateScoresInput {
  sleep: number;
  water: number;
  calories: number;
  gender: string;
  age: number;
}

function ScoreDisplay({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [userData, setUserData] = useState<any>(null);

  // Utility function to calculate the overall score out of 100
  function calculateOverallScore({
    moodScore,
    emotionScore,
    sleepScore,
    betterMeScore,
    waterScore,
    calorieScore,
  }: Scores): number {
    const totalScore =
      moodScore +
      emotionScore +
      sleepScore +
      betterMeScore +
      waterScore +
      calorieScore;

    // Ensure the total score doesn't exceed 100 and round it to the nearest integer
    return Math.min(Math.round(totalScore), 100); // Cap the score at 100 and round to integer
  }

  // Utility function to calculate individual scores
  function calculateScores({
    sleep,
    water,
    calories,
    gender,
    age,
  }: CalculateScoresInput): Partial<Scores> {
    let minSleep = 7,
      maxSleep = 9; // Default for 18 to 64 years
    if (age >= 13 && age <= 18) {
      minSleep = 8;
      maxSleep = 10;
    } else if (age > 64) {
      minSleep = 7;
      maxSleep = 8;
    }

    const sleepAdherence = Math.min(1, sleep / minSleep);
    const sleepScore = Math.min(sleepAdherence * 20, 100); // Scale sleep score out of 100

    const recommendedWater = gender.toLowerCase() === "male" ? 2.6 : 2.0;
    const waterAdherence = Math.min(1, water / recommendedWater);
    const waterScore = Math.min(waterAdherence * 10, 100); // Scale water score out of 100

    const recommendedCalories = gender.toLowerCase() === "male" ? 2.5 : 2.0;
    const calorieAdherence = Math.min(1, calories / recommendedCalories);
    const calorieScore = Math.min(calorieAdherence * 10, 100); // Scale calorie score out of 100

    return { sleepScore, waterScore, calorieScore };
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch("/api/auth/inputCard");
        const userData = await userRes.json();

        if (userData && userData.analysis) {
          setUserData(userData);

          const mostRecentEntry = userData.analysis.reduce((latest: any, current: any) => {
            const latestDate = new Date(latest.createdAt);
            const currentDate = new Date(current.createdAt);
            return currentDate > latestDate ? current : latest;
          });

          if (mostRecentEntry) {
            const gender = mostRecentEntry.gender;
            const age = mostRecentEntry.age;
            const sleep = parseFloat(mostRecentEntry.sleep) || 0;
            const water = parseFloat(mostRecentEntry.water) || 0;
            const calories = parseFloat(mostRecentEntry.calories) || 0;
            const betterMe = mostRecentEntry.betterMe || [];
            const userMood = mostRecentEntry.mood || "";
            const userEmotions = mostRecentEntry.emotion || [];

            const moodScore =
              moods.find((mood) => mood.label.toLowerCase() === userMood.toLowerCase())?.score || 0;

            const emotionScore =
              Array.isArray(userEmotions) && userEmotions.length > 0
                ? userEmotions.reduce(
                    (total: number, emotionId: string) =>
                      total + (items.find((item) => item.id === emotionId)?.score || 0),
                    0
                  ) / userEmotions.length
                : 0;

            const {
              sleepScore = 0,
              waterScore = 0,
              calorieScore = 0,
            } = calculateScores({
              sleep,
              water,
              calories,
              gender,
              age,
            });

            const betterMeScore = (betterMe.length / 5) * 20; // Scale out of 100

            const overallScore = calculateOverallScore({
              moodScore,
              emotionScore,
              sleepScore,
              betterMeScore,
              waterScore,
              calorieScore,
            });

            // Pass the overall score to the parent component
            onScoreChange(overallScore);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [onScoreChange]);

  return null; // No need to render anything in this component
}

export default ScoreDisplay;