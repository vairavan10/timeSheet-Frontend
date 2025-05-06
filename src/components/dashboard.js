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
import { motion } from 'framer-motion';

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
      <Box
  sx={{
    display: 'flex',
    height: '100vh',
    overflow: 'auto',
    backgroundColor: 'background.default', // already here ✅
    backgroundImage: 'none',  // ⬅️ THIS LINE TO REMOVE LOGIN BACKGROUND
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  }}
>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <motion.img 
              src={logo} 
              alt="Logo" 
              style={{ maxHeight: '80px', objectFit: 'contain' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            />
          </Box>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            <Box textAlign="center" mb={5}>
            <Typography variant="h4" gutterBottom display="flex" alignItems="center" justifyContent="center">
  Welcome Back, {userName}!{' '}
  <motion.span
    initial={{ rotate: 0 }}
    animate={{ rotate: [0, 20, -10, 20, -10, 0] }}
    transition={{ duration: 1.5 }}
    style={{ display: 'inline-block', marginLeft: 8 }}
  >
    👋
  </motion.span>
</Typography>

              <Typography variant="subtitle1" color="text.secondary">
                Here's a quick overview of your timesheet stats.
              </Typography>
            </Box>
          </motion.div>

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
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Card
                                sx={{
                                  backdropFilter: "blur(10px)",
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                  borderRadius: 4,
                                  p: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  boxShadow: 6,
                                  minHeight: 100,
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
                            </motion.div>
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

          <Grid container spacing={3} mt={5}>
            <Grid item xs={12}>
              <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, minHeight: '60vh', borderRadius: 4, backgroundColor: 'background.paper' }}>
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
    </Layout>
  );
};

export default Dashboard;
