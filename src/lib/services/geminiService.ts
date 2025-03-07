import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('Missing Gemini API key in environment variables');
}

console.log('Initializing Gemini API with key length:', GEMINI_API_KEY.length);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface MealPlanResponse {
  meals: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  }[];
  nutritionalInfo: {
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const geminiService = {
  async generateMealPlan(prompt: string): Promise<string> {
    try {
      console.log('Starting meal plan generation with prompt length:', prompt.length);

      if (!prompt.trim()) {
        throw new Error('Prompt cannot be empty');
      }

      console.log('Initializing Gemini model...');
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const systemPrompt = `As a professional nutritionist and meal planner, create a detailed 7-day meal plan based on the following requirements. 
      
Format the response as follows:

Day 1:
Breakfast:
- [Meal details]
Lunch:
- [Meal details]
Dinner:
- [Meal details]
Snacks:
- [Snack options]

[Continue for all 7 days]

Additional Notes:
- Nutritional Information
- Special Considerations
- Shopping List (key ingredients)

User Requirements:
${prompt}`;

      console.log('Sending request to Gemini API...');
      console.log('System prompt length:', systemPrompt.length);
      
      const result = await model.generateContent(systemPrompt);
      console.log('Received response from Gemini API');
      
      if (!result.response) {
        console.error('No response object in Gemini result');
        throw new Error('No response received from Gemini');
      }
      
      const text = result.response.text();
      console.log('Extracted text from response, length:', text?.length);
      
      if (!text) {
        console.error('Empty text in Gemini response');
        throw new Error('Empty response received from Gemini');
      }

      // Verify the response format
      if (!text.includes('Day 1') || !text.includes('Breakfast')) {
        console.warn('Response might not be properly formatted:', text.substring(0, 100) + '...');
      }

      console.log('Successfully generated meal plan');
      return text;
    } catch (error: any) {
      console.error('Detailed Gemini error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        details: error
      });
      
      // Handle specific error cases
      if (error.message?.includes('API key')) {
        throw new Error('Configuration error: Invalid API key');
      }
      
      if (error.message?.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      }

      if (error.message?.includes('PERMISSION_DENIED')) {
        throw new Error('API key does not have permission to access Gemini. Please check your API key configuration.');
      }
      
      throw new Error(`Gemini API Error: ${error.message || 'Unknown error occurred'}`);
    }
  }
}; 