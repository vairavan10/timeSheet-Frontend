import React from "react";
import { Box, Typography, Paper, Toolbar } from "@mui/material";
import EmployeeTable from "./table"; // Import the table component
import { useNavigate } from "react-router-dom";

const EmployeeTablePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Toolbar />

      <Typography variant="h4" gutterBottom>
        Employee Timesheet Overview
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <EmployeeTable />
      </Paper>
    </Box>
  );
};

export default EmployeeTablePage;
