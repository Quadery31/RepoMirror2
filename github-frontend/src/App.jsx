import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Github, CheckCircle2, AlertTriangle, BookOpen, Activity, ArrowRight, GitBranch, Moon, Sun, Terminal } from 'lucide-react';

const AnimatedScoreRing = ({ score, styles }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full rotate-[-90deg]">
        <circle
          cx="80"
          cy="80"
          r={radius}
          strokeWidth="10"
          className="fill-none stroke-gray-200 dark:stroke-green-900"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`fill-none transition-all duration-1000 ease-out ${styles.text}`}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-black ${styles.text}`}>
          {score}
        </span>
      </div>
    </div>
  );
};

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(darkMode));
    fetchHistory();
  }, [darkMode, result]);

  const fetchHistory = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.get(`${apiUrl}/api/history`);
      setHistory(data);
    } catch (err) {
      console.error("Could not fetch history");
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    if (!url.includes('github.com')) {
      setError("Please enter a valid GitHub URL");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.post(`${apiUrl}/api/analyze`, { url });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // --- 1. RESET FUNCTION (Home Button Logic) ---
  const handleReset = () => {
    setResult(null);
    setUrl('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- 2. History Click Logic ---
  const handleHistoryClick = (historyItem) => {
    setUrl(historyItem.repoUrl);
    setResult(historyItem);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScoreStyles = (score) => {
    if (score >= 80) return {
        text: "text-green-600 dark:text-green-400",
        border: "border-green-500",
        bg: "bg-green-50 dark:bg-green-900/20",
        label: "Gold Standard"
    };
    if (score >= 50) return {
        text: "text-yellow-600 dark:text-yellow-400",
        border: "border-yellow-500",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        label: "Silver Standard"
    };
    return {
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500",
        bg: "bg-red-50 dark:bg-red-900/20",
        label: "Needs Improvement"
    };
  };

  const scoreStyles = result ? getScoreStyles(result.score) : null;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen transition-colors duration-500 
      bg-gradient-to-br from-mintBg via-green-100 to-emerald-100
      dark:from-forest dark:via-[#0f2d21] dark:to-black
      text-gray-900 dark:text-gray-100 font-sans p-6 md:p-12">

        <div className="max-w-6xl mx-auto">

          {/* Header - NOW CLICKABLE FOR RESET */}
          <header className="flex flex-col md:flex-row justify-between items-center mb-14 gap-6">
            
            <div 
              onClick={handleReset} 
              className="flex items-center gap-4 cursor-pointer group select-none"
              title="Go to Home / Reset"
            >
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/10 backdrop-blur group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
                <Github className="w-8 h-8 transition-transform group-hover:scale-110" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">RepoMirror</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Deep GitHub Code Intelligence
                </p>
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur border border-gray-200 dark:border-gray-700 hover:scale-105 transition-all"
            >
              {darkMode ? <Sun /> : <Moon />}
            </button>
          </header>

          {/* Input Card */}
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg mb-12">
            <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://github.com/username/repo"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-github-green outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-github-green to-emerald-500 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
              >
                {loading ? <Activity className="animate-spin" /> : <>Analyze <ArrowRight /></>}
              </button>
            </form>

            {error && (
              <div className="mt-5 flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                <AlertTriangle /> {error}
              </div>
            )}
          </div>

          {/* Results */}
          {result && scoreStyles && (
            <div className="grid md:grid-cols-3 gap-8 mb-16 animate-fade-in-up">

              {/* Score - Custom Component */}
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center shadow-lg">
                <p className="uppercase text-xs tracking-widest text-gray-500 mb-4">Quality Score</p>
                <AnimatedScoreRing score={result.score} styles={scoreStyles} />
                <span className={`mt-6 px-5 py-2 rounded-full text-xs font-bold border ${scoreStyles.border} ${scoreStyles.text}`}>
                  {scoreStyles.label}
                </span>
              </div>

              {/* Summary + Roadmap */}
              <div className="md:col-span-2 flex flex-col gap-6">

                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
                  <h3 className="flex items-center gap-2 font-bold mb-3">
                    <BookOpen className="text-blue-500" /> Review Summary
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-lg">
                  <h3 className="flex items-center gap-2 font-bold mb-4">
                    <GitBranch className="text-purple-500" /> Improvement Roadmap
                  </h3>
                  <ul className="space-y-3">
                    {result.roadmap.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700"
                      >
                        <CheckCircle2 className="text-github-green" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* History Section - Clickable */}
          <div>
            <h3 className="text-xl font-bold mb-5">Recent Scans</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {history.length === 0 && <p className="text-gray-500 col-span-2">No history yet.</p>}
              {history.map(h => (
                <div
                  key={h._id}
                  onClick={() => handleHistoryClick(h)}
                  className="cursor-pointer bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-between items-center hover:scale-[1.02] hover:border-green-500 transition-all shadow-md group"
                >
                  <div className="overflow-hidden">
                    <p className="font-semibold truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {h.repoName || h.repoUrl.replace('https://github.com/', '')}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(h.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-mono font-bold ${h.score >= 80 ? 'text-green-600' : h.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {h.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;