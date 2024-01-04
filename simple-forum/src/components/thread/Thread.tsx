import React from "react";

interface ThreadProps {
  thread: {
    id: number;
    title: string;
    content: string;
    tags: { id: number; name: string }[];
  };
}

const Thread: React.FC<ThreadProps> = ({ thread }) => (
  <div>
    <h2>{thread.title}</h2>
    <p>{thread.content}</p>
    <div>
      Tags:{" "}
      {thread.tags.map((tag) => (
        <span key={tag.id}>{tag.name}, </span>
      ))}
    </div>
  </div>
);

export default Thread;
