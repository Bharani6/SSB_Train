import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar } from 'lucide-react';
import AIChatAssistant from '../components/AIChatAssistant';

const SSB_DAYS = [
  {
    day: 1,
    label: 'Day 1 — Screening',
    subtitle: 'OIR Test + PPDT',
    color: '#6366f1',
    modules: [
      {
        id: 'oir', label: 'OIR', title: 'Officer Intelligence Rating',
        desc: '50 questions · Verbal & Non-verbal · 30 min',
        path: '/test/oir', color: '#6366f1', badge: 'Intelligence',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        ),
      },
      {
        id: 'ppdt', label: 'PPDT', title: 'Picture Perception & Discussion',
        desc: '30s observe · 4 min write · Story formation',
        path: '/test/ppdt', color: '#3b82f6', badge: 'Perception', primary: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        ),
      },
    ],
  },
  {
    day: 2,
    label: 'Day 2 — Psychology',
    subtitle: 'WAT + TAT + SRT + SDT',
    color: '#a855f7',
    modules: [
      {
        id: 'wat', label: 'WAT', title: 'Word Association Test',
        desc: '60 words · 15 sec each · Auto-submit',
        path: '/test/wat', color: '#8b5cf6', badge: 'Association',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        ),
      },
      {
        id: 'tat', label: 'TAT', title: 'Thematic Apperception Test',
        desc: '12 images · 30s observe + 4 min story each',
        path: '/test/tat', color: '#a855f7', badge: 'Apperception', primary: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
          </svg>
        ),
      },
      {
        id: 'srt', label: 'SRT', title: 'Situation Reaction Test',
        desc: '60 situations · 30 min global timer',
        path: '/test/srt', color: '#10b981', badge: 'Reaction',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        ),
      },
      {
        id: 'sdt', label: 'SDT', title: 'Self Description Test',
        desc: '5 pillars · Introspection · 15 min',
        path: '/test/sdt', color: '#f97316', badge: 'Introspection', primary: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        ),
      },
    ],
  },
  {
    day: 3,
    label: 'Day 3 — Personal Interviews',
    subtitle: 'Standard IO + SSC Tech Entry Block',
    color: '#eab308', // Yellow
    modules: [
      {
        id: 'io', label: 'IO', title: 'Standard Interview',
        desc: 'Interviewing Officer · NDA / CDS General Questions',
        path: '/test/io?type=standard', color: '#eab308', badge: 'General', primary: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        ),
      },
      {
        id: 'io_ssc', label: 'SSC TECH', title: 'Tech Entry Interview',
        desc: 'Technical Cross-Examination · Engineering & CS Core',
        path: '/test/io?type=ssc_tech', color: '#f59e0b', badge: 'Technical', primary: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        ),
      },
    ],
  },
  {
    day: 4,
    label: 'Day 4 — Advanced GTO',
    subtitle: 'Group Discussion + GPE + Lecturette',
    color: '#14b8a6', // Teal
    modules: [
      {
        id: 'gd', label: 'GD', title: 'Group Discussion',
        desc: 'Group Dynamics · 2 Consecutive Topics',
        path: '/test/gd', color: '#10b981', badge: 'Discourse', primary: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        ),
      },
      {
        id: 'gpe', label: 'GPE', title: 'Group Planning Exercise',
        desc: 'Crisis narrative · 15 min strict timer',
        path: '/test/gpe', color: '#ef4444', badge: 'Planning', primary: true,
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
        ),
      },
      {
        id: 'lecturette', label: 'LECT', title: 'Lecturette',
        desc: '4 topics · 3 min prep · 3 min delivery',
        path: '/test/lecturette', color: '#06b6d4', badge: 'Verbal',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        ),
      },
    ],
  },
];

const confModule = {
  id: 'conference', label: 'CONFERENCE', title: 'Board Conference',
  desc: 'Final Board Meeting · Result Declaration & Comprehensive Evaluation summary.',
  path: '/report', color: '#f43f5e', badge: 'Final Results',
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    active_days: 0,
    tests_logged: 0,
    avg_score: 0.0,
    active_dates: []
  });
  const [records, setRecords] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' or 'analytics'

  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem('USER_DATA');
    if (!rawUser) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(rawUser);
    setUserData(user);

    const fetchDashboardStats = async () => {
      try {
        // Ping first to update active status for today
        await axios.get(`/api/evaluations/${user.email}/ping`);

        const res = await axios.get(`/api/evaluations/dashboard/${user.email}`);
        console.log("Dashboard Stats Fetched:", res.data);
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    const fetchRecords = async () => {
      try {
        const res = await axios.get(`/api/evaluations/user/${user.email}`);
        setRecords(res.data.reverse());
      } catch (err) {
        console.error("Failed to fetch records:", err);
      }
    };

    fetchDashboardStats();
    fetchRecords();
  }, [navigate]);

  const getCalendarDays = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    });
  };

  const recordsByDate = records.reduce((acc, rec) => {
    if (rec.dateString) {
      if (!acc[rec.dateString]) acc[rec.dateString] = [];
      acc[rec.dateString].push(rec);
    }
    return acc;
  }, {});

  const handleDateClick = (dateStr) => {
    if (recordsByDate[dateStr]) {
      setShowCalendar(false);
      navigate('/archive', { state: { date: dateStr, dayRecords: recordsByDate[dateStr] } });
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const monthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDayOffset = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();

  const streakCount = dashboardData.active_days;
  const testsLogged = dashboardData.tests_logged;
  const avgScore = dashboardData.avg_score > 0 ? dashboardData.avg_score.toFixed(1) : '—';
  const activeDatesBackend = dashboardData.active_dates || [];

  return (
    <div className="min-h-screen w-full bg-[#06120b] relative overflow-hidden text-white selection:bg-emerald-500/30">

      {/* ── Removed Background Design ── */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20">

        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 mb-16">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Operational Status: Active
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9] mb-4">
              Welcome<br />
              <span style={{ background: 'linear-gradient(135deg, #fbbf24, #10b981, #047857)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {userData?.name ? userData.name.toUpperCase() : 'CADET'}
              </span>
            </h1>
            <p className="text-slate-400 max-w-md font-medium leading-relaxed border-l-2 border-emerald-500/30 pl-4 mt-6">
              Your mission is consistency. Every test logged brings you closer to commissioning as an officer.
            </p>
          </div>

          {/* Tactical Overview Dashboard */}
          <div className="lg:w-[500px] flex flex-col gap-4">
            <div className="p-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-700" /> Tactical Overview
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Metric 1: Total Active Days */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 relative group transition-all hover:bg-white/[0.05] overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">🔥</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Total Active Days</span>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white">{dashboardData.active_days}</span>
                  <div className="flex flex-col mb-1">
                    <span className="text-[10px] font-black text-orange-500 uppercase leading-none">{dashboardData.streak || 0}-Day Streak</span>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`h-1 w-2 rounded-full ${i < (dashboardData.streak || 0) ? 'bg-orange-500' : 'bg-white/10'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric 2: Tests */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 relative group transition-all hover:bg-white/[0.05] overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">📊</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Tests Logged</span>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white">{testsLogged}</span>
                  <span className="text-[10px] font-black text-indigo-400 uppercase mb-1 leading-none tracking-widest">Units</span>
                </div>
              </div>

              {/* Metric 3: Score */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 relative group transition-all hover:bg-white/[0.05] overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">🎯</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Avg Score</span>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white">{avgScore}</span>
                  <span className="text-[10px] font-black text-emerald-400 uppercase mb-1 leading-none tracking-widest">/ 10.0</span>
                </div>
              </div>

              {/* Metric 4: Archive Link */}
              <Link to="/archive"
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col justify-between group transition-all hover:bg-emerald-500/20 hover:border-emerald-500/40 text-left relative overflow-hidden">
                <div className="absolute top-2 right-2 p-1 text-emerald-500 opacity-20 group-hover:opacity-100 transition-all group-hover:rotate-12">
                  <Calendar className="w-8 h-8" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1">Mission Log</span>
                <div>
                  <span className="text-2xl font-black text-white block">Archive</span>
                  <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">Training History →</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ── SSB Day-wise Module Sections ─────────────── */}
        <div className="space-y-10 mb-10">
          {SSB_DAYS.map(dayGroup => (
            <div key={dayGroup.day}>
              {/* Day Section Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl text-sm font-black text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${dayGroup.color}, ${dayGroup.color}99)`, boxShadow: `0 4px 16px ${dayGroup.color}40` }}>
                  {dayGroup.day}
                </div>
                <div>
                  <h2 className="text-lg font-black text-white leading-none">{dayGroup.label}</h2>
                  <p className="text-sm mt-0.5" style={{ color: dayGroup.color }}>{dayGroup.subtitle}</p>
                </div>
                <div className="flex-grow h-px ml-2" style={{ background: `linear-gradient(to right, ${dayGroup.color}40, transparent)` }} />
              </div>

              {/* Module Cards for this Day */}
              <div className={`grid gap-4 ${dayGroup.modules.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                {dayGroup.modules.map(mod => (
                  <Link to={mod.path} key={mod.id}
                    className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                    style={{ background: 'rgba(16, 26, 17, 0.8)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${mod.color}50`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                  >
                    {/* Top accent line */}
                    <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, ${mod.color}, transparent)` }} />

                    <div className="p-5 flex flex-col gap-3 flex-grow">
                      {/* Icon + Badge */}
                      <div className="flex items-start justify-between">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                          style={{ background: `${mod.color}15`, color: mod.color }}>
                          {mod.icon}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
                          style={{ color: mod.color, background: `${mod.color}15`, border: `1px solid ${mod.color}30` }}>
                          {mod.badge}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-[0.2em] uppercase block mb-0.5" style={{ color: mod.color }}>{mod.label}</span>
                        <h3 className="text-base font-bold text-white leading-tight">{mod.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed flex-grow">{mod.desc}</p>
                      <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-black transition-all duration-300 group-hover:scale-110"
                          style={{ background: mod.primary ? mod.color : `${mod.color}20`, color: mod.primary ? '#fff' : mod.color }}>
                          ▶
                        </div>
                        <span className="text-xs font-bold" style={{ color: mod.color }}>
                          {mod.primary ? 'Start Now' : 'Begin Module'}
                        </span>
                        <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0"
                          style={{ color: mod.color }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Day 5 — Board Conference */}
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl text-sm font-black text-white flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #be123c)', boxShadow: '0 4px 16px rgba(244,63,94,0.4)' }}>
                5
              </div>
              <div>
                <h2 className="text-lg font-black text-white leading-none">Day 5 — Board Conference</h2>
                <p className="text-sm mt-0.5" style={{ color: '#f43f5e' }}>Final Results & Comprehensive Analytics</p>
              </div>
              <div className="flex-grow h-px ml-2" style={{ background: 'linear-gradient(to right, rgba(244,63,94,0.4), transparent)' }} />
            </div>

            <Link to={confModule.path}
              className="group relative flex flex-col lg:flex-row items-center gap-6 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl p-6"
              style={{ background: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(10,15,30,0.9))', border: '1px solid rgba(244,63,94,0.15)', backdropFilter: 'blur(20px)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(244,63,94,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(244,63,94,0.15)'}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(ellipse at right, rgba(244,63,94,0.06), transparent 60%)' }} />
              <div className="flex items-center gap-5 flex-grow relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl transition-transform group-hover:scale-110 duration-300"
                  style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)' }}>
                  👔
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: '#f43f5e' }}>{confModule.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)' }}>
                      {confModule.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">{confModule.title}</h3>
                  <p className="text-sm text-slate-400">{confModule.desc}</p>
                </div>
              </div>
              <button className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-105 relative z-10 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #be123c)' }}>
                View Final Report
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {/* ── Recent Records ───────────────────────────── */}
        {records.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(to bottom, #10b981, #06b6d4)' }} />
              <h2 className="text-xl font-bold text-white tracking-tight">Recent Evaluations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {records.slice(0, 3).map((rec, i) => (
                <button
                  key={rec.id || i}
                  onClick={() => navigate('/report', { state: { evaluation: rec, testName: rec.testModule } })}
                  className="rounded-2xl p-4 flex items-center justify-between text-left hover:bg-white/10 transition-all border border-white/5 hover:border-emerald-500/30 group"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-0.5">{rec.dateString}</p>
                    <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{rec.testModule}</p>
                  </div>
                  <div className={`text-3xl font-black ${rec.score >= 7 ? 'text-emerald-400' : rec.score >= 4 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {rec.score}<span className="text-base text-slate-500">/10</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Calendar Modal ───────────────────────────── */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={e => e.target === e.currentTarget && setShowCalendar(false)}>

          <div className="w-full max-w-[340px] rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(145deg, #0a1f11, #050f08)', border: '1px solid rgba(16,185,129,0.25)' }}>

            {/* Header */}
            <div className="p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #047857, #b45309)' }}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3), transparent 50%)' }} />
              <div className="relative z-10">
                <p className="text-emerald-200 text-xs font-bold uppercase tracking-[0.15em] mb-1">Training Archive</p>
                <h3 className="text-2xl font-black text-white">{monthLabel}</h3>
              </div>
              <button onClick={() => setShowCalendar(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all z-10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="grid grid-cols-7 mb-3">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="flex items-center justify-center h-8 text-[11px] font-bold text-slate-500">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e-${i}`} />)}
                {getCalendarDays().map(dateStr => {
                  const dayNum = parseInt(dateStr.split('-')[2]);
                  const hasData = activeDatesBackend.includes(dateStr);
                  // Ensure comparison works even if backend returns slightly different string format
                  const hasDataFormatted = activeDatesBackend.some(d => d.split('T')[0] === dateStr);
                  const isToday = dateStr === today;
                  return (
                    <div key={dateStr} className="flex justify-center py-1">
                      <button
                        onClick={() => handleDateClick(dateStr)}
                        disabled={!hasData && !hasDataFormatted}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200"
                        style={
                          (hasData || hasDataFormatted)
                            ? { background: 'linear-gradient(135deg, #10b981, #d97706)', color: '#fff', fontWeight: '700', transform: 'none', boxShadow: '0 4px 12px rgba(16,185,129,0.4)' }
                            : isToday
                              ? { border: '2px solid rgba(16,185,129,0.5)', color: '#6ee7b7', fontWeight: '700' }
                              : { color: 'rgba(148,163,184,0.4)', cursor: 'default' }
                        }
                        onMouseEnter={e => (hasData || hasDataFormatted) && (e.currentTarget.style.transform = 'scale(1.12)')}
                        onMouseLeave={e => (hasData || hasDataFormatted) && (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        {dayNum}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend + Footer */}
            <div className="px-5 pb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(135deg, #10b981, #d97706)' }} />
                Has records ({Object.keys(recordsByDate).length} days)
              </div>
              <button onClick={() => setShowCalendar(false)}
                className="text-xs font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Tactical Assistant */}
      <AIChatAssistant userData={userData} />
    </div>
  );
}
