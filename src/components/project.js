import React, { useState } from 'react';
import {
  Box, TextField, Button, Card, CardContent,
  Typography, useTheme, Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './layout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Project = () => {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const handleAddProject = async () => {
    if (!projectName.trim()) {
      setError('Project name cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('/api/project', { name: projectName });

      if (response.status === 200 || response.status === 201) {
        setProjectName('');
        navigate('/projects');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
          px: 2,
        }}
      >
        <Fade in={true} timeout={700}>
          <Card
            elevation={5}
            sx={{
              width: '100%',
              maxWidth: 440,
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.palette.mode === 'light'
                ? '0 4px 20px rgba(0, 0, 0, 0.05)'
                : '0 4px 20px rgba(255, 255, 255, 0.1)',
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                fontWeight={700}
                textAlign="center"
                gutterBottom
                color="primary"
              >
                🚀 Create a New Project
              </Typography>

              <Typography
                variant="body2"
                textAlign="center"
                mb={3}
                color="text.secondary"
              >
                Start organizing your work by adding a new project.
              </Typography>

              <TextField
                label="Project Name"
                variant="outlined"
                fullWidth
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setError('');
                }}
                error={!!error}
                helperText={error}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddProject}
                startIcon={<AddCircleOutlineIcon />}
                sx={{
                  py: 1.4,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  fontSize: '1rem',
                  background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #1565c0, #1e88e5)',
                  }
                }}
              >
                Add Project
              </Button>
            </CardContent>
          </Card>
        </Fade>
      </Box>
    </Layout>
  );
};

export default Project;
