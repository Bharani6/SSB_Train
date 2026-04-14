import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowRight, Eye, PenTool, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const OBSERVE_TIME_SECONDS = 30;
const WRITE_TIME_SECONDS = 240; // 4 minutes
const TOTAL_IMAGES = 12;

export default function TatTest() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [phase, setPhase] = useState('observe'); // 'observe', 'write', 'complete'
  const [timeLeft, setTimeLeft] = useState(OBSERVE_TIME_SECONDS);
  const [currentStory, setCurrentStory] = useState('');
  const [allStories, setAllStories] = useState([]);
  const [todaysImages, setTodaysImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTat = async () => {
      try {
        const res = await axios.get('/api/questions/TAT_THEMATIC/11');
        if (res.data && res.data.length > 0) {
           setTodaysImages(res.data.map(q => `/api/questions/image/${q.id}`));
        } else {
           throw new Error("No data");
        }
      } catch (err) {
        console.error("Failed to fetch TAT images:", err);
        setTodaysImages(new Array(11).fill("/assets/thematic_panchayat.png"));
      } finally {
        setLoading(false);
      }
    };
    fetchTat();
  }, []);

  useEffect(() => {
    if (phase === 'complete' || loading) return;

    if (timeLeft <= 0) {
      if (phase === 'observe') {
        setPhase('write');
        setTimeLeft(WRITE_TIME_SECONDS);
      } else if (phase === 'write') {
        handleNextImage();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, phase, loading]);

  const handleNextImage = async () => {
    const updatedStories = [...allStories, currentStory];
    setAllStories(updatedStories);
    
    if (currentImageIndex < TOTAL_IMAGES - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setCurrentStory('');
      setPhase('observe');
      setTimeLeft(OBSERVE_TIME_SECONDS);
    } else {
      setPhase('complete');
      await submitTestToBackend(updatedStories);
    }
  };

  const submitTestToBackend = async (stories) => {
    setIsEvaluating(true);
    try {
      const { evaluateWithAI } = await import('../services/aiService');
      const evalData = await evaluateWithAI('Thematic Apperception Test (TAT)', { stories: stories });
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
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
           <p className="mt-4 text-purple-400 font-bold uppercase tracking-widest text-xs">Calibrating Psychological Projector...</p>
        </div>
     );
  }

  if (phase === 'complete') {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="glass-panel text-center p-8 max-w-4xl w-full relative overflow-hidden flex flex-col max-h-[90vh]">
          {isEvaluating && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
               <p className="text-purple-400 font-bold animate-pulse">AI Board Reviewing Your Stories...</p>
            </div>
          )}

          {!evaluationResults ? (
            <div className="py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-purple-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">TAT Sequence Finished</h2>
              <button 
                onClick={() => submitTestToBackend(allStories)} 
                className="btn-primary max-w-md w-full flex items-center justify-center gap-2"
              >
                Evaluate My Apperception <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="text-left overflow-y-auto pr-2 custom-scrollbar">
               <h2 className="text-2xl font-bold text-white mb-6">Psychological Evaluation: {evaluationResults.score_out_of_10}/10</h2>
               <p className="text-purple-400 text-sm mb-6">{evaluationResults.feedback_psych}</p>
               <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full">Back to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 max-w-5xl mx-auto w-full">
      <div className="glass-panel w-full relative overflow-hidden">
        <div className="h-1.5 w-full bg-surface/50">
          <div 
            className="h-full bg-purple-500 transition-all duration-300" 
            style={{ width: `${((currentImageIndex) / TOTAL_IMAGES) * 100}%` }}
          />
        </div>

        <div className="border-b border-white/5 p-6 flex justify-between items-center bg-surface/50">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-wide">TAT PIC {currentImageIndex + 1}/{TOTAL_IMAGES}</h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-white/10 text-white">
            <Timer className="w-5 h-5" />
            <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="p-8 h-[500px] flex flex-col items-center justify-center">
          {phase === 'observe' ? (
             currentImageIndex === TOTAL_IMAGES - 1 ? (
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                   <p className="text-black font-black text-3xl">BLANK SLIDE</p>
                </div>
             ) : (
                <img src={todaysImages[currentImageIndex]} alt="TAT Scenario" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl grayscale-[100%] contrast-110" />
             )
          ) : (
            <textarea
              value={currentStory}
              onChange={(e) => setCurrentStory(e.target.value)}
              className="w-full h-full bg-surface/30 border border-white/20 rounded-xl p-6 text-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write your story related to the picture shown..."
            />
          )}
        </div>

        {phase === 'write' && (
          <div className="border-t border-white/5 p-6 bg-surface/50 flex justify-end items-center">
             <button onClick={handleNextImage} className="btn-primary flex items-center gap-2">
               {currentImageIndex < TOTAL_IMAGES - 1 ? 'Next Picture' : 'Complete Test'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
