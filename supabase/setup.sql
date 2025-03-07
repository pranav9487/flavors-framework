-- Drop existing table and policies if they exist
drop policy if exists "Users can view their own prompts" on public.prompts;
drop policy if exists "Users can create their own prompts" on public.prompts;
drop policy if exists "Users can update their own prompts" on public.prompts;
drop policy if exists "Users can delete their own prompts" on public.prompts;
drop table if exists public.prompts;

-- Create the prompts table
create table public.prompts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    prompt_type text check (prompt_type in ('meal_plan', 'food_analysis')) not null,
    prompt_text text not null,
    response text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.prompts enable row level security;

-- Create policies
create policy "Users can view their own prompts"
    on public.prompts for select
    using (auth.uid() = user_id);

create policy "Users can create their own prompts"
    on public.prompts for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own prompts"
    on public.prompts for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own prompts"
    on public.prompts for delete
    using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table prompts; 