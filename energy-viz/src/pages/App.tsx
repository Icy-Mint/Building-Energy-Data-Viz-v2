import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EnergyChart from '../components/EnergyChart';

export default function App() {
  return (
    <>
      <style>{`
        /* Original animations */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-20px) translateX(0px); }
          75% { transform: translateY(-10px) translateX(-5px); }
        }
        
        /* New large global animations */
        @keyframes gradient-mesh {
          0%, 100% { 
            background-position: 0% 0%, 100% 100%, 0% 100%, 100% 0%;
            filter: hue-rotate(0deg);
          }
          25% { 
            background-position: 100% 0%, 0% 100%, 100% 100%, 0% 0%;
            filter: hue-rotate(90deg);
          }
          50% { 
            background-position: 100% 100%, 0% 0%, 100% 0%, 0% 100%;
            filter: hue-rotate(180deg);
          }
          75% { 
            background-position: 0% 100%, 100% 0%, 0% 0%, 100% 100%;
            filter: hue-rotate(270deg);
          }
        }
        
        @keyframes float-energy-1 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.2;
          }
          25% { 
            transform: translate(30px, -40px) rotate(90deg) scale(1.1);
            opacity: 0.3;
          }
          50% { 
            transform: translate(60px, -20px) rotate(180deg) scale(0.9);
            opacity: 0.25;
          }
          75% { 
            transform: translate(20px, -60px) rotate(270deg) scale(1.05);
            opacity: 0.35;
          }
        }
        
        @keyframes float-energy-2 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.25;
          }
          33% { 
            transform: translate(-40px, 30px) rotate(120deg) scale(1.2);
            opacity: 0.3;
          }
          66% { 
            transform: translate(-20px, 50px) rotate(240deg) scale(0.8);
            opacity: 0.2;
          }
        }
        
        @keyframes float-energy-3 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.15;
          }
          50% { 
            transform: translate(25px, -35px) rotate(180deg) scale(1.3);
            opacity: 0.25;
          }
        }
        
        @keyframes float-energy-4 {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.2;
          }
          40% { 
            transform: translate(-30px, 20px) rotate(144deg) scale(1.1);
            opacity: 0.3;
          }
          80% { 
            transform: translate(-10px, 40px) rotate(288deg) scale(0.9);
            opacity: 0.15;
          }
        }
        
        @keyframes particle-1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          25% { 
            transform: translate(20px, -30px) scale(1.5);
            opacity: 0.8;
          }
          50% { 
            transform: translate(40px, -10px) scale(0.8);
            opacity: 0.4;
          }
          75% { 
            transform: translate(10px, -40px) scale(1.2);
            opacity: 0.9;
          }
        }
        
        @keyframes particle-2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          30% { 
            transform: translate(-25px, 35px) scale(1.3);
            opacity: 0.9;
          }
          60% { 
            transform: translate(-45px, 15px) scale(0.7);
            opacity: 0.5;
          }
        }
        
        @keyframes particle-3 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          20% { 
            transform: translate(35px, -25px) scale(1.4);
            opacity: 0.8;
          }
          40% { 
            transform: translate(55px, -5px) scale(0.6);
            opacity: 0.3;
          }
          60% { 
            transform: translate(25px, -45px) scale(1.1);
            opacity: 0.7;
          }
          80% { 
            transform: translate(5px, -35px) scale(0.9);
            opacity: 0.6;
          }
        }
        
        @keyframes particle-4 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: translate(-30px, 25px) scale(1.6);
            opacity: 1;
          }
        }
        
        @keyframes particle-5 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          33% { 
            transform: translate(40px, -20px) scale(1.2);
            opacity: 0.8;
          }
          66% { 
            transform: translate(20px, -40px) scale(0.8);
            opacity: 0.4;
          }
        }
        
        @keyframes particle-6 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.65;
          }
          25% { 
            transform: translate(-35px, 30px) scale(1.3);
            opacity: 0.85;
          }
          50% { 
            transform: translate(-55px, 10px) scale(0.7);
            opacity: 0.45;
          }
          75% { 
            transform: translate(-15px, 50px) scale(1.1);
            opacity: 0.75;
          }
        }
        
        @keyframes wave-1 {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.3;
          }
          50% { 
            transform: scale(1.5) rotate(180deg);
            opacity: 0.1;
          }
        }
        
        @keyframes wave-2 {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.25;
          }
          33% { 
            transform: scale(1.3) rotate(120deg);
            opacity: 0.4;
          }
          66% { 
            transform: scale(0.8) rotate(240deg);
            opacity: 0.15;
          }
        }
        
        @keyframes wave-3 {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.35;
          }
          25% { 
            transform: scale(1.2) rotate(90deg);
            opacity: 0.5;
          }
          50% { 
            transform: scale(1.4) rotate(180deg);
            opacity: 0.2;
          }
          75% { 
            transform: scale(0.9) rotate(270deg);
            opacity: 0.4;
          }
        }
        
        @keyframes grid-line-1 {
          0%, 100% { 
            transform: translateX(-100%);
            opacity: 0.1;
          }
          50% { 
            transform: translateX(100%);
            opacity: 0.3;
          }
        }
        
        @keyframes grid-line-2 {
          0%, 100% { 
            transform: translateX(-100%);
            opacity: 0.1;
          }
          50% { 
            transform: translateX(100%);
            opacity: 0.25;
          }
        }
        
        @keyframes grid-line-3 {
          0%, 100% { 
            transform: translateX(-100%);
            opacity: 0.1;
          }
          50% { 
            transform: translateX(100%);
            opacity: 0.35;
          }
        }
        
        @keyframes grid-line-4 {
          0%, 100% { 
            transform: translateY(-100%);
            opacity: 0.1;
          }
          50% { 
            transform: translateY(100%);
            opacity: 0.3;
          }
        }
        
        @keyframes grid-line-5 {
          0%, 100% { 
            transform: translateY(-100%);
            opacity: 0.1;
          }
          50% { 
            transform: translateY(100%);
            opacity: 0.25;
          }
        }
        
        @keyframes grid-line-6 {
          0%, 100% { 
            transform: translateY(-100%);
            opacity: 0.1;
          }
          50% { 
            transform: translateY(100%);
            opacity: 0.35;
          }
        }
        
        /* Animation classes */
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        .animate-gradient-mesh { 
          animation: gradient-mesh 20s ease-in-out infinite;
          background: linear-gradient(45deg, #ecfdf5, #f0fdfa, #ecfeff, #f0fdfa, #ecfdf5);
          background-size: 400% 400%;
        }
        
        .animate-float-energy-1 { animation: float-energy-1 15s ease-in-out infinite; }
        .animate-float-energy-2 { animation: float-energy-2 18s ease-in-out infinite; }
        .animate-float-energy-3 { animation: float-energy-3 12s ease-in-out infinite; }
        .animate-float-energy-4 { animation: float-energy-4 16s ease-in-out infinite; }
        
        .animate-particle-1 { animation: particle-1 8s ease-in-out infinite; }
        .animate-particle-2 { animation: particle-2 10s ease-in-out infinite; }
        .animate-particle-3 { animation: particle-3 7s ease-in-out infinite; }
        .animate-particle-4 { animation: particle-4 9s ease-in-out infinite; }
        .animate-particle-5 { animation: particle-5 11s ease-in-out infinite; }
        .animate-particle-6 { animation: particle-6 6s ease-in-out infinite; }
        
        .animate-wave-1 { animation: wave-1 14s ease-in-out infinite; }
        .animate-wave-2 { animation: wave-2 16s ease-in-out infinite; }
        .animate-wave-3 { animation: wave-3 12s ease-in-out infinite; }
        
        .animate-grid-line-1 { animation: grid-line-1 8s ease-in-out infinite; }
        .animate-grid-line-2 { animation: grid-line-2 10s ease-in-out infinite; }
        .animate-grid-line-3 { animation: grid-line-3 12s ease-in-out infinite; }
        .animate-grid-line-4 { animation: grid-line-4 9s ease-in-out infinite; }
        .animate-grid-line-5 { animation: grid-line-5 11s ease-in-out infinite; }
        .animate-grid-line-6 { animation: grid-line-6 7s ease-in-out infinite; }
        
        /* Pulsing energy nodes */
        @keyframes pulse-node-1 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.9;
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
        }
        
        @keyframes pulse-node-2 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.7;
            box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4);
          }
          50% { 
            transform: scale(1.3);
            opacity: 1;
            box-shadow: 0 0 0 8px rgba(20, 184, 166, 0);
          }
        }
        
        @keyframes pulse-node-3 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.5;
            box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4);
          }
          50% { 
            transform: scale(1.4);
            opacity: 0.8;
            box-shadow: 0 0 0 12px rgba(6, 182, 212, 0);
          }
        }
        
        @keyframes pulse-node-4 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          50% { 
            transform: scale(1.6);
            opacity: 1;
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
          }
        }
        
        @keyframes pulse-node-5 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.3);
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.9;
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
        }
        
        @keyframes pulse-node-6 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.65;
            box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.3);
          }
          50% { 
            transform: scale(1.3);
            opacity: 0.95;
            box-shadow: 0 0 0 10px rgba(20, 184, 166, 0);
          }
        }
        
        /* Energy connection animations */
        @keyframes connection-1 {
          0%, 100% { 
            stroke-dasharray: 0 100;
            opacity: 0.3;
          }
          50% { 
            stroke-dasharray: 50 50;
            opacity: 0.8;
          }
        }
        
        @keyframes connection-2 {
          0%, 100% { 
            stroke-dasharray: 0 100;
            opacity: 0.2;
          }
          50% { 
            stroke-dasharray: 40 60;
            opacity: 0.6;
          }
        }
        
        @keyframes connection-3 {
          0%, 100% { 
            stroke-dasharray: 0 100;
            opacity: 0.4;
          }
          50% { 
            stroke-dasharray: 60 40;
            opacity: 0.9;
          }
        }
        
        @keyframes connection-4 {
          0%, 100% { 
            stroke-dasharray: 0 100;
            opacity: 0.25;
          }
          50% { 
            stroke-dasharray: 35 65;
            opacity: 0.7;
          }
        }
        
        .animate-pulse-node-1 { animation: pulse-node-1 3s ease-in-out infinite; }
        .animate-pulse-node-2 { animation: pulse-node-2 4s ease-in-out infinite; }
        .animate-pulse-node-3 { animation: pulse-node-3 3.5s ease-in-out infinite; }
        .animate-pulse-node-4 { animation: pulse-node-4 2.5s ease-in-out infinite; }
        .animate-pulse-node-5 { animation: pulse-node-5 4.5s ease-in-out infinite; }
        .animate-pulse-node-6 { animation: pulse-node-6 3.2s ease-in-out infinite; }
        
        .animate-connection-1 { animation: connection-1 6s ease-in-out infinite; }
        .animate-connection-2 { animation: connection-2 8s ease-in-out infinite; }
        .animate-connection-3 { animation: connection-3 5s ease-in-out infinite; }
        .animate-connection-4 { animation: connection-4 7s ease-in-out infinite; }
        
        /* Global Energy Dots Animations */
        @keyframes energy-dot-1 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
            r: 2;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.9;
            r: 3;
          }
        }
        
        @keyframes energy-dot-2 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.7;
            r: 1.5;
          }
          50% { 
            transform: scale(1.3);
            opacity: 1;
            r: 2;
          }
        }
        
        @keyframes energy-dot-3 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.5;
            r: 2.5;
          }
          50% { 
            transform: scale(1.4);
            opacity: 0.8;
            r: 3.5;
          }
        }
        
        @keyframes energy-dot-4 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
            r: 2;
          }
          50% { 
            transform: scale(1.6);
            opacity: 1;
            r: 3.2;
          }
        }
        
        @keyframes energy-dot-5 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.7;
            r: 1.5;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.95;
            r: 1.8;
          }
        }
        
        @keyframes energy-dot-6 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
            r: 2;
          }
          50% { 
            transform: scale(1.3);
            opacity: 0.9;
            r: 2.6;
          }
        }
        
        @keyframes energy-dot-7 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.7;
            r: 1.5;
          }
          50% { 
            transform: scale(1.4);
            opacity: 1;
            r: 2.1;
          }
        }
        
        @keyframes energy-dot-8 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.5;
            r: 2.5;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.8;
            r: 3.75;
          }
        }
        
        @keyframes energy-dot-9 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
            r: 2;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.9;
            r: 2.4;
          }
        }
        
        @keyframes energy-dot-10 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
            r: 2;
          }
          50% { 
            transform: scale(1.3);
            opacity: 0.9;
            r: 2.6;
          }
        }
        
        @keyframes energy-dot-11 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.5;
            r: 2.5;
          }
          50% { 
            transform: scale(1.4);
            opacity: 0.8;
            r: 3.5;
          }
        }
        
        @keyframes energy-dot-12 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.7;
            r: 2;
          }
          50% { 
            transform: scale(1.5);
            opacity: 1;
            r: 3;
          }
        }
        
        @keyframes energy-dot-13 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
            r: 1.5;
          }
          50% { 
            transform: scale(1.6);
            opacity: 1;
            r: 2.4;
          }
        }
        
        @keyframes energy-dot-14 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.6;
            r: 2;
          }
          50% { 
            transform: scale(1.3);
            opacity: 0.9;
            r: 2.6;
          }
        }
        
        @keyframes energy-dot-15 {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.7;
            r: 1.5;
          }
          50% { 
            transform: scale(1.2);
            opacity: 0.95;
            r: 1.8;
          }
        }
        
        /* Energy Flow Line Animations */
        @keyframes energy-flow-1 {
          0%, 100% { 
            stroke-dasharray: 0 200;
            opacity: 0.2;
          }
          50% { 
            stroke-dasharray: 100 100;
            opacity: 0.6;
          }
        }
        
        @keyframes energy-flow-2 {
          0%, 100% { 
            stroke-dasharray: 0 200;
            opacity: 0.15;
          }
          50% { 
            stroke-dasharray: 80 120;
            opacity: 0.5;
          }
        }
        
        @keyframes energy-flow-3 {
          0%, 100% { 
            stroke-dasharray: 0 200;
            opacity: 0.25;
          }
          50% { 
            stroke-dasharray: 120 80;
            opacity: 0.7;
          }
        }
        
        @keyframes energy-flow-4 {
          0%, 100% { 
            stroke-dasharray: 0 200;
            opacity: 0.1;
          }
          50% { 
            stroke-dasharray: 60 140;
            opacity: 0.4;
          }
        }
        
        @keyframes energy-flow-5 {
          0%, 100% { 
            stroke-dasharray: 0 200;
            opacity: 0.2;
          }
          50% { 
            stroke-dasharray: 90 110;
            opacity: 0.6;
          }
        }
        
        @keyframes energy-flow-6 {
          0%, 100% { 
            stroke-dasharray: 0 200;
            opacity: 0.15;
          }
          50% { 
            stroke-dasharray: 70 130;
            opacity: 0.5;
          }
        }
        
        /* Animation Classes for Global Energy Elements */
        .animate-energy-dot-1 { animation: energy-dot-1 4s ease-in-out infinite; }
        .animate-energy-dot-2 { animation: energy-dot-2 5s ease-in-out infinite; }
        .animate-energy-dot-3 { animation: energy-dot-3 3.5s ease-in-out infinite; }
        .animate-energy-dot-4 { animation: energy-dot-4 4.5s ease-in-out infinite; }
        .animate-energy-dot-5 { animation: energy-dot-5 6s ease-in-out infinite; }
        .animate-energy-dot-6 { animation: energy-dot-6 3.8s ease-in-out infinite; }
        .animate-energy-dot-7 { animation: energy-dot-7 4.2s ease-in-out infinite; }
        .animate-energy-dot-8 { animation: energy-dot-8 3.2s ease-in-out infinite; }
        .animate-energy-dot-9 { animation: energy-dot-9 5.5s ease-in-out infinite; }
        .animate-energy-dot-10 { animation: energy-dot-10 4.8s ease-in-out infinite; }
        .animate-energy-dot-11 { animation: energy-dot-11 3.6s ease-in-out infinite; }
        .animate-energy-dot-12 { animation: energy-dot-12 4.6s ease-in-out infinite; }
        .animate-energy-dot-13 { animation: energy-dot-13 5.2s ease-in-out infinite; }
        .animate-energy-dot-14 { animation: energy-dot-14 4.3s ease-in-out infinite; }
        .animate-energy-dot-15 { animation: energy-dot-15 5.8s ease-in-out infinite; }
        .animate-energy-dot-16 { animation: energy-dot-16 4.1s ease-in-out infinite; }
        .animate-energy-dot-17 { animation: energy-dot-17 5.3s ease-in-out infinite; }
        
        /* Globe Glow Animation */
        @keyframes globe-glow {
          0%, 100% { 
            opacity: 0.1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.3;
            transform: scale(1.05);
          }
        }
        
        .animate-globe-glow { animation: globe-glow 12s ease-in-out infinite; }
        
        .animate-energy-flow-1 { animation: energy-flow-1 8s ease-in-out infinite; }
        .animate-energy-flow-2 { animation: energy-flow-2 10s ease-in-out infinite; }
        .animate-energy-flow-3 { animation: energy-flow-3 7s ease-in-out infinite; }
        .animate-energy-flow-4 { animation: energy-flow-4 9s ease-in-out infinite; }
        .animate-energy-flow-5 { animation: energy-flow-5 11s ease-in-out infinite; }
        .animate-energy-flow-6 { animation: energy-flow-6 6s ease-in-out infinite; }
        .animate-energy-flow-7 { animation: energy-flow-7 13s ease-in-out infinite; }
      `}</style>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-emerald-50/40">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-black">GreenGauge</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors py-2">
                Products
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors py-2">
                Solutions
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors py-2">
                Resources
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <Link className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-2" to="/">Enterprise</Link>
            <Link className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-2" to="/">Docs</Link>
            <Link className="text-sm text-gray-600 hover:text-gray-900 transition-colors py-2" to="/">Pricing</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Log In
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              Contact
            </button>
            <button className="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-1 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative overflow-hidden flex items-center justify-center h-[calc(100vh-theme('spacing.16'))]">
          {/* Large Global Animation Background */}
          <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
            {/* 3D Globe Background */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
                {/* Globe Base Circle with Gradient */}
                <defs>
                  <radialGradient id="globeGradient" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#f0fdfa" stopOpacity="1" />
                    <stop offset="50%" stopColor="#ecfdf5" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.6" />
                  </radialGradient>
                  
                  <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.3" />
                  </linearGradient>
                  
                  <filter id="globeShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
                    <feOffset dx="2" dy="2" result="offset"/>
                    <feFlood floodColor="#000000" floodOpacity="0.1"/>
                    <feComposite in2="offset" operator="in"/>
                  </filter>
                </defs>
                
                {/* Globe Base Circle */}
                <circle cx="500" cy="250" r="200" fill="url(#globeGradient)" stroke="#10b981" strokeWidth="2" opacity="0.9" filter="url(#globeShadow)" />
                
                {/* Ocean Areas with Curvature */}
                <g fill="url(#oceanGradient)" opacity="0.7">
                  {/* Atlantic Ocean */}
                  <ellipse cx="500" cy="250" rx="180" ry="120" />
                  {/* Pacific Ocean */}
                  <ellipse cx="500" cy="250" rx="160" ry="140" />
                </g>
                
                {/* Continental Landmasses with 3D Curvature */}
                <g fill="#f8fafc" stroke="#10b981" strokeWidth="1.5" opacity="0.9">
                  {/* North America - Curved */}
                  <path d="M350 180 Q400 160 450 180 Q480 200 500 230 Q520 260 500 290 Q480 320 450 340 Q400 360 350 340 Q300 320 280 290 Q260 260 280 230 Q300 200 350 180 Z" />
                  
                  {/* South America - Curved */}
                  <path d="M400 320 Q450 310 500 330 Q520 360 500 400 Q480 440 450 460 Q400 470 350 450 Q300 430 280 400 Q260 360 280 330 Q300 320 400 320 Z" />
                  
                  {/* Europe - Curved */}
                  <path d="M550 160 Q600 150 650 160 Q670 180 650 200 Q630 220 600 210 Q570 200 550 180 Q550 160 Z" />
                  
                  {/* Africa - Curved */}
                  <path d="M600 200 Q650 190 700 210 Q720 250 700 290 Q680 330 650 350 Q600 360 550 340 Q530 300 550 260 Q600 200 Z" />
                  
                  {/* Asia - Curved */}
                  <path d="M650 140 Q750 130 800 150 Q830 180 820 220 Q800 260 750 280 Q700 300 650 290 Q600 280 550 260 Q530 220 550 180 Q600 160 650 140 Z" />
                  
                  {/* Australia - Curved */}
                  <path d="M700 350 Q750 340 800 350 Q820 370 800 390 Q770 410 720 400 Q700 390 680 370 Q700 350 Z" />
                </g>
                
                {/* Globe Highlight for 3D Effect */}
                <ellipse cx="450" cy="200" rx="60" ry="40" fill="#ffffff" opacity="0.6" />
                
                {/* Continental Shelf Lines */}
                <g stroke="#14b8a6" strokeWidth="1" opacity="0.7" fill="none">
                  <path d="M350 180 Q400 160 450 180" />
                  <path d="M450 180 Q500 200 550 180" />
                  <path d="M550 180 Q600 170 650 180" />
                  <path d="M650 180 Q700 190 750 180" />
                </g>
                
                {/* Energy Distribution Dots on Globe Surface */}
                <g className="energy-dots">
                  {/* North America Energy Points - Positioned on globe */}
                  <circle cx="400" cy="200" r="3" fill="#10b981" opacity="0.9" className="animate-energy-dot-1" />
                  <circle cx="420" cy="220" r="2.5" fill="#14b8a6" opacity="1" className="animate-energy-dot-2" />
                  <circle cx="380" cy="240" r="4" fill="#06b6d4" opacity="0.8" className="animate-energy-dot-3" />
                  <circle cx="360" cy="280" r="3" fill="#10b981" opacity="0.9" className="animate-energy-dot-4" />
                  
                  {/* South America Energy Points */}
                  <circle cx="420" cy="380" r="3" fill="#10b981" opacity="0.9" className="animate-energy-dot-5" />
                  <circle cx="450" cy="400" r="2.5" fill="#14b8a6" opacity="1" className="animate-energy-dot-6" />
                  
                  {/* Europe Energy Points */}
                  <circle cx="580" cy="180" r="3" fill="#10b981" opacity="0.9" className="animate-energy-dot-7" />
                  <circle cx="600" cy="200" r="2.5" fill="#14b8a6" opacity="1" className="animate-energy-dot-8" />
                  <circle cx="620" cy="220" r="3" fill="#06b6d4" opacity="1" className="animate-energy-dot-9" />
                  
                  {/* Africa Energy Points */}
                  <circle cx="620" cy="280" r="4" fill="#10b981" opacity="0.8" className="animate-energy-dot-10" />
                  <circle cx="640" cy="320" r="3" fill="#14b8a6" opacity="0.9" className="animate-energy-dot-11" />
                  
                  {/* Asia Energy Points */}
                  <circle cx="700" cy="180" r="3" fill="#10b981" opacity="0.9" className="animate-energy-dot-12" />
                  <circle cx="750" cy="200" r="4" fill="#14b8a6" opacity="0.8" className="animate-energy-dot-13" />
                  <circle cx="780" cy="240" r="3" fill="#06b6d4" opacity="1" className="animate-energy-dot-14" />
                  <circle cx="720" cy="280" r="2.5" fill="#3b82f6" opacity="1" className="animate-energy-dot-15" />
                  
                  {/* Australia Energy Points */}
                  <circle cx="750" cy="380" r="3" fill="#10b981" opacity="0.9" className="animate-energy-dot-16" />
                  <circle cx="780" cy="400" r="2.5" fill="#14b8a6" opacity="1" className="animate-energy-dot-17" />
                </g>
                
                {/* Energy Flow Lines Between Continents - Curved for Globe */}
                <g className="energy-flows" opacity="0.6">
                  {/* North America to Europe */}
                  <path d="M420 220 Q500 200 580 180" stroke="#10b981" strokeWidth="1.2" fill="none" className="animate-energy-flow-1" />
                  
                  {/* Europe to Asia */}
                  <path d="M620 200 Q650 190 700 180" stroke="#14b8a6" strokeWidth="1" fill="none" className="animate-energy-flow-2" />
                  
                  {/* North America to South America */}
                  <path d="M400 200 Q410 300 420 380" stroke="#06b6d4" strokeWidth="0.8" fill="none" className="animate-energy-flow-3" />
                  
                  {/* Europe to Africa */}
                  <path d="M600 200 Q610 240 620 280" stroke="#3b82f6" strokeWidth="0.9" fill="none" className="animate-energy-flow-4" />
                  
                  {/* Asia to Australia */}
                  <path d="M750 200 Q760 290 750 380" stroke="#10b981" strokeWidth="1.1" fill="none" className="animate-energy-flow-5" />
                  
                  {/* Africa to Asia */}
                  <path d="M640 320 Q680 250 720 280" stroke="#14b8a6" strokeWidth="0.7" fill="none" className="animate-energy-flow-6" />
                  
                  {/* Global Energy Network */}
                  <path d="M500 250 Q600 240 700 230" stroke="#06b6d4" strokeWidth="0.5" fill="none" className="animate-energy-flow-7" />
                </g>
                
                {/* Globe Atmosphere/Glow Effect */}
                <circle cx="500" cy="250" r="220" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.4" className="animate-globe-glow" />
                <circle cx="500" cy="250" r="240" fill="none" stroke="#14b8a6" strokeWidth="0.8" opacity="0.3" className="animate-globe-glow" />
              </svg>
          </div>
          
            {/* Animated gradient mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 animate-gradient-mesh" />
            
            {/* Large floating energy orbs */}
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-20 blur-3xl animate-float-energy-1" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-25 blur-3xl animate-float-energy-2" />
            <div className="absolute top-1/4 -right-16 h-80 w-80 rounded-full bg-gradient-to-bl from-teal-300 to-emerald-400 opacity-15 blur-2xl animate-float-energy-3" />
            <div className="absolute bottom-1/4 -left-16 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-300 to-cyan-400 opacity-20 blur-2xl animate-float-energy-4" />
            
            {/* Energy particles */}
            <div className="absolute top-20 left-1/4 w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-particle-1" />
            <div className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-70 animate-particle-2" />
            <div className="absolute bottom-32 left-1/3 w-2.5 h-2.5 bg-cyan-400 rounded-full opacity-50 animate-particle-3" />
            <div className="absolute bottom-20 right-1/4 w-1 h-1 bg-blue-400 rounded-full opacity-80 animate-particle-4" />
            <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-emerald-300 rounded-full opacity-60 animate-particle-5" />
            <div className="absolute top-1/3 right-1/6 w-2 h-2 bg-teal-300 rounded-full opacity-65 animate-particle-6" />
            
            {/* Energy waves */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-emerald-200 rounded-full opacity-30 animate-wave-1" />
              <div className="absolute top-1/2 right-1/4 w-48 h-48 border border-teal-200 rounded-full opacity-25 animate-wave-2" />
              <div className="absolute bottom-1/3 left-1/2 w-56 h-56 border border-cyan-200 rounded-full opacity-35 animate-wave-3" />
            </div>
            
            {/* Energy grid lines */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent animate-grid-line-1" />
              <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent animate-grid-line-2" />
              <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-grid-line-3" />
              <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-300 to-transparent animate-grid-line-4" />
              <div className="absolute top-0 left-1/3 h-full w-px bg-gradient-to-b from-transparent via-teal-300 to-transparent animate-grid-line-5" />
              <div className="absolute top-0 right-1/3 h-full w-px bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-grid-line-6" />
            </div>
            
            {/* Pulsing energy nodes */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-emerald-400 rounded-full opacity-60 animate-pulse-node-1" />
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-teal-400 rounded-full opacity-70 animate-pulse-node-2" />
            <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-cyan-400 rounded-full opacity-50 animate-pulse-node-3" />
            <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-80 animate-pulse-node-4" />
            <div className="absolute top-1/2 left-1/6 w-2 h-2 bg-emerald-300 rounded-full opacity-60 animate-pulse-node-5" />
            <div className="absolute top-2/3 right-1/6 w-1.5 h-1.5 bg-teal-300 rounded-full opacity-65 animate-pulse-node-6" />
            
            {/* Energy connection lines */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="25" y1="25" x2="75" y2="75" stroke="url(#energyGradient1)" strokeWidth="0.5" className="animate-connection-1" />
                <line x1="75" y1="25" x2="25" y2="75" stroke="url(#energyGradient2)" strokeWidth="0.3" className="animate-connection-2" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="url(#energyGradient3)" strokeWidth="0.4" className="animate-connection-3" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="url(#energyGradient4)" strokeWidth="0.3" className="animate-connection-4" />
                <defs>
                  <linearGradient id="energyGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="energyGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity="0" />
                    <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="energyGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="energyGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          
          
          <div className="mx-auto max-w-7xl px-4 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">Climate-first building energy insights</h2>
              <p className="mt-3 text-gray-700 leading-relaxed max-w-3xl mx-auto">Import CSV outputs from energy simulations and explore interactive charts for time-series, end-use breakdowns, and scenario comparisons.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link to="/upload" className="btn-brand">Import Data</Link>
                <Link to="/dashboard" className="btn-ghost">Get a Demo</Link>
              </div>
              {/* KPI row */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center max-w-sm mx-auto">
                <KPI value="0.5m+" label="rows parsed / sec" />
                <KPI value="10+" label="end uses supported" />
                <KPI value=">99%" label="CSV compat" />
              </div>
            </div>
          </div>
          
          {/* Feature list at bottom of hero */}
          <div className="absolute bottom-8 left-0 right-0 max-w-2xl mx-auto px-4 z-10">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <li className="flex items-center gap-3"><Check /> Upload CSVs from various engines</li>
              <li className="flex items-center gap-3"><Check /> Time-series & end-use charts</li>
              <li className="flex items-center gap-3"><Check /> Quick preview tables</li>
              <li className="flex items-center gap-3"><Check /> Lightweight, no backend required</li>
            </ul>
            
            {/* Scroll indicator */}
            <div className="mt-8 flex justify-center">
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <span className="text-xs">Scroll to explore</span>
                <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Chart and Boxes Section */}
        <section className="mx-auto max-w-7xl px-4 pb-20 relative z-20 bg-white">
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
        <section className="mx-auto max-w-7xl px-4 py-20 relative z-20 bg-white">
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
      <footer className="border-t bg-white relative z-20">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Building Energy Analysis</span>
          <a className="hover:underline" href="https://github.com/Icy-Mint/Building-Energy-Data-Visualization" target="_blank" rel="noreferrer">MIT License</a>
        </div>
      </footer>
      </div>
    </>
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


