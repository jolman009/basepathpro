import { useState, useEffect } from 'react';
import { fetchAthletes } from '../services/athletes.service';

export function useAthletes() {
  const [athletes, setAthletes] = useState<any[]>([]);

  useEffect(() => {
    fetchAthletes().then(setAthletes).catch(console.error);
  }, []);

  return { athletes, setAthletes };
}
