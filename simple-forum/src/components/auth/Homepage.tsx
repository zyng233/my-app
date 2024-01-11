import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const videoStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: -1,
};

const HomePage: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      position: "relative",
    }}
  >
    <video autoPlay muted loop style={videoStyle}>
      <source
        src="https://www.pexels.com/zh-cn/video/19022224/download/"
        type="video/mp4"
      />
    </video>

    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        color: "black",
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: "bold" }} gutterBottom>
        Welcome to Simple Web Forum
      </Typography>

      <Button
        size="large"
        variant="contained"
        component={Link}
        to="/login"
        style={{
          fontWeight: "bold",
          marginRight: "20px",
          color: "white",
          backgroundColor: "black",
        }}
      >
        Login
      </Button>
      <Button
        size="large"
        variant="contained"
        component={Link}
        to="/signup"
        style={{
          fontWeight: "bold",
          color: "white",
          backgroundColor: "black",
        }}
      >
        Signup
      </Button>
    </Box>
  </Box>
);

export default HomePage;
