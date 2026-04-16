import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const DAILY_NEWS = [
  {
    id: 1,
    category: 'Defence',
    title: 'India commissions INS Nilgiri — first stealth frigate of Project 17A',
    summary: 'The Indian Navy commissioned its most advanced warship INS Nilgiri, marking a major milestone in indigenous defence manufacturing under the P17A program.',
    source: 'The Hindu',
    time: '2 hours ago',
    tag: 'Navy',
    color: '#0ea5e9',
    link: 'https://www.thehindu.com',
  },
  {
    id: 2,
    category: 'Defence',
    title: 'DRDO successfully tests Astra Mk-2 Beyond Visual Range missile',
    summary: 'DRDO conducted successful trials of the upgraded Astra Mk-2 BVR air-to-air missile with enhanced range and terminal homing accuracy at Integrated Test Range.',
    source: 'India Today',
    time: '5 hours ago',
    tag: 'Missiles',
    color: '#f43f5e',
    link: 'https://www.indiatoday.in',
  },
  {
    id: 3,
    category: 'National',
    title: "PM Modi inaugurates India's largest solar plant in Rajasthan",
    summary: "The Bhadla Solar Park phase 4 expansion adds 1,500 MW of renewable capacity, reinforcing India's target of 500 GW non-fossil fuel energy by 2030.",
    source: 'PIB',
    time: '8 hours ago',
    tag: 'Energy',
    color: '#eab308',
    link: 'https://pib.gov.in',
  },
  {
    id: 4,
    category: 'International',
    title: 'India-France sign deal for 26 Rafale Marine jets for Navy',
    summary: 'India inks inter-governmental agreement with France for 26 Rafale Marine aircraft for the Indian Navy, strengthening the strategic maritime partnership.',
    source: 'Economic Times',
    time: '12 hours ago',
    tag: 'Air Force',
    color: '#a855f7',
    link: 'https://economictimes.indiatimes.com',
  },
  {
    id: 5,
    category: 'Science',
    title: 'ISRO successfully demonstrates reusable launch vehicle landing tech',
    summary: 'ISRO\'s Reusable Launch Vehicle (RLV-TD) successfully completed a precision runway landing, advancing India towards cost-effective space access.',
    source: 'Times of India',
    time: '1 day ago',
    tag: 'Space',
    color: '#10b981',
    link: 'https://timesofindia.indiatimes.com',
  },
];

const DEFENCE_UPDATES = [
  {
    id: 1,
    title: 'Army 2024 Exercise Talon Saber',
    body: 'Indian Army participated in joint military exercises with US forces focusing on high-altitude warfare, counter-terrorism drills, and joint logistical planning.',
    type: 'Exercise',
    color: '#10b981',
  },
  {
    id: 2,
    title: 'Agni-V MIRV: Multiple warheads tested',
    body: 'India joined elite nations after successfully testing MIRV (Multiple Independently targetable Re-entry Vehicle) capability on Agni-V ballistic missile, significantly enhancing strategic deterrence.',
    type: 'Missile',
    color: '#f43f5e',
  },
  {
    id: 3,
    title: 'BrahMos supersonic cruise missile export to Philippines',
    body: 'The Philippines received the first batch of BrahMos missiles, making India a major defence exporter in Southeast Asia and strengthening regional ties.',
    type: 'Export',
    color: '#0ea5e9',
  },
  {
    id: 4,
    title: 'HAL Tejas Mk-1A: 83 aircraft induction update',
    body: 'HAL accelerates production of Tejas Mk-1A fighters with deliveries on schedule. The aircraft features AESA radar and advanced avionics for air superiority.',
    type: 'Aviation',
    color: '#eab308',
  },
  {
    id: 5,
    title: 'Indian Army deploys AI-powered surveillance drones on LAC',
    body: 'The Army has deployed indigenously developed AI-powered autonomous surveillance drones along the Line of Actual Control for 24/7 border monitoring.',
    type: 'Technology',
    color: '#a855f7',
  },
  {
    id: 6,
    title: 'Operation Sindoor: IAF precision strike capability showcased',
    body: 'IAF demonstrated precision-strike capability in the latest joint exercise, showcasing network-centric warfare coordination between air and ground forces.',
    type: 'Air Force',
    color: '#f97316',
  },
];

const AI_TRENDS = [
  {
    id: 1,
    title: 'India launches National AI Mission with ₹10,000 Cr allocation',
    body: 'The Government of India unveiled IndiaAI Mission with dedicated focus on AI infrastructure, AI in governance, and building AI-ready talent across key sectors including defence.',
    impact: 'High',
    color: '#0ea5e9',
    icon: '🇮🇳',
  },
  {
    id: 2,
    title: 'AI in combat: Autonomous systems in modern warfare',
    body: 'Global militaries are integrating AI-driven autonomous systems — from swarm drones to logistics AI, predictive maintenance, and battlefield decision-support systems.',
    impact: 'Critical',
    color: '#f43f5e',
    icon: '🤖',
  },
  {
    id: 3,
    title: 'Google releases Gemini 2.0 Ultra — multimodal AI leaps forward',
    body: 'Google\'s flagship AI model Gemini 2.0 Ultra demonstrates near-human performance on reasoning, code generation, and multimodal tasks including video and audio understanding.',
    impact: 'Medium',
    color: '#a855f7',
    icon: '🧠',
  },
  {
    id: 4,
    title: 'DRDO deploys machine learning for land mine detection',
    body: 'DRDO\'s AI-based ground-penetrating radar system uses machine learning to detect buried IEDs and land mines, significantly improving combat engineer survivability.',
    impact: 'High',
    color: '#10b981',
    icon: '🛡️',
  },
];

const STUDY_MATERIALS = [
  {
    id: 1,
    title: 'OLQ — 15 Officer Like Qualities Explained',
    desc: 'Comprehensive breakdown of all 15 OLQs assessed by SSB psychologists and GTO, with real examples and assessment criteria.',
    category: 'Psychology',
    color: '#a855f7',
    icon: '🎓',
    readTime: '12 min read',
  },
  {
    id: 2,
    title: 'Current Affairs for SSB PI — April 2025',
    desc: 'Curated national and international current events specifically relevant to SSB Personal Interview, from defence acquisitions to economic milestones.',
    category: 'PI Prep',
    color: '#0ea5e9',
    icon: '📰',
    readTime: '20 min read',
  },
  {
    id: 3,
    title: 'GTO — Group Tasks Strategy Guide',
    desc: 'Tactical guide for all GTO tasks: Group Discussion, GPE, PGT, HGT, Snake Race — with positioning, communication, and leadership tips.',
    category: 'GTO',
    color: '#10b981',
    icon: '🚀',
    readTime: '15 min read',
  },
  {
    id: 4,
    title: 'Defence Acquisitions 2024–25 — Complete List',
    desc: 'Complete list of all major defence acquisitions, indigenisation milestones, and Make in India defence projects relevant for SSB and AFCAT interviews.',
    category: 'Defence',
    color: '#eab308',
    icon: '🛡️',
    readTime: '25 min read',
  },
  {
    id: 5,
    title: 'TAT Mastery — Story Structures for High OLQ Scores',
    desc: 'Learn the hero-protagonist model for TAT stories: how to weave leadership, tenacity, and social sensitivity into compelling narratives under time pressure.',
    category: 'Psychology',
    color: '#f97316',
    icon: '📖',
    readTime: '10 min read',
  },
  {
    id: 6,
    title: 'SSB Interview — Frequently Asked PI Questions & Model Answers',
    desc: 'Bank of 100+ most frequently asked questions in SSB Personal Interviews with structured model answers aligned to OLQ assessment framework.',
    category: 'PI Prep',
    color: '#f43f5e',
    icon: '💬',
    readTime: '30 min read',
  },
];

const TABS = [
  { id: 'news', label: 'Daily News', icon: '📡' },
  { id: 'defence', label: 'Defence Updates', icon: '🛡️' },
  { id: 'ai', label: 'AI & Tech', icon: '🧠' },
  { id: 'study', label: 'Study Materials', icon: '📚' },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function NewsCard({ item }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'rgba(16, 26, 17, 0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${item.color}50`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: item.color, background: `${item.color}15`, border: `1px solid ${item.color}30` }}
          >
            {item.tag}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">{item.time}</span>
        </div>
        <h3 className="text-sm font-bold text-white leading-snug mb-2 group-hover:text-sky-300 transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">
          {item.summary}
        </p>
        <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: item.color }}>
            {item.source}
          </span>
          <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" style={{ color: item.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </a>
  );
}

function DefenceCard({ item }) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group"
      style={{
        background: 'rgba(16, 26, 17, 0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${item.color}50`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }} />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
            style={{ color: item.color, background: `${item.color}15`, border: `1px solid ${item.color}30` }}
          >
            {item.type}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white leading-snug mb-2 group-hover:text-emerald-300 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {item.body}
        </p>
      </div>
    </div>
  );
}

function AICard({ item }) {
  const impactColors = { High: '#eab308', Critical: '#f43f5e', Medium: '#10b981' };
  const ic = impactColors[item.impact] || '#6366f1';
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group"
      style={{
        background: 'rgba(16, 26, 17, 0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${item.color}50`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }} />
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">{item.icon}</span>
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ml-auto"
            style={{ color: ic, background: `${ic}15`, border: `1px solid ${ic}30` }}
          >
            {item.impact} Impact
          </span>
        </div>
        <h3 className="text-sm font-bold text-white leading-snug mb-2 group-hover:text-purple-300 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {item.body}
        </p>
      </div>
    </div>
  );
}

function StudyCard({ item }) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
      style={{
        background: 'rgba(16, 26, 17, 0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${item.color}50`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }} />
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-3xl">{item.icon}</span>
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ color: item.color, background: `${item.color}15`, border: `1px solid ${item.color}30` }}
          >
            {item.category}
          </span>
        </div>
        <h3 className="text-sm font-bold text-white leading-snug mb-2 group-hover:text-amber-300 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed flex-grow mb-3">
          {item.desc}
        </p>
        <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] font-bold text-slate-500">{item.readTime}</span>
          <div
            className="ml-auto flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: item.color }}
          >
            Read <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import axios from 'axios';

export default function CurrentAffairs() {
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState([]);
  const [defence, setDefence] = useState([]);
  const [aiTrends, setAiTrends] = useState([]);
  const [study, setStudy] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const fetchAffairs = async () => {
      try {
        const res = await axios.get('/api/current-affairs');
        const data = res.data;
        
        setNews(data.filter(i => i.category === 'news'));
        setDefence(data.filter(i => i.category === 'defence'));
        setAiTrends(data.filter(i => i.category === 'ai'));
        setStudy(data.filter(i => i.category === 'study'));
        
      } catch (err) {
        console.error("Failed to fetch current affairs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAffairs();
  }, []);

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-[#06120b] text-sky-400 font-black tracking-widest uppercase">Fetching Intelligence Feed...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-[#06120b] text-white selection:bg-sky-500/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-20">

        {/* ── Header ── */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-400 transition-colors mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Command Centre
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-3"
                style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#7dd3fc' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                Live Intelligence Feed
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-none">
                Current{' '}
                <span style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Affairs
                </span>
              </h1>
              <p className="text-slate-500 text-sm mt-2 font-medium">{today}</p>
            </div>

            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}
            >
              <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse flex-shrink-0" />
              <span className="text-xs font-bold text-sky-300 uppercase tracking-widest">SSB Awareness Module Active</span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-200"
              style={
                activeTab === tab.id
                  ? { background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', boxShadow: '0 4px 16px rgba(14,165,233,0.3)' }
                  : { background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.07)' }
              }
              onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {activeTab === 'news' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #0ea5e9, #6366f1)' }} />
              <h2 className="text-lg font-black text-white tracking-tight">Today's Briefing</h2>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
                {news.length} Articles
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {news.map(item => <NewsCard key={item.id} item={item} />)}
            </div>
            <div className="mt-6 p-4 rounded-xl text-center text-xs text-slate-500" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              📡 News cards link directly to the source publication. Always verify from official sources.
            </div>
          </div>
        )}

        {activeTab === 'defence' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #10b981, #0ea5e9)' }} />
              <h2 className="text-lg font-black text-white tracking-tight">Defence Intelligence</h2>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                {defence.length} Updates
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {defence.map(item => <DefenceCard key={item.id} item={item} />)}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #a855f7, #6366f1)' }} />
              <h2 className="text-lg font-black text-white tracking-tight">AI & Technology Trends</h2>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                {aiTrends.length} Topics
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiTrends.map(item => <AICard key={item.id} item={item} />)}
            </div>
            <div className="mt-6 p-4 rounded-xl text-center text-xs text-slate-500" style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.1)' }}>
              🧠 SSB interviewers increasingly ask about AI, autonomous weapons, and space technology. Stay sharp.
            </div>
          </div>
        )}

        {activeTab === 'study' && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #eab308, #f97316)' }} />
              <h2 className="text-lg font-black text-white tracking-tight">SSB Study Materials</h2>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                {study.length} Resources
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {study.map(item => <StudyCard key={item.id} item={item} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
