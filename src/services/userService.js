import api from './api'; // axios instance

const getProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error.response?.data || error.message);
    throw error;
  }
};

const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/user/update', profileData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Update profile error', error);
    throw error;
  }
};

export default {
  getProfile,
  updateProfile,
};
