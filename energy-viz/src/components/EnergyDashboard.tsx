import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

// Insight generation functions
function generateAnnualInsights(
  currentTotals: Record<string, number>,
  futureTotals: Record<string, number>
): string {
  if (Object.keys(currentTotals).length === 0) {
    return "No data available to summarize.";
  }

  const currentTotal = Object.values(currentTotals).reduce((sum, val) => sum + val, 0);
  const futureTotal = Object.values(futureTotals).reduce((sum, val) => sum + val, 0);
  const reduction = currentTotal > 0 ? ((currentTotal - futureTotal) / currentTotal * 100).toFixed(1) : 0;

  // Find top categories
  const sortedCategories = Object.entries(currentTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const topCategories = sortedCategories.map(([cat]) => {
    const name = cat.replace(' (MBtu)', '');
    return name.replace(/([a-z])([A-Z])/g, '$1 $2');
  }).join(', ');

  return `Annual energy comparison shows current consumption at ${currentTotal.toFixed(1)} MBtu versus projected future consumption of ${futureTotal.toFixed(1)} MBtu, representing a ${reduction}% reduction. Top contributing categories: ${topCategories}.`;
}

function generatePieInsights(
  totals: Record<string, number>,
  dataType: string
): string {
  if (Object.keys(totals).length === 0) {
    return "No data available to summarize.";
  }

  const total = Object.values(totals).reduce((sum, val) => sum + val, 0);
  const entries = Object.entries(totals);
  const maxEntry = entries.reduce((max, [key, val]) => val > max[1] ? [key, val] : max, entries[0]);
  const maxCategory = maxEntry[0].replace(' (MBtu)', '').replace(/([a-z])([A-Z])/g, '$1 $2');
  const maxPercent = ((maxEntry[1] / total) * 100).toFixed(1);

  return `${dataType} scenario shows total consumption of ${total.toFixed(1)} MBtu. The highest category is ${maxCategory} at ${maxPercent}% (${maxEntry[1].toFixed(1)} MBtu).`;
}

function generateLineInsights(
  category: string,
  monthlyData: Array<Record<string, string | number>>,
  dataType: string
): string {
  if (!category || category === "Select a category" || monthlyData.length === 0) {
    return "Select a category to view monthly trend insights.";
  }

  const values = monthlyData.map(d => (d[category] as number) || 0);
  const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  
  const maxIndex = values.indexOf(maxValue);
  const minIndex = values.indexOf(minValue);
  const maxMonth = monthlyData[maxIndex]?.month || 'Unknown';
  const minMonth = monthlyData[minIndex]?.month || 'Unknown';

  const categoryName = category.replace(' (MBtu)', '').replace(/([a-z])([A-Z])/g, '$1 $2');

  return `${dataType} ${categoryName} consumption averages ${avgValue.toFixed(1)} MBtu per month. Peak consumption occurred in ${maxMonth} at ${maxValue.toFixed(1)} MBtu, while the lowest was in ${minMonth} at ${minValue.toFixed(1)} MBtu.`;
}

function generateOverallInsights(
  currentTotals: Record<string, number>,
  futureTotals: Record<string, number>,
  currentMonthly: Array<Record<string, string | number>>,
  selectedCategory: string
): string {
  if (Object.keys(currentTotals).length === 0) {
    return "No data available to summarize.";
  }

  const currentTotal = Object.values(currentTotals).reduce((sum, val) => sum + val, 0);
  const futureTotal = Object.values(futureTotals).reduce((sum, val) => sum + val, 0);
  const reduction = currentTotal > 0 ? ((currentTotal - futureTotal) / currentTotal * 100).toFixed(1) : 0;

  // Find dominant category
  const dominantCategory = Object.entries(currentTotals)
    .sort(([, a], [, b]) => b - a)[0];
  const dominantName = dominantCategory[0].replace(' (MBtu)', '').replace(/([a-z])([A-Z])/g, '$1 $2');
  const dominantPercent = ((dominantCategory[1] / currentTotal) * 100).toFixed(1);

  // Analyze seasonal patterns if monthly data available
  let seasonalPattern = "";
  if (currentMonthly.length > 0 && selectedCategory !== "Select a category") {
    const categoryValues = currentMonthly.map(d => (d[selectedCategory] as number) || 0);
    const summerAvg = categoryValues.slice(5, 8).reduce((a, b) => a + b, 0) / 3; // Jun, Jul, Aug
    const winterAvg = (categoryValues.slice(0, 3).reduce((a, b) => a + b, 0) + 
                       categoryValues.slice(9, 12).reduce((a, b) => a + b, 0)) / 5; // Dec, Jan, Feb, Oct, Nov
    if (summerAvg > winterAvg * 1.2) {
      seasonalPattern = " Energy use shows a gradual upward trend during summer months, mainly driven by cooling loads.";
    } else if (winterAvg > summerAvg * 1.2) {
      seasonalPattern = " Energy use shows higher consumption during winter months, primarily driven by heating loads.";
    } else {
      seasonalPattern = " Consumption remains relatively stable across seasons.";
    }
  }

  return `Energy use shows a ${reduction}% projected reduction from current to future scenarios. The dominant category is ${dominantName}, representing ${dominantPercent}% of total consumption.${seasonalPattern} The projected reduction suggests potential for energy efficiency improvements across multiple categories.`;
}

function generateRecommendations(
  currentTotals: Record<string, number>,
  futureTotals: Record<string, number>,
  currentMonthly: Array<Record<string, string | number>>
): string {
  if (Object.keys(currentTotals).length === 0) {
    return "No recommendations available without data.";
  }

  const currentTotal = Object.values(currentTotals).reduce((sum, val) => sum + val, 0);
  const futureTotal = Object.values(futureTotals).reduce((sum, val) => sum + val, 0);
  const reduction = currentTotal > 0 ? ((currentTotal - futureTotal) / currentTotal * 100) : 0;

  // Find categories with highest values
  const topCategories = Object.entries(currentTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([cat]) => cat.replace(' (MBtu)', '').replace(/([a-z])([A-Z])/g, '$1 $2'));

  const recommendations: string[] = [];

  if (reduction > 0) {
    recommendations.push(`Focus on maintaining the projected ${reduction.toFixed(1)}% reduction through the identified efficiency measures.`);
  }

  if (topCategories.length > 0) {
    recommendations.push(`Consider optimizing ${topCategories.join(' and ')}, where values are consistently highest.`);
  }

  if (currentMonthly.length > 0) {
    // Check for peak months
    const allMonthlyTotals = currentMonthly.map(month => 
      Object.entries(month)
        .filter(([key]) => keys.includes(key))
        .reduce((sum, [, val]) => sum + ((val as number) || 0), 0)
    );
    const maxMonthIndex = allMonthlyTotals.indexOf(Math.max(...allMonthlyTotals));
    const maxMonth = currentMonthly[maxMonthIndex]?.month || 'Unknown';
    recommendations.push(`Investigate factors contributing to peak consumption in ${maxMonth} to identify optimization opportunities.`);
  }

  if (recommendations.length === 0) {
    return "Continue monitoring energy consumption patterns and explore opportunities for efficiency improvements across all categories.";
  }

  return recommendations.join(' ');
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
  const [annualInsight, setAnnualInsight] = useState<string>("");
  const [pieInsight, setPieInsight] = useState<string>("");
  const [lineInsight, setLineInsight] = useState<string>("");
  const [overallInsight, setOverallInsight] = useState<string>("");

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
      'designEnergyCode', 'targetEUI'
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

    // Generate insights
    setAnnualInsight(generateAnnualInsights(currentTotals, futureTotals));
    setPieInsight(generatePieInsights(
      pieDataType === "Current" ? currentTotals : futureTotals,
      pieDataType
    ));
    
    if (selectedCategory !== "Select a category") {
      const monthlyData = pieDataType === "Current" ? currentMonthly : (futureMonthly || []);
      setLineInsight(generateLineInsights(selectedCategory, monthlyData, pieDataType));
    } else {
      setLineInsight("Select a category to view monthly trend insights.");
    }

    // Generate overall insights
    setOverallInsight(generateOverallInsights(
      currentTotals,
      futureTotals,
      currentMonthly,
      selectedCategory
    ));

    drawAnnualChart(annualChartData);
    drawPieChart(pieDataType, pieDataType === "Current" ? currentTotals : futureTotals);
    
    // Only show placeholder if no category is selected, otherwise draw the line chart
    if (selectedCategory === "Select a category") {
      setupLineChart();
    } else {
      showMonthlyTrend(selectedCategory);
    }
  }, [currentTotals, futureTotals, pieDataType, selectedCategory, currentMonthly, futureMonthly]);

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
      .attr("overflow", "visible")
      .style("overflow", "visible")
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
      .attr("overflow", "visible")
      .style("overflow", "visible")
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
    
    // Update line chart insight
    const monthlyData = pieDataType === "Current" ? currentMonthly : (futureMonthly || []);
    setLineInsight(generateLineInsights(category, monthlyData, pieDataType));
    
    if (!lineChartRef.current) return;
    lineChartRef.current.innerHTML = '';

    // Increased margins to accommodate all text labels (especially Y-axis label)
    const margin = { top: 40, right: 80, bottom: 80, left: 90 };
    const width = 800 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Increase SVG dimensions to accommodate rotated Y-axis label and all text
    const svgWidth = width + margin.left + margin.right + 50; // Extra space for Y-axis label
    const svgHeight = height + margin.top + margin.bottom + 50; // Extra space for labels
    
    const svg = d3.select(lineChartRef.current)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("overflow", "visible")
      .style("overflow", "visible")
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
      .attr("y", -75)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .text("Energy Consumption (MBtu)");

    // Position legend further left to ensure it fits within SVG bounds
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 10}, 0)`);

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
      
      // Update insights
      setPieInsight(generatePieInsights(
        dataType === "Current" ? currentTotals : futureTotals,
        dataType
      ));
      
      if (selectedCategory !== "Select a category") {
        const monthlyData = dataType === "Current" ? currentMonthly : (futureMonthly || []);
        setLineInsight(generateLineInsights(selectedCategory, monthlyData, dataType));
      }
      
      // Update overall insights
      setOverallInsight(generateOverallInsights(
        currentTotals,
        futureTotals,
        currentMonthly,
        selectedCategory
      ));
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
    'targetEUI': 'Target EUI'
  };

  const generateFullReport = async () => {
    try {
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Energy Analysis Dashboard Report', margin, yPosition);
      yPosition += 10;

      // Timestamp
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const timestamp = new Date().toLocaleString();
      pdf.text(`Generated: ${timestamp}`, margin, yPosition);
      yPosition += 15;

      // Capture and add Annual Chart
      if (annualChartRef.current) {
        yPosition += 10;
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Annual Energy Comparison', margin, yPosition);
        yPosition += 15;

        const annualCanvas = await html2canvas(annualChartRef.current, {
          backgroundColor: '#ffffff',
          scale: 3,
          logging: false,
          useCORS: true,
          allowTaint: true,
          windowWidth: annualChartRef.current.scrollWidth,
          windowHeight: annualChartRef.current.scrollHeight,
          x: 0,
          y: 0,
          width: annualChartRef.current.scrollWidth,
          height: annualChartRef.current.scrollHeight
        });
        const annualImgData = annualCanvas.toDataURL('image/png');
        
        const chartWidthPercent = 0.75;
        const annualImgWidth = (pageWidth - (margin * 2)) * chartWidthPercent;
        const annualImgHeight = (annualCanvas.height * annualImgWidth) / annualCanvas.width;
        
        const annualXPosition = (pageWidth - annualImgWidth) / 2;
        
        if (yPosition + annualImgHeight + 20 > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.addImage(annualImgData, 'PNG', annualXPosition, yPosition, annualImgWidth, annualImgHeight);
        yPosition += annualImgHeight + 15;

        // Annual insight
        if (annualInsight) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const splitInsight = pdf.splitTextToSize(annualInsight, contentWidth);
          if (yPosition + splitInsight.length * 5 > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(splitInsight, margin, yPosition);
          yPosition += splitInsight.length * 5 + 10;
        }
      }

      // Capture and add Pie Chart
      if (pieChartRef.current) {
        const textColumnWidth = contentWidth * 0.35;
        const chartColumnWidth = contentWidth * 0.65;
        const columnGap = 10;

        const pieCanvas = await html2canvas(pieChartRef.current, {
          backgroundColor: '#ffffff',
          scale: 3,
          logging: false,
          useCORS: true,
          allowTaint: true,
          windowWidth: pieChartRef.current.scrollWidth,
          windowHeight: pieChartRef.current.scrollHeight,
          x: 0,
          y: 0,
          width: pieChartRef.current.scrollWidth,
          height: pieChartRef.current.scrollHeight
        });
        const pieImgData = pieCanvas.toDataURL('image/png');
        
        const desiredPieWidth = chartColumnWidth;
        const pieImgHeight = (pieCanvas.height * desiredPieWidth) / pieCanvas.width;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const pieInsightSplitText = pieInsight ? pdf.splitTextToSize(pieInsight, textColumnWidth) : [];
        const pieInsightTextHeight = pieInsightSplitText.length * 5;

        const sectionTitleHeight = 10;
        const estimatedContentHeight = Math.max(pieInsightTextHeight, pieImgHeight);
        const estimatedSectionHeight = sectionTitleHeight + estimatedContentHeight + 20;

        if (yPosition + estimatedSectionHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Energy Use by Category (${pieDataType})`, margin, yPosition);
        let currentContentY = yPosition + sectionTitleHeight;

        if (pieInsight) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(pieInsightSplitText, margin, currentContentY);
        }

        const pieChartX = margin + textColumnWidth + columnGap;
        pdf.addImage(pieImgData, 'PNG', pieChartX, currentContentY, desiredPieWidth, pieImgHeight);
        
        yPosition = Math.max(currentContentY + pieInsightTextHeight, currentContentY + pieImgHeight) + 10;
      }

      // Capture and add Line Chart
      if (lineChartRef.current && selectedCategory !== "Select a category") {
        yPosition += 10;
        
        if (yPosition + 100 > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Monthly Trend: ${selectedCategory}`, margin, yPosition);
        yPosition += 15;

        // Capture chart with better settings to avoid text cutoff
        // Wait for animations to complete and ensure all elements are rendered
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Get the actual bounding box of the SVG content to ensure full capture
        const svgElement = lineChartRef.current.querySelector('svg') as SVGSVGElement | null;
        let captureWidth = lineChartRef.current.scrollWidth || lineChartRef.current.offsetWidth;
        let captureHeight = lineChartRef.current.scrollHeight || lineChartRef.current.offsetHeight;
        
        if (svgElement) {
          try {
            const bbox = svgElement.getBBox();
            // Add extra padding (150px) to ensure all text labels are captured
            captureWidth = Math.max(captureWidth, bbox.width + bbox.x + 150);
            captureHeight = Math.max(captureHeight, bbox.height + bbox.y + 150);
          } catch (e) {
            // If getBBox fails, use current dimensions with extra padding
            captureWidth = captureWidth + 150;
            captureHeight = captureHeight + 150;
          }
        } else {
          // Add padding if SVG not found
          captureWidth = captureWidth + 150;
          captureHeight = captureHeight + 150;
        }
        
        // Ensure container has proper overflow settings before capture
        if (lineChartRef.current) {
          lineChartRef.current.style.overflow = 'visible';
          lineChartRef.current.style.overflowX = 'visible';
          lineChartRef.current.style.overflowY = 'visible';
        }
        
        const lineCanvas = await html2canvas(lineChartRef.current!, {
          backgroundColor: '#ffffff',
          scale: 3,
          logging: false,
          useCORS: true,
          allowTaint: true,
          removeContainer: false,
          width: captureWidth,
          height: captureHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            // Ensure container doesn't clip
            const container = clonedDoc.querySelector('[ref="lineChartRef"]') || 
              clonedDoc.body.querySelector('[data-chart="line"]') ||
              lineChartRef.current;
            if (container) {
              (container as HTMLElement).style.overflow = 'visible';
              (container as HTMLElement).style.overflowX = 'visible';
              (container as HTMLElement).style.overflowY = 'visible';
            }
            
            // Ensure all SVG elements are visible and properly sized
            const svgs = clonedDoc.querySelectorAll('svg');
            svgs.forEach((svg: SVGElement) => {
              svg.style.overflow = 'visible';
              svg.setAttribute('overflow', 'visible');
              // Ensure parent container doesn't clip
              const parent = svg.parentElement;
              if (parent) {
                parent.style.overflow = 'visible';
                parent.style.overflowX = 'visible';
                parent.style.overflowY = 'visible';
              }
            });
            // Ensure all text elements are visible
            const textElements = clonedDoc.querySelectorAll('text');
            textElements.forEach((text: SVGTextElement) => {
              text.style.visibility = 'visible';
              text.style.display = 'block';
            });
          }
        });
        const lineImgData = lineCanvas.toDataURL('image/png');
        
        // Make line chart as large as possible - use 95% of available width
        const chartWidthPercent = 0.95;
        const lineImgWidth = (pageWidth - (margin * 2)) * chartWidthPercent;
        const lineImgHeight = (lineCanvas.height * lineImgWidth) / lineCanvas.width;
        
        const lineXPosition = (pageWidth - lineImgWidth) / 2;
        
        if (yPosition + lineImgHeight + 20 > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.addImage(lineImgData, 'PNG', lineXPosition, yPosition, lineImgWidth, lineImgHeight);
        yPosition += lineImgHeight + 15;

        if (lineInsight && lineInsight !== "Select a category to view monthly trend insights.") {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const splitInsight = pdf.splitTextToSize(lineInsight, contentWidth);
          if (yPosition + splitInsight.length * 5 > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(splitInsight, margin, yPosition);
          yPosition += splitInsight.length * 5 + 10;
        }
      }

      // Smart Insights Section
      if (yPosition + 30 > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Smart Insights', margin, yPosition);
      yPosition += 10;

      if (overallInsight) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const splitOverall = pdf.splitTextToSize(overallInsight, contentWidth);
        if (yPosition + splitOverall.length * 5 > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(splitOverall, margin, yPosition);
        yPosition += splitOverall.length * 5 + 10;
      }

      // Save PDF
      pdf.save(`Energy_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
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

        <div ref={lineChartRef} className="w-full mt-8 min-h-[400px]" style={{ overflow: 'visible', overflowX: 'visible', overflowY: 'visible' }}>
          <div className="text-center font-semibold text-xl mb-6 text-gray-800" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            Monthly Trend: <span>{selectedCategory}</span>
          </div>
        </div>

        {/* Smart Insights Section */}
        {(annualInsight || pieInsight || lineInsight || overallInsight) && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
              Smart Insights
            </h3>

            <div className="space-y-6">
              {/* Chart Summaries */}
              <div className="space-y-4">
                {annualInsight && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Annual Energy Comparison</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{annualInsight}</p>
                  </div>
                )}

                {pieInsight && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Energy Use by Category</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{pieInsight}</p>
                  </div>
                )}

                {lineInsight && lineInsight !== "Select a category to view monthly trend insights." && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Monthly Trend Analysis</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{lineInsight}</p>
                  </div>
                )}
              </div>

              {/* Overall Insights */}
              {overallInsight && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Overall Summary</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{overallInsight}</p>
                </div>
              )}
            </div>

            {/* Generate Report Button */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={generateFullReport}
                className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors font-medium text-sm"
                style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
              >
                Generate Report (PDF)
              </button>
            </div>
          </div>
        )}

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

