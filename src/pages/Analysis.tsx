import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { promptService } from '../lib/services/promptService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const Analysis = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Create a prompt in the database
      const savedPrompt = await promptService.createPrompt('food_analysis', prompt);

      // TODO: Replace this with actual API call to your AI service
      const aiResponse = "This is a placeholder response. Replace with actual AI analysis.";

      // Update the prompt with the response
      await promptService.updatePromptResponse(savedPrompt.id, aiResponse);

      setResponse(aiResponse);
    } catch (err) {
      setError('Failed to analyze food. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Food Analysis</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to analyze?
            </label>
            <Input
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., What are the nutritional benefits of quinoa?"
              className="w-full"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button type="submit" disabled={loading || !prompt.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </form>

        {response && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Analysis Result</h2>
            <div className="prose max-w-none">
              {response}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis; 