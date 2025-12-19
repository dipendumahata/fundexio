import axios from 'axios';
import toast from 'react-hot-toast';

// এনভায়রনমেন্ট ভেরিয়েবল থেকে বেস URL নেওয়া
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // কুকি (RefreshToken) পাঠানোর জন্য জরুরি
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Request Interceptor: টোকেন অ্যাড করা
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Response Interceptor: এরর হ্যান্ডলিং
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    
    // 401 হলে লগআউট করানো (ফিউচারে রিফ্রেশ টোকেন লজিক এখানে বসবে)
    if (error.response?.status === 401) {
      // localStorage.removeItem("accessToken");
      // window.location.href = "/login";
    }

    toast.error(message); // গ্লোবাল টোস্ট নোটিফিকেশন
    return Promise.reject(error);
  }
);

export default apiClient;
