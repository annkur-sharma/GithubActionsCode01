import React, { useState, useEffect } from 'react';

const Navbar = ({ setPage, currentPage }) => (
  <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/50 border-b border-white/10 p-4 flex justify-center space-x-2">
    {['Home', 'Date & Time', 'AI Predictor', 'About'].map((item) => (
      <button 
        key={item} 
        onClick={() => setPage(item)} 
        className={`px-6 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-300
          ${currentPage === item 
            ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
      >
        {item}
      </button>
    ))}
  </nav>
);

const Home = () => (
  <div className="text-center py-32 px-4">
    <div className="animate-bounce inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-black mb-6 shadow-lg">
      SYSTEM ONLINE v1.0.2
    </div>
    <h1 className="text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
      NEURAL <span className="text-blue-500">PIPELINE</span>
    </h1>
    <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
      A high-performance sandbox for <span className="text-white italic">CI/CD automation</span> and 
      real-time predictive analytics.
    </p>
    <div className="mt-10 flex justify-center gap-4">
        <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
        <div className="h-1 w-4 bg-slate-700 rounded-full"></div>
        <div className="h-1 w-4 bg-slate-700 rounded-full"></div>
    </div>
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
      <div className="glass-card p-16 rounded-[40px] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs mb-8">System Chronometer</h2>
        <div className="text-8xl font-mono font-black tabular-nums tracking-tighter text-white mb-4">
          {time.toLocaleTimeString([], { hour12: false })}
        </div>
        <div className="text-slate-500 font-medium tracking-widest uppercase text-sm">
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
    setTimeout(() => {
      const outcomes = ["OPTIMAL GROWTH", "MARKET VOLATILITY", "STABLE RECOVERY", "BULLISH TREND"];
      const random = Math.floor(Math.random() * outcomes.length);
      setResult({
        prediction: outcomes[random],
        confidence: (Math.random() * 15 + 84).toFixed(2) + "%",
        id: "NODE-" + Math.random().toString(36).substr(2, 4).toUpperCase()
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <div className="glass-card rounded-3xl p-1 shadow-2xl">
        <div className="bg-slate-900/40 rounded-[22px] p-10">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Inference Engine</h2>
                <div className="flex space-x-1">
                    {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-700"></div>)}
                </div>
            </div>
            
            <button 
                onClick={runPrediction}
                disabled={loading}
                className={`w-full font-black py-6 rounded-xl transition-all relative group overflow-hidden
                    ${loading ? 'bg-slate-800 cursor-not-allowed' : 'bg-white text-black hover:scale-[1.02]'}`}
            >
                <span className="relative z-10">{loading ? 'ANALYZING...' : 'EXECUTE PREDICTION'}</span>
                {!loading && <div className="absolute inset-0 bg-blue-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20"></div>}
            </button>

            {result && !loading && (
            <div className="mt-8 space-y-4 animate-float">
                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>ID: {result.id}</span>
                    <span className="text-blue-400">Confidence: {result.confidence}</span>
                </div>
                <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-2xl text-center">
                    <h3 className="text-3xl font-black text-blue-400 tracking-tighter">{result.prediction}</h3>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

const About = () => (
  <div className="max-w-2xl mx-auto py-20 px-4">
    <div className="glass-card p-10 rounded-3xl">
      <h2 className="text-2xl font-black text-white mb-8">Architecture Stack</h2>
      <div className="grid grid-cols-1 gap-4">
        {[
            { label: 'Frontend', val: 'React 18 + Tailwind v4', color: 'bg-blue-500' },
            { label: 'Deployment', val: 'GitHub Actions CI/CD', color: 'bg-purple-500' },
            { label: 'Environment', val: 'Node.js Production', color: 'bg-emerald-500' }
        ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <span className="text-slate-400 text-sm font-bold">{item.label}</span>
                <span className={`text-xs font-black px-3 py-1 rounded ${item.color} text-white`}>{item.val}</span>
            </div>
        ))}
      </div>
    </div>
  </div>
);

export default function App() {
  const [page, setPage] = useState('Home');

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500 selection:text-white">
      <div className="bg-glow"></div>
      <Navbar setPage={setPage} currentPage={page} />
      <main className="container mx-auto px-6">
        {page === 'Home' && <Home />}
        {page === 'Date & Time' && <DateTimePage />}
        {page === 'AI Predictor' && <AIPage />}
        {page === 'About' && <About />}
      </main>
      <footer className="fixed bottom-0 w-full text-center py-6 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
        Build Log: 2026.04.04 // STABLE_REL_01
      </footer>
    </div>
  );
}






















