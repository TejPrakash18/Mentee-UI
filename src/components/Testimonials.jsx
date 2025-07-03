import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";

const names = [
  "Harshit", "Shankul", "Anish", "Nitin", "Gungun",
  "Pihu", "Annie", "Vivek", "Kajal", "Priti",
  "Kanika", "Arun", "Lokendra", "Sumit", "Vikas",
  "Gaurav", "Aarav", "Vishal", "Charu", "Stuti",
  "Manish", "Amit", "Diya", "Sachin", "Aryan", "Sonam"
];

const companies = [
  "Google", "Microsoft", "Amazon", "Meta", "Netflix",
  "Adobe", "Uber", "Airbnb", "LinkedIn", "PayPal"
];

const feedbackOptions = [
  "Mentee transformed my career prep journey with its hands-on projects, structured learning and expert guidance.",
  "The live doubt sessions and real-world projects really helped me gain confidence in my skills.",
  "Thanks to Mentee, I cracked multiple interviews and built a strong resume.",
  "The personalized roadmap and consistent mentoring made my learning more focused.",
  "Mentee is the best learning platform for serious students aiming for top companies.",
  "I got placed at a dream company thanks to the DSA and system design content.",
  "The projects and real feedback made me feel job-ready.",
  "Every concept is explained so clearly, even complex topics feel simple.",
  "I built a full-stack project and showcased it in interviews. Huge plus!",
  "Interview prep was spot-on. Cracked 3 offers in 2 months!",
  "The structured curriculum saved me time and boosted my confidence.",
  "Mentorship was the game-changer for me. Consistent guidance is gold.",
  "Best part? Real dev experience, not just theory.",
  "Community support is active and incredibly helpful.",
  "From beginner to confident dev—Mentee made that journey easy.",
  "Incredible platform for anyone serious about landing top tech jobs.",
  "Mock interviews helped me polish my communication and tech stack.",
  "The UI/UX of the platform keeps you coming back every day.",
  "I love how they blend fundamentals with advanced real-world topics.",
  "The progress tracking and personalized tips were super helpful."
];

const testimonials = names.map((name, i) => ({
  name,
  company: companies[i % companies.length],
  feedback: feedbackOptions[i % feedbackOptions.length]
}));

const imageExtensions = ["jpg", "jpeg", "png", "webp"];

const TestimonialCard = ({ testimonial }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      for (const ext of imageExtensions) {
        const url = `/${testimonial.name.toLowerCase()}.${ext}`;
        const exists = await checkImage(url);
        if (exists && isMounted) {
          setAvatarUrl(url);
          return;
        }
      }
    };

    loadImage();
    return () => {
      isMounted = false;
    };
  }, [testimonial.name]);

  const checkImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#1c1c1f] to-[#111113] border border-[#2a2a2d] p-6 rounded-2xl shadow-sm hover:shadow-md hover:ring-1 hover:ring-sky-500 transition-all duration-300 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-sky-900 flex items-center justify-center text-xl shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={testimonial.name} className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle className="text-white text-2xl" />
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg text-white">{testimonial.name}</h3>
          <p className="text-sm text-gray-400">{testimonial.company}</p>
        </div>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">"{testimonial.feedback}"</p>
    </div>
  );
};

const Testimonials = () => {
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    let index = 0;
    const visibleCount = 8;

    const updateTestimonials = () => {
      const next = [];
      for (let i = 0; i < visibleCount; i++) {
        next.push(testimonials[(index + i) % testimonials.length]);
      }
      setVisibleTestimonials(next);
      setAnimationKey((prev) => prev + 1);
      index = (index + visibleCount) % testimonials.length;
    };

    updateTestimonials();
    const interval = setInterval(updateTestimonials, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-10 lg:px-20 bg-[#0d0d0f] text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-sky-400">
          What Our Learners Say
        </h2>

        <motion.div
          key={animationKey}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {visibleTestimonials.map((t, idx) => (
            <TestimonialCard key={`${t.name}-${idx}`} testimonial={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
