import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import { Card, CardContent, Typography, Chip, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Thread {
  id: number;
  title: string;
  content: string;
  tags: { name: string }[];
  username: string;
}

const ThreadList: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);

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
        response.data.forEach((thread: Thread) => {
          console.log(`Thread ID ${thread.id} Tags:`, thread.tags);
        });
        setThreads(response.data);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    fetchThreads();
  }, []);

  return (
    <div
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/531767/pexels-photo-531767.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "500vw",
          overflowY: "auto",
        }}
      >
        {threads.map((thread) => (
          <Card
            key={thread.id}
            sx={{ width: "60vw", margin: "20px", position: "relative" }}
          >
            <CardContent style={{ position: "relative" }}>
              <Typography variant="h5" component="div">
                {thread.title}
              </Typography>
              <Typography color="text.secondary">{`By ${thread.username}`}</Typography>
              <Typography variant="body2" sx={{ marginTop: 2 }}>
                {thread.content}
              </Typography>
              {thread.tags.length > 0 && (
                <div>
                  {thread.tags.map((tag) => (
                    <Chip
                      key={tag.name}
                      label={tag.name}
                      variant="outlined"
                      color="info"
                      size="small"
                      sx={{ marginRight: 1, marginBottom: 1, marginTop: 2 }}
                    />
                  ))}
                </div>
              )}
              <Link
                to={`/comments/${thread.id}`}
                style={{ textDecoration: "none" }}
              ></Link>
              <Fab
                color="primary"
                aria-label="add"
                size="small"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
              >
                <AddIcon />
              </Fab>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ThreadList;
