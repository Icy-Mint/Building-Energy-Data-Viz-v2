# Energy Analysis Viz

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![React](https://img.shields.io/badge/React-18.3-blue)

**Transform CSV energy data into interactive dashboards with AI-powered insights**

[Features](#features) • [Installation](#installation) • [Usage](#usage-guide) • [API](#api-endpoints) • [Deployment](#deployment-instructions)

</div>

---

## Table of Contents

- [Description](#description--overview)
- [Sample Dashboard](#sample-dashboard)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Scripts / Commands](#scripts--commands)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment-instructions)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Description / Overview

**Energy Analysis Viz** is a modern web application designed to transform CSV energy data into interactive, visually compelling dashboards. Built with Next.js 14 and TypeScript, it provides a seamless workflow for uploading, parsing, and visualizing energy consumption data with an integrated AI chatbot assistant for intelligent data interpretation.

The application generates comprehensive visualizations including annual comparisons, category breakdowns, and monthly trend analysis. The AI-powered chatbot helps users understand their data, interpret charts, and discover insights.

### Key Highlights

- **Fast & Modern**: Built with Next.js 14 for optimal performance and SEO
- **Interactive Visualizations**: Multiple chart types powered by D3.js and Recharts
- **AI Assistant**: Integrated chatbot for data interpretation and guidance
- **Responsive Design**: Beautiful UI built with Tailwind CSS
- **Type-Safe**: Full TypeScript implementation for reliability
- **Export Capabilities**: Generate PDF reports from your dashboards
- **Server-Side Rendering**: Optimized performance with Next.js App Router

---

## Sample Dashboard

The Energy Visualization Dashboard provides a comprehensive view of building energy consumption data through three interactive charts arranged in a 2x1 grid layout:



![Dashboard Graph](/images/dashboard_sample.png)

### 1. Current vs Future Energy Consumption (Stacked Bar Chart)
- **Location**: Top-left
- **Purpose**: Compare annual energy consumption between current and future scenarios
- **Y-axis**: Annual Energy Consumption (Million BTU), ranging from 0 to 6,000
- **X-axis**: Energy Scenario (Current and Future)
- **Features**:
  - Stacked bars showing breakdown by energy category
  - Color-coded segments for each energy type:
    - Interior Lighting (Light Red/Pink)
    - Receptacle Equipment (Light Green) - typically the largest component
    - Space Heating (Red/Coral)
    - Service Water Heating (Yellow)
    - Space Cooling (Light Blue)
    - Heat Rejection (Grey-blue)
    - Interior Central Fans (Light Purple)
    - Interior Local Fans (Orange)
    - Exhaust Fans (Pink)
    - Pumps (Light Grey)
  - Visual comparison of total consumption reduction between scenarios

### 2. Current Energy Consumption (Donut Chart)
- **Location**: Top-right
- **Purpose**: Visualize percentage breakdown of current energy consumption by category
- **Features**:
  - Center label showing "Current"
  - Segments sized proportionally to consumption percentage
  - Major segments display percentage labels (e.g., Receptacle Equipment: 40.4%, Interior Lighting: 26.5%, Space Heating: 15.1%)
  - Same color scheme as stacked bar chart for consistency
  - Quick identification of dominant energy consumption categories

### 3. Monthly Energy Consumption (Line Chart)
- **Location**: Bottom (full width)
- **Purpose**: Display time-series trends showing monthly variation in energy consumption
- **Y-axis**: Energy Consumption (MBtu), ranging from 0 to 1000
- **X-axis**: Month (January through December)
- **Data**: Yearly consumption in MBtu for an office building in New York City
- **Features**:
  - **Dual-line visualization**:
    - Current scenario (Light Green line `#B7E4C7` with data points)
    - Future scenario (Darker Green line `#52B788` with data points)
  - **Seasonal shading**:
    - Heating Season (warm background): January-April and October-December
    - Cooling Season (light green background `#C7E7D8`): May-September
  - **Smooth curved lines** connecting all data points with cubic Bézier curves
  - **Interactive features**:
    - Horizontal grid lines for all Y-axis values (0, 200, 400, 600, 800, 1000)
    - Dynamic tooltip on hover showing Current and Future values
    - Smooth line drawing animation on initial load
  - **Trend analysis**: Shows peak consumption periods and seasonal patterns
  - **Reduction visualization**: Future line consistently below current line, demonstrating projected energy savings

### Dashboard Insights

The dashboard enables users to:
- **Compare scenarios**: Understand the impact of energy efficiency improvements
- **Identify patterns**: Recognize seasonal consumption trends and peak usage periods
- **Analyze categories**: Determine which energy end-uses consume the most energy
- **Track progress**: Monitor monthly variations and year-over-year changes
- **Make decisions**: Use data-driven insights for energy management and optimization

---

## Features

### Core Functionality

- **CSV Upload & Parsing**
  - Drag-and-drop file upload interface
  - Automatic header detection and data normalization
  - Real-time data preview before processing

- **Interactive Dashboard**
  - **Annual Comparison Charts**: Side-by-side visualization of current vs. future energy scenarios
  - **Category Breakdown**: Pie charts showing energy consumption by category
  - **Monthly Trends**: Line charts displaying time-series data for selected categories
  - **Project Information**: Comprehensive metadata display and management
  - **Data Insights**: AI-generated insights and recommendations

- **AI Chatbot Assistant**
  - Floating chat interface accessible from the dashboard
  - Contextual help for dashboard navigation
  - Chart interpretation guidance
  - Trend analysis suggestions
  - Anomaly detection tips

- **Export & Reporting**
  - PDF generation from dashboard views
  - Chart export capabilities
  - Data summary reports

### User Experience

- Clean, intuitive interface with smooth animations
- Responsive design for desktop and tablet devices
- Real-time data validation and error handling
- Session-based data persistence
- Quick navigation between upload, dashboard, and home pages

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.0 | React framework with App Router |
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.9.3 | Type safety |
| **Tailwind CSS** | 3.4.12 | Styling |
| **D3.js** | 7.9.0 | Data visualization |
| **Recharts** | 2.13.0 | Chart components |
| **PapaParse** | 5.4.1 | CSV parsing |
| **jsPDF** | 3.0.3 | PDF generation |
| **html2canvas** | 1.4.1 | Canvas rendering |
| **Zod** | 3.23.8 | Schema validation |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 14.2.0 | Serverless API endpoints |
| **Node.js** | - | Runtime environment |
| **TypeScript** | 5.9.3 | Type safety |
| **OpenAI API** | - | AI chatbot integration (via API routes) |

### Development Tools

- **Concurrently**: Run multiple npm scripts simultaneously
- **PostCSS & Autoprefixer**: CSS processing
- **ESLint** (if configured): Code linting

---

## Installation

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn**
- **OpenAI API Key** (for chatbot functionality)

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd EnergyAnalysisViz
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

> **Important**: Replace `your_openai_api_key_here` with your actual OpenAI API key. You can obtain one from [OpenAI's Platform](https://platform.openai.com/api-keys).

#### 4. Verify Installation

Check that all dependencies are installed correctly:

```bash
npm list --depth=0
```

---

## Usage Guide

### Starting the Application

Start the Next.js development server:

```bash
npm run dev
```

This command starts:
- **Next.js Application** on `http://localhost:3000`
- **API Routes** are automatically available at `http://localhost:3000/api/*`

### Using the Application

#### 1. **Landing Page**
   - Navigate to the home page (`/`) to view the interactive energy visualization
   - Scroll down to explore features and the dynamic chart
   - Click "Import Data" or "Get a Demo" to get started

#### 2. **Upload CSV Data**
   - Go to the Upload page (`/upload`)
   - Upload your CSV file(s):
     - **Current Scenario**: Required
     - **Future Scenario**: Optional (for comparison)
   - Fill in project metadata (name, square footage, location, etc.)
   - Click "Process and View Dashboard"

#### 3. **Explore the Dashboard**
   - Navigate to the Dashboard page (`/dashboard`)
   - View annual energy consumption comparisons
   - Switch between Current and Future scenarios
   - Select categories to view monthly trends
   - Review AI-generated insights
   - Export charts as PDF

#### 4. **Interact with the Chatbot**
   - Click the floating chat button (bottom-right corner)
   - Ask questions about:
     - How to interpret charts
     - Understanding trends in your data
     - Comparing energy categories
     - Identifying anomalies
   - The chatbot provides contextual, helpful responses

### Example Questions for the Chatbot

- "What is the largest energy consumption category?"
- "How do I interpret a line chart?"
- "What should I look for in monthly trends?"
- "How can I compare current vs future scenarios?"
- "What are common anomalies in energy data?"

---

## Project Structure

```
EnergyAnalysisViz/
│
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   │   ├── chat/         # Chat API endpoint
│   │   └── auth/         # Authentication routes
│   ├── dashboard/        # Dashboard page
│   │   └── page.tsx
│   ├── upload/           # Upload page
│   │   └── page.tsx
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home/Landing page
│   └── globals.css       # Global styles
│
├── components/           # React components
│   ├── Chatbot.tsx       # AI chatbot component
│   ├── Dashboard.tsx     # Dashboard component
│   ├── EnergyChart.tsx   # Interactive chart component
│   ├── EnergyDashboard.tsx  # Main dashboard logic
│   ├── Landing.tsx       # Landing page component
│   └── Upload.tsx        # File upload component
│
├── public/               # Static assets
│   └── images/           # Image files
│       └── dashboard_sample.png
│
├── .env.local            # Environment variables (not in git)
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies & scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

### Key Files Explained

- **`app/page.tsx`**: Home/Landing page entry point
- **`app/layout.tsx`**: Root layout with metadata and global styles
- **`app/dashboard/page.tsx`**: Dashboard page route
- **`app/upload/page.tsx`**: Upload page route
- **`app/api/chat/`**: Chat API route handler (Next.js API route)
- **`components/Landing.tsx`**: Landing page with interactive visualizations
- **`components/Dashboard.tsx`**: Main dashboard component
- **`components/EnergyChart.tsx`**: Interactive energy consumption chart
- **`components/Chatbot.tsx`**: Floating chatbot UI component
- **`components/EnergyDashboard.tsx`**: Core dashboard logic and visualizations

---

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | **Required** |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-4o-mini` |

> **Note**: `.env.local` is automatically ignored by git. Never commit your API keys.

### Tailwind CSS Configuration

The project uses Tailwind CSS with a custom configuration. Modify `tailwind.config.js` to customize:

- Color schemes
- Font families
- Breakpoints
- Custom utilities

### Next.js Configuration

The `next.config.js` file configures:

- React strict mode
- Build options
- Image optimization settings

Modify as needed for your deployment requirements.

---

## Scripts / Commands

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js development server on `http://localhost:3000` |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server (after `npm run build`) |
| `npm run lint` | Run ESLint to check for code issues |

### Example Workflow

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

---

## API Endpoints

### Base URL

- **Development**: `http://localhost:3000`
- **Production**: Your deployed Next.js application URL

### Endpoints

#### `POST /api/chat`

Send a message to the AI chatbot.

**Request Body:**
```json
{
  "message": "What is the largest energy consumption category?"
}
```

**Response:**
```json
{
  "reply": "Based on typical energy dashboards, the largest consumption category is usually Space Heating or Space Cooling, depending on your climate zone. To identify the largest category in your specific dashboard, look at the pie chart or annual comparison chart..."
}
```

**Error Response:**
```json
{
  "error": "Failed to process chat message",
  "reply": "I apologize, but I encountered an error. Please try again later."
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad request (missing or invalid message)
- `500`: Server error

> **Note**: Next.js API routes are serverless functions that automatically handle routing. The chat endpoint is available at `/api/chat` when the application is running.

---

## Deployment Instructions

### Recommended: Vercel Deployment

Next.js applications are optimized for Vercel deployment:

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub/GitLab repository
   - Vercel will auto-detect Next.js

2. **Configure environment variables:**
   - Add `OPENAI_API_KEY` in Vercel dashboard
   - Add `OPENAI_MODEL` (optional, defaults to `gpt-4o-mini`)

3. **Deploy:**
   - Vercel will automatically build and deploy
   - Your app will be available at `your-app.vercel.app`

#### Vercel CLI Alternative

```bash
npm install -g vercel
vercel
```

### Other Platforms (Netlify, Railway, etc.)

#### Netlify

1. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment variables:**
   - Add `OPENAI_API_KEY` in Netlify dashboard

3. **Deploy:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

#### Railway

1. Connect your repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables in Railway dashboard

#### Docker Deployment (Optional)

Create a `Dockerfile` in the root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

> **Note**: For Docker, you may need to configure `output: 'standalone'` in `next.config.js`.

### Production Checklist

- [ ] Set `OPENAI_API_KEY` in your deployment platform's environment variables
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Configure custom domain (optional)
- [ ] Set up error logging and monitoring
- [ ] Test chatbot functionality with production API key
- [ ] Verify all API routes are working correctly

---

## Troubleshooting

### Common Issues

#### Development Server Not Starting

**Problem**: Next.js dev server fails to start or crashes immediately.

**Solutions**:
- Verify Node.js version: `node --version` (should be 18+)
- Check if port 3000 is already in use:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  
  # Mac/Linux
  lsof -i :3000
  ```
- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npx tsc --noEmit`
- Clear Next.js cache: `rm -rf .next` (or `rmdir /s .next` on Windows)

#### Chatbot Not Responding

**Problem**: Chatbot shows error messages or doesn't respond.

**Solutions**:
- Verify `OPENAI_API_KEY` is set correctly in `.env.local`
- Ensure the file is named `.env.local` (not `.env`)
- Restart the development server after changing environment variables
- Check browser console for errors
- Verify the API route exists at `app/api/chat/route.ts` (or similar)
- Test the API directly:
  ```bash
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"test"}'
  ```

#### CSV Upload Fails

**Problem**: CSV file upload doesn't work or data isn't parsed correctly.

**Solutions**:
- Verify CSV format matches expected structure
- Check browser console for parsing errors
- Ensure file is valid CSV (comma-separated)
- Try a different CSV file to isolate the issue

#### Build Errors

**Problem**: `npm run build` fails with TypeScript or other errors.

**Solutions**:
- Run type checking: `npx tsc --noEmit`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing dependencies
- Verify all environment variables are set

#### Build Errors

**Problem**: `npm run build` fails with TypeScript or other errors.

**Solutions**:
- Run type checking: `npx tsc --noEmit`
- Clear Next.js cache: `rm -rf .next` (or `rmdir /s .next` on Windows)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing dependencies
- Verify all environment variables are set (if required at build time)

### Getting Help

If you encounter issues not covered here:

1. Check the browser console for error messages
2. Review server logs for backend errors
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed
5. Check that both frontend and backend are running

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Energy Analysis Viz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Made with care for energy analysis and visualization**

Star this repo if you find it helpful!

</div>

</div>
