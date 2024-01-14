import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import axiosInstance from "../../axiosConfig";

interface Comment {
  id: number;
  content: string;
  username: string;
}

const CommentForm: React.FC<{
  threadId: number;
  onCommentAdded: () => void;
}> = ({ threadId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [comment, setComment] = useState<Comment | null>(null);

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        `/discussion_threads/${threadId}/comments`,
        { comment: { content, discussion_thread_id: threadId } },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newComment: Comment = response.data;
      setComment(newComment);
      setContent("");
      onCommentAdded();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        marginBottom: 16,
      }}
    >
      <TextField
        id="commentContent"
        name="commentContent"
        label="Add a comment"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{
          marginRight: 1,
          width: "80vw",
        }}
      />
      <div style={{ marginTop: "auto", marginLeft: "auto" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSubmit}
        >
          Add
        </Button>
      </div>

      {comment && (
        <div>
          <Typography variant="body1">{`Comment by ${comment.username}: ${comment.content}`}</Typography>
        </div>
      )}
    </div>
  );
};

export default CommentForm;
