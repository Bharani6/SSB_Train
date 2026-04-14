import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowRight, ArrowLeft, CheckCircle, BrainCircuit } from 'lucide-react';
import axios from 'axios';

const TOTAL_TIME_SECONDS = 30 * 60; // 30 minutes

export default function SrtTest() {
  const [situations, setSituations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [responses, setResponses] = useState([]);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSrt = async () => {
      try {
        const res = await axios.get('/api/questions/SRT/60');
        if (res.data && res.data.length > 0) {
           setSituations(res.data.map((q, i) => ({ id: i + 1, text: q.content })));
           setResponses(new Array(res.data.length).fill(''));
        } else {
           throw new Error("No data");
        }
      } catch (err) {
        console.error("Failed to fetch SRT, using emergency fallbacks:", err);
        const fallbackSituations = [
            "He was traveling by train and a thief snatched his bag. He...",
            "While going for an interview, his scooter broke down. He...",
            "He found a child lost in a crowded fair. He...",
            "His team was losing a match in the final minutes. He...",
            "He saw thick smoke coming from his neighbor's house. He...",
            "Subordinates refused to work on a project. He...",
            "He was lost in a jungle while trekking. He...",
            "A fast moving car hit a pedestrian. He...",
            "He disagreed with the Principal on some rules. He...",
            "They were crossing a river and the boat started leaking. He...",
            "Shortage of water in the locality. He...",
            "Parents were forcing him to marry against his wish. He...",
            "He forgot his wallet in the cafe after eating. He...",
            "Electricity went off during an important online exam. He...",
            "His sister was teased by some goons. He...",
            "Bridge collapsed during heavy rains. He...",
            "Promised to help a friend but fell ill. He...",
            "Snake in the room at night. He...",
            "Wild animal entered the camp. He...",
            "Found high-deno currency note on road. He...",
            "Train was late and interview was soon. He...",
            "Friend met with an accident before exam. He...",
            "Lost way in a new city. He...",
            "Shortage of food in relief camp. He...",
            "Subordinates were lazy. He...",
            "Boss was angry for no reason. He...",
            "Saw a pickpocket in bus. He...",
            "Hostel food was bad. He...",
            "He had to choose between two good jobs. He...",
            "Villagers were fighting for water. He...",
            "Borewell was left open. He...",
            "He was accused of a mistake he didn't do. He...",
            "Forest fire was spreading. He...",
            "Child fallen in water. He...",
            "Old man struggling to cross road. He...",
            "Exams cancelled. He...",
            "Selection failed. He...",
            "He found some situation. He...",
            "Mobile lost. He...",
            "Rain spoiled the plans. He...",
            "Terrorist activity suspected. He...",
            "Room partner was smoking. He...",
            "Borrowed book lost. He...",
            "Pet was ill. He...",
            "Late for work. He...",
            "Traffic jam. He...",
            "Gift for mother. He...",
            "Money short for fees. He...",
            "Teacher was wrong. He...",
            "Internet down. He...",
            "Cyclone warning. He...",
            "Stuck in lift. He...",
            "Keys lost. He...",
            "Laptop crashed. He...",
            "Stranger asked for help at night. He...",
            "Bag forgotten in bus. He...",
            "Dog bit a child. He...",
            "He was offered a bribe. He...",
            "Someone was drowning. He...",
            "His friend betrayed him. He..."
        ];
        setSituations(fallbackSituations.map((t, i) => ({ id: i + 1, text: t })));
        setResponses(new Array(60).fill(''));
      } finally {
        setLoading(false);
      }
    };
    fetchSrt();
  }, []);

  useEffect(() => {
    if (isTestComplete || loading) return;

    if (timeLeft <= 0) {
      handleCompleteTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTestComplete, loading]);

  const handleCompleteTest = () => {
    setIsTestComplete(true);
  };

  const submitTestToBackend = async () => {
    setIsEvaluating(true);
    try {
      const { evaluateWithAI } = await import('../services/aiService');
      const evalData = await evaluateWithAI('Situation Reaction Test (SRT)', { responses });
      setEvaluationResults(evalData);
      setIsEvaluating(false);
    } catch (e) {
      console.error(e);
      setIsEvaluating(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
         <p className="mt-4 text-emerald-400 font-bold uppercase tracking-widest text-xs">Syncing Tactic Scenarios...</p>
      </div>
    );
  }

  const currentSituation = situations[currentQuestionIndex] || { text: '' };
  const isLastQuestion = currentQuestionIndex === situations.length - 1;

  if (isTestComplete) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="glass-panel text-center p-8 max-w-4xl w-full relative overflow-hidden flex flex-col max-h-[90vh]">
          {isEvaluating && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
               <p className="text-emerald-400 font-bold animate-pulse">AI GTO Analyzing Tactical Decisions...</p>
            </div>
          )}

          {!evaluationResults ? (
            <div className="py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">SRT Test Finished</h2>
              <button 
                onClick={submitTestToBackend} 
                className="btn-primary max-w-md w-full flex items-center justify-center gap-2"
              >
                Evaluate My Practical Intelligence <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
               <div className="flex flex-col items-center mb-6">
                 <div className="text-4xl font-black text-emerald-400 mb-2">
                   {evaluationResults.score_out_of_10} <span className="text-xl text-textSecondary font-medium">/ 10</span>
                 </div>
                 <h2 className="text-2xl font-bold text-white">GTO Situation Assessment</h2>
               </div>
               <div className="flex-grow overflow-y-auto pr-2 mb-8 custom-scrollbar text-left border-y border-white/10 py-4">
                  {evaluationResults.scores_per_question.map((q, idx) => (
                    <div key={idx} className="bg-surface/50 rounded-xl p-4 border border-white/5 mb-4">
                      <p className="text-white font-medium text-sm">{q.question}</p>
                      <p className="text-emerald-400 italic text-sm mt-2">"{q.candidate_response}"</p>
                    </div>
                  ))}
               </div>
               <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full">Back to Dashboard</button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto w-full">
      <div className="glass-panel w-full md:w-3/4 flex flex-col relative overflow-hidden">
        <div className="border-b border-white/5 p-6 flex justify-between items-center bg-surface/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                <BrainCircuit className="w-5 h-5" />
             </div>
             <div>
               <div className="text-lg font-bold text-white tracking-wide">
                 Situation Reaction Test (SRT)
               </div>
             </div>
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${timeLeft <= 300 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-background border border-white/10 text-white'}`}>
            <Timer className="w-4 h-4" />
            <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="p-8 flex-grow flex flex-col">
          <span className="text-emerald-400 font-bold mb-4">Situation {currentSituation.id} of {situations.length}</span>
          <h3 className="text-3xl font-medium text-white leading-relaxed mb-10 w-full">
            "{currentSituation.text}"
          </h3>

          <textarea
            value={responses[currentQuestionIndex]}
            onChange={(e) => {
                const rs = [...responses];
                rs[currentQuestionIndex] = e.target.value;
                setResponses(rs);
            }}
            className="w-full h-48 bg-surface/30 border border-white/20 rounded-xl p-6 text-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="He will..."
          />
        </div>

        <div className="border-t border-white/5 p-6 bg-surface/50 flex justify-between items-center">
          <button 
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          
          <button 
            onClick={() => {
              if (isLastQuestion) handleCompleteTest();
              else setCurrentQuestionIndex(prev => Math.min(situations.length - 1, prev + 1));
            }}
            className="btn-primary flex items-center gap-2"
          >
            {isLastQuestion ? 'Complete Test' : 'Next Situation'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
