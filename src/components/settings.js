import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock, Logout } from '@mui/icons-material';
import axios from 'axios';
import Layout from './layout';

const Settings = () => {
  const theme = useTheme();
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
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id;
      const role = user?.role;

      let url;
      if (role === 'Employee') {
        url = `api/employees/${userId}/change-password`;
      } else if (role === 'manager') {
        url = `api/managers/${userId}/change-password`;
      } else {
        url = `api/user/${userId}/change-password`;
      }

      const res = await axios.put(url, { currentPassword, newPassword });

      if (res.status === 200) {
        setResponseMessage('✅ Password changed successfully.');
        setError('');
        setTimeout(() => handleCloseDialog(), 1500);
      }
    } catch (err) {
      const backendMessage = err?.response?.data?.message || 'Something went wrong';
      setError(`❌ ${backendMessage}`);
      setResponseMessage('');
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          p: 4,
          minHeight: '100vh',
          backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f0f4f8',
          color: theme.palette.text.primary,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Settings
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}>
          <Button
            startIcon={<Lock />}
            fullWidth
            variant="outlined"
            onClick={handleOpenDialog}
          >
            Change Password
          </Button>

          <Button
            startIcon={<Logout />}
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        {/* Change Password Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
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
            {responseMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {responseMessage}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" onClick={handleChangePassword}>
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default Settings;
