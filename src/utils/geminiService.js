
const API_KEY = "AIzaSyC7GPy656dtUkg11Ah1I3UaiKa2O-JBOI0";

export const analyzeFoodItem = async (foodName) => {
  try {
    const formattedFoodName = foodName.trim().toLowerCase();
    
    const prompt = `Provide a comprehensive nutritional analysis for ${formattedFoodName}. 
    Include: 
    1. Macronutrients (protein, fat, carbohydrates) with exact amounts per 100g
    2. Micronutrients (vitamins, minerals) with percentages of daily value
    3. Calorie content per 100g
    4. Health benefits specifically related to ${formattedFoodName}
    5. Potential allergens or concerns particular to ${formattedFoodName}
    
    Format as JSON with the following structure:
    {
      "name": "${formattedFoodName}",
      "calories": number,
      "macronutrients": { "protein": number, "fat": number, "carbs": number },
      "micronutrients": [ { "name": "nutrient name", "amount": "amount with unit", "dailyValue": "percentage" } ],
      "benefits": [ "benefit 1", "benefit 2" ],
      "concerns": [ "concern 1", "concern 2" ]
    }`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No response from Gemini API:', data);
      throw new Error('Failed to get response from Gemini API');
    }
    
    const result = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*?}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : result;
    
    const parsedData = JSON.parse(jsonString);
    
    // Ensure consistent naming with proper capitalization
    return {
      ...parsedData,
      name: formatFoodName(formattedFoodName)
    };
  } catch (error) {
    console.error('Error analyzing food item:', error);
    return {
      error: true,
      message: 'Failed to analyze food item. Please try again later.',
      details: error.message
    };
  }
};

export const generateMealPlan = async (preferences) => {
  try {
    // Format preferences for better prompting
    const formattedPreferences = {
      restrictions: preferences.restrictions?.trim() || 'None',
      allergies: preferences.allergies?.trim() || 'None',
      healthConditions: preferences.healthConditions?.trim() || 'None',
      activityLevel: preferences.activityLevel?.trim() || 'Moderate',
      tastePreferences: preferences.tastePreferences?.trim() || 'Balanced',
      calorieTarget: preferences.calorieTarget?.trim() || 'Standard based on activity level',
      mealCount: preferences.mealCount || 3
    };

    const prompt = `Create a personalized 7-day meal plan specifically tailored for someone with these exact preferences:
    - Dietary restrictions: ${formattedPreferences.restrictions}
    - Allergies: ${formattedPreferences.allergies}
    - Health conditions: ${formattedPreferences.healthConditions}
    - Activity level: ${formattedPreferences.activityLevel}
    - Taste preferences: ${formattedPreferences.tastePreferences}
    - Calorie target: ${formattedPreferences.calorieTarget}
    - Meals per day: ${formattedPreferences.mealCount}
    
    The meal plan should be realistic, easy to follow, and directly address their specific restrictions and preferences.
    
    Format as JSON with the following structure:
    {
      "weekPlan": [
        {
          "day": "Monday",
          "meals": [
            { 
              "type": "Breakfast", 
              "name": "Meal name", 
              "calories": number,
              "macros": { "protein": "Xg", "fat": "Xg", "carbs": "Xg" },
              "ingredients": ["ingredient 1", "ingredient 2"],
              "recipe": "Brief recipe instructions",
              "dietaryNotes": "How this meets their specific preferences"
            },
            { "type": "Lunch", ... },
            { "type": "Dinner", ... },
            { "type": "Snack", ... }
          ]
        },
        ... (for each day of the week)
      ],
      "groceryList": {
        "produce": ["item 1", "item 2"],
        "protein": ["item 1", "item 2"],
        "dairy": ["item 1", "item 2"],
        "grains": ["item 1", "item 2"],
        "other": ["item 1", "item 2"]
      },
      "nutritionSummary": {
        "averageDailyCalories": number,
        "macroRatio": { "protein": "X%", "fat": "X%", "carbs": "X%" },
        "adheresToPreferences": "Explanation of how this plan meets their needs"
      }
    }`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
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

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No response from Gemini API:', data);
      throw new Error('Failed to get response from Gemini API');
    }
    
    const result = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*?}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : result;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return {
      error: true,
      message: 'Failed to generate meal plan. Please try again later.',
      details: error.message
    };
  }
};

// Helper function to format food names with proper capitalization
function formatFoodName(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Mock data functions kept for fallback purposes
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
