import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowRight, CheckCircle, Map } from 'lucide-react';

const TOTAL_TIME_SECONDS = 15 * 60; // 15 minutes

const GPE_NARRATIVE = `
You are a group of 8 college students trekking in the dense forests of Manali. It is currently 3:00 PM. 
You pitched your tents near a local village outpost when a panicked villager runs to your camp with multiple severe reports:

1. A local bus carrying 20 schoolchildren has derailed near the river bridge (3km West) and is hanging dangerously off the cliff. The bridge is unstable.
2. An armed group of 4 poachers has been spotted heading North towards the restricted Tiger Reserve (5km North).
3. The village headman's pregnant wife has suddenly gone into critical labor and needs to reach the city hospital (15km East, dirt road).

Resources Available:
- 1 Jeep (capacity 6, fuel for 40km) parked at your camp.
- 2 Motorcycles (capacity 2 each).
- Basic medical first-aid kit.
- The nearest police station is at the city (15km East).
- A local tractor is available at the village but moves very slowly (max 15km/h).

Time constraints: The bus might fall if not secured within 45 minutes. The hospital needs to be reached within 1 hour. It's getting dark by 6:00 PM.

Provide your prioritized action plan, distribution of resources, and time calculations.
`;

export default function GpeTest() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [solution, setSolution] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isTestComplete) return;

    if (timeLeft <= 0) {
      handleCompleteTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTestComplete]);

  const handleCompleteTest = () => {
    setIsTestComplete(true);
  };

  const submitToEvaluator = async () => {
    setIsEvaluating(true);
    try {
      const { evaluateWithAI } = await import('../services/aiService');
      const evalData = await evaluateWithAI('Group Planning Exercise (GPE)', solution);
      navigate('/report', { state: { evaluation: evalData, testName: 'Group Planning Exercise (GPE)' } });
    } catch (e) {
      console.error(e);
      if(e.message === 'API_KEY_MISSING') {
         alert("Please set GEMINI_API_KEY in local storage before evaluating: localStorage.setItem('GEMINI_API_KEY', 'your-key')");
      }
      setIsEvaluating(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isTestComplete) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="glass-panel text-center p-10 max-w-lg relative overflow-hidden">
          {isEvaluating && <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
             <p className="text-rose-400 font-bold animate-pulse">GTO Validating Resource Logic & Practical Intelligence...</p>
          </div>}

          <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">GPE Time Up</h2>
          <p className="text-textSecondary mb-8 text-lg">
            Your Group Planning Exercise solution parameters are locked.
          </p>
          <button onClick={submitToEvaluator} disabled={isEvaluating} className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-500 text-white font-bold disabled:opacity-50">
            Submit Solution for GTO Review <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto w-full pb-20">
      
      {/* Left Column: Narrative */}
      <div className="glass-panel w-full md:w-1/2 flex flex-col relative overflow-hidden h-[800px]">
        {/* Header */}
        <div className="border-b border-white/5 p-6 flex justify-between items-center bg-surface/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">
                <Map className="w-5 h-5" />
             </div>
             <div>
               <div className="text-lg font-bold text-white tracking-wide">
                 GPE Narrative
               </div>
               <p className="text-sm text-rose-400 uppercase tracking-wider font-bold">
                 Situation Protocol constraints
               </p>
             </div>
          </div>
        </div>

        {/* Narrative Content & Map */}
        <div className="p-8 flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-6">
           
           {/* GTO Sand Model / Map */}
           <div className="w-full h-64 flex-shrink-0 bg-[#0a0f1f] rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl">
              <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
                {/* Background / Grid */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                </pattern>
                <rect width="800" height="400" fill="url(#grid)" />
                
                {/* River */}
                <path d="M 200 0 Q 300 150 200 250 T 250 400" stroke="#0284c7" strokeWidth="24" strokeLinecap="round" opacity="0.4"/>
                
                {/* Dirt Road (East-West) */}
                <path d="M 200 200 L 650 200" stroke="#b45309" strokeWidth="8" strokeDasharray="15, 10"  opacity="0.6"/>
                
                {/* Main Highway (North-South) */}
                <path d="M 400 0 L 400 400" stroke="#475569" strokeWidth="12" opacity="0.6"/>
                
                {/* Tents / Camp (Center) */}
                <circle cx="400" cy="200" r="14" fill="#6366f1" className="animate-pulse" />
                <text x="425" y="215" fill="#818cf8" stroke="none" className="font-black text-sm uppercase tracking-widest">Village Camp (Start)</text>
                
                {/* River Bridge (West) */}
                <rect x="180" y="190" width="40" height="20" fill="#f43f5e" />
                <text x="60" y="180" fill="#fda4af" stroke="none" className="font-bold text-xs uppercase tracking-wider">Derailed Bus (3km)</text>
                
                {/* Hospital (East) */}
                <rect x="650" y="180" width="40" height="40" fill="#10b981" />
                <text x="635" y="240" fill="#6ee7b7" stroke="none" className="font-bold text-xs uppercase tracking-wider">City Hospital (15km)</text>
                
                {/* Tiger Reserve (North) */}
                <path d="M 300 20 L 500 20 L 480 120 L 320 120 Z" fill="#22c55e" stroke="none" opacity="0.15" />
                <text x="350" y="70" fill="#86efac" stroke="none" className="font-black text-sm uppercase tracking-widest opacity-80">Tiger Reserve (5km)</text>
                
                {/* Poachers */}
                <circle cx="400" cy="140" r="8" fill="#f43f5e" opacity="0.8" />
                <text x="420" y="145" fill="#fda4af" stroke="none" className="font-bold text-[10px] uppercase tracking-wider">Poachers Spotted</text>
                
                {/* Compass */}
                <g transform="translate(60, 60)">
                  <circle r="25" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <path d="M0 -30 L 7 -7 L 0 0 L -7 -7 Z" fill="#f43f5e" stroke="none" />
                  <path d="M0 30 L 7 7 L 0 0 L -7 7 Z" fill="white" stroke="none" opacity="0.2" />
                  <text x="-5" y="-35" fill="#f43f5e" stroke="none" className="font-black text-xs">N</text>
                </g>
              </svg>
              {/* Overlay Labels */}
              <div className="absolute bottom-3 left-3 flex gap-2 pointer-events-none">
                 <span className="px-2 py-1 bg-black/80 rounded text-[9px] font-black text-slate-300 uppercase tracking-widest backdrop-blur-md border border-white/10">Topographical Sketch</span>
              </div>
           </div>

           <div className="whitespace-pre-wrap text-textSecondary text-lg leading-relaxed">
              <p className="first-letter:text-5xl first-letter:font-black first-letter:text-rose-400 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                 {GPE_NARRATIVE.trim()}
              </p>
           </div>
        </div>
      </div>

      {/* Right Column: Writing Area */}
      <div className="glass-panel w-full md:w-1/2 flex flex-col relative overflow-hidden h-[800px]">
         {/* Timer Header */}
         <div className="border-b border-white/5 p-6 flex justify-between items-center bg-surface/50">
          <h3 className="text-white font-bold text-lg">Your Solution</h3>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${timeLeft <= 300 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-background border border-white/10 text-white'}`}>
            <Timer className="w-4 h-4" />
            <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col relative">
           <textarea
             value={solution}
             onChange={(e) => setSolution(e.target.value)}
             className="w-full h-full bg-surface/30 border border-white/20 rounded-xl p-6 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-inner resize-none custom-scrollbar text-lg"
             placeholder="1. Identify the problems in order of priority.&#10;2. Allocate your available resources (Jeep, Bikes, Manpower).&#10;3. Calculate distance/speed to estimate time equations.&#10;4. Provide the final course of action."
             autoFocus
           />
           <div className="absolute bottom-10 right-10">
              <button 
                onClick={handleCompleteTest}
                className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-red-500 shadow-rose-500/30"
              >
                Lock Solution <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>

    </div>
  );
}
