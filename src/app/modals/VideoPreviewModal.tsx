import React from 'react';

export default function VideoPreviewModal({ open }: { open: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-4 rounded">Video preview modal</div>
    </div>
  );
}
