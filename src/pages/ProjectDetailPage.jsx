import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import { getProjectById, markProjectComplete } from '../services/projectService';
import Navbar from '../components/Navbar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import NotFoundPage from './NotFoundPage';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false); // 👈 new state
  const [completed, setCompleted] = useState(false);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [visitedCodeSections, setVisitedCodeSections] = useState(new Set());
  const [codeSectionIndices, setCodeSectionIndices] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sectionRefs = useRef([]);

  useEffect(() => {
    getProjectById(id)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;

        if (!data || Object.keys(data).length === 0 || data === undefined) {
          setNotFound(true); // 👈 mark as not found
          return;
        }

        setProject(data);
        if (data.progress === 100) setCompleted(true);

        const indices = data.sections
          ?.map((section, idx) => (section.language ? idx : null))
          .filter(idx => idx !== null);
        setCodeSectionIndices(indices);
        if (indices.includes(0)) {
          setVisitedCodeSections(new Set([0]));
        }
      })
      .catch(() => {
        setNotFound(true); // 👈 handle fetch failure
      });
  }, [id]);

  // Redirect to 404 page if invalid project
  if (notFound) {
    return (
      <>
        <NotFoundPage />
      </>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-yellow-500 text-xl animate-pulse">Loading Project...</p>
      </div>
    );
  }

  const handleTopicClick = (index) => {
    setSelectedSectionIndex(index);
    const section = project.sections?.[index];
    if (section?.language) {
      setVisitedCodeSections(prev => new Set(prev).add(index));
    }
    setSidebarOpen(false);
    setTimeout(() => {
      sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleMarkComplete = async () => {
    const username = localStorage.getItem('username');
    if (!username || username === 'undefined') return toast.warning("User not logged in");

    if (!project?.projectTitle) return toast.warning("Project data not loaded");

    try {
      await markProjectComplete(username, project.projectTitle);
      toast.success("Marked as Complete!");
      setCompleted(true);
      setProject(prev => ({ ...prev, progress: 100 }));
    } catch (err) {
      console.error(err);
      toast.warning("Failed to mark as complete.");
    }
  };

  const conclusionIndex = project?.sections?.findIndex(section =>
    section.title.toLowerCase().includes('conclusion')
  );

  const allCodeVisited = codeSectionIndices.every(i => visitedCodeSections.has(i));
  const canMarkComplete = selectedSectionIndex === conclusionIndex && allCodeVisited && !completed;

  return (
    <>
      <Navbar />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-neutral-900 shadow-lg z-50 transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-orange-500 font-bold text-lg">Sections</h2>
          <button onClick={() => setSidebarOpen(false)} aria-label="Close Sidebar">
            <IoClose className="text-gray-800 dark:text-white" size={24} />
          </button>
        </div>
        <ul className="p-4 space-y-2">
          {project.sections?.map((section, idx) => (
            <li key={idx}>
              <button
                onClick={() => handleTopicClick(idx)}
                className={`w-full text-left px-3 py-2 rounded-md font-medium transition ${
                  selectedSectionIndex === idx
                    ? 'bg-orange-400 text-white'
                    : 'text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900 dark:text-orange-300'
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-5 left-5 z-40 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600"
        aria-label="Open Sidebar"
      >
        <FiMenu size={20} />
      </button>

      {/* Page Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen gap-4 p-4 md:p-10">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-64 sticky top-24">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md p-4">
            <h2 className="text-lg font-bold mb-4 text-orange-500 text-center">Documentation</h2>
            <ul className="space-y-2">
              {project.sections?.map((section, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleTopicClick(idx)}
                    className={`w-full text-left px-3 py-2 rounded-md font-medium transition ${
                      selectedSectionIndex === idx
                        ? 'bg-orange-400 text-white'
                        : 'text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900 dark:text-orange-300'
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
          <header className="bg-blue-500 text-white p-6 rounded-md shadow">
            <h1 className="text-2xl font-bold">{project.projectTitle}</h1>
            <p className="mt-2 text-sm">{project.description}</p>
          </header>

          <section className="flex flex-col sm:flex-row justify-between gap-4 text-sm bg-white dark:bg-neutral-800 p-4 rounded-md shadow">
            <div className="text-orange-500 font-mono">
              Difficulty: {project.difficulty || 'N/A'}
            </div>
            <div>
              <span className="font-mono text-orange-500">Technologies:</span>{' '}
              <span className="text-gray-900 dark:text-white font-mono">
                {project.technologies?.length > 0
                  ? project.technologies.join(', ')
                  : 'Not listed'}
              </span>
            </div>
          </section>

          {project.sections?.[selectedSectionIndex] && (
            <section
              ref={el => (sectionRefs.current[selectedSectionIndex] = el)}
              className="bg-white dark:bg-neutral-800 p-6 rounded-md shadow"
            >
              <h2 className="text-2xl font-bold text-orange-500 mb-3">
                {project.sections[selectedSectionIndex].title}
              </h2>

              {project.sections[selectedSectionIndex].description && (
                <p className="italic text-gray-700 dark:text-gray-300 mb-4">
                  {project.sections[selectedSectionIndex].description}
                </p>
              )}

              {project.sections[selectedSectionIndex].language ? (
                <SyntaxHighlighter
                  language={project.sections[selectedSectionIndex].language}
                  style={dracula}
                  showLineNumbers
                  wrapLines
                  customStyle={{
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {project.sections[selectedSectionIndex].content}
                </SyntaxHighlighter>
              ) : (
                <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-base leading-relaxed">
                  {project.sections[selectedSectionIndex].content}
                </p>
              )}

              {canMarkComplete && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleMarkComplete}
                    disabled={completed}
                    className={`px-6 py-3 rounded-full text-white font-bold transition-all ${
                      completed
                        ? 'bg-green-500 cursor-not-allowed'
                        : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}
                  >
                    {completed ? 'Completed' : 'Mark as Done'}
                  </button>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default ProjectDetailPage;
