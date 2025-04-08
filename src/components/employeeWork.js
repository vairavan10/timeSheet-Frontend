import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Container, CircularProgress
} from '@mui/material';
import Layout from './layout';

const EmployeeSummaryPage = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to calculate summary
  const calculateStats = (entries) => {
    const grouped = {};
  
    entries.forEach((entry) => {
      const name = entry.name;
      if (!grouped[name]) grouped[name] = {};
  
      const dateKey = new Date(entry.date).toISOString().split('T')[0];
      if (!grouped[name][dateKey]) grouped[name][dateKey] = { hours: 0, leave: 0 };
  
      if (entry.typeOfWork === 'Regular Work') {
        grouped[name][dateKey].hours += entry.hours || 0;
      } else if (entry.typeOfWork === 'Leave') {
        grouped[name][dateKey].leave += (entry.leaveType === 'Half Day') ? 0.5 : 1;
      }
    });
  
    const results = [];
  
    Object.entries(grouped).forEach(([name, dailyData]) => {
      let hoursWorked = 0;
      let leaveCount = 0;
      let daysWorked = 0;
  
      Object.values(dailyData).forEach(({ hours, leave }) => {
        hoursWorked += hours;
        leaveCount += leave;
  
        // If leave is 0.5 and work hours > 0 => count as 0.5 day
        if (leave === 0.5 && hours > 0) {
          daysWorked += 0.5;
        } else if (leave === 0 && hours > 0) {
          daysWorked += 1;
        }
        // If leave is 1 full day, don't count it as work
      });
  
      const utilization = daysWorked > 0
        ? ((hoursWorked / (daysWorked * 8)) * 100).toFixed(2)
        : '0.00';
  
      results.push({
        name,
        hoursWorked,
        daysWorked,
        leaves: leaveCount,
        utilization: `${utilization}%`
      });
    });
  
    return results;
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('api/employeelog');
        const processed = calculateStats(res.data);
        setSummaryData(processed);
      } catch (err) {
        console.error('Failed to fetch employee logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Container sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom align="center">
          👥 Employee Work Summary
        </Typography>

        {loading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: '#1976d2' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Employee Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Hours Worked</TableCell>
                  <TableCell sx={{ color: 'white' }}>Days Worked</TableCell>
                  <TableCell sx={{ color: 'white' }}>Leaves</TableCell>
                  <TableCell sx={{ color: 'white' }}>Utilization (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summaryData.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.hoursWorked}</TableCell>
                    <TableCell>{row.daysWorked}</TableCell>
                    <TableCell>{row.leaves}</TableCell>
                    <TableCell>{row.utilization}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Layout>
  );
};

export default EmployeeSummaryPage;
