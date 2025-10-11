import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

export async function getSymptomAnalysis(symptoms) {
  const prompt = `
    You are an intelligent and medically informed assistant. Your task is to analyze the user's symptoms carefully and provide clear, structured insights as if you are a professional doctor. 

    Follow these instructions strictly:

    1. Analyze the symptoms and suggest **3–5 possible health conditions** that could explain them. 
    - For each condition, provide a concise explanation of why it may relate to the symptoms.
    - Focus on common causes and reasoning; avoid guessing rare conditions unless strongly indicated.

    2. Provide **recommended next steps** in a safe, educational manner:
    - Include self-care tips, monitoring advice, and signs that require medical attention.
    - Include guidance on when to consult a healthcare professional.
    - Avoid prescribing medications or giving dosage instructions.

    3. Keep the output in this exact format (no extra symbols or headers):

    
    - Title: description (5 conditions)

    Recommended Next Steps:
    - Title: description (self-care, monitoring, urgent care advice)(5-6 steps) 

    4. Include a disclaimer reminding the user that this information is for **educational purposes only** and is **not a medical diagnosis**.(this must be included compulsorily)

    SYMPTOMS: ${symptoms}
    `;


  const result = await geminiModel.generateContent(prompt);
  console.log("Gemini API Result:", result);

  // Extract the text
  if (result?.response?.text) {
    const textOutput = await result.response.text();
    return textOutput || "No response generated.";
  }

  return "No response generated.";

}
