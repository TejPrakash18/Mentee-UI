// src/services/blogService.js
import api from './api';

export const getAllBlogs = () => api.get('/blogs');

export const getBlogById = (id) => 
  api.get(`/blogs/${id}`); // ✅ Fixed

export const getBlogsByCategory = (category) =>
  api.get(`/blogs/category?category=${encodeURIComponent(category)}`);

export const getBlogsByDifficulty = (difficulty) =>
  api.get(`/blogs/difficulty?difficulty=${encodeURIComponent(difficulty)}`);

export const markBlogComplete = (username, title) =>
  api.post(`/blogs/complete?username=${username}&title=${encodeURIComponent(title)}`);

export const getCompletedBlogs = (username) =>
  api.get(`/blogs/completed?username=${username}`);

export const getCompletedBlogsCount = async (username) => {
  try {
    const response = await api.get(`/blogs/completed/count`, {
      params: { username },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching completed blogs count:', error);
    return 0;
  }
};

export const getTotalCountOfBlogs = async () => {
  try {
    const response = await api.get(`/blogs/count`);
    return response.data;
  } catch (error) {
    console.error('Error fetching total blog count:', error);
    return 0;
  }
};

export const getBlogCountByCategory = async () => {
  try {
    const response = await api.get('/blogs/count/category');
    return response.data;
  } catch (error) {
    console.error('Error fetching blog category count:', error);
    return {};
  }
};

export const getCompletedBlogCountByCategory = async (username) => {
  try {
    const response = await api.get(`/blogs/completed/count/category`, {
      params: { username },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching completed blog count by category:', error);
    return {};
  }
};
