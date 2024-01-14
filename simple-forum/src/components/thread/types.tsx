interface ThreadType {
  id: number;
  title: string;
  content: string;
  tags: { name: string }[];
  username: string;
  created_at: string;
}

export default ThreadType;
