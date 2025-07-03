const BlogCard = ({ title, progress = 0 }) => {
  const isDone = progress === 100;

  return (
    <div className="h-full flex flex-col justify-between bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl p-6 transition-all duration-200 hover:border-orange-600 group">
      {/* Title & Status */}
      <div>
        <h4 className="text-lg font-semibold mb-4 line-clamp-2 min-h-[3rem]">{title}</h4>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Status</span>
          <span className={isDone ? "text-green-500" : "text-yellow-500"}>
            {isDone ? "Done" : "Pending"}
          </span>
        </div>
      </div>

      {/* Start Learning Button at Bottom */}
      <button className="mt-6 w-full text-white-500 font-medium text-sm py-2 px-4 rounded-md bg-[#2C2C2C]  group-hover:text-orange-500 transition duration-300 ease-in-out">
        Start Learning →
      </button>
    </div>
  );
};

export default BlogCard;
