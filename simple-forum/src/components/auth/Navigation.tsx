import { Link } from "react-router-dom";
import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useAuth } from "../auth/Auth_status";

const Spacer: React.FC = () => <div style={{ flexGrow: 1 }} />;

const Navigation: React.FC = () => {
  const [value, setValue] = useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Threads" component={Link} to="/discussion_threads" />
          <Tab label="Create" component={Link} to="/create-thread" />
        </Tabs>
        <Spacer />
        <IconButton color="inherit" onClick={logout}>
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
export default Navigation;
