import ChatAssistant from "./ChatAssistant";
import FeatureCard from "./FeatureCard";
import TypingEffect from "./Typed";
import {

  FaCode,
 
  FaChrome,
  FaDesktop,
  
} from "react-icons/fa";

const HeroSection = () => {
  return (
    <div className="text-white bg-black font-sans pt-20">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl sm:text-3xl md:text-4xl font-extrabold text-center leading-tight">
          Gear Up for Success: Your Ultimate Preparation Hub!
        </h1>

        {/* Subheading with Typing Effect */}
        <p className="mt-4 text-4xl sm:text-2xl md:text-3xl font-bold text-center">
          Advance Your Career with <TypingEffect />
        </p>

        {/* What We Offer Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto p-10">
          <FeatureCard
            title="DSA Sheet"
            icon={<FaCode size={28} />}
            text="Follow our comprehensive Data Structures & Algorithms sheets designed to prepare you for coding interviews and competitive programming."
          />
          <FeatureCard
            title="CS Subjects"
            icon={<FaDesktop size={28} />}
            text="Master core Computer Science subjects like Operating Systems, Networking, Databases, and more with easy-to-understand resources."
          />
          <FeatureCard
            title="Projects"
            icon={<FaChrome size={28} />}
            text="Build impactful projects that showcase your skills, from beginner-friendly apps to advanced real-world solutions."
          />
        </div>
      </section>
      {/* <ChatAssistant/> */}
    </div>
  );
};

export default HeroSection;
