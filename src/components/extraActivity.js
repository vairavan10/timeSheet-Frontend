import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Paper,
  Alert,
  Container,
} from '@mui/material';
import axios from 'axios';
import SideMenu from './sidebar';

const ExtraActivityPage = () => {
  const [activityName, setActivityName] = useState('');
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchActivities = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/extra-activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching activities', err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddActivity = async () => {
    if (!activityName.trim()) {
      setError('Activity name is required');
      return;
    }
  
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const createdBy = user?.id;
  
      const res = await axios.post(
        'http://localhost:8080/api/extra-activities',
        {
          name: activityName,
          createdBy: createdBy,
        }
      );
  
      setMessage('✅ Activity added successfully!');
      setError('');
      setActivityName('');
      fetchActivities();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding activity');
      setMessage('');
    }
  };
  

  return (
    <>
    <SideMenu/>
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          ➕ Add Extra Activity
        </Typography>

        <TextField
          fullWidth
          label="Activity Name"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button fullWidth variant="contained" onClick={handleAddActivity}>
          Add Activity
        </Button>

        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">📋 Existing Activities:</Typography>
          <List>
            {activities.map((activity) => (
              <ListItem key={activity._id}>• {activity.name}</ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
    </>

  );
};

export default ExtraActivityPage;
