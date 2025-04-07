// Layout.js
import React, { useState } from "react";
import SideMenu from "./sidebar"; // or wherever your SideMenu is
import { Box } from "@mui/material";

const drawerWidth = 100;
const collapsedDrawerWidth = 70;

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu open={isSidebarOpen} setOpen={setIsSidebarOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin 0.3s ease",
          marginLeft: isSidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`,
          padding:0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
