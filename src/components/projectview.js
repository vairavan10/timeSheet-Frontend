import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box,
  Typography, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
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
        const projectRes = await axios.get('api/project');
        const projectList = projectRes.data.data;
        setProjects(projectList);

        const reportsData = {};
        for (const project of projectList) {
          try {
            const reportRes = await axios.get(`api/projectdetails/${project._id}/latest-report`);
            reportsData[project._id] = reportRes.data;
          } catch {
            reportsData[project._id] = null;
          }
        }

        const dateRes = await axios.get('api/projectdetails/available-dates');
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
          const reportRes = await axios.get(`api/projectdetails/${project._id}/latest-report`);
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
          `api/projectdetails/${project._id}/report-by-date?fromDate=${fromDate}&toDate=${toDate}`
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

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  if (error) return <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>;

  return (
    <Layout>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box sx={{ flex: 1, p: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#1976d2' }}>
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
            sx={{ mb: 3, boxShadow: 2, '&:hover': { boxShadow: 3 } }}
          >
            ➕ Add Project
          </Button>

          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
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
                    <TableRow key={project._id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell>{project.name}</TableCell>
                      <TableCell>{report?.dependencies ?? '--'}</TableCell>
                      <TableCell>{report?.utilization ? `${report.utilization}%` : '--'}</TableCell>
                      <TableCell>{report?.hoursSpent ?? '--'}</TableCell>
                      <TableCell>{report?.status ?? '--'}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                          <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to={`/project/${project._id}`}
                            sx={{ boxShadow: 1 }}
                          >
                            Add Details
                          </Button>
                          {report && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleOpenDialog(project, report)}
                              sx={{ boxShadow: 1 }}
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
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>📄 Report Details</DialogTitle>
            <DialogContent dividers>
              <Typography><strong>Project:</strong> {selectedProject?.name}</Typography>
              <Typography><strong>Dependencies:</strong> {selectedReport?.dependencies ?? '--'}</Typography>
              <Typography><strong>Utilization:</strong> {selectedReport?.utilization ? `${selectedReport.utilization}%` : '--'}</Typography>
              <Typography><strong>Hours Spent:</strong> {selectedReport?.hoursSpent ?? '--'}</Typography>
              <Typography><strong>Status:</strong> {selectedReport?.status ?? '--'}</Typography>
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
