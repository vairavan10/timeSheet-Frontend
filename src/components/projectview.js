import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import SideMenu from './sidebar';

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/project'); // API endpoint
        setProjects(response.data.data);
      } catch (error) {
        setError('Error fetching projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <SideMenu />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Add Project Button */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/add-projects"
          sx={{ mb: 3 }}
        >
          Add Project
        </Button>

        {/* Project Table */}
        <TableContainer component={Paper} sx={{ width: '90%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" component={Link} to={`/project/${project._id}`}>
                      Add Details
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      component={Link}
                      to={`/project/${project._id}/report`}
                      sx={{ ml: 2 }}
                    >
                      View Reports
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ProjectListPage;
