import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosConfig";

interface Comment {
  id: number;
  content: string;
  // Add any other comment properties as needed
}

interface CommentProps {
  threadId: number;
}

const Comment: React.FC<CommentProps> = ({ threadId }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(
          `/discussion_threads/${threadId}/comments`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [threadId]);

  // Implement CRUD functions for comments as needed

  return (
    <div>
      {/* Display comments and provide CRUD functionality */}
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          {/* Add any other comment details to display */}
        </div>
      ))}
    </div>
  );
};

export default Comment;
