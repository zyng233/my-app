import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import axiosInstance from "../../axiosConfig";
import EditedThreadData from "./edittype";

interface EditThreadProps {
  existingThread: EditedThreadData;
  onClose: () => void;
  editedTags: { name: string }[];
}

const EditThread: React.FC<EditThreadProps> = ({
  existingThread,
  onClose,
  editedTags: initialEditedTags,
}) => {
  const [editedTitle, setEditedTitle] = useState(existingThread?.title || "");
  const [editedContent, setEditedContent] = useState(
    existingThread?.content || ""
  );
  const [editedTags, setEditedTags] = useState(initialEditedTags || []);
  const [editedTagInput, setEditedTagInput] = useState("");
  const [isDuplicateTag, setIsDuplicateTag] = useState<boolean>(false);

  useEffect(() => {
    console.log("Initial Edited Tags:", initialEditedTags);
    if (initialEditedTags) {
      setEditedTags(initialEditedTags);
    }
  }, [initialEditedTags]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!existingThread || !existingThread.id) {
        console.error("Existing thread or its ID is undefined.");
        return;
      }

      const editedData = {
        title: editedTitle,
        content: editedContent,
        tag_names: editedTags.map((tag) => tag.name),
      };

      const response = await axiosInstance.put(
        `/discussion_threads/${existingThread.id}`,
        editedData,
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.tag_names) {
        setEditedTags(
          response.data.tag_names.map((name: string) => ({ name }))
        );
      } else {
        console.error("Unexpected response structure:", response.data);
      }
      onClose();
    } catch (error) {
      console.error("Error updating thread:", error);
    }
  };

  const handleAddTag = () => {
    console.log("Adding tag");
    if (editedTagInput.trim() !== "") {
      const trimmedTag = { name: editedTagInput.trim() };
      if (editedTags.some((tag) => tag.name === trimmedTag.name)) {
        setIsDuplicateTag(true);
        return;
      }
      setEditedTags((prevTags) => {
        console.log("Before setEditedTags:", prevTags);
        const updatedTags = [...prevTags, trimmedTag];
        console.log("After setEditedTags:", updatedTags);
        return updatedTags;
      });
      setEditedTagInput("");
      setIsDuplicateTag(false);
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
          minWidth: "70vw",
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
              sx={{ marginLeft: 1, marginTop: 1 }}
            >
              Add
            </Button>
          </div>

          {editedTags.length > 0 && (
            <div style={{ marginTop: 2 }}>
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

          {isDuplicateTag && (
            <Stack sx={{ width: "70%" }} spacing={2}>
              <Alert
                severity="warning"
                onClose={() => setIsDuplicateTag(false)}
              >
                Duplicate tag! Please enter a different tag.{" "}
              </Alert>
            </Stack>
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
