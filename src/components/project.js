import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './layout';

const Project = () => {
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();

  const handleAddProject = async () => {
    if (!projectName.trim()) return;

    try {
      const response = await axios.post('/api/project', { name: projectName });

      if (response.status === 200 || response.status === 201) {
        setProjectName('');
        navigate('/projects'); // Redirect to project list page
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <TextField
          label="Enter Project Name"
          variant="outlined"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          sx={{ mb: 2, width: '300px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddProject}>
          Add Project
        </Button>
      </Box>
    </Layout>
  );
};

export default Project;
