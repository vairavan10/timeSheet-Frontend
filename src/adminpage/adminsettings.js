import React from 'react';
import { Button, Box, Typography, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebaradmin from './sidebar';  // If you want to add sidebar, integrate it here

const AdminSettings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('role'); 

    // Redirect to login page
    navigate('/');
  };

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar (optional) */}
        {/* <Sidebaradmin /> */}

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f4f6f9',
            padding: 3
          }}
        >
          <Paper
            sx={{
              width: 400,
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: '#fff',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              }
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#333' }}
            >
              Admin Settings
            </Typography>
            
            <Divider sx={{ width: '100%', mb: 2 }} />

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: '#555',
                fontSize: 16,
                textAlign: 'center',
              }}
            >
               log out from the Admin.
            </Typography>

            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{
                width: '100%',
                padding: '12px 0',
                fontSize: 16,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              Logout
            </Button>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default AdminSettings;
