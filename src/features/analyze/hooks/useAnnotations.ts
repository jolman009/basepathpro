import { useState } from 'react';

export function useAnnotations() {
  const [annotations, setAnnotations] = useState<any[]>([]);
  return { annotations, setAnnotations };
}
