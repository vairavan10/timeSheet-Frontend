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
  Divider,
  Container,
} from '@mui/material';
import axios from 'axios';
import Layout from './layout';
import { IconButton } from '@mui/material';
import { Edit, Check, Close ,Delete } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';




const ExtraActivityPage = () => {
  const [activityName, setActivityName] = useState('');
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [editId, setEditId] = useState(null); // current editing ID
  const [editValue, setEditValue] = useState(''); // input for editing

  const [confirmOpen, setConfirmOpen] = useState(false);
const [selectedId, setSelectedId] = useState(null);

  const fetchActivities = async () => {
    try {
      const res = await axios.get('api/extra-activities');
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
      setMessage('');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const createdBy = user?.id;

      await axios.post('api/extra-activities', {
        name: activityName,
        createdBy: createdBy,
      });

      setMessage('✅ Activity added successfully!');
      setError('');
      setActivityName('');
      fetchActivities();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding activity');
      setMessage('');
    }
  };

  const startEditing = (id, currentName) => {
    setEditId(id);
    setEditValue(currentName);
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditValue('');
  };

  const saveEditedActivity = async (id) => {
    if (!editValue.trim()) return;

    try {
      await axios.put(`api/extra-activities/${id}`, {
        name: editValue,
      });

      setMessage('✅ Activity updated successfully!');
      setEditId(null);
      setEditValue('');
      fetchActivities();
    } catch (err) {
      setError('Error updating activity');
    }
  };
  const openConfirmDialog = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };
  
  const closeConfirmDialog = () => {
    setSelectedId(null);
    setConfirmOpen(false);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`api/extra-activities/${selectedId}`);
      setMessage('🗑️ Activity deleted successfully!');
      setError('');
      fetchActivities();
    } catch (err) {
      setError('Error deleting activity');
      setMessage('');
    } finally {
      closeConfirmDialog();
    }
  };
  


  return (
    <Layout>
      <Box sx={{ display: 'flex' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: 3,
            pt: 4,
            pb: 8,
            minHeight: '100vh',
            backgroundColor: 'background.default',
            color: 'text.primary',
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={1}
              sx={{
                p: 4,
                borderRadius: 2,
                backgroundColor: 'background.paper',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Add Extra Activity
              </Typography>

              <TextField
                fullWidth
                label="Activity Name"
                variant="outlined"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                onClick={handleAddActivity}
                sx={{ mb: 2, textTransform: 'none' }}
              >
                Add Activity
              </Button>

              {message && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                Existing Activities
              </Typography>

              <List dense>
                {activities.length === 0 ? (
                  <Typography color="text.secondary">No activities yet.</Typography>
                ) : (
                  activities.map((activity) => (
                    <ListItem
                      key={activity._id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 1,
                        py: 0.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      {editId === activity._id ? (
                        <>
                          <TextField
                            size="small"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            sx={{ flex: 1, mr: 1 }}
                          />
                          <IconButton onClick={() => saveEditedActivity(activity._id)} color="success">
                            <Check />
                          </IconButton>
                          <IconButton onClick={cancelEditing} color="error">
                            <Close />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <Typography variant="body1" sx={{ flex: 1 }}>
                            • {activity.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <IconButton onClick={() => startEditing(activity._id, activity.name)} size="small" color="primary">
    <Edit />
  </IconButton>
  <IconButton onClick={() => openConfirmDialog(activity._id)} size="small" color="error">
  <Delete />
</IconButton>

</Box>

                        </>
                      )}
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Container>
        </Box>
      </Box>
      <Dialog
  open={confirmOpen}
  onClose={closeConfirmDialog}
>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this activity? This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={closeConfirmDialog} color="primary">
      Cancel
    </Button>
    <Button onClick={handleConfirmDelete} color="error" autoFocus>
      Delete
    </Button>
  </DialogActions>
</Dialog>

    </Layout>
  );
};

export default ExtraActivityPage;


