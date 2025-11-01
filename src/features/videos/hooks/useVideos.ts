import { useState } from 'react';

export function useVideos() {
  const [videos, setVideos] = useState<string[]>([]);
  return { videos, setVideos };
}
