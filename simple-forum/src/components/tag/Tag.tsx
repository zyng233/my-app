import React from "react";

interface TagProps {
  tag: {
    id: number;
    name: string;
  };
}

const Tag: React.FC<TagProps> = ({ tag }) => <span>{tag.name}</span>;

export default Tag;
