// src/services/userActivityService.js
import api from './api';

// ✅ Log daily DSA activity for the current user
export const logUserActivity = async (username) => {
  try {
    const res = await api.post(`/activity/log`, { username });  // Fixed: pass username in body
    return res.data;
  } catch (error) {
    console.error('Error logging user activity:', error);
    throw error;
  }
};

    // ✅ Fetch activity stats: current streak, longest streak, etc.
    export const getUserActivityStats = async (username) => {
    try {
        const res = await api.get(`/activity/${username}/stats`);
        return res.data;
    } catch (error) {
        console.error('Error fetching user activity stats:', error);
        throw error;
    }
    };
