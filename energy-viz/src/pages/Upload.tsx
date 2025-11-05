import { useState, useRef } from 'react';
// @ts-ignore
import Papa from 'papaparse';
import { Link, useNavigate } from 'react-router-dom';

export type ParsedDataset = {
  columns: string[];
  rows: Record<string, string | number>[];
};

export type ProjectData = {
  projectName: string;
  projectSqft: string;
  projectId: string;
  climateZone: string;
  projectCategory: string;
  constructionType: string;
  projectPhase: string;
  yearOccupancy: string;
  leedVersion: string;
  targetCertification: string;
  country: string;
  stateProvince: string;
  zipCode: string;
  city: string;
  designEnergyCode: string;
  meteredData: string;
  energyModelingTool: string;
  targetEUI: string;
};

type FormatType = 'iesve' | 'openstudio' | 'equest';

export default function Upload() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<FormatType>('iesve');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [futureFile, setFutureFile] = useState<File | null>(null);
  const [currentPreview, setCurrentPreview] = useState<string[][]>([]);
  const [futurePreview, setFuturePreview] = useState<string[][]>([]);
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    projectSqft: '',
    projectId: '',
    climateZone: '',
    projectCategory: '',
    constructionType: '',
    projectPhase: '',
    yearOccupancy: '',
    leedVersion: '',
    targetCertification: '',
    country: '',
    stateProvince: '',
    zipCode: '',
    city: '',
    designEnergyCode: '',
    meteredData: '',
    energyModelingTool: '',
    targetEUI: ''
  });

  const navigate = useNavigate();
  const currentFileRef = useRef<HTMLInputElement>(null);
  const futureFileRef = useRef<HTMLInputElement>(null);

  const handleFormatChange = (format: FormatType) => {
    setSelectedFormat(format);
    if (format !== 'iesve') {
      alert(`${format.charAt(0).toUpperCase() + format.slice(1)} import not yet supported.`);
    }
  };

  const handleFileUpload = (file: File, type: 'current' | 'future') => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setErrorMessage('Please upload a CSV file.');
      return;
    }

    if (type === 'current') {
      setCurrentFile(file);
    } else {
      setFutureFile(file);
    }

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data = results.data as string[][];
        const filteredData = data.filter(row => row.some(cell => cell.trim() !== ''));
        
        if (filteredData.length > 0) {
          const columnHasData = filteredData[0].map((_, colIndex) => 
            filteredData.some(row => row[colIndex] && row[colIndex].trim() !== '')
          );
          
          const cleanedData = filteredData.map(row => 
            row.filter((_, colIndex) => columnHasData[colIndex])
          );

          if (type === 'current') {
            setCurrentPreview(cleanedData);
          } else {
            setFuturePreview(cleanedData);
          }
        }
      },
      error: (err: any) => setErrorMessage(err.message),
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: 'current' | 'future') => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFormat !== 'iesve') {
      alert('Only IESVE format is currently supported.');
      return;
    }

    if (!currentFile) {
      alert('Please upload the current CSV file');
      return;
    }

    // Store project data in localStorage
    Object.entries(projectData).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(key, value);
      }
    });

    // Read and store raw CSV text for dashboard visualization
    const readCurrentFile = async () => {
      const text = await currentFile.text();
      sessionStorage.setItem('iesveCsvData', text);
      
      // Also parse and store as JSON for compatibility
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          const data = results.data as Record<string, string | number>[];
          const columns = results.meta.fields ?? Object.keys(data[0] ?? {});
          const dataset: ParsedDataset = { columns, rows: data };
          sessionStorage.setItem('dataset', JSON.stringify(dataset));
          
          // Process future file if available
          if (futureFile) {
            readFutureFile();
          } else {
            navigate('/dashboard');
          }
        },
        error: (err: any) => setErrorMessage(err.message),
      });
    };

    const readFutureFile = async () => {
      const text = await futureFile!.text();
      sessionStorage.setItem('iesveFutureCsvData', text);
      
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (futureResults: any) => {
          const futureData = futureResults.data as Record<string, string | number>[];
          const futureColumns = futureResults.meta.fields ?? Object.keys(futureData[0] ?? {});
          const futureDataset: ParsedDataset = { columns: futureColumns, rows: futureData };
          sessionStorage.setItem('futureDataset', JSON.stringify(futureDataset));
          navigate('/dashboard');
        },
        error: (err: any) => setErrorMessage(err.message),
      });
    };

    readCurrentFile();
  };

  const renderCsvPreview = (data: string[][]) => {
    if (data.length === 0) return null;

    return (
      <div className="mt-4 max-h-80 overflow-auto border border-gray-300 rounded bg-white">
        <div className="relative">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b">
                {data[0].map((header, index) => (
                  <th key={index} className="px-3 py-2 text-left font-semibold border-r last:border-r-0">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1, 51).map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b last:border-b-0 hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-1 border-r last:border-r-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-32">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 51 && (
            <div className="absolute bottom-0 right-0 bg-gray-100 px-2 py-1 text-xs text-gray-600 rounded-tl">
              Showing first 50 rows
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4">
          <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
        
        <h1 className="text-2xl font-semibold mb-6">Import Raw Data Files</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Information Form */}
          {selectedFormat === 'iesve' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Project Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectData.projectName}
                    onChange={(e) => setProjectData({...projectData, projectName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Sqft <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={projectData.projectSqft}
                    onChange={(e) => setProjectData({...projectData, projectSqft: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project ID (AIA)
                  </label>
                  <input
                    type="text"
                    value={projectData.projectId}
                    onChange={(e) => setProjectData({...projectData, projectId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Climate Zone <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={projectData.climateZone}
                    onChange={(e) => setProjectData({...projectData, climateZone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Climate Zone</option>
                    <option value="1A">1A - Very Hot-Humid</option>
                    <option value="2A">2A - Hot-Humid</option>
                    <option value="2B">2B - Hot-Dry</option>
                    <option value="3A">3A - Warm-Humid</option>
                    <option value="3B">3B - Warm-Dry</option>
                    <option value="3C">3C - Warm-Marine</option>
                    <option value="4A">4A - Mixed-Humid</option>
                    <option value="4B">4B - Mixed-Dry</option>
                    <option value="4C">4C - Mixed-Marine</option>
                    <option value="5A">5A - Cool-Humid</option>
                    <option value="5B">5B - Cool-Dry</option>
                    <option value="6A">6A - Cold-Humid</option>
                    <option value="6B">6B - Cold-Dry</option>
                    <option value="7">7 - Very Cold</option>
                    <option value="8">8 - Subarctic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={projectData.projectCategory}
                    onChange={(e) => setProjectData({...projectData, projectCategory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="office">Office</option>
                    <option value="retail">Retail</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="residential">Residential</option>
                    <option value="industrial">Industrial</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Construction Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={projectData.constructionType}
                    onChange={(e) => setProjectData({...projectData, constructionType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="new">New Construction</option>
                    <option value="renovation">Major Renovation</option>
                    <option value="core">Core and Shell</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Phase
                  </label>
                  <select
                    value={projectData.projectPhase}
                    onChange={(e) => setProjectData({...projectData, projectPhase: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Phase</option>
                    <option value="design">Design</option>
                    <option value="construction">Construction</option>
                    <option value="post">Post-Construction</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Occupancy
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={projectData.yearOccupancy}
                    onChange={(e) => setProjectData({...projectData, yearOccupancy: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    LEED Version <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={projectData.leedVersion}
                    onChange={(e) => setProjectData({...projectData, leedVersion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Version</option>
                    <option value="v4">LEED v4</option>
                    <option value="v4.1">LEED v4.1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Certification <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={projectData.targetCertification}
                    onChange={(e) => setProjectData({...projectData, targetCertification: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Certification</option>
                    <option value="certified">Certified</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectData.country}
                    onChange={(e) => setProjectData({...projectData, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={projectData.stateProvince}
                    onChange={(e) => setProjectData({...projectData, stateProvince: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectData.zipCode}
                    onChange={(e) => setProjectData({...projectData, zipCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={projectData.city}
                    onChange={(e) => setProjectData({...projectData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Design Energy Code <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={projectData.designEnergyCode}
                    onChange={(e) => setProjectData({...projectData, designEnergyCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Energy Code</option>
                    <option value="ashrae90.1-2019">ASHRAE 90.1-2019</option>
                    <option value="ashrae90.1-2016">ASHRAE 90.1-2016</option>
                    <option value="ashrae90.1-2013">ASHRAE 90.1-2013</option>
                    <option value="iecc-2021">IECC 2021</option>
                    <option value="iecc-2018">IECC 2018</option>
                    <option value="iecc-2015">IECC 2015</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Metered Energy Use Data
                  </label>
                  <select
                    value={projectData.meteredData}
                    onChange={(e) => setProjectData({...projectData, meteredData: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Energy Modeling Tool <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={projectData.energyModelingTool}
                    onChange={(e) => setProjectData({...projectData, energyModelingTool: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Tool</option>
                    <option value="iesve">IESVE</option>
                    <option value="openstudio">OpenStudio</option>
                    <option value="equest">eQuest</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target EUI
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={projectData.targetEUI}
                    onChange={(e) => setProjectData({...projectData, targetEUI: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Current Energy Data Upload */}
          {selectedFormat === 'iesve' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Current Energy Data</h3>
              <p className="mb-4 text-gray-600">Upload your current energy consumption data in CSV format.</p>
              
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => currentFileRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'current')}
              >
                <input
                  ref={currentFileRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'current')}
                  className="hidden"
                />
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-lg">Click to select or drag and drop your current data CSV file here</p>
                </div>
              </div>
              
              {currentFile && (
                <div className="mt-4 text-green-600 text-sm">
                  {currentFile.name} uploaded successfully.
                </div>
              )}
              
              {renderCsvPreview(currentPreview)}
            </div>
          )}

          {/* Future Energy Data Upload */}
          {selectedFormat === 'iesve' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Future Energy Data</h3>
              <p className="mb-4 text-gray-600">Upload your predicted or target future energy consumption data in CSV format.</p>
              
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => futureFileRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'future')}
              >
          <input
                  ref={futureFileRef}
            type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'future')}
                  className="hidden"
                />
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-lg">Click to select or drag and drop your future data CSV file here</p>
                </div>
              </div>
              
              {futureFile && (
                <div className="mt-4 text-green-600 text-sm">
                  {futureFile.name} uploaded successfully.
                </div>
              )}
              
              {renderCsvPreview(futurePreview)}
            </div>
          )}

          {/* Submit Button */}
          {selectedFormat === 'iesve' && (
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              Upload and Analyze
            </button>
          )}

        {errorMessage && (
            <div className="mt-4 text-red-600 text-center">{errorMessage}</div>
        )}
        </form>
      </div>
    </div>
  );
}



