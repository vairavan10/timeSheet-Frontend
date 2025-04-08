import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from '../axios'; // Make sure this points to your axios instance

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme?.spacing(4) || '32px',
  maxWidth: '600px',
  margin: 'auto',
  marginTop: theme?.spacing(4) || '32px',
}));

const TeamForm = () => {
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState([]);

  // ✅ Fetch teams on mount using axios
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams');
        const result = response.data;

        console.log('Fetched teams:', result.teams);

        if (Array.isArray(result.teams)) {
          const formattedTeams = result.teams.map((team) => ({
            name: team.name,
            createdAt: new Date(team.createdAt).toLocaleString(),
          }));
          setTeams(formattedTeams);
        } else {
          console.error('Teams data is not an array');
          setTeams([]);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      }
    };

    fetchTeams();
  }, []);

  // ✅ Create new team using axios
  const handleSubmit = async () => {
    if (!teamName.trim()) {
      console.log('Team name cannot be empty');
      return;
    }

    try {
      const response = await axios.post('/api/teams', { name: teamName });
      const res = response.data;

      if (res.success) {
        console.log('Team created successfully!');

        const newTeam = {
          name: teamName,
          createdAt: new Date().toLocaleString(),
        };

        setTeams([newTeam, ...teams]);
        setTeamName('');
      } else {
        console.log(res.message || 'Error creating team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flexGrow: 1, padding: 4 }}>
        <FormContainer elevation={3}>
          <Typography variant="h5" gutterBottom>
            Add a New Team
          </Typography>

          <TextField
            fullWidth
            label="Team Name"
            margin="normal"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ marginTop: '1.5rem' }}
          >
            Create Team
          </Button>
        </FormContainer>

        {teams.length > 0 ? (
  <Box display="flex" justifyContent="center" mt={4}>
    <TableContainer component={Paper} sx={{ maxWidth: 600, width: '100%' }}>
      <Typography variant="h6" sx={{ padding: 2 }}>
        Existing Teams
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Team Name</strong></TableCell>
            <TableCell><strong>Created Date</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={index}>
              <TableCell>{team.name}</TableCell>
              <TableCell>{team.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
) : (
  <Typography variant="body1" sx={{ marginTop: 4 }}>
    No teams found.
  </Typography>
)}

      </Box>
    </Box>
  );
};

export default TeamForm;
