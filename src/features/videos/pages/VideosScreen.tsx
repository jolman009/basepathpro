import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideos } from '../hooks/useVideos';
import UploadButton from '../components/UploadButton';
import { Play } from 'lucide-react';

export default function VideosScreen() {
  const { videos, loading, error, addVideo } = useVideos();
  const navigate = useNavigate();

  async function handleUpload(file: File) {
    await addVideo(file);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-28 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-300">
          Videos
        </h1>
        <UploadButton onUpload={handleUpload} />
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
      ) : videos.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No videos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((v) => (
            <button
              key={v.id}
              onClick={() => navigate(`/videos/${v.id}`)}
              className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex items-center justify-center hover:shadow-lg transition-all"
            >
              {v.url ? (
                <video src={v.url} className="w-full h-full object-cover" />
              ) : (
                <Play className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
