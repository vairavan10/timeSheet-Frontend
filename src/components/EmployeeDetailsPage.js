import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axios';
import Layout from './layout';
import { Box, Typography, Avatar, Grid, Divider, Paper } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`api/employees/${id}`);
        setEmployee(response.data);
      } catch {
        setError('Error fetching employee details');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, [id]);

  if (loading)
    return (
      <Typography align="center" mt={8} variant="h6" sx={{ color: '#444' }}>
        Loading...
      </Typography>
    );
  if (error)
    return (
      <Typography align="center" mt={8} variant="h6" sx={{ color: '#d32f2f' }}>
        {error}
      </Typography>
    );
  if (!employee)
    return (
      <Typography align="center" mt={8} variant="h6" sx={{ color: '#666' }}>
        No employee found
      </Typography>
    );

  return (
    <Layout>
      <Paper
        elevation={6}
        sx={{
          maxWidth: 720,
          mx: 'auto',
          mt: 8,
          p: 5,
          borderRadius: 4,
          bgcolor: '#fff',
          color: '#222',
          fontFamily: `'Inter', sans-serif`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 5,
          }}
        >
          <Avatar
            src={
              employee.image
                ? `${axios.defaults.baseURL}${employee.image.replace(/\\/g, '/')}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random`
            }
            alt={employee.name}
            sx={{
              width: 140,
              height: 140,
              mb: 2,
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              border: '3px solid #1976d2', // MUI default primary blue hex color
            }}
          />
          <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: '#111' }}>
            {employee.name}
          </Typography>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ color: '#1976d2', letterSpacing: 0.5 }}
          >
            {employee.role}
          </Typography>
        </Box>

        <Divider sx={{ mb: 5, borderColor: '#eee' }} />

        {/* Contact Info */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} display="flex" alignItems="center" gap={1}>
            <EmailIcon sx={{ color: '#555' }} />
            <Typography variant="body1" sx={{ wordBreak: 'break-word', color: '#333' }}>
              {employee.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} display="flex" alignItems="center" gap={1}>
            <PhoneIcon sx={{ color: '#555' }} />
            <Typography variant="body1" sx={{ color: '#333' }}>
              {employee.phone}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 5, borderColor: '#eee' }} />

        {/* Details Grid */}
        <Grid container spacing={4}>
          {[
            { label: 'Designation', value: employee.designation },
            { label: 'Skills', value: employee.skills.join(', ') },
            {
              label: 'Experience',
              value: `${employee.experience} ${employee.experience === 1 ? 'year' : 'years'}`,
            },
            {
              label: 'Joining Date',
              value: new Date(employee.joiningDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            },
          ].map(({ label, value }) => (
            <Grid item xs={12} sm={6} key={label}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                gutterBottom
                sx={{ color: '#666', letterSpacing: 0.5 }}
              >
                {label}
              </Typography>
              <Typography
                variant="body1"
                sx={{ whiteSpace: 'pre-line', fontSize: '1rem', color: '#222' }}
              >
                {value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Layout>
  );
};

export default EmployeeDetailsPage;
