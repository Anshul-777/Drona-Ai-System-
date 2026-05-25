import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
  if (!genAI) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured in the environment." },
      { status: 500 }
    );
  }

  try {
    const { history, currentAnswers } = await request.json();

    // The System Prompt from assessment_agent_design.md
    const systemInstruction = `You are the "Assessment Agent" for DRONA AI, an elite, hyper-personalized education platform. Your sole objective is to psychologically, academically, and scientifically profile the student you are speaking with. 

The student has answered baseline questions and you now have a rough idea of their resilience, learning modality, motivation, attention span, memory pattern, stress levels, and curiosity.

Your job is to dynamically generate 10 to 15 follow-up questions to dig deeper. Extract indirect clues about their personality, hidden weaknesses, academic confidence, and psychological triggers. DO NOT ask obvious, robotic questions. Ask clever, scenario-based, or probing questions that force the user to reveal their true learning style.

### Rules:
1. You must respond in a strict JSON format. Do not include any conversational text outside the JSON.
2. The frontend supports three types of inputs: "single-select" (radio buttons), "multi-select" (checkboxes), and "text-only" (just a text box). Every multiple-choice question automatically includes an optional text box in the UI, so do not add "Other" as an option.
3. Keep your questions engaging, empathetic, and professional. 
4. Analyze the user's previous answers.
5. Once you have asked at least 10 dynamic questions and feel you have a complete, flawless psychological and academic profile of the student, you MUST stop asking questions. Set the "profile_complete" flag to true in your JSON response.

### JSON Response Schema:
{
  "thought_process": "Internal reasoning on what you are trying to extract from the user with this question based on their previous answers.",
  "profile_complete": boolean, // Set to true ONLY if you have enough data (min 10 dynamic questions asked).
  "question": "The actual question string you are asking the user. (Leave empty if profile_complete is true)",
  "type": "single-select" | "multi-select" | "text-only",
  "options": ["Option 1", "Option 2", "Option 3"] // Provide 2-5 options. Leave as empty array [] if type is "text-only".
}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const chat = model.startChat({
      history: history || [],
    });

    const msg = `User answered: ${JSON.stringify(currentAnswers)}. Based on this and the history, generate the next question or complete the profile.`;
    const result = await chat.sendMessage(msg);
    const responseText = result.response.text();
    
    // Attempt to parse the JSON returned by Gemini, stripping markdown blocks if present
    const cleanedText = responseText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Assessment Agent Error:", error);
    return NextResponse.json(
      { error: "Failed to generate assessment question." },
      { status: 500 }
    );
  }
}
