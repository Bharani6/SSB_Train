import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowRight, Eye, PenTool, CheckCircle } from 'lucide-react';
import axios from 'axios';

const OBSERVE_TIME_SECONDS = 30;
const WRITE_TIME_SECONDS = 240; // 4 minutes

export default function PpdtTest() {
  const [phase, setPhase] = useState('observe'); // 'observe', 'write', 'complete'
  const [timeLeft, setTimeLeft] = useState(OBSERVE_TIME_SECONDS);
  const [story, setStory] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPpdt = async () => {
      try {
        const res = await axios.get('/api/questions/PPDT_SCREENING/1');
        if (res.data && res.data.length > 0) {
           setActiveImage(`/api/questions/image/${res.data[0].id}`);
        } else {
           throw new Error("No mission data");
        }
      } catch (err) {
        console.error("Failed to fetch PPDT:", err);
        // Fallback to offline local asset if API fails
        setActiveImage('/assets/screening_bench.png');
      } finally {
        setLoading(false);
      }
    };
    fetchPpdt();
  }, []);

  useEffect(() => {
    if (phase === 'complete' || loading) return;

    if (timeLeft <= 0) {
      if (phase === 'observe') {
        setPhase('write');
        setTimeLeft(WRITE_TIME_SECONDS);
      } else if (phase === 'write') {
        setPhase('complete');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, phase, loading]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const submitStory = async () => {
    setIsEvaluating(true);
    setPhase('complete');
    try {
      const { evaluateWithAI } = await import('../services/aiService');
      const evalData = await evaluateWithAI('Picture Perception & Discussion (PPDT)', { story: story });
      setEvaluationResults(evalData);
      setIsEvaluating(false);
    } catch (e) {
      console.error(e);
      setIsEvaluating(false);
    }
  };

  if (loading) {
     return (
        <div className="flex-grow flex flex-col items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
           <p className="mt-4 text-blue-400 font-bold uppercase tracking-widest text-xs">Projecting Perception Slide...</p>
        </div>
     );
  }

  if (phase === 'complete') {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="glass-panel text-center p-10 max-w-4xl w-full relative overflow-hidden flex flex-col max-h-[90vh]">
          {isEvaluating && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
               <p className="text-blue-400 font-bold animate-pulse">AI Officers Reviewing Perception Narrative...</p>
            </div>
          )}

          {!evaluationResults ? (
            <div className="py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">PPDT Sequence Finished</h2>
              <button 
                onClick={submitStory} 
                className="btn-primary max-w-md w-full flex items-center justify-center gap-2"
              >
                Analyze My Narrative <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
               <h2 className="text-2xl font-bold text-white mb-6">Perception Assessment: {evaluationResults.score_out_of_10}/10</h2>
               <div className="flex-grow overflow-y-auto mb-8 custom-scrollbar text-left p-4">
                  <p className="text-white italic mb-4">"{story}"</p>
                  <p className="text-blue-400 text-sm">{evaluationResults.feedback_psych}</p>
               </div>
               <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full">Dashboard</button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full">
      <div className="glass-panel w-full relative overflow-hidden">
        <div className="border-b border-white/5 p-6 flex justify-between items-center bg-surface/50">
          <div className="flex items-center gap-3">
            {phase === 'observe' ? <Eye className="text-blue-500" /> : <PenTool className="text-primary" />}
            <h2 className="text-lg font-bold text-white tracking-wide">PPDT</h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-white/10 text-white">
            <Timer className="w-5 h-5" />
            <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="p-8 h-[600px] flex flex-col items-center justify-center">
          {phase === 'observe' ? (
            <img 
              src={activeImage} 
              alt="PPDT Scenario" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl grayscale-[100%] contrast-150 blur-[4px] brightness-90" 
            />
          ) : (
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full h-full bg-surface/30 border border-white/20 rounded-xl p-6 text-lg text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner resize-none"
              placeholder="Write your story here..."
            />
          )}
        </div>

        {phase === 'write' && (
          <div className="border-t border-white/5 p-6 bg-surface/50 flex justify-end items-center">
            <button onClick={submitStory} className="btn-primary flex items-center gap-2">
               Finish & Submit <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
