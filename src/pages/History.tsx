import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { promptService, Prompt } from '../lib/services/promptService';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, RefreshCw, Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const History = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const createTestPrompt = async () => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Direct database insertion for testing
      const { data, error: insertError } = await supabase
        .from('prompts')
        .insert([
          {
            user_id: user.id,
            prompt_type: 'meal_plan',
            prompt_text: 'Test prompt: Create a healthy meal plan',
            response: 'This is a test response for the meal plan.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select();

      if (insertError) {
        console.error('Error inserting test prompt:', insertError);
        throw new Error('Failed to create test prompt');
      }

      console.log('Test prompt created:', data);
      toast({
        title: "Success",
        description: "Test prompt created successfully",
      });

      // Refresh the prompts list
      loadPrompts();
    } catch (err: any) {
      console.error('Error creating test prompt:', err);
      toast({
        title: "Error",
        description: err.message || 'Failed to create test prompt',
        variant: "destructive",
      });
    }
  };

  const loadPrompts = async (showToast = false) => {
    try {
      if (!user) {
        console.log('No user found in loadPrompts');
        throw new Error('User not authenticated');
      }

      setRefreshing(true);
      console.log('Loading prompts for user:', user.id);
      
      // Direct database query for testing
      const { data: userPrompts, error: queryError } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      console.log('Loaded prompts:', userPrompts);
      setPrompts(userPrompts || []);
      
      if (showToast) {
        toast({
          title: "Success",
          description: "History refreshed successfully",
        });
      }
    } catch (err: any) {
      console.error('Error loading prompts:', err);
      setError(err.message);
      if (showToast) {
        toast({
          title: "Error",
          description: "Failed to refresh history",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadPrompts(true);
  };

  const handleDelete = async (promptId: string) => {
    try {
      if (!user) {
        console.log('No user found in handleDelete');
        throw new Error('User not authenticated');
      }
      
      console.log('Deleting prompt:', promptId, 'for user:', user.id);
      const { error: deleteError } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      setPrompts(prompts.filter(p => p.id !== promptId));
      toast({
        title: "Success",
        description: "Prompt deleted successfully",
      });
    } catch (err: any) {
      console.error('Error deleting prompt:', err);
      toast({
        title: "Error",
        description: "Failed to delete prompt",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (authLoading) {
      console.log('Auth is still loading...');
      return;
    }

    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('Initial load of prompts');
    loadPrompts();

    // Set up polling every 30 seconds
    const pollInterval = setInterval(() => {
      loadPrompts();
    }, 30000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading authentication...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading history...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your History</h1>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={createTestPrompt}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Test Prompt
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button onClick={() => navigate('/meal-plan')}>Create New Plan</Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {prompts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No prompts in your history yet.</p>
            <div className="mt-4 space-x-4">
              <Button onClick={createTestPrompt} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Test Prompt
              </Button>
              <Button onClick={() => navigate('/meal-plan')}>
                Create Real Meal Plan
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {prompt.prompt_type === 'meal_plan' ? 'Meal Plan' : 'Food Analysis'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(prompt.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(prompt.id)}
                  >
                    <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Your Prompt:</h4>
                    <p className="text-gray-700">{prompt.prompt_text}</p>
                  </div>
                  {prompt.response && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Response:</h4>
                      <div className="prose max-w-none whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                        {prompt.response}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History; 