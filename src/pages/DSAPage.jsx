import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Progress from "../components/ProgressTracker";
import { getAllDSA, getCompletedQuestions } from "../services/dsaService";
import { Link } from "react-router-dom";
import "../App.css";

const getBadgeColor = (level) => {
  switch (level.toLowerCase()) {
    case "basic":
      return "text-green-600";
    case "easy":
      return "text-yellow-400";
    case "medium":
      return "text-orange-500";
    case "hard":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};

const DSAPage = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [progressState, setProgressState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questions = await getAllDSA();

        const grouped = questions.reduce((acc, q) => {
          const key = q.category?.trim().toLowerCase() || "uncategorized";
          (acc[key] ??= []).push({ ...q, title: q.title.trim() });
          return acc;
        }, {});

        const groupedArr = Object.entries(grouped).map(([name, qs]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          questions: qs,
        }));

        setGroupedData(groupedArr);

        const completedTitles = username
          ? new Set(await getCompletedQuestions(username))
          : new Set();

        setProgressState(
          groupedArr.map((cat) => ({
            open: false, // by default collapsed
            checked: cat.questions.map((q) => completedTitles.has(q.title)),
          }))
        );
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  // Collapse others and expand only selected
  const toggleOpen = (index) => {
    setProgressState((prev) =>
      prev.map((item, i) => ({
        ...item,
        open: i === index ? !item.open : false,
      }))
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-white">
          Loading…
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen text-white px-4 sm:px-6 md:px-8 lg:px-20 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-center md:text-left w-full md:w-auto">
            DSA Question Tracker
          </h1>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category-wise Display */}
        <div className="space-y-6 pb-12">
          {groupedData.map((cat, catIdx) => {
            const checked = progressState[catIdx]?.checked ?? [];
            const completed = checked.filter(Boolean).length;
            const total = cat.questions.length;
            const pct = (completed / total) * 100;

            const filtered = cat.questions.filter((q) =>
              q.title.toLowerCase().includes(searchTerm)
            );

            if (filtered.length === 0) return null;

            return (
              <div
                key={catIdx}
                className="bg-[#1A1A1A] backdrop-blur p-4 sm:p-6 rounded-xl shadow-lg shadow-black/40"
              >
                {/* Title + Progress + Toggle Button */}
                <button
                  onClick={() => toggleOpen(catIdx)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  {/* Category Name */}
                  <div className="text-lg sm:text-xl font-semibold capitalize whitespace-nowrap overflow-hidden text-ellipsis pr-4">
                    {cat.name}
                  </div>

                  {/* Progress Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 w-auto sm:w-1/2 text-right">
                    {/* Progress bar - hidden on small screens */}
                    <div className="hidden sm:block w-full sm:w-[70%]">
                      <Progress value={pct} className="h-4 sm:h-5" />
                    </div>

                    {/* Count */}
                    <span className="text-base text-gray-400 block mt-1 sm:mt-0 whitespace-nowrap">
                      {completed} / {total} completed
                    </span>
                  </div>
                </button>

                {/* Table Headers */}
                {progressState[catIdx].open && (
                  <div className="flex justify-between px-1 mt-6 mb-1 text-sm font-medium text-gray-400">
                    <div className="w-6">Completed</div>
                    <div className="flex-1 pl-20">Problem</div>
                    <div className="w-24 text-right">Difficulty</div>
                  </div>
                )}

                {/* Question List */}
                <ul
                  className={`transition-all duration-300 ease-in-out ${
                    progressState[catIdx].open
                      ? "max-h-[600px] overflow-y-auto"
                      : "max-h-0 overflow-hidden"
                  } pr-2 pb-2 custom-scrollbar`}
                >
                  {filtered.map((q) => {
                    const realIndex = cat.questions.findIndex(
                      (qq) => qq.id === q.id
                    );
                    return (
                      <li
                        key={q.id}
                        className="flex justify-between items-start gap-2 py-2 border-b border-white/10 last:border-none"
                      >
                        {/* Checkbox */}
                        <div className="w-6 pt-1 pl-5">
                          <input
                            type="checkbox"
                            checked={checked[realIndex] || false}
                            readOnly
                            className="accent-green-500"
                          />
                        </div>

                        {/* Title */}
                        <div className="flex-1 pl-20 overflow-hidden">
                          <Link
                            to={`/dsa/question/${q.id}`}
                            className="text-blue-400 truncate block max-w-[80%] sm:max-w-[90%]"
                          >
                            {q.title}
                          </Link>
                        </div>

                        {/* Difficulty */}
                        {q.difficulty && (
                          <span
                            className={`text-sm font-semibold px-2 py-0.5 whitespace-nowrap capitalize ${getBadgeColor(
                              q.difficulty
                            )}`}
                          >
                            {q.difficulty}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default DSAPage;
