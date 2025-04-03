import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,   // <-- Import for dropdown
} from '@mui/material';
import { styled } from '@mui/system';
import kologos from '../asset/kologos.png'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

const CreateContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
});

const Logo = styled('img')({
  width: '100px',
  marginBottom: '1rem',
});

const CreateBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: '100%',
  textAlign: 'center',
}));

const CreateUserPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');  // <-- Add role state
  const navigate = useNavigate();

  const handleCreateUser = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),  // <-- Include role
      });

      const data = await res.json();

      if (res.ok) {
        alert('User created successfully! You can now login.');
        navigate('/');
      } else {
        alert(data.message || 'Error creating user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <CreateContainer>
      <CreateBox elevation={3}>
        <Logo src={kologos} alt="Time Sheet Logo" />

        <Typography variant="h5" gutterBottom>
          Create New Account
        </Typography>
        <Typography variant="body1" gutterBottom>
          Fill in the details to register
        </Typography>

        <Box component="form" onSubmit={handleCreateUser} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Role Dropdown */}
          <TextField
            select
            fullWidth
            label="Select Role"
            variant="outlined"
            margin="normal"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="ceo">CEO</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Account
          </Button>
          <Button
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => navigate('/')}
          >
            Back to Login
          </Button>
        </Box>
      </CreateBox>
    </CreateContainer>
  );
};

export default CreateUserPage;
