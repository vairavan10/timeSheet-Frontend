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
  IconButton,
} from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import axios from '../axios'; // ✅ Adjust the path if needed

// 🔵 Styled container for form
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: 'auto',
  marginTop: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
}));

const TeamForm = () => {
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
const [teamToDelete, setTeamToDelete] = useState(null);
  

  // 🟢 Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams');
        const result = response.data;

        if (Array.isArray(result.teams)) {
          const formattedTeams = result.teams.map((team) => ({
            _id: team._id,
            name: team.name,
            createdAt: new Date(team.createdAt).toLocaleString(),
          }));
          setTeams(formattedTeams);
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  // 🟢 Create team
  const handleSubmit = async () => {
    if (!teamName.trim()) return;

    try {
      const response = await axios.post('/api/teams', { name: teamName });
      const res = response.data;

      if (res.success) {
        const newTeam = {
          _id: res.team?._id,
          name: teamName,
          createdAt: new Date().toLocaleString(),
        };
        setTeams([newTeam, ...teams]);
        setTeamName('');
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  // 🟡 Delete team
  const confirmDelete = (id) => {
    setTeamToDelete(id);
    setOpenDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/teams/${teamToDelete}`);
      setTeams((prev) => prev.filter((team) => team._id !== teamToDelete));
    } catch (error) {
      console.error('Error deleting team:', error);
    } finally {
      setOpenDialog(false);
      setTeamToDelete(null);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/teams/${id}`);
      setTeams((prev) => prev.filter((team) => team._id !== id));
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  // 🟡 Save edited team
  const handleSave = async (id) => {
    try {
      const response = await axios.patch(`/api/teams/${id}`, { name: editedName });
      const res = response.data;

      if (res.success) {
        const updatedTeams = teams.map((team, i) =>
          i === editingIndex ? { ...team, name: editedName } : team
        );
        setTeams(updatedTeams);
        setEditingIndex(null);
        setEditedName('');
      }
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
      <FormContainer elevation={3}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Create a New Team
        </Typography>

        <TextField
          fullWidth
          label="Team Name"
          variant="outlined"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2, borderRadius: 2 }}
        >
          Create Team
        </Button>
      </FormContainer>

      {/* 🔵 Team Table */}
      <Box mt={6} width="100%" maxWidth="900px">
        {teams.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Typography variant="h6" sx={{ p: 2 }}>
              Existing Teams
            </Typography>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Created</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={team._id}>
                    <TableCell>
                      {editingIndex === index ? (
                        <TextField
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          size="small"
                        />
                      ) : (
                        team.name
                      )}
                    </TableCell>
                    <TableCell>{team.createdAt}</TableCell>
                    <TableCell>
                      {editingIndex === index ? (
                        <>
                          <IconButton onClick={() => handleSave(team._id)} color="success">
                            <SaveIcon />
                          </IconButton>
                          <IconButton onClick={() => setEditingIndex(null)} color="error">
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            onClick={() => {
                              setEditingIndex(index);
                              setEditedName(team.name);
                            }}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => confirmDelete(team._id)} color="error">

                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body1" mt={4}>
            No teams found.
          </Typography>
        )}
      </Box>
      <Dialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this team? This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={handleConfirmDelete} color="error" variant="contained">
      Delete
    </Button>
  </DialogActions>
</Dialog>

    </Box>
    
  );
};

export default TeamForm;
