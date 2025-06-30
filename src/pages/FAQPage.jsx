import React, { useState } from "react";
import FAQ from "../components/FAQ";

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const faqData = [
    {
      question: "How should I begin preparing with the DSA Sheet?",
      answer:
        "Start with the basics — arrays, strings, and recursion. The sheet is designed to build your skills progressively. Don’t rush; focus on understanding patterns and solving one or two problems consistently every day.",
    },
    {
      question:
        "Are the listed projects beginner-friendly and industry-relevant?",
      answer:
        "Yes! All projects are designed with learning progression in mind. They start simple and evolve into real-world use cases — helping you build a strong portfolio for internships or full-time roles.",
    },
    {
      question: "What resources do you offer for interview preparation?",
      answer:
        "We offer handpicked DSA problems, behavioral interview guidance, resume-building tips, mock interview sets, and company-specific prep tracks to give you a complete prep experience.",
    },
    {
      question:
        "How can I manage college academics along with placement preparation?",
      answer:
        "Consistency over intensity. Spend just 1 focused hour daily on DSA or concepts, and increase time on weekends. Use planners, prioritize weak areas, and follow structured prep content to avoid burnout.",
    },
    {
      question: "Is it too late to start interview preparation now?",
      answer:
        "Not at all. It’s never too late. With a focused roadmap, discipline, and the right guidance, you can go from beginner to job-ready in a few months. Every expert was once a beginner.",
    },
    {
      question:
        "How do I stay consistent and avoid burnout during preparation?",
      answer:
        "Break your goals into small, achievable tasks. Follow the '1-1-1 rule' — 1 DSA problem, 1 concept, 1 project task per day. Track your progress and take short breaks to recharge. Consistency beats intensity.",
    },
    {
      question:
        "What if I struggle to understand complex topics like system design or DP?",
      answer:
        "That’s completely normal. Start with simpler examples, visualize the problem, and build intuition slowly. Use real-world analogies and break the topic into smaller pieces. Revisit the concepts after practicing — mastery comes with time and repetition.",
    },
  ];

  return (
    <>
      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-20 bg-zinc-900 mt-20 rounded-2xl mx-4 sm:mx-8 lg:mx-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-pink-400">
          Frequently Asked Questions
        </h2>

        <div className="max-w-4xl mx-auto space-y-6">
          {faqData.map((faq, index) => (
            <FAQ
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default FAQPage;
