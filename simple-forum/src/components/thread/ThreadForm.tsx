import React, { useState, useEffect } from "react";
import axios from "axios";

interface ThreadFormProps {
  onSubmit: (data: {
    title: string;
    content: string;
    tagIds: number[];
  }) => void;
}

const ThreadForm: React.FC<ThreadFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/tags", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response:", response.data);
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/discussion_threads",
        {
          title,
          content,
          tag_ids: tagIds,
        },
        { withCredentials: true }
      );
      console.log("Thread created:", response.data);
      onSubmit({ title, content, tagIds });
    } catch (error) {
      console.error("Error creating thread:", error);
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

      <label>Tags:</label>
      <input
        type="text"
        placeholder="Enter tag names separated by commas"
        onChange={(e) => setTagIds(e.target.value.split(",").map(Number))}
      />
      <select
        multiple
        value={tagIds.map(String)}
        onChange={(e) =>
          setTagIds(
            Array.from(e.target.selectedOptions, (option) =>
              Number(option.value)
            )
          )
        }
      >
        {tags.map((tag) => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ThreadForm;
