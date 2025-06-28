import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById, markBlogComplete } from "../services/blogService";
import Navbar from "../components/Navbar";
import NotFoundPage from "./NotFoundPage";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [visitedCodeSections, setVisitedCodeSections] = useState(new Set());
  const [codeSectionIndices, setCodeSectionIndices] = useState([]);
  const [loading, setLoading] = useState(false); // For loading state
  const { theme, setTheme } = useTheme(); // Dark mode toggle

  useEffect(() => {
    getBlogById(id)
      .then((res) => {
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
      })
      .catch(() => setNotFound(true));
  }, [id]);

  const handleMarkComplete = async () => {
    setLoading(true); // Show loading spinner when marking as complete
    const username = localStorage.getItem("username");
    if (!username || username === "undefined") {
      setLoading(false); // Hide loading spinner
      return toast.warning("User not logged in");
    }

    try {
      await markBlogComplete(username, blog.title);
      toast.success("Marked as Complete!");
      setCompleted(true);
      setBlog((prev) => ({ ...prev, progress: 100 }));
    } catch {
      toast.warning("Failed to mark as complete.");
    } finally {
      setLoading(false); // Hide loading spinner after action
    }
  };

  const renderSectionContent = (section, index) => (
    <motion.div
      key={index}
      className="space-y-3 p-6 bg-white/5 rounded-xl shadow-md border border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold text-yellow-400">{section.title}</h2>

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
    </motion.div>
  );

  if (notFound) return <NotFoundPage />;

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-yellow-500 text-lg animate-pulse">Loading Blog...</p>
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
          theme === "dark" ? "bg-darkcard text-white" : " text-white"
        } scroll-smooth`}
      >
        <Navbar />

        {/* Breadcrumb Navigation */}
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

        {/* Blog Header */}
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <div className="bg-blue-600/90 border border-blue-300 shadow-lg rounded-xl p-6">
            <h1 className="text-4xl font-extrabold mb-2 text-white">
              {blog.title}
            </h1>
            <p className="text-sm text-gray-200">
              Category:{" "}
              <span className="font-medium capitalize">{blog.category}</span> | Difficulty:{" "}
              <span className="font-medium capitalize">{blog.difficulty}</span>
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
          {blog.sections?.map((section, index) =>
            renderSectionContent(section, index)
          )}

          {canMarkComplete && (
            <div className="flex justify-center mt-10 mb-20">
              <button
                onClick={handleMarkComplete}
                disabled={completed || loading}
                className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300 ${
                  completed
                    ? "bg-green-500 cursor-not-allowed"
                    : loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                {loading ? (
                  <span className="animate-spin inline-block mr-2 w-5 h-5 border-4 border-t-4 border-yellow-500 rounded-full"></span>
                ) : (
                  <>
                    {completed ? "Completed" : "Mark as Done"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogDetailPage;
