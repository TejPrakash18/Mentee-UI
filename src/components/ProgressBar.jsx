import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import {
  getBlogCountByCategory,
  getCompletedBlogCountByCategory,
} from "../services/blogService";
import {
  getTotalCountOfDSAQuestionDifficultyWise,
  fetchDSACompletedCountByDifficulty,
} from "../services/dsaService";
import UserActivityHeatmap from "./UserActivityHeatmap";

const ProgressBar = () => {
  const [progress, setProgress] = useState({
    dsa: {
      basic: 0,
      easy: 0,
      medium: 0,
      solvedBasic: 0,
      solvedEasy: 0,
      solvedMedium: 0,
    },
    blogs: {
      technical: 0,
      core: 0,
      projects: 0,
      solvedTechnical: 0,
      solvedCore: 0,
      solvedProjects: 0,
    },
  });

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) return;

    (async () => {
      try {
        const [
          blogCategoryCount,
          completedBlogCountByCategory,
          dsaCategoryCount,
          completedDsaByDifficulty,
        ] = await Promise.all([
          getBlogCountByCategory(),
          getCompletedBlogCountByCategory(username),
          getTotalCountOfDSAQuestionDifficultyWise(),
          fetchDSACompletedCountByDifficulty(username),
        ]);

        const normalizedBlogs = Object.fromEntries(
          Object.entries(blogCategoryCount || {}).map(([key, value]) => [
            key.toLowerCase().replace(/\s+/g, ""),
            value,
          ])
        );

        const normalizedCompletedBlogs = Object.fromEntries(
          Object.entries(completedBlogCountByCategory || {}).map(([key, value]) => [
            key.toLowerCase().replace(/\s+/g, ""),
            value,
          ])
        );

        const normalizedDSA = Object.fromEntries(
          Object.entries(dsaCategoryCount || {}).map(([key, value]) => [
            key.toLowerCase(),
            value,
          ])
        );

        setProgress({
          dsa: {
            basic: normalizedDSA.basic || 0,
            easy: normalizedDSA.easy || 0,
            medium: normalizedDSA.medium || 0,
            solvedBasic: completedDsaByDifficulty.basic || 0,
            solvedEasy: completedDsaByDifficulty.easy || 0,
            solvedMedium: completedDsaByDifficulty.medium || 0,
          },
          blogs: {
            technical: normalizedBlogs.technical || 0,
            core: normalizedBlogs.corefundamental || 0,
            projects: normalizedBlogs.projectsblog || 0,
            solvedTechnical: normalizedCompletedBlogs.technical || 0,
            solvedCore: normalizedCompletedBlogs.corefundamental || 0,
            solvedProjects: normalizedCompletedBlogs.projectsblog || 0,
          },
        });
      } catch (error) {
        console.error("Error loading progress data:", error);
      }
    })();
  }, [username]);

  const {
    basic,
    easy,
    medium,
    solvedBasic,
    solvedEasy,
    solvedMedium,
  } = progress.dsa;

  const dsaTotal = basic + easy + medium;
  const dsaSolved = solvedBasic + solvedEasy + solvedMedium;

  const {
    technical,
    core,
    projects,
    solvedTechnical,
    solvedCore,
    solvedProjects,
  } = progress.blogs;

  const blogsTotal = technical + core + projects;
  const blogsSolved = solvedTechnical + solvedCore + solvedProjects;

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
          title="Blogs"
          solved={`${blogsSolved}/${blogsTotal}`}
          bars={[
            {
              label: "Technical",
              done: solvedTechnical,
              total: technical,
              color: "bg-blue-400",
              track: "bg-blue-900",
            },
            {
              label: "Fundamental",
              done: solvedCore,
              total: core,
              color: "bg-pink-400",
              track: "bg-pink-900",
            },
            {
              label: "Projects",
              done: solvedProjects,
              total: projects,
              color: "bg-purple-400",
              track: "bg-purple-900",
            },
          ]}
        />
      </div>
<UserActivityHeatmap username={username}/>



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
