import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const TIME_PER_WORD = 15; // 15 seconds strict timer

export default function WatTest() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_WORD);
  const [response, setResponse] = useState('');
  const [allResponses, setAllResponses] = useState([]);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('/api/questions/WAT/60');
        if (res.data && res.data.length > 0 && res.data.length === 60) {
          setWords(res.data.map(q => q.content));
        } else {
          throw new Error("Incomplete data from API");
        }
      } catch (err) {
        console.error("Failed to fetch words, using fallbacks:", err);
        const fallbackWords = [
            "Ability", "Accept", "Achieve", "Active", "Adopt", "Advance", "Advise", "Agree", "Aim", "Alert",
            "Ambition", "Attack", "Authority", "Aware", "Balance", "Believe", "Bold", "Bound", "Brave", "Brief",
            "Bright", "Care", "Cause", "Chance", "Change", "Character", "Check", "Choice", "Clean", "Clear",
            "Cooperate", "Courage", "Danger", "Dare", "Death", "Decide", "Defeat", "Defend", "Degree", "Delay",
            "Desire", "Devotion", "Difficult", "Direct", "Discipline", "Distance", "Duty", "Eager", "Earn", "Easy",
            "Effort", "Enemy", "Enjoy", "Enough", "Equal", "Escape", "Example", "Exercise", "Expect", "Experience"
        ];
        setWords(fallbackWords);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (isTestComplete || loading) return;

    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTestComplete, loading]);

  useEffect(() => {
    if (inputRef.current && !isTestComplete && !loading) {
      inputRef.current.focus();
    }
  }, [currentWordIndex, isTestComplete, loading]);

  const handleAutoSubmit = () => {
    saveResponse();
    moveToNextWord();
  };

  const handleManualSubmit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveResponse();
      moveToNextWord();
    }
  };

  const saveResponse = () => {
    setAllResponses(prev => [
      ...prev,
      { word: words[currentWordIndex], response: response, timeTaken: TIME_PER_WORD - timeLeft }
    ]);
  };

  const moveToNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setResponse('');
      setTimeLeft(TIME_PER_WORD);
    } else {
      setIsTestComplete(true);
    }
  };

  const submitTestToBackend = async (finalResponses = allResponses) => {
    setIsEvaluating(true);
    try {
      const { evaluateWithAI } = await import('../services/aiService');
      const evalData = await evaluateWithAI('Word Association Test (WAT)', finalResponses);
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
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
         <p className="mt-4 text-primary font-bold uppercase tracking-widest text-xs">Syncing Psych Stimuli...</p>
      </div>
    );
  }

  if (isTestComplete) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="glass-panel text-center p-8 max-w-4xl w-full relative overflow-hidden flex flex-col max-h-[90vh]">
          {isEvaluating && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
               <p className="text-primary font-bold animate-pulse">AI Psychologist Evaluating Reactions...</p>
            </div>
          )}

          {!evaluationResults ? (
            <div className="py-20">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">WAT Test Complete</h2>
              <p className="text-textSecondary mb-8 text-lg">Your responses were captured. Ready for AI evaluation?</p>
              <button 
                onClick={() => submitTestToBackend(allResponses)} 
                className="btn-primary w-full max-w-md mx-auto flex items-center justify-center gap-2"
              >
                Analyze My Psychology <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="text-4xl font-black text-primary mb-2">
                  {evaluationResults.score_out_of_10} <span className="text-xl text-textSecondary font-medium">/ 10</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Word Association Evaluation</h2>
              </div>

              <div className="flex-grow overflow-y-auto pr-2 mb-8 custom-scrollbar text-left border-y border-white/10 py-4">
                <div className="space-y-4">
                  {evaluationResults.scores_per_question.map((q, idx) => (
                    <div key={idx} className="bg-surface/50 rounded-xl p-4 border border-white/5">
                      <span className="text-primary font-black uppercase text-[10px]">Word: {q.question}</span>
                      <p className="text-white italic mb-2">"{q.candidate_response}"</p>
                      <p className="text-xs text-textSecondary">{q.brief_explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button onClick={() => navigate('/dashboard')} className="btn-secondary flex-1">Dashboard</button>
                <button 
                  onClick={() => navigate('/report', { state: { evaluation: evaluationResults, testName: 'Word Association Test (WAT)' } })} 
                  className="btn-primary flex-1 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  View Full Report
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4">
      <div className="glass-panel w-full max-w-2xl overflow-hidden relative">
        <div className="h-1.5 w-full bg-surface/50">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${((currentWordIndex) / words.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-10">
            <span className="text-sm font-medium text-textSecondary uppercase tracking-wider">
              Word {currentWordIndex + 1} of {words.length}
            </span>
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${timeLeft <= 5 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-surface border border-white/5 text-white'}`}>
              <Timer className="w-4 h-4" />
              <span className="font-mono text-lg font-bold">{timeLeft}s</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-10">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-16 text-center h-20">
              {words[currentWordIndex]}
            </h1>
            
            <input
              ref={inputRef}
              type="text"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              onKeyDown={handleManualSubmit}
              className="w-full bg-surface/30 border border-white/20 rounded-xl px-6 py-5 text-xl lg:text-2xl text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              placeholder="Type the first sentence that comes to mind..."
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
