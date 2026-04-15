import axios from 'axios';

// Since this is a client-side execution, we require the user's Gemini API key from localStorage.
// You can get a free one at https://aistudio.google.com/
export const evaluateWithAI = async (testName, rawResponses) => {
  const apiKey = localStorage.getItem('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  const prompt = `
    You are a strict SSB (Services Selection Board) evaluation engine.
    Analyze the candidate's answers from the ${testName} test module.
    
    Candidate Responses:
    ${JSON.stringify(rawResponses)}

    I want you to evaluate this strictly based on 3 personas:
    1. 🧠 Psych (Strict Psychologist Mode): Check natural thinking vs artificial. Look for consistency and OLQs (Officer Like Qualities) visibility, not just good English. Even for a small mismatch, cut marks.
    2. 🪖 GTO (Tough Ground Testing Officer): Judge Initiative, Team behavior, and Practical intelligence. If you spot "bookish" answers -> Reject it aggressively!
    3. 🎯 Interview (Technical IO Mode): Cross-question deeply (hypothetically in your feedback), catch bluffing, and evaluate their clarity and confidence.

    You must return a JSON structure ONLY, with no markdown formatting around it, matching this EXACT format:
    {
      "score_out_of_10": <integer from 1 to 10>,
      "feedback_psych": "<string strictly assessing psychology based on rules>",
      "feedback_gto": "<string strictly assessing GTO based on rules>",
      "feedback_io": "<string strictly assessing IO based on rules>",
      "scores_per_question": [
        {
          "question": "<string original question/word/context>",
          "candidate_response": "<string what user wrote>",
          "is_correct": <boolean or null if subjective>,
          "score": <integer 0-10>,
          "best_answer": "<string the absolute best/ideal SSB answer for this specific question/word>",
          "brief_explanation": "<string why the candidate was graded this way>"
        }
      ]
    }
  `;

  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.2, // Low temp for strict grading
            responseMimeType: "application/json"
        }
      }
    );

    const textPayload = res.data.candidates[0].content.parts[0].text;
    const evaluation = JSON.parse(textPayload);
    
    // Save to our Java Backend Database
    try {
        const userData = JSON.parse(localStorage.getItem('USER_DATA') || '{}');
        const userEmail = userData.email || 'anonymous@ssb.train';
        
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        await axios.post('/api/evaluations/submit', {
            sessionId: "session_" + Date.now(),
            userEmail: userEmail,
            testModule: testName,
            score: evaluation.score_out_of_10,
            dateString: dateString,
            userAnswers: JSON.stringify({ 
                rawResponses, 
                scores_per_question: evaluation.scores_per_question 
            }),
            psychFeedback: evaluation.feedback_psych,
            gtoFeedback: evaluation.feedback_gto,
            ioFeedback: evaluation.feedback_io
        });
    } catch(dbErr) {
        console.error("Failed to persist to database, but evaluation succeeded", dbErr);
    }
    
    return evaluation;
  } catch (error) {
    console.error("AI Evaluation failed:", error);
    throw error;
  }
};

/**
 * General Chat for Tactical AI Assistant
 * @param {string} userMessage 
 * @param {Array} history - Previous messages for context
 */
export const chatWithAI = async (userMessage, history = []) => {
  const apiKey = localStorage.getItem('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }

  // Prepend a system-like context to the first message if history is empty
  const systemPrompt = `
    You are the "Tactical AI Assistant" for the SSB Training System.
    Your mission is to mentor SSB (Services Selection Board) aspirants.
    
    TONE & STYLE:
    1. Professional, precise, and encouraging (like a senior officer).
    2. Use military terminology where appropriate (e.g., "Acknowledged", "Negative", "Mission objective").
    3. Keep responses concise but highly actionable.
    
    KNOWLEDGE FOCUS:
    - Officer Like Qualities (OLQs).
    - Strategies for OIR, PPDT, WAT, TAT, SRT, and SDT.
    - Personal Interview tips and GTO ground task insights.
    - Encouragement based on "Training hard to serve harder".

    If the user asks something non-military/non-SSB, politely redirect them to focus on their training.
  `;

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: "Tactical Assistant systems online. Ready for mission briefing. How can I assist your SSB preparation today?" }] },
    ...history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })),
    { role: 'user', parts: [{ text: userMessage }] }
  ];

  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 500,
        }
      }
    );

    return res.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Chat AI failed:", error);
    throw error;
  }
};

