import React, { useState, useContext } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  IconButton,
  Divider,
  Typography,
  Tooltip,
  Fade,
  useTheme,
  Switch
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { SupervisorAccount } from "@mui/icons-material";

import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const drawerWidth = 240;
const collapsedDrawerWidth = 70;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Input Sheet", icon: <AssignmentIcon />, path: "/inputsheet" },
  { text: "Employees", icon: <PeopleIcon />, path: "/Employees" },
  { text: "Table", icon: <PeopleIcon />, path: "/fulltable" },
  { text: "Projects", icon: <AssignmentIcon />, path: "/projects" },
  { text: "Profile", icon: <SupervisorAccount />, path: "/profile" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  { text: "ProfileView", icon: <SupervisorAccount />, path: "/Profileview" }
];

const SideMenu = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const normalizedRole = (userData.role || "").toLowerCase();

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.text === "Profile") {
      return normalizedRole === "employee";
    }
    if (["Employees", "Table", "Projects"].includes(item.text)) {
      return ["ceo", "manager", "hr"].includes(normalizedRole);
    }
    if (item.text === "ProfileView") {
      return normalizedRole === "manager";
    }
    return true;
  });

  const toggleDrawer = () => setOpen((prev) => !prev);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <Drawer
      sx={{
        width: open ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedDrawerWidth,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard
          }),
          overflowX: "hidden",
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.default,
          paddingTop: "10px"
        }
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
          alignItems: "center",
          px: 1
        }}
      >
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      <Divider />

      <Box sx={{ overflow: "auto" }}>
        <List>
          {filteredMenuItems.map((item) => (
            <Tooltip title={!open ? item.text : ""} placement="right" key={item.text}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? theme.palette.primary.main : "inherit",
                  fontWeight: isActive ? "bold" : "normal"
                })}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "inherit"
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <Fade in={open}>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        visibility: open ? "visible" : "hidden",
                        transition: "visibility 0.3s ease"
                      }}
                    />
                  </Fade>
                </ListItemButton>
              </NavLink>
            </Tooltip>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: "auto", p: open ? 2 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Tooltip title="Toggle Theme">
          <IconButton onClick={toggleTheme} color="inherit">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
        {open && (
          <Switch
            checked={darkMode}
            onChange={toggleTheme}
            color="primary"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      <Box sx={{ mt: 1, display: "flex", justifyContent: "center", paddingBottom: "10px" }}>
        <Typography variant="caption" color="textSecondary">
          © Vairavan | Ⓣ RK | Ⓢ Janani
          {/* © Vairavan */}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SideMenu;
