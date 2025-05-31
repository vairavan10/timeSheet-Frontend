// import React, { useState, useEffect } from "react";
// import Sidebar from "./sidebar";
// import { Modal } from "@mui/material";

// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   TableContainer,
//   Paper,
//   Container,
//   Typography,
//   TablePagination,
//   Menu,
//   MenuItem,
//   IconButton,
//   Button,
//   Chip,
//   Box,
// } from "@mui/material";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const EnteredDataPage = () => {
//   const [timesheetList, setTimesheetList] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [filters, setFilters] = useState({ name: "", project: "", workDone: "", leave: "", extraActivity: "", description: "" });
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [activeFilter, setActiveFilter] = useState("");
//   const [selectedWorkDone, setSelectedWorkDone] = useState("");
// const [openModal, setOpenModal] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTimesheets();
//   }, [page, rowsPerPage, filters]);

//   const fetchTimesheets = async () => {
//     try {
//       const loggedInUser = JSON.parse(localStorage.getItem("user"));

//       if (!loggedInUser || !loggedInUser.email) {
//         console.error("No logged-in user found!");
//         setTimesheetList([]);
//         return;
//       }

//       setTimesheetList([]);

//       const response = await axios.get("api/timesheet/getusertimesheets", {
//         params: {
//           page: page + 1,
//           limit: rowsPerPage,
//           name: filters.name || undefined,
//           project: filters.project || undefined,
//           workDone: filters.workDone || undefined,
//           leave: filters.leave || undefined,  
//           extraActivity: filters.extraActivity || undefined,
//           description: filters.description || undefined, // Added description filter
//           email: loggedInUser.email,
//         },
//       });

//       setTimesheetList(response.data.data);
//       setTotalRecords(response.data.total);
//     } catch (error) {
//       console.error("Error fetching timesheet data:", error);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleBack = () => {
//     navigate("/dashboard");
//   };

//   const handleFilterClick = (e, field) => {
//     e.preventDefault();
//     setActiveFilter(field);
//     setAnchorEl(e.currentTarget);
//   };

//   const handleFilterSelect = (value) => {
//     setFilters((prevFilters) => ({ ...prevFilters, [activeFilter]: value }));
//     setAnchorEl(null);
//   };
//   const handleWorkDoneClick = (text) => {
//     setSelectedWorkDone(text);
//     setOpenModal(true);
//   };
  
//   const handleFilterValues = () => {
//     const filterValues = [];
  
//     timesheetList.forEach((entry) => {
//       if (activeFilter === "description") {
//         if (entry.typeOfWork === "Leave") {
//           filterValues.push({ label: "Leave", value: "Leave" });
  
//           if (entry.leaveType) {
//             filterValues.push({ label: entry.leaveType, value: entry.leaveType });
//           }
//         }
  
//         if (entry.typeOfWork === "Extra Activity") {
//           filterValues.push({ label: "Extra Activity", value: "Extra Activity" });
  
//           if (entry.extraActivity) {
//             filterValues.push({ label: entry.extraActivity, value: entry.extraActivity });
//           }
//         }
  
//         if (entry.typeOfWork === "Regular Work") {
//           filterValues.push({ label: "Regular Work", value: "Regular Work" });
        
//           if (entry.project && entry.project.name) {
//             filterValues.push({ label: entry.project.name, value: entry.project.name });
//           }
//         }
        
//       }
  
//       if (activeFilter === "name" && entry.name) {
//         filterValues.push({ label: entry.name, value: entry.name });
//       }
  
//       if (activeFilter === "workDone" && entry.typeOfWork === "Regular Work" && entry.workDone) {
//         filterValues.push({
//           label: entry.workDone.length > 30 ? entry.workDone.substring(0, 30) + "..." : entry.workDone,
//           value: entry.workDone, // full value for actual filtering
//         });
//       }
      
      
//     });
  
//     // Filter out duplicates based on value
//     const uniqueMap = new Map();
//     filterValues.forEach(item => {
//       if (!uniqueMap.has(item.value)) {
//         uniqueMap.set(item.value, item);
//       }
//     });
  
//     return Array.from(uniqueMap.values());
//   };
  

//   // Function to filter timesheetList based on selected filters
//   const filterTimesheetList = () => {
//     return timesheetList.filter((entry) => {
//       if (filters.name && entry.name !== filters.name) return false;
//       if (filters.project && entry.project?.name !== filters.project) return false;
//       if (filters.workDone && entry.workDone !== filters.workDone) return false;
//       if (filters.leave && entry.isLeave !== true) return false;
//       if (filters.extraActivity && entry.typeOfWork !== "Extra Activity") return false;
//       if (filters.description && entry.typeOfWork !== filters.description) return false;

//       return true;
//     });
//   };

//   const clearFilters = () => {
//     setFilters({ name: "", project: "", workDone: "", leave: "", extraActivity: "", description: "" });
//   };

//   const filteredTimesheetList = filterTimesheetList();

//   return (
//     <Container maxWidth="lg" sx={{ mt: 5 }}>
//       <Typography variant="h4" align="center" gutterBottom>
//         Entered Timesheet Data
//       </Typography>

//       <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
//   {Object.entries(filters).map(([key, value]) => {
//     if (!value) return null;

//     const displayValue = value.length > 30 ? value.substring(0, 30) + "..." : value;

//     return (
//       <Chip
//         key={key}
//         label={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${displayValue}`}
//         onDelete={() => setFilters({ ...filters, [key]: "" })}
//         color="primary"
//         title={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`} // Tooltip for full value
//       />
//     );
//   })}
// </Box>


//       <Button
//         variant="outlined"
//         color="secondary"
//         onClick={clearFilters}
//         sx={{ mb: 3 }}
//         disabled={!filters.name && !filters.project && !filters.workDone && !filters.leave && !filters.extraActivity && !filters.description}
//       >
//         Clear All Filters
//       </Button>

// <TableContainer
//   component={Paper}
//   sx={{
//     boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//     borderRadius: 4,
//     overflow: "hidden"
//   }}
// >

//       <Table sx={{ minWidth: 650 }} stickyHeader>
// <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
//   <TableRow>
//     <TableCell sx={{ fontWeight: "bold", color: "#444" }}>Date</TableCell>
    
//               <TableCell>
//                 <strong>Name</strong>
//                 <IconButton onClick={(e) => handleFilterClick(e, "name")}>
//                   <FilterAltIcon />
//                 </IconButton>
//               </TableCell>
//               <TableCell>
//                 <strong>Description</strong>
//                 <IconButton onClick={(e) => handleFilterClick(e, "description")}>
//                   <FilterAltIcon />
//                 </IconButton>
//               </TableCell>
//               <TableCell>
//                 <strong>Work Done</strong>
//                 <IconButton onClick={(e) => handleFilterClick(e, "workDone")}>
//                   <FilterAltIcon />
//                 </IconButton>
//               </TableCell>
//               <TableCell><strong>Hours Worked</strong></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredTimesheetList.length > 0 ? (
//               filteredTimesheetList.map((entry) => (
// <TableRow
//   key={entry._id}
//   hover
//   sx={{
//     m: 1,
//     borderRadius: 2,
//     boxShadow: 1,
//     backgroundColor: "#ffffff",
//     '&:hover': {
//       boxShadow: 4,
//       transform: 'scale(1.01)',
//       transition: 'all 0.3s ease-in-out',
//     },
//   }}
// >

// <TableCell sx={{ fontSize: "0.95rem", py: 2, px: 2 }}>
//   {entry.date ? new Date(entry.date).toLocaleDateString() : "--"}
// </TableCell>
//                   <TableCell>{entry.name || "--"}</TableCell>
// <TableCell>
//   {entry.isLeave ? (
//     <Chip label={entry.leaveType || "Leave"} color="error" variant="outlined" />
//   ) : entry.typeOfWork === "Extra Activity" ? (
//     <Chip label={entry.extraActivity || "Extra Activity"} color="info" variant="outlined" />
//   ) : (
//     <Chip label={entry.project?.name || "Project"} color="success" variant="outlined" />
//   )}
// </TableCell>

//                   <TableCell
//   onClick={() => handleWorkDoneClick(entry.workDone)}
//   sx={{ cursor: 'pointer', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
// >
//   {entry.workDone || "--"}
// </TableCell>

//                   <TableCell>{entry.hours || "--"}</TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No timesheet records found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
// <Modal open={openModal} onClose={() => setOpenModal(false)}>
//   <Box
//     sx={{
//       p: 4,
//       bgcolor: "background.paper",
//       borderRadius: 3,
//       boxShadow: 6,
//       width: { xs: "90%", sm: 500 },
//       mx: "auto",
//       mt: "10%",
//       textAlign: "center"
//     }}
//   >
//     <Typography variant="h6">Work Done Description</Typography>
//     <Typography variant="body2" sx={{ mt: 2 }}>{selectedWorkDone}</Typography>
//     <Button variant="contained" onClick={() => setOpenModal(false)} sx={{ mt: 3 }}>
//       Close
//     </Button>
//   </Box>
// </Modal>

//       <TablePagination
//         component="div"
//         count={totalRecords}
//         page={page}
//         onPageChange={handleChangePage}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         rowsPerPageOptions={[5, 10, 15, 20]}
//       />

// <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
//   {handleFilterValues().length > 0 ? (
//     handleFilterValues().map(({ label, value }, index) => (
//       <MenuItem
//         key={index}
//         onClick={() => handleFilterSelect(value)}
//         sx={{ fontSize: 14 }}
//       >
//         {label}
//       </MenuItem>
//     ))
//   ) : (
//     <MenuItem disabled>No filter options</MenuItem>
//   )}
// </Menu>

//     </Container>
//   );
// };

// export default EnteredDataPage;


import React, { useState, useEffect } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper,
  Container, Typography, TablePagination, Menu, MenuItem, IconButton, Button,
  Chip, Box, Modal
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Stack } from '@mui/material';


const EnteredDataPage = () => {
  const [timesheetList, setTimesheetList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
const [filters, setFilters] = useState({
  date: "", project: "", description: ""
});

  const [totalRecords, setTotalRecords] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState("");
  const [selectedWorkDone, setSelectedWorkDone] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [fromDate, setFromDate] = useState(null);
const [toDate, setToDate] = useState(null);



  const navigate = useNavigate();

  useEffect(() => {
    fetchTimesheets();
  }, [page, rowsPerPage, filters]);

  const fetchTimesheets = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      if (!loggedInUser?.email) {
        setTimesheetList([]);
        return;
      }

      const response = await axios.get("api/timesheet/getusertimesheets", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          name: filters.name || undefined,
          project: filters.project || undefined,
          workDone: filters.workDone || undefined,
          description: filters.description || undefined,
          email: loggedInUser.email,
        },
      });

      setTimesheetList(response.data.data);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleBack = () => navigate("/dashboard");

  const handleFilterClick = (e, field) => {
    setActiveFilter(field);
    setAnchorEl(e.currentTarget);
  };

  const handleFilterSelect = (value) => {
    setFilters((prev) => ({ ...prev, [activeFilter]: value }));
    setAnchorEl(null);
  };

  const handleWorkDoneClick = (text) => {
    setSelectedWorkDone(text);
    setOpenModal(true);
  };

  // Generate unique filter options from current timesheetList based on active filter
const getFilterOptions = () => {
  const optionsSet = new Set();
  const options = [];

  timesheetList.forEach((entry) => {
    let value = "";

    switch (activeFilter) {
      case "date":
        value = entry.date ? new Date(entry.date).toLocaleDateString() : "";
        break;
      case "project":
        value = entry.project?.name;
        break;
      case "description":
        value = entry.typeOfWork;
        break;
      default:
        break;
    }

    if (value && !optionsSet.has(value)) {
      optionsSet.add(value);
      options.push({ label: value, value });
    }
  });

  return options;
};


  const clearFilters = () => {
    setFilters({ name: "", project: "", workDone: "", description: "" });
  };

  // Filter timesheetList based on active filters
  const filteredTimesheetList = timesheetList.filter((entry) => {
    if (filters.name && entry.name !== filters.name) return false;
    if (filters.project && entry.project?.name !== filters.project) return false;
    if (filters.workDone && entry.workDone !== filters.workDone) return false;
    if (filters.description && entry.typeOfWork !== filters.description) return false;
     if (fromDate && new Date(entry.date) < fromDate) return false;
  if (toDate && new Date(entry.date) > toDate) return false;

    return true;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Entered Timesheet Data
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {Object.entries(filters).map(([key, value]) => {
          if (!value) return null;
          const displayValue = value.length > 30 ? value.substring(0, 30) + "..." : value;
          return (
            <Chip
              key={key}
              label={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${displayValue}`}
              onDelete={() => setFilters((prev) => ({ ...prev, [key]: "" }))}
              color="primary"
              title={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
            />
          );
        })}
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
    <DatePicker
      label="From Date"
      value={fromDate}
      onChange={(newValue) => setFromDate(newValue)}
      renderInput={(params) => <TextField {...params} />}
    />
    <DatePicker
      label="To Date"
      value={toDate}
      onChange={(newValue) => setToDate(newValue)}
      renderInput={(params) => <TextField {...params} />}
    />
  </Stack>
</LocalizationProvider>


      <Button
        variant="outlined"
        color="secondary"
        onClick={clearFilters}
        sx={{ mb: 3 }}
        disabled={!Object.values(filters).some((val) => val)}
      >
        Clear All Filters
      </Button>

<TableContainer
  component={Paper}
  sx={{
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    borderRadius: 4,
    maxHeight: 600, // Prevents full-page overflow
    overflow: "auto" // Only shows scrollbar when needed, not permanently
  }}
>
  <Table sx={{ minWidth: 650 }}>
    <TableHead>
      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
  <TableCell>
    <strong>Date</strong>
    <IconButton onClick={(e) => handleFilterClick(e, "date")}>
      <FilterAltIcon />
    </IconButton>
  </TableCell>
  <TableCell><strong>Name</strong></TableCell>
  <TableCell>
    <strong>Project</strong>
    <IconButton onClick={(e) => handleFilterClick(e, "project")}>
      <FilterAltIcon />
    </IconButton>
  </TableCell>
  <TableCell>
    <strong>Description</strong>
    <IconButton onClick={(e) => handleFilterClick(e, "description")}>
      <FilterAltIcon />
    </IconButton>
  </TableCell>
  <TableCell><strong>Work Done</strong></TableCell>
  <TableCell><strong>Hours Worked</strong></TableCell>
</TableRow>

          </TableHead>
          <TableBody>
           {filteredTimesheetList.length > 0 ? (
        filteredTimesheetList.map((entry) => (
          <TableRow
            key={entry._id}
            hover
            sx={{
              transition: 'box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out',
              '&:hover': {
                boxShadow: 3,
                backgroundColor: '#f9f9f9'
              }
            }}
          >
                  <TableCell sx={{ fontSize: "0.95rem", py: 2, px: 2 }}>
                    {entry.date ? new Date(entry.date).toLocaleDateString() : "--"}
                  </TableCell>
                  <TableCell>{entry.name || "--"}</TableCell>
                  <TableCell>{entry.project?.name || "--"}</TableCell>
                  <TableCell>{entry.typeOfWork || "--"}</TableCell>
                  <TableCell
                    onClick={() => handleWorkDoneClick(entry.workDone)}
                    sx={{ cursor: 'pointer', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {entry.workDone || "--"}
                  </TableCell>
                  <TableCell>{entry.hours || "--"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No timesheet records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 6,
            width: { xs: "90%", sm: 500 },
            mx: "auto",
            mt: "10%",
            textAlign: "center"
          }}
        >
          <Typography variant="h6">Work Done Description</Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>{selectedWorkDone}</Typography>
          <Button variant="contained" onClick={() => setOpenModal(false)} sx={{ mt: 3 }}>
            Close
          </Button>
        </Box>
      </Modal>

      <TablePagination
        component="div"
        count={totalRecords}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15, 20]}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {getFilterOptions().length > 0 ? (
          getFilterOptions().map(({ label, value }, index) => (
            <MenuItem
              key={index}
              onClick={() => handleFilterSelect(value)}
              sx={{ fontSize: 14 }}
            >
              {label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No filter options</MenuItem>
        )}
      </Menu>
    </Container>
  );
};

export default EnteredDataPage;
