import React, { useState } from "react";
import axiosInstance from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./Thread.css";

const CreateThread: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isDuplicateTag, setIsDuplicateTag] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  //Tag related function
  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      const trimmedTag = tagInput.trim();
      if (tags.includes(trimmedTag)) {
        setIsDuplicateTag(true);
        return;
      }

      setIsDuplicateTag(false);
      setTags((prevTags) => [...prevTags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (indexToDelete: number) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToDelete)
    );
  };

  //Submit thread
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Handle empty title or content
      if (!title || !content) {
        setValidationError("Title and content are required.");
        return;
      }

      const response = await axiosInstance.post(
        "/discussion_threads",
        {
          discussion_thread: {
            title,
            content,
            tag_names: tags,
          },
        },
        { withCredentials: true }
      );

      console.log("Thread created:", response.data);
      navigate("/discussion_threads");
    } catch (error) {
      console.error("Error creating thread:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="bg"
      sx={{
        justifyContent: "center",
        textAlign: "center",
        "& .MuiTextField-root": { m: 1, width: "60vw" },
      }}
      noValidate
    >
      <Typography
        variant="h2"
        sx={{ color: "white", fontWeight: "bold", marginBottom: 2 }}
      >
        Create New Thread
      </Typography>

      <div>
        <TextField
          required
          id="title"
          label="Title"
          variant="filled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <TextField
          required
          id="content"
          label="Content"
          variant="filled"
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="add-tag">
        <TextField
          required
          id="tags"
          label="Tags"
          variant="filled"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />
        <Button
          type="button"
          onClick={handleAddTag}
          variant="contained"
          sx={{
            margin: "auto",
            "&:hover": {
              backgroundColor: "darkgrey",
            },
          }}
        >
          Add
        </Button>
      </div>

      {isDuplicateTag && (
        <Stack sx={{ width: "50%", marginBottom: 1 }} spacing={2}>
          <Alert severity="warning" onClose={() => setIsDuplicateTag(false)}>
            Duplicate tag! Please enter a different tag.{" "}
          </Alert>
        </Stack>
      )}

      {validationError && (
        <Stack sx={{ width: "50%", marginBottom: 1 }} spacing={2}>
          <Alert severity="error" onClose={() => setValidationError(null)}>
            {validationError}
          </Alert>
        </Stack>
      )}

      {tags.length > 0 && (
        <div>
          <Stack direction="row" spacing={1}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                color="info"
                size="medium"
                label={tag}
                onDelete={() => handleDeleteTag(index)}
              />
            ))}
          </Stack>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        size="large"
        variant="contained"
        sx={{
          marginTop: 1,
          color: "white",
          "&:hover": {
            backgroundColor: "darkgrey",
          },
        }}
      >
        Create
      </Button>
    </Box>
  );
};

export default CreateThread;
