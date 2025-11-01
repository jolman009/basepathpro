
/* -------------------- Screens -------------------- */
function HomeScreen() {
    return (
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
        {/* Hero */}
        <section className="mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 p-6 shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300">Coach Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Upload clips, annotate swings, and track athlete progress—all in one place.</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"><Upload className="h-4 w-4 mr-2" />Upload</Button>
                <Button variant="outline" className="rounded-xl border-blue-200 dark:border-white/10"><Camera className="h-4 w-4 mr-2" />Record</Button>
              </div>
            </div>
          </motion.div>
        </section>
  
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upload & Categorize */}
          <Card className="shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Upload size={40} className="text-blue-500 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Upload & Categorize Videos</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Store and organize swing, pitching, or fielding videos easily.</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full">Upload Video</Button>
            </CardContent>
          </Card>
  
          {/* Analyze Tools */}
          <Card className="shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <PenTool size={40} className="text-green-500 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Mark & Analyze</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Slow-mo, draw angles, and compare swings frame by frame.</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl w-full">Start Analysis</Button>
            </CardContent>
          </Card>
  
          {/* Athlete Management */}
          <Card className="shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <User size={40} className="text-purple-500 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Athlete Profiles</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Track progress, add notes, and view performance over time.</p>
              <NavLink to="/athletes" className="w-full"><Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl w-full">View Profiles</Button></NavLink>
            </CardContent>
          </Card>
  
          {/* Stats Dashboard */}
          <Card className="shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BarChart3 size={40} className="text-orange-500 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Performance Stats</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">View metrics and trends across all uploaded sessions.</p>
              <NavLink to="/analytics" className="w-full"><Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl w-full">Open Dashboard</Button></NavLink>
            </CardContent>
          </Card>
  
          {/* Record Live */}
          <Card className="shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Camera size={40} className="text-red-500 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Record Live</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Capture live swings during training sessions directly from the app.</p>
              <NavLink to="/analyze" className="w-full"><Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl w-full">Record Now</Button></NavLink>
            </CardContent>
          </Card>
  
          {/* Playbacks */}
          <Card className="shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Play size={40} className="text-yellow-500 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Playbacks & Reviews</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Revisit past sessions, add commentary, and share insights with players.</p>
              <NavLink to="/videos" className="w-full"><Button className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl w-full">View Sessions</Button></NavLink>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }