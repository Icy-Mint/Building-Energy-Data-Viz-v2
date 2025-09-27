import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EnergyChart from '../components/EnergyChart';

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
          <div className="mx-auto max-w-7xl px-4 pt-8 pb-6">
            <div className="text-center">
              <p className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">MIT Licensed • Open Source</p>
              <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Climate-first building energy insights</h2>
              <p className="mt-3 text-gray-700 leading-relaxed max-w-3xl mx-auto">Import CSV outputs from energy simulations and explore interactive charts for time-series, end-use breakdowns, and scenario comparisons.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link to="/upload" className="btn-brand">Import Data</Link>
                <Link to="/dashboard" className="btn-ghost">Explore Charts</Link>
                <a href="https://github.com/Icy-Mint/Building-Energy-Data-Visualization" target="_blank" rel="noreferrer" className="btn-ghost">View Reference</a>
              </div>
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 max-w-2xl mx-auto">
                <li className="flex items-start gap-2"><Check /> Upload CSVs from various engines</li>
                <li className="flex items-start gap-2"><Check /> Time-series & end-use charts</li>
                <li className="flex items-start gap-2"><Check /> Quick preview tables</li>
                <li className="flex items-start gap-2"><Check /> Lightweight, no backend required</li>
              </ul>
              {/* KPI row */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center max-w-sm mx-auto">
                <KPI value="0.5m+" label="rows parsed / sec" />
                <KPI value="10+" label="end uses supported" />
                <KPI value=">99%" label="CSV compat" />
              </div>
            </div>
          </div>
        </section>

        {/* Chart and Boxes Section */}
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <div className="space-y-0">
            {/* Chart Preview */}
            <div className="w-3/4 mx-auto">
              <div className="relative bg-white shadow-xl p-6">
                <EnergyChart />
              </div>
            </div>
            
            {/* Historic and Forecasting sections */}
            <div className="w-3/4 mx-auto">
              <div className="grid lg:grid-cols-2 gap-0">
            {/* Historic Data Analysis */}
            <div className="bg-white border border-gray-200 shadow-sm p-8 h-96 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Historic Data Analysis</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-6">Explore historical consumption trends, seasonal patterns, and end-use breakdowns from past simulations or metered datasets.</p>
                
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-base text-gray-700">Monthly aggregations</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-base text-gray-700">End-use breakdowns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-base text-gray-700">KPI dashboards</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button disabled className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-base text-gray-500 cursor-not-allowed">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Coming Soon
                </button>
                <span className="text-sm text-gray-500">Planned for Q2 2024</span>
              </div>
            </div>

            {/* Future Energy Data Forecasting */}
            <div className="bg-white border border-emerald-200 shadow-sm ring-1 ring-emerald-100 p-8 h-96 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Future Energy Data Forecasting</h3>
                <p className="text-gray-600 text-base leading-relaxed mb-6">Upload scenario projections to visualize future energy use and compare with current baselines. Supports CSV inputs similar to the reference repo's future datasets.</p>
                
                <div className="mb-6 p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-base font-medium text-emerald-800">Expected columns: time, end_use, value, unit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-base text-emerald-700">Compare scenarios by re-uploading different forecast files</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Link to="/upload" className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-base text-white hover:bg-emerald-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Forecast CSV
                </Link>
                <Link to="/dashboard" className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-base text-gray-700 hover:bg-gray-50 transition-colors">
                  View Forecast Charts
                </Link>
              </div>
            </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Showcase Section */}
        <section className="mx-auto max-w-7xl px-4 py-20">
          <div className="w-3/4 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Energy Analytics</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">Transform your building energy data into actionable insights with our comprehensive suite of visualization and analysis tools.</p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <FeatureCard 
                title="Interactive Dashboards" 
                desc="Create dynamic, interactive dashboards that update in real-time as you explore your energy data. Drill down into specific time periods and end-uses with intuitive controls."
              />
              <FeatureCard 
                title="Advanced Analytics" 
                desc="Leverage machine learning algorithms to identify patterns, anomalies, and optimization opportunities in your building energy consumption."
              />
              <FeatureCard 
                title="Scenario Comparison" 
                desc="Compare multiple energy scenarios side-by-side to evaluate the impact of different strategies and make data-driven decisions."
              />
              <FeatureCard 
                title="Automated Reporting" 
                desc="Generate comprehensive reports automatically with customizable templates. Schedule automated delivery to stakeholders."
              />
              <FeatureCard 
                title="Data Integration" 
                desc="Seamlessly connect with popular energy modeling tools, building management systems, and IoT sensors for unified data management."
              />
              <FeatureCard 
                title="Carbon Tracking" 
                desc="Monitor and visualize your building's carbon footprint with real-time emissions tracking and sustainability metrics."
              />
            </div>

            {/* Key Features Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Built for Energy Professionals</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Multi-format Support</h4>
                        <p className="text-gray-600">Import data from EnergyPlus, OpenStudio, IESVE, and other major simulation engines</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Real-time Collaboration</h4>
                        <p className="text-gray-600">Share insights with team members and stakeholders through secure, collaborative workspaces</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Custom Visualizations</h4>
                        <p className="text-gray-600">Create tailored charts and graphs that match your organization's reporting standards</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Ready to Get Started?</h4>
                    <p className="text-gray-600 mb-6">Upload your first dataset and explore the power of energy analytics</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to="/upload" className="btn-brand">Upload Data</Link>
                      <Link to="/dashboard" className="btn-ghost">View Demo</Link>
                    </div>
                  </div>
                </div>
              </div>
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


