const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Debug log to check if API key is loaded
console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');

export const analyzeFoodItem = async (foodName, imageData = null) => {
  try {
    // Validate API key
    if (!API_KEY) {
      console.error('API Key is missing or undefined');
      throw new Error("API key is not configured properly");
    }

    console.log('Analyzing food item:', foodName, imageData ? 'with image' : 'text only');
    
    let endpoint = 'https://generativelanguage.googleapis.com/v1/models/';
    let requestBody;

    if (imageData) {
      // Use Gemini 1.5 Flash model for image analysis
      endpoint += 'gemini-1.5-flash:generateContent';
      
      // Convert base64 image data to proper format
      const imageBase64 = imageData.split(',')[1];
      
      requestBody = {
        contents: [{
          parts: [
            {
              text: `Analyze this food image and provide nutritional information in the following JSON format:
              {
                "name": "identified food name",
                "calories": number (per 100g),
                "macronutrients": {
                  "protein": number (in grams),
                  "fat": number (in grams),
                  "carbs": number (in grams)
                },
                "micronutrients": [
                  {
                    "name": string (nutrient name),
                    "amount": string (amount with unit),
                    "dailyValue": string (percentage of daily value)
                  }
                ],
                "benefits": [
                  string (health benefit)
                ],
                "concerns": [
                  string (potential health concern or allergen)
                ]
              }
              
              Important: 
              1. First identify the food in the image
              2. Ensure all numbers are realistic and based on scientific nutritional data
              3. Include at least 5 key micronutrients
              4. List 3-5 evidence-based health benefits
              5. Include any relevant allergens or health concerns
              6. Keep the response strictly in JSON format`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };
    } else {
      // Use Gemini 1.5 Flash model for text analysis
      endpoint += 'gemini-1.5-flash:generateContent';
      
      requestBody = {
        contents: [{
          parts: [{
            text: `Analyze the nutritional content of ${foodName} and provide detailed information.
            Return the response in the following JSON format:
            {
              "name": "${foodName}",
              "calories": number (per 100g),
              "macronutrients": {
                "protein": number (in grams),
                "fat": number (in grams),
                "carbs": number (in grams)
              },
              "micronutrients": [
                {
                  "name": string (nutrient name),
                  "amount": string (amount with unit),
                  "dailyValue": string (percentage of daily value)
                }
              ],
              "benefits": [
                string (health benefit)
              ],
              "concerns": [
                string (potential health concern or allergen)
              ]
            }
            
            Important: 
            1. Ensure all numbers are realistic and based on scientific nutritional data
            2. Include at least 5 key micronutrients
            3. List 3-5 evidence-based health benefits
            4. Include any relevant allergens or health concerns
            5. Keep the response strictly in JSON format`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch data from Gemini API');
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const result = data.candidates[0].content.parts[0].text;
    console.log('Raw API result:', result);
    
    // Extract JSON from the response
    let jsonData;
    try {
      // First, try to parse the entire response as JSON
      jsonData = JSON.parse(result);
    } catch (e) {
      console.error('First parse attempt failed:', e);
      try {
        // If that fails, try to extract JSON from markdown code blocks or plain text
        const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*?}/);
        if (!jsonMatch) {
          console.error('No JSON pattern found in response');
          throw new Error('Could not extract valid JSON from the response');
        }
        const jsonString = jsonMatch[1] || jsonMatch[0];
        // Clean up any potential comments or ellipsis
        const cleanJsonString = jsonString
          .replace(/\/\/.*/g, '') // Remove single-line comments
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
          .replace(/\.\.\./g, '') // Remove ellipsis
          .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
        
        console.log('Cleaned JSON string:', cleanJsonString);
        jsonData = JSON.parse(cleanJsonString);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('Failed to parse the nutrition data. Please try again.');
      }
    }

    // Validate the required fields
    if (!jsonData.name || !jsonData.calories || !jsonData.macronutrients) {
      console.error('Missing required fields in response:', jsonData);
      throw new Error('Missing required fields in the response');
    }

    return jsonData;
  } catch (error) {
    console.error('Error analyzing food item:', error);
    return {
      error: true,
      message: error.message || 'Failed to analyze food item. Please try again later.'
    };
  }
};

export const generateMealPlan = async (preferences) => {
  try {
    // Validate API key
    if (!API_KEY) {
      console.error('API Key is missing or undefined');
      throw new Error("API key is not configured properly");
    }

    console.log('Generating meal plan with preferences:', preferences);

    const prompt = `Create a personalized 7-day meal plan based on the following preferences:
    - Dietary restrictions: ${preferences.restrictions || 'None'}
    - Allergies: ${preferences.allergies || 'None'}
    - Health conditions: ${preferences.healthConditions || 'None'}
    - Activity level: ${preferences.activityLevel || 'Moderate'}
    - Taste preferences: ${preferences.tastePreferences || 'Balanced'}
    - Calorie target: ${preferences.calorieTarget || 'Standard based on activity level'}
    
    Return a complete 7-day meal plan in the following JSON format. Do not use any comments, ellipsis, or placeholders:
    {
      "weekPlan": [
        {
          "day": "Monday",
          "meals": [
            {
              "type": "Breakfast",
              "name": "string",
              "calories": number,
              "macros": {
                "protein": "number in grams",
                "fat": "number in grams",
                "carbs": "number in grams"
              },
              "ingredients": ["ingredient1", "ingredient2"],
              "recipe": "string"
            },
            {
              "type": "Lunch",
              "name": "string",
              "calories": number,
              "macros": {
                "protein": "number in grams",
                "fat": "number in grams",
                "carbs": "number in grams"
              },
              "ingredients": ["ingredient1", "ingredient2"],
              "recipe": "string"
            },
            {
              "type": "Dinner",
              "name": "string",
              "calories": number,
              "macros": {
                "protein": "number in grams",
                "fat": "number in grams",
                "carbs": "number in grams"
              },
              "ingredients": ["ingredient1", "ingredient2"],
              "recipe": "string"
            },
            {
              "type": "Snack",
              "name": "string",
              "calories": number,
              "macros": {
                "protein": "number in grams",
                "fat": "number in grams",
                "carbs": "number in grams"
              },
              "ingredients": ["ingredient1", "ingredient2"],
              "recipe": "string"
            }
          ]
        }
      ],
      "groceryList": {
        "produce": ["item1", "item2"],
        "protein": ["item1", "item2"],
        "dairy": ["item1", "item2"],
        "grains": ["item1", "item2"],
        "other": ["item1", "item2"]
      },
      "nutritionSummary": {
        "averageDailyCalories": number,
        "macroRatio": {
          "protein": "percentage",
          "fat": "percentage",
          "carbs": "percentage"
        }
      }
    }

    Important:
    1. Provide realistic portion sizes and calories
    2. Include detailed ingredients lists
    3. Keep recipes simple and concise
    4. Ensure all meals align with dietary restrictions
    5. Return ONLY valid JSON without any comments or placeholders
    6. Include all 7 days in the weekPlan array
    7. Make sure all numbers are realistic`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to fetch data from Gemini API');
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    const result = data.candidates[0].content.parts[0].text;
    console.log('Raw API result:', result);
    
    // Extract JSON from the response
    let jsonData;
    try {
      // First, try to parse the entire response as JSON
      jsonData = JSON.parse(result);
    } catch (e) {
      console.error('First parse attempt failed:', e);
      try {
        // If that fails, try to extract JSON from markdown code blocks or plain text
        const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*?}/);
        if (!jsonMatch) {
          console.error('No JSON pattern found in response');
          throw new Error('Could not extract valid JSON from the response');
        }
        const jsonString = jsonMatch[1] || jsonMatch[0];
        // Clean up any potential comments or ellipsis
        const cleanJsonString = jsonString
          .replace(/\/\/.*/g, '') // Remove single-line comments
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
          .replace(/\.\.\./g, '') // Remove ellipsis
          .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
        
        console.log('Cleaned JSON string:', cleanJsonString);
        jsonData = JSON.parse(cleanJsonString);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        throw new Error('Failed to parse the meal plan data. Please try again.');
      }
    }

    // Validate the required fields
    if (!jsonData.weekPlan || !Array.isArray(jsonData.weekPlan) || !jsonData.groceryList || !jsonData.nutritionSummary) {
      throw new Error('Missing required fields in the meal plan data');
    }

    return jsonData;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return {
      error: true,
      message: error.message || 'Failed to generate meal plan. Please try again later.'
    };
  }
};

// Mock data for demonstration
const getMockNutritionData = (foodName) => {
  return {
    name: foodName,
    calories: 135,
    macronutrients: {
      protein: 3.5,
      fat: 0.4,
      carbs: 27.4
    },
    micronutrients: [
      { name: "Vitamin C", amount: "14.8mg", dailyValue: "16%" },
      { name: "Potassium", amount: "422mg", dailyValue: "9%" },
      { name: "Vitamin B6", amount: "0.4mg", dailyValue: "31%" },
      { name: "Manganese", amount: "0.3mg", dailyValue: "15%" }
    ],
    benefits: [
      "Good source of energy",
      "Supports digestive health",
      "Contains antioxidants that may reduce inflammation",
      "Helps maintain healthy blood pressure"
    ],
    concerns: [
      "May contribute to blood sugar spikes in some individuals",
      "Some people may have allergies"
    ]
  };
};

const getMockMealPlan = (preferences) => {
  return {
    weekPlan: [
      {
        day: "Monday",
        meals: [
          {
            type: "Breakfast",
            name: "Greek Yogurt with Berries and Granola",
            calories: 320,
            macros: { protein: "21g", fat: "9g", carbs: "41g" },
            ingredients: ["Greek yogurt", "Mixed berries", "Low-sugar granola", "Honey"],
            recipe: "Mix 1 cup of Greek yogurt with 1/2 cup mixed berries, top with 1/4 cup granola and a drizzle of honey."
          },
          {
            type: "Lunch",
            name: "Mediterranean Quinoa Bowl",
            calories: 420,
            macros: { protein: "15g", fat: "18g", carbs: "52g" },
            ingredients: ["Quinoa", "Cucumber", "Cherry tomatoes", "Kalamata olives", "Feta cheese", "Olive oil", "Lemon juice"],
            recipe: "Cook 1 cup quinoa. Mix with diced cucumber, halved cherry tomatoes, olives, and crumbled feta. Dress with olive oil and lemon juice."
          },
          {
            type: "Dinner",
            name: "Baked Salmon with Roasted Vegetables",
            calories: 490,
            macros: { protein: "36g", fat: "24g", carbs: "28g" },
            ingredients: ["Salmon fillet", "Broccoli", "Bell peppers", "Red onion", "Olive oil", "Garlic", "Herbs"],
            recipe: "Bake salmon at 400°F for 15 minutes. Roast vegetables tossed in olive oil, garlic and herbs for 20-25 minutes."
          },
          {
            type: "Snack",
            name: "Apple with Almond Butter",
            calories: 200,
            macros: { protein: "5g", fat: "16g", carbs: "15g" },
            ingredients: ["Apple", "Almond butter"],
            recipe: "Slice one apple and serve with 2 tablespoons of almond butter."
          }
        ]
      },
      // Additional days would be included here
    ],
    groceryList: {
      produce: ["Apples", "Mixed berries", "Cucumber", "Cherry tomatoes", "Broccoli", "Bell peppers", "Red onion"],
      protein: ["Greek yogurt", "Salmon fillets", "Feta cheese"],
      dairy: ["Feta cheese", "Greek yogurt"],
      grains: ["Quinoa", "Low-sugar granola"],
      other: ["Almond butter", "Kalamata olives", "Olive oil", "Honey", "Garlic", "Herbs"]
    },
    nutritionSummary: {
      averageDailyCalories: 1430,
      macroRatio: { protein: "22%", fat: "35%", carbs: "43%" }
    }
  };
};
