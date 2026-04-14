import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import OirTest from './pages/OirTest'
import WatTest from './pages/WatTest'
import PpdtTest from './pages/PpdtTest'
import TatTest from './pages/TatTest'
import SrtTest from './pages/SrtTest'
import SdtTest from './pages/SdtTest'
import IoTest from './pages/IoTest'
import EvaluationReport from './pages/EvaluationReport'
import LecturetteTest from './pages/LecturetteTest'
import GpeTest from './pages/GpeTest'
import ArchivalReport from './pages/ArchivalReport'
import ArchivePage from './pages/Archive'
import GdTest from './pages/GdTest'

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/' || location.pathname === '/forgot-password';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {!isAuthPage && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] pointer-events-none z-0"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px] pointer-events-none z-0"></div>
        </>
      )}

      <Navbar />
      <main className={`flex-grow z-10 flex flex-col ${isAuthPage ? '' : 'p-6'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test/oir" element={<OirTest />} />
          <Route path="/test/wat" element={<WatTest />} />
          <Route path="/test/ppdt" element={<PpdtTest />} />
          <Route path="/test/tat" element={<TatTest />} />
          <Route path="/test/srt" element={<SrtTest />} />
          <Route path="/test/sdt" element={<SdtTest />} />
          <Route path="/test/io" element={<IoTest />} />
          <Route path="/test/lecturette" element={<LecturetteTest />} />
          <Route path="/test/gpe" element={<GpeTest />} />
          <Route path="/test/gd" element={<GdTest />} />
          <Route path="/report" element={<EvaluationReport />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
