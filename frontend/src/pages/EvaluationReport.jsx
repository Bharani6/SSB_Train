import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Brain, Shield, Crosshair, ArrowLeft, Database, CheckCircle, XCircle, Info, Star } from 'lucide-react';

export default function EvaluationReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const evaluation = location.state?.evaluation;
  const testName = location.state?.testName || 'Unknown Test';

  if (!evaluation) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="glass-panel p-8 text-center border-red-500/30">
          <h2 className="text-xl font-bold text-red-400 mb-2">Evaluation Data Missing</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary mt-4">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  // Handle data coming from Database (SessionReport) vs AI Service directly
  const score_out_of_10 = evaluation.score_out_of_10 !== undefined ? evaluation.score_out_of_10 : evaluation.score;
  const feedback_psych = evaluation.feedback_psych || evaluation.psychFeedback;
  const feedback_gto = evaluation.feedback_gto || evaluation.gtoFeedback;
  const feedback_io = evaluation.feedback_io || evaluation.ioFeedback;
  
  let scores_per_question = evaluation.scores_per_question;
  
  // If scores_per_question is missing, try to find it inside userAnswers (which is how we save to DB now)
  if (!scores_per_question && evaluation.userAnswers) {
    try {
        const parsed = JSON.parse(evaluation.userAnswers);
        scores_per_question = parsed.scores_per_question;
    } catch(e) {}
  }

  return (
    <div className="flex-grow flex flex-col p-4 max-w-7xl mx-auto w-full py-8 gap-10">
      
      {/* Absolute Head Block */}
      <div className="glass-panel p-10 flex flex-col md:flex-row justify-between items-center bg-slate-900/60 border-l-8 border-primary relative overflow-hidden backdrop-blur-2xl">
         <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="flex flex-col gap-3 relative z-10">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-secondary font-black tracking-widest text-xs uppercase">Analysis Finalized & Decrypted</span>
           </div>
           <h1 className="text-4xl font-black text-white tracking-tight">{testName} <span className="text-primary">Performance Briefing</span></h1>
           <p className="text-textSecondary flex items-center gap-2 text-sm italic">
             <Database className="w-4 h-4 text-emerald-500" /> Tactical metrics synchronized with Spring Boot Command Center
           </p>
         </div>

         <div className="mt-8 md:mt-0 flex flex-col items-center justify-center px-12 py-8 bg-surface/40 border border-white/5 rounded-3xl relative z-10 shadow-2xl backdrop-blur-md group">
           <span className="text-textSecondary uppercase text-[10px] font-black tracking-[0.3em] mb-3 group-hover:text-primary transition-colors">Combat Readiness Rating</span>
           <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-primary to-accent">
             {score_out_of_10} <span className="text-xl text-textSecondary font-medium">/ 10</span>
           </div>
         </div>
      </div>

      {/* Persona Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {[
            { icon: <Brain className="w-7 h-7" />, title: 'Psychology Board', label: 'Strict Persona Assessment', color: 'purple', data: feedback_psych },
            { icon: <Shield className="w-7 h-7" />, title: 'GTO Evaluation', label: 'Practical Logic Assessment', color: 'emerald', data: feedback_gto },
            { icon: <Crosshair className="w-7 h-7" />, title: 'Interviewing Officer', label: 'Personality Integrity Check', color: 'amber', data: feedback_io }
         ].map((persona, i) => (
            <div key={i} className={`glass-panel p-8 flex flex-col border-t-4 border-${persona.color}-500 hover:shadow-2xl hover:shadow-${persona.color}-500/10 transition-all duration-500 group relative grayscale hover:grayscale-0`}>
               <div className={`w-14 h-14 bg-${persona.color}-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <div className={`text-${persona.color}-400`}>{persona.icon}</div>
               </div>
               <h3 className="text-2xl font-black text-white mb-1 group-hover:text-primary transition-colors">{persona.title}</h3>
               <p className={`text-[10px] text-${persona.color}-400 uppercase tracking-[0.2em] font-black mb-6`}>{persona.label}</p>
               <p className="text-textSecondary leading-relaxed flex-grow text-lg italic">"{persona.data}"</p>
               <div className={`absolute bottom-0 right-0 p-4 opacity-5 text-${persona.color}-400`}>{persona.icon}</div>
            </div>
         ))}
      </div>

      {/* Detailed Question Analysis Section */}
      {scores_per_question && scores_per_question.length > 0 && (
        <div className="mt-10 flex flex-col gap-6 animate-fade-in">
           <div className="flex items-center gap-4 mb-4 px-2">
              <div className="h-0.5 w-12 bg-primary"></div>
              <h2 className="text-2xl font-black text-white uppercase tracking-widest">In-Depth Tactical Breakdown</h2>
           </div>

           <div className="grid grid-cols-1 gap-6">
              {scores_per_question.map((q, idx) => (
                <div key={idx} className="glass-panel overflow-hidden border border-white/5 hover:border-white/10 transition-colors">
                   <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
                      
                      {/* Question Index & Status */}
                      <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] md:w-24">
                         <span className="text-[10px] font-black text-textSecondary uppercase mb-1">Sl. No</span>
                         <span className="text-2xl font-black text-white">{idx + 1}</span>
                         <div className="mt-4">
                            {q.is_correct === true || q.score >= 7 ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : 
                             q.is_correct === false || q.score < 4 ? <XCircle className="w-6 h-6 text-rose-500" /> : 
                             <Info className="w-6 h-6 text-amber-500" />}
                         </div>
                      </div>

                      {/* Main Body */}
                      <div className="flex-grow p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                         <div className="space-y-6">
                            <div>
                               <label className="text-[10px] font-black uppercase tracking-widest text-textSecondary block mb-2">Subject Context / Question</label>
                               <p className="text-xl font-bold text-white line-clamp-3">{q.question}</p>
                            </div>
                            <div>
                               <label className="text-[10px] font-black uppercase tracking-widest text-primary block mb-2">Your Captured Response</label>
                               <div className="bg-background/80 p-4 rounded-xl border border-white/5 italic text-textSecondary">
                                  {q.candidate_response || "No telemetry recorded."}
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10 relative overflow-hidden group/best">
                               <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/best:opacity-20 transition-opacity">
                                  <Star className="w-10 h-10 text-emerald-400" />
                               </div>
                               <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-2">Ideal Recommended SSB Answer</label>
                               <p className="text-white font-medium leading-relaxed">{q.best_answer}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">AI Evaluation Explanation</label>
                               <div className="flex items-center gap-3">
                                  <div className="h-full w-1 bg-amber-500/50 rounded-full"></div>
                                  <p className="text-sm text-textSecondary italic">{q.brief_explanation}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Individual Score Display */}
                      <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] md:w-32">
                         <span className="text-[10px] font-black text-textSecondary uppercase mb-1">Efficiency</span>
                         <div className={`text-3xl font-black ${q.score >= 7 ? 'text-emerald-400' : q.score >= 4 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {q.score}<span className="text-sm opacity-50 font-medium">/10</span>
                         </div>
                      </div>

                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex justify-center mt-6 pb-20">
         <button onClick={() => navigate('/dashboard')} className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 text-white px-10 py-4 rounded-2xl border border-white/10 transition-all font-black uppercase tracking-widest text-xs">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" /> Back to Strategic Dashboard
         </button>
      </div>

    </div>
  );
}
