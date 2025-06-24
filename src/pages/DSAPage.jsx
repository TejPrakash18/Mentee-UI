import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Progress from "../components/ProgressTracker";
import { getAllDSA, getCompletedQuestions } from "../services/dsaService";
import { Link } from "react-router-dom";

const DSAPage = () => {
  const [groupedData, setGroupedData] = useState([]);
  const [progressState, setProgressState] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questions = await getAllDSA();

        const grouped = questions.reduce((acc, q) => {
          const cat = q.category || "Uncategorized";
          (acc[cat] ??= []).push(q);
          return acc;
        }, {});

        const groupedArr = Object.entries(grouped).map(([name, qs]) => ({
          name,
          questions: qs,
        }));

        setGroupedData(groupedArr);

        const defaultProg = groupedArr.map((c) => ({
          open: false,
          checked: c.questions.map(() => false),
        }));

        if (username) {
          const completedTitles = await getCompletedQuestions(username);
          const completedSet = new Set(completedTitles);
          setProgressState(
            groupedArr.map((c) => ({
              open: false,
              checked: c.questions.map((q) =>
                completedSet.has(q.title)
              ),
            }))
          );
        } else {
          setProgressState(defaultProg);
        }
      } catch (err) {
        console.error("Error loading questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const toggleOpen = (index) =>
    setProgressState((prev) =>
      prev.map((c, i) => (i === index ? { ...c, open: !c.open } : c))
    );

  /** Skeleton while loading */
  if (loading)
    return (
      <>
        <Navbar />
        <section className="min-h-screen flex items-center justify-center text-white px-4">
          <div className="w-full max-w-2xl space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-neutral-800/70 animate-pulse" />
            ))}
          </div>
        </section>
      </>
    );

  return (
    <>
      <Navbar />
      <main className="min-h-screen text-white px-4 sm:px-6 md:px-8 lg:px-20 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          DSA Question Tracker
        </h1>

        <div className="space-y-6">
          {groupedData.map((cat, catIdx) => {
            const checked = progressState[catIdx]?.checked ?? [];
            const completed = checked.filter(Boolean).length;
            const total = cat.questions.length;
            const pct = (completed / total) * 100;

            return (
              <div
                key={catIdx}
                className="bg-neutral-900/70 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-lg shadow-black/40"
              >
                {/* Header */}
                <button
                  className="w-full flex justify-between items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() => toggleOpen(catIdx)}
                >
                  <span className="text-lg sm:text-xl font-semibold capitalize">
                    {cat.name}
                  </span>
                  <span className="text-sm text-gray-400">
                    {completed} / {total}
                  </span>
                </button>

                {/* Progress */}
                <Progress
                  value={pct}
                  className="h-2 sm:h-3 my-3 transition-all duration-300"
                />

                {/* Question List */}
                <ul
                  className={`pl-2 sm:pl-4 grid gap-2 sm:gap-3 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    progressState[catIdx]?.open ? "max-h-[999px]" : "max-h-0"
                  }`}
                >
                  {cat.questions.map((q, qIdx) => (
                    <li
                      key={qIdx}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center space-x-2 overflow-hidden">
                        <input
                          type="checkbox"
                          checked={checked[qIdx] || false}
                          readOnly
                          className="accent-green-500 focus:ring-2 focus:ring-green-500 rounded"
                        />
                        <Link
                          to={`/dsa/question/${q.id}`} // ✅ Fixed path
                          className="text-blue-400 hover:underline truncate max-w-[250px] sm:max-w-xs md:max-w-sm"
                        >
                          {q.title}
                        </Link>
                      </div>

                      {/* ✅ Difficulty Badge */}
                      {q.difficulty && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            q.difficulty.toLowerCase() === "basic"
                              ? "bg-green-600 text-white"
                              : q.difficulty.toLowerCase() === "easy"
                              ? "bg-yellow-500 text-black"
                              : q.difficulty.toLowerCase() === "medium"
                              ? "bg-red-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      )}
                    </li>
                  ))}
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
