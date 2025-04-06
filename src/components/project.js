import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SideMenu from './sidebar';

const Project = () => {
  const [projectName, setProjectName] = useState('');
  const navigate = useNavigate();

  const handleAddProject = async () => {
    if (!projectName.trim()) return;

    try {
      const response = await fetch('http://localhost:8080/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName }),
      });

      if (response.ok) {
        const data = await response.json();
        setProjectName('');
        navigate(`/projects`);  // Redirect to the project details page
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <SideMenu />
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
  );
};

export default Project;
