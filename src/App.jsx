import "./App.css";
import { Toaster } from "sonner";

import { Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhyChooseUs from "./components/WhyChooseUs";
import Instructor from "./components/Instructor";
import Footer from "./components/Footer";
import RegisterPage from "./pages/RegisterPage";
import BlogPage from "./pages/BlogPage";
import DSAPage from "./pages/DSAPage";
import CompilerPage from "./pages/CompilerPage";
// import UserDashboard from "./pages/UserDashboard"
import BlogDetailPage from "./pages/BlogDetailPage";
import PrivateRoute from "./routes/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import FAQPage from "./pages/FAQPage";
import TrustedCompanies from "./components/TrustedCompanies";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/UserDashboard";
import DSADetailPage from "./pages/DSADetailPage";


function App() {
  return (
    <>
      <Toaster
        position="bottom-left"
        duration={2000}
        closeButton
        toastOptions={{
          style: {
            width: "250px",
            minHeight: "40px",
            padding: "14px",
            fontSize: "14px",
          },
        }}
      />
      <div className="min-h-screen bg-black pt-6">
        {/* Define the Routes for different components */}
        <Routes>
          {/* Auth Pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Feature Pages */}
          <Route path="/compiler" element={<CompilerPage />} />
          <Route path="/dsa" element={<DSAPage />} />
          <Route path="/dsa/question/:id" element={<DSADetailPage />} />
          
          {/* 🛠 Handle invalid DSA paths */}
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          
          {/* 🛠 Handle invalid project paths */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HeroSection />
                <WhyChooseUs />
                <Instructor />
                <TrustedCompanies />
                <FAQPage />
                <Footer />
              </>
            }
          />
          {/* Global 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
