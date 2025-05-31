import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';
import kologos from '../asset/kologos.png';
import axios from '../axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Visibility, VisibilityOff } from "@mui/icons-material";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('api/users/login', { email, password });
      const data = response.data;

      localStorage.setItem('user', JSON.stringify(data.user));


      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);


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

        <div className="login-left">
          <div className="login-quote">
            <img src={kologos} alt="Logo" style={{ width: '250px' }} />
            <h2 style={{ color: '#444' }}>Time Sheet</h2>
            <p>“Where your time goes, your growth flows”</p>
          </div>
        </div>

        <div className="login-box">
          <h2>Welcome!!</h2>
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
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </span>
            </div>


            <button type="submit" className="login-button">Login</button>
          </form>

        </div>
      </div>

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
