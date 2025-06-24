  import api from './api'; // your axios instance

  import {jwtDecode}  from "jwt-decode"; // make sure this is correctly imported

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password }, { withCredentials: true });

      if (response.data) {
        const { token } = response.data;
        localStorage.setItem('token', token);

        const decoded = jwtDecode(token);
        const extractedUsername = decoded.sub; // Use 'sub' as your username
        localStorage.setItem('username', extractedUsername);
        console.log("Username from token:", extractedUsername);

        return response.data;
      }
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };



  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error("Register error", error);
      throw error;
    }
  };

  const getAvatar = async (username) => {
    const response = await api.get(`/user/avatar?username=${username}`);
    return response.data.avatarUrl;
  };

  export const forgotPassword = async (email, newPassword) => {
    const response = await api.post('/auth/forgot-password', {
      email,
      newPassword,
    });
    return response.data;
  };


  export default {
    login,
    register,
    getAvatar,
  };
