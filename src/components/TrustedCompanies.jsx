import React from 'react';

const TrustedCompanies = () => {
  const companies = [
    { name: "Google", description: "Global leader in search and AI." },
    { name: "Microsoft", description: "Creators of Windows & Azure." },
    { name: "Amazon", description: "E-commerce and cloud computing giant." },
    { name: "Meta", description: "Parent company of Facebook and Instagram." },
    { name: "Netflix", description: "Streaming entertainment provider." },
    { name: "Adobe", description: "Design and creative software innovator." },
    { name: "Uber", description: "Ride-sharing and food delivery leader." },
    { name: "Airbnb", description: "Home rental and travel platform." },
    { name: "LinkedIn", description: "Professional networking platform." },
    { name: "PayPal", description: "Online payments and finance services." },
  ];

  return (
    <section className="bg-black py-16 px-6 sm:px-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-14 leading-tight">
        Trusted by 10+ leading <br />
        <span className="underline decoration-blue-500 decoration-4 underline-offset-4 text-yellow-400">
          tech companies
        </span>{" "}
        with <span className="text-blue-600 font-bold">mentee</span>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 place-items-center">
        {companies.map((company, index) => {
          const staggerClass =
            index % 5 === 1 || index % 5 === 3
              ? 'translate-y-4'
              : index % 5 === 2
              ? 'translate-y-6'
              : 'translate-y-0';

          const rotateHover =
            index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1';

          return (
            <div
              key={company.name}
              aria-label={`Company: ${company.name}`}
              className={`group relative bg-gradient-to-tr from-[#1c1c1e] to-[#1f1f22] rounded-2xl border border-[#2a2a2e] 
                shadow-md hover:shadow-blue-500/30 hover:scale-[1.05] ${rotateHover}
                transition-all duration-300 p-6 flex items-center justify-center w-40 h-24 
                ${staggerClass}`}
            >
              <p className="font-semibold text-white text-lg tracking-wide text-center group-hover:text-yellow-400 transition-colors duration-200">
                {company.name}
              </p>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 hidden group-hover:block w-52 p-2 rounded-md bg-white text-black text-sm text-center shadow-lg">
                {company.description}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustedCompanies;
