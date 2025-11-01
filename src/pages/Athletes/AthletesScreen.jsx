
function AthletesScreen() {
    const navigate = useNavigate();
    const sample = [
      { id: "ava-m", name: "Ava M.", position: "SS • 14U", notes: "Improved bat speed +6%", last: "Oct 20" },
      { id: "bella-r", name: "Bella R.", position: "P • 16U", notes: "Spin rate +120 rpm", last: "Oct 22" },
      { id: "cam-n", name: "Cam N.", position: "C • 12U", notes: "Pop time 2.1s → 1.9s", last: "Oct 25" },
    ];
    return (
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-4">Athletes</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sample.map((a) => (
            <Card key={a.id} className="rounded-2xl shadow hover:shadow-lg transition">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{a.name}</div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-300">{a.position}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{a.notes}</p>
                <div className="text-xs text-gray-500">Last session: {a.last}</div>
                <div className="mt-4 flex gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl" onClick={() => navigate(`/athletes/${a.id}`)}>Open Profile</Button>
                  <Button variant="outline" className="rounded-xl">New Note</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }