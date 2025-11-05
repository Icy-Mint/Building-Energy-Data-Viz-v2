import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const keys = [
  "Interior Lighting (MBtu)",
  "Receptacle Equipment (MBtu)",
  "Space Heating (MBtu)",
  "Service Water Heating (MBtu)",
  "Space Cooling (MBtu)",
  "Heat Rejection (MBtu)",
  "Interior Central Fans (MBtu)",
  "Interior Local Fans (MBtu)",
  "Exhaust Fans (MBtu)",
  "Pumps (MBtu)"
];

const colorScale = d3.scaleOrdinal()
  .domain(keys)
  .range([
    "#fbb4ae", "#ccebc5", "#fb8072", "#ffffb3", "#80b1d3",
    "#b3cde3", "#bebada", "#fdb462", "#fccde5", "#d9d9d9"
  ]);

const categoryColor = (category: string) => colorScale(category) || "#888";

function parseCsvTotals(csvText: string) {
  const lines = csvText.split("\n").map(l => l.split(","));
  const headers = lines[4].map(h => h.trim());
  const totalRow = lines[19];
  const totals: Record<string, number> = {};

  headers.forEach((h, i) => {
    if (keys.includes(h)) {
      totals[h] = parseFloat(totalRow[i]) || 0;
    }
  });

  return totals;
}

function parseCsvMonthly(csvText: string) {
  const lines = csvText.split("\n").map(l => l.split(","));
  const headers = lines[4].map(h => h.trim());
  const monthlyData: Array<Record<string, string | number>> = [];

  // Extract month rows (lines 7-18)
  for (let i = 7; i <= 18; i++) {
    const row = lines[i];
    const monthData: Record<string, string | number> = { 
      month: row[0].substring(0, 3) 
    };

    headers.forEach((h, j) => {
      if (keys.includes(h)) {
        monthData[h] = parseFloat(row[j]) || 0;
      }
    });

    monthlyData.push(monthData);
  }

  return monthlyData;
}

export default function EnergyDashboard() {
  const annualChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("Select a category");
  const [pieDataType, setPieDataType] = useState<string>("Current");
  const [currentTotals, setCurrentTotals] = useState<Record<string, number>>({});
  const [futureTotals, setFutureTotals] = useState<Record<string, number>>({});
  const [currentMonthly, setCurrentMonthly] = useState<Array<Record<string, string | number>>>([]);
  const [futureMonthly, setFutureMonthly] = useState<Array<Record<string, string | number>> | null>(null);
  const [projectInfo, setProjectInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    const rawCsvCurrent = sessionStorage.getItem("iesveCsvData");
    const rawCsvFuture = sessionStorage.getItem("iesveFutureCsvData");

    if (!rawCsvCurrent) {
      return;
    }

    const totals = parseCsvTotals(rawCsvCurrent);
    const monthly = parseCsvMonthly(rawCsvCurrent);
    setCurrentTotals(totals);
    setCurrentMonthly(monthly);

    let futureTotalsData: Record<string, number> = {};
    let futureMonthlyData: Array<Record<string, string | number>> | null = null;

    if (rawCsvFuture) {
      futureTotalsData = parseCsvTotals(rawCsvFuture);
      futureMonthlyData = parseCsvMonthly(rawCsvFuture);
    } else {
      // Generate mock future data if not available
      keys.forEach(key => {
        futureTotalsData[key] = totals[key] * 0.7;
      });
      futureMonthlyData = monthly.map(monthData => {
        const futureMonth: Record<string, string | number> = { month: monthData.month };
        keys.forEach(key => {
          futureMonth[key] = (monthData[key] as number) * 0.7;
        });
        return futureMonth;
      });
    }

    setFutureTotals(futureTotalsData);
    setFutureMonthly(futureMonthlyData);

    // Load project info
    const projectData: Record<string, string> = {};
    const projectKeys = [
      'projectName', 'projectSqft', 'projectId', 'climateZone', 'projectCategory',
      'constructionType', 'projectPhase', 'yearOccupancy', 'leedVersion',
      'targetCertification', 'country', 'stateProvince', 'zipCode', 'city',
      'designEnergyCode', 'meteredData', 'energyModelingTool', 'targetEUI'
    ];
    
    projectKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) projectData[key] = value;
    });
    setProjectInfo(projectData);

    return () => {
      // Cleanup
      if (annualChartRef.current) annualChartRef.current.innerHTML = '';
      if (pieChartRef.current) pieChartRef.current.innerHTML = '';
      if (lineChartRef.current) lineChartRef.current.innerHTML = '';
    };
  }, []);

  useEffect(() => {
    if (Object.keys(currentTotals).length === 0) return;

    const annualChartData = [
      { label: "Current", ...currentTotals },
      { label: "Future", ...futureTotals }
    ];

    drawAnnualChart(annualChartData);
    drawPieChart(pieDataType, pieDataType === "Current" ? currentTotals : futureTotals);
    setupLineChart();
  }, [currentTotals, futureTotals, pieDataType]);

  const drawAnnualChart = (data: Array<Record<string, string | number>>) => {
    if (!annualChartRef.current) return;
    annualChartRef.current.innerHTML = '';

    const margin = { top: 40, right: 280, bottom: 60, left: 60 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(annualChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const stack = d3.stack<Record<string, string | number>>().keys(keys);
    const stackedData = stack(data);

    const maxTotal = d3.max(data, d => 
      keys.reduce((sum, k) => sum + (d[k] as number || 0), 0)
    ) || 0;

    const x = d3.scaleBand()
      .domain(data.map(d => d.label as string))
      .range([0, width])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, maxTotal])
      .range([height, 0]);

    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll("g.layer")
      .data(stackedData)
      .join("g")
        .attr("class", d => `layer category-${d.key.replace(/\s+\([^)]+\)/g, '').replace(/\s+/g, '-').toLowerCase()}`)
        .attr("fill", d => colorScale(d.key))
      .selectAll("rect")
        .data(d => d)
        .join("rect")
          .attr("class", "bar")
          .attr("x", d => x(d.data.label as string) || 0)
          .attr("y", y(0))
          .attr("width", x.bandwidth())
          .attr("height", 0)
          .attr("stroke", "white")
          .attr("stroke-width", 0.5)
          .attr("data-category", (_, i, nodes) => {
            const parent = nodes[i]?.parentNode as SVGElement;
            return parent ? d3.select(parent).datum().key : '';
          })
          .on("mouseover", function(event, d) {
            const category = d3.select(this.parentNode as SVGElement).datum().key;
            const val = ((d[1] as number) - (d[0] as number)).toFixed(2);
            tooltip.style("opacity", 1)
              .html(`<strong>${category}</strong><br>${d.data.label}: ${val} MBtu`);
          })
          .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseout", () => tooltip.style("opacity", 0))
          .on("click", function() {
            const category = d3.select(this.parentNode as SVGElement).datum().key;
            showMonthlyTrend(category);
          })
          .transition()
          .duration(800)
          .delay((_, i) => i * 100)
          .attr("y", d => y(d[1] as number))
          .attr("height", d => y(d[0] as number) - y(d[1] as number));

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(6).tickSizeOuter(0))
      .selectAll("text")
        .style("cursor", "pointer")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .style("fill", "#555")
        .on("click", function(_, d) {
          d3.select(this)
            .style("fill", "red")
            .transition().duration(500)
            .style("fill", "#555");
          togglePieChart(d as string);
        });

    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(6).tickSize(6).tickSizeOuter(0))
      .selectAll("text")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .style("fill", "#555");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#555")
      .text("Energy Scenario");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -60)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#555")
      .text("Annual Energy Consumption (Million BTU)");

    const legend = svg.append("g")
      .attr("transform", `translate(${width + 40}, 0)`);

    keys.forEach((key, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(0, ${i * 24})`)
        .style("cursor", "pointer")
        .on("click", () => showMonthlyTrend(key));

      legendItem.append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("rx", 3)
        .attr("fill", colorScale(key))
        .attr("stroke", "#555")
        .attr("stroke-width", 0.5);

      legendItem.append("text")
        .attr("x", 20)
        .attr("y", 11)
        .attr("font-size", "13px")
        .attr("fill", "#555")
        .style("font-family", "sans-serif")
        .style("font-weight", "500")
        .text(key);
    });

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Current vs Future Energy Consumption");
  };

  const drawPieChart = (dataType: string, totals: Record<string, number>) => {
    if (!pieChartRef.current) return;
    pieChartRef.current.innerHTML = '';

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(pieChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);

    let pieDataRaw = keys.map(key => ({
      category: key,
      value: totals[key] || 0
    }));

    const total = d3.sum(pieDataRaw, d => d.value);
    const threshold = 0.03;

    const pieData: Array<{ category: string; value: number }> = [];
    let otherTotal = 0;

    pieDataRaw.forEach(d => {
      const share = d.value / total;
      if (share < threshold) {
        otherTotal += d.value;
      } else {
        pieData.push(d);
      }
    });

    if (otherTotal > 0) {
      pieData.push({ category: "Other", value: otherTotal });
    }

    const pie = d3.pie<{ category: string; value: number }>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{ category: string; value: number }>>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    const arcData = pie(pieData);
    const tooltip = d3.select(tooltipRef.current);

    svg.selectAll(".slice")
      .data(arcData)
      .join("path")
        .attr("class", "slice")
        .attr("d", arc)
        .attr("fill", d => colorScale(d.data.category) || "#ccc")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .each(function(d) { (this as any)._current = d; })
        .transition()
        .duration(1000)
        .attrTween("d", function(d) {
          const interpolate = d3.interpolate(
            { startAngle: d.startAngle, endAngle: d.startAngle },
            { startAngle: d.startAngle, endAngle: d.endAngle }
          );
          return function(t) {
            return arc(interpolate(t)) || '';
          };
        })
        .selection()
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          tooltip.style("opacity", 1)
            .html(`<strong>${d.data.category}</strong><br>${dataType}: ${d.data.value.toFixed(2)} MBtu`);
        })
        .on("mousemove", function(event) {
          tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => tooltip.style("opacity", 0))
        .on("click", (_, d) => showMonthlyTrend(d.data.category));

    svg.selectAll(".pie-label")
      .data(arcData)
      .join("text")
        .attr("class", "pie-label")
        .style("font-size", "11px")
        .style("fill", "#333")
        .style("font-weight", "500")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(d => {
          const percent = (d.data.value / total) * 100;
          return percent >= 5 ? `${percent.toFixed(1)}%` : "";
        });

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#444")
      .text(dataType);
  };

  const setupLineChart = () => {
    if (!lineChartRef.current) return;
    lineChartRef.current.innerHTML = '';

    const margin = { top: 20, right: 60, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(lineChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .text("Click a category in the bar or pie chart to see monthly trends");
  };

  const showMonthlyTrend = (category: string) => {
    setSelectedCategory(category);
    
    if (!lineChartRef.current) return;
    lineChartRef.current.innerHTML = '';

    const margin = { top: 20, right: 60, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(lineChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const currentData = currentMonthly.map(d => ({
      month: d.month as string,
      value: (d[category] as number) || 0,
      type: 'Current'
    }));

    let combinedData = [...currentData];
    let futureData: Array<{ month: string; value: number; type: string }> | null = null;

    if (futureMonthly) {
      futureData = futureMonthly.map(d => ({
        month: d.month as string,
        value: (d[category] as number) || 0,
        type: 'Future'
      }));
      combinedData = [...currentData, ...futureData];
    }

    const x = d3.scaleBand()
      .domain(monthNames)
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(combinedData, d => d.value)! * 1.1])
      .range([height, 0]);

    const baseColor = categoryColor(category);
    const futureColor = baseColor;
    const currentColor = d3.color(baseColor)!.darker(1.3).formatHex();

    // Heating season (Oct-Apr)
    const heatingStartX_Oct = x("Oct") || 0;
    const heatingEndX_Apr = (x("Apr") || 0) + x.bandwidth();
    const coolingStartX_May = x("May") || 0;
    const coolingEndX_Sep = (x("Sep") || 0) + x.bandwidth();

    svg.append("rect")
      .attr("x", heatingStartX_Oct)
      .attr("y", 0)
      .attr("width", width - heatingStartX_Oct)
      .attr("height", height)
      .attr("fill", "blue")
      .attr("opacity", 0.03)
      .attr("stroke", "blue")
      .attr("stroke-opacity", 0.08)
      .attr("stroke-width", 1);

    svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", heatingEndX_Apr)
      .attr("height", height)
      .attr("fill", "blue")
      .attr("opacity", 0.03)
      .attr("stroke", "blue")
      .attr("stroke-opacity", 0.08)
      .attr("stroke-width", 1);

    const heatingLabel = svg.append("g");
    heatingLabel.append("rect")
      .attr("x", 5)
      .attr("y", -30)
      .attr("width", 110)
      .attr("height", 22)
      .attr("fill", "white")
      .attr("stroke", "blue")
      .attr("stroke-width", 1)
      .attr("rx", 4);
    heatingLabel.append("text")
      .attr("x", 10)
      .attr("y", -15)
      .attr("fill", "blue")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Heating Season");

    svg.append("rect")
      .attr("x", coolingStartX_May)
      .attr("y", 0)
      .attr("width", coolingEndX_Sep - coolingStartX_May)
      .attr("height", height)
      .attr("fill", "red")
      .attr("opacity", 0.08)
      .attr("stroke", "red")
      .attr("stroke-opacity", 0.15)
      .attr("stroke-width", 1);

    const coolingLabel = svg.append("g");
    const coolingLabelX = coolingStartX_May + 5;
    coolingLabel.append("rect")
      .attr("x", coolingLabelX)
      .attr("y", -30)
      .attr("width", 110)
      .attr("height", 22)
      .attr("fill", "white")
      .attr("stroke", "red")
      .attr("stroke-width", 1)
      .attr("rx", 4);
    coolingLabel.append("text")
      .attr("x", coolingLabelX + 5)
      .attr("y", -15)
      .attr("fill", "red")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Cooling Season");

    ["May", "Oct"].forEach(month => {
      const monthX = x(month) || 0;
      svg.append("line")
        .attr("x1", monthX)
        .attr("y1", 0)
        .attr("x2", monthX)
        .attr("y2", height)
        .attr("stroke", month === "May" ? "red" : "blue")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "4,4");
    });

    const line = d3.line<{ month: string; value: number }>()
      .x(d => (x(d.month) || 0) + x.bandwidth() / 2)
      .y(d => y(d.value))
      .curve(d3.curveBasis);

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(6).tickSizeOuter(0))
      .selectAll("text")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .style("fill", "#555");

    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(6).tickSize(6).tickSizeOuter(0))
      .selectAll("text")
        .style("font-size", "13px")
        .style("font-weight", "500")
        .style("fill", "#555");

    const currentPath = svg.append("path")
      .datum(currentData)
      .attr("fill", "none")
      .attr("stroke", currentColor)
      .attr("stroke-width", 2)
      .attr("d", line);

    const totalLength = currentPath.node()?.getTotalLength() || 0;
    currentPath
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    if (futureData) {
      svg.append("path")
        .datum(futureData)
        .attr("fill", "none")
        .attr("stroke", futureColor)
        .attr("stroke-width", 2)
        .attr("d", line);
    }

    svg.selectAll(".current-point")
      .data(currentData)
      .join("circle")
        .attr("class", "current-point")
        .attr("cx", d => (x(d.month) || 0) + x.bandwidth() / 2)
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("fill", currentColor)
        .attr("stroke", "#333")
        .attr("stroke-width", 0.5);

    if (futureData) {
      svg.selectAll(".future-point")
        .data(futureData)
        .join("circle")
          .attr("class", "future-point")
          .attr("cx", d => (x(d.month) || 0) + x.bandwidth() / 2)
          .attr("cy", d => y(d.value))
          .attr("fill", futureColor)
          .attr("r", 4);
    }

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Month");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -60)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Energy Consumption (MBtu)");

    const legend = svg.append("g")
      .attr("transform", `translate(${width + 20}, 0)`);

    const sw = 15, gap = 8;
    legend.append("rect")
      .attr("width", sw)
      .attr("height", sw)
      .attr("fill", currentColor);
    legend.append("text")
      .attr("x", sw + gap)
      .attr("y", sw - 3)
      .style("font-size", "13px")
      .style("font-weight", "500")
      .style("fill", "#555")
      .text("Current");

    if (futureData) {
      legend.append("rect")
        .attr("y", sw + gap)
        .attr("width", sw)
        .attr("height", sw)
        .attr("fill", futureColor);
      legend.append("text")
        .attr("x", sw + gap)
        .attr("y", sw * 2 + gap - 3)
        .style("font-size", "13px")
        .style("font-weight", "500")
        .style("fill", "#555")
        .text("Future");
    }
  };

  const togglePieChart = (dataType: string) => {
    if (dataType === "Current" || dataType === "Future") {
      setPieDataType(dataType);
      drawPieChart(dataType, dataType === "Current" ? currentTotals : futureTotals);
    }
  };

  const projectInfoLabels: Record<string, string> = {
    'projectName': 'Project Name',
    'projectSqft': 'Project Sqft',
    'projectId': 'Project ID (AIA)',
    'climateZone': 'Climate Zone',
    'projectCategory': 'Project Category',
    'constructionType': 'Construction Type',
    'projectPhase': 'Project Phase',
    'yearOccupancy': 'Year of Occupancy',
    'leedVersion': 'LEED Version',
    'targetCertification': 'Target Certification',
    'country': 'Country',
    'stateProvince': 'State/Province',
    'zipCode': 'Zip Code',
    'city': 'City',
    'designEnergyCode': 'Design Energy Code',
    'meteredData': 'Metered Energy Use Data',
    'energyModelingTool': 'Energy Modeling Tool',
    'targetEUI': 'Target EUI'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Energy Visualization Dashboard</h2>
        
        <div 
          ref={tooltipRef}
          className="fixed opacity-0 bg-white px-3 py-2 border border-gray-300 rounded pointer-events-none text-xs z-50 shadow-lg"
          style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div ref={annualChartRef} className="w-full overflow-visible">
            <div className="text-center font-semibold text-xl mb-6 text-gray-800" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
              Annual Energy Comparison
            </div>
          </div>

          <div ref={pieChartRef} className="w-full">
            <div className="text-center font-semibold text-xl mb-6 text-gray-800" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
              Energy Use by Category (<span>{pieDataType}</span>)
            </div>
          </div>
        </div>

        <div ref={lineChartRef} className="w-full mt-8 min-h-[300px]">
          <div className="text-center font-semibold text-xl mb-6 text-gray-800" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            Monthly Trend: <span>{selectedCategory}</span>
          </div>
        </div>

        {Object.keys(projectInfo).length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg mt-8 shadow-sm" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(projectInfo).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <div className="font-semibold text-sm text-gray-600">{projectInfoLabels[key] || key}</div>
                  <div className="text-sm text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

