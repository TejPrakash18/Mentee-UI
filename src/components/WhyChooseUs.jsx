import React from "react";
import {
  FaUserGraduate,
  FaSitemap,
  FaRegLightbulb,
} from "react-icons/fa";

/* colour map for icons and badges only */
const colour = {
  indigo: {
    badge: "bg-indigo-500",
    icon: "text-indigo-400",
  },
  green: {
    badge: "bg-green-500",
    icon: "text-green-400",
  },
  red: {
    badge: "bg-red-500",
    icon: "text-red-400",
  },
};

const WhyChooseUs = () => {
  const features = [
    {
      title: "Expert‑Crafted Learning",
      color: "indigo",
      desc:
        "Our team of accomplished engineers from top tech companies (Google, Amazon, Meta, Microsoft) deliver expert‑level insights and guidance.",
      Icon: FaUserGraduate,
    },
    {
      title: "Structured Learning Path",
      color: "green",
      desc:
        "Master DSA, System Design, CS core subjects, and projects through curated blogs and video solutions.",
      Icon: FaSitemap,
    },
    {
      title: "Quality Content",
      color: "red",
      desc:
        "In‑depth explanations, solved problems, and intuitive video walkthroughs designed to build real problem‑solving skills.",
      Icon: FaRegLightbulb,
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-black via-gray-900 to-black text-white py-24 px-6 sm:px-10 lg:px-20">
      {/* Faint background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/10 via-indigo-600/5 to-black blur-3xl opacity-40 -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Why Choose Us?
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-300 font-medium max-w-2xl mx-auto">
            Unlock Your Potential with Our Comprehensive Learning Approach
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, desc, color, Icon }) => {
            const { badge, icon } = colour[color];
            return (
              <article
                key={title}
                className={`relative rounded-2xl p-6 bg-zinc-800 border border-gray-700 hover:border-orange-500`}
              >
                {/* Badge */}
                <span
                  className={`absolute top-0 right-0 ${badge} text-xs font-semibold px-2 py-1 rounded-tr-2xl rounded-bl-2xl`}
                >
                  Featured
                </span>

                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 mb-4">
                  <Icon size={22} className={icon} />
                </div>

                {/* Title & Description */}
                <h3 className={`text-xl font-bold ${icon} mb-2`}>{title}</h3>
                <p className="text-sm leading-relaxed text-gray-300">{desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
