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
  Slide,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Lock, Logout } from '@mui/icons-material';
import axios from 'axios';
import Layout from './layout';

const SlideUp = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Settings = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);


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
          backgroundColor: theme.palette.mode === 'dark' ? '#0f0f0f' : '#f9fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 5,
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" color="primary">
          ⚙️ Settings
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Button
            startIcon={<Lock />}
            variant="contained"
            onClick={handleOpenDialog}
            sx={{
              py: 1.3,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              background: 'linear-gradient(to right, #1976d2, #42a5f5)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              '&:hover': {
                background: 'linear-gradient(to right, #1565c0, #1e88e5)',
              },
            }}
          >
            Change Password
          </Button>

          <Divider />

          <Button
  startIcon={<Logout />}
  variant="outlined"
  color="error"
  onClick={() => setLogoutDialogOpen(true)}
  sx={{
    py: 1.3,
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    borderRadius: 2,
    borderColor: 'error.main',
    '&:hover': {
      backgroundColor: theme.palette.error.light,
    },
  }}
>
  Logout
</Button>

        </Box>

        {/* Password Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          TransitionComponent={SlideUp}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 2,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <DialogTitle fontWeight="bold" color="primary">
            🔒 Change Password
          </DialogTitle>
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
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleChangePassword}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                '&:hover': {
                  background: 'linear-gradient(to right, #1565c0, #1e88e5)',
                },
              }}
            >
              Change
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
  open={logoutDialogOpen}
  onClose={() => setLogoutDialogOpen(false)}
  TransitionComponent={SlideUp}
  fullWidth
  maxWidth="xs"
  PaperProps={{
    sx: {
      borderRadius: 3,
      p: 2,
      backgroundColor: theme.palette.background.paper,
    },
  }}
>
  <DialogTitle color="error" fontWeight="bold">
    Confirm Logout
  </DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to logout?
    </Typography>
  </DialogContent>
  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => setLogoutDialogOpen(false)}
      sx={{ textTransform: 'none' }}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      color="error"
      onClick={() => {
        setLogoutDialogOpen(false);
        handleLogout();
      }}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        px: 3,
      }}
    >
      Logout
    </Button>
  </DialogActions>
</Dialog>

      </Box>
    </Layout>
  );
};

export default Settings;
