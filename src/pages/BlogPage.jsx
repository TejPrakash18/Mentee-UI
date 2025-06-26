// src/pages/BlogPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import { getAllBlogs, getCompletedBlogs } from "../services/blogService";
import { GrNotes } from "react-icons/gr";
import { MdQuiz } from "react-icons/md";
import { FaPortrait, FaUserTie, FaBook } from "react-icons/fa";
import { RiMovie2Fill } from "react-icons/ri";
import Footer from "../components/Footer";

const icons = [GrNotes, MdQuiz, FaPortrait, RiMovie2Fill, FaUserTie, FaBook];

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const loggedIn = !!username;
    setIsLoggedIn(loggedIn);

    const fetchBlogs = async () => {
      try {
        let allRes = await getAllBlogs();
        let allBlogs = allRes.data;

        if (loggedIn) {
          let completedRes = await getCompletedBlogs(username);
          let completedTitles = new Set(completedRes.data);

          allBlogs = allBlogs.map((blog) => ({
            ...blog,
            progress: completedTitles.has(blog.title) ? 100 : 0,
          }));
        } else {
          allBlogs = allBlogs.map((blog) => ({ ...blog, progress: null }));
        }

        setBlogs(allBlogs);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleClick = (id) => {
    navigate(`/blogs/${id}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.trim())
  );

  return (
    <>
      <Navbar />

      {/* MAIN CONTAINER for aligned content */}
      <div className="mx-12 px-4 md:px-8 mt-10">
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 mb-6">
          <h1 className="text-3xl font-bold text-white">Blogs</h1>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Blog Cards Section */}
        <div className="min-h-screen">
          {loading ? (
            <div className="text-center text-white">Loading blogs...</div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center text-gray-400 text-lg">
              No matching blogs found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBlogs.map((blog, idx) => {
                const Icon = icons[idx % icons.length];
                return (
                  <div
                    key={blog.id}
                    onClick={() => handleClick(blog.id)}
                    className="cursor-pointer transition-transform duration-300"
                  >
                    <BlogCard title={blog.title} progress={blog.progress} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPage;
