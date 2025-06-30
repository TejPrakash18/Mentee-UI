import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, markBlogComplete } from "../services/blogService";

import Navbar from "../components/Navbar";
import NotFoundPage from "./NotFoundPage";
import Footer from "../components/Footer";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ErrorBoundary from "../components/ErrorBoundary";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  FaArrowLeft,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [visitedCodeSections, setVisitedCodeSections] = useState(new Set());
  const [codeSectionIndices, setCodeSectionIndices] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;

        if (!data || Object.keys(data).length === 0) {
          setNotFound(true);
          return;
        }

        setBlog(data);
        if (data.progress === 100) setCompleted(true);

        const indices = data.sections
          ?.map((section, idx) => (section.language ? idx : null))
          .filter((idx) => idx !== null);

        setCodeSectionIndices(indices);
        setVisitedCodeSections(new Set(indices));
        setExpandedSections({});

        const prevId = parseInt(id) - 1;
        const nextId = parseInt(id) + 1;

        const checkBlog = async (targetId, setter) => {
          try {
            const result = await getBlogById(targetId);
            const blogData = Array.isArray(result.data)
              ? result.data[0]
              : result.data;
            setter(!!blogData && Object.keys(blogData).length > 0);
          } catch {
            setter(false);
          }
        };

        checkBlog(prevId, setHasPrev);
        checkBlog(nextId, setHasNext);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        setNotFound(true);
      }
    };

    fetchBlog();
  }, [id]);

  const handleToggleSection = (index) => {
    setExpandedSections((prev) => {
      const newExpanded = {};
      Object.keys(prev).forEach((key) => {
        newExpanded[key] = true;
      });
      return { ...newExpanded, [index]: !prev[index] };
    });
  };

  const handleMarkComplete = async () => {
    const username = localStorage.getItem("username");
    if (!username || username === "undefined")
      return toast.warning("User not logged in");

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

  const renderSection = (section, index) => (
    <div
      key={index}
      className="bg-white/5 rounded-xl border border-neutral-900 shadow-md overflow-hidden"
    >
      <button
        onClick={() => handleToggleSection(index)}
        className="w-full flex justify-between items-center px-6 py-4 bg-neutral-900/80 text-left hover:bg-neutral-900/50 transition-colors duration-200"
      >
        <span className="text-lg font-semibold text-[#f0f0f0]">
          {section.title}
        </span>
        {expandedSections[index] ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {expandedSections[index] && (
        <div className="px-6 pb-6 space-y-4 text-white text-sm">
          {section.description && (
            <p className="text-gray-400">{section.description}</p>
          )}
          {section.language ? (
            <SyntaxHighlighter
              language={section.language}
              style={dracula}
              showLineNumbers
              wrapLines
              customStyle={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontSize: "0.875rem",
                whiteSpace: "pre-wrap",
                backgroundColor: "#282a36",
              }}
            >
              {section.content}
            </SyntaxHighlighter>
          ) : (
            <ErrorBoundary>
              <MarkdownRenderer content={section.content} />
            </ErrorBoundary>
          )}
        </div>
      )}
    </div>
  );

  if (notFound) return <NotFoundPage />;

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen text-yellow-500 text-lg animate-pulse">
        Loading Blog...
      </div>
    );
  }

  const allCodeVisited = codeSectionIndices.every((i) =>
    visitedCodeSections.has(i)
  );
  const canMarkComplete = allCodeVisited && !completed;

  return (
    <>
      <div
        className={`min-h-screen w-full ${
          theme === "dark" ? "bg-darkcard text-white" : "text-white"
        }`}
      >
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 mt-8">
          <nav className="flex space-x-2 text-sm text-yellow-500">
            <a href="/" className="hover:text-yellow-400">
              Home
            </a>
            <span>/</span>
            <a href="/blogs" className="hover:text-yellow-400">
              Blogs
            </a>
            <span>/</span>
            <span className="text-orange-400">{blog.title}</span>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-neutral-900/80 border border-neutral-900 shadow-lg rounded-xl p-6">
            <h1 className="text-4xl font-extrabold mb-2">{blog.title}</h1>
            <p className="text-sm text-gray-400">
              Category: {" "}
              <span className="font-medium capitalize">{blog.category}</span> |
              Difficulty: {" "}
              <span className="font-medium capitalize">{blog.difficulty}</span>
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
          {blog.sections?.map((section, index) =>
            renderSection(section, index)
          )}
        </div>

        <div className="flex justify-between items-center max-w-4xl mx-auto px-6 pb-20 gap-4 flex-wrap">
          <button
            onClick={() => hasPrev && navigate(`/blogs/${parseInt(id) - 1}`)}
            disabled={!hasPrev}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
              hasPrev
                ? "bg-neutral-900 hover:bg-neutral-900/50"
                : "bg-gray-500 cursor-not-allowed"
            } text-white`}
          >
            <FaArrowLeft /> Prev
          </button>

          {canMarkComplete && (
            <button
              onClick={handleMarkComplete}
              disabled={completed || loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 ${
                completed
                  ? "bg-green-500 cursor-not-allowed"
                  : loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white`}
            >
              {loading ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-t-2 border-yellow-500 rounded-full"></span>
              ) : (
                "Submit"
              )}
            </button>
          )}

          <button
            onClick={() => hasNext && navigate(`/blogs/${parseInt(id) + 1}`)}
            disabled={!hasNext}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
              hasNext
                ? "bg-neutral-900 hover:bg-neutral-900/50"
                : "bg-gray-500 cursor-not-allowed"
            } text-white`}
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
