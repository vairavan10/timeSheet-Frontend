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
// Make sure these imports are added at the top
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import TableViewRoundedIcon from "@mui/icons-material/TableViewRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import PersonPinCircleRoundedIcon from "@mui/icons-material/PersonPinCircleRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import PreviewRoundedIcon from "@mui/icons-material/PreviewRounded";
import SportsEsportsRoundedIcon from "@mui/icons-material/SportsEsportsRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { SummarizeOutlined, SupervisorAccount } from "@mui/icons-material";
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';

import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { BsActivity } from "react-icons/bs";

const drawerWidth = 220;
const collapsedDrawerWidth = 72;

const menuItems = [
  { text: "Dashboard", icon: <SpaceDashboardRoundedIcon />, path: "/dashboard" },
  { text: "Input Sheet", icon: <NoteAddRoundedIcon />, path: "/inputsheet" },
  { text: "TaskTimer", icon: <TimerRoundedIcon />, path: "/tasktimer" },
  { text: "Employees", icon: <Groups2RoundedIcon />, path: "/Employees" },
  { text: "Table", icon: <TableViewRoundedIcon />, path: "/fulltable" },
  { text: "Projects", icon: <WorkHistoryRoundedIcon />, path: "/projects" },
  { text: "Profile", icon: <PersonPinCircleRoundedIcon />, path: "/profile" },
  { text: "Settings", icon: <ManageAccountsRoundedIcon />, path: "/settings" },
  { text: "ProfileView", icon: <PreviewRoundedIcon />, path: "/Profileview" },
  { text: "ExtraActivity", icon: <SportsEsportsRoundedIcon />, path: "/extraActivity" },
  { text: "EmployeeLog", icon: <AutoStoriesRoundedIcon />, path: "/employeeSumarry" }
];

const SideMenu = ({ open, setOpen }) => {
  const theme = useTheme();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const userData = JSON.parse(localStorage.getItem("user")) || {};
  const normalizedRole = (userData.role || "").toLowerCase();

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.text === "Profile") return normalizedRole === "employee";
     if (item.text === "TaskTimer") return normalizedRole === "employee";
    if (["Employees", "Table", "Projects", "ExtraActivity", "EmployeeLog"].includes(item.text)) {
      return ["ceo", "manager", "hr"].includes(normalizedRole);
    }
    if (item.text === "ProfileView") return normalizedRole === "manager";
    return true;
  });

  const toggleDrawer = () => setOpen((prev) => !prev);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: open ? drawerWidth : collapsedDrawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedDrawerWidth,
          background: theme.palette.background.paper,
          borderRight: "none",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard
          }),
          overflowX: "hidden",
          boxShadow: "4px 0 10px rgba(0, 0, 0, 0.05)"
        }
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
          alignItems: "center",
          px: 1,
          mt: 1
        }}
      >
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ overflow: "hidden", px: 1 }}>
        <List>
          {filteredMenuItems.map((item) => (
            <Tooltip
              title={!open ? item.text : ""}
              placement="right"
              arrow
              key={item.text}
            >
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: isActive ? theme.palette.primary.main : theme.palette.text.primary
                })}
              >
                <ListItemButton
  sx={{
    minHeight: 48,
    justifyContent: open ? "initial" : "center",
    px: 2.5,
    borderRadius: "12px",
    mx: 1,
    my: 0.5,
    transition: "all 0.3s ease",
    "&:hover": {
      background:
        "linear-gradient(135deg, rgba(63,81,181,0.1), rgba(63,81,181,0.05))",
      boxShadow: theme.shadows[2],
      transform: "scale(1.02)"
    }
  }}
>

                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                      color: "inherit"
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <Fade in={open}>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        whiteSpace: "nowrap"
                      }}
                    />
                  </Fade>
                </ListItemButton>
              </NavLink>
            </Tooltip>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          mt: "auto",
          px: open ? 2 : 1,
          pb: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center"
        }}
      >
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

      <Box sx={{ textAlign: "center", pb: 2 }}>
        <Typography variant="caption" color="textSecondary">
          © Vairavan | Ⓣ RK | Ⓢ Janani
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SideMenu;

