import api from '../services/api';

export const getAllDSA = async () => {
    try {
        const response = await api.get("/dsa");
        console.log("Raw DSA API Response:", response.data);

        if (Array.isArray(response.data)) {
            return response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            console.error("Unexpected response format:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching DSA data:", error);
        return [];
    }
};

export const getTotalCountOfDSAQuestion = async () => {
  try {
    const response = await api.get('/dsa/count');
    // console.log("DSA Total Count:", response.data);
    return response.data;
  } catch (error) {
    console.error(' Error fetching total DSA question count:', error);
    return 0;
  }
};

export const getTotalCountOfDSAQuestionDifficultyWise = async () => {
  try {
    const response = await api.get('/dsa/count/difficulty');
    // console.log(" DSA Count by Difficulty:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching DSA difficulty-wise count:', error);
    return {};
  }
};


export const getQuestionById = async (id) => {
  try {
    const response = await api.get(`/dsa/question/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching question by ID:", error);
    throw error;
  }
};


// export const getDSAByCategory = (category) => api.get(`/dsa/category?category=${category}`);
// For all categories you want to display questions from:
const getQuestionsByCategory = async (category) => {
  const res = await api.get(`/category?category=${category}`);
  return res.data;  // Array of questions in this category
}


export const markDSAComplete = (username, title) => api.post(`/dsa/complete?username=${username}&title=${title}`);

export const getCompletedQuestions = async (username) => {
  try {
    const response = await api.get(`/dsa/completed?username=${username}`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching completed questions:", error);
    return [];
  }
};

export const fetchDSACompletedCountByDifficulty = async (username) => {
    const response = await api.get(`/dsa/completed/count/difficulty`, {
        params: { username }
    });
    return response.data;
};