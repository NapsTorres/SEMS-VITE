import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ncf-sems.onrender.com/api',  // Make sure this matches your API URL
  headers: {
    'X-Requested-With': 'XMLHttpRequest',  // For CORS requests
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,  // Ensure cookies are included in the requests
});

export default axiosInstance;
