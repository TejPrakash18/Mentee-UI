// ../components/Stopwatch.jsx
import { useState, useEffect } from "react";
import { FiPlay, FiPause, FiRotateCcw, FiChevronLeft } from "react-icons/fi";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="flex items-center gap-2 bg-[#2d2d2d] px-3 py-1.5 rounded-md text-white text-sm">

      <button onClick={() => setRunning((r) => !r)}>
        {running ? (
          <FiPause size={16} className="text-gray-300" />
        ) : (
          <FiPlay size={16} className="text-gray-300" />
        )}
      </button>

      <span className="text-blue-400 font-mono">{formatTime(time)}</span>

      <button onClick={() => setTime(0)}>
        <FiRotateCcw size={16} className="text-gray-300 hover:text-white" />
      </button>
    </div>
  );
};

export default Stopwatch;
