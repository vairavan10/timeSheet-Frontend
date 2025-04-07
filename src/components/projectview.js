import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box,
  Typography, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { Link } from 'react-router-dom';
import SideMenu from './sidebar';
import Layout from './layout';

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState({});
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectRes = await axios.get('http://localhost:8080/api/project');
        const projectList = projectRes.data.data;
        setProjects(projectList);

        const reportsData = {};
        for (const project of projectList) {
          try {
            const reportRes = await axios.get(`http://localhost:8080/api/projectdetails/${project._id}/latest-report`);
            reportsData[project._id] = reportRes.data;
          } catch {
            reportsData[project._id] = null;
          }
        }

        const dateRes = await axios.get('http://localhost:8080/api/projectdetails/available-dates');
        setAvailableDates(dateRes.data?.dates ?? []);

        setReports(reportsData);
      } catch (err) {
        setError('❌ Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDateChange = async (dateRangeString) => {
    setSelectedDate(dateRangeString);

    if (dateRangeString === "Latest Report") {
      setSelectedDate("");

      const latestReports = {};
      for (const project of projects) {
        try {
          const reportRes = await axios.get(`http://localhost:8080/api/projectdetails/${project._id}/latest-report`);
          latestReports[project._id] = reportRes.data;
        } catch {
          latestReports[project._id] = null;
        }
      }
      setReports(latestReports);
      return;
    }

    const [fromDate, toDate] = dateRangeString.split('|');
    const updatedReports = {};
    for (const project of projects) {
      try {
        const reportRes = await axios.get(
          `http://localhost:8080/api/projectdetails/${project._id}/report-by-date?fromDate=${fromDate}&toDate=${toDate}`
        );
        const reportData = reportRes.data;
        updatedReports[project._id] = Array.isArray(reportData) ? reportData[0] : reportData;
      } catch {
        updatedReports[project._id] = null;
      }
    }
    setReports(updatedReports);
  };

  const handleOpenDialog = (project, report) => {
    setSelectedProject(project);
    setSelectedReport(report);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReport(null);
    setSelectedProject(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* <SideMenu /> */}
      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          📁 All Projects Overview
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select Date</InputLabel>
          <Select
            value={selectedDate || "Latest Report"}
            label="Select Date"
            onChange={(e) => handleDateChange(e.target.value)}
          >
            <MenuItem value="Latest Report">Latest Report</MenuItem>
            {availableDates.length > 0 ? (
              availableDates.map((dateRange, idx) => {
                const from = new Date(dateRange.fromDate).toLocaleDateString();
                const to = new Date(dateRange.toDate).toLocaleDateString();
                const value = `${dateRange.fromDate}|${dateRange.toDate}`;
                return (
                  <MenuItem key={idx} value={value}>
                    {`${from} to ${to}`}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem value="" disabled>No Dates Available</MenuItem>
            )}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/add-projects"
          sx={{ mb: 3 }}
        >
          ➕ Add Project
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Project Name</strong></TableCell>
                <TableCell><strong>Dependencies</strong></TableCell>
                <TableCell><strong>Utilization</strong></TableCell>
                <TableCell><strong>Hours Spent</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>

                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => {
                const report = reports[project._id];

                return (
                  <TableRow key={project._id}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{report?.dependencies ?? 'N/A'}</TableCell>
                    <TableCell>{report?.utilization ? `${report.utilization}%` : 'N/A'}</TableCell>
                    <TableCell>{report?.hoursSpent ?? 'N/A'}</TableCell>
                    <TableCell>{report?.status ?? 'N/A'}</TableCell>

                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          component={Link}
                          to={`/project/${project._id}`}
                        >
                          Add Details
                        </Button>
                        {report && (
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleOpenDialog(project, report)}
                          >
                            View Report
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog for viewing report */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>📄 Report Details</DialogTitle>
          <DialogContent dividers>
            <Typography><strong>Project:</strong> {selectedProject?.name}</Typography>
            <Typography><strong>Dependencies:</strong> {selectedReport?.dependencies ?? 'N/A'}</Typography>
            <Typography><strong>Utilization:</strong> {selectedReport?.utilization ? `${selectedReport.utilization}%` : 'N/A'}</Typography>
            <Typography><strong>Hours Spent:</strong> {selectedReport?.hoursSpent ?? 'N/A'}</Typography>
            <Typography><strong>Status:</strong> {selectedReport?.status ?? 'N/A'}</Typography>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
    </Layout>
  );
};

export default ProjectListPage;





// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import SideMenu from './sidebar';

// const ProjectListPage = () => {
//   const [projects, setProjects] = useState([]);
//   const [reports, setReports] = useState({});
//   const [weekOptions, setWeekOptions] = useState([]);
//   const [selectedWeekKey, setSelectedWeekKey] = useState('default');
//   const [weekMap, setWeekMap] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch all projects and available week options
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setLoading(true);

//         const projectRes = await axios.get('http://localhost:8080/api/project');
//         const projectsList = projectRes.data.data;
//         setProjects(projectsList);

//         const reportsRequests = projectsList.map((project) =>
//           axios.get(`http://localhost:8080/api/projectdetails/${project._id}/latest-report`)
//         );

//         const reportsResponses = await Promise.all(reportsRequests);
//         const allReports = {};
//         projectsList.forEach((project, index) => {
//           allReports[project._id] = reportsResponses[index].data;
//         });

//         const weekMapRes = await axios.post('http://localhost:8080/api/projectdetails/week-options', allReports);
        
//         const weekMapData = weekMapRes.data;
//         console.log("📦 Week map response:", weekMapData);
       

//         setWeekMap(weekMapData);
//         setWeekOptions(['default', ...Object.keys(weekMapData)]);
//       } catch (err) {
//         console.error(err);
//         setError('❌ Failed to load project data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Fetch reports when week selection changes
//   useEffect(() => {
//     const fetchReports = async () => {
//       if (!projects.length) return;
  
//       try {
//         const reportPromises = projects.map(async (project) => {
//           if (selectedWeekKey === 'default') {
//             const res = await axios.get(`http://localhost:8080/api/projectdetails/${project._id}/latest-report`);
//             return { id: project._id, report: res.data };
//           } else {
//             const selectedWeek = weekMap[selectedWeekKey];
        
//             // Log it before making request
//             console.log(`📆 Selected Week for ${project.name}:`, selectedWeek);
        
//             if (!selectedWeek || !selectedWeek.start || !selectedWeek.end) {
//               console.warn(`❗ Invalid week data for key: ${selectedWeekKey}`, selectedWeek);
//               return { id: project._id, report: null };
//             }
        
//             const res = await axios.get(`http://localhost:8080/api/projectdetails/${project._id}/report`, {
//               params: {
//                 fromDate: selectedWeek.start,
//                 toDate: selectedWeek.end
//               }
//             });
        
//             return { id: project._id, report: res.data };
//           }
//         });
        

  
//         const reportsData = await Promise.all(reportPromises);
//         const reportMap = {};
//         reportsData.forEach(({ id, report }) => {
//           reportMap[id] = report;
//         });
  
//         setReports(reportMap);
//       } catch (err) {
//         console.error(err);
//         setError('❌ Failed to fetch reports.');
//       }
//     };
  
//     fetchReports();
//   }, [selectedWeekKey, projects, weekMap]);
  

//   if (loading) return <Typography textAlign="center">Loading...</Typography>;
//   if (error) return <Typography color="error" textAlign="center">{error}</Typography>;

//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh' }}>
//       <SideMenu />
//       <Box sx={{ flex: 1, p: 4 }}>
//         <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
//           📁 All Projects Overview
//         </Typography>

//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//           <Button variant="contained" color="primary" component={Link} to="/add-projects">
//             ➕ Add Project
//           </Button>

//           <FormControl sx={{ minWidth: 250 }}>
//             <InputLabel>Filter by Week</InputLabel>
//             <Select
//               value={selectedWeekKey}
//               label="Filter by Week"
//               onChange={(e) => setSelectedWeekKey(e.target.value)}
//             >
//               {weekOptions.map((weekKey) => (
//                 <MenuItem key={weekKey} value={weekKey}>
//                   {weekKey === 'default' ? 'Latest Report' : weekMap[weekKey]?.label || weekKey}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>

//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><strong>Project Name</strong></TableCell>
//                 <TableCell><strong>Dependencies</strong></TableCell>
//                 <TableCell><strong>Utilization</strong></TableCell>
//                 <TableCell><strong>Hours Spent</strong></TableCell>
//                 <TableCell><strong>Status</strong></TableCell>
//                 <TableCell align="center"><strong>Actions</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {projects.map((project) => {
//                 const report = reports[project._id];
//                 return (
//                   <TableRow key={project._id}>
//                     <TableCell>{project.name}</TableCell>
//                     <TableCell>{report?.dependencies ?? 'N/A'}</TableCell>
//                     <TableCell>{report?.utilization ? `${report.utilization}%` : 'N/A'}</TableCell>
//                     <TableCell>{report?.hoursSpent ?? 'N/A'}</TableCell>
//                     <TableCell>{report?.status ?? 'N/A'}</TableCell>
//                     <TableCell align="center">
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         component={Link}
//                         to={`/project/${project._id}`}
//                       >
//                         Add Details
//                       </Button>
//                       <Button
//                         variant="contained"
//                         color="secondary"
//                         component={Link}
//                         to={`/project/${project._id}/report`}
//                         sx={{ ml: 2 }}
//                       >
//                         View Reports
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   );
// };

// export default ProjectListPage;
