import React, { useEffect, useState } from 'react';
import { Trophy, TrendingUp, Users, Filter, Award, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../../../lib/supabase';
import { fetchAthleteSessions, getMetricValue, type Session } from '../../athletes/services/sessions.service';
import { useNavigate } from 'react-router-dom';

interface AthleteStats {
  id: string;
  name: string;
  position: string;
  avgBatSpeed: number | null;
  avgLaunchAngle: number | null;
  avgPitchVelocity: number | null;
  avgControlRating: number | null;
  totalSessions: number;
}

export default function AnalyticsScreen() {
  const navigate = useNavigate();
  const [athletesStats, setAthletesStats] = useState<AthleteStats[]>([]);
  const [filter, setFilter] = useState<'all' | 'batting' | 'pitching'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all athletes
        const { data: athletes } = await supabase
          .from('athletes')
          .select('*')
          .order('name');

        if (!athletes) {
          setLoading(false);
          return;
        }

        // Fetch sessions for each athlete
        const statsPromises = athletes.map(async (athlete) => {
          const sessions = await fetchAthleteSessions(athlete.id);

          // Calculate averages
          const metrics = {
            batSpeed: [] as number[],
            launchAngle: [] as number[],
            pitchVelocity: [] as number[],
            controlRating: [] as number[]
          };

          sessions.forEach(session => {
            const bs = getMetricValue(session.metrics, 'bat_speed');
            const la = getMetricValue(session.metrics, 'launch_angle');
            const pv = getMetricValue(session.metrics, 'pitch_velocity');
            const cr = getMetricValue(session.metrics, 'control_rating');

            if (bs) metrics.batSpeed.push(bs);
            if (la) metrics.launchAngle.push(la);
            if (pv) metrics.pitchVelocity.push(pv);
            if (cr) metrics.controlRating.push(cr);
          });

          const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b) / arr.length : null;

          return {
            id: athlete.id,
            name: athlete.name,
            position: athlete.position || 'N/A',
            avgBatSpeed: avg(metrics.batSpeed),
            avgLaunchAngle: avg(metrics.launchAngle),
            avgPitchVelocity: avg(metrics.pitchVelocity),
            avgControlRating: avg(metrics.controlRating),
            totalSessions: sessions.length
          };
        });

        const stats = await Promise.all(statsPromises);
        setAthletesStats(stats);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  // Filter athletes by position type
  const filteredAthletes = athletesStats.filter(athlete => {
    if (filter === 'all') return true;
    const isPitcher = athlete.position.toLowerCase().includes('pitch');
    return filter === 'pitching' ? isPitcher : !isPitcher;
  });

  // Top performers
  const topBatSpeed = [...filteredAthletes]
    .filter(a => a.avgBatSpeed !== null)
    .sort((a, b) => (b.avgBatSpeed || 0) - (a.avgBatSpeed || 0))
    .slice(0, 5);

  const topLaunchAngle = [...filteredAthletes]
    .filter(a => a.avgLaunchAngle !== null)
    .sort((a, b) => (b.avgLaunchAngle || 0) - (a.avgLaunchAngle || 0))
    .slice(0, 5);

  const topPitchVelocity = [...filteredAthletes]
    .filter(a => a.avgPitchVelocity !== null)
    .sort((a, b) => (b.avgPitchVelocity || 0) - (a.avgPitchVelocity || 0))
    .slice(0, 5);

  const topControl = [...filteredAthletes]
    .filter(a => a.avgControlRating !== null)
    .sort((a, b) => (b.avgControlRating || 0) - (a.avgControlRating || 0))
    .slice(0, 5);

  // Chart data
  const chartData = filteredAthletes
    .filter(a => a.totalSessions > 0)
    .slice(0, 10)
    .map(a => ({
      name: a.name.split(' ')[0], // First name only
      'Bat Speed': a.avgBatSpeed || 0,
      'Pitch Velocity': a.avgPitchVelocity || 0,
      Sessions: a.totalSessions
    }));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-2">
          Team Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Compare performance across all athletes and identify top performers
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <span className="font-semibold">Filter:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('batting')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'batting'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Batters
          </button>
          <button
            onClick={() => setFilter('pitching')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pitching'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Pitchers
          </button>
        </div>
      </div>

      {/* Team Overview Chart */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Team Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Bat Speed" fill="#3B82F6" />
              <Bar dataKey="Pitch Velocity" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Bat Speed Leaderboard */}
        {filter !== 'pitching' && topBatSpeed.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h3 className="text-lg font-bold">Top Bat Speed</h3>
            </div>
            <div className="space-y-3">
              {topBatSpeed.map((athlete, idx) => (
                <button
                  key={athlete.id}
                  onClick={() => navigate(`/athletes/${athlete.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    idx === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                    idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{athlete.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{athlete.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      {athlete.avgBatSpeed?.toFixed(1)} mph
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {athlete.totalSessions} sessions
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Launch Angle Leaderboard */}
        {filter !== 'pitching' && topLaunchAngle.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-bold">Top Launch Angle</h3>
            </div>
            <div className="space-y-3">
              {topLaunchAngle.map((athlete, idx) => (
                <button
                  key={athlete.id}
                  onClick={() => navigate(`/athletes/${athlete.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    idx === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                    idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{athlete.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{athlete.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 dark:text-green-400">
                      {athlete.avgLaunchAngle?.toFixed(1)}°
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {athlete.totalSessions} sessions
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pitch Velocity Leaderboard */}
        {filter !== 'batting' && topPitchVelocity.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-bold">Top Pitch Velocity</h3>
            </div>
            <div className="space-y-3">
              {topPitchVelocity.map((athlete, idx) => (
                <button
                  key={athlete.id}
                  onClick={() => navigate(`/athletes/${athlete.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    idx === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                    idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{athlete.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{athlete.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      {athlete.avgPitchVelocity?.toFixed(1)} mph
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {athlete.totalSessions} sessions
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Control Rating Leaderboard */}
        {filter !== 'batting' && topControl.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-bold">Top Control Rating</h3>
            </div>
            <div className="space-y-3">
              {topControl.map((athlete, idx) => (
                <button
                  key={athlete.id}
                  onClick={() => navigate(`/athletes/${athlete.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    idx === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                    idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{athlete.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{athlete.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600 dark:text-purple-400">
                      {athlete.avgControlRating?.toFixed(1)}/10
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {athlete.totalSessions} sessions
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredAthletes.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-lg">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Data Available</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start tracking performance by adding athletes and recording sessions.
          </p>
          <button
            onClick={() => navigate('/athletes')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Athletes
          </button>
        </div>
      )}
    </main>
  );
}
