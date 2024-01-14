import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";
import ThreadCard from "./ThreadCard";
import { Link } from "react-router-dom";
import ThreadType from "./types";
import { Card, CardContent, Typography, Link as MuiLink } from "@mui/material";
import "./Thread.css";

const ThreadList: React.FC = () => {
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);

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

        const sortedThreads = response.data.sort(
          (a: ThreadType, b: ThreadType) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          }
        );

        setThreads(sortedThreads);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    fetchThreads();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "500vw",
        overflowY: "auto",
      }}
      className="bg"
    >
      <Typography
        variant="h2"
        sx={{
          color: "white",
          fontWeight: "bold",
          marginBottom: 2,
          marginTop: 2,
        }}
      >
        What's new today
      </Typography>
      {threads.map((thread) => (
        <Card
          sx={{
            width: "60vw",
            margin: "20px",
            position: "relative",
          }}
        >
          <MuiLink
            component={Link}
            to={`/discussion_threads/${thread.id}`}
            underline="none"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <ThreadCard
              thread={thread}
              onClick={() => setSelectedThreadId(thread.id)}
            />
          </MuiLink>
        </Card>
      ))}
    </div>
  );
};

export default ThreadList;
