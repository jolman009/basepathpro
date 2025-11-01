import React, { useState } from 'react';
import { useAthletes } from '../hooks/useAthletes';
import AddAthleteModal from '../components/AddAthleteModal';

export default function AthletesScreen() {
  const { athletes, setAthletes } = useAthletes();
  const [showModal, setShowModal] = useState(false);

  function handleCreate(newAthlete: any) {
    // Prepend the new athlete to the list
    setAthletes((prev) => [newAthlete, ...prev]);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300">
          Athletes
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Athlete
        </button>
      </div>

      {athletes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No athletes yet.</p>
      ) : (
        <ul className="space-y-3">
          {athletes.map((ath) => (
            <li
              key={ath.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="font-semibold">{ath.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {ath.position || 'No position'} &nbsp;|&nbsp; {ath.notes || 'No notes'}
              </div>
            </li>
          ))}
        </ul>
      )}

      <AddAthleteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </main>
  );
}
