import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";
import CommentForm from "../comment/CommentForm";
import { Card, CardContent, Typography, Chip, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Comment from "../comment/Comment";

interface Thread {
  id: number;
  title: string;
  content: string;
  tags: { name: string }[];
  username: string;
  created_at: string;
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

        const sortedThreads = response.data.sort((a: Thread, b: Thread) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });

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
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
};

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(
        `/discussion_threads/${thread.id}/comments`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched Comments for Thread ID:", thread.id, response.data);
      setComments(
        response.data.sort((a: Comment, b: Comment) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        })
      );
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [thread.id]);

  return (
    <Card sx={{ width: "60vw", margin: "20px", position: "relative" }}>
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

        <Comment comments={comments} containerStyle={{ marginBottom: 50 }} />

        <Fab
          color="primary"
          aria-label={showCommentForm ? "cancel" : "add"}
          size="small"
          sx={{ position: "absolute", bottom: 16, right: 16, marginTop: 50 }}
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          {showCommentForm ? <ArrowBackIcon /> : <AddIcon />}
        </Fab>

        {showCommentForm && (
          <CommentForm
            threadId={thread.id}
            onCommentAdded={() => {
              setShowCommentForm(false);
              fetchComments();
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ThreadList;
