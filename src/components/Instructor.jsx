// InstructorSection.jsx
import InstructorCard from "./InstructorCard";
import neha from "../assets/neha.jpg";
import tej from "../assets/tej1.webp";
import vaishali from "/avatar6.png";
  import {FaUser } from "react-icons/fa"

const InstructorSection = () => (
  <section className="relative bg-[#0d0d0d] text-white py-24 px-4 sm:px-6 lg:px-24">
    {/* Decorative Gradient Overlay */}
    <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-yellow-500/10 blur-3xl opacity-40" />

    <div className="max-w-7xl mx-auto text-center">
      <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-orange-400 to-yellow-300 text-transparent bg-clip-text mb-4">
        Instructor
      </h2>
      <p className="text-lg sm:text-xl text-gray-300 font-medium mb-14 max-w-2xl mx-auto">
        Meet the mentors who drive excellence, with passion and expertise.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        <InstructorCard
          image={tej}
          name="Tej Upadhyay"
          description="Software Engineer specializing in Java and Spring Boot. Expert in designing scalable systems, APIs, and engineering clean, maintainable backend architectures."
          badgeColor="bg-sky-500"
          role="Software Engineer"
          borderColor="border-sky-500"
          textColor="text-sky-400"
        />

        <InstructorCard
          image={neha}
          name="Neha Varshney"
          description="Frontend Developer with a sharp eye for detail and UX. Skilled in crafting intuitive interfaces using modern technologies like React, Tailwind, and beyond."
          badgeColor="bg-pink-500"
          role="Frontend Developer"
          borderColor="border-pink-500"
          textColor="text-pink-400"
        />

        <InstructorCard
          image={<FaUser/>}
          name="Vaishali Tomar"
          description="A passionate mentor with a solid CS background, focused on helping learners build strong problem-solving skills and deep technical understanding."
          badgeColor="bg-purple-500"
          role="Mentor"
          borderColor="border-purple-500"
          textColor="text-purple-400"
        />

        <InstructorCard
          image={<FaUser/>}
          name="Laxman Singh"
          description="Committed mentor dedicated to fostering growth and confidence in students, both technically and personally, through personalized guidance and support."
          badgeColor="bg-orange-500"
          role="Mentor"
          borderColor="border-orange-500"
          textColor="text-orange-400"
        />
      </div>
    </div>
  </section>
);

export default InstructorSection;
