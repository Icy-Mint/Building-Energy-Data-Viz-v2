export type EngineType = 'EnergyPlus' | 'DOE2' | 'OpenStudio' | 'Other';

export type ParsedRecord = Record<string, string | number>;

export type ParseResult = {
  engine: EngineType;
  columns: string[];
  rows: ParsedRecord[];
};

export function detectEngineByHeaders(headers: string[]): EngineType {
  const lowered = headers.map(h => h.toLowerCase());
  if (lowered.some(h => h.includes('eplus') || h.includes('energyplus'))) return 'EnergyPlus';
  if (lowered.some(h => h.includes('doe2') || h.includes('equest'))) return 'DOE2';
  if (lowered.some(h => h.includes('openstudio'))) return 'OpenStudio';
  return 'Other';
}

export function normalizeColumns(columns: string[]): string[] {
  return columns.map(c => c.trim());
}



