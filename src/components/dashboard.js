import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Toolbar,
  Grid,
  Card,
  Avatar,
  Paper,
  useTheme,
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import LogoLight from '../asset/kologos.png';
import LogoDark from '../asset/kologowhite.png';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import EnteredDataPage from './currentdata';
import Layout from './layout';
import axios from '../axios';

const Dashboard = () => {
  const theme = useTheme();
  const logo = theme.palette.mode === 'dark' ? LogoDark : LogoLight;

  const userData = JSON.parse(localStorage.getItem('user'));
  const userRole = userData?.role;
  const userName = userData?.email
    ? userData.email.split('@')[0]
        .split('.')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : 'User';

  const isManagerOrAdmin = userRole === 'admin' || userRole === 'manager';

  const [employeeCount, setEmployeeCount] = useState(0);
  const [hoursCount, setHourCount] = useState(0);
  const [projectHours, setProjectHours] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [statItems, setStatItems] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('api/employees/employee-count');
        return typeof response.data.count === 'number' ? response.data.count : 0;
      } catch {
        return 0;
      }
    };
  
    const fetchHours = async (email) => {
      try {
        const response = await axios.get(`api/timesheet/getusertotalhours?email=${email}`);
        return typeof response.data.totalHours === 'number' ? response.data.totalHours : 0;
      } catch {
        return 0;
      }
    };
  
    const fetchProjectHours = async (email) => {
      try {
        const response = await axios.get(`api/timesheet/getuserprojecthours?email=${email}`);
        return typeof response.data.projectHours === 'number' ? response.data.projectHours : 0;
      } catch {
        return 0;
      }
    };
  
    const fetchProjectCount = async () => {
      try {
        const response = await axios.get('/api/project/getProjectCount');
        return typeof response.data.data === 'number' ? response.data.data : 0;
      } catch {
        return 0;
      }
    };
  
    const loadData = async () => {
      const email = userData?.email;
      if (!email) return;
  
      const [employeeCountRes, totalHoursRes, projectHoursRes, projectCountRes] = await Promise.all([
        fetchEmployees(),
        fetchHours(email),
        fetchProjectHours(email),
        fetchProjectCount()
      ]);
  
      setEmployeeCount(employeeCountRes);
      setHourCount(totalHoursRes);
      setProjectHours(projectHoursRes);
      setProjectCount(projectCountRes);
  
      setStatItems([
        {
          id: '1',
          label: 'Total Hours',
          value: totalHoursRes,
          icon: <TrendingUpIcon />,
          color: '#1976d2'
        },
        {
          id: '2',
          label: 'Projects',
          value: projectCountRes,
          icon: <AssignmentTurnedInIcon />,
          color: '#4caf50'
        },
        {
          id: '3',
          label: 'Project Hours',
          value: projectHoursRes,
          icon: <AccessTimeIcon />,
          color: '#ff9800'
        },
        {
          id: '4',
          label: 'Employees',
          value: employeeCountRes,
          icon: <GroupIcon />,
          color: '#f44336',
          adminOnly: true
        }
      ]);
    };
  
    loadData();
  }, [userData?.email]);
  

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(statItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setStatItems(items);
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
<Box sx={{ height: 24 }} />          <Box sx={{ px: 3, pb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
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

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="stats" direction="horizontal">
                {(provided) => (
                  <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {statItems.map((item, index) => {
                      if (item.adminOnly && !isManagerOrAdmin) return null;
                      return (
                        <Draggable draggableId={item.id} index={index} key={item.id}>
                          {(provided) => (
                            <Grid
                              item xs={12} sm={6} md={3}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  p: 2,
                                  borderRadius: 3,
                                  boxShadow: 4,
                                  transition: 'transform 0.2s',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                  },
                                }}
                              >
                                <Avatar sx={{ bgcolor: item.color, mr: 2 }}>
                                  {item.icon}
                                </Avatar>
                                <Box>
                                  <Typography variant="h6">{item.value || 0}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {item.label}
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Grid>
                )}
              </Droppable>
            </DragDropContext>

            <Grid container spacing={3} mt={3}>
              <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 4, minHeight: '60vh', overflow: 'auto' }}>
                  <Typography variant="h5" gutterBottom>
                    Timesheet Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Track your work hours, projects, and pending submissions here.
                  </Typography>
                  {EnteredDataPage && <EnteredDataPage />}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Dashboard;
