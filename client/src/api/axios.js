import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Pointing to your Backend Port
  withCredentials: true, // <--- CRITICAL: This sends the cookies!
});

export default api;