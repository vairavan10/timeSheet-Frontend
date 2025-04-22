import React, { useState } from 'react';
import { Box, TextField, Button, Card, CardContent, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './layout';

const Project = () => {
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();
  const theme = useTheme(); // Access current theme (light or dark)

  const handleAddProject = async () => {
    if (!projectName.trim()) return;

    try {
      const response = await axios.post('/api/project', { name: projectName });

      if (response.status === 200 || response.status === 201) {
        setProjectName('');
        navigate('/projects');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: theme.palette.background.default, // responds to theme
          transition: 'background-color 0.3s ease',
        }}
      >
        <Card
          elevation={3}
          sx={{
            width: 400,
            borderRadius: 2,
            padding: 4,
            backgroundColor: theme.palette.background.paper, // responsive to dark mode
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={3} textAlign="center">
              Create a New Project
            </Typography>

            <TextField
              label="Project Name"
              variant="outlined"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddProject}
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                py: 1.2,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              }}
            >
              Add Project
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default Project;
