
function AnalyzeScreen() {
    return (
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-4">Mark & Analyze</h1>
        <div className="rounded-2xl border border-black/5 dark:border-white/10 p-6 bg-white/70 dark:bg-white/5">
          <div className="aspect-video rounded-xl bg-black/80 flex items-center justify-center text-white">Video Player + Annotation Canvas (placeholder)</div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button className="rounded-xl">Draw Line</Button>
            <Button className="rounded-xl" variant="outline">Angle</Button>
            <Button className="rounded-xl" variant="outline">Slow-Mo</Button>
            <Button className="rounded-xl" variant="outline">Compare</Button>
          </div>
        </div>
      </main>
    );
  }
  