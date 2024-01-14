import React from "react";
import { Grid, Paper, Typography, Avatar, Divider } from "@mui/material";

interface Comment {
  id: number;
  content: string;
  username: string;
  created_at: string;
}

interface CommentProps {
  comments: Comment[];
}

const Comment: React.FC<CommentProps> = ({ comments }) => {
  //Create Date
  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  //Avatar's Color
  const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  return (
    <Paper
      style={{
        padding: "4px 2px",
      }}
    >
      {comments.map((comment, index) => (
        <React.Fragment key={comment.id}>
          <Grid container wrap="nowrap" spacing={2}>
            <Grid item>
              <Avatar
                sx={{
                  bgcolor: stringToColor(
                    comment.username.charAt(0).toUpperCase()
                  ),
                  marginTop: 1,
                  marginLeft: 1,
                }}
              >
                {comment.username.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid justifyContent="left" item xs zeroMinWidth>
              <Typography
                variant="subtitle1"
                style={{
                  textAlign: "left",
                  fontWeight: "bold",
                  marginTop: 5,
                  marginBottom: 2,
                }}
              >
                {comment.username}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                {comment.content}
              </Typography>
              <Typography
                variant="caption"
                style={{ textAlign: "left", color: "gray" }}
              >
                {formatCreatedAt(comment.created_at)}
              </Typography>
            </Grid>
          </Grid>
          {index < comments.length - 1 && (
            <Divider variant="fullWidth" style={{ margin: "2px 0" }} />
          )}
        </React.Fragment>
      ))}
    </Paper>
  );
};

export default Comment;
