import { useState, useEffect } from 'react';

export function useAthletes() {
  const [athletes, setAthletes] = useState<string[]>([]);
  useEffect(() => {
    setAthletes(['Athlete 1', 'Athlete 2']);
  }, []);
  return { athletes };
}
