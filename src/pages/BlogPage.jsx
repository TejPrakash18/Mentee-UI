import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import Footer from "../components/Footer";

import { getAllBlogs, getCompletedBlogs } from "../services/blogService";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const loggedIn = Boolean(username);
    setIsLoggedIn(loggedIn);

    const fetchBlogs = async () => {
      try {
        const { data: allBlogs } = await getAllBlogs();

        if (loggedIn) {
          const { data: completedTitles } = await getCompletedBlogs(username);
          const completedSet = new Set(completedTitles);

          const blogsWithProgress = allBlogs.map((blog) => ({
            ...blog,
            progress: completedSet.has(blog.title) ? 100 : 0,
          }));

          setBlogs(blogsWithProgress);
          setFilteredBlogs(blogsWithProgress);
        } else {
          const noProgressBlogs = allBlogs.map((blog) => ({
            ...blog,
            progress: null,
          }));

          setBlogs(noProgressBlogs);
          setFilteredBlogs(noProgressBlogs);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearch = useCallback(
    debounce((value) => {
      const term = value.toLowerCase().trim();
      setSearchTerm(term);

      if (!term) {
        setFilteredBlogs(blogs);
      } else {
        setFilteredBlogs(
          blogs.filter((blog) => blog.title.toLowerCase().includes(term))
        );
      }
    }, 300),
    [blogs]
  );

  const handleInputChange = (e) => {
    handleSearch(e.target.value);
  };

  const handleCardClick = (id) => {
    navigate(`/blogs/${id}`);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-12 pt-10 pb-20 max-w-screen-2xl mx-auto">
        {/* Header + Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">
            Blogs
          </h1>

          <div className="w-full md:w-auto">
            <input
              type="text"
              aria-label="Search Blogs"
              placeholder="Search blogs..."
              onChange={handleInputChange}
              className="w-full sm:w-64 px-4 py-2 bg-[#1f1f1f] text-white border border-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out shadow-sm"
            />
          </div>
        </div>

        {/* Blog Cards Section */}
        <section className="min-h-[300px]">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-[#1a1a1a] border border-[#2b2b2b] rounded-xl p-4 h-40"
                >
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-700 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center text-gray-500 italic py-20">
              No matching blogs found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBlogs.map((blog) => (
                <button
                  key={blog.id}
                  onClick={() => handleCardClick(blog.id)}
                  className="group bg-[#121212] border border-[#2b2b2b] rounded-xl p-4 transition-transform duration-200 ease-in-out hover:shadow-xl hover:scale-[1.02] text-left"
                  aria-label={`Open blog ${blog.title}`}
                >
                  <BlogCard title={blog.title} progress={blog.progress} />
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BlogPage;
