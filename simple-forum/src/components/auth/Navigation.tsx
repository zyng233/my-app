import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import { useAuth } from "../auth/Auth_status";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

const Spacer: React.FC = () => <div style={{ flexGrow: 1 }} />;
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

const Navigation: React.FC = () => {
  const [value, setValue] = useState(0);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case "/profile":
        setValue(0);
        break;
      case "/discussion_threads":
        setValue(1);
        break;
      case "/create-thread":
        setValue(2);
        break;
      case "/category":
        setValue(3);
        break;
      default:
        setValue(1);
    }
  }, [location.pathname]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <ThemeProvider theme={darkTheme}>
        <AppBar position="static">
          <Toolbar>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="inherit"
              variant="fullWidth"
            >
              <Tab icon={<AccountCircle />} component={Link} to="profile" />
              <Tab label="Threads" component={Link} to="/discussion_threads" />
              <Tab label="Create" component={Link} to="/create-thread" />
              <Tab label="Category" component={Link} to="/category" />
            </Tabs>
            <Spacer />
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={logout}>
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Stack>
  );
};
export default Navigation;
