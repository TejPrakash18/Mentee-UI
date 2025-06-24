import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { getAllProjects, getCompletedProjects } from '../services/projectService';
import { GrNotes } from "react-icons/gr";
import { MdQuiz } from "react-icons/md";
import { FaPortrait, FaUserTie, FaBook } from "react-icons/fa";
import { RiMovie2Fill } from "react-icons/ri";
import Footer from "../components/Footer";

const icons = [GrNotes, MdQuiz, FaPortrait, RiMovie2Fill, FaUserTie, FaBook];

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const loggedIn = !!username;
    setIsLoggedIn(loggedIn);

    const fetchProjects = async () => {
      try {
        let allRes = await getAllProjects();
        let allProjects = allRes.data;

        if (loggedIn) {
          let completedRes = await getCompletedProjects(username);
          let completedTitles = new Set(completedRes.data);

          allProjects = allProjects.map(proj => ({
            ...proj,
            progress: completedTitles.has(proj.projectTitle) ? 100 : 0,
          }));
        } else {
          allProjects = allProjects.map(proj => ({ ...proj, progress: null }));
        }

        setProjects(allProjects);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleClick = (id) => {
    navigate(`/projects/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="p-4 sm:p-6 md:p-10 mt-10 min-h-screen">
        {loading ? (
          <div className="text-center text-white">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">No projects available right now.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((proj, idx) => {
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={proj.id}
                  onClick={() => handleClick(proj.id)}
                  className="cursor-pointer transition-transform duration-300"
                >
                  <ProjectCard
                    title={proj.projectTitle}
                    icon={Icon}
                    iconBg="bg-indigo-400"
                    progress={proj.progress}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Project;
