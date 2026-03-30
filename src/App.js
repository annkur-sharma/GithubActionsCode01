import React, { useState, useEffect } from 'react';
import { predictTrend } from './utils/predictor';

// --- Shared Components ---
const Navbar = ({ setPage }) => (
  <nav className="bg-slate-900 text-white p-4 flex justify-center space-x-8 shadow-lg">
    {['Home', 'Date & Time', 'AI Predictor', 'About'].map((item) => (
      <button key={item} onClick={() => setPage(item)} className="hover:text-blue-400 transition-colors font-medium">
        {item}
      </button>
    ))}
  </nav>
);

// --- Page Components ---
const Home = () => (
  <div className="text-center py-20">
    <h1 className="text-5xl font-extrabold text-slate-800 mb-4">Welcome to AI Nexus</h1>
    <p className="text-xl text-slate-600">Testing advanced predictor pipelines with sleek UI.</p>
  </div>
);

const DateTimePage = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center py-20">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100 text-center">
        <h2 className="text-slate-500 uppercase tracking-widest mb-2">System Clock</h2>
        <div className="text-6xl font-mono font-bold text-blue-600">{time.toLocaleTimeString()}</div>
        <div className="text-lg text-slate-400 mt-2">{time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
    </div>
  );
};

const AIPage = () => {
  const [result, setResult] = useState(null);
  const handleTest = () => setResult(predictTrend());

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-6">Pipeline Testing Console</h2>
        <button 
          onClick={handleTest}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all"
        >
          Run Predictor Pipeline
        </button>
        {result && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-left border-l-4 border-blue-500 animate-fade-in">
            <p className="text-sm text-slate-500">Result Found:</p>
            <h3 className="text-xl font-bold text-slate-800">{result.prediction}</h3>
            <div className="mt-2 flex justify-between text-sm">
              <span>Confidence: <span className="font-bold text-green-600">{result.confidence}</span></span>
              <span className="text-slate-400">{result.timestamp.split('T')[1].slice(0, 8)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const About = () => (
  <div className="max-w-3xl mx-auto py-20 px-6 text-slate-700 leading-relaxed">
    <h2 className="text-3xl font-bold mb-4">About This Project</h2>
    <p>This is a static React application designed to validate CI/CD pipelines and AI logic integration. Built with React 18 and Tailwind CSS for high-performance styling.</p>
  </div>
);

// --- Main App ---
export default function App() {
  const [page, setPage] = useState('Home');

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <Navbar setPage={setPage} />
      <main className="container mx-auto">
        {page === 'Home' && <Home />}
        {page === 'Date & Time' && <DateTimePage />}
        {page === 'AI Predictor' && <AIPage />}
        {page === 'About' && <About />}
      </main>
    </div>
  );
}