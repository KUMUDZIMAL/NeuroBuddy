// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { FiArrowLeft, FiArrowRight } from "react-icons/fi"; // For icons

// type Option = {
//   id: number;
//   text: string;
// };

// type Question = {
//   question: string;
//   options: Option[];
// };

// type Response = {
//   question: string;
//   answer: string;
// };

// const Assessment: React.FC = () => {
//   const [startAssessment, setStartAssessment] = useState<boolean>(false);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [responses, setResponses] = useState<Response[]>([]);
//   const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [questionCount, setQuestionCount] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [insights, setInsights] = useState<string | null>(null);
//   const [timer, setTimer] = useState(120); // 2 minutes for the timer

//   const fetchQuestion = useCallback(async (previousAnswer?: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("/api/questionnaire", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           previousAnswer,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`) as { question: string; options: string[] 
//       }

//       const questionData = await response.json();

//       if (questionData && questionData.question && Array.isArray(questionData.options)) {
//         setCurrentQuestion({
//           question: questionData.question,
//           options: questionData.options.map((text: string, index: number) => ({
//             id: index + 1,
//             text,
//           })),
//         });
//       } else {
//         throw new Error("Unexpected question data structure");
//       }

//     } catch (error: unknown
//       console.error("Error fetching question:", error);
//       if (error instanceof Error) {
//         setError(`Failed to fetch question. ${error.message}`);
//       } else {
//         setError("Failed to fetch question. Unknown error occurred");
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (startAssessment) {
//       fetchQuestion();
//     }
//   }, [startAssessment, fetchQuestion]);

//   useEffect(() => {
//     if (timer > 0 && startAssessment) {
//       const interval = setInterval(() => setTimer(timer - 1), 1000);
//       return () => clearInterval(interval);
//     }
//   }, [timer, startAssessment]);

//   const handleOptionClick = useCallback((text: string) => {
//     setSelectedOption(text);
//   }, []);

//   const handleSubmit = useCallback(async () => {
//     if (selectedOption && currentQuestion) {
//       const newResponse = { question: currentQuestion.question, answer: selectedOption };
//       setResponses((prev) => [...prev, newResponse]);
//       setSelectedOption(null);

//       setQuestionCount((prev) => prev + 1);

//       if (questionCount < 3) {
//         await fetchQuestion(selectedOption);
//       } else {
//         setLoading(true);
//         try {
//           const response = await fetch("/api/questionnaire/analyze", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               responses: [...responses, newResponse],
//             }),
//           });

//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }

//           const data = await response.json();
//           setInsights(data.insights);
//         } catch (error) {
//           console.error("Error analyzing responses", error);
//           setError("Failed to analyze responses. Please try again.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     }
//   }, [selectedOption, currentQuestion, questionCount, responses, fetchQuestion]);

//   if (!startAssessment) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-50 to-blue-50">
//         <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-lg">
//           <h2 className="mb-6 text-4xl font-extrabold text-gray-800">📝 Take Your Assessment</h2>
//           <p className="mb-6 text-lg text-gray-600">
//             Ready to begin? Start your test!
//           </p>
//           <button
//             onClick={() => setStartAssessment(true)}
//             className="px-6 py-3 font-semibold text-white transition duration-300 transform bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 hover:scale-105"
//           >
//             Start Assessment
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="w-full max-w-lg p-8 mx-auto mt-10 bg-white rounded-lg shadow-xl">
//         <h2 className="mb-4 text-3xl font-bold text-gray-800">Oops, something went wrong</h2>
//         <p className="mb-6 text-red-500">{error}</p>
//         <button
//           onClick={() => fetchQuestion()}
//           className="px-6 py-3 font-semibold text-white bg-red-500 rounded-lg shadow hover:bg-red-600"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   if (insights) {
//     return (
//       <div className="w-full max-w-lg p-8 mx-auto mt-10 bg-white rounded-lg shadow-xl">
//         <h2 className="mb-4 text-2xl font-bold text-gray-800">Your Insights</h2>
//         <p className="font-medium text-gray-700">{insights}</p>
//       </div>
//     );
//   }

//   if (!currentQuestion) {
//     return <div>No question available.</div>;
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-50 to-blue-50">
//       <div className="w-full max-w-5xl p-8 bg-white rounded-lg shadow-lg">
//         <div className="flex items-center justify-between mb-6">
//           <button className="text-gray-700">
//             <FiArrowLeft size={24} />
//           </button>
//           <h2 className="text-xl font-semibold">Aptitude Test</h2>
//           <div className="text-gray-500">{`${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60}`}</div>
//         </div>

//         <p className="mb-4 text-sm text-purple-500">Questions {questionCount + 1} of 5</p>

//         <h2 className="mb-6 text-2xl font-bold text-gray-800">{currentQuestion.question}</h2>

//         <div className="space-y-4">
//           {currentQuestion.options.map((option) => (
//             <div
//               key={option.id}
//               className={`relative flex items-center justify-between p-6 border rounded-lg cursor-pointer transition-all ${
//                 selectedOption === option.text
//                   ? "bg-purple-100 border-purple-400"
//                   : "bg-gray-50 hover:bg-gray-100"
//               }`}
//               onClick={() => handleOptionClick(option.text)}
//             >
//               <p className="text-gray-700">{option.text}</p>
//               <span
//                 className={`w-6 h-6 border rounded-full flex items-center justify-center ${
//                   selectedOption === option.text
//                     ? "border-purple-600 bg-purple-500"
//                     : "border-gray-400"
//                 }`}
//               >
//                 {selectedOption === option.text && (
//                   <span className="w-4 h-4 bg-white rounded-full"></span>
//                 )}
//               </span>
//             </div>
//           ))}
//         </div>

//         <div className="mt-8">
//           <button
//             onClick={handleSubmit}
//             disabled={!selectedOption}
//             className={`w-full py-3 text-lg font-semibold flex items-center justify-center rounded-lg transition-all ${
//               selectedOption
//                 ? "bg-black text-white hover:bg-gray-800"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             Next <FiArrowRight className="ml-2" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Assessment;


'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface QuestionData {
  question: string;
  options: string[];
}

interface Insight {
  condition: string;
  confidence: number;
}

export default function MentalHealthQuestionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [responses, setResponses] = useState<{question: string, answer: string}[]>([]);
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNextQuestion = async (previousAnswer?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pathname: '/questions',
          previousAnswer 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }

      const data = await response.json();
      setCurrentQuestion(data);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeResponses = async (finalResponses: {question: string, answer: string}[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          pathname: '/analyze',
          responses: finalResponses 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze responses');
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (error) {
      console.error('Error analyzing responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextQuestion();
  }, []);

  const handleAnswer = (answer: string) => {
    if (currentQuestion) {
      const newResponses = [...responses, { 
        question: currentQuestion.question, 
        answer 
      }];

      setResponses(newResponses);

      // If you want to limit the number of questions, adjust this condition
      if (newResponses.length >= 5) {
        analyzeResponses(newResponses);
        return;
      }

      fetchNextQuestion(answer);
    }
  };

  const restartQuestionnaire = () => {
    setResponses([]);
    setInsights(null);
    fetchNextQuestion();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
          <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
          <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
        </div>
        <div className="text-2xl font-copernicusMedium z-10">Loading...</div>
      </div>
    );
  }

  if (insights) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
          <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
          <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
          <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
        </div>
        <div className="shadow-md rounded-lg p-10 pb-8 max-w-xl w-full z-10 bg-white/60">
          <h2 className="text-2xl font-semibold mb-4 text-slate-600 font-copernicusMedium">
            Mental Health Insights
          </h2>
          <div className="whitespace-pre-line text-gray-700 mb-6 font-outfitRegular">
            {insights}
          </div>
          <Button onClick={restartQuestionnaire} className="w-full bg-violet-400 hover:bg-violet-500 text-white font-outfitRegular">
            Restart Questionnaire
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
        <div className="absolute w-80 h-80 bg-blue-500/30 rounded-full blur-3xl bottom-0 right-20"></div>
        <div className="absolute w-72 h-72 bg-purple-500/30 rounded-full blur-3xl -right-20 top-10"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
        <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-20 left-20"></div>
      </div>
      <div className="bg-white/50 shadow-md rounded-3xl p-12 max-w-xl w-full z-10">
        <h2 className="text-xl font-copernicusMedium mb-4">
          {currentQuestion.question}
        </h2>
        <div className="space-y-3 font-outfitRegular">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant="default"
              className="w-full justify-start p-8 rounded-3xl bg-transparent shadow-none border border-slate-300/60 text-slate-800 hover:bg-violet-200 hover:border-transparent"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-500 font-outfitRegular">
          Question {responses.length + 1} of 5
        </div>
      </div>
    </div>
  );
}