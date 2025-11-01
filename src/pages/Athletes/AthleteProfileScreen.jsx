
/* --------- New: Athlete Profile & Video Detail (subpage routes) --------- */
function AthleteProfileScreen() {
    const { id } = useParams();
    const proper = (id || "").split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    const athlete = {
      id,
      name: proper,
      position: "SS • 14U",
      handed: "R/R",
      notes: "Focus on hip-shoulder separation; tee work inside-out.",
      kpis: [
        { label: "Bat Speed", value: "56 mph", delta: "+7%" },
        { label: "Attack Angle", value: "11°", delta: "+2°" },
        { label: "Hard-Hit%", value: "41%", delta: "+5%" },
      ],
      timeline: [
        { date: "Oct 25", title: "Lesson #5", desc: "Front toss + offset tee. Drilled posture." },
        { date: "Oct 20", title: "Lesson #4", desc: "Sequencing. Early connection." },
        { date: "Oct 13", title: "Game Film", desc: "2–3 with 2B. Late on inside heat." },
      ],
      gallery: ["vid-1", "vid-3", "vid-6"],
    };
    const navigate = useNavigate();
  
    return (
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300">{athlete.name}</h1>
            <div className="text-gray-600 dark:text-gray-300">{athlete.position} • {athlete.handed}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => navigate(-1)}>Back</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">New Session</Button>
          </div>
        </div>
  
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {athlete.kpis.map((k) => (
            <Card key={k.label} className="rounded-2xl shadow">
              <CardContent className="p-5">
                <div className="text-sm text-gray-500 mb-1">{k.label}</div>
                <div className="text-2xl font-bold">{k.value}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{k.delta} vs last month</div>
              </CardContent>
            </Card>
          ))}
        </div>
  
        {/* Timeline */}
        <div className="rounded-2xl border border-black/5 dark:border-white/10 p-5 mb-6 bg-white/70 dark:bg-white/5">
          <h2 className="font-semibold mb-3">Session Timeline</h2>
          <ul className="space-y-2">
            {athlete.timeline.map((t, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                <div>
                  <div className="text-sm font-medium">{t.date} — {t.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
  
        {/* Gallery */}
        <div className="rounded-2xl border border-black/5 dark:border-white/10 p-5 bg-white/70 dark:bg-white/5">
          <h2 className="font-semibold mb-3">Video Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {athlete.gallery.map((vid) => (
              <button key={vid} onClick={() => navigate(`/videos/${vid}`)} className="aspect-video rounded-xl bg-gradient-to-br from-blue-200/40 to-blue-300/30 dark:from-white/10 dark:to-white/5 flex items-center justify-center border border-black/5 dark:border-white/10 hover:shadow">
                <Play className="h-8 w-8" />
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }