'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import EnergyDashboard from './EnergyDashboard';
import Chatbot from './Chatbot';

export default function Dashboard() {
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Check for data on client side
    if (typeof window !== 'undefined') {
      setHasData(!!sessionStorage.getItem('iesveCsvData'));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <Link href="/upload" className="text-blue-600 hover:underline">← Upload another file</Link>
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        </div>
        
        {!hasData && (
          <div className="text-gray-600">No data loaded. Go to Upload and add a CSV.</div>
        )}
        
        {hasData && <EnergyDashboard />}
      </div>
      {hasData && <Chatbot />}
    </div>
  );
}

