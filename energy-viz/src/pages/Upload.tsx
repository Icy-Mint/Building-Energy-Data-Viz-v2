import { useState } from 'react';
import Papa from 'papaparse';
import { Link, useNavigate } from 'react-router-dom';

export type ParsedDataset = {
  columns: string[];
  rows: Record<string, string | number>[];
};

export default function Upload() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Please upload a CSV file.');
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as Record<string, string | number>[];
        const columns = results.meta.fields ?? Object.keys(data[0] ?? {});
        const dataset: ParsedDataset = { columns, rows: data };
        sessionStorage.setItem('dataset', JSON.stringify(dataset));
        navigate('/dashboard');
      },
      error: (err) => setErrorMessage(err.message),
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4">
          <Link to="/" className="text-blue-600 hover:underline">← Back</Link>
        </div>
        <h1 className="text-2xl font-semibold mb-6">Upload Data</h1>
        <label className="block">
          <span className="sr-only">Choose CSV file</span>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => handleFiles(e.target.files)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
        {errorMessage && (
          <div className="mt-4 text-red-600">{errorMessage}</div>
        )}
        <p className="mt-6 text-sm text-gray-600">Expected CSV format with headers. Example columns: time, end_use, value, unit.</p>
      </div>
    </div>
  );
}


