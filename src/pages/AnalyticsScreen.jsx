
function AnalyticsScreen() {
    const cards = [
      { title: "Avg. Bat Speed", value: "54 mph", change: "+6%" },
      { title: "Sweet-Spot %", value: "38%", change: "+4%" },
      { title: "Sessions / Week", value: "3.2", change: "+1.0" },
    ];
    return (
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-4">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {cards.map((c) => (
            <Card key={c.title} className="rounded-2xl shadow">
              <CardContent className="p-5">
                <div className="text-sm text-gray-500 mb-1">{c.title}</div>
                <div className="text-2xl font-bold">{c.value}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{c.change} vs last month</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="rounded-2xl border border-black/5 dark:border-white/10 p-6 bg-white/70 dark:bg-white/5">
          <div className="h-48 w-full rounded-xl bg-gradient-to-r from-blue-200/40 to-blue-300/30 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-sm text-gray-500">
            (Chart placeholder)
          </div>
        </div>
      </main>
    );
  }
  