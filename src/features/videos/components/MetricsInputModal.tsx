import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface Athlete {
  id: string;
  name: string;
  position?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    athleteId: string;
    sessionType: 'batting' | 'pitching';
    metrics: { [key: string]: number };
    notes?: string;
  }) => Promise<void>;
  athletes: Athlete[];
}

export default function MetricsInputModal({ open, onClose, onSave, athletes }: Props) {
  const [athleteId, setAthleteId] = useState('');
  const [sessionType, setSessionType] = useState<'batting' | 'pitching'>('batting');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Batting metrics
  const [batSpeed, setBatSpeed] = useState('');
  const [launchAngle, setLaunchAngle] = useState('');

  // Pitching metrics
  const [pitchVelocity, setPitchVelocity] = useState('');
  const [controlRating, setControlRating] = useState('');

  // Auto-detect session type from athlete position
  useEffect(() => {
    if (athleteId && athletes.length > 0) {
      const athlete = athletes.find(a => a.id === athleteId);
      if (athlete?.position?.toLowerCase().includes('pitch')) {
        setSessionType('pitching');
      } else {
        setSessionType('batting');
      }
    }
  }, [athleteId, athletes]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setAthleteId('');
      setSessionType('batting');
      setNotes('');
      setBatSpeed('');
      setLaunchAngle('');
      setPitchVelocity('');
      setControlRating('');
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!athleteId) {
      setError('Please select an athlete');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const metrics: { [key: string]: number } = {};

      if (sessionType === 'batting') {
        if (batSpeed) metrics.bat_speed = parseFloat(batSpeed);
        if (launchAngle) metrics.launch_angle = parseFloat(launchAngle);
      } else {
        if (pitchVelocity) metrics.pitch_velocity = parseFloat(pitchVelocity);
        if (controlRating) metrics.control_rating = parseFloat(controlRating);
      }

      await onSave({
        athleteId,
        sessionType,
        metrics,
        notes: notes.trim() || undefined
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save metrics');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Add Session Metrics</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Athlete Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Athlete <span className="text-red-500">*</span>
            </label>
            <select
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select athlete...</option>
              {athletes.map(athlete => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name} {athlete.position ? `(${athlete.position})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Session Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Session Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="batting"
                  checked={sessionType === 'batting'}
                  onChange={(e) => setSessionType(e.target.value as 'batting')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Batting</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="pitching"
                  checked={sessionType === 'pitching'}
                  onChange={(e) => setSessionType(e.target.value as 'pitching')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Pitching</span>
              </label>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>

            {sessionType === 'batting' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bat Speed (mph)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={batSpeed}
                    onChange={(e) => setBatSpeed(e.target.value)}
                    placeholder="e.g., 72.5"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Launch Angle (degrees)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={launchAngle}
                    onChange={(e) => setLaunchAngle(e.target.value)}
                    placeholder="e.g., 28.3"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pitch Velocity (mph)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pitchVelocity}
                    onChange={(e) => setPitchVelocity(e.target.value)}
                    placeholder="e.g., 65.0"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Control Rating (1-10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={controlRating}
                    onChange={(e) => setControlRating(e.target.value)}
                    placeholder="e.g., 8.5"
                    className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any observations or comments about this session..."
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Metrics'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
