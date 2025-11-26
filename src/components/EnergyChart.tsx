import React, { useState, useEffect } from 'react';

interface DataPoint {
  month: string;
  current: number;
  future: number;
}

const baseData: DataPoint[] = [
  { month: 'Jan', current: 850, future: 720 },
  { month: 'Feb', current: 920, future: 780 },
  { month: 'Mar', current: 780, future: 660 },
  { month: 'Apr', current: 650, future: 550 },
  { month: 'May', current: 580, future: 490 },
  { month: 'Jun', current: 720, future: 610 },
  { month: 'Jul', current: 950, future: 800 },
  { month: 'Aug', current: 980, future: 830 },
  { month: 'Sep', current: 680, future: 580 },
  { month: 'Oct', current: 620, future: 530 },
  { month: 'Nov', current: 750, future: 640 },
  { month: 'Dec', current: 880, future: 750 }
];

const EnergyChart: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [data, setData] = useState<DataPoint[]>(baseData);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);

  // Animation effect on mount
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic data updates (simulate real-time data)
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => 
        prevData.map(point => ({
          ...point,
          current: Math.max(0, point.current + (Math.random() - 0.5) * 20),
          future: Math.max(0, point.future + (Math.random() - 0.5) * 15)
        }))
      );
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...data.flatMap(d => [d.current, d.future]));
  const chartHeight = 400;
  const chartWidth = 1000;
  const padding = 80;
  const plotWidth = chartWidth - 2 * padding;
  const plotHeight = chartHeight - 2 * padding;

  const getX = (index: number) => padding + (index * plotWidth) / (data.length - 1);
  const getY = (value: number) => padding + plotHeight - (value / maxValue) * plotHeight;

  const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Only track mouse position within the chart area
    if (x >= padding && x <= padding + plotWidth && y >= padding && y <= padding + plotHeight) {
      setMousePosition({ x, y });
      
      // Find the closest data point
      const index = Math.round(((x - padding) / plotWidth) * (data.length - 1));
      if (index >= 0 && index < data.length) {
        setHoveredPoint(data[index]);
      }
    } else {
      setMousePosition(null);
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
    setHoveredPoint(null);
  };

  const createPath = (values: number[], color: string) => {
    if (values.length < 2) return null;

    const points = values.map((value, index) => {
      const x = getX(index);
      const y = getY(value);
      return { x, y };
    });

    // Create ultra-smooth curved path connecting all dots
    let pathData = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (i === points.length - 1) {
        // Last point - smooth curve to end
        const cp1x = prev.x + (curr.x - prev.x) * 0.6;
        const cp1y = prev.y + (curr.y - prev.y) * 0.6;
        pathData += ` Q ${cp1x} ${cp1y}, ${curr.x} ${curr.y}`;
      } else {
        // Ultra-smooth curve with optimized control points for better dot connection
        const tension = 0.4; // Increased tension for smoother curves that connect dots better
        const cp1x = prev.x + (curr.x - prev.x) * tension;
        const cp1y = prev.y + (curr.y - prev.y) * tension;
        const cp2x = curr.x - (next.x - curr.x) * tension;
        const cp2y = curr.y - (next.y - curr.y) * tension;
        
        pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }

    return (
      <path
        d={pathData}
        stroke={color}
        strokeWidth={color === '#B7E4C7' ? "4" : "3"}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: isAnimating ? '2000' : '0',
          strokeDashoffset: isAnimating ? '2000' : '0',
          transition: 'stroke-dashoffset 3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: animationProgress,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
        }}
      />
    );
  };


  const createDots = (values: number[], color: string) => {
    return values.map((value, index) => {
      const x = getX(index);
      const y = getY(value);
      return (
        <g key={index}>
          {/* Main dot */}
          <circle
            cx={x}
            cy={y}
            r="5"
            fill={color}
            stroke="white"
            strokeWidth="3"
            onMouseEnter={() => setHoveredPoint(data[index])}
            onMouseLeave={() => setHoveredPoint(null)}
            style={{ 
              cursor: 'pointer',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
            }}
          />
        </g>
      );
    });
  };

  const createSeasonalBackgrounds = () => {
    const heatingSeason1 = { start: 0, end: 3 }; // Jan-Apr
    const coolingSeason = { start: 4, end: 8 }; // May-Sep
    const heatingSeason2 = { start: 9, end: 11 }; // Oct-Dec

    return (
      <>
        {/* Heating Season 1 (Jan-Apr) */}
        <rect
          x={getX(heatingSeason1.start)}
          y={padding}
          width={getX(heatingSeason1.end) - getX(heatingSeason1.start)}
          height={plotHeight}
          fill="#FFFBEB"
        />
        {/* Cooling Season (May-Sep) */}
        <rect
          x={getX(coolingSeason.start)}
          y={padding}
          width={getX(coolingSeason.end) - getX(coolingSeason.start)}
          height={plotHeight}
          fill="#E8F5E8"
        />
        {/* Heating Season 2 (Oct-Dec) */}
        <rect
          x={getX(heatingSeason2.start)}
          y={padding}
          width={getX(heatingSeason2.end) - getX(heatingSeason2.start)}
          height={plotHeight}
          fill="#FFFBEB"
        />
      </>
    );
  };

  const createYAxis = () => {
    const ticks = [0, 200, 400, 600, 800, 1000];
    return ticks.map(value => {
      const y = getY(value);
      return (
        <g key={value}>
          <line
            x1={padding - 5}
            y1={y}
            x2={padding}
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
          <text
            x={padding - 10}
            y={y + 5}
            textAnchor="end"
            fontSize="14"
            fill="#6b7280"
          >
            {value}
          </text>
        </g>
      );
    });
  };

  const createXAxis = () => {
    return data.map((item, index) => {
      const x = getX(index);
      return (
        <text
          key={index}
          x={x}
          y={padding + plotHeight + 20}
          textAnchor="middle"
          fontSize="14"
          fill="#6b7280"
        >
          {item.month}
        </text>
      );
    });
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateX(-50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .chart-container {
          animation: fadeInUp 1s ease-out;
        }
        .chart-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
      <div className="relative chart-container" style={{
        opacity: animationProgress,
        transition: 'opacity 0.5s ease-in-out'
      }}>
        <svg 
          width={chartWidth} 
          height={chartHeight} 
          className="w-full chart-pulse" 
          style={{
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
            transition: 'all 0.3s ease-in-out'
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
        {/* Seasonal backgrounds */}
        {createSeasonalBackgrounds()}

        {/* Fading gradient at the beginning */}
        <defs>
          <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8"/>
            <stop offset="20%" stopColor="white" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="currentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B7E4C7" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#B7E4C7" stopOpacity="1"/>
          </linearGradient>
          <linearGradient id="futureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#52B788" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#52B788" stopOpacity="1"/>
          </linearGradient>
        </defs>

        {/* Fade overlay at the beginning */}
        <rect
          x={padding}
          y={padding}
          width={plotWidth * 0.2}
          height={plotHeight}
          fill="url(#fadeGradient)"
          style={{ opacity: animationProgress }}
        />

        {/* Chart lines with gradients */}
        {createPath(data.map(d => d.current), '#B7E4C7')}
        {createPath(data.map(d => d.future), '#52B788')}

        {/* Chart dots */}
        {createDots(data.map(d => d.current), '#B7E4C7')}
        {createDots(data.map(d => d.future), '#52B788')}



        {/* Hover indicators */}
        {hoveredPoint && (
          <>
             {/* Current line indicator */}
             <circle
               cx={getX(data.indexOf(hoveredPoint))}
               cy={getY(hoveredPoint.current)}
               r="6"
               fill="#B7E4C7"
               stroke="white"
               strokeWidth="3"
               style={{
                 filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
               }}
             />
             {/* Future line indicator */}
             <circle
               cx={getX(data.indexOf(hoveredPoint))}
               cy={getY(hoveredPoint.future)}
               r="6"
               fill="#52B788"
               stroke="white"
               strokeWidth="3"
               style={{
                 filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
               }}
             />
          </>
        )}

        {/* Axes */}
        {createYAxis()}
        {createXAxis()}

        {/* Grid lines - positioned on top of all other elements */}
        {/* Horizontal grid lines for all Y-axis values */}
        {[0, 200, 400, 600, 800, 1000].map(value => {
          const y = getY(value);
          return (
            <line
              key={value}
              x1={padding}
              y1={y}
              x2={padding + plotWidth}
              y2={y}
              stroke="#d1d5db"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* Vertical grid lines */}
        {data.map((_, index) => {
          const x = getX(index);
          return (
            <line
              key={`v-${index}`}
              x1={x}
              y1={padding}
              x2={x}
              y2={padding + plotHeight}
              stroke="#f3f4f6"
              strokeWidth="1"
              opacity="0.2"
            />
          );
        })}

        {/* Y-axis label */}
        <text
          x={15}
          y={padding + plotHeight / 2}
          textAnchor="middle"
          fontSize="16"
          fill="#374151"
          transform={`rotate(-90, 15, ${padding + plotHeight / 2})`}
        >
          Energy Consumption (MBtu)
        </text>

        {/* X-axis label */}
        <text
          x={padding + plotWidth / 2}
          y={padding + plotHeight + 50}
          textAnchor="middle"
          fontSize="16"
          fill="#374151"
        >
          Month
        </text>
      </svg>


      {/* Seasonal labels */}
      <div className="absolute top-2 flex gap-4" style={{ left: `${getX(1.5)}px` }}>
        <div className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#FFFBEB', color: '#2d6a4f' }}>
          Heating Season
        </div>
      </div>
      <div className="absolute top-2 flex gap-4" style={{ left: `${getX(6.5)}px` }}>
        <div className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#E8F5E8', color: '#2d6a4f' }}>
          Cooling Season
        </div>
      </div>

      {/* Vercel-style square legend with dynamic data */}
      {hoveredPoint && (
        <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-4 pointer-events-none z-20"
             style={{
               left: `${getX(data.indexOf(hoveredPoint)) + 20}px`,
               top: '20px',
               animation: 'fadeInScale 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
               boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
             }}>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#B7E4C7' }}></div>
              <span className="text-sm font-medium text-gray-700">Current</span>
              <span className="text-sm font-bold text-gray-900">{Math.round(hoveredPoint.current).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#52B788' }}></div>
              <span className="text-sm font-medium text-gray-700">Future</span>
              <span className="text-sm font-bold text-gray-900">{Math.round(hoveredPoint.future).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default EnergyChart;
