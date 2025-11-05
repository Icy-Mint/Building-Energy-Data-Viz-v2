import { Link } from 'react-router-dom';
import EnergyDashboard from '../components/EnergyDashboard';

export default function Dashboard() {
  const hasData = sessionStorage.getItem('iesveCsvData');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/upload" className="text-blue-600 hover:underline">← Upload another file</Link>
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        </div>
        
        {!hasData && (
          <div className="text-gray-600">No data loaded. Go to Upload and add a CSV.</div>
        )}
        
        {hasData && <EnergyDashboard />}
      </div>
    </div>
  );
}

