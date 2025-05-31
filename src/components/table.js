// import React, { useState, useEffect } from "react";
// import Sidebar from "./sidebar";
// import { Modal } from "@mui/material";
// import Layout from './layout'

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

//       const response = await axios.get("api/timesheet/getalltimesheets", {
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
  
//   // const handleFilterValues = () => {
//   //   const filterValues = [];
  
//   //   timesheetList.forEach((entry) => {
//   //     if (activeFilter === "description") {
//   //       if (entry.typeOfWork === "Leave") {
//   //         filterValues.push({ label: "Leave", value: "Leave" });
  
//   //         if (entry.leaveType) {
//   //           filterValues.push({ label: entry.leaveType, value: entry.leaveType });
//   //         }
//   //       }
  
//   //       if (entry.typeOfWork === "Extra Activity") {
//   //         filterValues.push({ label: "Extra Activity", value: "Extra Activity" });
  
//   //         if (entry.extraActivity) {
//   //           filterValues.push({ label: entry.extraActivity, value: entry.extraActivity });
//   //         }
//   //       }
  
//   //       if (entry.typeOfWork === "Regular Work") {
//   //         filterValues.push({ label: "Regular Work", value: "Regular Work" });
        
//   //         if (entry.project && entry.project.name) {
//   //           filterValues.push({ label: entry.project.name, value: entry.project.name });
//   //         }
//   //       }
        
//   //     }
  
//   //     if (activeFilter === "name" && entry.name) {
//   //       filterValues.push({ label: entry.name, value: entry.name });
//   //     }
  
//   //     if (activeFilter === "workDone" && entry.typeOfWork === "Regular Work" && entry.workDone) {
//   //       filterValues.push({
//   //         label: entry.workDone.length > 30 ? entry.workDone.substring(0, 30) + "..." : entry.workDone,
//   //         value: entry.workDone, // full value for actual filtering
//   //       });
//   //     }
      
      
//   //   });
  
//   //   // Filter out duplicates based on value
//   //   const uniqueMap = new Map();
//   //   filterValues.forEach(item => {
//   //     if (!uniqueMap.has(item.value)) {
//   //       uniqueMap.set(item.value, item);
//   //     }
//   //   });
  
//   //   return Array.from(uniqueMap.values());
//   // };
//   const handleFilterValues = () => {
//     const filterValues = [];
  
//     timesheetList.forEach((entry) => {
//       if (activeFilter === "description") {
//         // Add "Leave" for entries with typeOfWork "Leave"
//         if (entry.typeOfWork === "Leave") {
//           filterValues.push({ label: "Leave", value: "Leave" });
//         }
  
//         // Add "Extra Activity" for entries with typeOfWork "Extra Activity"
//         if (entry.typeOfWork === "Extra Activity") {
//           filterValues.push({ label: "Extra Activity", value: "Extra Activity" });
//         }
  
//         // Add "Regular Work" and the project name for entries with typeOfWork "Regular Work"
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
//         let labelText = entry.workDone.length > 30 ? entry.workDone.substring(0, 30) + "..." : entry.workDone;
  
//         // Include the project name in the workDone filter if a project exists
//         if (entry.project && entry.project.name) {
//           labelText += ` (Project: ${entry.project.name})`;
//         }
  
//         filterValues.push({
//           label: labelText,
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
//     <Layout>
//     <Container maxWidth="lg" sx={{ mt: 5 }}>
//       <Typography variant="h4" align="center" gutterBottom>
//         Employee Timesheet View
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

//       <TableContainer
//   component={Paper}
//   sx={{
//     mt: 3,
//     boxShadow: 3,
//     borderRadius: 2,
//     overflowX: "hidden",
//   }}
// >
//       <Table sx={{ minWidth: 650 }} stickyHeader>
//       <TableHead>
//             <TableRow>
//               <TableCell><strong>Date</strong></TableCell>
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
//     transition: 'transform 0.2s ease-in-out',
//     '&:hover': {
//       backgroundColor: '#f5f5f5',
//       transform: 'scale(1.01)',
//       cursor: 'pointer',
//     },
//   }}
  
// >
//                   <TableCell>{entry.date ? new Date(entry.date).toLocaleDateString() : "--"}</TableCell>
//                   <TableCell>{entry.name || "--"}</TableCell>
//                   <TableCell>
//                     {entry.isLeave
//                       ? entry.leaveType || "Leave"
//                       : entry.typeOfWork === "Extra Activity"
//                       ? entry.extraActivity || "Extra Activity"
//                       : entry.typeOfWork === "Regular Work"
//                       ? entry.project?.name || "Project"
//                       : entry.workDone || "--"}
//                   </TableCell>
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
//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//   <Box
//     sx={{
//       position: "absolute",
//       top: "50%",
//       left: "50%",
//       transform: "translate(-50%, -50%)",
//       bgcolor: "background.paper",
//       boxShadow: 24,
//       p: 4,
//       borderRadius: 2,
//       maxWidth: 500,
//       wordBreak: "break-word",
//     }}
//   >
//     <Typography variant="h6" gutterBottom>
//       Full Work Done Description
//     </Typography>
//     <Typography variant="body1">{selectedWorkDone}</Typography>
//     <Button onClick={() => setOpenModal(false)} sx={{ mt: 2 }}>
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
//     </Layout>
//   );
// };

// export default EnteredDataPage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Layout from "./layout";
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
  IconButton,
  Button,
  Chip,
  Box,
  TextField,
  Menu,
  MenuItem,
  Modal,
} from "@mui/material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const EnteredDataPage = () => {
  const [timesheetList, setTimesheetList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    name: "",
    project: "",
    workDone: "",
    leave: "",
    extraActivity: "",
    description: "",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, filters, fromDate, toDate]);

  const fetchTimesheets = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      if (!loggedInUser || !loggedInUser.email) {
        console.error("No logged-in user found!");
        setTimesheetList([]);
        return;
      }

      const params = {
        page: page + 1,
        limit: rowsPerPage,
        name: filters.name || undefined,
        project: filters.project || undefined,
        workDone: filters.workDone || undefined,
        leave: filters.leave || undefined,
        extraActivity: filters.extraActivity || undefined,
        description: filters.description || undefined,
        email: loggedInUser.email,
      };

      if (fromDate) params.fromDate = fromDate.toISOString().split("T")[0];
      if (toDate) params.toDate = toDate.toISOString().split("T")[0];

      const response = await axios.get("api/timesheet/getalltimesheets", {
        params,
      });

      setTimesheetList(response.data.data);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterClick = (e, field) => {
    e.preventDefault();
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

  const handleCloseModal = () => setOpenModal(false);

  const handleDeleteFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      project: "",
      workDone: "",
      leave: "",
      extraActivity: "",
      description: "",
    });
    setFromDate(null);
    setToDate(null);
  };

  const filteredTimesheetList = timesheetList.filter((entry) => {
    if (filters.name && entry.name !== filters.name) return false;
    if (filters.project && entry.project?.name !== filters.project) return false;
    if (filters.workDone && entry.workDone !== filters.workDone) return false;
    if (filters.leave && entry.isLeave !== true) return false;
    if (filters.extraActivity && entry.typeOfWork !== "Extra Activity") return false;
    if (filters.description && entry.typeOfWork !== filters.description) return false;
    return true;
  });

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Employee Timesheet View
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
              maxDate={toDate || undefined}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              renderInput={(params) => <TextField {...params} size="small" />}
              minDate={fromDate || undefined}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={clearFilters}
              disabled={
                !Object.values(filters).some((val) => val) &&
                !fromDate &&
                !toDate
              }
            >
              Clear All Filters
            </Button>
          </Box>
        </LocalizationProvider>

        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            const displayValue =
              value.length > 30 ? value.substring(0, 30) + "..." : value;
            return (
              <Chip
                key={key}
                label={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${displayValue}`}
                onDelete={() => handleDeleteFilter(key)}
                color="primary"
                title={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
              />
            );
          })}
          {(fromDate || toDate) && (
            <Chip
              label={`Date: ${fromDate ? fromDate.toLocaleDateString() : "Any"} - ${
                toDate ? toDate.toLocaleDateString() : "Any"
              }`}
              onDelete={() => {
                setFromDate(null);
                setToDate(null);
              }}
              color="primary"
            />
          )}
        </Box>

        <TableContainer
          component={Paper}
          sx={{ mt: 3, boxShadow: 3, borderRadius: 2, overflowX: "hidden" }}
        >
          <Table sx={{ minWidth: 650 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
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
                <TableCell>
                  <strong>Hours Worked</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTimesheetList.length > 0 ? (
                filteredTimesheetList.map((entry) => (
                  <TableRow
                    key={entry._id}
                    hover
                    sx={{
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                        transform: "scale(1.01)",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <TableCell>
                      {entry.date
                        ? new Date(entry.date)
                            .toLocaleDateString("en-GB")
                        : "-"}
                    </TableCell>
                    <TableCell>{entry.name}</TableCell>
                    <TableCell>{entry.typeOfWork}</TableCell>
                    <TableCell>
                      <span
                        style={{ color: "#007BFF", textDecoration: "underline" }}
                        onClick={() => handleWorkDoneClick(entry.workDone)}
                      >
                        {entry.workDone.length > 30
                          ? entry.workDone.substring(0, 30) + "..."
                          : entry.workDone}
                      </span>
                    </TableCell>
                    <TableCell>{entry.hours}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No data available
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
          rowsPerPageOptions={[5, 10, 25]}
        />

        {/* Modal for Work Done details */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              maxWidth: 600,
              width: "90%",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Work Done Details
            </Typography>
            <Typography>{selectedWorkDone || "No details available."}</Typography>
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button onClick={handleCloseModal} variant="contained" color="primary">
                Close
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Filter menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ style: { maxHeight: 300, width: "250px" } }}
        >
          {activeFilter &&
            handleFilterValues().map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => handleFilterSelect(option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
        </Menu>
      </Container>
    </Layout>
  );

  // Helper function moved inside component
  function handleFilterValues() {
    const filterValues = [];

    timesheetList.forEach((entry) => {
      if (activeFilter === "name" && entry.name) {
        if (!filterValues.some((v) => v.value === entry.name)) {
          filterValues.push({ label: entry.name, value: entry.name });
        }
      } else if (activeFilter === "project" && entry.project?.name) {
        if (!filterValues.some((v) => v.value === entry.project.name)) {
          filterValues.push({ label: entry.project.name, value: entry.project.name });
        }
      } else if (activeFilter === "workDone" && entry.workDone) {
        if (!filterValues.some((v) => v.value === entry.workDone)) {
          filterValues.push({ label: entry.workDone, value: entry.workDone });
        }
      } else if (activeFilter === "leave") {
        if (!filterValues.some((v) => v.value === "Yes")) {
          filterValues.push({ label: "Yes", value: "Yes" });
        }
      } else if (activeFilter === "extraActivity") {
        if (!filterValues.some((v) => v.value === "Extra Activity")) {
          filterValues.push({ label: "Extra Activity", value: "Extra Activity" });
        }
      } else if (activeFilter === "description") {
        if (!filterValues.some((v) => v.value === entry.typeOfWork)) {
          filterValues.push({ label: entry.typeOfWork, value: entry.typeOfWork });
        }
      }
    });

    return filterValues;
  }
};

export default EnteredDataPage;