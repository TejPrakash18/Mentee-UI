import React from "react";

const FAQ = ({ question, answer }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="bg-zinc-800 p-6 rounded-xl cursor-pointer shadow-md transition-all duration-300"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
    >
      <div className="flex justify-between items-center">
        <h4
          className={`text-base font-semibold transition-colors duration-300 ${
            open ? "text-orange-500 text-base" : "text-white"
          }`}
        >
          {question}
        </h4>
        <span
          className={`text-orange-500 text-2xl font-bold transition-transform duration-300 ${
            open ? "rotate-45 text-orange-500" : "text-white"
          }`}
        >
          +
        </span>
      </div>

      {/* Collapsible Answer */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          open ? "grid-rows-[1fr] mt-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className={`text-gray-400 text-sm transition-opacity duration-500 ${
              open ? "opacity-100" : "opacity-0"
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
