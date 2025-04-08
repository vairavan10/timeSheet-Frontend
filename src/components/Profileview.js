import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import axios from 'axios';
import SideMenu from './sidebar';
import Layout from './layout';

const EmployeesListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('api/employees/list'); // Replace with actual API endpoint
        setEmployees(response.data.data);  // Ensure you're accessing the correct part of the response
      } catch (error) {
        setError('Error fetching employee data');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    
    <Layout>
      {/* <SideMenu /> */}
      <div style={{ padding: '20px' }}>
 {/* Adjust the margin-left to your sidebar width */}
        <h2>Employee List</h2>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>


                <TableCell>Phone</TableCell>

                <TableCell>Designation</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" component={Link} to={`/employee/${employee._id}`}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      </Layout>
  );
};

export default EmployeesListPage;
