// src/features/videos/services/videos.service.ts
import { supabase } from '../../../lib/supabase';

// Fetch all videos (metadata)
export async function fetchVideos() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('videos')
    .select('id, name, url, created_at, tags')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('fetchVideos error', error);
    return [];
  }
  return data ?? [];
}

// Upload a video file and insert metadata
export async function uploadVideo(file: File) {
  if (!supabase) return null;
  const bucket = 'videos';
  const path = `${Date.now()}-${file.name}`;

  // Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false });
  if (uploadError) {
    console.error('uploadVideo upload error', uploadError);
    return null;
  }

  // Get a public URL
  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
  const url = pub?.publicUrl;

  // Insert row in database
  const { data, error: insertError } = await supabase
    .from('videos')
    .insert({ name: file.name, url })
    .select()
    .single();
  if (insertError) {
    console.error('uploadVideo insert error', insertError);
    return null;
  }

  return data;
}