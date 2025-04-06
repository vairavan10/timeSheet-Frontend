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
import EmployeeTable from './table';
import EnteredDataPage from './currentdata';

const Dashboard = () => {
  const theme = useTheme();
  const logo = theme.palette.mode === 'dark' ? LogoDark : LogoLight;

  const userData = JSON.parse(localStorage.getItem('user'));
  const userRole = userData?.role;
  const userName = userData?.email?.split('@')[0] || 'User';

  const allowedRoles = ['admin', 'manager', 'employee', 'Employee'];
  const isManagerOrAdmin = userRole === 'admin' || userRole === 'manager';

  const [employeeCount, setEmployeeCount] = useState(0);
  const [hoursCount, setHourCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/employees/employee-count');
        if (!response.ok) throw new Error('Failed to fetch employee data');
        
        const data = await response.json();
        console.log("Employee API Response:", data); // Debugging

        if (typeof data.count === 'number') {
          setEmployeeCount(data.count);
        } else {
          setEmployeeCount(0);
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setEmployeeCount(0);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchHours = async () => {
      const storedEmail = JSON.parse(localStorage.getItem('user'))?.email;
      if (!storedEmail) return;
  
      try {
        const response = await fetch(`http://localhost:8080/api/timesheet/getusertotalhours?email=${storedEmail}`);
        if (!response.ok) throw new Error('Failed to fetch user hours');
        
        const data = await response.json();
        console.log("Timesheet API Response:", data); // Debugging

        if (typeof data.totalHours === 'number') {
          setHourCount(data.totalHours);
        } else {
          setHourCount(0);
        }
      } catch (error) {
        console.error('Error fetching user hours:', error);
        setHourCount(0);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEmployees();
    fetchHours();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: 'background.default',
          minHeight: '100vh',
          pl: { xs: 0, sm: '200px' },
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
      >
        <Toolbar />

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
          <img src={logo} alt="Logo" style={{ maxHeight: '80px', objectFit: 'contain' }} />
        </Box>

        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            Welcome Back, {userName}! 👋
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Here's a quick overview of your timesheet stats.
          </Typography>
        </Box>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">{hoursCount || 0}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Hours
                </Typography>
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
                <Typography variant="body2" color="text.secondary">
                  Projects
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                <AccessTimeIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">40</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Hours
                </Typography>
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
                  <Typography variant="body2" color="text.secondary">
                    Employees
                  </Typography>
                </Box>
              </Card>
            </Grid>
          )}
        </Grid>

        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, height: '100%', backgroundColor: 'background.paper' }}>
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
              <Paper elevation={3} sx={{ p: 3, height: '100%', backgroundColor: 'background.paper' }}>
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
  );
};

export default Dashboard;
