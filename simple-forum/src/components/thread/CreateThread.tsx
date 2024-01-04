import React, { useState } from "react";
import axiosInstance from "../../axiosConfig";

const CreateThreadForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/discussion_threads",
        {
          title,
          content,
        },
        { withCredentials: true }
      );

      console.log("Thread created:", response.data);
      // Add logic to handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error creating thread:", error);
      // Add logic to handle error (e.g., show an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Content:</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />

      <button type="submit">Create Thread</button>
    </form>
  );
};

export default CreateThreadForm;
