import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { styled } from '@mui/system';
import Sidebaradmin from './sidebar';

// Styled container for the page content
const DashboardContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  marginLeft: '250px',
  padding: '3rem',
  backgroundColor: '#f9f9f9',
  minHeight: '100vh',
  [theme.breakpoints.down('sm')]: {
    marginLeft: 0,
    marginTop: '80px',
    padding: '1.5rem',
  },
}));

// Paper Card for the Welcome Message
const WelcomeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
  maxWidth: '600px',
  margin: '0 auto',
}));

// Table Container Styles
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
}));

const Dashboard = () => {
  const [rows, setRows] = useState([]);       // State for table data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null);    // State for handling errors

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/managers'); 
        // Replace with your API endpoint
        
        const managers = response?.data?.managers; // Safely access the managers array
        console.log('Fetched managers:', managers); // ✅ Log the fetched data
        
        setRows(managers); // Set the state with the data
        console.log('Rows state set:', managers);   // ✅ Confirm what you set
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  


  return (
    <DashboardContainer>
      <WelcomeCard elevation={3}>
        <Typography variant="h3" color="primary" fontWeight={600} gutterBottom>
          Welcome Admin!
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Explore your dashboard to manage teams, view reports, and customize settings.
        </Typography>
      </WelcomeCard>

      {/* Table Section */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" mt={4}>
          {error}
        </Typography>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Teams</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row?.team?.name}</TableCell>
                  </TableRow>
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
    </DashboardContainer>
  );
};

export default Dashboard;
