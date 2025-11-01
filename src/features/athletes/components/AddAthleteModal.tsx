import React, { useState } from 'react';
import { createAthlete } from '../services/athletes.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate?: (athlete: any) => void; // pass created athlete back to parent
}

export default function AddAthleteModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    const athlete = await createAthlete({ name, position, notes });
    setLoading(false);
    if (athlete) {
      onCreate?.(athlete);
      setName(''); setPosition(''); setNotes('');
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Athlete</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            placeholder="Position (optional)"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            placeholder="Notes (optional)"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? 'Saving…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
