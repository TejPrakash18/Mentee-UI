import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getBlogById, markBlogComplete } from "../services/blogService";
import Navbar from "../components/Navbar";
import NotFoundPage from "./NotFoundPage";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import MarkdownRenderer from "../components/MarkdownRenderer";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [visitedCodeSections, setVisitedCodeSections] = useState(new Set());
  const [codeSectionIndices, setCodeSectionIndices] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef([]);

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
        if (indices.includes(0)) {
          setVisitedCodeSections(new Set([0]));
        }
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <NotFoundPage />;

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen overflow-hidden">
        <p className="text-yellow-500 text-lg animate-pulse">Loading Blog...</p>
      </div>
    );
  }

  const handleTopicClick = (index) => {
    setSelectedSectionIndex(index);
    const section = blog.sections?.[index];
    if (section?.language) {
      setVisitedCodeSections((prev) => new Set(prev).add(index));
    }
    setSidebarOpen(false);
  };

  const handleMarkComplete = async () => {
    const username = localStorage.getItem("username");
    if (!username || username === "undefined") {
      return toast.warning("User not logged in");
    }

    try {
      await markBlogComplete(username, blog.title);
      toast.success("Marked as Complete!");
      setCompleted(true);
      setBlog((prev) => ({ ...prev, progress: 100 }));
    } catch {
      toast.warning("Failed to mark as complete.");
    }
  };

  const renderSectionContent = (section) => {
    if (section.language) {
      return (
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
          }}
        >
          {section.content}
        </SyntaxHighlighter>
      );
    }

    return (
      <ErrorBoundary>
        <MarkdownRenderer content={section.content} />
      </ErrorBoundary>
    );
  };

  const conclusionIndex = blog?.sections?.length - 1;
  const allCodeVisited = codeSectionIndices.every((i) =>
    visitedCodeSections.has(i)
  );
  const canMarkComplete =
    selectedSectionIndex === conclusionIndex && allCodeVisited && !completed;

  return (
    <>
    <div className="min-h-screen w-full overflow-x-hidden  text-neutral-900 dark:text-white scroll-smooth">
      <Navbar />

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-5 left-5 z-50 bg-orange-500 text-white p-3 rounded-full shadow-md hover:bg-orange-600"
        aria-label="Open Sidebar"
      >
        <FiMenu size={20} />
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-neutral-900 shadow-lg z-40 transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-orange-500 font-bold text-lg">Sections</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <IoClose className="text-gray-700 dark:text-white" size={24} />
          </button>
        </div>
        <ul className="p-4 space-y-2">
          {blog.sections?.map((section, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleTopicClick(idx)}
                className={`w-full text-left px-3 py-2 rounded-md font-medium transition-all ${
                  selectedSectionIndex === idx
                    ? "bg-orange-500 text-white"
                    : "text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-800 dark:text-orange-300"
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-screen-xl mx-auto px-4 md:px-10 py-10">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-64 sticky top-24">
          <div className=" bg-neutral-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-orange-500 text-center">
              Blog Sections
            </h2>
            <ul className="space-y-2">
              {blog.sections?.map((section, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleTopicClick(idx)}
                    className={`w-full text-left px-3 py-2 rounded-md font-medium transition-all ${
                      selectedSectionIndex === idx
                        ? "bg-orange-500 text-white"
                        : "text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-800 dark:text-orange-300"
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          <header className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {blog.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Category:{" "}
              <span className="text-orange-500 font-medium">
                {blog.category}
              </span>{" "}
              | Difficulty:{" "}
              <span className="text-orange-500 font-medium">
                {blog.difficulty}
              </span>
            </p>
          </header>

          {blog.sections?.[selectedSectionIndex] && (
            <section
              ref={(el) => (sectionRefs.current[selectedSectionIndex] = el)}
              className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-semibold text-orange-500 mb-4">
                {blog.sections[selectedSectionIndex].title}
              </h2>

              {blog.sections[selectedSectionIndex].description && (
                <p className="italic text-gray-700 dark:text-gray-300 mb-4">
                  {blog.sections[selectedSectionIndex].description}
                </p>
              )}

              {renderSectionContent(blog.sections[selectedSectionIndex])}

              {canMarkComplete && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleMarkComplete}
                    disabled={completed}
                    className={`px-6 py-3 rounded-full text-white font-bold transition-all ${
                      completed
                        ? "bg-green-500 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    {completed ? "Completed" : "Mark as Done"}
                  </button>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default BlogDetailPage;
