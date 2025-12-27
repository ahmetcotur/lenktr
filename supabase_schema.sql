-- Create Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  role text default 'Operator',
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Links Table
create table public.links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  original_url text not null,
  short_slug text unique not null,
  title text,
  clicks integer default 0,
  is_archived boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Bio Pages Table
create table public.bio_pages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  slug text unique not null,
  profile_title text,
  profile_bio text,
  theme_settings jsonb default '{}'::jsonb,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Notifications Table
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('click', 'system', 'alert')),
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.links enable row level security;
alter table public.bio_pages enable row level security;
alter table public.notifications enable row level security;

-- Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can CRUD own links" on public.links for all using (auth.uid() = user_id);
create policy "Public can view links for redirect" on public.links for select using (true);

create policy "Users can CRUD own bio pages" on public.bio_pages for all using (auth.uid() = user_id);
create policy "Public can view bio pages" on public.bio_pages for select using (true);

create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
