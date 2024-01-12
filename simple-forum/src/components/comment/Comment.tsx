import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

interface Comment {
  id: number;
  content: string;
  username: string;
  created_at: string;
}

interface CommentProps {
  comments: Comment[];
  containerStyle?: React.CSSProperties;
}

const Comment: React.FC<CommentProps> = ({ comments, containerStyle }) => {
  console.log("Render Comments:", comments);

  return (
    <Grid container spacing={0} style={containerStyle}>
      {comments.map((comment) => (
        <Grid item key={comment.id} xs={12}>
          <Paper elevation={3} style={{ padding: "5px" }}>
            <Typography variant="body1">{`${comment.username}: ${comment.content}`}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Comment;
