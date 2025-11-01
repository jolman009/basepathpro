import React from 'react';

export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center p-8">
      <h3 className="text-lg font-semibold">{title}</h3>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
