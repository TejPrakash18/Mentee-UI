import SidebarProfile from "../components/SidebarProfile";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";
import UserActivityHeatmap from "../components/UserActivityHeatmap"; // optional

const DashboardPage = () => {
  const username = localStorage.getItem("username") || "User";

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-3 px-14 sm:px-6 lg:px-12">
        <div className="sm:p-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Sidebar */}
            <div className="lg:col-span-1 w-full">
              <div className="bg-[#1A1A1A] rounded-xl p-4 sm:p-6 shadow-inner border border-[#282828]">
                <SidebarProfile />
              </div>
            </div>

            {/* Main Dashboard */}
            <div className="lg:col-span-2 w-full flex flex-col gap-6">
              <div className="bg-[#1A1A1A] rounded-xl p-4 sm:p-6 shadow-inner border border-[#282828]">
                <ProgressBar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
