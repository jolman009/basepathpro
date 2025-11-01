import { supabase } from '../../../lib/supabase';

export async function fetchAthletes() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('athletes')
    .select('id, name, position, notes, updated_at')
    .order('updated_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function createAthlete({ name, position, notes }: { name: string; position: string; notes: string }) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('athletes')
    .insert({ name, position, notes })
    .select()
    .single();
  if (error) { console.error(error); return null; }
  return data;
}
