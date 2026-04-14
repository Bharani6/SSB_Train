import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Archive, ArrowLeft, Brain, Shield, Crosshair } from 'lucide-react';

export default function ArchivalReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const { date, dayRecords } = location.state || { date: 'Unknown', dayRecords: [] };

  if (!dayRecords || dayRecords.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="glass-panel p-8 text-center border-red-500/30">
          <h2 className="text-xl font-bold text-red-400 mb-2">Archive Data Missing</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary mt-4">Return</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col p-4 max-w-7xl mx-auto w-full py-8 gap-8">
      
      {/* Header Block */}
      <div className="glass-panel p-8 flex flex-col md:flex-row justify-between items-center bg-slate-800/40 border-b-4 border-indigo-500">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
               <Archive className="w-8 h-8" />
            </div>
            <div>
               <span className="text-indigo-400 font-bold tracking-widest text-xs uppercase">Historical Archive Viewer</span>
               <h1 className="text-3xl font-black text-white">{date} - Full Report</h1>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
         {dayRecords.map((record, index) => (
             <div key={record.id || index} className="glass-panel p-8 flex flex-col gap-6 relative overflow-hidden">
                
                {/* Module Target Stats */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                   <h2 className="text-2xl font-bold text-white">{record.testModule} Assessment</h2>
                   <div className="text-right">
                      <span className="text-xs uppercase font-bold text-textSecondary tracking-widest">Global Score</span>
                      <div className={`text-4xl font-black ${record.score >= 7 ? 'text-emerald-400' : record.score >= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
                         {record.score}<span className="text-xl text-textSecondary font-medium">/10</span>
                      </div>
                   </div>
                </div>

                {/* Raw Answers Panel */}
                <div className="bg-surface/50 border border-white/10 rounded-xl p-6">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-textSecondary mb-3">Your Original Answers</h3>
                   <div className="text-white text-lg whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar leading-relaxed bg-surface/30 p-4 rounded-lg">
                      {record.userAnswers ? (
                          <pre className="font-sans whitespace-pre-wrap">{
                             (() => {
                               try {
                                 const parsed = JSON.parse(record.userAnswers);
                                 if (typeof parsed === 'object') {
                                    return Object.entries(parsed).map(([k, v]) => `${k}:\n${v}`).join('\n\n');
                                 } else {
                                    return String(parsed);
                                 }
                               } catch(e) {
                                  return record.userAnswers;
                               }
                             })()
                          }</pre>
                      ) : (
                         <span className="text-textSecondary italic">No raw answers cached prior to system update.</span>
                      )}
                   </div>
                </div>

                {/* Assessment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {/* Psych Assessment */}
                   <div className="bg-surface/30 border-l-2 border-l-purple-500 p-4 rounded-r-lg hover:bg-surface/50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                         <Brain className="w-4 h-4 text-purple-400" />
                         <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Psychology Matrix</span>
                      </div>
                      <p className="text-textSecondary text-sm leading-relaxed">{record.psychFeedback}</p>
                   </div>

                   {/* GTO Assessment */}
                   <div className="bg-surface/30 border-l-2 border-l-emerald-500 p-4 rounded-r-lg hover:bg-surface/50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                         <Shield className="w-4 h-4 text-emerald-400" />
                         <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Ground Testing Logic</span>
                      </div>
                      <p className="text-textSecondary text-sm leading-relaxed">{record.gtoFeedback}</p>
                   </div>

                   {/* IO Assessment */}
                   <div className="bg-surface/30 border-l-2 border-l-yellow-500 p-4 rounded-r-lg hover:bg-surface/50 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                         <Crosshair className="w-4 h-4 text-yellow-400" />
                         <span className="text-xs font-bold uppercase tracking-widest text-yellow-400">Interviewing Officer</span>
                      </div>
                      <p className="text-textSecondary text-sm leading-relaxed">{record.ioFeedback}</p>
                   </div>
                </div>

             </div>
         ))}
      </div>

      <div className="flex justify-center mt-4 pb-12">
         <button onClick={() => navigate('/dashboard')} className="btn-secondary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
         </button>
      </div>

    </div>
  );
}
