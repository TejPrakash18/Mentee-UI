import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBlogById,
  getCompletedBlogs,
  markBlogComplete,
} from "../services/blogService";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NotFoundPage from "./NotFoundPage";
import ErrorBoundary from "../components/ErrorBoundary";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { useTheme } from "next-themes";

import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
  FaRegCopy,
  FaCheckCircle,
} from "react-icons/fa";

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedSectionIndex, setExpandedSectionIndex] = useState(null);

  const sectionRefs = useRef([]);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const res = await getBlogById(id);
        let blogData = res?.data;

        if (Array.isArray(blogData)) {
          blogData = blogData.length > 0 ? blogData[0] : null;
        }

        if (!blogData || !blogData.title) {
          setNotFound(true);
          return;
        }

        setBlog({ ...blogData, sections: blogData.sections || [] });

        const username = localStorage.getItem("username");
        if (username) {
          const completedRes = await getCompletedBlogs(username);
          const completedTitles = completedRes.data || [];
          const completedSet = new Set(completedTitles);
          setCompleted(completedSet.has(blogData.title));
        }

        const checkNeighbor = async (neighborId, setter) => {
          try {
            const res = await getBlogById(neighborId);
            let data = Array.isArray(res.data) ? res.data[0] : res.data;
            setter(!!data && data.title);
          } catch {
            setter(false);
          }
        };

        await checkNeighbor(parseInt(id) - 1, setHasPrev);
        await checkNeighbor(parseInt(id) + 1, setHasNext);
      } catch {
        setNotFound(true);
      }
    };

    loadBlog();
  }, [id]);

  const handleToggleSection = (index) => {
    setExpandedSectionIndex((prevIndex) => {
      const nextIndex = prevIndex === index ? null : index;
      setTimeout(() => {
        if (sectionRefs.current[nextIndex]) {
          sectionRefs.current[nextIndex].scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 150);
      return nextIndex;
    });
  };

  const handleMarkComplete = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      toast.warning("User not logged in");
      return;
    }

    try {
      setLoading(true);
      await markBlogComplete(username, blog.title);
      setCompleted(true);
      setBlog((prev) => ({ ...prev, progress: 100 }));
      toast.success("Marked as Complete!");
    } catch {
      toast.warning("Failed to mark as complete.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const renderSection = (section, index) => {
    const isExpanded = expandedSectionIndex === index;
    const keyOrder = [
      "text",
      "code",
      "text1",
      "code1",
      "text2",
      "code2",
      "text3",
    ];

    return (
      <section
        key={index}
        ref={(el) => (sectionRefs.current[index] = el)}
        className="bg-[#232323] rounded-xl border border-[#333] shadow-md overflow-hidden"
      >
        <button
          onClick={() => handleToggleSection(index)}
          className="w-full flex justify-between items-center px-6 py-4 bg-[#282828] hover:bg-[#333] text-left transition focus:outline-none"
        >
          <span className="text-lg md:text-xl font-semibold text-[#EAEAEA]">
            {section.title}
          </span>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden px-6 text-[#EAEAEA] ${
            isExpanded
              ? "max-h-[3000px] opacity-100 py-6"
              : "max-h-0 opacity-0 py-0"
          }`}
        >
          <ErrorBoundary>
            {section.content.map((content, idx) => {
              const key = `${index}-${idx}`;
              return (
                <div key={key} className="mb-6">
                  {keyOrder.map((keyName) => {
                    const value = content[keyName];
                    const subKey = `${key}-${keyName}`;
                    if (!value) return null;

                    if (keyName.startsWith("text")) {
                      return (
                        <p
                          key={subKey}
                          className="text-[#B0B0B0] mb-2 whitespace-pre-line text-base md:text-lg"
                        >
                          {value}
                        </p>
                      );
                    }

                    if (keyName.startsWith("code")) {
                      const fixedCode = value.replace(/\\"/g, '"');
                      return (
                        <div className="relative mt-4" key={subKey}>
                          <button
                            onClick={() => copyToClipboard(fixedCode, subKey)}
                            className="absolute top-2 right-2 text-sm bg-[#2A2B30] text-white px-2 py-1 rounded hover:bg-[#3A3B40] transition"
                            aria-label="Copy code to clipboard"
                          >
                            {copiedIndex === subKey ? (
                              <span className="flex items-center gap-1">
                                <FaCheckCircle className="text-green-400" />{" "}
                                Copied
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <FaRegCopy /> Copy
                              </span>
                            )}
                          </button>

                          <SyntaxHighlighter
                            language={content.language || "java"}
                            style={oneDark}
                            showLineNumbers
                            wrapLines
                            customStyle={{
                              borderRadius: "0.75rem",
                              padding: "1.25rem",
                              fontSize: "1rem",
                              whiteSpace: "pre-wrap",
                              fontFamily:
                                "'Fira Code', 'JetBrains Mono', monospace",
                            }}
                          >
                            {fixedCode}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              );
            })}
          </ErrorBoundary>
        </div>
      </section>
    );
  };

  if (notFound) return <NotFoundPage />;
  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen text-yellow-500 text-lg animate-pulse">
        Loading Blog...
      </div>
    );
  }

  return (
    <>
      <div
        className={`min-h-screen w-full ${
          theme === "dark" ? "bg-[#1A1A1A] text-white" : "text-black"
        }`}
      >
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-200 text-sm font-medium hover:text-orange-500"
          >
            <FaArrowLeft className="mr-2 text-base"/>
            Go Back
          </button>

          <label className="flex items-center gap-2 text-sm text-white font-medium">
            <input
              type="checkbox"
              checked={completed}
              onChange={handleMarkComplete}
              disabled={completed}
              className="w-5 h-5 cursor-pointer rounded border border-gray-600 bg-gray-800 checked:bg-green-600 checked:border-green-500 focus:ring-2 focus:ring-green-500"
            />
            <span
              className={`${completed ? "text-green-400 font-semibold" : ""}`}
            >
              Mark as Completed
            </span>
          </label>
        </div>

        <main className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-[#1A1A1A] border border-[#282828] shadow-lg rounded-xl p-6 space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {blog.title}
            </h1>
            <p className="text-base text-[#B0B0B0]">
              Category:{" "}
              <span className="font-medium capitalize">{blog.category}</span> |
              Difficulty:{" "}
              <span className="font-medium capitalize">{blog.difficulty}</span>
            </p>
            {blog.description && (
              <p className="text-base text-[#B0B0B0] leading-relaxed max-w-5xl">
                {blog.description}
              </p>
            )}
          </div>
        </main>

        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          {blog.sections?.map((section, index) =>
            renderSection(section, index)
          )}
        </div>

        <div className="flex justify-between items-center max-w-4xl mx-auto px-6 pb-20 gap-4 flex-wrap">
          <button
            onClick={() => hasPrev && navigate(`/blogs/${parseInt(id) - 1}`)}
            disabled={!hasPrev}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
              hasPrev
                ? "bg-[#2A2B30] hover:bg-[#3A3B40]"
                : "bg-gray-500 cursor-not-allowed"
            } text-white transition`}
          >
            <FaArrowLeft /> Prev
          </button>

          <button
            onClick={() => hasNext && navigate(`/blogs/${parseInt(id) + 1}`)}
            disabled={!hasNext}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
              hasNext
                ? "bg-[#2A2B30] hover:bg-[#3A3B40]"
                : "bg-gray-500 cursor-not-allowed"
            } text-white transition`}
          >
            Next <FaArrowRight />
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogDetailPage;
