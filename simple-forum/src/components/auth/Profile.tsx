import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";
import ThreadCard from "../thread/ThreadCard";
import { Link } from "react-router-dom";
import ThreadType from "../thread/types";
import { Card, Typography, Link as MuiLink } from "@mui/material";
import { useAuth } from "./Auth_status";
import "../thread/Thread.css";

const Profile: React.FC = () => {
  const { username } = useAuth();
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [editedTags, setEditedTags] = useState<{ name: string }[]>([]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(
          "/discussion_threads/mythreads",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              username: username,
            },
          }
        );

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
  }, [username]);

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
        My Profile
      </Typography>
      {threads.map((thread) => (
        <Card
          key={username}
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
            <ThreadCard thread={thread} editedTags={editedTags} />
          </MuiLink>
        </Card>
      ))}
    </div>
  );
};

export default Profile;
