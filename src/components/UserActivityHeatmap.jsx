import { useEffect, useState } from "react";
import { getUserActivityStats } from "../services/userActivityService";
import { format, addDays, getDay, parseISO, getYear } from "date-fns";

const getColor = (count) => {
  if (count >= 5) return "bg-green-500 hover:bg-green-600";
  if (count >= 3) return "bg-green-400 hover:bg-green-500";
  if (count >= 1) return "bg-green-300 hover:bg-green-400";
  return "bg-gray-700 hover:bg-gray-600";
};

const generateYearlyGrid = (year, dataMap) => {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);
  const offset = getDay(startDate);
  const paddedStart = addDays(startDate, -offset);

  const totalDays = Math.ceil((endDate - paddedStart) / (1000 * 60 * 60 * 24)) + 1;
  const grid = [];
  let currentDate = paddedStart;

  for (let i = 0; i < totalDays; i++) {
    const week = Math.floor(i / 7);
    const day = i % 7;
    const key = format(currentDate, "yyyy-MM-dd");

    if (!grid[week]) grid[week] = [];

    if (getYear(currentDate) === year) {
      grid[week][day] = {
        date: key,
        count: dataMap[key] || 0,
        month: format(currentDate, "MMM"),
      };
    } else {
      grid[week][day] = null;
    }

    currentDate = addDays(currentDate, 1);
  }

  return grid;
};

const UserActivityHeatmap = ({ username }) => {
  const [activityData, setActivityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [streaks, setStreaks] = useState({ current: 0, longest: 0 });

  const currentYear = new Date().getFullYear();
  const boxSize = "w-[clamp(8px,1.6vw,12px)] h-[clamp(8px,1.6vw,11.5px)]";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getUserActivityStats(username);
        const safeData = stats?.dailyData || {};
        setActivityData(safeData);
        setStreaks({
          current: stats?.currentStreak || 0,
          longest: stats?.longestStreak || 0,
        });

        const yearlyTotal = Object.entries(safeData).reduce((acc, [date, val]) => {
          try {
            if (format(parseISO(date), "yyyy") === `${currentYear}`) {
              return acc + val;
            }
          } catch (_) {}
          return acc;
        }, 0);

        setTotal(yearlyTotal);
      } catch (error) {
        console.error("Failed to fetch activity stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  const fullGrid = generateYearlyGrid(currentYear, activityData);

  const renderMonthLabels = (weeks) => {
    const labels = [];
    let lastMonth = null;

    weeks.forEach((week, i) => {
      const firstDay = week.find((day) => day !== null);
      const month = firstDay?.month;
      if (month && month !== lastMonth) {
        labels.push(
          <div key={i} className={`text-xs text-gray-400 ${boxSize} text-center`}>
            {month}
          </div>
        );
        lastMonth = month;
      } else {
        labels.push(<div key={i} className={boxSize} />);
      }
    });

    return <div className="flex gap-[1.5px] pl-[28px] mb-1">{labels}</div>;
  };

  const renderGrid = (weeks) =>
    weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="flex flex-col gap-[2px]">
        {week.map((day, dayIndex) =>
          day ? (
            <div
              key={dayIndex}
              className={`rounded-[3px] ${boxSize} ${getColor(day.count)} cursor-pointer border-none`}
              title={`${day.count} solved on ${format(parseISO(day.date), "dd MMM yyyy")}`}
            />
          ) : (
            <div key={dayIndex} className={`rounded-[2px] bg-transparent ${boxSize}`} />
          )
        )}
      </div>
    ));

  return (
    <div className="bg-[#1e1e22] text-white rounded-xl p-4 mt-10 sm:p-6 shadow-lg w-full">
      <style>{`
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #22c55e; /* green-500 */
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background-color: #2a2a2f;
          border-radius: 8px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;  
          scrollbar-color: #22c55e #2a2a2f;
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-lg font-semibold">
          {total} submissions in {currentYear}
          <span className="ml-3 text-gray-400 text-sm font-normal">
            (Current streak: {streaks.current})
          </span>
        </h2>
        <div className="text-sm text-gray-400">
          <span className="mr-4">
            Active days: {Object.keys(activityData).length}
          </span>
          <span>Max streak: {streaks.longest}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
        <span>Less</span>
        <div className={`rounded-[2px] bg-green-300 ${boxSize}`} />
        <div className={`rounded-[2px] bg-green-400 ${boxSize}`} />
        <div className={`rounded-[2px] bg-green-500 ${boxSize}`} />
        <span>More</span>
      </div>

      <div className="w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-max">
          {renderMonthLabels(fullGrid)}
          <div className="flex gap-[2px] pt-1">
            {!loading && renderGrid(fullGrid)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivityHeatmap;


{/* 
  <html>
  <Head> 
  <title> Dom Example</title>
  </head>
  <body>
  <h1 id="heading"> Hello Dom </h1>
  <p class = "txt">Hello Tej! </p>
  </body>
  </Html>
  
  */}