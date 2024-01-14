import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Avatar,
} from "@mui/material";
import ThreadType from "./types";

interface ThreadCardProps {
  thread: ThreadType;
  onClick?: () => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread }) => {
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
    <CardContent style={{ position: "relative" }}>
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar
            sx={{
              bgcolor: stringToColor(thread.username.charAt(0).toUpperCase()),
              marginTop: 1,
              marginLeft: 1,
            }}
          >
            {thread.username.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="subtitle1"
            style={{
              marginLeft: 5,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {thread.username}
          </Typography>
        </Grid>
        <Grid justifyContent="left" item xs zeroMinWidth>
          <Typography variant="h5" component="div">
            {thread.title}
          </Typography>
          <Typography
            variant="caption"
            style={{ textAlign: "left", color: "gray" }}
          >
            {formatCreatedAt(thread.created_at)}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            {thread.content}
          </Typography>
          {thread.tags.length > 0 && (
            <div>
              {thread.tags.map((tag) => (
                <Chip
                  key={tag.name}
                  label={tag.name}
                  variant="outlined"
                  color="info"
                  size="small"
                  sx={{ marginRight: 1, marginBottom: 1, marginTop: 2 }}
                />
              ))}
            </div>
          )}
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ThreadCard;
