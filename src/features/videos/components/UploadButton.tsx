import React from 'react';

export default function UploadButton({ onUpload }: { onUpload?: (file: File) => void }) {
  return (
    <label className="inline-block p-2 bg-blue-600 text-white rounded cursor-pointer">
      Upload
      <input
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload?.(file);
        }}
      />
    </label>
  );
}
