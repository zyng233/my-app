import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import axiosInstance from "./axiosConfig";
import HomePage from "./components/auth/Homepage";
import LoginPage from "./components/auth/Login";
import SignupPage from "./components/auth/Signup";
import Profile from "./components/auth/Profile";
import ThreadsList from "./components/thread/ThreadList";
import CreateThread from "./components/thread/CreateThread";
import Navigation from "./components/auth/Navigation";
import ThreadDetails from "./components/thread/ThreadDetails";
import Category from "./components/tag/Category";
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

  const { isAuthenticated, logout, username } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (isAuthenticated) {
        const threadsResponse = await axiosInstance.get("/discussion_threads", {
          withCredentials: true,
        });
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

  useEffect(() => {
    fetchData();
  }, [isAuthenticated, logout]);

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/discussion_threads" element={<ThreadsList />} />
        <Route
          path="/discussion_threads/:threadId"
          element={<ThreadDetails />}
        />
        <Route path="/create-thread" element={<CreateThread />} />
        <Route path="/category" element={<Category />} />
      </Routes>
    </div>
  );
};

export default App;
