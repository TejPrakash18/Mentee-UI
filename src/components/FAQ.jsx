import React from "react";

const FAQ = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      className="bg-zinc-800 p-6 rounded-xl cursor-pointer shadow-md transition-all duration-300"
      onClick={onClick}
      aria-expanded={isOpen}
    >
      <div className="flex justify-between items-center">
        <h4
          className={`text-base font-semibold transition-colors duration-300 ${
            isOpen ? "text-orange-500" : "text-white"
          }`}
        >
          {question}
        </h4>
        <span
          className={`text-2xl font-bold transition-transform duration-300 ${
            isOpen ? "rotate-45 text-orange-500" : "text-white"
          }`}
        >
          +
        </span>
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className={`text-gray-400 text-sm transition-opacity duration-500 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
