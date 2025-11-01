import React from 'react';

export default function AthleteCard({ name }: { name: string }) {
  return <div className="p-2 border rounded">{name}</div>;
}
