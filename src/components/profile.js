import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaBriefcase,
  FaCalendarAlt,
  FaUsersCog,
  FaLaptopCode,
} from "react-icons/fa";
import Layout from "./layout";
import { Box, Typography, Paper, Avatar, useTheme, Fade, Grid } from "@mui/material";

const Profile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchEmployee = async () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        setError("No employee ID found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`api/employees/${userData.id}`);
        if (response.status === 200) {
          setEmployee(response.data);
        } else {
          setError("Employee not found.");
        }
      } catch (error) {
        setError("Error fetching employee data.");
      }
      setLoading(false);
    };

    fetchEmployee();
  }, []);

  if (loading) return <Typography sx={{ textAlign: "center", mt: 4 }}>Loading employee data...</Typography>;
  if (error) return <Typography sx={{ textAlign: "center", mt: 4 }}>{error}</Typography>;

  const formattedJoiningDate = new Date(employee.joiningDate).toLocaleDateString("en-GB");

  return (
    <Layout>
      <Box
        sx={{
          backgroundColor: "background.default",
          color: "text.primary",
          minHeight: "100vh",
          py: 6,
          px: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fade in timeout={700}>
          <Paper
            elevation={6}
            sx={{
              borderRadius: 4,
              p: 4,
              maxWidth: 700,
              width: "100%",
              textAlign: "center",
              backgroundColor: "background.paper",
              transition: "all 0.3s ease-in-out",
              boxShadow: theme.palette.mode === "dark" ? "0 0 30px #111" : "0 0 15px #ccc",
            }}
          >
            <Avatar
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
            />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {employee.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {employee.role}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <FaEnvelope style={{ marginRight: 8 }} />
                {employee.email}
              </Typography>
              <Typography variant="body1">
                <FaPhoneAlt style={{ marginRight: 8 }} />
                {employee.phone}
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12} sm={6}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
                  }}
                >
                  <FaBriefcase style={{ fontSize: 20, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" mt={1}>
                    Designation
                  </Typography>
                  <Typography variant="body2">{employee.designation}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
                  }}
                >
                  <FaCalendarAlt style={{ fontSize: 20, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" mt={1}>
                    Joining Date
                  </Typography>
                  <Typography variant="body2">{formattedJoiningDate}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
                  }}
                >
                  <FaUsersCog style={{ fontSize: 20, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" mt={1}>
                    Experience
                  </Typography>
                  <Typography variant="body2">{employee.experience} years</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
                  }}
                >
                  <FaLaptopCode style={{ fontSize: 20, color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" mt={1}>
                    Skills
                  </Typography>
                  <Typography variant="body2">{employee.skills.join(", ")}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Fade>
      </Box>
    </Layout>
  );
};

export default Profile;
