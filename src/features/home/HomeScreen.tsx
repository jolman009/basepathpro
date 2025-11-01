import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Welcome to SwingIQ</h1>
      <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
        Upload, analyze, and track softball training sessions with video tools, athlete profiles, and performance analytics.
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/athletes')}
          className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          View Athletes
        </button>
        <button
          onClick={() => navigate('/videos')}
          className="px-5 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Video Library
        </button>
        <button
          onClick={() => navigate('/analyze')}
          className="px-5 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          Analyze Swings
        </button>
      </div>
    </div>
  );
}