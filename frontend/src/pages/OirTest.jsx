import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { getDailySeed, shuffleArrayWithSeed } from '../utils/dailySeed';
import { VERBAL_QUESTIONS, NON_VERBAL_QUESTIONS } from '../utils/oirQuestionBank';

// SSB OIR tests typically have 50 questions to be solved in ~30 minutes (1800 seconds).
const TOTAL_QUESTIONS = 50;
const TOTAL_TIME_SECONDS = 30 * 60; // 30 minutes

const generateSeededQuestions = () => {
  const seed = getDailySeed();
  
  // Combine all questions
  const allPool = [...VERBAL_QUESTIONS, ...NON_VERBAL_QUESTIONS];
  
  // Shuffle the pool using the daily seed
  const shuffledPool = shuffleArrayWithSeed(allPool, seed);
  
  // Take exactly 50
  return shuffledPool.slice(0, TOTAL_QUESTIONS).map((q, i) => ({
    ...q,
    id: i + 1,
    text: `Q${i + 1}. ${q.q}`
  }));
};

const MOCK_QUESTIONS = generateSeededQuestions();

export default function OirTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [answers, setAnswers] = useState(new Array(TOTAL_QUESTIONS).fill(null));
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scoreData, setScoreData] = useState({ correct: 0, total: 50, details: [] });
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
    let correctCount = 0;
    const details = MOCK_QUESTIONS.map((q, idx) => {
      const isCorrect = answers[idx] === q.ans;
      if (isCorrect) correctCount++;
      return {
        question: q.text,
        userAnswer: answers[idx] !== null ? q.opts[answers[idx]] : 'NOT ANSWERED',
        correctAnswer: q.opts[q.ans],
        isCorrect
      };
    });
    setScoreData({ correct: correctCount, total: TOTAL_QUESTIONS, details });
    setIsTestComplete(true);
    setShowResults(true);
  };

  const submitTestToBackend = async () => {
    setIsEvaluating(true);
    let correctCount = 0;
    const results = MOCK_QUESTIONS.map((q, idx) => {
      const isCorrect = answers[idx] === q.ans;
      if (isCorrect) correctCount++;
      return { 
        question: q.text, 
        selected: answers[idx] !== null ? q.opts[answers[idx]] : 'UNANSWERED', 
        correct: q.opts[q.ans], 
        isCorrect 
      };
    });

    const finalScore = Math.round((scoreData.correct / TOTAL_QUESTIONS) * 10);
    
    try {
      const { evaluateWithAI } = await import('../services/aiService');
      const evalData = await evaluateWithAI('Officer Intelligence Rating (OIR)', {
          score: finalScore,
          correctCount: scoreData.correct,
          total: TOTAL_QUESTIONS,
          scoreRange: '0-10',
          details: scoreData.details
      });
      setIsEvaluating(false);
      navigate('/report', { state: { evaluation: evalData, testName: 'Officer Intelligence Rating (OIR)' } });
    } catch (e) {
      console.error(e);
      setIsEvaluating(false);
      // If error occurs, we still want to show what happened if possible, but redirecting to dashboard is a safe fallback
      // alert("Evaluation failed: " + e.message);
      navigate('/dashboard');
    }
  };

  const handleSelectOption = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === TOTAL_QUESTIONS - 1;

  if (isTestComplete) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="glass-panel text-center p-8 max-w-4xl w-full relative overflow-hidden flex flex-col max-h-[90vh]">
          {isEvaluating && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
               <p className="text-primary font-bold animate-pulse">Calculating OIR Decile & Intelligence Rating...</p>
            </div>
          )}

          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">OIR Test Results</h2>
            <div className="text-4xl font-black text-primary mb-2">
              {scoreData.correct} / {TOTAL_QUESTIONS}
            </div>
            <p className="text-textSecondary">
              Your overall intelligence rating score based on {TOTAL_QUESTIONS} questions.
            </p>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 mb-8 custom-scrollbar text-left border-y border-white/10 py-4">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" /> Question Breakdown
            </h3>
            <div className="space-y-4">
              {scoreData.details.map((item, idx) => (
                <div key={idx} className="bg-surface/50 rounded-xl p-4 border border-white/5">
                  <p className="text-white font-medium mb-3">{item.question}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className={`p-3 rounded-lg ${item.isCorrect ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                      <span className="text-textSecondary block mb-1">Your Answer:</span>
                      <span className={`font-bold ${item.isCorrect ? 'text-blue-400' : 'text-red-400'}`}>
                        {item.userAnswer}
                      </span>
                    </div>
                    {!item.isCorrect && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <span className="text-textSecondary block mb-1">Correct Answer:</span>
                        <span className="font-bold text-blue-400">
                          {item.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button 
                onClick={() => navigate('/dashboard')}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
                Back to Dashboard
            </button>
            <button 
                onClick={submitTestToBackend} 
                disabled={isEvaluating} 
                className="btn-primary flex-1 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
                {isEvaluating ? 'Finalizing Evaluation...' : <>Finish & Save Records <ArrowRight className="w-5 h-5" /></>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto w-full">
      {/* Left Column: Question Area */}
      <div className="glass-panel w-full md:w-3/4 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <div className="border-b border-white/5 p-6 flex justify-between items-center bg-surface/50">
          <div className="text-lg font-bold text-white tracking-wide">
            Officer Intelligence Rating (OIR)
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${timeLeft <= 300 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-background border border-white/10 text-white'}`}>
            <Timer className="w-4 h-4" />
            <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8 flex-grow">
          <h3 className="text-2xl font-medium text-white leading-relaxed mb-10">
            {currentQuestion.text}
          </h3>

          <div className="space-y-4">
            {currentQuestion.opts.map((option, index) => {
              const isSelected = answers[currentQuestionIndex] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 text-lg ${
                    isSelected 
                      ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white' 
                      : 'bg-surface/50 border-white/10 text-textSecondary hover:border-white/30 hover:bg-surface'
                  }`}
                >
                  <span className="font-bold mr-4 text-sm opacity-50">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-white/5 p-6 bg-surface/50 flex justify-between items-center">
          <button 
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          
          <button 
            onClick={() => {
              if (isLastQuestion) handleCompleteTest();
              else setCurrentQuestionIndex(prev => Math.min(TOTAL_QUESTIONS - 1, prev + 1));
            }}
            className="btn-primary flex items-center gap-2"
          >
            {isLastQuestion ? 'Submit Test' : 'Next Question'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Column: Question Navigator */}
      <div className="glass-panel w-full md:w-1/4 p-6 hidden md:flex flex-col">
        <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Question Navigator</h3>
        
        {/* Status Legend */}
        <div className="flex gap-4 mb-6 text-xs text-textSecondary border-b border-white/10 pb-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary"></div> Attempted
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-surface border border-white/20"></div> Pending
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 overflow-y-auto pr-2 custom-scrollbar">
          {answers.map((ans, index) => {
            const isCurrent = currentQuestionIndex === index;
            const isAttempted = ans !== null;
            return (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`aspect-square rounded-lg flex items-center justify-center font-medium text-sm transition-all ${
                  isCurrent ? 'ring-2 ring-white scale-110 z-10' : ''
                } ${
                  isAttempted 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-surface border border-white/10 text-textSecondary hover:bg-surface/80'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
