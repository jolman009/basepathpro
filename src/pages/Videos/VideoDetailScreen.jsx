
function VideoDetailScreen() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toolbar = ["Draw", "Angle", "Slow-Mo", "Compare", "Snapshot", "Export"];
  
    return (
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300">Video Detail</h1>
            <div className="text-gray-600 dark:text-gray-300">ID: {id}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate(-1)}>Back</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">Analyze</Button>
          </div>
        </div>
  
        <div className="rounded-2xl overflow-hidden border border-black/5 dark:border-white/10">
          <div className="aspect-video bg-black/90 flex items-center justify-center text-white">Video Player (placeholder)</div>
        </div>
  
        <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-2">
          {toolbar.map((t) => (
            <Button key={t} variant={t === "Draw" ? "default" : "outline"} className="rounded-xl">{t}</Button>
          ))}
        </div>
  
        <div className="mt-6 rounded-2xl border border-black/5 dark:border-white/10 p-5 bg-white/70 dark:bg-white/5">
          <h2 className="font-semibold mb-2">Frame Timeline (placeholder)</h2>
          <div className="h-20 rounded-xl bg-gradient-to-r from-blue-200/40 to-blue-300/30 dark:from-white/10 dark:to-white/5" />
        </div>
      </main>
    );
  }
  