import React, { useState, useEffect } from 'react';

// --- Components ---
const Navbar = ({ setPage }) => (
  <nav className="bg-slate-900 text-white p-4 flex justify-center space-x-8 shadow-xl">
    {['Home', 'Date & Time', 'AI Predictor', 'About'].map((item) => (
      <button 
        key={item} 
        onClick={() => setPage(item)} 
        className="hover:text-blue-400 transition-all font-semibold uppercase text-sm tracking-widest"
      >
        {item}
      </button>
    ))}
  </nav>
);

const Home = () => (
  <div className="text-center py-24 animate-fade-in">
    <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">
      AI Predictor <span className="text-blue-600">Pipeline</span>
    </h1>
    <p className="text-xl text-slate-500 max-w-lg mx-auto">
      Testing static web application deployment and real-time logic execution.
    </p>
  </div>
);

const DateTimePage = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center py-20 animate-fade-in">
      <div className="bg-white p-12 rounded-3xl shadow-2xl border border-slate-100 text-center">
        <h2 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-4">System Time</h2>
        <div className="text-7xl font-mono font-black text-slate-800">{time.toLocaleTimeString()}</div>
        <div className="text-slate-400 mt-4 font-medium">{time.toLocaleDateString(undefined, { dateStyle: 'full' })}</div>
      </div>
    </div>
  );
};

const AIPage = () => {
  const [result, setResult] = useState(null);
  
  const runPrediction = () => {
    // Simulated Predictor Logic
    const outcomes = ["High Growth", "Market Volatility", "Steady State", "Correction Expected"];
    const random = Math.floor(Math.random() * outcomes.length);
    setResult({
      prediction: outcomes[random],
      confidence: (Math.random() * 20 + 80).toFixed(2) + "%",
      id: Math.random().toString(36).substr(2, 9).toUpperCase()
    });
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Predictor Logic Test</h2>
        <p className="text-slate-500 mb-8">Execute the pipeline to verify AI inference simulation.</p>
        
        <button 
          onClick={runPrediction}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-200"
        >
          Run Pipeline Logic
        </button>

        {result && (
          <div className="mt-8 p-6 bg-slate-50 rounded-xl border-l-8 border-blue-600 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400">UUID: {result.id}</span>
              <span className="text-xs font-bold text-green-600">CONFIDENCE: {result.confidence}</span>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{result.prediction}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const About = () => (
  <div className="max-w-2xl mx-auto py-20 px-8 bg-white shadow-sm rounded-2xl mt-10 border border-slate-100">
    <h2 className="text-3xl font-bold text-slate-900 mb-4">Pipeline Architecture</h2>
    <p className="text-slate-600 leading-relaxed mb-4">
      This static application is built using <strong>React 18</strong> and <strong>Tailwind CSS v4</strong>. 
      It is designed to be served by any high-performance static web server (Nginx, Azure Static Web Apps, etc.).
    </p>
    <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm font-medium">
      Tested Environment: Ubuntu 22.04 LTS | Node v18+
    </div>
  </div>
);

// --- Main Shell ---
export default function App() {
  const [page, setPage] = useState('Home');

  return (
    <div className="min-h-screen">
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