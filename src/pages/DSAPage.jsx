import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Progress from "../components/ProgressTracker";
import { getAllDSA, getCompletedQuestions } from "../services/dsaService";
import { Link } from "react-router-dom";
import "../App.css"; // ⬅️ Import your custom CSS

const getBadgeColor = (level) => {
  switch (level.toLowerCase()) {
    case "basic":
      return "bg-green-600 text-white";
    case "easy":
      return "bg-yellow-400 text-black";
    case "medium":
      return "bg-orange-500 text-white";
    case "hard":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-500 text-white";
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
            open: false,
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

  const toggleOpen = (index) =>
    setProgressState((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, open: !item.open } : item
      )
    );

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
                className="bg-neutral-900/80 backdrop-blur p-4 sm:p-6 rounded-xl shadow-lg shadow-black/40"
              >
                {/* Header */}
                <button
                  onClick={() => toggleOpen(catIdx)}
                  className="w-full flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="text-lg sm:text-xl font-semibold capitalize">
                    {cat.name}
                  </span>
                  <span className="text-sm text-gray-400">
                    {completed} / {total}
                  </span>
                </button>

                {/* Progress Bar */}
                <Progress
                  value={pct}
                  className="h-2 sm:h-3 my-3 transition-all duration-300"
                />

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
                        <div className="flex-1 flex items-start gap-2 overflow-hidden">
                          <input
                            type="checkbox"
                            checked={checked[realIndex] || false}
                            readOnly
                            className="accent-green-500 mt-1"
                          />
                          <Link
                            to={`/dsa/question/${q.id}`}
                            className="text-blue-400 hover:underline truncate max-w-[80%] sm:max-w-[85%]"
                          >
                            {q.title}
                          </Link>
                        </div>

                        {q.difficulty && (
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${getBadgeColor(
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
