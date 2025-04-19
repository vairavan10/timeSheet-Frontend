// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   List,
//   ListItem,
//   Paper,
//   Alert,
//   Container,
// } from '@mui/material';
// import axios from 'axios';
// import SideMenu from './sidebar';
// import Layout from './layout';

// const ExtraActivityPage = () => {
//   const [activityName, setActivityName] = useState('');
//   const [activities, setActivities] = useState([]);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const fetchActivities = async () => {
//     try {
//       const res = await axios.get('api/extra-activities');
//       setActivities(res.data);
//     } catch (err) {
//       console.error('Error fetching activities', err);
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   const handleAddActivity = async () => {
//     if (!activityName.trim()) {
//       setError('Activity name is required');
//       return;
//     }
  
//     try {
//       const user = JSON.parse(localStorage.getItem('user'));
//       const createdBy = user?.id;
  
//       const res = await axios.post(
//         'api/extra-activities',
//         {
//           name: activityName,
//           createdBy: createdBy,
//         }
//       );
  
//       setMessage('✅ Activity added successfully!');
//       setError('');
//       setActivityName('');
//       fetchActivities();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Error adding activity');
//       setMessage('');
//     }
//   };
  

//   return (
//    <Layout>
//   <Box sx={{ display: 'flex' }}>
//     {/* <SideMenu /> */}
    
//     <Box
//       component="main"
//       sx={{
//         flexGrow: 1,
//         p: 1,
//         backgroundColor: 'background.default',
//         minHeight: '100vh',
//         pl: { xs: 0, sm: '-10x' }, // Same as dashboard for consistency
//         overflowX: 'hidden',
//         overflowY: 'auto'
//       }}
//     >
//       <Container maxWidth="sm" sx={{ mt: 6 }}>
//         <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
//           <Typography variant="h5" gutterBottom align="center">
//             ➕ Add Extra Activity
//           </Typography>

//           <TextField
//             fullWidth
//             label="Activity Name"
//             value={activityName}
//             onChange={(e) => setActivityName(e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <Button fullWidth variant="contained" onClick={handleAddActivity}>
//             Add Activity
//           </Button>

//           {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
//           {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

//           <Box sx={{ mt: 4 }}>
//             <Typography variant="h6">📋 Existing Activities:</Typography>
//             <List>
//               {activities.map((activity) => (
//                 <ListItem key={activity._id}>• {activity.name}</ListItem>
//               ))}
//             </List>
//           </Box>
//         </Paper>
//       </Container>
//     </Box>
//   </Box>
//   </Layout>
//   );
// };

// export default ExtraActivityPage;
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Paper,
  Alert,
  Divider,
  Container,
} from '@mui/material';
import axios from 'axios';
import Layout from './layout';

const ExtraActivityPage = () => {
  const [activityName, setActivityName] = useState('');
  const [activities, setActivities] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchActivities = async () => {
    try {
      const res = await axios.get('api/extra-activities');
      setActivities(res.data);
    } catch (err) {
      console.error('Error fetching activities', err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleAddActivity = async () => {
    if (!activityName.trim()) {
      setError('Activity name is required');
      setMessage('');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const createdBy = user?.id;

      const res = await axios.post('api/extra-activities', {
        name: activityName,
        createdBy: createdBy,
      });

      setMessage('✅ Activity added successfully!');
      setError('');
      setActivityName('');
      fetchActivities();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding activity');
      setMessage('');
    }
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            px: 3,
            pt: 4,
            pb: 8,
            minHeight: '100vh',
            backgroundColor: '#f6f8fa',
          }}
        >
          <Container maxWidth="md">
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: '1px solid #d0d7de',
                borderRadius: 2,
                backgroundColor: '#ffffff',
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Add Extra Activity
              </Typography>

              <TextField
                fullWidth
                label="Activity Name"
                variant="outlined"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                onClick={handleAddActivity}
                sx={{ mb: 2, textTransform: 'none' }}
              >
                Add Activity
              </Button>

              {message && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                Existing Activities
              </Typography>

              <List dense>
                {activities.length === 0 ? (
                  <Typography color="text.secondary">No activities yet.</Typography>
                ) : (
                  activities.map((activity) => (
                    <ListItem
                      key={activity._id}
                      sx={{
                        px: 1,
                        py: 0.5,
                        fontSize: '0.95rem',
                        borderBottom: '1px solid #eaecef',
                        '&:hover': {
                          backgroundColor: '#f6f8fa',
                        },
                      }}
                    >
                      • {activity.name}
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
};

export default ExtraActivityPage;
