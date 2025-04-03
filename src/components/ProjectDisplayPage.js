import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, Paper, Grid, Snackbar, IconButton } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SideMenu from './sidebar';

const ProjectDisplayPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [dependencies, setDependencies] = useState('');
  const [hoursSpent, setHoursSpent] = useState('');
  const [utilization, setUtilization] = useState('');
  const [status, setStatus] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/project/${projectId}`);
        setProject(response.data.data);
      } catch (error) {
        setError('Error fetching project data');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchTotalHours = async (projectName) => {
    try {
      if (!projectName) return; // Wait for projectName to be available
      const response = await axios.get(`http://localhost:8000/api/timesheet/total-hours/${projectId}`);

      setHoursSpent(response.data.totalHours);
    } catch (error) {
      console.error("Error fetching total hours:", error);
    }
  };

  useEffect(() => {
    if (project?.name) {
      fetchTotalHours(project.name); // Fetch total hours once project is loaded
    }
  }, [project]);

  const handleAddDetails = async () => {
    if (!fromDate || !toDate || !dependencies.trim() || !hoursSpent.trim() || !utilization.trim() || !status.trim()) return;

    try {
      await axios.post(`http://localhost:8000/api/projectdetails/${projectId}/details`, {
        fromDate,
        toDate,
        dependencies,
        hoursSpent,
        utilization,
        status
      });
      setOpenSnackbar(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SideMenu />
      <Box sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', mb: 2 }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ ml: 1 }}>Project: {project?.name}</Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '600px', borderRadius: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="From Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="To Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '600px', borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Dependencies / Issues" variant="outlined" fullWidth multiline rows={4} value={dependencies} onChange={(e) => setDependencies(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Hours Spent" variant="outlined" fullWidth value={hoursSpent} onChange={(e) => setHoursSpent(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Utilization" variant="outlined" fullWidth value={utilization} onChange={(e) => setUtilization(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Status" variant="outlined" fullWidth value={status} onChange={(e) => setStatus(e.target.value)} />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleAddDetails}>Add Details</Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" variant="filled">
          Added Successfully!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ProjectDisplayPage;
