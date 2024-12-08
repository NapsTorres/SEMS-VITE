import axios from 'axios';

const axiosInstance = axios.create({
<<<<<<< HEAD
  baseURL: 'http://localhost:3006/api',
=======
  baseURL: 'https://ncf-sems.onrender.com/api',  // Make sure this matches your API URL
>>>>>>> c704a0c906f2cfecdfc97607733d1b86631bd983
  headers: {
    'X-Requested-With': 'XMLHttpRequest',  // For CORS requests
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,  // Ensure cookies are included in the requests
});

export default axiosInstance;
