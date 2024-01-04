import React, { useState } from "react";

interface CommentFormProps {
  onSubmit: (data: { content: string }) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ content });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Content:</label>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />

      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
