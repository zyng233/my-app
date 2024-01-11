import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth_status";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setErrors(null);

      await signup(username, password, matricNo);
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        const errors = Array.isArray(error.response.data.errors)
          ? error.response.data.errors
          : [error.response.data.errors];

        console.error("Signup failed:", errors);
        setErrors(errors);
      } else {
        console.error("Signup failed:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1605325/pexels-photo-1605325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <IconButton
        style={{ position: "absolute", top: 16, left: 16 }}
        component={Link}
        to="/"
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Signup
      </Typography>

      <TextField
        id="username"
        label="Username"
        variant="filled"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ marginBottom: 2, width: "50vw" }}
      />
      <TextField
        id="matricNo"
        label="Matric Number"
        variant="filled"
        value={matricNo}
        onChange={(e) => setMatricNo(e.target.value)}
        sx={{ marginBottom: 2, width: "50vw" }}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        variant="filled"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginBottom: 2, width: "50vw" }}
      />

      {errors && (
        <div>
          {errors.map((error, index) => (
            <Alert severity="error">
              <Typography key={index} variant="subtitle1">
                {error}
              </Typography>
            </Alert>
          ))}
        </div>
      )}

      <Button
        variant="contained"
        onClick={handleSignup}
        disabled={loading}
        sx={{
          marginTop: 2,
          backgroundColor: "black",
          color: "white",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "darkgrey",
          },
        }}
      >
        {loading ? "Signing up..." : "Signup"}
      </Button>
    </Box>
  );
};

export default SignupPage;
