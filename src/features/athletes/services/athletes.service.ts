import { supabase } from '../../../lib/supabase';

/** Fetch all athletes, ordered by last updated */
export async function fetchAthletes() {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }
  const { data, error } = await supabase
    .from('athletes')
    .select('id, name, position, notes, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('fetchAthletes error', error);
    return [];
  }
  return data ?? [];
}

/** Insert a new athlete (optional helper) */
export async function createAthlete({
  name,
  position = '',
  notes = '',
}: {
  name: string;
  position?: string;
  notes?: string;
}) {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  const { data, error } = await supabase
    .from('athletes')
    .insert({ name, position, notes })
    .select()
    .single();

  if (error) {
    console.error('createAthlete error', error);
    throw new Error(`Failed to create athlete: ${error.message}`);
  }
  return data;
}
