-- Base schema for athletes and videos tables
-- Run this in your Supabase SQL editor FIRST before other schemas

-- Athletes table
create table if not exists athletes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Videos table
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_path text not null,
  thumbnail_url text,
  duration float,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_athletes_name on athletes(name);
create index if not exists idx_videos_created_at on videos(created_at desc);

-- Enable Row Level Security
alter table athletes enable row level security;
alter table videos enable row level security;

-- RLS Policies for Athletes (allow all operations for development)
create policy "Allow all operations on athletes"
  on athletes
  for all
  using (true)
  with check (true);

-- RLS Policies for Videos (allow all operations for development)
create policy "Allow all operations on videos"
  on videos
  for all
  using (true)
  with check (true);

-- Function to automatically update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_athletes_updated_at
  before update on athletes
  for each row
  execute function update_updated_at_column();

create trigger update_videos_updated_at
  before update on videos
  for each row
  execute function update_updated_at_column();

-- Storage bucket for video files
-- Note: Run this separately in the Supabase dashboard or use the Storage API
-- This is just for reference

-- insert into storage.buckets (id, name, public)
-- values ('videos', 'videos', true)
-- on conflict (id) do nothing;

-- Storage policies for videos bucket (allow all operations)
-- create policy "Allow all uploads to videos bucket"
--   on storage.objects for insert
--   with check (bucket_id = 'videos');

-- create policy "Allow all reads from videos bucket"
--   on storage.objects for select
--   using (bucket_id = 'videos');

-- create policy "Allow all updates to videos bucket"
--   on storage.objects for update
--   using (bucket_id = 'videos');

-- create policy "Allow all deletes from videos bucket"
--   on storage.objects for delete
--   using (bucket_id = 'videos');
