import api from './api';

const sendChat = async (messages) => {
  try {
    const response = await api.post('/ai/chat', { messages });
    return response.data;
  } catch (error) {
    console.error('AI chat error:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  sendChat,
};