-- Sessions table for tracking performance metrics per video
-- Run this in your Supabase SQL editor

-- Sessions table: links videos to athletes with performance metrics
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references athletes(id) on delete cascade,
  video_id uuid references videos(id) on delete set null,
  session_date timestamptz not null default now(),
  session_type text not null check (session_type in ('batting', 'pitching', 'fielding')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Metrics table: stores specific performance metrics for each session
create table if not exists metrics (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  metric_name text not null,
  metric_value float not null,
  unit text,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_sessions_athlete_id on sessions(athlete_id);
create index if not exists idx_sessions_video_id on sessions(video_id);
create index if not exists idx_sessions_date on sessions(session_date desc);
create index if not exists idx_metrics_session_id on metrics(session_id);
create index if not exists idx_metrics_name on metrics(metric_name);

-- Enable Row Level Security
alter table sessions enable row level security;
alter table metrics enable row level security;

-- Policies (adjust based on your auth requirements)
create policy "Allow all operations on sessions"
  on sessions
  for all
  using (true)
  with check (true);

create policy "Allow all operations on metrics"
  on metrics
  for all
  using (true)
  with check (true);

-- Function to update updated_at
create or replace function update_sessions_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger
create trigger update_sessions_updated_at_trigger
  before update on sessions
  for each row
  execute function update_sessions_updated_at();

-- Helper view for quick metric lookups (optional but useful)
create or replace view session_metrics_summary as
select
  s.id as session_id,
  s.athlete_id,
  s.video_id,
  s.session_date,
  s.session_type,
  s.notes,
  json_object_agg(m.metric_name, json_build_object(
    'value', m.metric_value,
    'unit', m.unit
  )) as metrics
from sessions s
left join metrics m on s.id = m.session_id
group by s.id, s.athlete_id, s.video_id, s.session_date, s.session_type, s.notes;

-- Sample data insertion (optional - for testing)
-- Uncomment to add test data:
/*
-- Add some test sessions
insert into sessions (athlete_id, session_type, session_date, notes)
select
  id,
  'batting',
  now() - interval '7 days',
  'Morning practice session'
from athletes limit 1;

-- Add metrics for the session
insert into metrics (session_id, metric_name, metric_value, unit)
select
  id,
  'bat_speed',
  72.5,
  'mph'
from sessions order by created_at desc limit 1;

insert into metrics (session_id, metric_name, metric_value, unit)
select
  id,
  'launch_angle',
  28.3,
  'degrees'
from sessions order by created_at desc limit 1;
*/
