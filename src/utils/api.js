import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Basic CRUD operations
export const fetchContestants = () => axios.get(`${API_BASE}/contestants`);
export const addContestant = (data) => axios.post(`${API_BASE}/contestants`, data);

export const fetchSupervisors = () => axios.get(`${API_BASE}/supervisors`);
export const addSupervisor = (data) => axios.post(`${API_BASE}/supervisors`, data);

export const fetchCompetitions = () => axios.get(`${API_BASE}/competitions`);
export const addCompetition = (data) => axios.post(`${API_BASE}/competitions`, data);
export const batchAddContestantsToCompetition = (competitionId, contestants) =>
  axios.post(`${API_BASE}/competitions/${competitionId}/add-contestants`, { contestants });

export const fetchScores = () => axios.get(`${API_BASE}/scores`);
export const addScore = (data) => axios.post(`${API_BASE}/scores`, data);

// Export functions
export const exportData = async (entity, format) => {
  try {
    const response = await axios.get(`${API_BASE}/export/${entity}?format=${format}`, {
      responseType: 'blob'
    });
    
    const contentDisposition = response.headers['content-disposition'];
    let filename = `${entity}.${format}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create a blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

// New function to fetch dashboard data
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Basic CRUD operations
export const fetchContestants = () => axios.get(`${API_BASE}/contestants`);
export const addContestant = (data) => axios.post(`${API_BASE}/contestants`, data);

export const fetchSupervisors = () => axios.get(`${API_BASE}/supervisors`);
export const addSupervisor = (data) => axios.post(`${API_BASE}/supervisors`, data);

export const fetchCompetitions = () => axios.get(`${API_BASE}/competitions`);
export const addCompetition = (data) => axios.post(`${API_BASE}/competitions`, data);
export const batchAddContestantsToCompetition = (competitionId, contestants) =>
  axios.post(`${API_BASE}/competitions/${competitionId}/add-contestants`, { contestants });

export const fetchScores = () => axios.get(`${API_BASE}/scores`);
export const addScore = (data) => axios.post(`${API_BASE}/scores`, data);

// Export functions
export const exportData = async (entity, format) => {
  try {
    const response = await axios.get(`${API_BASE}/export/${entity}?format=${format}`, {
      responseType: 'blob'
    });
    
    const contentDisposition = response.headers['content-disposition'];
    let filename = `${entity}.${format}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create a blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

// Import functions
export const importData = async (entity, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(`${API_BASE}/import/${entity}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

export const fetchDashboardData = () => axios.get(`${API_BASE}/dashboard`);
