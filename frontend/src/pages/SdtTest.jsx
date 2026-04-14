import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowRight, CheckCircle, UserCheck } from 'lucide-react';

const TOTAL_TIME_SECONDS = 15 * 60; // 15 minutes

export default function SdtTest() {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [formData, setFormData] = useState({
    parents: '',
    teachers: '',
    friends: '',
    self: '',
    aim: ''
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);
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

  const submitTestToBackend = async () => {
    setIsEvaluating(true);
    try {
      // Import missing dynamically to fix module resolution quickly
      const { evaluateWithAI } = await import('../services/aiService');
      const evalData = await evaluateWithAI('Self Description Test (SDT)', formData);
      setEvaluationResults(evalData);
      setIsEvaluating(false);
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
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="glass-panel text-center p-10 max-w-4xl w-full relative overflow-hidden flex flex-col max-h-[90vh]">
          {isEvaluating && <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
             <p className="text-orange-400 font-bold animate-pulse tracking-widest uppercase text-xs">AI Board Parsing Introspective Telemetry...</p>
          </div>}

          {!evaluationResults ? (
            <div className="py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">SDT Test Finished</h2>
              <p className="text-textSecondary mb-8 text-lg">Your Self Description dossier has been locked. Prepare for psychological screening.</p>
              <button 
                onClick={submitTestToBackend} 
                disabled={isEvaluating} 
                className="btn-primary max-w-md w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-500/30"
              >
                Evaluate My Personal Integrity <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="text-4xl font-black text-orange-500 mb-2">
                  {evaluationResults.score_out_of_10} <span className="text-xl text-textSecondary font-medium">/ 10</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Psychological Self-Assessment</h2>
                <p className="text-textSecondary mt-1">Consistency & Introspection Score Dashboard</p>
              </div>

              <div className="flex-grow overflow-y-auto pr-2 mb-8 custom-scrollbar text-left border-y border-white/10 py-4">
                <div className="space-y-4">
                  {evaluationResults.scores_per_question.map((q, idx) => (
                    <div key={idx} className="bg-surface/50 rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-orange-500 font-black tracking-widest text-[10px] uppercase">Review: {q.question}</span>
                        <div className={`text-sm font-bold ${q.score >= 7 ? 'text-blue-400' : 'text-red-400'}`}>
                           Psych Accuracy: {q.score}/10
                        </div>
                      </div>
                      <p className="text-white italic mb-3 text-sm border-l-2 border-orange-500/20 pl-4">
                        "{q.candidate_response}"
                      </p>
                      <div className="p-3 bg-orange-500/5 rounded-lg border border-orange-500/10">
                         <p className="text-xs text-textSecondary leading-relaxed">
                            <span className="text-orange-500 font-bold uppercase text-[9px] tracking-tighter">Psychologist Review:</span> {q.brief_explanation}
                         </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button onClick={() => navigate('/dashboard')} className="btn-secondary flex-1">Back to HQ</button>
                <button 
                  onClick={() => navigate('/report', { state: { evaluation: evaluationResults, testName: 'Self Description Test (SDT)' } })} 
                  className="btn-primary flex-1 bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                >
                  View Full Board Review
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-start p-4 max-w-4xl mx-auto w-full pb-20">
      <div className="glass-panel w-full relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-white/5 p-6 flex justify-between items-center bg-surface/50 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                <UserCheck className="w-5 h-5" />
             </div>
             <div>
               <div className="text-lg font-bold text-white tracking-wide">
                 Self Description Test (SDT)
               </div>
               <p className="text-sm text-textSecondary uppercase tracking-wider font-medium">
                 Comprehensive Introspection
               </p>
             </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${timeLeft <= 300 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-background border border-white/10 text-white'}`}>
            <Timer className="w-4 h-4" />
            <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 flex flex-col gap-8">
           
           <div className="flex flex-col gap-2">
              <label className="text-white font-bold text-lg">1. Parents' Opinion</label>
              <p className="text-textSecondary text-sm mb-2">What do your parents/guardians think about you?</p>
              <textarea
                value={formData.parents}
                onChange={(e) => setFormData({...formData, parents: e.target.value})}
                className="w-full h-32 bg-surface/30 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner resize-none custom-scrollbar"
              />
           </div>

           <div className="flex flex-col gap-2">
              <label className="text-white font-bold text-lg">2. Teachers' / Employers' Opinion</label>
              <p className="text-textSecondary text-sm mb-2">What does your teacher or employer think about you?</p>
              <textarea
                value={formData.teachers}
                onChange={(e) => setFormData({...formData, teachers: e.target.value})}
                className="w-full h-32 bg-surface/30 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner resize-none custom-scrollbar"
              />
           </div>

           <div className="flex flex-col gap-2">
              <label className="text-white font-bold text-lg">3. Friends' Opinion</label>
              <p className="text-textSecondary text-sm mb-2">What do your friends think about you?</p>
              <textarea
                value={formData.friends}
                onChange={(e) => setFormData({...formData, friends: e.target.value})}
                className="w-full h-32 bg-surface/30 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner resize-none custom-scrollbar"
              />
           </div>

           <div className="flex flex-col gap-2">
              <label className="text-white font-bold text-lg">4. Self Opinion</label>
              <p className="text-textSecondary text-sm mb-2">What is your opinion about yourself? (Strengths & Weaknesses)</p>
              <textarea
                value={formData.self}
                onChange={(e) => setFormData({...formData, self: e.target.value})}
                className="w-full h-32 bg-surface/30 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner resize-none custom-scrollbar"
              />
           </div>

           <div className="flex flex-col gap-2">
              <label className="text-white font-bold text-lg">5. Future Aim & Improvements</label>
              <p className="text-textSecondary text-sm mb-2">What qualities would you like to develop and what are your futuristic goals?</p>
              <textarea
                value={formData.aim}
                onChange={(e) => setFormData({...formData, aim: e.target.value})}
                className="w-full h-32 bg-surface/30 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-inner resize-none custom-scrollbar"
              />
           </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-white/5 p-6 bg-surface/50 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-sm text-textSecondary">Ensure you have filled all sections before final submission.</p>
           <button 
            onClick={handleCompleteTest}
            className="btn-primary flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 shadow-orange-500/30 w-full md:w-auto justify-center"
           >
            Lock Form & Submit <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
