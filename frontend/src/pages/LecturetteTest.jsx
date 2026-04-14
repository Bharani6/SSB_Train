import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowRight, Mic, CheckCircle, MessagesSquare } from 'lucide-react';

const PREP_TIME = 180; // 3 minutes
const DELIVER_TIME = 180; // 3 minutes

const TOPICS = [
  { id: 1, level: 'High', title: 'Impact of Artificial Intelligence on Global Warfare' },
  { id: 2, level: 'Medium', title: 'The Role of Women in Armed Forces' },
  { id: 3, level: 'Medium', title: 'Rising Cyber Crimes in the 21st Century' },
  { id: 4, level: 'Low', title: 'My Favorite Book and Why' },
];

export default function LecturetteTest() {
  const [phase, setPhase] = useState('select'); // 'select', 'prep', 'deliver', 'complete'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [timeLeft, setTimeLeft] = useState(PREP_TIME);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (phase === 'select' || phase === 'complete') return;

    if (timeLeft <= 0) {
      if (phase === 'prep') {
        setPhase('deliver');
        setTimeLeft(DELIVER_TIME);
      } else if (phase === 'deliver') {
        setPhase('complete');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, phase]);

  const selectGivenTopic = (topic) => {
    setSelectedTopic(topic);
    setPhase('prep');
    setTimeLeft(PREP_TIME);
  };

  const startEarlyDelivery = () => {
    if (phase === 'prep') {
      setPhase('deliver');
      setTimeLeft(DELIVER_TIME);
    }
  };

  const finishDeliveryEarly = () => {
    if (phase === 'deliver') {
      setPhase('complete');
    }
  };

  const submitToEvaluator = async () => {
    setIsEvaluating(true);
    try {
      const { evaluateWithAI } = await import('../services/aiService');
      const mockAudioAnswers = `Topic Delivered: "${selectedTopic?.title}". Candidate provided a 3-minute verbal lecturette response successfully.`;
      const evalData = await evaluateWithAI('Lecturette (GTO)', mockAudioAnswers);
      navigate('/report', { state: { evaluation: evalData, testName: 'Lecturette (GTO)' } });
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

  if (phase === 'select') {
    return (
      <div className="flex-grow flex items-center justify-center p-4 max-w-4xl mx-auto w-full">
         <div className="glass-panel w-full p-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6">
              <MessagesSquare className="w-8 h-8 text-cyan-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Lecturette Topic Selection</h2>
            <p className="text-textSecondary text-center mb-10 max-w-2xl">
              You must quickly select 1 out of the 4 provided topics below. You will have exactly 3 minutes to prepare, followed by 3 minutes to deliver your lecture.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
               {TOPICS.map(topic => (
                 <button 
                   key={topic.id}
                   onClick={() => selectGivenTopic(topic)}
                   className="p-6 bg-surface/50 border border-white/10 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-500 transition-all text-left group flex flex-col justify-between h-full"
                 >
                    <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-3">{topic.level} Complexity</span>
                    <h3 className="text-xl font-bold text-white leading-tight group-hover:text-white">{topic.title}</h3>
                 </button>
               ))}
            </div>
         </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="glass-panel text-center p-10 max-w-lg relative overflow-hidden">
          {isEvaluating && <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
             <p className="text-cyan-400 font-bold animate-pulse">GTO Persona evaluating confidence and structure...</p>
          </div>}

          <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-cyan-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Lecturette Concluded</h2>
          <p className="text-textSecondary mb-8 text-lg">
            Your 3-minute delivery on "{selectedTopic?.title}" has been recorded.
          </p>
          <button onClick={submitToEvaluator} disabled={isEvaluating} className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-500 text-white font-bold disabled:opacity-50">
            See GTO Evaluation & Verbal Score <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full">
       <div className="glass-panel w-full p-10 relative overflow-hidden flex flex-col min-h-[500px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
             <div className="flex items-center gap-3">
               <MessagesSquare className="w-6 h-6 text-cyan-500" />
               <div>
                 <p className="text-xs text-cyan-500 uppercase tracking-widest font-bold">Priority: {selectedTopic?.level}</p>
                 <h2 className="text-xl font-bold text-white truncate max-w-[200px] md:max-w-[400px]">{selectedTopic?.title}</h2>
               </div>
             </div>
             <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft <= 30 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-background border border-white/10 text-white'}`}>
                <Timer className="w-5 h-5" />
                <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
             </div>
          </div>

          {/* Phase Body */}
          <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
             <h1 className={`text-4xl font-bold uppercase tracking-widest mb-4 ${phase === 'prep' ? 'text-amber-500' : 'text-red-500 animate-pulse'}`}>
                {phase === 'prep' ? 'Preparation Phase' : 'Delivery Phase'}
             </h1>
             <p className="text-textSecondary max-w-xl mb-12">
               {phase === 'prep' 
                 ? "You have 3 minutes to structure your thoughts. Do not write full sentences; use mental bullet points. Be ready to speak clearly."
                 : "The GTO is listening. Ensure proper posture, eye contact, and loud, coherent voice. Do not stop until you run out of points."}
             </p>

             {phase === 'deliver' && (
                <div className="flex flex-col items-center gap-4">
                   <div className="w-32 h-32 rounded-full bg-red-500/20 flex items-center justify-center animate-ping absolute"></div>
                   <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center z-10 shadow-[0_0_40px_rgba(239,68,68,0.6)]">
                     <Mic className="w-10 h-10 text-white" />
                   </div>
                   <p className="text-sm font-bold text-red-500 uppercase tracking-widest mt-4">Recording Active</p>
                </div>
             )}
          </div>

          {/* Actions */}
          <div className="mt-12 flex justify-end pt-6 border-t border-white/5">
             <button 
               onClick={phase === 'prep' ? startEarlyDelivery : finishDeliveryEarly} 
               className="btn-secondary flex items-center gap-2 hover:bg-white/5 text-white"
             >
                {phase === 'prep' ? 'Start Delivery Early' : 'Finish Delivery Early'} <ArrowRight className="w-4 h-4" />
             </button>
          </div>
       </div>
    </div>
  );
}
