
function VideosScreen() {
    const navigate = useNavigate();
    const thumbs = new Array(9).fill(0).map((_, i) => ({ id: `vid-${i + 1}` }));
    return (
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300">Videos</h1>
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"><Upload className="h-4 w-4 mr-2" />Upload</Button>
            <Button variant="outline" className="rounded-xl"><Camera className="h-4 w-4 mr-2" />Record</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {thumbs.map((t) => (
            <button key={t.id} onClick={() => navigate(`/videos/${t.id}`)} className="aspect-video rounded-xl overflow-hidden border border-black/5 dark:border-white/10 bg-gradient-to-br from-blue-200/50 to-blue-300/30 dark:from-white/10 dark:to-white/5 flex items-center justify-center hover:shadow">
              <Play className="h-10 w-10" />
            </button>
          ))}
        </div>
      </main>
    );
  }