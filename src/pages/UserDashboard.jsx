import SidebarProfile from "../components/SidebarProfile";
import ProgressBar from "../components/ProgressBar";
import Navbar from "../components/Navbar";
import UserActivityHeatmap from "../components/UserActivityHeatmap"; // include this if you want heatmap here

const DashboardPage = () => {
  const username = localStorage.getItem("username") || "User";

  return (
    <>
      <Navbar />
      <div className="bg-[#1d1c20]/60 min-h-screen border-2 rounded-2xl mx-4 sm:mx-8 lg:mx-16 mt-5 px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-1 w-full">
            <SidebarProfile />
          </div>
          <div className="lg:col-span-2 w-full flex flex-col gap-6">
            <ProgressBar />
            
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
