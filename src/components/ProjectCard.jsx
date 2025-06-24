const ProjectCard = ({ title, icon: Icon, iconBg = "bg-gray-800", progress = 0 }) => {
  return (
    <div
      className="bg-[#1c1c1e] rounded-2xl shadow-xl p-6 text-white transition-transform duration-300 
                 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500"
      tabIndex={0} // Make card focusable for accessibility
    >
      <div className={`w-full h-36 flex items-center justify-center rounded-xl mb-4 ${iconBg}`}>
        {Icon && <Icon className="text-white text-6xl" aria-hidden="true" />}
      </div>

      <h4 className="text-lg sm:text-base font-bold mb-2 line-clamp-2">{title}</h4>

      {/* Optional Progress Bar */}
      {progress !== null && typeof progress === 'number' && (
        <div className="w-full h-2 rounded-full bg-gray-700 mb-2 overflow-hidden">
          <div
            className={`h-2 transition-all duration-300 ${
              progress === 100 ? 'bg-green-500' : 'bg-indigo-400'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}

      <div className="flex justify-end">
        <p
          className={`text-xs sm:text-sm font-medium ${
            progress === 100 ? 'text-green-400' : 'text-gray-400'
          }`}
        >
          {progress === 100
            ? 'Done'
            : progress === null
            ? 'Login to track'
            : 'Pending'}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
