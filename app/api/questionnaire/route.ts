// import Groq from "groq-sdk";
// import 'dotenv/config';
// import express from "express";
// import cors from 'cors';

// const app = express();
// app.use(cors());
// app.use(express.json());

// const port = process.env.PORT || 5001;
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// async function getGroqChatCompletion(previousAnswers: string[]) {

//   const basePrompt = `Act as a therapist conducting an initial assessment. Generate a single mental health-related question that helps identify potential mental health issues. The question should be appropriate based on the previous answers. Start with general questions and progressively ask more specific questions as you gather more information. Output must be in JSON format only, without any additional content. The JSON structure should be:
// {
//   "question": "Your question here",
//   "options": [
//     "Option 1",
//     "Option 2",
//     "Option 3",
//     "Option 4"
//   ]
// }
// No need for a correct option. Each option should provide a valid response related to mental health. Generate only one question per request.`;

//   const contextMessage = previousAnswers.length > 0
//     ? `${basePrompt} Previous answers: ${JSON.stringify(previousAnswers)}. Based on these, generate an appropriate short and precise follow-up question, follow the instructions strictly.`
//     : basePrompt;

//   try {
//     const response = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "user",
//           content: contextMessage
//         }
//       ],
//       // model: "llama-3.2-3b-preview"
//       model: "llama-3.1-70b-versatile"
//     });

//     console.log("Full Groq API response:", JSON.stringify(response, null, 2)); // Add this line

//     const content = response.choices[0]?.message?.content;

//     const match = content?.match(/\{[\s\S]*?\}/);
//     if (match) {
//       return match[0];
//     } else {
//       throw new Error("No valid JSON object found in the response");
//     }

//   } catch (error) {
//     console.error("Error in getGroqChatCompletion:", error);
//     throw error;
//   }
// }

// app.post("/questions", async (req, res) => {
//   const { previousAnswer } = req.body;

//   try {
//     const questionData = await getGroqChatCompletion(previousAnswer ? [previousAnswer] : []);
//     console.log("Raw question data:", questionData);
//     const parsedData = JSON.parse(questionData);
//     res.json(parsedData);
//   } catch (error) {
//     console.error("Error in /questions:", error);
//     if (error instanceof SyntaxError) {
//       console.error("JSON parsing error:", error);
//       res.status(500).json({ error: "Error parsing question data: " + error.message });
//     } else {
//       res.status(500).json({ error: "Error fetching question data: " + (error as Error).message });
//     }
//   }
// });

// app.post("/analyze", async (req:any, res:any) => {
//   const { responses } = req.body;

//   if (!responses || !Array.isArray(responses)) {
//     return res.status(400).json({ error: "Invalid responses: must be an array" });
//   }

//   try {
//     const userInsights = await getInsightsFromResponses(responses);
//     res.json({ insights: userInsights,responses:responses });
//   } catch (error) {
//     console.error("Error in /analyze:", error);
//     res.status(500).json({ error: "Error analyzing responses" });
//   }
// });

// async function getInsightsFromResponses(responses: {question: string, answer: string}[]) {
//   const userResponsesText = responses.map(r => `Q: ${r.question}, A: ${r.answer}`).join("; ");

//   const contextMessage = `Based on the following user responses from a therapy session, analyze and provide a JSON object with potential mental health conditions the user might be experiencing. Include a confidence level as a percentage for each condition. The output should be in this format:
//   {
//     "potentialConditions": [
//       {
//         "condition": "condition name",
//         "confidence": 75 // Percentage between 0 and 100
//       }
//     ]
//   }
//   Provide at least 3 potential conditions, even if some have low confidence. Ensure the confidence levels are integers between 0 and 100.
//   User responses: ${userResponsesText}`;

//   try {
//     const response = await groq.chat.completions.create({
//       messages: [{ role: "user", content: contextMessage }],
//       model: "llama-3.2-3b-preview"
//     });

//     const content = response.choices[0]?.message?.content;
    
//     // Try to extract and parse the JSON object from the content
//     const jsonMatch = content?.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       const jsonStr = jsonMatch[0];
//       try {
//         const parsedData = JSON.parse(jsonStr);
        
//         // Validate the structure and format the output
//         if (Array.isArray(parsedData.potentialConditions)) {
//           const readableConditions = parsedData.potentialConditions.map((condition: {condition:string, confidence:number}) => {
//             const confidence = Math.min(Math.max(Math.round(condition.confidence), 0), 100);
//             return `${condition.condition} (Confidence: ${confidence}%)`;
//           }).join('\n');

//           return `Potential mental health conditions based on your responses:\n${readableConditions}`;
//         }
        
//         throw new Error("Invalid structure for potential conditions");
//       } catch (parseError) {
//         console.error("JSON parsing error:", parseError);
//         throw new Error("Invalid JSON in API response");
//       }
//     } else {
//       throw new Error("No valid JSON object found in the response");
//     }
//   } catch (error) {
//     console.error("Error in getInsightsFromResponses:", error);
//     throw error;
//   }
// }

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });



// pages/api/questionnaire.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import Groq from "groq-sdk";

// // Ensure you have dotenv configured in your next.config.js or _app.ts
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // Keep your existing async functions, just adjust the type signatures
// async function getGroqChatCompletion(previousAnswers: string[]): Promise<string> {
//   const basePrompt = `Act as a therapist conducting an initial assessment. Generate a single mental health-related question that helps identify potential mental health issues. The question should be appropriate based on the previous answers. Start with general questions and progressively ask more specific questions as you gather more information. Output must be in JSON format only, without any additional content. The JSON structure should be:
// {
//   "question": "Your question here",
//   "options": [
//     "Option 1",
//     "Option 2",
//     "Option 3",
//     "Option 4"
//   ]
// }
// No need for a correct option. Each option should provide a valid response related to mental health. Generate only one question per request.`;

//   const contextMessage = previousAnswers.length > 0
//     ? `${basePrompt} Previous answers: ${JSON.stringify(previousAnswers)}. Based on these, generate an appropriate short and precise follow-up question, follow the instructions strictly.`
//     : basePrompt;

//   try {
//     const response = await groq.chat.completions.create({
//       messages: [
//         {
//           role: "user",
//           content: contextMessage
//         }
//       ],
//       model: "llama-3.1-70b-versatile"
//     });

//     console.log("Full Groq API response:", JSON.stringify(response, null, 2));

//     const content = response.choices[0]?.message?.content;

//     const match = content?.match(/\{[\s\S]*?\}/);
//     if (match) {
//       return match[0];
//     } else {
//       throw new Error("No valid JSON object found in the response");
//     }

//   } catch (error) {
//     console.error("Error in getGroqChatCompletion:", error);
//     throw error;
//   }
// }

// async function getInsightsFromResponses(responses: {question: string, answer: string}[]): Promise<string> {
//   const userResponsesText = responses.map(r => `Q: ${r.question}, A: ${r.answer}`).join("; ");

//   const contextMessage = `Based on the following user responses from a therapy session, analyze and provide a JSON object with potential mental health conditions the user might be experiencing. Include a confidence level as a percentage for each condition. The output should be in this format:
//   {
//     "potentialConditions": [
//       {
//         "condition": "condition name",
//         "confidence": 75 // Percentage between 0 and 100
//       }
//     ]
//   }
//   Provide at least 3 potential conditions, even if some have low confidence. Ensure the confidence levels are integers between 0 and 100.
//   User responses: ${userResponsesText}`;

//   try {
//     const response = await groq.chat.completions.create({
//       messages: [{ role: "user", content: contextMessage }],
//       model: "llama-3.2-3b-preview"
//     });

//     const content = response.choices[0]?.message?.content;
    
//     const jsonMatch = content?.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       const jsonStr = jsonMatch[0];
//       try {
//         const parsedData = JSON.parse(jsonStr);
        
//         if (Array.isArray(parsedData.potentialConditions)) {
//           const readableConditions = parsedData.potentialConditions.map((condition: {condition:string, confidence:number}) => {
//             const confidence = Math.min(Math.max(Math.round(condition.confidence), 0), 100);
//             return `${condition.condition} (Confidence: ${confidence}%)`;
//           }).join('\n');

//           return `Potential mental health conditions based on your responses:\n${readableConditions}`;
//         }
        
//         throw new Error("Invalid structure for potential conditions");
//       } catch (parseError) {
//         console.error("JSON parsing error:", parseError);
//         throw new Error("Invalid JSON in API response");
//       }
//     } else {
//       throw new Error("No valid JSON object found in the response");
//     }
//   } catch (error) {
//     console.error("Error in getInsightsFromResponses:", error);
//     throw error;
//   }
// }

// // Main API route handler
// export default async function handler(
//   req: NextApiRequest, 
//   res: NextApiResponse
// ) {
//   // Check if it's a POST request
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   try {
//     // Route based on the path
//     if (req.query.slug === 'questions') {
//       const { previousAnswer } = req.body;
//       const questionData = await getGroqChatCompletion(previousAnswer ? [previousAnswer] : []);
//       const parsedData = JSON.parse(questionData);
//       return res.status(200).json(parsedData);
//     } 
    
//     if (req.query.slug === 'analyze') {
//       const { responses } = req.body;

//       if (!responses || !Array.isArray(responses)) {
//         return res.status(400).json({ error: "Invalid responses: must be an array" });
//       }

//       const userInsights = await getInsightsFromResponses(responses);
//       return res.status(200).json({ insights: userInsights, responses });
//     }

//     // If no matching route
//     return res.status(404).json({ message: 'Endpoint Not Found' });

//   } catch (error) {
//     console.error('API Error:', error);
//     return res.status(500).json({ 
//       message: 'Internal Server Error',
//       error: error instanceof Error ? error.message : 'Unknown error' 
//     });
//   }
// }



// app/api/questionnaire/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getGroqChatCompletion(previousAnswers: string[]): Promise<string> {
  const basePrompt = `Act as a therapist conducting an initial assessment. Generate a single mental health-related question that helps identify potential mental health issues. The question should be appropriate based on the previous answers. Start with general questions and progressively ask more specific questions as you gather more information. Output must be in JSON format only, without any additional content. The JSON structure should be:
{
  "question": "Your question here",
  "options": [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4"
  ]
}
No need for a correct option. Each option should provide a valid response related to mental health. Generate only one question per request.`;

  const contextMessage = previousAnswers.length > 0
    ? `${basePrompt} Previous answers: ${JSON.stringify(previousAnswers)}. Based on these, generate an appropriate short and precise follow-up question, follow the instructions strictly.`
    : basePrompt;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: contextMessage
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    console.log("Full Groq API response:", JSON.stringify(response, null, 2));

    const content = response.choices[0]?.message?.content;

    const match = content?.match(/\{[\s\S]*?\}/);
    if (match) {
      return match[0];
    } else {
      throw new Error("No valid JSON object found in the response");
    }

  } catch (error) {
    console.error("Error in getGroqChatCompletion:", error);
    throw error;
  }
}

async function getInsightsFromResponses(responses: {question: string, answer: string}[]): Promise<string> {
  const userResponsesText = responses.map(r => `Q: ${r.question}, A: ${r.answer}`).join("; ");

  const contextMessage = `Based on the following user responses from a therapy session, analyze and provide a JSON object with potential mental health conditions the user might be experiencing. Include a confidence level as a percentage for each condition. The output should be in this format:
  {
    "potentialConditions": [
      {
        "condition": "condition name",
        "confidence": 75 // Percentage between 0 and 100
      }
    ]
  }
  Provide at least 3 potential conditions, even if some have low confidence. Ensure the confidence levels are integers between 0 and 100.
  User responses: ${userResponsesText}`;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: contextMessage }],
      model: "llama-3.3-70b-versatile"
    });

    const content = response.choices[0]?.message?.content;
    
    const jsonMatch = content?.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      try {
        const parsedData = JSON.parse(jsonStr);
        
        if (Array.isArray(parsedData.potentialConditions)) {
          const readableConditions = parsedData.potentialConditions.map((condition: {condition:string, confidence:number}) => {
            const confidence = Math.min(Math.max(Math.round(condition.confidence), 0), 100);
            return `${condition.condition} (Confidence: ${confidence}%)`;
          }).join('\n');

          return `Potential mental health conditions based on your responses:\n${readableConditions}`;
        }
        
        throw new Error("Invalid structure for potential conditions");
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error("Invalid JSON in API response");
      }
    } else {
      throw new Error("No valid JSON object found in the response");
    }
  } catch (error) {
    console.error("Error in getInsightsFromResponses:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { previousAnswer, responses } = body;

    // Check if this is an analyze request
    if (responses) {
      if (!Array.isArray(responses)) {
        return NextResponse.json({ error: "Invalid responses: must be an array" }, { status: 400 });
      }
      const userInsights = await getInsightsFromResponses(responses);
      return NextResponse.json({ insights: userInsights, responses }, { status: 200 });
    }

    // Default behavior is to return next question
    const questionData = await getGroqChatCompletion(previousAnswer ? [previousAnswer] : []);
    const parsedData = JSON.parse(questionData);
    return NextResponse.json(parsedData, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}