import React from "react";
import { useNavigate } from "react-router-dom";
import { TbError404 } from "react-icons/tb";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="fixed inset-0 flex items-center justify-center bg-black px-4">
        <div className="text-center max-w-md">
          {/* Big 404 icon */}
          <TbError404 className="w-32 h-32 md:w-40 md:h-40 text-purple-500 mx-auto" />

          {/* Headline */}
          <h1 className="mt-8 text-3xl md:text-4xl font-extrabold text-white">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="mt-4 text-lg text-gray-300">
            This page doesn't exist or is under the maintenance. Our team is work on
            it -{" "}
            <span className="text-amber-300 font-semibold hover:text-blue-800 text-xl">
              please check back soon.
            </span>
          </p>

          {/* Back-home button */}
          <button
            onClick={() => navigate("/")}
            className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-transform hover:scale-105"
          >
            Back Home 🏠
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
