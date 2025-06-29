const BlogCard = ({ title, progress = 0 }) => {
  return (
    <div
      className="bg-[#1c1c1e] rounded-2xl shadow-xl flex flex-col justify-between h-full p-6 text-white transition-transform duration-300 
                 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500"
      tabIndex={0}
    >
      {/* Title */}
      <h4 className="text-xl font-semibold mb-6 line-clamp-2">{title}</h4>

      {/* Progress Status */}

      {progress !== null && typeof progress === "number" && (
        <div className="text-sm text-gray-300 mb-4 flex justify-between items-center">
          <span className="text-gray-500">Status</span>
          <span
            className={`px-2 py-1 rounded-md text-xs font-semibold ${
              progress === 100
                ? "bg-green-600 text-white"
                : "bg-yellow-600 text-white"
            }`}
          >
            {progress === 100 ? "Done" : "Pending"}
          </span>
        </div>
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
