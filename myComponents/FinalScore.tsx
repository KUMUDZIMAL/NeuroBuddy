import ScoreDisplay from "./overallScore";
import Component from "./Radialchart";
import { useState } from "react";
export default function FinalScore() {
  const [score, setScore] = useState(0);

  // Handle score change from ScoreDisplay component
  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  return (
    <div>
      <ScoreDisplay onScoreChange={handleScoreChange} />
      <Component score={score} />
    </div>
  );
}
