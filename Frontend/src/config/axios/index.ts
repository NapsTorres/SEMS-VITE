import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ncf-sems.onrender.com/api',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true, // This ensures cookies are sent
});

export default axiosInstance;