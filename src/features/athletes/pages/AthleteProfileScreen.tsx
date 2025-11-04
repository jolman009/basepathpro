import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, TrendingUp, Activity, Video, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../../lib/supabase';
import { fetchAthleteSessions, getMetricValue, type Session } from '../services/sessions.service';

interface Athlete {
  id: string;
  name: string;
  position?: string;
  notes?: string;
}

export default function AthleteProfileScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load athlete and sessions
  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        // Fetch athlete
        if (supabase) {
          const { data: athleteData, error: athleteError } = await supabase
            .from('athletes')
            .select('*')
            .eq('id', id)
            .single();

          if (athleteError) throw athleteError;
          setAthlete(athleteData);
        }

        // Fetch sessions
        const sessionsData = await fetchAthleteSessions(id);
        setSessions(sessionsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load athlete profile');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Determine primary position type
  const positionType = athlete?.position?.toLowerCase().includes('pitch') ? 'pitching' : 'batting';

  // Prepare chart data
  const chartData = sessions
    .filter(s => s.session_type === positionType)
    .map(session => {
      const date = new Date(session.session_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      if (positionType === 'batting') {
        return {
          date,
          'Bat Speed': getMetricValue(session.metrics, 'bat_speed'),
          'Launch Angle': getMetricValue(session.metrics, 'launch_angle')
        };
      } else {
        return {
          date,
          'Pitch Velocity': getMetricValue(session.metrics, 'pitch_velocity'),
          'Control Rating': getMetricValue(session.metrics, 'control_rating')
        };
      }
    })
    .reverse(); // Oldest first for chart

  // Calculate stats
  const recentSessions = sessions.slice(0, 5);
  const avgBatSpeed = recentSessions
    .map(s => getMetricValue(s.metrics, 'bat_speed'))
    .filter((v): v is number => v !== null)
    .reduce((sum, v, _, arr) => sum + v / arr.length, 0);

  const avgLaunchAngle = recentSessions
    .map(s => getMetricValue(s.metrics, 'launch_angle'))
    .filter((v): v is number => v !== null)
    .reduce((sum, v, _, arr) => sum + v / arr.length, 0);

  const avgPitchVelocity = recentSessions
    .map(s => getMetricValue(s.metrics, 'pitch_velocity'))
    .filter((v): v is number => v !== null)
    .reduce((sum, v, _, arr) => sum + v / arr.length, 0);

  const avgControlRating = recentSessions
    .map(s => getMetricValue(s.metrics, 'control_rating'))
    .filter((v): v is number => v !== null)
    .reduce((sum, v, _, arr) => sum + v / arr.length, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !athlete) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          {error || 'Athlete not found'}
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/athletes')}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300">
            {athlete.name}
          </h1>
          {athlete.position && (
            <p className="text-gray-600 dark:text-gray-400">{athlete.position}</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {positionType === 'batting' ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Avg Bat Speed</span>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {avgBatSpeed ? `${avgBatSpeed.toFixed(1)} mph` : 'N/A'}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <Activity className="h-4 w-4" />
                <span className="text-sm">Avg Launch Angle</span>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {avgLaunchAngle ? `${avgLaunchAngle.toFixed(1)}°` : 'N/A'}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Avg Pitch Velocity</span>
              </div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {avgPitchVelocity ? `${avgPitchVelocity.toFixed(1)} mph` : 'N/A'}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <Activity className="h-4 w-4" />
                <span className="text-sm">Avg Control</span>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {avgControlRating ? `${avgControlRating.toFixed(1)}/10` : 'N/A'}
              </p>
            </div>
          </>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Video className="h-4 w-4" />
            <span className="text-sm">Total Sessions</span>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {sessions.length}
          </p>
        </div>
      </div>

      {/* Performance Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Performance Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {positionType === 'batting' ? (
                <>
                  <Line type="monotone" dataKey="Bat Speed" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Launch Angle" stroke="#10B981" strokeWidth={2} />
                </>
              ) : (
                <>
                  <Line type="monotone" dataKey="Pitch Velocity" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="Control Rating" stroke="#10B981" strokeWidth={2} />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Session History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Session History</h2>
          <button
            onClick={() => navigate('/videos')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Session</span>
          </button>
        </div>

        {sessions.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No sessions recorded yet. Upload a video to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <div
                key={session.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mb-2">
                      {session.session_type}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(session.session_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {session.video_id && (
                    <button
                      onClick={() => navigate(`/videos/${session.video_id}`)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm"
                    >
                      View Video →
                    </button>
                  )}
                </div>

                {session.metrics && session.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-3">
                    {session.metrics.map((metric, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{metric.metric_name.replace('_', ' ')}: </span>
                        <span className="font-semibold">
                          {metric.metric_value} {metric.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {session.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{session.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
