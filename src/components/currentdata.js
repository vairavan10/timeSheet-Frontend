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
  const [filters, setFilters] = useState({ name: "", project: "", workDone: "" });
  const [totalRecords, setTotalRecords] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimesheets();
  }, [page, rowsPerPage, filters, localStorage.getItem("user")]); // Ensures data updates when user changes

  const fetchTimesheets = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));

      if (!loggedInUser || !loggedInUser.email) {
        console.error("No logged-in user found!");
        setTimesheetList([]); // Reset state when no user found
        return;
      }

      setTimesheetList([]); // Clear previous data before fetching new

      const response = await axios.get("http://localhost:8080/api/timesheet/getusertimesheets", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          name: filters.name || undefined,
          project: filters.project || undefined,
          workDone: filters.workDone || undefined,
          email: loggedInUser.email, // Fetch only logged-in user's data
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

  const handleFilterClick = (event, filterColumn) => {
    setAnchorEl(event.currentTarget);
    setActiveFilter(filterColumn);
  };

  const handleFilterSelect = (value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [activeFilter]: value }));
    setAnchorEl(null);
  };

  const clearFilters = () => {
    setFilters({ name: "", project: "", workDone: "" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Sidebar />
      <Typography variant="h4" align="center" gutterBottom>
        Entered Timesheet Data
      </Typography>

      {/* Filter Chips */}
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
        disabled={!filters.name && !filters.project && !filters.workDone}
      >
        Clear All Filters
      </Button>

      {/* Timesheet Table */}
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
                <strong>project</strong>
                <IconButton onClick={(e) => handleFilterClick(e, "project")}>
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
            {timesheetList.length > 0 ? (
              timesheetList.map((entry) => (
                <TableRow key={entry._id}>
<TableCell>{entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}</TableCell>
<TableCell>{typeof entry.name === "object" ? JSON.stringify(entry.name) : entry.name || "N/A"}</TableCell>
<TableCell>
  {typeof entry.project === "object" && entry.project !== null
    ? entry.project.name || "N/A"
    : entry.project || "N/A"}
</TableCell>

<TableCell>{typeof entry.workDone === "object" ? JSON.stringify(entry.workDone) : entry.workDone || "N/A"}</TableCell>
<TableCell>{entry?.hours || "N/A"}</TableCell>

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

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Filter Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {timesheetList.map((entry) => (
          <MenuItem key={entry._id} onClick={() => handleFilterSelect(entry[activeFilter])}>
          {typeof entry[activeFilter] === "object" ? JSON.stringify(entry[activeFilter]) : entry[activeFilter]}
        </MenuItem>
        
        ))}
      </Menu>

      <Button variant="contained" onClick={handleBack} sx={{ mt: 3 }}>
        Back
      </Button>
    </Container>
  );
};

export default EnteredDataPage;
