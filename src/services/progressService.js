import api from './api';

export const fetchCompletedProjectsCount = async (username) => {
    const response = await api.get(`/projects/completed/count`, {
        params: { username }
    });
    return response.data;
};

export const fetchDSACompletedCountByDifficulty = async (username) => {
    const response = await api.get(`/dsa/completed/count/difficulty`, {
        params: { username }
    });
    return response.data;
};
