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
      if (!grouped[name]) grouped[name] = { regular: [], leaveCount: 0 };

      if (entry.typeOfWork === 'Regular Work') {
        grouped[name].regular.push(entry);
      } if (entry.typeOfWork === 'Leave') {
        const isHalfDay = entry.leaveType === 'Half Day';
        grouped[name].leaveCount += isHalfDay ? 0.5 : 1;
}

    });

    const results = [];

    Object.entries(grouped).forEach(([name, { regular, leaveCount }]) => {
      const hoursWorked = regular.reduce((sum, e) => sum + (e.hours || 0), 0);
      const uniqueDays = new Set(
        regular.map(e => new Date(e.date).toISOString().split('T')[0])
      ).size;
      const utilization = uniqueDays > 0
        ? ((hoursWorked / (uniqueDays * 8)) * 100).toFixed(2)
        : '0.00';

      results.push({
        name,
        hoursWorked,
        daysWorked: uniqueDays,
        leaves: leaveCount,
        utilization: `${utilization}%`
      });
    });

    return results;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/employeelog');
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
