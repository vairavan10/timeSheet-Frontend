import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Container, CircularProgress, Button, Box
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DescriptionIcon from '@mui/icons-material/Description';
import Layout from './layout';

const EmployeeSummaryPage = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateStats = (entries) => {
    const grouped = {};

    entries.forEach((entry) => {
      const name = entry.name;
      const dateKey = new Date(entry.date).toISOString().split('T')[0];

      if (!grouped[name]) grouped[name] = {};
      if (!grouped[name][dateKey]) grouped[name][dateKey] = { hours: 0, leave: 0 };

      if (entry.typeOfWork === 'Regular Work') {
        grouped[name][dateKey].hours += entry.hours || 0;
      } else if (entry.typeOfWork === 'Leave') {
        grouped[name][dateKey].leave += (entry.leaveType === 'Half Day') ? 0.5 : 1;
      }
    });

    const results = [];

    Object.entries(grouped).forEach(([name, dailyData]) => {
      let totalHoursWorked = 0;
      let totalLeaves = 0;
      const uniqueDates = Object.keys(dailyData).length;

      Object.values(dailyData).forEach(({ hours, leave }) => {
        totalHoursWorked += hours;
        totalLeaves += leave;
      });

      const daysWorked = uniqueDates - totalLeaves;
      const utilization = (daysWorked > 0)
        ? ((totalHoursWorked / (daysWorked * 8)) * 100).toFixed(2)
        : '0.00';

      results.push({
        name,
        hoursWorked: totalHoursWorked,
        daysWorked: parseFloat(daysWorked.toFixed(2)),
        leaves: totalLeaves,
        utilization: `${utilization}%`
      });
    });

    return results;
  };

  const handleDownloadCSV = () => {
    const header = ['Employee Name,Hours Worked,Days Worked,Leaves,Utilization (%)'];
    const rows = summaryData.map(row =>
      `${row.name},${row.hoursWorked},${row.daysWorked},${row.leaves},${row.utilization}`
    );
    const csvContent = [header, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employee_summary_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadStory = () => {
    const storyLines = summaryData.map(row =>
      `🧑‍💼 ${row.name} worked for ${row.hoursWorked} hours over ${row.daysWorked} days with ${row.leaves} leaves taken.\nTheir overall utilization was ${row.utilization}.\n`
    );
    const story = `📘 EMPLOYEE STORY REPORT\n\n${storyLines.join('\n')}`;

    const blob = new Blob([story], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employee_story_report.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          👥 Employee Work Summary
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleDownloadCSV}
          >
            Download Excel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DescriptionIcon />}
            onClick={handleDownloadStory}
          >
            Download Story Report
          </Button>
        </Box>

        {loading ? (
          <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />
        ) : (
        <TableContainer component={Paper} elevation={6} sx={{ borderRadius: 3, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1e88e5' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Employee Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Hours Worked</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Days Worked</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Leaves</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>Utilization (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summaryData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': { backgroundColor: '#f1f8ff' },
                    backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                    transition: 'background-color 0.3s ease'
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                  <TableCell>{row.hoursWorked}</TableCell>
                  <TableCell>{row.daysWorked}</TableCell>
                  <TableCell>{row.leaves}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>{row.utilization}</TableCell>
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
