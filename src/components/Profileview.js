// import React, { useEffect, useState } from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Avatar,
//   Button,
//   Box,
//   Skeleton,
//   Alert,
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import Layout from './layout';
// import PersonIcon from '@mui/icons-material/Person';

// const EmployeesListPage = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const managerId = JSON.parse(localStorage.getItem('user'))?.id;

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const response = await axios.get(`/api/employees/list?managerId=${managerId}`);
//         setEmployees(response.data.data);
//       } catch (error) {
//         setError('❌ Failed to load employee data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   return (
//     <Layout>
//       <Box
//         sx={{
//           p: 4,
//           minHeight: '100vh',
//           backgroundColor: (theme) => theme.palette.background.default,
//         }}

//       >
//         <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
//           Employee Directory
//         </Typography>

//         {loading ? (
//           <Grid container spacing={3}>
//             {[...Array(6)].map((_, i) => (
//               <Grid item xs={12} sm={6} md={4} key={i}>
//                 <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
//               </Grid>
//             ))}
//           </Grid>
//         ) : error ? (
//           <Alert severity="error">{error}</Alert>
//         ) : (
//           <Grid container spacing={3}>
//             {employees.map((employee) => (
//               <Grid item xs={12} sm={6} md={4} key={employee._id}>
//                 <Card
//                   sx={{
//                     borderRadius: 4,
//                     boxShadow: 6,
//                     backgroundColor: (theme) =>
//                       theme.palette.mode === 'dark' ? '#1e1e2f' : '#fff',
//                     transition: 'transform 0.3s ease',
//                     '&:hover': {
//                       transform: 'scale(1.03)',
//                     },
//                   }}
//                 >
//                   <CardContent sx={{ textAlign: 'center' }}>
//                     <Avatar
//                       sx={{
//                         bgcolor: '#1976d2',
//                         width: 64,
//                         height: 64,
//                         margin: '0 auto',
//                         mb: 2,
//                       }}
//                     >
//                       <PersonIcon fontSize="large" />
//                     </Avatar>
//                     <Typography variant="h6" gutterBottom>
//                       {employee.name}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary">
//                       📞 {employee.phone}
//                     </Typography>
//                     <Typography variant="body2" color="textSecondary" mb={2}>
//                       💼 {employee.designation}
//                     </Typography>
//                     <Button
//                       variant="contained"
//                       size="small"
//                       component={Link}
//                       to={`/employee/${employee._id}`}
//                     >
//                       View Profile
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Box>
//     </Layout>
//   );
// };

// export default EmployeesListPage;
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  Skeleton,
  Alert,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from './layout';
import PersonIcon from '@mui/icons-material/Person';

const EmployeesListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const managerId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`/api/employees/list?managerId=${managerId}`);
        setEmployees(response.data.data);
      } catch (error) {
        setError('Failed to load employee data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <Layout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          minHeight: '100vh',
          backgroundColor: (theme) => theme.palette.background.default,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          color="primary"
        >
          Employee Directory
        </Typography>

        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={200} />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {employees.map((employee) => (
              <Grid item xs={12} sm={6} md={4} key={employee._id}>
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: 4,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 72,
                        height: 72,
                        margin: '0 auto',
                        mb: 2,
                      }}
                    >
                      <PersonIcon fontSize="large" />
                    </Avatar>

                    <Typography variant="h6" gutterBottom>
                      {employee.name}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Designation: <strong>{employee.designation}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phone: <strong>{employee.phone}</strong>
                    </Typography>

                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 2, textTransform: 'none' }}
                      component={Link}
                      to={`/employee/${employee._id}`}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Layout>
  );
};

export default EmployeesListPage;
