import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://sems-vite-1.onrender.com/api',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'multipart/form-data',
  },
});

export default axiosInstance;