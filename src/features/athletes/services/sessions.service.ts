import { supabase } from '../../../lib/supabase';

export interface Metric {
  metric_name: string;
  metric_value: number;
  unit: string;
}

export interface Session {
  id: string;
  athlete_id: string;
  video_id?: string | null;
  session_date: string;
  session_type: 'batting' | 'pitching' | 'fielding';
  notes?: string;
  created_at: string;
  updated_at: string;
  metrics?: Metric[];
}

export interface CreateSessionInput {
  athlete_id: string;
  video_id?: string | null;
  session_type: 'batting' | 'pitching' | 'fielding';
  notes?: string;
  metrics?: Omit<Metric, 'id' | 'session_id' | 'created_at'>[];
}

/**
 * Fetch all sessions for a specific athlete
 */
export async function fetchAthleteSessions(athleteId: string): Promise<Session[]> {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return [];
  }

  // Fetch sessions
  const { data: sessions, error: sessionsError } = await supabase
    .from('sessions')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('session_date', { ascending: false });

  if (sessionsError) {
    console.error('fetchAthleteSessions error', sessionsError);
    throw new Error(`Failed to fetch sessions: ${sessionsError.message}`);
  }

  if (!sessions || sessions.length === 0) {
    return [];
  }

  // Fetch metrics for all sessions
  const sessionIds = sessions.map(s => s.id);
  const { data: metrics, error: metricsError } = await supabase
    .from('metrics')
    .select('*')
    .in('session_id', sessionIds);

  if (metricsError) {
    console.error('fetchMetrics error', metricsError);
    // Continue without metrics if there's an error
  }

  // Group metrics by session_id
  const metricsBySession = (metrics || []).reduce((acc: Record<string, Metric[]>, metric: any) => {
    if (!acc[metric.session_id]) {
      acc[metric.session_id] = [];
    }
    acc[metric.session_id].push({
      metric_name: metric.metric_name,
      metric_value: metric.metric_value,
      unit: metric.unit
    });
    return acc;
  }, {});

  // Combine sessions with their metrics
  return sessions.map(session => ({
    ...session,
    metrics: metricsBySession[session.id] || []
  }));
}

/**
 * Create a new session with metrics
 */
export async function createSession(input: CreateSessionInput): Promise<Session> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  // Create session
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      athlete_id: input.athlete_id,
      video_id: input.video_id,
      session_type: input.session_type,
      notes: input.notes
    })
    .select()
    .single();

  if (sessionError) {
    console.error('createSession error', sessionError);
    throw new Error(`Failed to create session: ${sessionError.message}`);
  }

  // If metrics provided, insert them
  if (input.metrics && input.metrics.length > 0) {
    const metricsToInsert = input.metrics.map(m => ({
      session_id: session.id,
      ...m
    }));

    const { error: metricsError } = await supabase
      .from('metrics')
      .insert(metricsToInsert);

    if (metricsError) {
      console.error('insertMetrics error', metricsError);
      throw new Error(`Failed to insert metrics: ${metricsError.message}`);
    }
  }

  // Return session with metrics
  return {
    ...session,
    metrics: input.metrics || []
  };
}

/**
 * Update session metrics
 */
export async function updateSessionMetrics(
  sessionId: string,
  metrics: Omit<Metric, 'id' | 'session_id' | 'created_at'>[]
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  // Delete existing metrics
  const { error: deleteError } = await supabase
    .from('metrics')
    .delete()
    .eq('session_id', sessionId);

  if (deleteError) {
    console.error('deleteMetrics error', deleteError);
    throw new Error(`Failed to delete old metrics: ${deleteError.message}`);
  }

  // Insert new metrics
  if (metrics.length > 0) {
    const metricsToInsert = metrics.map(m => ({
      session_id: sessionId,
      ...m
    }));

    const { error: insertError } = await supabase
      .from('metrics')
      .insert(metricsToInsert);

    if (insertError) {
      console.error('insertMetrics error', insertError);
      throw new Error(`Failed to insert metrics: ${insertError.message}`);
    }
  }
}

/**
 * Delete a session (metrics will cascade delete)
 */
export async function deleteSession(sessionId: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized');
  }

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('deleteSession error', error);
    throw new Error(`Failed to delete session: ${error.message}`);
  }
}

/**
 * Get metric value from session metrics array
 */
export function getMetricValue(metrics: Metric[] | undefined, metricName: string): number | null {
  if (!metrics) return null;
  const metric = metrics.find(m => m.metric_name === metricName);
  return metric ? metric.metric_value : null;
}
