import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-emerald-50/40">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/80 backdrop-blur shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-gradient-animated">
              <Typewriter text="Automated decarbonization strategies for your building portfolios" speed={18} />
            </h1>
          </div>
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <Link className="px-3 py-2 rounded-md text-gray-700 hover:text-brand-dark hover:bg-emerald-50" to="/">Home</Link>
            <Link className="px-3 py-2 rounded-md text-gray-700 hover:text-brand-dark hover:bg-emerald-50" to="/upload">Import</Link>
            <Link className="px-3 py-2 rounded-md text-gray-700 hover:text-brand-dark hover:bg-emerald-50" to="/dashboard">Charts</Link>
          </nav>
          <div className="sm:hidden" />
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-brand to-accent opacity-20 blur-3xl animate-float-slow" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-tr from-emerald-300 to-teal-300 opacity-30 blur-3xl animate-float-slow" />
          </div>
          <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">MIT Licensed • Open Source</p>
              <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Climate-first building energy insights</h2>
              <p className="mt-3 text-gray-700 leading-relaxed">Import CSV outputs from energy simulations and explore interactive charts for time-series, end-use breakdowns, and scenario comparisons.</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to="/upload" className="btn-brand">Import Data</Link>
                <Link to="/dashboard" className="btn-ghost">Explore Charts</Link>
                <a href="https://github.com/Icy-Mint/Building-Energy-Data-Visualization" target="_blank" rel="noreferrer" className="btn-ghost">View Reference</a>
              </div>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <li className="flex items-start gap-2"><Check /> Upload CSVs from various engines</li>
                <li className="flex items-start gap-2"><Check /> Time-series & end-use charts</li>
                <li className="flex items-start gap-2"><Check /> Quick preview tables</li>
                <li className="flex items-start gap-2"><Check /> Lightweight, no backend required</li>
              </ul>
              {/* KPI row */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <KPI value="0.5m+" label="rows parsed / sec" />
                <KPI value="10+" label="end uses supported" />
                <KPI value=">99%" label="CSV compat" />
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 bg-emerald-100/60 blur-2xl rounded-2xl" aria-hidden></div>
              <div className="relative bg-white shadow-xl ring-1 ring-gray-200 rounded-2xl p-4 animate-gradient" style={{ backgroundImage: 'linear-gradient(135deg, rgba(209,250,229,0.5), rgba(204,251,241,0.5))' }}>
                <img src="/images/preview.svg" alt="Chart preview" className="h-56 sm:h-64 w-full rounded-lg object-cover" />
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
                  <Badge>Time</Badge>
                  <Badge>End Use</Badge>
                  <Badge>kWh / Therms</Badge>
                </div>
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="chip">Low-carbon</span>
                  <span className="chip">Efficiency</span>
                  <span className="chip">Resilience</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="grid md:grid-cols-3 gap-5">
            <FeatureCard title="Import" desc="Load CSV files and auto-detect common headers for quick analysis." />
            <FeatureCard title="Visualize" desc="Interactive line charts and breakdowns for fast insights." />
            <FeatureCard title="Compare" desc="Switch datasets in-session to compare scenarios side-by-side." />
          </div>
        </section>

        {/* Historic and Forecasting sections */}
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Historic Data Analysis (Coming Soon) */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Historic Data Analysis <span className="ml-2 align-middle text-xs font-medium text-gray-500">(Coming soon)</span></h3>
              <p className="mt-2 text-gray-700 text-sm leading-relaxed">Explore historical consumption trends, seasonal patterns, and end-use breakdowns from past simulations or metered datasets.</p>
              <div className="mt-4 flex items-center gap-3">
                <button disabled className="inline-flex cursor-not-allowed items-center rounded-md bg-emerald-100 px-4 py-2 text-emerald-700">View Historic</button>
                <span className="text-xs text-gray-500">Planned: monthly/annual aggregations, end-use stacks, KPI cards</span>
              </div>
            </div>

            {/* Future Energy Data Forecasting */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm ring-1 ring-emerald-100">
              <h3 className="text-xl font-semibold text-gray-900">Future Energy Data Forecasting</h3>
              <p className="mt-2 text-gray-700 text-sm leading-relaxed">Upload scenario projections to visualize future energy use and compare with current baselines. Supports CSV inputs similar to the reference repo's future datasets.</p>
              <div className="mt-4 flex items-center gap-3">
                <Link to="/upload" className="btn-brand">Upload Forecast CSV</Link>
                <Link to="/dashboard" className="btn-ghost">View Forecast Charts</Link>
              </div>
              <ul className="mt-3 text-xs text-gray-600 list-disc pl-5">
                <li>Expected columns: time, end_use, value, unit</li>
                <li>Compare scenarios by re-uploading different forecast files</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Building Energy Analysis</span>
          <a className="hover:underline" href="https://github.com/Icy-Mint/Building-Energy-Data-Visualization" target="_blank" rel="noreferrer">MIT License</a>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-5">
      <div className="h-8 w-8 rounded bg-emerald-100 mb-3" aria-hidden />
      <h3 className="font-medium tracking-tight text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-gray-100 text-gray-800 px-2 py-1">{children}</span>
  );
}

function Check() {
  return (
    <svg className="mt-0.5 h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

function KPI({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg bg-white/80 ring-1 ring-emerald-100 p-4 shadow-soft">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-0.5">{label}</div>
    </div>
  );
}

function Typewriter({ text, speed = 24 }: { text: string; speed?: number }) {
  const [display, setDisplay] = useState<string>('');
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplay(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return <span>{display}</span>;
}


