import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { FaSearch } from "react-icons/fa";
import Navbar from "../components/Navbar";
import BlogCard from "../components/BlogCard";
import Footer from "../components/Footer";

import { getAllBlogs, getCompletedBlogs } from "../services/blogService";

const categories = ["All", "Fundamental", "Technical", "Aptitude"];

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const isLoggedIn = Boolean(username);

    const fetchBlogs = async () => {
      try {
        const { data: allBlogs } = await getAllBlogs();

        if (isLoggedIn) {
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

  // Filter logic
  useEffect(() => {
    let filtered = [...blogs];

    if (statusFilter === "Done") {
      filtered = filtered.filter((b) => b.progress === 100);
    } else if (statusFilter === "Pending") {
      filtered = filtered.filter((b) => b.progress !== 100);
    }

    if (categoryFilter !== "All") {
      filtered = filtered.filter(
        (b) =>
          b.category &&
          b.category.toLowerCase().trim() ===
            categoryFilter.toLowerCase().trim()
      );
    }

    const term = searchTerm.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter((b) => b.title.toLowerCase().includes(term));
    }

    setFilteredBlogs(filtered);
  }, [searchTerm, blogs, statusFilter, categoryFilter]);

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleInputChange = (e) => handleSearch(e.target.value);

  const handleCardClick = (id) => navigate(`/blogs/${id}`);

  return (
    <>
      <Navbar />

      <main className="bg-black text-white min-h-screen w-full">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 flex-wrap">
            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
              {["All", "Done", "Pending"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-md  text-sm ${
                    statusFilter === status
                      ? "bg-blue-600 text-white"
                      : "bg-[#1A1A1A] border-[#333] text-gray-300 hover:bg-[#2C2C2C]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search blogs..."
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] text-white border border-[#2C2C2C] rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 ease-in-out shadow-sm"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="w-full sm:w-64 mb-8">
            <label className="block mb-2 text-sm text-gray-400 font-medium">
              Category
            </label>
            <Listbox value={categoryFilter} onChange={setCategoryFilter}>
              <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-[#1A1A1A] py-2 pl-4 pr-10 text-left border border-[#2C2C2C] text-white text-sm shadow-sm focus:outline-none">
                  {categoryFilter}
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[#1A1A1A] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-[#2C2C2C]">
                  {categories.map((cat) => (
                    <Listbox.Option
                      key={cat}
                      value={cat}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? "bg-orange-600 text-white" : "text-gray-200"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {cat}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-2 flex items-center pl-1 text-white">
                              <CheckIcon className="h-4 w-4" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Blog Cards */}
          {loading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl p-4 min-h-[220px]"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 [grid-auto-rows:1fr]">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="cursor-pointer h-full border border-[#2C2C2C] rounded-xl "
                  onClick={() => handleCardClick(blog.id)}
                >
                  <BlogCard title={blog.title} progress={blog.progress} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default BlogPage;
