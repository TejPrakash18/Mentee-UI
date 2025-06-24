import api from './api';  // yahan relative path sahi dena

export const getAllProjects = () => api.get('/projects');

export const getCompletedProjects = (username) =>
  api.get(`/projects/completed?username=${username}`);

export const getProjectById = (id) => api.get(`/projects/filter?id=${id}`);

export const markProjectComplete = (username, title) =>
  api.post(`/projects/complete?username=${username}&title=${encodeURIComponent(title)}`);
