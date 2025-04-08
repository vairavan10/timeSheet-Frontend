import React, { useState, useEffect } from 'react';
import axios from '../axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/system';
import Sidebaradmin from './sidebar';
import GroupsIcon from '@mui/icons-material/Groups';

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

  // ✅ Fetch teams using Axios
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams');
        setTeamOptions(response.data.teams || []);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, []);

  // ✅ Submit manager using Axios
  const handleSubmit = async () => {
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

    try {
      const response = await axios.post('/api/managers', newManager);
      alert(response.data.message || 'Manager created successfully!');
      setManagerName('');
      setManagerEmail('');
      setManagerPassword('');
      setSelectedTeam('');
    } catch (error) {
      console.error('Error creating manager:', error);
      alert(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    }
  };

  return (
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
                  autoComplete="new-password"
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
  );
};

export default ManagerForm;
