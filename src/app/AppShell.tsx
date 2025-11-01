import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StoreProvider from './providers/StoreProvider';
import TopNav from '../components/navigation/TopNav';
import MobileNav from '../components/navigation/MobileNav';
import HomeScreen from '../features/home/HomeScreen';
import AthletesScreen from '../features/athletes/pages/AthletesScreen';
import AthleteProfileScreen from '../features/athletes/pages/AthleteProfileScreen';
import VideosScreen from '../features/videos/pages/VideosScreen';
import VideoDetailScreen from '../features/videos/pages/VideoDetailScreen';
import AnalyticsScreen from '../features/analytics/pages/AnalyticsScreen';
import AnalyzeScreen from '../features/analyze/pages/AnalyzeScreen';
import VideoPreviewModal from './modals/VideoPreviewModal';

export default function SoftballCoachApp() {
  return (
    <Router>
      <StoreProvider>
        <AppShell />
      </StoreProvider>
    </Router>
  );
}

function AppShell() {
  const location = useLocation();
  const state = location.state as any;
  const background = state && state.background;

  return (
    <div className="min-h-screen text-gray-900 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-gray-950 dark:to-gray-900 dark:text-white">
      <TopNav />
      <Suspense fallback={<div className="max-w-6xl px-4 py-10 mx-auto">Loading…</div>}>
        <Routes location={background || location}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/athletes" element={<AthletesScreen />} />
          <Route path="/athletes/:id" element={<AthleteProfileScreen />} />
          <Route path="/videos" element={<VideosScreen />} />
          <Route path="/videos/:id" element={<VideoDetailScreen />} />
          <Route path="/analytics" element={<AnalyticsScreen />} />
          <Route path="/analyze" element={<AnalyzeScreen />} />
        </Routes>
        {background && (
          <Routes>
            <Route path="/videos/:id" element={<VideoPreviewModal open={true} />} />
          </Routes>
        )}
      </Suspense>
      <MobileNav />
    </div>
  );
}
