import { supabase } from '../supabase';

export type PromptType = 'meal_plan' | 'food_analysis';

export interface Prompt {
  id: string;
  user_id: string;
  prompt_type: PromptType;
  prompt_text: string;
  response: string | null;
  created_at: string;
  updated_at: string;
}

export const promptService = {
  async createPrompt(userId: string, promptType: PromptType, promptText: string): Promise<Prompt> {
    console.log('Creating prompt:', { userId, promptType, textLength: promptText.length });
    
    if (!userId) {
      console.error('No user ID provided to createPrompt');
      throw new Error('User ID is required');
    }

    if (!promptText.trim()) {
      console.error('Empty prompt text provided');
      throw new Error('Prompt text cannot be empty');
    }

    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert([
          {
            user_id: userId,
            prompt_type: promptType,
            prompt_text: promptText.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Database error in createPrompt:', error);
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check if you are properly signed in.');
        }
        if (error.code === '23503') {
          throw new Error('Invalid user ID. Please sign in again.');
        }
        throw new Error(`Failed to save prompt: ${error.message}`);
      }

      if (!data) {
        console.error('No data returned from database insert');
        throw new Error('No data returned from database');
      }

      console.log('Prompt created successfully:', { promptId: data.id });
      return data;
    } catch (err: any) {
      console.error('Error in createPrompt:', err);
      throw err;
    }
  },

  async updatePromptResponse(promptId: string, userId: string, response: string): Promise<void> {
    console.log('Updating prompt response:', { promptId, userId, responseLength: response.length });
    
    if (!promptId || !userId) {
      console.error('Missing required parameters:', { promptId, userId });
      throw new Error('Prompt ID and user ID are required');
    }

    try {
      const { error } = await supabase
        .from('prompts')
        .update({
          response: response,
          updated_at: new Date().toISOString()
        })
        .eq('id', promptId)
        .eq('user_id', userId);

      if (error) {
        console.error('Database error in updatePromptResponse:', error);
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check if you are properly signed in.');
        }
        throw new Error(`Failed to update prompt: ${error.message}`);
      }

      console.log('Prompt response updated successfully');
    } catch (err: any) {
      console.error('Error in updatePromptResponse:', err);
      throw err;
    }
  },

  async getUserPrompts(userId: string): Promise<Prompt[]> {
    console.log('Fetching prompts for user:', userId);
    
    if (!userId) {
      console.error('No user ID provided to getUserPrompts');
      throw new Error('User ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error in getUserPrompts:', error);
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check if you are properly signed in.');
        }
        throw new Error(`Failed to fetch prompts: ${error.message}`);
      }

      console.log('Fetched prompts:', { count: data?.length || 0 });
      return data || [];
    } catch (err: any) {
      console.error('Error in getUserPrompts:', err);
      throw err;
    }
  },

  async deletePrompt(promptId: string, userId: string): Promise<void> {
    console.log('Deleting prompt:', { promptId, userId });
    
    if (!promptId || !userId) {
      console.error('Missing required parameters:', { promptId, userId });
      throw new Error('Prompt ID and user ID are required');
    }

    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId)
        .eq('user_id', userId);

      if (error) {
        console.error('Database error in deletePrompt:', error);
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check if you are properly signed in.');
        }
        throw new Error(`Failed to delete prompt: ${error.message}`);
      }

      console.log('Prompt deleted successfully');
    } catch (err: any) {
      console.error('Error in deletePrompt:', err);
      throw err;
    }
  }
}; 