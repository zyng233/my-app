import React from "react";

interface TagProps {
  tag: { id: number; name: string };
  onDelete: () => void;
}
const Tag: React.FC<TagProps> = ({ tag, onDelete }) => {
  return (
    <div className="tag-container">
      <span>{tag.name}</span>
      <button onClick={onDelete}>&times;</button>
    </div>
  );
};

export default Tag;
