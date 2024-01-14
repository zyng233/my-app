import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import axiosInstance from "../../axiosConfig";
import EditedThreadData from "./edittype";

interface EditThreadProps {
  existingThread: EditedThreadData;
  onClose: () => void;
  onSave: (editedData: EditedThreadData) => void;
}

const EditThread: React.FC<EditThreadProps> = ({
  existingThread,
  onClose,
  onSave,
}) => {
  const [editedTitle, setEditedTitle] = useState(existingThread?.title || "");
  const [editedContent, setEditedContent] = useState(
    existingThread?.content || ""
  );
  const [editedTags, setEditedTags] = useState(existingThread?.tags || []);
  const [editedTagInput, setEditedTagInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!existingThread || !existingThread.id) {
        console.error("Existing thread or its ID is undefined.");
        return;
      }

      const editedData: EditedThreadData = {
        title: editedTitle,
        content: editedContent,
        tags: editedTags,
      };

      const response = await axiosInstance.put(
        `/discussion_threads/${existingThread.id}`,
        editedData,
        {
          withCredentials: true,
        }
      );
      console.log("Thread updated successfully:", response.data);
      onSave(editedData);
      onClose();
    } catch (error) {
      console.error("Error updating thread:", error);
    }
  };

  const handleAddTag = () => {
    if (editedTagInput.trim() !== "") {
      const trimmedTag = { name: editedTagInput.trim() };
      setEditedTags((prevTags) => [...prevTags, trimmedTag]);
      setEditedTagInput("");
    }
  };

  const handleDeleteTag = (indexToDelete: number) => {
    setEditedTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleModalClose = () => {
    onClose();
  };

  return (
    <Modal open onClose={handleModalClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: 400,
        }}
      >
        <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
          Edit Thread
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            required
            id="edited-title"
            label="Title"
            variant="outlined"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
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
          <div>
            <TextField
              id="edited-tags"
              label="Tags"
              variant="outlined"
              value={editedTagInput}
              onChange={(e) => setEditedTagInput(e.target.value)}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="contained"
              sx={{ marginLeft: 1 }}
            >
              Add
            </Button>
          </div>
          {editedTags.length > 0 && (
            <div style={{ marginTop: 1 }}>
              {editedTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={typeof tag === "object" ? tag.name : tag}
                  onDelete={() => handleDeleteTag(index)}
                  sx={{ margin: 0.5 }}
                />
              ))}
            </div>
          )}
          <Button
            type="submit"
            variant="contained"
            sx={{ marginTop: 2, marginRight: 1 }}
          >
            Save Changes
          </Button>
          <Button
            type="button"
            onClick={handleModalClose}
            variant="outlined"
            sx={{ marginTop: 2 }}
          >
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditThread;
