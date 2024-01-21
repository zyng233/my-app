import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axiosInstance from "../../axiosConfig";

interface EditCommentProps {
  threadId: number;
  commentId: number;
  content: string;
  onEdit: (editedContent: string, commentId: number) => void;
  onClose: () => void;
}

const EditComment: React.FC<EditCommentProps> = ({
  threadId,
  commentId,
  content,
  onEdit,
  onClose,
}) => {
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.put(
        `/discussion_threads/${threadId}/comments/${commentId}`,
        { content: editedContent },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onEdit(editedContent, commentId);
      onClose();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: "70vw",
        }}
      >
        <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
          Edit Comment
        </Typography>
        <TextField
          required
          id="edited-content"
          label="Content"
          variant="outlined"
          multiline
          rows={4}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <Button type="button" onClick={handleEdit} variant="contained">
          Save Changes
        </Button>
        <Button
          type="button"
          onClick={onClose}
          variant="outlined"
          sx={{ marginLeft: 1 }}
        >
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default EditComment;
