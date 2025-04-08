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
import { styled } from '@mui/system';
import Sidebaradmin from './sidebar';

// Page layout container with sidebar
const PageContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f4f6f8',
});

// Content beside sidebar
const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

// Centered Welcome Card
const WelcomeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  marginBottom: theme.spacing(4),
  maxWidth: '700px',
  margin: 'auto',
}));

// Styled Table Container
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  maxWidth: '1000px',
  margin: 'auto',
  backgroundColor: '#fff',
}));

const Dashboard = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <PageContainer>
      {/* <Sidebaradmin /> */}
      <ContentContainer>


        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
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
                  <TableCell><strong>Team</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row?.team?.name || 'N/A'}</TableCell>
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
      </ContentContainer>
    </PageContainer>
  );
};

export default Dashboard;
