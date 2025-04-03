import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import Sidebaradmin from './sidebar'; // Sidebar integrated here
import GroupsIcon from '@mui/icons-material/Groups'; // Optional icons

const PageContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f4f6f8',
});

const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '600px',
  margin: 'auto',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  borderRadius: '16px',
}));

const ManagerForm = () => {
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamOptions, setTeamOptions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/teams')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Fetched teams:', result.teams); // Debug log
        setTeamOptions(result.teams);
      })
      .catch((error) => {
        console.error('Error fetching teams:', error);
      });
  }, []);

  const handleSubmit = () => {
    if (!managerName || !managerEmail || !managerPassword || !selectedTeam) {
      alert('Please fill in all fields');
      return;
    }

    const newManager = {
      name: managerName,
      email: managerEmail,
      password: managerPassword,
      team: selectedTeam,
    };

    fetch('http://localhost:8000/api/managers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newManager),
    })
      .then(async (response) => {
        const result = await response.json();

        if (!response.ok) {
          alert(result.message || 'Failed to create manager');
          throw new Error(result.message);
        }

        alert(result.message || 'Manager created successfully!');

        // Reset form fields after success
        setManagerName('');
        setManagerEmail('');
        setManagerPassword('');
        setSelectedTeam('');
      })
      .catch((error) => {
        console.error('Error creating manager:', error);
        if (!error.message) {
          alert('Something went wrong. Please try again.');
        }
      });
  };

  return (
    <>
      {/* <Sidebaradmin active="Manager" onMenuSelect={() => {}} /> */}

      <PageContainer>
        <ContentContainer>
          <FormContainer elevation={3}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <GroupsIcon sx={{ fontSize: '2rem', marginRight: '0.5rem', color: '#1976d2' }} />
              <Typography variant="h5" fontWeight="bold">
                Add New Manager
              </Typography>
            </Box>

            <form autoComplete="off">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Manager Name"
                    variant="outlined"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    autoComplete="off"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    autoComplete="off"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={managerPassword}
                    onChange={(e) => setManagerPassword(e.target.value)}
                    autoComplete="new-password" // Helps prevent browser autofill on password fields
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Select Team"
                    variant="outlined"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    autoComplete="off"
                  >
                    <MenuItem value="">None</MenuItem>
                    {Array.isArray(teamOptions) && teamOptions.length > 0 ? (
                      teamOptions.map((team) => (
                        <MenuItem key={team._id} value={team._id}>
                          {team.name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No teams available</MenuItem>
                    )}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    Create Manager
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormContainer>
        </ContentContainer>
      </PageContainer>
    </>
  );
};

export default ManagerForm;
