import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Video,
  Users,
  TrendingUp,
  Activity,
  ArrowRight,
  Zap,
  Target,
  Award,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface QuickStats {
  totalAthletes: number;
  totalVideos: number;
  totalSessions: number;
  recentActivity: Array<{
    type: 'athlete' | 'video' | 'session';
    name: string;
    time: string;
  }>;
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<QuickStats>({
    totalAthletes: 0,
    totalVideos: 0,
    totalSessions: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  // Load quick stats
  useEffect(() => {
    async function loadStats() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Get counts
        const [athletesRes, videosRes, sessionsRes] = await Promise.all([
          supabase.from('athletes').select('*', { count: 'exact', head: true }),
          supabase.from('videos').select('*', { count: 'exact', head: true }),
          supabase.from('sessions').select('*', { count: 'exact', head: true })
        ]);

        // Get recent activity
        const { data: recentVideos } = await supabase
          .from('videos')
          .select('name, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        const activity = (recentVideos || []).map(v => ({
          type: 'video' as const,
          name: v.name,
          time: new Date(v.created_at).toLocaleDateString()
        }));

        setStats({
          totalAthletes: athletesRes.count || 0,
          totalVideos: videosRes.count || 0,
          totalSessions: sessionsRes.count || 0,
          recentActivity: activity
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-28 pt-6">
      {/* Hero Section with Gradient */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Welcome Back, Coach! 👋
            </h1>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl">
              Elevate your training with video analysis, performance tracking, and data-driven insights.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/videos')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Upload className="h-5 w-5" />
              Upload Video
            </button>
            <button
              onClick={() => navigate('/athletes')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-800/50 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-blue-800/70 transition-all border border-white/20"
            >
              <Users className="h-5 w-5" />
              Manage Athletes
            </button>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
      </motion.section>

      {/* Quick Stats */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalAthletes}</h3>
          <p className="text-gray-600 dark:text-gray-400">Total Athletes</p>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalVideos}</h3>
          <p className="text-gray-600 dark:text-gray-400">Videos Analyzed</p>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalSessions}</h3>
          <p className="text-gray-600 dark:text-gray-400">Training Sessions</p>
        </motion.div>
      </motion.div>

      {/* Action Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* Video Analysis Card */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl cursor-pointer"
          onClick={() => navigate('/videos')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Zap className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Video Analysis</h3>
          <p className="text-blue-100 mb-4">Frame-by-frame breakdown with annotation tools</p>
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <Clock className="h-4 w-4" />
            <span>Upload & analyze instantly</span>
          </div>
        </motion.div>

        {/* Performance Tracking */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl cursor-pointer"
          onClick={() => navigate('/athletes')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Target className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Performance Tracking</h3>
          <p className="text-green-100 mb-4">Monitor progress with detailed metrics & charts</p>
          <div className="flex items-center gap-2 text-sm text-green-100">
            <TrendingUp className="h-4 w-4" />
            <span>Track improvements over time</span>
          </div>
        </motion.div>

        {/* Team Analytics */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl cursor-pointer"
          onClick={() => navigate('/analytics')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Team Analytics</h3>
          <p className="text-purple-100 mb-4">Compare athletes and identify top performers</p>
          <div className="flex items-center gap-2 text-sm text-purple-100">
            <Users className="h-4 w-4" />
            <span>Leaderboards & insights</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Video className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
}