
const API_KEY = "YOUR_GEMINI_API_KEY";

export const analyzeFoodItem = async (foodName) => {
  try {
    // For now, we'll use a placeholder until the user adds their API key
    if (API_KEY === "YOUR_GEMINI_API_KEY") {
      console.warn("Please add your Gemini API key to use this feature");
      // Return mock data for demonstration purposes
      return getMockNutritionData(foodName);
    }

    const prompt = `Provide a comprehensive nutritional analysis for ${foodName}. 
    Include: 
    1. Macronutrients (protein, fat, carbohydrates) with exact amounts per 100g
    2. Micronutrients (vitamins, minerals) with percentages of daily value
    3. Calorie content per 100g
    4. Health benefits
    5. Potential allergens or concerns
    
    Format as JSON with the following structure:
    {
      "name": "Food name",
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
    const result = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*?}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : result;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error analyzing food item:', error);
    return {
      error: true,
      message: 'Failed to analyze food item. Please try again later.'
    };
  }
};

export const generateMealPlan = async (preferences) => {
  try {
    // For now, we'll use a placeholder until the user adds their API key
    if (API_KEY === "YOUR_GEMINI_API_KEY") {
      console.warn("Please add your Gemini API key to use this feature");
      // Return mock data for demonstration purposes
      return getMockMealPlan(preferences);
    }

    const prompt = `Create a personalized 7-day meal plan based on the following preferences:
    - Dietary restrictions: ${preferences.restrictions || 'None'}
    - Allergies: ${preferences.allergies || 'None'}
    - Health conditions: ${preferences.healthConditions || 'None'}
    - Activity level: ${preferences.activityLevel || 'Moderate'}
    - Taste preferences: ${preferences.tastePreferences || 'Balanced'}
    - Calorie target: ${preferences.calorieTarget || 'Standard based on activity level'}
    
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
              "recipe": "Brief recipe instructions"
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
        "macroRatio": { "protein": "X%", "fat": "X%", "carbs": "X%" }
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
    const result = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/{[\s\S]*?}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : result;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return {
      error: true,
      message: 'Failed to generate meal plan. Please try again later.'
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
