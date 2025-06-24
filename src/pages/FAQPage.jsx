import FAQ from "../components/FAQ";

const FAQPage = () => {
  return (
    <>
      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-20 bg-zinc-900 mt-20 rounded-2xl mx-4 sm:mx-8 lg:mx-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-pink-400">
          Frequently Asked Questions
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          <FAQ
            question="How do I start with the DSA sheet?"
            answer="Begin with the foundational topics and practice consistently. Our DSA sheet is structured to gradually build your problem-solving skills."
          />
          <FAQ
            question="Are the projects suitable for beginners?"
            answer="Yes! Projects range from beginner to advanced levels, each with detailed instructions to help you succeed."
          />
          <FAQ
            question="Do you offer interview preparation materials?"
            answer="Absolutely! We provide curated questions, mock interviews, and strategies to help you confidently tackle technical interviews."
          />
          <FAQ
            question="How do I balance college academics with interview prep?"
            answer="Time management is key. Start with small, daily targets — like 30 minutes of DSA or 1 problem a day. Use weekends or breaks to focus more on core subjects or mock interviews. Our flexible content and daily task scheduler helps you prep at your pace."
          />
          <FAQ
            question="Is it okay to start interview prep from scratch if I have less experience?"
            answer="Absolutely! Everyone starts somewhere. We’ve curated beginner-friendly resources, practice problems, and roadmaps to help you gradually build your skills from basic to advanced."
          />
        </div>
      </section>
    </>
  );
};

export default FAQPage;
