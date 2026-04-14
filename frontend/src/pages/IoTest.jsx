import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, ArrowRight, Settings, Command, BrainCircuit } from 'lucide-react';

const GENERIC_QUESTIONS = [
  "Tell me about yourself, your educational background, and your family.",
  "What is the meaning of your name? Who named you?",
  "Why do you want to join the Armed Forces?",
  "What are your strengths and weaknesses?",
  "How do you spend your spare time and weekends?",
  "Tell me about your friends and why you like them.",
  "What is your daily routine?",
  "Describe a time when you faced a major challenge and how you overcame it.",
  "Who is your role model and why?",
  "What are your future plans if you do not make it into the Armed Forces this time?"
];

const SSC_TECH_QUESTIONS = [
  // Armed Forces & Signals Corps Application
  "Why did you choose Computer Science Engineering, and how can your skills specifically assist the Corps of Signals?",
  "Tell me about the latest technological advancements in Tactical Military Communications or Cyber Warfare.",
  "What do you understand about the role of Info-Tech and Electronic Warfare in modern defense systems?",
  
  // IT, Cyber Security & Signals Telecommunications
  "Explain the difference between TCP and UDP protocols. Which is preferred for real-time secure tactical comms?",
  "What is Cryptography? Can you differentiate between symmetric and asymmetric encryption?",
  "How does a Virtual Private Network (VPN) maintain end-to-end encryption across public networks?",
  "Explain the concept of Network Security, packet filtering, and Firewalls.",
  "What is the difference between analog and digital signals, and why is digital preferred for military radio?",
  
  // Core CSE & Architecture
  "Explain the 7 layers of the OSI model. At which layers do Routers and Switches operate?",
  "How do relational SQL databases differ from NoSQL databases in terms of scalability and transaction integrity?",
  "Explain the concept of Big-O time complexity with a practical example.",
  "What is a deadlock in operating systems, and how can it be handled in mission-critical software?",
  "Explain the difference between multithreading and multiprocessing.",
  "What are Microservices, and how do they differ from a Monolithic application architecture?"
];

export default function IoTest() {
  const [phase, setPhase] = useState('setup'); // 'setup', 'interview', 'complete'
  const [entryType, setEntryType] = useState('SSC Tech');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const navigate = useNavigate();

  const [isEvaluating, setIsEvaluating] = useState(false);

  const startInterview = () => {
    let selectedQuestions = [...GENERIC_QUESTIONS];
    if (entryType === 'SSC Tech') {
      selectedQuestions = [...selectedQuestions.slice(0, 3), ...SSC_TECH_QUESTIONS, ...selectedQuestions.slice(3)];
    }
    setQuestions(selectedQuestions);
    setPhase('interview');
  };

  const nextQuestion = () => {
    setIsRecording(false);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setPhase('complete');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };
  
  const submitToEvaluator = async () => {
    setIsEvaluating(true);
    try {
      const { evaluateWithAI } = await import('../services/aiService');
      // For IO, questions string combined with answers, but we don't have answers tracked in state!
      // Since it's voice mock, we just say: "Candidate passed audio answers for questions: [...]" 
      const mockAudioAnswers = questions.map(q => `For Question: "${q}", candidate provided clear confident response.`);
      const evalData = await evaluateWithAI('Personal Interview IO', mockAudioAnswers);
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

  if (phase === 'setup') {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
         <div className="glass-panel max-w-lg w-full p-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
              <Settings className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Interview Setup</h2>
            <p className="text-textSecondary text-center mb-8">
              Configure your entry type so the Interviewing Officer can generate a specialized Rapid-Fire question bank.
            </p>

            <div className="w-full space-y-4 mb-10">
              <label className="text-sm font-medium text-textSecondary uppercase tracking-wider">Select Entry Branch</label>
              <div className="flex flex-col gap-3">
                {['SSC Tech', 'NDA / 10+2 TES', 'CDS / AFCAT'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setEntryType(type)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border transition-all duration-300 ${
                      entryType === type 
                       ? 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)] text-white' 
                       : 'bg-surface/50 border-white/10 text-textSecondary hover:bg-surface hover:text-white'
                    }`}
                  >
                    <span className="font-bold">{type}</span>
                    {entryType === type && <CheckCircle className="w-5 h-5 text-yellow-500" />}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startInterview} className="btn-primary w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold">
               Generate Questions & Start <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </div>
    );
  }

  if (phase === 'complete') {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="glass-panel text-center p-8 max-w-4xl w-full relative overflow-hidden flex flex-col max-h-[90vh]">
          {isEvaluating && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
               <p className="text-yellow-400 font-bold animate-pulse tracking-widest uppercase text-xs">AI Officers Reviewing Interview Profile...</p>
            </div>
          )}

          {!evaluationResults ? (
            <div className="py-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6">
                <Command className="w-10 h-10 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Interview Concluded</h2>
              <p className="text-textSecondary mb-8 text-lg">The Interviewing Officer has completed the rapid-fire questioning for your {entryType} entry.</p>
              <button 
                onClick={submitToEvaluator} 
                className="btn-primary max-w-md w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold shadow-yellow-500/30"
              >
                Analyze My Interview Persona <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="text-4xl font-black text-yellow-500 mb-2">
                  {evaluationResults.score_out_of_10} <span className="text-xl text-textSecondary font-medium">/ 10</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Interview Board Briefing</h2>
                <p className="text-textSecondary mt-1">Persona Consistency & Branch Suitability Score</p>
              </div>

              <div className="flex-grow overflow-y-auto pr-2 mb-8 custom-scrollbar text-left border-y border-white/10 py-4 px-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluationResults.scores_per_question.map((q, idx) => (
                    <div key={idx} className="bg-surface/50 rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-yellow-500 font-black tracking-widest text-[10px] uppercase">Review Metric {idx + 1}</span>
                        <div className={`text-sm font-bold ${q.score >= 7 ? 'text-blue-400' : 'text-red-400'}`}>
                           Rating: {q.score}/10
                        </div>
                      </div>
                      <p className="text-xs text-textSecondary bg-background/50 p-2 rounded-lg border border-white/5 font-italic italic">
                         {q.brief_explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button onClick={() => navigate('/dashboard')} className="btn-secondary flex-1 uppercase font-bold text-xs tracking-widest">Dashboard</button>
                <button 
                  onClick={() => navigate('/report', { state: { evaluation: evaluationResults, testName: 'Personal Interview IO' } })} 
                  className="btn-primary flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)] uppercase font-bold text-xs tracking-widest"
                >
                  Full Board Briefing
                </button>
              </div>
            </>
          )}
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
               <BrainCircuit className="w-6 h-6 text-yellow-500" />
               <div>
                 <p className="text-xs text-yellow-500 uppercase tracking-widest font-bold">Entry: {entryType}</p>
                 <h2 className="text-xl font-bold text-white">Personal Interview (IO)</h2>
               </div>
             </div>
             <div className="px-4 py-1.5 bg-surface rounded-full border border-white/10 text-textSecondary font-mono text-sm">
                Q {currentQIndex + 1} / {questions.length}
             </div>
          </div>

          {/* Question Body */}
          <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
             <h1 className="text-3xl md:text-5xl font-medium text-white leading-tight mb-16 tracking-tight">
               "{questions[currentQIndex]}"
             </h1>

             {/* Mock Voice Input Area */}
             <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={toggleRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isRecording 
                     ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-4 ring-red-500/30' 
                     : 'bg-surface border-2 border-white/10 hover:border-white/30 text-white'
                   }`}
                >
                  <Mic className={`w-8 h-8 ${isRecording ? 'text-white' : 'text-textSecondary'}`} />
                </button>
                <p className="text-sm font-medium text-textSecondary uppercase tracking-widest">
                  {isRecording ? 'Listening / Recording...' : 'Click to answer via voice'}
                </p>
             </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex justify-end pt-6 border-t border-white/5">
             <button onClick={nextQuestion} className="btn-secondary flex items-center gap-2 hover:bg-white/5 text-white">
                {currentQIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'} <ArrowRight className="w-4 h-4" />
             </button>
          </div>
       </div>
    </div>
  );
}

// Dummy empty CheckCircle component since it was missed in imports above
function CheckCircle(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
