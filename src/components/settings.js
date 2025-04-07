import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import axios from 'axios';
import Layout from './layout';

const Settings = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setResponseMessage('');
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleChangePassword = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user')); // ✅ Parse it
      const userId = user?.id;
      const role = user?.role;
  
      // ✅ Choose the correct endpoint based on role
      let url;
      if (role === 'Employee') {
        url = `http://localhost:8080/api/employees/${userId}/change-password`;
      } else if (role === 'manager') {
        url = `http://localhost:8080/api/managers/${userId}/change-password`;
      } else {
        url = `http://localhost:8080/api/user/${userId}/change-password`;
      }
  
      const res = await axios.put(url, {
        currentPassword,
        newPassword,
      });
  
      if (res.status === 200) {
        setResponseMessage('✅ Password changed successfully.');
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => handleCloseDialog(), 1500);
      }
    } catch (err) {
      const backendMessage = err?.response?.data?.message || 'Something went wrong';
      setResponseMessage('');
      setError(`❌ ${backendMessage}`);
    }
  };
  
  return (
    <Layout>
    <Box sx={{ display: 'flex' }}>
      {/* <Sidebar /> */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          backgroundColor: '#f9f9f9',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {/* Change Password Card */}
          <Card sx={{ width: 250 }}>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Change Password
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleOpenDialog}
              >
                Change
              </Button>
            </CardContent>
          </Card>

          {/* Logout Card */}
          <Card sx={{ width: 250 }}>
            <CardContent>
              <Typography variant="h6" align="center" gutterBottom>
                Logout
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Change Password Popup */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              margin="normal"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {responseMessage && <Alert severity="success" sx={{ mt: 2 }}>{responseMessage}</Alert>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleChangePassword}>
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
    </Layout>
  );
};

export default Settings;
