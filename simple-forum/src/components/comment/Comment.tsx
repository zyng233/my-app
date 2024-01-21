import React, { useState } from "react";
import axiosInstance from "../../axiosConfig";
import { useAuth } from "../auth/Auth_status";
import {
  Grid,
  Paper,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Alert,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditComment from "./EditComment";

interface Comment {
  id: number;
  content: string;
  username: string;
  created_at: string;
}

interface CommentProps {
  comments: Comment[];
  threadId: number;
  onCommentEdit: (editedContent: string, commentId: number) => void;
}

const Comment: React.FC<CommentProps> = ({
  comments,
  threadId,
  onCommentEdit,
}) => {
  const { username } = useAuth();
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);

  const handleEdit = (editedContent: string, commentId: number) => {
    console.log("Comment updated successfully:", editedContent);
    setEditCommentId(null);
    onCommentEdit(editedContent, commentId);
  };

  const handleConfirmDelete = async (commentId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/comments/${commentId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Comment deleted successfully");
      setDeleteCommentId(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  //Create Date
  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  //Avatar's Color
  const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  return (
    <Paper
      style={{
        padding: "4px 2px",
      }}
    >
      {comments.map((comment, index) => (
        <React.Fragment key={comment.id}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar
                sx={{
                  bgcolor: stringToColor(
                    comment.username.charAt(0).toUpperCase()
                  ),
                  marginTop: 1,
                  marginLeft: 1,
                }}
              >
                {comment.username.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
              <Typography
                variant="subtitle1"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: 5,
                  marginBottom: 2,
                }}
              >
                {comment.username}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                {comment.content}
              </Typography>
              <Typography
                variant="caption"
                style={{ textAlign: "left", color: "gray" }}
              >
                {formatCreatedAt(comment.created_at)}
              </Typography>
            </Grid>
            {username === comment.username && (
              <Grid item>
                <IconButton onClick={() => setEditCommentId(comment.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => setDeleteCommentId(comment.id)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>

          {index < comments.length - 1 && (
            <Divider variant="fullWidth" style={{ margin: "2px 0" }} />
          )}

          {editCommentId === comment.id && (
            <EditComment
              threadId={threadId}
              commentId={comment.id}
              content={comments.find((c) => c.id === comment.id)?.content || ""}
              onEdit={handleEdit}
              onClose={() => setEditCommentId(null)}
            />
          )}

          {deleteCommentId === comment.id && (
            <Alert
              severity="error"
              style={{ border: "1px solid red" }}
              onClose={() => setDeleteCommentId(null)}
            >
              <Typography variant="subtitle1">
                Are you sure you want to delete this comment?
              </Typography>
              <Button
                onClick={() => handleConfirmDelete(comment.id)}
                variant="outlined"
                color="error"
              >
                Yes
              </Button>
            </Alert>
          )}
        </React.Fragment>
      ))}
    </Paper>
  );
};

export default Comment;
