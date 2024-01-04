import React from "react";

interface CommentProps {
  comment: {
    id: number;
    content: string;
  };
}

const Comment: React.FC<CommentProps> = ({ comment }) => (
  <div>
    <p>{comment.content}</p>
  </div>
);

export default Comment;
