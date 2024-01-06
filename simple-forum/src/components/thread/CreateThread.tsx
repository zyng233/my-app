import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import Tag from "../tag/Tag";
import "./CreateThread.css";

interface Tag {
  id: number;
  name: string;
}

const CreateThreadForm: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<number[]>([]); //store selected tags
  const [allTags, setAllTags] = useState<Tag[]>([]); //store all available tags
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all tags when the component mounts
    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get<Tag[]>("/tags");
        setAllTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (selectedTags: number[]) => {
    setTags(selectedTags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/discussion_threads",
        {
          title,
          content,
          tag_ids: tags,
        },
        { withCredentials: true }
      );

      console.log("Thread created:", response.data);
      navigate(`/discussion_threads/${response.data.id}`);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  return (
    <div className="thread">
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label htmlFor="tags">Tags:</label>
        <select
          id="tags"
          name="tags"
          multiple
          value={tags.map(String)}
          onChange={(e) =>
            handleTagChange(
              Array.from(e.target.selectedOptions, (option) =>
                Number(option.value)
              )
            )
          }
          style={{ height: "80px" }}
        >
          {allTags.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <div className="top">
          {tags.map((tagId) => (
            <Tag
              key={tagId}
              tag={
                allTags.find((tag) => tag.id === tagId) || {
                  id: -1,
                  name: "Unknown Tag",
                }
              }
            />
          ))}
        </div>

        <button type="submit" disabled={loading} className="top">
          Create Thread
        </button>
      </form>
    </div>
  );
};

export default CreateThreadForm;
