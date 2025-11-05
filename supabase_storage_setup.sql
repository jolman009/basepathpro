-- Storage bucket and policies for video files
-- Run this in your Supabase SQL editor AFTER creating the base schema

-- Create storage bucket for videos (if not exists)
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Enable RLS on storage.objects
alter table storage.objects enable row level security;

-- Storage policies for videos bucket (allow all operations for development)
create policy "Allow public uploads to videos bucket"
  on storage.objects for insert
  with check (bucket_id = 'videos');

create policy "Allow public reads from videos bucket"
  on storage.objects for select
  using (bucket_id = 'videos');

create policy "Allow public updates to videos bucket"
  on storage.objects for update
  using (bucket_id = 'videos');

create policy "Allow public deletes from videos bucket"
  on storage.objects for delete
  using (bucket_id = 'videos');
