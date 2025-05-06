import React, { useState, useEffect } from 'react';
import axios from '../axios'; // ✅ Adjusted path for consistency
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  
  
} from '@mui/material';

import { styled } from '@mui/system';
import Sidebaradmin from './sidebar';
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


// Main layout wrapper
const PageContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f9fafc',
});

// Page content next to sidebar
const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

// Table wrapper with modern style
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  maxWidth: '1000px',
  margin: 'auto',
  backgroundColor: '#ffffff',
  overflow: 'hidden',
}));

// Hover effect for table rows
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#f1f1f1',
  },
}));

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [selectedManagerId, setSelectedManagerId] = useState(null);
const [editDialogOpen, setEditDialogOpen] = useState(false);
const [editData, setEditData] = useState({
  _id: '',
  name: '',
  email: '',
  team: '', // will hold team ID
});
const [teams, setTeams] = useState([]);

useEffect(() => {
  const fetchTeams = async () => {
    try {
      const res = await axios.get('/api/teams');
      setTeams(res.data?.teams || []);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };
  fetchTeams();
}, []);
const fetchManagers = async () => {
  try {
    const response = await axios.get('/api/managers');
    const managers = response?.data?.managers || [];
    setRows(managers);
  } catch (err) {
    console.error('Error fetching data:', err);
    setError('Failed to load data');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchManagers();
}, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/managers');
        const managers = response?.data?.managers || [];
        setRows(managers);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleDeleteClick = (managerId) => {
    setSelectedManagerId(managerId);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/managers/${selectedManagerId}`);
      setRows(prev => prev.filter(m => m._id !== selectedManagerId));
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleteDialogOpen(false);
    }
  };
  
  const handleEditClick = async (managerId) => {
    try {
      const res = await axios.get(`/api/managers/${managerId}`);
      const manager = res.data;
      console.log("......",manager.manager.email)
  
      setEditData({
        _id: manager.manager._id,
        name: manager.manager.name,
        email: manager.manager.email,
        team: manager.manager.team,
      });
  
      setEditDialogOpen(true);
    } catch (error) {
      console.error("Error fetching manager:", error);
    }
  };
  
  const handleEditChange = (field, value) => {
    if (field === 'team') {
      setEditData(prev => ({
        ...prev,
        team: { ...prev.team, name: value }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  const handleSaveEdit = async () => {
    try {
      await axios.patch(`/api/managers/${editData._id}`, {
        name: editData.name,
        email: editData.email,
        team: editData.team,
      });
  
      setEditDialogOpen(false);
      fetchManagers(); // reload the list
    } catch (error) {
      console.error("Error updating manager:", error);
    }
  };
  
  const handleDeleteFromEdit = async () => {
    try {
      await axios.delete(`/api/managers/${editData._id}`);
      setRows(prev => prev.filter(manager => manager._id !== editData._id));
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };
        
  
  return (
    <PageContainer>
      {/* <Sidebaradmin /> */}
      <ContentContainer>
        <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
          Manager Overview
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={6}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" mt={6}>
            {error}
          </Typography>
        ) : (
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f0f4f8' }}>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Team</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row, index) => (
                    <StyledTableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row?.team?.name || 'N/A'}</TableCell>
                      <TableCell align="center">
  <Tooltip title="Edit">
    <IconButton onClick={() => handleEditClick(row._id)}>
      <EditIcon color="primary" />
    </IconButton>
  </Tooltip>
  <Tooltip title="Delete">
    <IconButton onClick={() => handleDeleteClick(row._id)}>
      <DeleteIcon color="error" />
    </IconButton>
  </Tooltip>
</TableCell>

                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}
      </ContentContainer>
      <Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this manager? This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
    <Button onClick={handleConfirmDelete} color="error" variant="contained">
      Delete
    </Button>
  </DialogActions>
</Dialog>
<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Edit Manager</DialogTitle>
  <DialogContent>
    <TextField
      label="Name"
      fullWidth
      margin="normal"
      value={editData.name}
      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
    />
    <TextField
      label="Email"
      fullWidth
      margin="normal"
      value={editData.email}
      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
    />

    <FormControl fullWidth margin="normal">
      <InputLabel>Team</InputLabel>
      <Select
        value={editData.team}
        onChange={(e) => setEditData({ ...editData, team: e.target.value })}
        label="Team"
      >
        {teams.map((team) => (
          <MenuItem key={team._id} value={team._id}>
            {team.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
    <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
  </DialogActions>
</Dialog>


    </PageContainer>
  );
};

export default Dashboard;
