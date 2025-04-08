import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';
import kologos from '../asset/kologos.png';
import axios from '../axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' | 'error'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('api/users/login', { email, password });
      const data = response.data;

      localStorage.setItem('user', JSON.stringify(data.user));

      // Show success Snackbar
      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Navigate after a short delay
      setTimeout(() => {
        if (data.user.role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'Something went wrong. Try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Section */}
        <div className="login-left">
          <div className="login-quote">
            <img src={kologos} alt="Logo" style={{ width: '250px' }} />
            <h2 style={{ color: '#444' }}>Time Sheet</h2>
            <p>“Where your time goes, your growth flows”</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-box">
          <h2>Welcome Back!</h2>
          <p>Please login to continue</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-button">Login</button>
          </form>

          <p className="create-account">
            Don’t have an account?{' '}
            <span onClick={() => navigate('/register')}>Create New User</span>
          </p>
        </div>
      </div>

      {/* ✅ Dynamic Snackbar (Success/Error) */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
