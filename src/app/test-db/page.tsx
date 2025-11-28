'use client';
import { useEffect, useState } from 'react';

export default function TestDBPage() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    fetch('/api/test-db')
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => setStatus({ status: 'error', error: String(err) }));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <pre className="bg-gray-100 p-4 rounded text-black">{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
