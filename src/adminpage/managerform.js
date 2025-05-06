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
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import Sidebaradmin from './sidebar';
import GroupsIcon from '@mui/icons-material/Groups';

const PageContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f4f6f8',
  padding: '2rem',
});

const ContentContainer = styled(Box)({
  width: '100%',
  maxWidth: '700px',
  padding: '2rem',
});

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: '16px',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 26px rgba(0, 0, 0, 0.15)',
  },
}));

const ManagerForm = () => {
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teamOptions, setTeamOptions] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams');
        setTeamOptions(response.data.teams || []);
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to load teams', severity: 'error' });
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!managerName || !managerEmail || !managerPassword || !selectedTeam) {
      setSnackbar({ open: true, message: 'Please fill in all fields', severity: 'warning' });
      return;
    }

    try {
      const response = await axios.post('/api/managers', {
        name: managerName,
        email: managerEmail,
        password: managerPassword,
        team: selectedTeam,
      });

      setSnackbar({ open: true, message: 'Manager created successfully!', severity: 'success' });
      setManagerName('');
      setManagerEmail('');
      setManagerPassword('');
      setSelectedTeam('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Something went wrong.',
        severity: 'error',
      });
    }
  };

  return (
    <PageContainer>
      <ContentContainer>
        <FormContainer elevation={3}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            <GroupsIcon sx={{ fontSize: 40, mr: 1, color: '#1976d2' }} />
            <Typography variant="h4" fontWeight="bold">
              Add New Manager
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Manager Name"
                  variant="outlined"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
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
                  {teamOptions.length > 0 ? (
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
                  type="submit"
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontWeight: 'bold',
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: '#125ea3',
                    },
                  }}
                >
                  Create Manager
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormContainer>

        {/* Snackbar */}
        <Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <Alert
    severity={snackbar.severity}
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    sx={{
      width: '100%',
      minWidth: '300px',
      fontSize: '1rem',
      paddingY: 2,
      paddingX: 3,
    }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

      </ContentContainer>
    </PageContainer>
  );
};

export default ManagerForm;
