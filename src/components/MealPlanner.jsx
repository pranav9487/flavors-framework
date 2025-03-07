import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Calendar, CheckSquare, ShoppingBag, Utensils, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { generateMealPlan } from '@/utils/geminiService';
import { cn } from '@/lib/utils';

const MealPlanner = () => {
  const [preferences, setPreferences] = useState({
    restrictions: '',
    allergies: '',
    healthConditions: '',
    activityLevel: 'moderate',
    tastePreferences: '',
    calorieTarget: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [activeMeal, setActiveMeal] = useState(null);
  const [activeTab, setActiveTab] = useState('mealplan');
  const [expandedCategories, setExpandedCategories] = useState({
    produce: true,
    protein: true,
    dairy: true,
    grains: true,
    other: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    toast.info('Generating your meal plan...', { duration: 3000 });

    try {
      const plan = await generateMealPlan(preferences);
      
      if (plan.error) {
        toast.error(plan.message);
      } else {
        setMealPlan(plan);
        setActiveDay(0);
        setActiveMeal(null);
        toast.success('Your meal plan is ready!');
      }
    } catch (error) {
      console.error('Meal plan generation error:', error);
      toast.error('Failed to generate meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPlan = () => {
    setMealPlan(null);
    setActiveDay(0);
    setActiveMeal(null);
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
    { value: 'light', label: 'Light (light exercise 1-3 days/week)' },
    { value: 'moderate', label: 'Moderate (moderate exercise 3-5 days/week)' },
    { value: 'active', label: 'Active (hard exercise 6-7 days/week)' },
    { value: 'very_active', label: 'Very Active (very hard exercise & physical job)' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-b from-green-200 to-white overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-48 h-48 bg-green-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-red-400/20 rounded-full blur-3xl"></div>
      </div>

      {!mealPlan ? (
        <div className="space-y-6 animate-fade-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-medium mb-2">Personalized Meal Planning</h2>
            <p className="text-muted-foreground">
              Create a customized 7-day meal plan based on your preferences and needs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="restrictions" className="block text-sm font-medium mb-1">
                    Dietary Restrictions
                  </label>
                  <Input
                    id="restrictions"
                    name="restrictions"
                    placeholder="e.g., Vegetarian, Vegan, Keto, Paleo"
                    value={preferences.restrictions}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="allergies" className="block text-sm font-medium mb-1">
                    Allergies
                  </label>
                  <Input
                    id="allergies"
                    name="allergies"
                    placeholder="e.g., Nuts, Dairy, Gluten, Shellfish"
                    value={preferences.allergies}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="healthConditions" className="block text-sm font-medium mb-1">
                    Health Conditions
                  </label>
                  <Input
                    id="healthConditions"
                    name="healthConditions"
                    placeholder="e.g., Diabetes, Hypertension, GERD"
                    value={preferences.healthConditions}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="activityLevel" className="block text-sm font-medium mb-1">
                    Activity Level
                  </label>
                  <Select
                    value={preferences.activityLevel}
                    onValueChange={(value) => handleSelectChange('activityLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="tastePreferences" className="block text-sm font-medium mb-1">
                    Taste Preferences
                  </label>
                  <Textarea
                    id="tastePreferences"
                    name="tastePreferences"
                    placeholder="e.g., Spicy food, Mediterranean cuisine, Prefer chicken over red meat"
                    value={preferences.tastePreferences}
                    onChange={handleInputChange}
                    className="resize-none h-20"
                  />
                </div>

                <div>
                  <label htmlFor="calorieTarget" className="block text-sm font-medium mb-1">
                    Calorie Target (optional)
                  </label>
                  <Input
                    id="calorieTarget"
                    name="calorieTarget"
                    type="text"
                    placeholder="e.g., 2000, or leave blank for automatic calculation"
                    value={preferences.calorieTarget}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-lg font-medium mt-6"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating Plan...' : 'Generate Meal Plan'}
            </Button>
          </form>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-medium">Your Custom Meal Plan</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Average daily calories: {mealPlan.nutritionSummary.averageDailyCalories} kcal • 
                Protein: {mealPlan.nutritionSummary.macroRatio.protein} • 
                Fat: {mealPlan.nutritionSummary.macroRatio.fat} • 
                Carbs: {mealPlan.nutritionSummary.macroRatio.carbs}
              </p>
            </div>
            <Button variant="outline" onClick={resetPlan}>
              Create New Plan
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="mealplan" className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Meal Plan</span>
              </TabsTrigger>
              <TabsTrigger value="grocery" className="flex items-center gap-2">
                <ShoppingBag size={18} />
                <span>Grocery List</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mealplan" className="space-y-6">
              <div className="flex overflow-x-auto py-2 gap-2 pb-4">
                {days.map((day, index) => (
                  <Button
                    key={index}
                    variant={activeDay === index ? "default" : "outline"}
                    className={cn(
                      "flex-shrink-0 h-12",
                      activeDay === index ? "shadow-md" : ""
                    )}
                    onClick={() => setActiveDay(index)}
                  >
                    {day}
                  </Button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mealPlan.weekPlan[activeDay].meals.map((meal, index) => (
                  <Card 
                    key={index} 
                    className={cn(
                      "transition-all duration-300 hover:shadow-md overflow-hidden",
                      activeMeal === index ? "ring-2 ring-primary/20" : ""
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="bg-slate-100 text-xs rounded-full px-2 py-1 text-slate-600">
                          {meal.type}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {meal.calories} kcal
                        </div>
                      </div>
                      <CardTitle className="text-xl mt-2">{meal.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex justify-between mb-3 text-sm">
                        <span>Protein: {meal.macros.protein}</span>
                        <span>Fat: {meal.macros.fat}</span>
                        <span>Carbs: {meal.macros.carbs}</span>
                      </div>
                      <Separator className="my-2" />
                      <div 
                        className={cn(
                          "transition-all duration-300 overflow-hidden",
                          activeMeal === index ? "max-h-72" : "max-h-0"
                        )}
                      >
                        <div className="pt-2">
                          <h4 className="font-medium text-sm mb-1">Ingredients:</h4>
                          <ul className="text-sm space-y-1 pl-5 list-disc mb-3">
                            {meal.ingredients.map((ingredient, i) => (
                              <li key={i}>{ingredient}</li>
                            ))}
                          </ul>
                          <h4 className="font-medium text-sm mb-1">Recipe:</h4>
                          <p className="text-sm text-muted-foreground">{meal.recipe}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="ghost" 
                        className="w-full flex items-center justify-center gap-1"
                        onClick={() => setActiveMeal(activeMeal === index ? null : index)}
                      >
                        {activeMeal === index ? (
                          <>
                            <ChevronUp size={18} />
                            <span>Hide Details</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown size={18} />
                            <span>View Details</span>
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="grocery" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Weekly Grocery List</CardTitle>
                  <CardDescription>
                    All ingredients needed for your 7-day meal plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(mealPlan.groceryList).map(([category, items]) => (
                    <div key={category} className="border rounded-lg overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-3 bg-secondary cursor-pointer"
                        onClick={() => toggleCategory(category)}
                      >
                        <h3 className="font-medium capitalize">{category}</h3>
                        <Button variant="ghost" size="sm">
                          {expandedCategories[category] ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </Button>
                      </div>
                      {expandedCategories[category] && (
                        <div className="p-3 bg-white">
                          <ul className="space-y-1">
                            {items.map((item, index) => (
                              <li key={index} className="flex items-center space-x-2">
                                <CheckSquare size={16} className="text-muted-foreground" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default MealPlanner;
