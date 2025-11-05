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
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }
  const bucket = 'videos';
  const path = `${Date.now()}-${file.name}`;

  // Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false });
  if (uploadError) {
    console.error('uploadVideo upload error', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // Get a public URL
  const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
  const url = pub?.publicUrl;

  // Get current user or use a default user_id
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || '00000000-0000-0000-0000-000000000000'; // fallback for demo

  // Insert row in database
  const { data, error: insertError } = await supabase
    .from('videos')
    .insert({ name: file.name, url, user_id: userId })
    .select()
    .single();
  if (insertError) {
    console.error('uploadVideo insert error', insertError);
    throw new Error(`Failed to save video metadata: ${insertError.message}`);
  }

  return data;
}