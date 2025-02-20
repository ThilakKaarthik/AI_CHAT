import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API
// env holds the env variables
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyDrnUAGA7aq4860-J40KzER-46rMZxSUes"
);

export async function generateResponse(
  prompt: string,
  type: string,
  language: string
): Promise<string> {
  try {
    // Select the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Construct the AI system prompt
    const systemPrompt = `You are an expert ${language} developer. ${getPromptByType(type)}`;
    const fullPrompt = `${systemPrompt}\n\nUser Input: ${prompt}`;

    // Generate AI response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response from Gemini AI.");
  }
}

function getPromptByType(type: string): string {
  const prompts: Record<string, string> = {
    validation:
      "Analyze the following code for potential issues, bugs, and best practice violations. Provide detailed feedback and suggestions for improvement.",
    debug:
      "Help identify and fix bugs in the following code. Explain the issues and provide corrected code.",
    explain:
      "Provide a detailed explanation of how the following code works, breaking down complex parts and explaining the logic.",
    generate:
      "Generate high-quality, production-ready code based on the following requirements. Include comments and follow best practices.",
    refactor:
      "Suggest improvements to make the following code more efficient, maintainable, and readable. Provide refactored code with explanations.",
  };

  return prompts[type] || "Analyze and respond to the following code-related query.";
}
