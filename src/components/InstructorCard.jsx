import React from "react";

const InstructorCard = ({
  image,
  name,
  description,
  badgeColor,
  role,
  borderColor,
  textColor,
}) => {
  const isImageUrl = typeof image === "string";

  return (
    <div
      className={`relative bg-gradient-to-br from-[#1a1c2b] to-[#202231] border-l-4 ${borderColor} rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-transform duration-300 group overflow-hidden`}
    >
      {/* Glowing background blob */}
      <div
        className={`absolute -top-8 -left-8 w-36 h-36 ${badgeColor} opacity-20 blur-3xl rounded-full z-0`}
      />

      {/* Badge */}
      <span
        className={`absolute top-4 right-4 ${badgeColor} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10`}
      >
        {role}
      </span>

      {/* Avatar or Icon */}
      <div className="relative w-24 h-24 mx-auto mb-4 z-10 flex items-center justify-center rounded-full bg-gray-800 border-4 border-gray-700 shadow-xl overflow-hidden group-hover:rotate-1 group-hover:scale-105 transition-all duration-300">
        {isImageUrl ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-white text-4xl">{image}</div>
        )}
      </div>

      {/* Info */}
      <h3 className={`text-xl font-bold ${textColor} text-center mb-1 z-10`}>{name}</h3>
      <p className="text-sm text-gray-400 text-center mb-2 z-10">
        Bachelor of Computer Applications
      </p>
      <p className="text-base text-gray-300 text-center leading-relaxed font-normal max-w-md mx-auto z-10">
        {description}
      </p>
    </div>
  );
};

export default InstructorCard;
