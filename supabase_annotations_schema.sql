-- Annotations table for storing video annotations
-- Run this in your Supabase SQL editor to create the table

create table if not exists annotations (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references videos(id) on delete cascade,
  type text not null check (type in ('line', 'angle', 'rect')),
  points jsonb not null,
  timestamp float not null,
  color text not null default '#3B82F6',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faster queries by video_id
create index if not exists idx_annotations_video_id on annotations(video_id);

-- Enable Row Level Security (optional but recommended)
alter table annotations enable row level security;

-- Policy to allow all operations (adjust based on your auth requirements)
create policy "Allow all operations on annotations"
  on annotations
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

-- Trigger to call the function
create trigger update_annotations_updated_at
  before update on annotations
  for each row
  execute function update_updated_at_column();
