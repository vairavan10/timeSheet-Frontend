import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Button, Paper, Grid, Snackbar, IconButton } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SideMenu from './sidebar';
import InputAdornment from '@mui/material/InputAdornment';
import Layout from './layout';

const ProjectDisplayPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

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

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`api/project/${projectId}`);
        setProject(response.data?.data || null);
      } catch (error) {
        setError('Error fetching project data');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchProject();
  }, [projectId]);

  // Fetch total hours and utilization when dates change
  useEffect(() => {
    if (fromDate && toDate) {
      fetchTotalHoursAndUtilization();
    }
  }, [fromDate, toDate]);

  const fetchTotalHoursAndUtilization = async () => {
    if (!fromDate || !toDate) return;

    try {
      const totalHoursUrl = `api/timesheet/total-hours/${projectId}?fromDate=${fromDate}&toDate=${toDate}`;
      const utilizationUrl = `api/timesheet/utilization-project/${projectId}?fromDate=${fromDate}&toDate=${toDate}`;

      const [totalHoursResponse, utilizationResponse] = await Promise.all([
        axios.get(totalHoursUrl),
        axios.get(utilizationUrl)
      ]);

      setHoursSpent(totalHoursResponse.data?.totalHours ?? '');
      setUtilization(utilizationResponse.data?.utilization ?? '');
    } catch (error) {
      console.error("Error fetching total hours and utilization:", error);
    }
  };

  // Handle adding details
  const handleAddDetails = async () => {
    if (!fromDate || !toDate || !dependencies.trim() || !status) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      await axios.post(`api/projectdetails/${projectId}/details`, {
        fromDate,
        toDate,
        dependencies: dependencies.trim(),
        hoursSpent: Number(hoursSpent),
        utilization: Number(utilization),
        status: status.trim()
      });

      setOpenSnackbar(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error('Error adding details:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* <SideMenu /> */}
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
              <TextField 
                label="From Date" 
                type="date" 
                fullWidth 
                InputLabelProps={{ shrink: true }} 
                value={fromDate} 
                onChange={(e) => setFromDate(e.target.value)} 
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                label="To Date" 
                type="date" 
                fullWidth 
                InputLabelProps={{ shrink: true }} 
                value={toDate} 
                onChange={(e) => setToDate(e.target.value)} 
                inputProps={{ min: fromDate }} 
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '600px', borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                label="Dependencies / Issues" 
                variant="outlined" 
                fullWidth 
                multiline 
                rows={4} 
                value={dependencies} 
                onChange={(e) => setDependencies(e.target.value)} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                label="Hours Spent" 
                variant="outlined" 
                fullWidth 
                type="number"
                value={hoursSpent} 
                InputProps={{ readOnly: true }} // Non-editable field
              />
            </Grid>
            <Grid item xs={12}>
            <TextField 
  label="Utilization" 
  variant="outlined" 
  fullWidth 
  type="number"
  value={utilization}
  InputProps={{ 
    readOnly: true,
    endAdornment: <InputAdornment position="end">%</InputAdornment>
  }} 
/>
            </Grid>
            <Grid item xs={12}>
  <TextField
    label="Status"
    variant="outlined"
    fullWidth
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    multiline
    rows={4}  // You can adjust this to make the input larger
  />
</Grid>

            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleAddDetails}>
                Add Details
              </Button>
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
    </Layout>
  );
};

export default ProjectDisplayPage;
