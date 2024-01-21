import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../axiosConfig";
import CommentForm from "../comment/CommentForm";
import {
  Card,
  CardContent,
  Fab,
  IconButton,
  Grid,
  Alert,
  Typography,
  Button,
} from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import Comment from "../comment/Comment";
import { useParams, useNavigate } from "react-router-dom";
import ThreadType from "./types";
import ThreadCard from "./ThreadCard";
import ThreadMenu from "./ThreadMenu";
import EditThread from "./EditThread";
import { useAuth } from "../auth/Auth_status";
import "./Thread.css";

const ThreadDetails: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<ThreadType | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const { username } = useAuth();
  const [threadErrors, setThreadErrors] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [editedTags, setEditedTags] = useState<{ name: string }[]>([]);
  const navigate = useNavigate();
  const [confirmationMessage, setConfirmationMessage] = useState<string>(
    "Are you sure you want to delete this thread?"
  );

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(
        `/discussion_threads/${threadId}/comments`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    const fetchThreadDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(
          `/discussion_threads/${threadId}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setThread(response.data);
        setEditedTags(response.data.editedTags);
      } catch (error) {
        console.error("Error fetching thread details:", error);
      }
    };

    fetchThreadDetails();
    fetchComments();
  }, [threadId, isEditModalOpen, editedTags]);

  if (!thread) {
    return <div>Loading...</div>;
  }

  const handleCommentAdded = async () => {
    await fetchComments();
    setShowCommentForm(false);
  };

  const isCurrentUserAuthor = username === thread?.username;

  //Edit thread
  const handleEdit = async () => {
    try {
      if (isCurrentUserAuthor) {
        setIsEditModalOpen(true);
      } else {
        setThreadErrors(["You are not authorized to edit this thread."]);
      }
    } catch (error) {
      console.error("Error editing thread:", error);
    }
  };

  //Delete thread
  const handleDelete = async () => {
    setIsConfirmationVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (isCurrentUserAuthor) {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/discussion_threads/${threadId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setThread(null);
      setThreadErrors([]);
      navigate("/discussion_threads");
    } else {
      setConfirmationMessage("You are not authorized to delete this thread.");
    }
  };

  const handleCloseError = (index: number) => {
    const newErrors = [...threadErrors];
    newErrors.splice(index, 1);
    setThreadErrors(newErrors);
  };

  const handleCommentEdit = (editedContent: string, commentId: number) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, content: editedContent }
        : comment
    );
    setComments(updatedComments);
  };

  return (
    <div className="bg">
      <IconButton
        style={{ position: "absolute", top: 80, left: 16 }}
        component={Link}
        to="/discussion_threads"
      >
        <ArrowBackIcon />
      </IconButton>

      {isConfirmationVisible && (
        <Alert
          severity="error"
          style={{ border: "1px solid red", width: "60vw", marginTop: 20 }}
          onClose={() => setIsConfirmationVisible(false)}
        >
          <Typography variant="subtitle1">{confirmationMessage}</Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleConfirmDelete}
          >
            Yes
          </Button>
        </Alert>
      )}

      {threadErrors.length > 0 && (
        <div>
          {threadErrors.map((error, index) => (
            <Alert
              key={index}
              severity="error"
              style={{ border: "1px solid red", width: "60vw", marginTop: 20 }}
              onClose={() => handleCloseError(index)}
            >
              <Typography variant="subtitle1">{error}</Typography>
            </Alert>
          ))}
        </div>
      )}

      <Card
        sx={{
          width: "60vw",
          margin: "20px",
          position: "relative",
        }}
      >
        <CardContent>
          <Grid
            container
            wrap="nowrap"
            spacing={2}
            sx={{ position: "relative" }}
          >
            <CardContent>
              <ThreadMenu
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAuthor={isCurrentUserAuthor}
              />
              <Grid item>
                <ThreadCard thread={thread} editedTags={editedTags} />
              </Grid>

              <Grid
                sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 1 }}
              >
                <Fab
                  color="primary"
                  aria-label={showCommentForm ? "cancel" : "add"}
                  size="small"
                  onClick={() => setShowCommentForm(!showCommentForm)}
                >
                  {showCommentForm ? <CloseIcon /> : <AddCommentIcon />}
                </Fab>
              </Grid>
            </CardContent>
          </Grid>

          {showCommentForm && (
            <CardContent>
              <CommentForm
                threadId={thread.id}
                onCommentAdded={handleCommentAdded}
              />
            </CardContent>
          )}

          {comments.length > 0 && (
            <CardContent style={{ padding: 16 }}>
              <Comment
                comments={comments}
                threadId={Number(threadId)}
                onCommentEdit={handleCommentEdit}
              />
            </CardContent>
          )}
        </CardContent>
      </Card>

      {isEditModalOpen && (
        <EditThread
          onClose={() => setIsEditModalOpen(false)}
          existingThread={thread}
          editedTags={thread.tags}
        />
      )}
    </div>
  );
};

export default ThreadDetails;
