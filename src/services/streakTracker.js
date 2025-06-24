// src/services/streakTracker.js

export async function fetchStreakData(username) {
  try {
    // const { data } = await axios.get(`/api/users/${username}/streak`);
    // return data;

    // Mock response
    return {
      current: 0,
      longest: 0,
      lastActive: "Pending"
    };
  } catch (err) {
    console.error("fetchStreakData failed", err);
    return null;
  }
}
