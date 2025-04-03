import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom'; // Navigate to create user page
import kologos from '../asset/kologos.png'; // update the path if needed

const LoginContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
});

const LoginBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 400,
  width: '100%',
  textAlign: 'center',
}));

const Logo = styled('img')({
  width: '100px',
  marginBottom: '1rem',
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // React Router navigate

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful:', data);
  
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
  
        alert(`Login successful! Welcome ${data.user.email} as ${data.user.role}`);
        console.log("full", data.user);  // Log full user data
  
        // ✅ Navigate based on user role
        if (data.user.role === 'admin') {
          navigate('/admindashboard'); // Update this route if needed
        } else {
          navigate('/dashboard'); // Regular user dashboard
        }
  
      } else {
        // Show error from backend (like incorrect password)
        setError(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Try again later.');
    }
  };

  
  

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <LoginContainer>
      <LoginBox elevation={3}>
        <Logo src={kologos} alt="Time Sheet Logo" />
        <Typography variant="h5" gutterBottom>
          Welcome to Time Sheet
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please login to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link component="button" onClick={handleCreateAccount}>
            Create New User
          </Link>
        </Typography>
      </LoginBox>
    </LoginContainer>
  );
};

export default LoginPage;

