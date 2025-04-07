import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Toolbar,
  Grid,
  Card,
  Avatar,
  Paper,
  CircularProgress,
  useTheme
} from '@mui/material';
import LogoLight from '../asset/kologos.png';
import LogoDark from '../asset/kologowhite.png';
import SideMenu from './sidebar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EnteredDataPage from './currentdata';
import Layout from './layout';

const Dashboard = () => {
  const theme = useTheme();
  const logo = theme.palette.mode === 'dark' ? LogoDark : LogoLight;

  const userData = JSON.parse(localStorage.getItem('user'));
  const userRole = userData?.role;
  const userName = userData?.email?.split('@')[0] || 'User';

  const isManagerOrAdmin = userRole === 'admin' || userRole === 'manager';

  const [employeeCount, setEmployeeCount] = useState(0);
  const [hoursCount, setHourCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projectHours, setProjectHours] = useState(0);


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/employees/employee-count');
        const data = await response.json();
        if (typeof data.count === 'number') setEmployeeCount(data.count);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setEmployeeCount(0);
      }
    };

    const fetchHours = async () => {
      const email = userData?.email;
      if (!email) return;

      try {
        const response = await fetch(`http://localhost:8080/api/timesheet/getusertotalhours?email=${email}`);
        const data = await response.json();
        if (typeof data.totalHours === 'number') setHourCount(data.totalHours);
      } catch (error) {
        console.error('Error fetching user hours:', error);
        setHourCount(0);
      }
    };
    const fetchProjectHours = async () => {
      const email = userData?.email;
      if (!email) return;
    
      try {
        const response = await fetch(`http://localhost:8080/api/timesheet/getuserprojecthours?email=${email}`);
        const data = await response.json();
        if (typeof data.projectHours === 'number') setProjectHours(data.projectHours);
      } catch (error) {
        console.error('Error fetching project hours:', error);
        setProjectHours(0);
      }
    };
    

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmployees(), fetchHours(),fetchProjectHours()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <Layout>
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* <SideMenu /> */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar />

        <Box sx={{ px: 3, pb: 3 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img src={logo} alt="Logo" style={{ maxHeight: '80px', objectFit: 'contain' }} />
          </Box>

          {/* Welcome */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" gutterBottom>
              Welcome Back, {userName}! 👋
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here's a quick overview of your timesheet stats.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{hoursCount || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Hours</Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>
                  <AssignmentTurnedInIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">10</Typography>
                  <Typography variant="body2" color="text.secondary">Projects</Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                  <AccessTimeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{projectHours || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Project Hours</Typography>
                </Box>
              </Card>
            </Grid>

            {isManagerOrAdmin && (
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Avatar sx={{ bgcolor: '#f44336', mr: 2 }}>
                    <GroupIcon />
                  </Avatar>
                  <Box>
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Typography variant="h6">{employeeCount || 0}</Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">Employees</Typography>
                  </Box>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Data & Notifications */}
          <Grid container spacing={3} mt={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Timesheet Overview
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Track your work hours, projects, and pending submissions here.
                </Typography>
                {EnteredDataPage && <EnteredDataPage />}
              </Paper>
            </Grid>

            {isManagerOrAdmin && (
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Updates and alerts regarding employee activities.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
    </Layout>
  );
};

export default Dashboard;
