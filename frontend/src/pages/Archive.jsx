import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Archive, ArrowLeft, ArrowRight, Brain, Shield, Crosshair, Calendar, Search, Filter } from 'lucide-react';

export default function ArchivePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialDate = location.state?.date || new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [dayRecords, setDayRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecordsByDate = async () => {
      setLoading(true);
      setError(null);
      const rawUser = localStorage.getItem('USER_DATA');
      if (!rawUser) {
        navigate('/login');
        return;
      }
      const user = JSON.parse(rawUser);

      try {
        const res = await axios.get(`/api/evaluations/user/${user.email}`);
        // Filter by date on client side for now as we don't have a specific by-date endpoint easily available without backend changes
        const filtered = res.data.filter(rec => rec.dateString === selectedDate);
        setDayRecords(filtered.reverse());
      } catch (err) {
        console.error("Failed to fetch records:", err);
        setError("Failed to sync with mission database. Re-establish connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecordsByDate();
  }, [selectedDate, navigate]);

  return (
    <div className="flex-grow flex flex-col p-4 max-w-7xl mx-auto w-full py-8 gap-8 relative z-10">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#06120b]">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[100px]"></div>
      </div>

      {/* Header Block */}
      <div className="glass-panel p-8 flex flex-col md:flex-row justify-between items-center bg-[#0a1f11]/80 border-b border-emerald-500/30">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Archive className="w-7 h-7" />
          </div>
          <div>
            <span className="text-emerald-400 font-black tracking-widest text-[10px] uppercase block mb-1">SSB Command Archive</span>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              Operational Logs
              <span className="text-slate-500 text-lg font-medium">/ {selectedDate}</span>
            </h1>
          </div>
        </div>

        <div className="mt-6 md:mt-0 flex items-center gap-3 bg-white/5 p-1 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 px-4 text-emerald-400">
               <Calendar className="w-4 h-4" />
               <input 
                 type="date" 
                 value={selectedDate}
                 onChange={(e) => setSelectedDate(e.target.value)}
                 className="bg-transparent border-none text-white font-bold outline-none cursor-pointer text-sm"
               />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
             <p className="text-emerald-400 font-bold animate-pulse tracking-widest uppercase text-xs">Decrypting Tactical Data...</p>
          </div>
        ) : error ? (
           <div className="glass-panel p-12 text-center border-red-500/30">
              <p className="text-red-400 font-bold">{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all">Retry Link</button>
           </div>
        ) : dayRecords.length === 0 ? (
          <div className="glass-panel p-20 flex flex-col items-center justify-center text-center opacity-80">
             <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6 border border-white/5">
                <Search className="w-10 h-10 text-slate-600" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">No Training Logs Found</h2>
             <p className="text-slate-500 max-w-sm">No activity records were detected in the secure database for {selectedDate}. Begin training sessions to populate this archive.</p>
             <button onClick={() => navigate('/dashboard')} className="mt-8 px-8 py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl font-bold transition-all">
                Initiate New Training Session
             </button>
          </div>
        ) : (
          dayRecords.map((record, index) => (
            <div key={record.id || index} className="group glass-panel p-8 flex flex-col gap-8 relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
               
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Shield className="w-40 h-40 text-white" />
               </div>

               {/* Module Target Stats */}
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-emerald-500/40 transition-colors">
                        {record.testModule.includes('OIR') ? '🧠' : record.testModule.includes('WAT') ? '🅰️' : '📑'}
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">{record.testModule}</h2>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/80">Evaluation Certified</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-8">
                     <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Combat Readiness Score</span>
                        <div className={`text-4xl font-black ${record.score >= 7 ? 'text-emerald-400' : record.score >= 4 ? 'text-amber-400' : 'text-rose-400'}`}>
                           {record.score}<span className="text-lg text-slate-600 font-medium ml-1">/10</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Grid Layout for Content */}
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left: Raw Answers */}
                  <div className="lg:col-span-1 border-r border-white/5 pr-8">
                     <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-3 h-3 text-slate-500" />
                        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">Submission Payload</h3>
                     </div>
                     <div className="text-slate-400 text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar leading-relaxed bg-[#050f08] p-4 rounded-xl border border-white/5 italic">
                        {record.userAnswers ? (
                            <div className="space-y-4">
                               {(() => {
                                  try {
                                    const parsed = JSON.parse(record.userAnswers);
                                    if (typeof parsed === 'object') {
                                       return Object.entries(parsed).map(([k, v]) => (
                                          <div key={k} className="border-b border-white/5 pb-2 last:border-0 uppercase text-[10px]">
                                             <span className="text-emerald-500/70 block font-black mb-1">{k}</span>
                                             <span className="text-slate-300 normal-case text-sm block">{String(v)}</span>
                                          </div>
                                       ));
                                    }
                                    return String(parsed);
                                  } catch(e) { return record.userAnswers; }
                               })()}
                            </div>
                        ) : "No raw telemetry cached."}
                     </div>
                  </div>

                  {/* Right: Detailed Assessments */}
                  <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                     {/* Personas */}
                     {[
                        { icon: <Brain className="w-4 h-4" />, label: 'Psych Core', color: '#a855f7', data: record.psychFeedback },
                        { icon: <Shield className="w-4 h-4" />, label: 'GTO Logic', color: '#10b981', data: record.gtoFeedback },
                        { icon: <Crosshair className="w-4 h-4" />, label: 'IO Strategy', color: '#f59e0b', data: record.ioFeedback }
                     ].map((persona, i) => (
                        <div key={i} className="flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden group/persona">
                           <div className="absolute top-0 right-0 w-16 h-16 opacity-5 -mr-4 -mt-4 transition-transform group-hover/persona:scale-125" style={{ color: persona.color }}>
                              {persona.icon}
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${persona.color}15`, color: persona.color }}>
                                 {persona.icon}
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: persona.color }}>{persona.label}</span>
                           </div>
                           <p className="text-slate-400 text-[13px] leading-relaxed line-clamp-6 group-hover/persona:line-clamp-none transition-all cursor-default">
                              {persona.data}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* View Details Button */}
               <div className="flex justify-end pt-4 border-t border-white/5">
                   <button 
                       onClick={() => navigate('/report', { state: { evaluation: record, testName: record.testModule } })}
                       className="flex items-center gap-2 px-6 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                   >
                       View Full Performance Report <ArrowRight className="w-4 h-4" />
                   </button>
               </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center mt-4 pb-12">
        <button onClick={() => navigate('/dashboard')} className="group flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all font-bold">
           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" /> Return to Dashboard
        </button>
      </div>

    </div>
  );
}
