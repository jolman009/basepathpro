import React from 'react';
import { useParams } from 'react-router-dom';

export default function VideoPreviewModal({ open }: { open?: boolean }) {
  const { id } = useParams();
  
  // If open prop is false, don't render
  if (open === false) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg max-w-4xl w-full m-4">
        <div>Video preview modal for video: {id}</div>
      </div>
    </div>
  );
}
