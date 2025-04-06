import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Container,
  Typography,
  TablePagination,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Chip,
  Box,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EnteredDataPage = () => {
  const [timesheetList, setTimesheetList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState({ name: "", project: "", workDone: "", leave: "", extraActivity: "", description: "" });
  const [totalRecords, setTotalRecords] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimesheets();
  }, [page, rowsPerPage, filters]);

  const fetchTimesheets = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));

      if (!loggedInUser || !loggedInUser.email) {
        console.error("No logged-in user found!");
        setTimesheetList([]);
        return;
      }

      setTimesheetList([]);

      const response = await axios.get("http://localhost:8080/api/timesheet/getusertimesheets", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          name: filters.name || undefined,
          project: filters.project || undefined,
          workDone: filters.workDone || undefined,
          leave: filters.leave || undefined,  
          extraActivity: filters.extraActivity || undefined,
          description: filters.description || undefined, // Added description filter
          email: loggedInUser.email,
        },
      });

      setTimesheetList(response.data.data);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleFilterClick = (e, field) => {
    e.preventDefault();
    setActiveFilter(field);
    setAnchorEl(e.currentTarget);
  };

  const handleFilterSelect = (value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [activeFilter]: value }));
    setAnchorEl(null);
  };

  const handleFilterValues = () => {
    const filterValues = [];
  
    timesheetList.forEach((entry) => {
      if (activeFilter === "description") {
        // Filter by 'Leave' type
        if (entry.typeOfWork === "Leave") filterValues.push("Leave");
  
        // Filter by 'Extra Activity' type
        if (entry.typeOfWork === "Extra Activity") filterValues.push("Extra Activity");
  
        // Filter by 'Regular Work' type
        if (entry.typeOfWork === "Regular Work") filterValues.push("Regular Work");
  
        // Filter by 'project' (only for 'Regular Work')
        if (entry.typeOfWork === "Regular Work" && entry.project && entry.project.name) {
          filterValues.push(entry.project.name);
        }
  
        // Filter by 'leave' (only for 'Leave' type)
        if (entry.typeOfWork === "Leave" && entry.leaveType) {
          filterValues.push(entry.leaveType); // Half Day or Full Day
        }
  
        // Filter by 'extraActivity' (only for 'Extra Activity' type)
        if (entry.typeOfWork === "Extra Activity" && entry.extraActivity) {
          filterValues.push(entry.extraActivity);
        }
      }
  
      // For other filters like 'name', 'workDone', etc. (if needed)
      if (activeFilter === "name" && entry.name) {
        filterValues.push(entry.name);
      }
  
      if (activeFilter === "workDone" && entry.workDone) {
        filterValues.push(entry.workDone);
      }
    });
  
    // Return unique filter values to avoid duplicates
    return [...new Set(filterValues)];
  };
  

  // Function to filter timesheetList based on selected filters
  const filterTimesheetList = () => {
    return timesheetList.filter((entry) => {
      if (filters.name && entry.name !== filters.name) return false;
      if (filters.project && entry.project?.name !== filters.project) return false;
      if (filters.workDone && entry.workDone !== filters.workDone) return false;
      if (filters.leave && entry.isLeave !== true) return false;
      if (filters.extraActivity && entry.typeOfWork !== "Extra Activity") return false;
      if (filters.description && entry.typeOfWork !== filters.description) return false;

      return true;
    });
  };

  const clearFilters = () => {
    setFilters({ name: "", project: "", workDone: "", leave: "", extraActivity: "", description: "" });
  };

  const filteredTimesheetList = filterTimesheetList();

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Entered Timesheet Data
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {Object.entries(filters).map(
          ([key, value]) =>
            value && (
              <Chip
                key={key}
                label={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
                onDelete={() => setFilters({ ...filters, [key]: "" })}
                color="primary"
              />
            )
        )}
      </Box>

      <Button
        variant="outlined"
        color="secondary"
        onClick={clearFilters}
        sx={{ mb: 3 }}
        disabled={!filters.name && !filters.project && !filters.workDone && !filters.leave && !filters.extraActivity && !filters.description}
      >
        Clear All Filters
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell>
                <strong>Name</strong>
                <IconButton onClick={(e) => handleFilterClick(e, "name")}>
                  <FilterAltIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <strong>Description</strong>
                <IconButton onClick={(e) => handleFilterClick(e, "description")}>
                  <FilterAltIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <strong>Work Done</strong>
                <IconButton onClick={(e) => handleFilterClick(e, "workDone")}>
                  <FilterAltIcon />
                </IconButton>
              </TableCell>
              <TableCell><strong>Hours Worked</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTimesheetList.length > 0 ? (
              filteredTimesheetList.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{entry.date ? new Date(entry.date).toLocaleDateString() : "--"}</TableCell>
                  <TableCell>{entry.name || "--"}</TableCell>
                  <TableCell>
                    {entry.isLeave
                      ? entry.leaveType || "Leave"
                      : entry.typeOfWork === "Extra Activity"
                      ? entry.extraActivity || "Extra Activity"
                      : entry.typeOfWork === "Regular Work"
                      ? entry.project?.name || "Project"
                      : entry.workDone || "--"}
                  </TableCell>
                  <TableCell>{entry.workDone || "--"}</TableCell>
                  <TableCell>{entry.hours || "--"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No timesheet records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalRecords}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 20]}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {handleFilterValues().map((value, index) => (
          <MenuItem key={index} onClick={() => handleFilterSelect(value)}>
            {value}
          </MenuItem>
        ))}
      </Menu>
    </Container>
  );
};

export default EnteredDataPage;
