import { supabase } from '../../../lib/supabase';
import type { Annotation } from '../components/VideoAnnotationCanvas';

interface AnnotationRow {
  id: string;
  video_id: string;
  type: 'line' | 'angle' | 'rect';
  points: any;
  timestamp: number;
  color: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all annotations for a specific video
 */
export async function fetchAnnotations(videoId: string): Promise<Annotation[]> {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }

  const { data, error } = await supabase
    .from('annotations')
    .select('*')
    .eq('video_id', videoId)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('fetchAnnotations error', error);
    throw new Error(`Failed to fetch annotations: ${error.message}`);
  }

  // Transform database rows to Annotation format
  return (data || []).map((row: AnnotationRow) => ({
    type: row.type,
    points: row.points,
    timestamp: row.timestamp,
    color: row.color
  }));
}

/**
 * Save annotations for a video
 * This will delete existing annotations and insert new ones (upsert approach)
 */
export async function saveAnnotations(
  videoId: string,
  annotations: Annotation[]
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  // Start a transaction-like operation
  // First, delete all existing annotations for this video
  const { error: deleteError } = await supabase
    .from('annotations')
    .delete()
    .eq('video_id', videoId);

  if (deleteError) {
    console.error('saveAnnotations delete error', deleteError);
    throw new Error(`Failed to delete old annotations: ${deleteError.message}`);
  }

  // If there are no annotations to save, we're done
  if (annotations.length === 0) {
    return;
  }

  // Transform annotations to database format
  const rows = annotations.map(annotation => ({
    video_id: videoId,
    type: annotation.type,
    points: annotation.points,
    timestamp: annotation.timestamp,
    color: annotation.color
  }));

  // Insert new annotations
  const { error: insertError } = await supabase
    .from('annotations')
    .insert(rows);

  if (insertError) {
    console.error('saveAnnotations insert error', insertError);
    throw new Error(`Failed to save annotations: ${insertError.message}`);
  }
}

/**
 * Delete all annotations for a video
 */
export async function deleteAnnotations(videoId: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { error } = await supabase
    .from('annotations')
    .delete()
    .eq('video_id', videoId);

  if (error) {
    console.error('deleteAnnotations error', error);
    throw new Error(`Failed to delete annotations: ${error.message}`);
  }
}
