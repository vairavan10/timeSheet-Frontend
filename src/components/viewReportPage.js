import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SideMenu from "./sidebar";
import "../style/ViewReportPage.css"; // Import updated CSS file

const ViewReportPage = () => {
  const { projectId } = useParams();
  const [dateRanges, setDateRanges] = useState([]);
  const [selectedRange, setSelectedRange] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available date ranges
  useEffect(() => {
    const fetchDateRanges = async () => {
      try {
        const response = await axios.get(
          `api/projectdetails/${projectId}/available-dates`
        );
        setDateRanges(response.data);
      } catch (error) {
        setError("❌ Error fetching available dates.");
      }
    };

    fetchDateRanges();
  }, [projectId]);

  // Fetch report for selected date range
  const fetchReport = async () => {
    if (!selectedRange) {
      setError("⚠️ Please select a date range.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `api/projectdetails/${projectId}/details`,
        { params: { fromDate: selectedRange.fromDate, toDate: selectedRange.toDate } }
      );
      setReport(response.data);
    } catch (error) {
      setError("❌ Error fetching report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideMenu />
      <Box className="report-container">
        <Paper elevation={6} className="report-card">
          <Typography variant="h3" className="report-title">
            📊 Project Report
          </Typography>

          {/* Date Range Selection */}
          <Box className="date-picker-container">
  <FormControl className="date-dropdown" variant="outlined">
    <InputLabel id="date-range-label">📅 Select Date Range</InputLabel>
    <Select
      labelId="date-range-label"
      value={selectedRange}
      onChange={(e) => setSelectedRange(e.target.value)}
      displayEmpty
      className="date-select"
    >
      {dateRanges.map((range, index) => (
        <MenuItem key={index} value={range}>
          {new Date(range.fromDate).toLocaleDateString()} - {new Date(range.toDate).toLocaleDateString()}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <Button 
    variant="contained" 
    onClick={fetchReport} 
    className="fetch-button"
  >
    🔍 Get Report
  </Button>
</Box>



          {/* Error Message */}
          {error && (
            <Typography color="error" className="error-message">
              {error}
            </Typography>
          )}

          {/* Loading Indicator */}
          {loading && (
            <Box className="loading-container">
              <CircularProgress color="secondary" />
            </Box>
          )}

          {/* Report Display in Table Format */}
          {report && (
            <TableContainer component={Paper} className="report-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>📅 From</strong></TableCell>
                    <TableCell><strong>📅 To</strong></TableCell>
                    <TableCell><strong>📌 Project ID</strong></TableCell>
                    <TableCell><strong>🔗 Dependencies</strong></TableCell>
                    <TableCell><strong>⏳ Hours Spent</strong></TableCell>
                    <TableCell><strong>📊 Utilization</strong></TableCell>
                    <TableCell><strong>📌 Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{new Date(report.fromDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(report.toDate).toLocaleDateString()}</TableCell>
                    <TableCell>{report.projectId}</TableCell>
                    <TableCell>{report.dependencies}</TableCell>
                    <TableCell>{report.hoursSpent}</TableCell>
                    <TableCell>{report.utilization}</TableCell>
                    <TableCell>{report.status}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default ViewReportPage;
