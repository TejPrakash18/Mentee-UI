import SidebarProfile from "../components/SidebarProfile";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  const username = localStorage.getItem("username") || "User";

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-4 lg:px-16 py-10">
        <div className="text-center lg:text-left mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-white">
            Welcome, <span className="text-orange-500 capitalize font-mono">{username}</span>
          </h2>
          <p className="text-gray-400 text-base">
            Track your progress, showcase your skills, and grow every day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <SidebarProfile />
          </div>
          <div className="lg:col-span-2">
            <ProgressBar />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
