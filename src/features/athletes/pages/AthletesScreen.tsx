import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAthletes } from '../hooks/useAthletes';
import AddAthleteModal from '../components/AddAthleteModal';
import { ChevronRight } from 'lucide-react';

export default function AthletesScreen() {
  const { athletes, loading, error, addAthlete } = useAthletes();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : athletes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No athletes yet.</p>
      ) : (
        <ul className="space-y-3">
          {athletes.map((ath) => (
            <li key={ath.id}>
              <button
                onClick={() => navigate(`/athletes/${ath.id}`)}
                className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{ath.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {ath.position || 'No position'} &nbsp;|&nbsp; {ath.notes || 'No notes'}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AddAthleteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreate={async (payload) => {
          await addAthlete(payload);
        }}
      />
    </main>
  );
}
