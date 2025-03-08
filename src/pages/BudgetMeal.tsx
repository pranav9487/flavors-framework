import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MealPlan {
  meal: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  cost: number;
  ingredients: string[];
}

const BudgetMeal = () => {
  const [budget, setBudget] = useState<string>('');
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would make an API call to your backend service
      // that generates the meal plan based on the budget
      // For now, we'll just simulate a response
      const response = await new Promise<MealPlan>((resolve) => {
        setTimeout(() => {
          resolve({
            meal: "Sample Balanced Meal",
            calories: 800,
            protein: 30,
            carbs: 100,
            fats: 25,
            cost: parseFloat(budget),
            ingredients: [
              "2 eggs",
              "1 cup brown rice",
              "1 chicken breast",
              "Mixed vegetables"
            ]
          });
        }, 1500);
      });

      setMealPlan(response);
    } catch (error) {
      console.error('Error generating meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Budget Meal Planner</h1>
      
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium mb-2">
              Enter Your Budget (₹)
            </label>
            <div className="flex gap-4">
              <Input
                id="budget"
                type="number"
                min="0"
                step="1"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter your budget in rupees"
                required
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Meal Plan'}
              </Button>
            </div>
          </div>
        </form>

        {mealPlan && (
          <Card>
            <CardHeader>
              <CardTitle>{mealPlan.meal}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="font-medium">{mealPlan.calories} kcal</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="font-medium">₹{mealPlan.cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="font-medium">{mealPlan.protein}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="font-medium">{mealPlan.carbs}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fats</p>
                  <p className="font-medium">{mealPlan.fats}g</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Ingredients:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {mealPlan.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm">{ingredient}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BudgetMeal; 