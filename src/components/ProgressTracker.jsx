// ProgressTracker.jsx
const ProgressTracker = ({ value, barColor = "bg-green-500", showLabel = false }) => (
  <div className="w-full space-y-1">
    {showLabel && (
      <div className="text-xs text-gray-300 text-right font-mono pr-1">
        {Math.round(value)}%
      </div>
    )}
    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-500 ${barColor}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default ProgressTracker;
