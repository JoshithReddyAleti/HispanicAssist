import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Create a client with the API key
export const genAI = new GoogleGenerativeAI(apiKey);

// Function to generate content using Gemini
export async function generateContent(prompt: string, language: 'en' | 'es' = 'en'): Promise<string> {
  try {
    // For safety, check if API key is available
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      console.error("Gemini API key is not configured");
      return language === 'en' 
        ? "I'm sorry, the AI service is not properly configured. Please add your Gemini API key to the .env file."
        : "Lo siento, el servicio de IA no está configurado correctamente. Por favor, añade tu clave API de Gemini al archivo .env.";
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return language === 'en'
      ? "I'm sorry, I couldn't generate a response. Please try again."
      : "Lo siento, no pude generar una respuesta. Por favor, inténtalo de nuevo.";
  }
}

// Function to translate text
export async function translateText(text: string, targetLanguage: 'en' | 'es'): Promise<string> {
  try {
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      console.error("Gemini API key is not configured");
      return text; // Return original text if API key is missing
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const sourceLanguage = targetLanguage === 'en' ? 'Spanish' : 'English';
    const targetLanguageName = targetLanguage === 'en' ? 'English' : 'Spanish';
    
    const prompt = `Translate the following ${sourceLanguage} text to ${targetLanguageName}. 
    Maintain the original meaning and tone. Only return the translated text without any additional comments:
    
    "${text}"`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error translating text with Gemini:", error);
    return text; // Return original text on error
  }
}

// Function to check grammar
export async function checkGrammar(text: string, language: 'en' | 'es'): Promise<{
  corrected: string;
  hasErrors: boolean;
  explanation?: string;
}> {
  try {
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      console.error("Gemini API key is not configured");
      return { corrected: text, hasErrors: false }; // Return original text if API key is missing
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const languageName = language === 'en' ? 'English' : 'Spanish';
    
    const prompt = `Check the grammar and spelling of the following ${languageName} text. 
    If there are errors, provide the corrected version and a brief explanation of the errors.
    If there are no errors, just return "CORRECT".
    
    Text: "${text}"
    
    Format your response as:
    Corrected: [corrected text]
    Explanation: [brief explanation of errors, if any]`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    if (response.includes("CORRECT")) {
      return { corrected: text, hasErrors: false };
    }
    
    // Parse the response
    const correctedMatch = response.match(/Corrected: (.*?)(?=\nExplanation:|$)/s);
    const explanationMatch = response.match(/Explanation: (.*?)$/s);
    
    const corrected = correctedMatch ? correctedMatch[1].trim() : text;
    const explanation = explanationMatch ? explanationMatch[1].trim() : undefined;
    
    return {
      corrected,
      hasErrors: corrected !== text,
      explanation
    };
  } catch (error) {
    console.error("Error checking grammar with Gemini:", error);
    return { corrected: text, hasErrors: false }; // Return original text on error
  }
}

// Function to generate flashcards for a topic
export async function generateFlashcards(topic: string, language: 'en' | 'es' = 'en', count: number = 5): Promise<Array<{
  question: string;
  answer: string;
}>> {
  try {
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      console.error("Gemini API key is not configured");
      return [{
        question: language === 'en' ? "API Key Required" : "Se requiere clave API",
        answer: language === 'en' 
          ? "Please add your Gemini API key to the .env file to use this feature."
          : "Por favor, añade tu clave API de Gemini al archivo .env para usar esta función."
      }];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const languageName = language === 'en' ? 'English' : 'Spanish';
    
    const prompt = `Create ${count} educational flashcards about "${topic}" in ${languageName}.
    Each flashcard should have a question on one side and the answer on the other.
    Make the content educational, accurate, and suitable for students.
    
    Format your response as a JSON array with this structure:
    [
      {
        "question": "Question 1",
        "answer": "Answer 1"
      },
      {
        "question": "Question 2",
        "answer": "Answer 2"
      }
    ]
    
    Only return the JSON array without any additional text.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Extract JSON from the response
    const jsonMatch = response.match(/\[\s*\{.*\}\s*\]/s);
    if (!jsonMatch) {
      throw new Error("Failed to parse flashcards from AI response");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error generating flashcards with Gemini:", error);
    
    // Return a fallback set of flashcards
    const fallbackMessage = language === 'en' 
      ? "Sorry, I couldn't generate flashcards at the moment."
      : "Lo siento, no pude generar tarjetas de estudio en este momento.";
      
    return [{
      question: language === 'en' ? "Error" : "Error",
      answer: fallbackMessage
    }];
  }
}