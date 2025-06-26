const BlogCard = ({ title, progress = 0 }) => {
  return (
    <div
      className="bg-[#1c1c1e] rounded-2xl shadow-xl flex flex-col justify-between h-full p-6 text-white transition-transform duration-300 
                 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500"
      tabIndex={0}
    >
      {/* Title */}
      <h4 className="text-xl font-semibold mb-6 line-clamp-2">{title}</h4>

      {/* Progress + Info */}
      {progress !== null && typeof progress === 'number' && (
        <>
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Completion:</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-6">
            <div
              className={`h-full transition-all duration-300 ${
                progress === 100 ? "bg-green-500" : "bg-indigo-400"
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </>
      )}

      {/* CTA Button */}
      <button
        className="w-full bg-[#2a2a2c] hover:bg-[#333336] text-white font-medium py-2 rounded-md text-sm"
        aria-label={`Start learning ${title}`}
      >
        Start Learning →
      </button>
    </div>
  );
};

export default BlogCard;
