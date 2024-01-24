import React from "react";
import { CardContent, Typography, Chip, Grid, Avatar } from "@mui/material";
import ThreadType from "./types";

interface ThreadCardProps {
  thread: ThreadType;
  editedTags?: { name: string }[];
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, editedTags }) => {
  const allTags = [
    ...thread.tags,
    ...(Array.isArray(editedTags) ? editedTags : []),
  ];
  //Create Date
  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  //Avatar's Color from MUI
  function stringAvatar(name: string) {
    const colors = ["red", "blue", "green", "yellow", "purple"];
    const firstChar = name.charAt(0).toUpperCase();
    const colorIndex = firstChar.charCodeAt(0) % colors.length;

    return {
      sx: {
        bgcolor: colors[colorIndex],
        marginTop: 1,
        marginLeft: 1,
      },
      children: firstChar,
    };
  }
  return (
    <CardContent style={{ position: "relative" }}>
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar {...stringAvatar(thread.username)}>
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
              {allTags.map((tag) => (
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
