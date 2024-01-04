import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";

const ThreadList: React.FC = () => {
  const [threads, setThreads] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/discussion_threads", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response:", response.data);
        setThreads(response.data);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    fetchThreads();
  }, []);

  return (
    <div>
      <h2>Thread List</h2>
      <ul>
        {threads.map((thread) => (
          <li key={thread.id}>{thread.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadList;
