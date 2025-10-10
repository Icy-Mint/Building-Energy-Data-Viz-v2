import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Dataset = {
  columns: string[];
  rows: Record<string, string | number>[];
};

export default function Dashboard() {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [futureDataset, setFutureDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('dataset');
    if (saved) {
      try { setDataset(JSON.parse(saved)); } catch {}
    }
    
    const futureSaved = sessionStorage.getItem('futureDataset');
    if (futureSaved) {
      try { setFutureDataset(JSON.parse(futureSaved)); } catch {}
    }
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/upload" className="text-blue-600 hover:underline">← Upload another file</Link>
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        </div>
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        
        {!dataset && (
          <div className="text-gray-600">No data loaded. Go to Upload and add a CSV.</div>
        )}
        
        {dataset && (
          <div className="space-y-8">
            {/* Current Data Preview */}
            <div className="bg-white shadow rounded p-4">
              <h2 className="font-semibold mb-2">Current Energy Data Preview</h2>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      {dataset.columns.map(c => (
                        <th key={c} className="py-2 pr-4 font-semibold">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.rows.slice(0, 50).map((row, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        {dataset.columns.map(c => (
                          <td key={c} className="py-1 pr-4 whitespace-nowrap">{String(row[c] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Future Data Preview */}
            {futureDataset && (
              <div className="bg-white shadow rounded p-4">
                <h2 className="font-semibold mb-2">Future Energy Data Preview</h2>
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        {futureDataset.columns.map(c => (
                          <th key={c} className="py-2 pr-4 font-semibold">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {futureDataset.rows.slice(0, 50).map((row, i) => (
                        <tr key={i} className="border-b last:border-b-0">
                          {futureDataset.columns.map(c => (
                            <td key={c} className="py-1 pr-4 whitespace-nowrap">{String(row[c] ?? '')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

