import { useState, useEffect, useCallback } from 'react';
import { fetchAthletes, createAthlete } from '../services/athletes.service';

export function useAthletes() {
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchAthletes();
      setAthletes(list);
      setError(null);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load athletes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addAthlete = useCallback(async (payload: { name: string; position?: string; notes?: string }) => {
    try {
      const created = await createAthlete(payload);
      setAthletes(prev => [created, ...prev]);
      return created;
    } catch (e: any) {
      setError(e.message ?? 'Failed to create athlete');
      throw e;
    }
  }, []);

  return { athletes, loading, error, refresh, addAthlete };
}
