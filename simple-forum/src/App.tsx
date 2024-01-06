import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import axiosInstance from "./axiosConfig";
import HomePage from "./components/auth/Homepage";
import LoginPage from "./components/auth/Login";
import SignupPage from "./components/auth/Signup";
import ThreadsList from "./components/thread/ThreadList";
import ThreadForm from "./components/thread/ThreadForm";
import Navigation from "./components/auth/Navigation";
import { useAuth } from "./components/auth/Auth_status";

const App: React.FC = () => {
  const [threads, setThreads] = useState<
    {
      id: number;
      title: string;
      content: string;
      tags: { id: number; name: string }[];
    }[]
  >([]);

  const { isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          const threadsResponse = await axiosInstance.get(
            "/discussion_threads",
            {
              withCredentials: true,
            }
          );
          setThreads(threadsResponse.data);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized access.");
        } else {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, logout]);

  const handleThreadSubmit = async (data: {
    title: string;
    content: string;
    tagIds: number[];
  }) => {
    try {
      await axiosInstance.post("/discussion_threads", data, {
        withCredentials: true,
      });
      const threadsResponse = await axiosInstance.get("/discussion_threads");
      setThreads(threadsResponse.data);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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
  );
};

export default App;
