
/* -------------------- App Root with Routes -------------------- */
/* -------------------- App Root with Routes -------------------- */
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
  const state = location.state;
  const background = state && state.background;
  
  
  return (
  <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-white">
  <TopNav />
  <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10">Loading…</div>}>
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
  <Route path="/videos/:id" element={<VideoPreviewModal />} />
  </Routes>
  )}
  </Suspense>
  <MobileNav />
  </div>
  );
  }