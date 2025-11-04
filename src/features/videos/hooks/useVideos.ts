import { useState, useEffect, useCallback } from 'react';
import { fetchVideos, uploadVideo } from '../services/videos.service';

export function useVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchVideos();
      setVideos(list);
      setError(null);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addVideo = useCallback(async (file: File) => {
    try {
      const created = await uploadVideo(file);
      setVideos(prev => [created, ...prev]);
      return created;
    } catch (e: any) {
      setError(e.message ?? 'Failed to upload video');
      throw e;
    }
  }, []);

  return { videos, loading, error, refresh, addVideo };
}
