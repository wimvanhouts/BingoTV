import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Monitor, Maximize2, Minimize2, Hash, Trash2, ArrowLeft, Settings, X } from 'lucide-react';

// B-I-N-G-O logic ranges
const BINGO_RANGES = [
  { letter: 'B', min: 1, max: 15, color: 'text-red-400', bg: 'bg-red-900/30', border: 'border-red-500/50' },
  { letter: 'I', min: 16, max: 30, color: 'text-yellow-400', bg: 'bg-yellow-900/30', border: 'border-yellow-500/50' },
  { letter: 'N', min: 31, max: 45, color: 'text-green-400', bg: 'bg-green-900/30', border: 'border-green-500/50' },
  { letter: 'G', min: 46, max: 60, color: 'text-blue-400', bg: 'bg-blue-900/30', border: 'border-blue-500/50' },
  { letter: 'O', min: 61, max: 75, color: 'text-purple-400', bg: 'bg-purple-900/30', border: 'border-purple-500/50' },
];

export default function BingoDashboard() {
  // Game State
  const [history, setHistory] = useState([]); 
  const [inputValue, setInputValue] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Appearance State
  const [bigNumberSize, setBigNumberSize] = useState(150); // px
  const [gridScale, setGridScale] = useState(100); // percentage

  const inputRef = useRef(null);

  // Derived state
  const calledSet = new Set(history);
  const lastCalledNumber = history.length > 0 ? history[history.length - 1] : null;

  // Handlers
  const handleNumberToggle = (num) => {
    if (calledSet.has(num)) {
      const newHistory = history.filter(n => n !== num);
      setHistory(newHistory);
    } else {
      setHistory([...history, num]);
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(inputValue, 10);
    
    if (!isNaN(num) && num >= 1 && num <= 75) {
      if (!calledSet.has(num)) {
        handleNumberToggle(num);
      }
      setInputValue('');
    } else {
      setInputValue('');
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the entire game?")) {
      setHistory([]);
      setInputValue('');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false));
      }
    }
  };

  // Keyboard shortcut for focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement !== inputRef.current && /^[0-9]$/.test(e.key)) {
        inputRef.current.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col overflow-hidden relative">
      
      {/* Settings Modal Overlay */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400" />
                Display Settings
              </h3>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex justify-between text-sm font-medium text-slate-300">
                  <span>Current Number Size</span>
                  <span className="text-indigo-400">{bigNumberSize}px</span>
                </label>
                <input 
                  type="range" 
                  min="60" 
                  max="400" 
                  value={bigNumberSize} 
                  onChange={(e) => setBigNumberSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex justify-between text-sm font-medium text-slate-300">
                  <span>Grid Zoom</span>
                  <span className="text-indigo-400">{gridScale}%</span>
                </label>
                <input 
                  type="range" 
                  min="50" 
                  max="150" 
                  value={gridScale} 
                  onChange={(e) => setGridScale(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between shadow-lg z-20">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-slate-100 hidden sm:block">BINGO<span className="text-indigo-400">MASTER</span></h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            <span>Called:</span>
            <strong className="text-white">{history.length} / 75</strong>
          </div>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}
            title="Settings"
          >
            <Settings size={20} />
          </button>

          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative z-10">
        
        {/* Left Control Panel */}
        <aside className="lg:w-80 bg-slate-900 border-r border-slate-800 flex flex-col z-10 shadow-xl shrink-0">
          
          {/* Last Number Display - Dynamic Size */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 border-b border-slate-800 min-h-[240px] relative overflow-hidden">
            <div className="absolute inset-0 bg-indigo-900/10 radial-gradient-center opacity-50" />
            <h2 className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-2 z-10">Current Number</h2>
            
            {lastCalledNumber ? (
              <div className="relative z-10 flex items-center justify-center">
                <div 
                  className="font-black text-white tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-in zoom-in duration-300 leading-none"
                  style={{ fontSize: `${bigNumberSize}px` }}
                >
                  {lastCalledNumber}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500 rounded-full blur-3xl opacity-20 -z-10 animate-pulse" />
              </div>
            ) : (
              <div className="font-bold text-slate-700 z-10" style={{ fontSize: `${bigNumberSize * 0.6}px` }}>--</div>
            )}
          </div>

          {/* Controls Area */}
          <div className="p-6 space-y-6 bg-slate-900">
            {/* Input Form */}
            <form onSubmit={handleInputSubmit} className="relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Quick Add
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  max="75"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type..."
                  className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 font-mono text-lg"
                />
                <button 
                  type="submit"
                  disabled={!inputValue}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
                >
                  Call
                </button>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleUndo}
                disabled={history.length === 0}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-xl border border-slate-700 transition-colors"
              >
                <ArrowLeft size={18} />
                <span>Undo</span>
              </button>
              
              <button 
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-xl border border-red-900/30 transition-colors"
              >
                <Trash2 size={18} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Board Area */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-slate-950 flex items-center justify-center">
          <div className="w-full max-w-7xl space-y-4">
            
            {BINGO_RANGES.map((range) => {
              const numbers = Array.from({ length: range.max - range.min + 1 }, (_, i) => range.min + i);
              
              // Dynamic dimensions based on gridScale
              const rowHeight = `${5 * (gridScale / 100)}rem`; // Base 5rem
              const letterSize = `${3 * (gridScale / 100)}rem`; // Base 3rem
              const numberSize = `${1.5 * (gridScale / 100)}rem`; // Base 1.5rem
              
              return (
                <div key={range.letter} className="flex gap-4 items-stretch" style={{ height: rowHeight }}>
                  {/* Row Letter Header */}
                  <div className={`w-14 lg:w-24 shrink-0 flex items-center justify-center rounded-xl border-2 ${range.border} ${range.bg} shadow-lg`}>
                    <span 
                      className={`font-black ${range.color} drop-shadow-md`}
                      style={{ fontSize: letterSize }}
                    >
                      {range.letter}
                    </span>
                  </div>

                  {/* Numbers Grid */}
                  <div className="flex-1 grid grid-cols-15 gap-1.5 lg:gap-3 h-full">
                    {numbers.map((num) => {
                      const isCalled = calledSet.has(num);
                      const isLast = num === lastCalledNumber;
                      
                      return (
                        <button
                          key={num}
                          onClick={() => handleNumberToggle(num)}
                          className={`
                            relative flex items-center justify-center rounded-lg lg:rounded-xl font-bold transition-all duration-200 leading-none
                            ${isLast 
                              ? 'bg-indigo-500 text-white scale-110 z-10 shadow-[0_0_20px_rgba(99,102,241,0.6)] ring-2 ring-white' 
                              : isCalled 
                                ? 'bg-slate-200 text-slate-900 scale-100 shadow-md opacity-90' 
                                : 'bg-slate-900/50 text-slate-600 hover:bg-slate-800 hover:text-slate-500 border border-slate-800/50'
                            }
                          `}
                          style={{
                            gridColumn: 'span 1',
                            fontSize: numberSize
                          }}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      </main>

      <style>{`
        .grid-cols-15 {
          display: grid;
          grid-template-columns: repeat(15, minmax(0, 1fr));
        }
        .radial-gradient-center {
          background: radial-gradient(circle at center, var(--tw-gradient-from) 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
}