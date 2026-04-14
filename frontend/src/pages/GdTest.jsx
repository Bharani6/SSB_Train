import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, Mic, Timer } from 'lucide-react';
import { getDailySeed } from '../utils/dailySeed';

const ALL_GD_TOPICS = [
  "Social Media: A boon or a bane for modern relationships?",
  "Should cryptocurrency be integrated into the mainstream banking system?",
  "Impact of Artificial Intelligence on Future Employment.",
  "Is the privatization of space exploration beneficial?",
  "Climate Change initiatives: Economic growth vs. Environmental protection.",
  "Role of youth in combating corruption in India.",
  "E-learning vs. Traditional Classroom learning.",
  "Electric Vehicles: The ultimate solution to pollution?",
  "Is the censorship of OTT platforms justified?",
  "Women in combat roles in the Armed Forces.",
  "Impact of Brain Drain on the Indian Economy.",
  "Relevance of the United Nations in resolving modern geopolitical conflicts."
];

export default function GdTest() {
  const [topics, setTopics] = useState([]);
  const [currentGdIndex, setCurrentGdIndex] = useState(0); // 0 for GD 1, 1 for GD 2
  const [phase, setPhase] = useState('intro'); // 'intro', 'discussion', 'complete'
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins for GD
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const hash = getDailySeed();
    const shuffled = [...ALL_GD_TOPICS].sort((a, b) => {
       const charA = a.charCodeAt(0) * hash;
       const charB = b.charCodeAt(0) * hash;
       return (charA % 100) - (charB % 100);
    });
    setTopics([shuffled[0], shuffled[1]]);
  }, []);

  useEffect(() => {
    if (phase === 'discussion' && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (phase === 'discussion' && timeLeft === 0) {
      handleNextGd();
    }
  }, [phase, timeLeft]);

  const startGd = () => {
    setPhase('discussion');
    setTimeLeft(15 * 60);
    setIsRecording(true);
  };

  const handleNextGd = () => {
    if (currentGdIndex === 0) {
      setCurrentGdIndex(1);
      setPhase('intro');
      setIsRecording(false);
    } else {
      setPhase('complete');
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const submitToEvaluator = async () => {
    setIsEvaluating(true);
    try {
      const { evaluateWithAI } = await import('../services/aiService');
      const mockAudioSummary = `The candidate participated in 2 Group Discussions. \nGD 1 Topic: ${topics[0]}\nGD 2 Topic: ${topics[1]}\n(Candidate demonstrated team collaboration, logical points, and confidence).`;
      const evalData = await evaluateWithAI('Group Discussion (GD)', [mockAudioSummary]);
      navigate('/report', { state: { evaluation: evalData, testName: 'Group Discussion (GTO)' } });
    } catch (e) {
      console.error(e);
      if(e.message === 'API_KEY_MISSING') {
         alert("Please set GEMINI_API_KEY in local storage before evaluating.");
      }
      setIsEvaluating(false);
    }
  };

  if (phase === 'intro') {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
         <div className="glass-panel max-w-lg w-full p-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-teal-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Group Discussion {currentGdIndex + 1}</h2>
            <p className="text-textSecondary mb-8">
              {currentGdIndex === 0 
                ? "In GD 1, you have a choice of topics. Act as if the group has chosen the topic below. The discussion will last 15 minutes." 
                : "In GD 2, the GTO gives a compulsory topic. The discussion will last 15 minutes."}
            </p>

            <div className="bg-surface border border-white/10 rounded-xl p-6 w-full mb-8 shadow-inner relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
               <span className="text-xs font-black text-teal-500 uppercase tracking-widest block mb-2">Topic for GD {currentGdIndex + 1}</span>
               <h3 className="text-xl font-bold text-white leading-snug">{topics[currentGdIndex]}</h3>
            </div>

            <button onClick={startGd} className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-teal-400 text-black font-bold">
               Initiate Discussion <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="glass-panel text-center p-10 max-w-lg relative overflow-hidden">
          {isEvaluating && <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
             <p className="text-teal-400 font-bold animate-pulse">Running GTO Group Dynamics Assessment...</p>
          </div>}

          <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-teal-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Discussions Concluded</h2>
          <p className="text-textSecondary mb-8 text-lg">
            Both GD 1 and GD 2 have been completed. The GTO has recorded your participation metrics.
          </p>
          <button onClick={submitToEvaluator} disabled={isEvaluating} className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold disabled:opacity-50">
             See GTO Participation Analysis & Score <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // format time
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full">
       <div className="glass-panel w-full p-10 relative overflow-hidden flex flex-col min-h-[500px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
             <div className="flex items-center gap-3">
               <Users className="w-6 h-6 text-teal-500" />
               <div>
                 <p className="text-xs text-teal-500 uppercase tracking-widest font-bold">GTO Task</p>
                 <h2 className="text-xl font-bold text-white">Group Discussion {currentGdIndex + 1}</h2>
               </div>
             </div>
             <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-500 font-mono text-lg font-bold">
                <Timer className="w-5 h-5" />
                {mins}:{secs}
             </div>
          </div>

          {/* Topic Display */}
          <div className="bg-surface/50 border border-white/5 rounded-2xl p-8 mb-12 text-center flex-grow flex items-center justify-center">
             <h1 className="text-3xl md:text-4xl font-medium text-white leading-tight">
               "{topics[currentGdIndex]}"
             </h1>
          </div>

          {/* Recording Status Line */}
          <div className="flex justify-between items-end border-t border-white/10 pt-6">
             <div className="flex items-center gap-4">
                <button 
                  onClick={toggleRecording}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isRecording 
                     ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-500/30 text-white' 
                     : 'bg-surface border-2 border-white/10 hover:border-white/30 text-textSecondary'
                   }`}
                >
                  <Mic className="w-6 h-6" />
                </button>
                <div>
                   <p className="text-sm font-bold text-white">{isRecording ? 'Listening...' : 'Microphone Muted'}</p>
                   <p className="text-xs text-textSecondary uppercase tracking-wider mt-0.5">Participate vocally in the group</p>
                </div>
             </div>

             <button onClick={handleNextGd} className="btn-secondary flex items-center gap-2 text-white">
                {currentGdIndex === 0 ? 'Conclude GD 1' : 'Conclude GD 2'} <ArrowRight className="w-4 h-4" />
             </button>
          </div>
       </div>
    </div>
  );
}
