import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import axiosInstance from "./axiosConfig";
import HomePage from "./components/auth/Homepage";
import LoginPage from "./components/auth/Login";
import SignupPage from "./components/auth/Signup";
import ThreadsList from "./components/thread/ThreadList";
import ThreadForm from "./components/thread/ThreadForm";
import Navigation from "./components/auth/Navigation";
import { AuthProvider } from "./components/auth/Auth_status";
import { checkTokenExpiration } from "./components/auth/TokenUtil";

const App: React.FC = () => {
  const [threads, setThreads] = useState<
    {
      id: number;
      title: string;
      content: string;
      tags: { id: number; name: string }[];
    }[]
  >([]);

  const isAuthenticated = localStorage.getItem("token") !== null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const threadsResponse = await axiosInstance.get("/discussion_threads", {
          withCredentials: true,
        });
        setThreads(threadsResponse.data);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access
          console.error("Unauthorized access.");
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []); // Run once on component mount

  const handleThreadSubmit = async (data: {
    title: string;
    content: string;
    tagIds: number[];
  }) => {
    try {
      // Send data to API for creating a thread
      await axiosInstance.post("/discussion_threads", data, {
        withCredentials: true,
      });
      // Refresh the threads list
      const threadsResponse = await axiosInstance.get("/discussion_threads");
      setThreads(threadsResponse.data);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <div>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          {isAuthenticated && <Navigation />}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/discussion_threads" element={<ThreadsList />} />
            <Route
              path="/create-thread"
              element={<ThreadForm onSubmit={handleThreadSubmit} />}
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
