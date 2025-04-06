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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeTable = () => {
  const [timesheetList, setTimesheetList] = useState([]);
  const [filteredTimesheetList, setFilteredTimesheetList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    name: "",
    project: "",
    workDone: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState("");

  const navigate = useNavigate();

  const fetchTimesheets = async (pageNumber = 0, pageSize = 5) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/timesheet/getalltimesheets`,
        {
          params: {
            page: pageNumber + 1,
            limit: pageSize,
          },
        }
      );
      setTimesheetList(response.data.data);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    }
  };

  useEffect(() => {
    fetchTimesheets(page, rowsPerPage);
  }, [page, rowsPerPage]);

  useEffect(() => {
    setFilteredTimesheetList(
      timesheetList.filter((entry) => {
        return (
          entry.name.toLowerCase().includes(filters.name.toLowerCase()) &&
          (entry.project?.name || "")
            .toLowerCase()
            .includes(filters.project.toLowerCase()) &&
          entry.workDone.toLowerCase().includes(filters.workDone.toLowerCase())
        );
      })
    );
  }, [filters, timesheetList]);

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
    setFilters({
      ...filters,
      [activeFilter]: value,
    });
    setAnchorEl(null);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      project: "",
      workDone: "",
    });
  };

  const getUniqueColumnValues = (column) => {
    const uniqueValues = [
      ...new Set(
        timesheetList.map((entry) =>
          column === "project" ? entry.project?.name || "--" : entry[column]
        )
      ),
    ];
    return uniqueValues;
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Box sx={{ width: "240px", bgcolor: "#f5f5f5", boxShadow: 1 }}>
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Timesheet Records
        </Typography>

        {/* Active Filters */}
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          {filters.name && (
            <Chip
              label={`Name: ${filters.name}`}
              onDelete={() => setFilters({ ...filters, name: "" })}
              color="primary"
            />
          )}
          {filters.project && (
            <Chip
              label={`Project: ${filters.project}`}
              onDelete={() => setFilters({ ...filters, project: "" })}
              color="primary"
            />
          )}
          {filters.workDone && (
            <Chip
              label={`Work Done: ${filters.workDone}`}
              onDelete={() => setFilters({ ...filters, workDone: "" })}
              color="primary"
            />
          )}
        </Box>

        <Button
          variant="outlined"
          color="secondary"
          onClick={clearFilters}
          sx={{ mb: 3 }}
        >
          Clear All Filters
        </Button>

        {/* Table Section */}
        <TableContainer component={Paper}>
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
                  <strong>Project</strong>
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
  {filteredTimesheetList.length > 0 ? (
    filteredTimesheetList
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((entry) => (
        <TableRow key={entry._id}>
          <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
          <TableCell>{entry.name}</TableCell>
          <TableCell>{entry.project?.name || "--"}</TableCell>
          <TableCell>{entry.workDone}</TableCell>
          <TableCell>
  {entry.displayHours}
</TableCell>

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

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {getUniqueColumnValues(activeFilter).map((value) => (
            <MenuItem key={value} onClick={() => handleFilterSelect(value)}>
              {value}
            </MenuItem>
          ))}
        </Menu>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTimesheetList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Button variant="contained" onClick={handleBack} sx={{ mt: 3 }}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeTable;
