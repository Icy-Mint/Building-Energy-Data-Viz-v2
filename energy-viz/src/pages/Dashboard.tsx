import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Dataset = {
  columns: string[];
  rows: Record<string, string | number>[];
};

type ChartRow = { time: string | number; value: number; series?: string };

export default function Dashboard() {
  const [dataset, setDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('dataset');
    if (saved) {
      try { setDataset(JSON.parse(saved)); } catch {}
    }
  }, []);

  const chartData = useMemo<ChartRow[]>(() => {
    if (!dataset) return [];
    const hasEndUse = dataset.columns.includes('end_use');
    const timeKey = dataset.columns.find(c => c.toLowerCase().includes('time')) ?? dataset.columns[0];
    const valueKey = dataset.columns.find(c => c.toLowerCase().includes('value')) ?? dataset.columns[1];
    return dataset.rows
      .filter(r => typeof r[valueKey] === 'number')
      .map(r => ({ time: (r[timeKey] as any) ?? '', value: Number(r[valueKey]), series: hasEndUse ? String(r['end_use'] ?? '') : undefined }));
  }, [dataset]);

  const seriesList = useMemo(() => Array.from(new Set(chartData.map(d => d.series ?? 'Total'))), [chartData]);

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
            <div className="bg-white shadow rounded p-4">
              <h2 className="font-semibold mb-2">Time Series</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {seriesList.map((s, idx) => (
                      <Line key={s} type="monotone" dataKey="value" name={s} data={chartData.filter(d => (d.series ?? 'Total') === s)} stroke={COLORS[idx % COLORS.length]} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white shadow rounded p-4">
              <h2 className="font-semibold mb-2">Preview Table</h2>
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
                      <tr key={i} className="border-b last:border-0">
                        {dataset.columns.map(c => (
                          <td key={c} className="py-1 pr-4 whitespace-nowrap">{String(row[c] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const COLORS = [
  '#2563eb', '#16a34a', '#dc2626', '#a855f7', '#f59e0b', '#0ea5e9', '#22c55e'
];


