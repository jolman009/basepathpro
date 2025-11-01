// src/features/videos/hooks/useVideos.ts
import { useState, useEffect } from 'react';
import { fetchVideos } from '../services/videos.service';

export function useVideos() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    fetchVideos().then(setVideos).catch(console.error);
  }, []);

  return { videos, setVideos };
}
