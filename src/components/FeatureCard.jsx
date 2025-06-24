const FeatureCard = ({ icon, title, text }) => {
  return (
    <div
      className="relative bg-zinc-800 p-6 rounded-xl text-center shadow-md border border-zinc-700 overflow-hidden cursor-pointer
    group
    hover:shadow-orange-500/50
    hover:border-orange-500
    transition-all duration-500
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-orange-500 before:via-pink-500 before:to-purple-600
    before:opacity-0 before:scale-110
    group-hover:before:opacity-20 group-hover:before:scale-100
    "
    >
      <div className="relative z-10 text-orange-500 mb-4">{icon}</div>
      <h3 className="relative z-10 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-400 relative z-10">{text}</p>
    </div>
  );
};

export default FeatureCard;
