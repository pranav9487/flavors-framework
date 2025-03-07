import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { geminiService } from '../lib/services/geminiService';
import { promptService } from '../lib/services/promptService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const MealPlan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('Please sign in to create a meal plan');
      }

      console.log('Creating prompt with user ID:', user.id);
      
      // Step 1: Save the prompt using promptService
      const savedPrompt = await promptService.createPrompt(
        user.id,
        'meal_plan',
        prompt.trim()
      );
      console.log('Prompt saved successfully:', savedPrompt);

      // Show success message and navigate to history
      toast({
        title: "Success",
        description: "Your prompt has been saved. Generating meal plan...",
      });

      // Navigate to history immediately
      navigate('/history');

      // Step 2: Generate the meal plan in the background
      console.log('Generating meal plan...');
      const response = await geminiService.generateMealPlan(prompt.trim());
      console.log('Meal plan generated, length:', response.length);

      // Step 3: Update the prompt with the response using promptService
      await promptService.updatePromptResponse(savedPrompt.id, user.id, response);
      console.log('Prompt updated with response');

      // Show success toast for meal plan generation
      toast({
        title: "Success",
        description: "Your meal plan is ready! Refresh the history page to see it.",
      });

    } catch (err: any) {
      console.error('Error in meal plan creation:', err);
      setError(err.message || 'An unexpected error occurred');
      toast({
        title: "Error",
        description: err.message || 'Failed to process your request',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to create a meal plan</h2>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Meal Planning</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/history')}
          >
            View History
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              What kind of meal plan would you like?
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a 7-day meal plan for a vegetarian with gluten intolerance, focusing on high protein and low carbs."
              className="w-full min-h-[100px]"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Prompt...
              </>
            ) : (
              'Create Meal Plan'
            )}
          </Button>

          <p className="text-sm text-gray-500 text-center mt-4">
            Your prompt will be saved immediately and you'll be redirected to the history page. 
            The meal plan will be generated in the background and will appear in your history when ready.
          </p>
        </form>
      </div>
    </div>
  );
};

export default MealPlan; 