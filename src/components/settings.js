import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar'

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {

    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('role'); 

    // Redirect to login page
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
      }}
    >
        <Sidebar/>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{ mt: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Settings;
