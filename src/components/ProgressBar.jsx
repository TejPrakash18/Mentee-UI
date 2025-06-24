import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import {
  fetchCompletedProjectsCount,
  fetchDSACompletedCountByDifficulty,
} from "../services/progressService";

const ProgressBar = () => {
  const [progress, setProgress] = useState({
    dsa: {
      basic: 40,
      easy: 45,
      medium: 26,
      solvedBasic: 0,
      solvedEasy: 0,
      solvedMedium: 0,
    },
    projects: { total: 6, completed: 0 },
  });

  const [year] = useState(2025);

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) return;
    (async () => {
      const [projCnt, dsaCnt] = await Promise.all([
        fetchCompletedProjectsCount(username),
        fetchDSACompletedCountByDifficulty(username),
      ]);
      setProgress((p) => ({
        ...p,
        dsa: {
          ...p.dsa,
          solvedBasic: dsaCnt.basic || 0,
          solvedEasy: dsaCnt.easy || 0,
          solvedMedium: dsaCnt.medium || 0,
        },
        projects: { ...p.projects, completed: projCnt || 0 },
      }));
    })();
  }, [username]);

  const { basic, easy, medium, solvedBasic, solvedEasy, solvedMedium } =
    progress.dsa;
  const dsaTotal = basic + easy + medium;
  const dsaSolved = solvedBasic + solvedEasy + solvedMedium;

  return (
    <section className="bg-[#1d1c20]/60 backdrop-blur rounded-2xl p-6 lg:p-8 shadow-xl text-white min-h-[32rem] flex flex-col space-y-8">
      <h2 className="text-xl font-bold text-sky-400">Learning Progress</h2>

      <div className="grid gap-8 md:grid-cols-2">
        <ProgressBlock
          title="DSA"
          solved={`${dsaSolved}/${dsaTotal}`}
          bars={[
            {
              label: "Basic",
              done: solvedBasic,
              total: basic,
              color: "bg-green-400",
              track: "bg-green-900",
            },
            {
              label: "Easy",
              done: solvedEasy,
              total: easy,
              color: "bg-yellow-400",
              track: "bg-yellow-900",
            },
            {
              label: "Medium",
              done: solvedMedium,
              total: medium,
              color: "bg-red-400",
              track: "bg-red-900",
            },
          ]}
        />
        <ProgressBlock
          title="Projects"
          solved={`${progress.projects.completed}/${progress.projects.total}`}
          bars={[
            {
              label: "Projects",
              done: progress.projects.completed,
              total: progress.projects.total,
              color: "bg-purple-400",
              track: "bg-purple-900",
            },
          ]}
        />
      </div>

      <footer className="text-xs text-gray-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between pt-4 border-t border-[#2c2c2f]">
        <span>© 2025 Tej · Smart LMS</span>
        <a
          href="mailto:tej22upa.dhyay@gmail.com"
          className="text-orange-400 hover:underline"
        >
          Report Bug
        </a>
      </footer>
    </section>
  );
};

const ProgressBlock = ({ title, solved, bars }) => (
  <article className="flex flex-col space-y-4">
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FaCheckCircle className="text-green-400" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <span className="text-sm text-gray-400">{solved}</span>
    </header>
    {bars.map((b) => (
      <BarItem key={b.label} {...b} />
    ))}
  </article>
);

const BarItem = ({ label, done, total, color, track }) => {
  const pct = total ? (done / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-400">
          {done}/{total}
        </span>
      </div>
      <div className={`h-2 rounded-full ${track}`}>
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
