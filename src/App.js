import React, { useState, useEffect } from 'react';

// --- Shared Components ---
const Navbar = ({ setPage, currentPage }) => (
  <nav className="bg-slate-900 text-white p-4 flex justify-center space-x-4 shadow-2xl border-b-4 border-blue-500">
    {['Home', 'Date & Time', 'AI Predictor', 'About'].map((item) => (
      <button 
        key={item} 
        onClick={() => setPage(item)} 
        className={`px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-widest transition-all 
          ${currentPage === item 
            ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
            : 'hover:bg-slate-700 text-slate-300'}`}
      >
        {item}
      </button>
    ))}
  </nav>
);

const Home = () => (
  <div className="text-center py-24 animate-fade-in px-4">
    <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold mb-4 border border-blue-200">
      v1.0.2 Stable
    </div>
    <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tighter">
      AI Predictor <span className="text-blue-600 underline decoration-4 underline-offset-8">Pipeline</span>
    </h1>
    <p className="text-xl text-slate-600 max-w-lg mx-auto bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm">
      This is a sandbox environment for testing <strong>CI/CD build logic</strong> and <strong>React-based AI simulations</strong>.
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
      <div className="bg-slate-800 p-12 rounded-3xl shadow-2xl border-4 border-slate-700 text-center text-white">
        <h2 className="text-blue-400 font-black uppercase tracking-[0.2em] text-sm mb-6">Live Pipeline Clock</h2>
        <div className="text-7xl font-mono font-black tabular-nums border-y-2 border-slate-700 py-4 mb-4">
          {time.toLocaleTimeString()}
        </div>
        <div className="text-slate-400 font-bold bg-slate-900/50 py-2 rounded-lg italic">
          {time.toLocaleDateString(undefined, { dateStyle: 'full' })}
        </div>
      </div>
    </div>
  );
};

const AIPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const runPrediction = () => {
    setLoading(true);
    // Simulate a brief delay for the "inference"
    setTimeout(() => {
      const outcomes = ["High Growth", "Market Volatility", "Steady State", "Correction Expected"];
      const random = Math.floor(Math.random() * outcomes.length);
      setResult({
        prediction: outcomes[random],
        confidence: (Math.random() * 20 + 80).toFixed(2) + "%",
        id: "TRX-" + Math.random().toString(36).substr(2, 6).toUpperCase()
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-slate-300">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
          <h2 className="text-2xl font-black text-slate-800">Predictor Logic Engine</h2>
        </div>
        
        <button 
          onClick={runPrediction}
          disabled={loading}
          className={`w-full font-black py-5 rounded-2xl transition-all shadow-lg text-lg uppercase tracking-wider
            ${loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-blue-200 hover:shadow-blue-300 border-b-4 border-blue-800'}`}
        >
          {loading ? 'Processing...' : 'Run Pipeline Logic'}
        </button>

        {result && !loading && (
          <div className="mt-10 p-8 bg-slate-900 rounded-2xl border-t-8 border-blue-500 animate-fade-in shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
              <span className="px-3 py-1 bg-slate-800 text-blue-400 rounded-md text-xs font-mono font-bold">{result.id}</span>
              <span className="text-xs font-black text-green-400 bg-green-400/10 px-2 py-1 rounded">MATCH: {result.confidence}</span>
            </div>
            <h3 className="text-4xl font-black text-white text-center tracking-tight">{result.prediction}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const About = () => (
  <div className="max-w-2xl mx-auto py-16 px-8 mt-10 animate-fade-in">
    <div className="bg-white p-10 rounded-2xl border-2 border-slate-200 shadow-md">
      <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center">
        <span className="mr-2">🛠️</span> Pipeline Architecture
      </h2>
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 border-l-4 border-slate-800 rounded-r-lg">
          <p className="text-slate-700 font-medium"><strong>Frontend:</strong> React 18 with Tailwind CSS v4</p>
        </div>
        <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg text-blue-900">
          <p><strong>Deployment Path:</strong> GitHub Actions → Static Build → Web Host</p>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [page, setPage] = useState('Home');

  return (
    <div className="min-h-screen">
      <Navbar setPage={setPage} currentPage={page} />
      <main className="container mx-auto">
        {page === 'Home' && <Home />}
        {page === 'Date & Time' && <DateTimePage />}
        {page === 'AI Predictor' && <AIPage />}
        {page === 'About' && <About />}
      </main>
      <footer className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
        Pipeline Build Ver: 2026.03.30-STABLE-v01
      </footer>
    </div>
  );
}