import { useState, useEffect } from 'react';

export default function App() {
  // --- Persistent Workout History State ---
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('fitness_tracker_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  // --- BMR Calculator Isolated State ---
  const [bmrWeight, setBmrWeight] = useState('');
  const [bmrHeight, setBmrHeight] = useState('');
  const [bmrAge, setBmrAge] = useState('');
  const [bmrGender, setBmrGender] = useState('male');
  const [calculatedBmr, setCalculatedBmr] = useState(null);

  // Sync workout activity to local browser storage automatically
  useEffect(() => {
    localStorage.setItem('fitness_tracker_logs', JSON.stringify(logs));
  }, [logs]);

  // Workout History Form Handler
  const handleSaveWorkout = (e) => {
    e.preventDefault();
    if (!exercise.trim() || !weight) return;

    const entry = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      exercise: exercise.trim(),
      weight: parseFloat(weight),
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0
    };

    setLogs([entry, ...logs]);
    setExercise('');
    setWeight('');
    setSets('');
    setReps('');
  };

  const deleteLog = (id) => {
    setLogs(logs.filter(item => item.id !== id));
  };

  // Accurate Mifflin-St Jeor BMR Math Processing Engine
  const calculateBmrValue = (e) => {
    e.preventDefault();
    const wLbs = parseFloat(bmrWeight);
    const hCm = parseFloat(bmrHeight);
    const ageYrs = parseInt(bmrAge);

    if (!wLbs || !hCm || !ageYrs) return;

    // Convert imperial weight (lbs) to metric kilograms cleanly
    const wKg = wLbs * 0.45359237; 

    let bmrResult = (10 * wKg) + (6.25 * hCm) - (5 * ageYrs);
    
    if (bmrGender === 'male') {
      bmrResult += 5;
    } else {
      bmrResult -= 161;
    }

    setCalculatedBmr(Math.round(bmrResult));
  };
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 sm:p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        
        {/* Main Application Header Dashboard Banner */}
        <header className="border-b border-[#21262d] pb-4 mb-8">
          <h1 className="text-xl font-bold text-[#f0f6fc]">Fitness Tracker</h1>
          <p className="text-xs text-[#8b949e] mt-0.5">Local browser storage instance with biometric utilities</p>
        </header>

        {/* Master Screen Workspace Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT SIDE COLUMN: Dynamic Utility Input Control Panels */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Component Panel 1: Workout Logging Interface Form */}
            <form onSubmit={handleSaveWorkout} className="bg-[#161b22] border border-[#30363d] p-4 rounded-md space-y-4">
              <h2 className="text-xs font-semibold text-[#f0f6fc] uppercase tracking-wider border-b border-[#21262d] pb-2">Log Workout Set</h2>
              
              <div>
                <label className="block text-xs text-[#8b949e] font-medium mb-1">Exercise Name</label>
                <input type="text" placeholder="e.g. Bench Press" value={exercise} onChange={e => setExercise(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-[#8b949e] font-medium mb-1">Weight (lbs)</label>
                  <input type="number" placeholder="135" value={weight} onChange={e => setWeight(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]" />
                </div>
                <div>
                  <label className="block text-xs text-[#8b949e] font-medium mb-1">Sets</label>
                  <input type="number" placeholder="4" value={sets} onChange={e => setSets(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]" />
                </div>
                <div>
                  <label className="block text-xs text-[#8b949e] font-medium mb-1">Reps</label>
                  <input type="number" placeholder="10" value={reps} onChange={e => setReps(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]" />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium p-2 rounded transition duration-150">
                Commit Log Entry
              </button>
            </form>

            {/* Component Panel 2: Accurate Mifflin-St Jeor BMR Calculator */}
            <form onSubmit={calculateBmrValue} className="bg-[#161b22] border border-[#30363d] p-4 rounded-md space-y-4">
              <h2 className="text-xs font-semibold text-[#f0f6fc] uppercase tracking-wider border-b border-[#21262d] pb-2">BMR Metabolism Engine</h2>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-[#8b949e] font-medium mb-1">Weight (lbs)</label>
                  <input type="number" step="any" placeholder="e.g. 165" value={bmrWeight} onChange={e => setBmrWeight(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]" />
                </div>
                <div>
                  <label className="block text-xs text-[#8b949e] font-medium mb-1">Height (cm)</label>
                  <input type="number" step="any" placeholder="e.g. 178" value={bmrHeight} onChange={e => setBmrHeight(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-[#8b949e] font-medium mb-1">Age (years)</label>
                  <input type="number" placeholder="e.g. 24" value={bmrAge} onChange={e => setBmrAge(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]" />
                </div>
                <div>
                  <label className="block text-xs text-[#8b949e] font-medium mb-1">Biological Sex</label>
                  <select value={bmrGender} onChange={e => setBmrGender(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2 text-xs text-[#f0f6fc] focus:outline-none focus:border-[#58a6ff]">
                    <option value="male">Male (+5)</option>
                    <option value="female">Female (-161)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#388bfd] hover:bg-[#58a6ff] text-[#ffffff] text-xs font-medium p-2 rounded transition duration-150">
                Compute Basal Caloric Rate
              </button>

              {calculatedBmr !== null && (
                <div className="mt-2 p-3 bg-[#1f242c] border border-[#30363d] rounded text-center">
                  <p className="text-[11px] text-[#8b949e] uppercase tracking-wide font-medium">Estimated Resting BMR</p>
                  <p className="text-xl font-bold text-[#58a6ff] mt-0.5">{calculatedBmr} <span className="text-xs text-[#8b949e] font-normal">kcal/day</span></p>
                  <p className="text-[10px] text-[#8b949e] mt-1.5 leading-relaxed">Energy required to maintain vital operations at complete rest.</p>
                </div>
              )}
            </form>

          </div>

          {/* RIGHT SIDE COLUMN: Persistent Workout Logs History Monitor */}
          <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-md overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#30363d] bg-[#1f242c]">
              <h2 className="text-xs font-semibold text-[#f0f6fc]">Training History Activity Feed</h2>
            </div>
            
            <div className="divide-y divide-[#30363d] max-h-[535px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#8b949e]">No sets logged yet. Complete the telemetry input form to log metrics.</div>
              ) : (
                logs.map(item => (
                  <div key={item.id} className="p-4 flex justify-between items-center hover:bg-[#1f242c] transition duration-75">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono bg-[#21262d] px-1.5 py-0.5 rounded text-[#8b949e]">{item.date}</span>
                        <h3 className="text-xs font-bold text-[#f0f6fc]">{item.exercise}</h3>
                      </div>
                      <p className="text-xs text-[#8b949e] mt-1">
                        {item.sets} sets × {item.reps} reps @ <span className="text-[#58a6ff] font-medium">{item.weight} lbs</span>
                      </p>
                    </div>
                    <button onClick={() => deleteLog(item.id)} className="text-xs text-[#f85149] hover:underline p-1">
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
