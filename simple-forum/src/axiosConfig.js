import axios from "axios";

const token = localStorage.getItem("token");
console.log("Token in localStorage:", token);

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, //"http://localhost:3001/api", // Rails backend URL
  withCredentials: true,
  timeout: 5000, // Timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// include the authentication token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Adding token to headers:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login or handle unauthorized access
      console.error("Unauthorized access.");
      //window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
